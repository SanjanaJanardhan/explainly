import { NextRequest, NextResponse } from "next/server";
import { generateExplainer } from "@/lib/explain";
import { checkRateLimit } from "@/lib/rateLimit";
import { classifyShape } from "@/lib/classify";
import { parseFollowUpContext } from "@/lib/followUpContext";
import type { WidgetShape } from "@/lib/types";

const MAX_QUERY_LENGTH = 300;
const VALID_SHAPES: WidgetShape[] = ["process", "network", "chart", "comparison"];

function clientKey(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
}

export async function POST(req: NextRequest) {
  const rateLimit = checkRateLimit(clientKey(req));
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment and try again." },
      { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } }
    );
  }

  let body: { query?: unknown; shape?: unknown; context?: { query?: unknown; explanation?: unknown } };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const query = typeof body.query === "string" ? body.query.trim() : "";
  if (!query) {
    return NextResponse.json({ error: "query is required" }, { status: 400 });
  }
  if (query.length > MAX_QUERY_LENGTH) {
    return NextResponse.json(
      { error: `query must be ${MAX_QUERY_LENGTH} characters or fewer` },
      { status: 400 }
    );
  }

  const shape = VALID_SHAPES.includes(body.shape as WidgetShape)
    ? (body.shape as WidgetShape)
    : classifyShape(query);

  const context = parseFollowUpContext(body.context?.query, body.context?.explanation);

  try {
    const result = await generateExplainer(query, shape, context);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[api/explain] unexpected error", err);
    return NextResponse.json(
      { error: "Failed to generate an explainer. Please try again." },
      { status: 500 }
    );
  }
}
