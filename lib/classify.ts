import type { WidgetShape } from "./types";

// A fast, free heuristic — not true semantic classification. Checks a small
// table of known concepts first, then falls back to keyword/phrase patterns.
// A lookup table alone misses novel concepts; keyword patterns alone miss
// bare concept names with no indicative phrasing (e.g. "Photosynthesis"
// contains no signal words). Combining both covers meaningfully more of the
// realistic query space than either alone. Swapping this for a real
// classification LLM call is a natural upgrade once there's API budget.

const KNOWN_CONCEPTS: Record<string, WidgetShape> = {
  photosynthesis: "process",
  mitosis: "process",
  meiosis: "process",
  "cellular respiration": "process",
  digestion: "process",
  "protein synthesis": "process",
  "cpu pipelining": "process",
  "water cycle": "process",

  "raft consensus": "network",
  "raft leader election": "network",
  paxos: "network",
  "gossip protocol": "network",
  "bgp routing": "network",
  "social network spread": "network",
  "byzantine fault tolerance": "network",
  "distributed consensus": "network",

  "tcp vs udp": "comparison",
  "mitosis vs meiosis": "comparison",
  "sql vs nosql": "comparison",
  "stack vs queue": "comparison",
  "list vs array": "comparison",
  "monolith vs microservices": "comparison",
  "git merge vs rebase": "comparison",

  "compound interest": "chart",
  "population growth": "chart",
  "radioactive decay": "chart",
  "exponential growth": "chart",
  "moores law": "chart",
  inflation: "chart",
};

const COMPARISON_PATTERN = /\bvs\.?\b|\bversus\b|\bcompar(e|ing|ison)\b|\bdifferences? between\b/i;
const NETWORK_PATTERN = /\bnetworks?(ing)?\b|\bgraph\b|\bconsensus\b|\belection\b|\bprotocol\b|\bpropagat|\bspreads?\b|\bnodes?\b|\bdistributed\b|\bpeers?\b|\bcluster\b|\brouting\b/i;
const CHART_PATTERN = /\bgrowth\b|\binterest\b|\brate\b|\bdecay\b|\bpopulation\b|\bexponential\b|\btrend\b|\bover time\b|\bcompound|\binflation\b/i;
const PROCESS_PATTERN = /\bsteps?\b|\bstages?\b|\bcycle\b|\blifecycle\b|\bpipeline\b|\bworkflow\b|\bphases?\b|\bhow (does|do) .+ work\b/i;

export function classifyShape(query: string): WidgetShape {
  const normalized = query.trim().toLowerCase();

  const known = KNOWN_CONCEPTS[normalized];
  if (known) return known;

  if (COMPARISON_PATTERN.test(normalized)) return "comparison";
  if (NETWORK_PATTERN.test(normalized)) return "network";
  if (CHART_PATTERN.test(normalized)) return "chart";
  if (PROCESS_PATTERN.test(normalized)) return "process";

  return "chart";
}
