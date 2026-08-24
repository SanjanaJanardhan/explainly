import type { WidgetShape } from "./types";

// Trusted, hardcoded SVG used for the static-fallback outcome — never LLM
// output, safe to render via dangerouslySetInnerHTML through WidgetFrame.
export const STATIC_FALLBACK_SVG = `
    <svg viewBox="0 0 640 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Generic placeholder diagram">
      <rect x="220" y="80" width="200" height="100" rx="12" style="fill:var(--color-surface);stroke:var(--color-border)" />
      <circle cx="270" cy="130" r="10" style="fill:var(--color-accent)" />
      <line x1="300" y1="115" x2="380" y2="115" style="stroke:var(--color-border);stroke-width:2" />
      <line x1="300" y1="130" x2="380" y2="130" style="stroke:var(--color-border);stroke-width:2" />
      <line x1="300" y1="145" x2="360" y2="145" style="stroke:var(--color-border);stroke-width:2" />
    </svg>
  `;

export const exampleQueries: { label: string; shape: WidgetShape }[] = [
  { label: "Photosynthesis", shape: "process" },
  { label: "Raft consensus", shape: "network" },
  { label: "Compound interest", shape: "chart" },
  { label: "TCP vs UDP", shape: "comparison" },
];
