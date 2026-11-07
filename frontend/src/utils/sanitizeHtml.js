// Minimal allowlist HTML sanitizer for rich text written by form authors.
//
// Question text and feedback are stored as HTML (see RichTextEditor) and rendered with
// dangerouslySetInnerHTML for every visitor. Anyone can create a form, so without this a
// malicious form runs script in the browser of everyone who opens it, including logged-in
// users whose login token is kept in localStorage.
//
// Only the formatting the editor can produce is kept. Everything else is unwrapped
// (tags removed, text kept) or dropped (script/style/etc. with their content).

const ALLOWED_TAGS = new Set([
  'B', 'STRONG', 'I', 'EM', 'U', 'S', 'STRIKE', 'DEL', 'SUB', 'SUP', 'MARK', 'SMALL',
  'BR', 'P', 'DIV', 'SPAN', 'UL', 'OL', 'LI', 'BLOCKQUOTE', 'PRE', 'CODE',
  'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'HR', 'FONT', 'A',
]);
const DROP_WITH_CONTENT = new Set([
  'SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED', 'NOSCRIPT', 'TEMPLATE', 'SVG', 'MATH',
  'FORM', 'INPUT', 'BUTTON', 'TEXTAREA', 'SELECT', 'LINK', 'META', 'BASE', 'TITLE',
]);
const ALLOWED_STYLE_PROPS = new Set([
  'color', 'background-color', 'font-weight', 'font-style', 'text-decoration',
  'text-align', 'font-size', 'font-family',
]);
const SAFE_VALUE = /^[#\w\s.,%()-]+$/; // no url(), quotes, backslashes, or expressions
const SAFE_HREF = /^(https?:|mailto:)/i;

function cleanStyle(value) {
  return value
    .split(';')
    .map(d => d.split(':'))
    .filter(([prop, ...rest]) => {
      const v = rest.join(':').trim();
      return prop && ALLOWED_STYLE_PROPS.has(prop.trim().toLowerCase()) && SAFE_VALUE.test(v) && !/url\(|expression/i.test(v);
    })
    .map(([prop, ...rest]) => `${prop.trim()}: ${rest.join(':').trim()}`)
    .join('; ');
}

function cleanNode(node, doc) {
  for (const child of Array.from(node.childNodes)) {
    if (child.nodeType === 3) continue; // text
    if (child.nodeType !== 1) { child.remove(); continue; } // comments, etc.

    const tag = child.tagName.toUpperCase();
    if (DROP_WITH_CONTENT.has(tag)) { child.remove(); continue; }

    cleanNode(child, doc); // sanitize descendants first

    if (!ALLOWED_TAGS.has(tag)) {
      // Unknown tag: keep its (already sanitized) children, drop the element itself.
      while (child.firstChild) node.insertBefore(child.firstChild, child);
      child.remove();
      continue;
    }

    for (const attr of Array.from(child.attributes)) {
      const name = attr.name.toLowerCase();
      if (name === 'style') {
        const cleaned = cleanStyle(attr.value);
        if (cleaned) child.setAttribute('style', cleaned); else child.removeAttribute('style');
      } else if (name === 'href' && tag === 'A' && SAFE_HREF.test(attr.value.trim())) {
        continue;
      } else if ((name === 'color' || name === 'size' || name === 'face') && tag === 'FONT' && SAFE_VALUE.test(attr.value)) {
        continue;
      } else {
        child.removeAttribute(attr.name);
      }
    }
    if (tag === 'A') {
      child.setAttribute('target', '_blank');
      child.setAttribute('rel', 'noopener noreferrer nofollow');
    }
  }
}

export function sanitizeHtml(html) {
  if (html == null || html === '') return '';
  const doc = new DOMParser().parseFromString(`<body>${String(html)}</body>`, 'text/html');
  cleanNode(doc.body, doc);
  return doc.body.innerHTML;
}

export default sanitizeHtml;
