import React from 'react';

// Renders the limited inline markup used in the dictionary strings —
// <strong>...</strong> and <br/> — as real React elements, while treating all
// other text as plain (React auto-escapes it). This replaces
// dangerouslySetInnerHTML on translation content: even if a string were ever
// sourced from untrusted input, no arbitrary HTML/script could be injected,
// because only these two tags are ever emitted.
//
// Matches <strong>...</strong> (inner content recursed for nested <br/>) or a
// <br>, <br/>, <br /> break.
const TOKEN_RE = /<strong>([\s\S]*?)<\/strong>|<br\s*\/?>/gi;

export function renderRichText(input: string | null | undefined): React.ReactNode {
  if (!input) return null;

  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;
  let match: RegExpExecArray | null;

  TOKEN_RE.lastIndex = 0;
  while ((match = TOKEN_RE.exec(input)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(input.slice(lastIndex, match.index));
    }

    if (match[0].toLowerCase().startsWith('<br')) {
      nodes.push(<br key={key++} />);
    } else {
      // match[1] is the text between <strong> tags; recurse so a nested <br/>
      // still renders, and any other markup is escaped as plain text.
      nodes.push(<strong key={key++}>{renderRichText(match[1])}</strong>);
    }

    lastIndex = TOKEN_RE.lastIndex;
  }

  if (lastIndex < input.length) {
    nodes.push(input.slice(lastIndex));
  }

  return nodes;
}

// Serializes a value to a JSON string safe to embed inside a <script> element.
// JSON.stringify alone does not escape '<', so a value containing "</script>"
// (or a comment sequence) could break out of the tag. Escaping <, >, & and the
// U+2028/U+2029 line/paragraph separators to their \uXXXX forms keeps the JSON
// valid while making tag breakout impossible.
export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(
    /[<>&\u2028\u2029]/g,
    (c) => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0')
  );
}
