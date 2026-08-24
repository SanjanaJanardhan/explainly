import { getAnthropicClient, EXPLAIN_MODEL } from "./anthropic";
import { systemPromptForShape, EMIT_EXPLAINER_TOOL } from "./prompts";
import { validateWidgetHtml } from "./validateWidget";
import { getMockExplainer } from "./mockWidgets";
import { STATIC_FALLBACK_SVG } from "./staticContent";
import type { ExplainResponse, WidgetShape, FollowUpContext } from "./types";

const USE_MOCK = !process.env.ANTHROPIC_API_KEY?.trim();

type RawGeneration = { explanation: string; widget_html: string };

// Thrown for a malformed-but-recoverable response (missing tool call, wrong
// field types) — treated the same as a validation failure: worth one retry,
// as opposed to a genuine API/network error, which isn't.
class SoftGenerationError extends Error {}

function buildUserMessage(query: string, context?: FollowUpContext, retryReason?: string): string {
  const parts: string[] = [];

  if (context) {
    parts.push(`The user previously asked: "${context.query}"`);
    parts.push(`They received this explanation: "${context.explanation}"`);
    parts.push(
      `They now have a follow-up question: "${query}". Generate a new widget and explanation for this follow-up, building on the prior context where relevant.`
    );
  } else {
    parts.push(`Concept: "${query}"`);
  }

  if (retryReason) {
    parts.push(
      `Your previous attempt was rejected: ${retryReason}. Regenerate widget_html following every constraint in the system prompt exactly.`
    );
  }

  return parts.join("\n\n");
}

async function callClaude(
  query: string,
  shape: WidgetShape,
  context?: FollowUpContext,
  retryReason?: string
): Promise<RawGeneration> {
  const client = getAnthropicClient();

  const response = await client.messages.create({
    model: EXPLAIN_MODEL,
    max_tokens: 4096,
    temperature: 0.5,
    system: systemPromptForShape(shape),
    tools: [EMIT_EXPLAINER_TOOL],
    tool_choice: { type: "tool", name: EMIT_EXPLAINER_TOOL.name },
    messages: [{ role: "user", content: buildUserMessage(query, context, retryReason) }],
  });

  const toolUse = response.content.find((block) => block.type === "tool_use");
  if (!toolUse || toolUse.type !== "tool_use") {
    throw new SoftGenerationError("response did not include the expected tool call");
  }

  const input = toolUse.input as Record<string, unknown>;
  if (typeof input.explanation !== "string" || !input.explanation.trim()) {
    throw new SoftGenerationError("explanation field was missing or empty");
  }
  if (typeof input.widget_html !== "string" || !input.widget_html.trim()) {
    throw new SoftGenerationError("widget_html field was missing or empty");
  }

  return { explanation: input.explanation, widget_html: input.widget_html };
}

export async function generateExplainer(
  query: string,
  shape: WidgetShape = "chart",
  context?: FollowUpContext
): Promise<ExplainResponse> {
  if (USE_MOCK) {
    return getMockExplainer(query, shape, context);
  }

  let lastExplanation: string | undefined;
  let retryReason: string | undefined;

  for (let attempt = 0; attempt < 2; attempt++) {
    let raw: RawGeneration;
    try {
      raw = await callClaude(query, shape, context, retryReason);
    } catch (err) {
      if (err instanceof SoftGenerationError) {
        console.warn(`[explain] malformed response for "${query}" (attempt ${attempt + 1}): ${err.message}`);
        retryReason = err.message;
        continue;
      }
      console.error(`[explain] generation call failed (attempt ${attempt + 1})`, err);
      break;
    }

    lastExplanation = raw.explanation;
    const result = validateWidgetHtml(raw.widget_html);

    if (result.valid) {
      return {
        query,
        explanation: raw.explanation,
        widgetType: shape,
        widgetHtml: raw.widget_html,
      };
    }

    console.warn(`[explain] validation failed for "${query}" (attempt ${attempt + 1}): ${result.reason}`);
    retryReason = result.reason;
  }

  if (lastExplanation) {
    return {
      query,
      explanation: lastExplanation,
      widgetType: "static-fallback",
      widgetSvg: STATIC_FALLBACK_SVG,
    };
  }

  return {
    query,
    explanation: "Something went wrong generating an explainer for this concept. Try rephrasing your question.",
    widgetType: "text-fallback",
  };
}
