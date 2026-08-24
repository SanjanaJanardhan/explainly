import type { FollowUpContext } from "./types";

const MAX_QUERY_LENGTH = 300;
const MAX_EXPLANATION_LENGTH = 1000;

// Shared by the API route (validating the request body) and the result page
// (validating URL params) so a malformed/oversized value is silently treated
// as "no context" in both places, rather than erroring — context is an
// enhancement to a follow-up, not something the request should fail without.
export function parseFollowUpContext(rawQuery: unknown, rawExplanation: unknown): FollowUpContext | undefined {
  if (typeof rawQuery !== "string" || typeof rawExplanation !== "string") {
    return undefined;
  }

  const query = rawQuery.trim();
  const explanation = rawExplanation.trim();

  if (!query || !explanation) return undefined;
  if (query.length > MAX_QUERY_LENGTH || explanation.length > MAX_EXPLANATION_LENGTH) return undefined;

  return { query, explanation };
}
