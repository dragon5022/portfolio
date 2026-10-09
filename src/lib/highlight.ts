/* Tiny regex-based syntax highlighter for Java, Python and Markdown.
   Returns HTML with <span class="tk-*"> tokens; input is escaped. */

type Rule = [RegExp, string];

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const JAVA: Rule[] = [
  [/\/\/.*|\/\*[\s\S]*?\*\//y, "tk-cm"],
  [/"(?:\\.|[^"\\])*"/y, "tk-str"],
  [/@\w+/y, "tk-ann"],
  [/\b(?:if|else|for|while|do|switch|case|break|continue|return|try|catch|finally|throw|throws|new|instanceof|default|yield)\b/y, "tk-ctl"],
  [/\b(?:package|import|public|private|protected|final|class|record|interface|enum|static|void|this|super|var|extends|implements|null|true|false|int|long|double|boolean|char|byte|float|short|synchronized|abstract|sealed|permits|non-sealed)\b/y, "tk-kw"],
  [/\b[A-Z][A-Za-z0-9_]*\b/y, "tk-ty"],
  [/\b\d[\d_]*(?:\.\d+)?(?:[eE][+-]?\d+)?[LlFfDd]?\b/y, "tk-num"],
  [/\b[a-z_]\w*(?=\s*\()/y, "tk-fn"],
];

const PYTHON: Rule[] = [
  [/#.*/y, "tk-cm"],
  [/[rRfFbB]{0,2}(?:"""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*')/y, "tk-str"],
  [/@\w[\w.]*/y, "tk-ann"],
  [/\b(?:if|elif|else|for|while|in|return|try|except|finally|raise|with|as|yield|await|pass|break|continue|assert|del|import|from)\b/y, "tk-ctl"],
  [/\b(?:def|class|not|and|or|is|None|True|False|async|lambda|global|nonlocal)\b/y, "tk-kw"],
  [/\bself\b/y, "tk-self"],
  [/\b[A-Z][A-Za-z0-9_]*\b/y, "tk-ty"],
  [/\b\d[\d_]*(?:\.\d+)?(?:[eE][+-]?\d+)?\b/y, "tk-num"],
  [/\b[a-z_]\w*(?=\s*\()/y, "tk-fn"],
];

const MD: Rule[] = [
  [/^#{1,6} .*$/my, "tk-h"],
  [/\*\*[^*\n]+\*\*/y, "tk-b"],
  [/`[^`\n]+`/y, "tk-code"],
  [/^\s*[-*] /my, "tk-kw"],
];

const RULES: Record<string, Rule[]> = { java: JAVA, python: PYTHON, md: MD };

export function highlight(code: string, lang: string): string {
  const rules = RULES[lang];
  if (!rules) return esc(code);
  let out = "";
  let i = 0;
  let plain = "";
  const flush = () => { if (plain) { out += esc(plain); plain = ""; } };

  while (i < code.length) {
    let matched = false;
    for (const [re, cls] of rules) {
      re.lastIndex = i;
      const m = re.exec(code);
      if (m && m.index === i && m[0].length > 0) {
        flush();
        out += `<span class="${cls}">${esc(m[0])}</span>`;
        i += m[0].length;
        matched = true;
        break;
      }
    }
    if (!matched) {
      // consume a whole identifier at once so keywords inside words never match
      const word = /[A-Za-z_]\w*/y;
      word.lastIndex = i;
      const wm = word.exec(code);
      if (wm && wm.index === i) { plain += wm[0]; i += wm[0].length; }
      else { plain += code[i]; i++; }
    }
  }
  flush();
  return out;
}
