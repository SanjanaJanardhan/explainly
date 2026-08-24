# explainly

**[Live demo →](https://explain-sigma-wine.vercel.app)**

Type a concept. Get a custom, interactive visual explainer — not a wall of text.

`explainly` sends a typed concept to Claude and gets back a self-contained interactive
widget (sliders, buttons, live redraws) plus a short plain-language explanation, rendered
live in the browser. The interesting engineering problem isn't calling an LLM — it's making
sure the LLM's output is reliably correct, safe to render, and gracefully recoverable when it
isn't.

## How it works

1. You type a concept (or click an example chip).
2. A small heuristic classifier picks one of four widget shapes for it — **process/pipeline**,
   **network/graph**, **parameterized chart**, or **comparison** — each with its own prompt
   describing that shape's interaction pattern.
3. Claude is called with a forced tool call (`emit_explainer`), guaranteeing structured
   `{ explanation, widget_html }` output rather than free-text you'd have to parse.
4. `widget_html` is validated: disallowed patterns (network calls, external scripts, disallowed
   tags) and a real unclosed-tag check via a small HTML tokenizer. A validation failure gets one
   retry with the specific reason fed back to the model; a second failure falls back to a
   trusted static diagram plus the explanation, so a bad generation degrades gracefully instead
   of showing a broken page.
5. The widget renders inside `<iframe sandbox="allow-scripts">` — no `allow-same-origin` — so
   generated code can run its own JS but cannot read cookies, call same-origin APIs, or touch
   the parent page. It reports its own content height back via `postMessage` so the card sizes
   itself to whatever the model generated.
6. One follow-up question is supported per result, with the previous query and explanation
   passed back to Claude as context.

## Mock mode

There's no `ANTHROPIC_API_KEY` configured on the live demo (keeping a public LLM-calling
endpoint free to run costs real money in API credits). Without a key, the app runs entirely
against hand-authored mock widgets instead of calling Claude — same validation, same sandboxed
rendering, same UI, just no live generation:

- **Five hand-tuned examples**: Photosynthesis (process), Raft consensus (network), Compound
  interest and Population growth (chart), TCP vs UDP (comparison).
- **Anything else** still gets a real, working widget of its classified shape — just a
  generic one, not a bespoke example — and the explanation says so explicitly rather than
  pretending it's a tailored generation.

Add a real `ANTHROPIC_API_KEY` (in `.env.local` locally, or as an environment variable on
Vercel) and the exact same code path switches to live Claude generation for arbitrary
concepts — no other change needed.

## Stack

Next.js (App Router) + TypeScript, plain CSS with CSS variables (no component library),
`@anthropic-ai/sdk`, deployed on Vercel.

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Runs in mock mode by default; to enable
live generation, create `.env.local`:

```bash
ANTHROPIC_API_KEY=sk-ant-...
```

## Project structure

```
app/
  page.tsx              landing page
  result/page.tsx        result page (reads ?q=&shape=&prevQ=&prevExplanation=)
  api/explain/route.ts   generation endpoint: rate limit → classify → generate → validate
components/              SearchInput, ExampleChips, WidgetIframe, ResultView, ...
lib/
  prompts.ts              per-shape system prompts
  explain.ts              orchestrates generation, retry, fallback
  validateWidget.ts        disallowed-pattern + unclosed-tag validation
  classify.ts              heuristic shape classifier
  mockWidgets.ts            hand-authored fallback widgets for mock mode
```

## What's not built (by design, v1 scope)

No accounts, no database, no permalinks, no arbitrary widget shapes beyond the four above —
all deliberately deferred per the project's own MVP scope. See the spec this was built against
for the full stretch-goal list.
