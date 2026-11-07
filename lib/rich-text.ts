// Tiny, safe formatting for Girl Talk articles. Output is plain data rendered by React (no raw HTML),
// so nothing typed in the admin can inject scripts.
//   ## Heading   ### Smaller heading   - list item   **bold**   *italic*   [link text](https://...)
//   An empty line starts a new paragraph; a single line break stays a line break.

export type Inline = { t: "text" | "b" | "i"; v: string } | { t: "a"; v: string; href: string };
export type Block =
  | { t: "h2"; v: Inline[] }
  | { t: "h3"; v: Inline[] }
  | { t: "p"; lines: Inline[][] }
  | { t: "ul"; items: Inline[][] };

const SAFE_HREF = /^(https?:\/\/|mailto:)/i;

export function parseInline(src: string): Inline[] {
  const out: Inline[] = [];
  const re = /\*\*(.+?)\*\*|\*(.+?)\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0;
  for (let m; (m = re.exec(src)); ) {
    if (m.index > last) out.push({ t: "text", v: src.slice(last, m.index) });
    if (m[1] != null) out.push({ t: "b", v: m[1] });
    else if (m[2] != null) out.push({ t: "i", v: m[2] });
    else if (SAFE_HREF.test(m[4])) out.push({ t: "a", v: m[3], href: m[4] });
    else out.push({ t: "text", v: m[0] }); // unsafe link (e.g. javascript:) stays as plain text
    last = re.lastIndex;
  }
  if (last < src.length) out.push({ t: "text", v: src.slice(last) });
  return out;
}

export function parseRichText(body: string): Block[] {
  return body
    .replace(/\r\n/g, "\n")
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean)
    .map((b): Block => {
      if (b.startsWith("### ")) return { t: "h3", v: parseInline(b.slice(4)) };
      if (b.startsWith("## ")) return { t: "h2", v: parseInline(b.slice(3)) };
      const lines = b.split("\n");
      if (lines.every((l) => /^\s*[-•]\s+/.test(l)))
        return { t: "ul", items: lines.map((l) => parseInline(l.replace(/^\s*[-•]\s+/, ""))) };
      return { t: "p", lines: lines.map(parseInline) };
    });
}
