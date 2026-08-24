export type ValidationResult = { valid: true } | { valid: false; reason: string };

const DISALLOWED_PATTERNS: { pattern: RegExp; reason: string }[] = [
  { pattern: /<script[^>]+src=/i, reason: "external <script src> is not allowed" },
  { pattern: /\bfetch\s*\(/i, reason: "fetch() calls are not allowed" },
  { pattern: /XMLHttpRequest/i, reason: "XMLHttpRequest is not allowed" },
  { pattern: /\bWebSocket\s*\(/i, reason: "WebSocket is not allowed" },
  { pattern: /\bEventSource\s*\(/i, reason: "EventSource is not allowed" },
  { pattern: /<iframe/i, reason: "<iframe> is not allowed" },
  { pattern: /<object/i, reason: "<object> is not allowed" },
  { pattern: /<embed/i, reason: "<embed> is not allowed" },
  { pattern: /<form/i, reason: "<form> is not allowed" },
  { pattern: /<link/i, reason: "<link> is not allowed" },
  { pattern: /window\.top\b/i, reason: "access to window.top is not allowed" },
];

// window.parent is otherwise disallowed (same reasoning as window.top — a
// sandboxed iframe without allow-same-origin can't actually read/write it
// anyway), except for the one call widgets are required to make to report
// their content height back to the page. Strip known-good calls before
// checking for any other window.parent usage.
function hasDisallowedWindowParentAccess(html: string): boolean {
  const withoutHeightReports = html.replace(/window\.parent\.postMessage\s*\(/gi, "");
  return /window\.parent\b/i.test(withoutHeightReports);
}

const VOID_ELEMENTS = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input",
  "link", "meta", "param", "source", "track", "wbr",
]);

const TAG_PATTERN = /<\/?([a-zA-Z][a-zA-Z0-9-]*)\b[^>]*?(\/?)>/g;

// script/style content is "raw text" to a real HTML parser — a stray `<` or `>`
// from comparison operators in the widget's own JS must not be read as a tag.
// Strip their inner content (keeping the tags themselves) before tokenizing.
function stripRawTextContent(html: string): string {
  return html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, (match) => {
    const openTagEnd = match.indexOf(">") + 1;
    const closeTagStart = match.lastIndexOf("<");
    return match.slice(0, openTagEnd) + match.slice(closeTagStart);
  });
}

function checkUnclosedTags(html: string): ValidationResult {
  const sanitized = stripRawTextContent(html);
  const stack: string[] = [];

  TAG_PATTERN.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = TAG_PATTERN.exec(sanitized))) {
    const [full, rawName, selfClosingSlash] = match;
    const name = rawName.toLowerCase();

    if (full.startsWith("</")) {
      if (stack.length === 0 || stack[stack.length - 1] !== name) {
        return { valid: false, reason: `unexpected closing tag </${name}>` };
      }
      stack.pop();
      continue;
    }

    if (selfClosingSlash === "/" || VOID_ELEMENTS.has(name)) {
      continue;
    }

    stack.push(name);
  }

  if (stack.length > 0) {
    return { valid: false, reason: `unclosed <${stack[stack.length - 1]}> tag` };
  }

  return { valid: true };
}

export function validateWidgetHtml(html: string): ValidationResult {
  if (!html || !html.trim()) {
    return { valid: false, reason: "widget_html is empty" };
  }

  for (const { pattern, reason } of DISALLOWED_PATTERNS) {
    if (pattern.test(html)) {
      return { valid: false, reason };
    }
  }

  if (hasDisallowedWindowParentAccess(html)) {
    return { valid: false, reason: "access to window.parent is only allowed via window.parent.postMessage(...)" };
  }

  return checkUnclosedTags(html);
}
