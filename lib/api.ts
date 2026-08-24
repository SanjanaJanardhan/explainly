import type { ExplainResponse, WidgetShape, FollowUpContext } from "./types";

export class ExplainError extends Error {}

export async function fetchExplainer(
  query: string,
  shape?: WidgetShape,
  context?: FollowUpContext
): Promise<ExplainResponse> {
  const res = await fetch("/api/explain", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, shape, context }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ExplainError(body?.error ?? `Request failed with status ${res.status}`);
  }

  return res.json();
}
