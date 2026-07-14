import React, { useRef, useEffect, useState } from 'react';

// Supported Wikipedia interwiki prefixes
// Maps first parameter to base domain
const WIKI_DOMAINS = {
  'w':       'wikipedia.org',
  'q':       'wikiquote.org',
  'n':       'wikinews.org',
  's':       'wikisource.org',
  'b':       'wikibooks.org',
  'v':       'wikiversity.org',
  'voy':     'wikivoyage.org',
  't':       'wiktionary.org',
  'wikt':    'wiktionary.org',
  'mw':      'mediawiki.org',
  'meta':    'meta.wikimedia.org',
  'wd':      'wikidata.org',
  'd':       'wikidata.org',
  'commons': 'commons.wikimedia.org',
  'c':       'commons.wikimedia.org',
  'species': 'species.wikimedia.org',
  'wmf':     'wikimediafoundation.org',
  'tools':   'tools.wmflabs.org',
};

// Single-domain sites (no language prefix)
const WIKI_NO_LANG = new Set([
  'mw','meta','wd','d','commons','c','species','wmf','tools'
]);

function resolveWikiLink(input) {
  const trimmed = input.trim();
  const parts   = trimmed.split(':').map(s => s.trim()).filter(Boolean);
  if (parts.length < 2) return null;

  const site    = parts[0].toLowerCase();
  const domain  = WIKI_DOMAINS[site];
  if (!domain) return null;

  // Single-domain sites: w:Article or meta:Article
  if (WIKI_NO_LANG.has(site)) {
    const article = parts.slice(1).join(':');
    return `https://${domain}/wiki/${encodeURIComponent(article.replace(/ /g, '_'))}`;
  }

  // Multi-lang sites: w:en:Article or w:Article (defaults to en)
  if (parts.length === 2) {
    // w:Article — default lang en
    const article = parts[1];
    return `https://en.${domain}/wiki/${encodeURIComponent(article.replace(/ /g, '_'))}`;
  }

  // w:bn:Article
  const lang    = parts[1].toLowerCase();
  const article = parts.slice(2).join(':');
  return `https://${lang}.${domain}/wiki/${encodeURIComponent(article.replace(/ /g, '_'))}`;
}



function LinkModal({ onInsert, onClose }) {
  const [display, setDisplay]   = useState('');
  const [url, setUrl]           = useState('');
  const [wikiLink, setWikiLink] = useState('');
  const [tab, setTab]           = useState('url');
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const resolvedWiki = resolveWikiLink(wikiLink);

  const handleInsert = () => {
    const finalUrl = tab === 'wiki' ? resolvedWiki : url.trim();
    if (!finalUrl || !display.trim()) return;
    onInsert(display.trim(), finalUrl);
  };

  const base = { width: '100%', padding: '8px 10px', border: '1px solid var(--border)', borderRadius: 6, fontSize: 13, background: 'var(--bg)', color: 'var(--text-primary)', fontFamily: 'inherit', boxSizing: 'border-box' };
  const tabBtn = (t) => ({
    padding: '6px 14px', border: 'none', borderBottom: tab === t ? '2px solid #3366cc' : '2px solid transparent',
    background: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
    color: tab === t ? '#3366cc' : 'var(--text-secondary)',
  });

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: 'var(--surface)', borderRadius: 12, padding: 24, width: 380, boxShadow: 'var(--shadow-lg)' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>Insert Link</h3>

        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-light)', marginBottom: 16 }}>
          <button style={tabBtn('url')} onClick={() => setTab('url')}>URL</button>
          <button style={tabBtn('wiki')} onClick={() => setTab('wiki')}>Wikipedia / Wiki</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Display text</label>
            <input ref={inputRef} type="text" placeholder="Link text..." value={display} onChange={e => setDisplay(e.target.value)} style={base} />
          </div>

          {tab === 'url' ? (
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>URL</label>
              <input type="url" placeholder="https://..." value={url} onChange={e => setUrl(e.target.value)} style={base} />
            </div>
          ) : (
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                Wiki link
              </label>
              <input type="text" placeholder="e.g. w:en:Bangladesh or mw:Help:Links" value={wikiLink} onChange={e => setWikiLink(e.target.value)} style={base} />
              {wikiLink && (
                <div style={{ marginTop: 6, fontSize: 12, color: resolvedWiki ? '#00af89' : '#d92d20', wordBreak: 'break-all' }}>
                  {resolvedWiki ? `→ ${resolvedWiki}` : 'Unknown prefix — try w:en:, w:bn:, mw:, q:, wikt:, commons:'}
                </div>
              )}
                            <div style={{ marginTop: 8, fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.8 }}>
                <b>Format:</b> <code>site:article</code> or <code>site:lang:article</code><br/>
                <b>Sites:</b> <code>w</code> <code>q</code> <code>n</code> <code>s</code> <code>b</code> <code>v</code> <code>t</code> <code>mw</code> <code>meta</code> <code>commons</code> <code>wd</code><br/>
                <b>Examples:</b> <code>w:Bangladesh</code> → en.wikipedia &nbsp;|&nbsp; <code>w:bn:বাংলাদেশ</code> → bn.wikipedia &nbsp;|&nbsp; <code>q:en:Aristotle</code> → en.wikiquote
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 20, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '8px 16px', border: '1px solid var(--border)', borderRadius: 6, background: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--text-primary)' }}>Cancel</button>
          <button
            onClick={handleInsert}
            disabled={!display.trim() || (tab === 'url' ? !url.trim() : !resolvedWiki)}
            style={{ padding: '8px 16px', border: 'none', borderRadius: 6, background: '#3366cc', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600, opacity: (!display.trim() || (tab === 'url' ? !url.trim() : !resolvedWiki)) ? 0.5 : 1 }}>
            Insert
          </button>
        </div>
      </div>
    </div>
  );
}

function RichTextEditor({ value, onChange, placeholder = 'Enter text...', style = {} }) {
  const editorRef  = useRef(null);
  const [showLink, setShowLink] = useState(false);
  const savedRange = useRef(null);

  // Sync external value → DOM only on mount
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, []);

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) savedRange.current = sel.getRangeAt(0).cloneRange();
  };

  const restoreSelection = () => {
    if (!savedRange.current) return;
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(savedRange.current);
  };

  const exec = (cmd, value = null) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, value);
    onChange(editorRef.current?.innerHTML || '');
  };

  const handleInput = () => onChange(editorRef.current?.innerHTML || '');

  const handleKeyDown = (e) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'b') { e.preventDefault(); exec('bold'); }
      if (e.key === 'i') { e.preventDefault(); exec('italic'); }
      if (e.key === 'u') { e.preventDefault(); exec('underline'); }
      if (e.key === 'k') { e.preventDefault(); saveSelection(); setShowLink(true); }
    }
  };

  const handleInsertLink = (display, url) => {
    restoreSelection();
    editorRef.current?.focus();
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      range.deleteContents();
      const a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = display;
      a.style.color = '#3366cc';
      range.insertNode(a);
      range.setStartAfter(a);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    }
    onChange(editorRef.current?.innerHTML || '');
    setShowLink(false);
  };

  const toolbarBtn = (onClick, title, content) => (
    <button
      type="button"
      title={title}
      onMouseDown={e => { e.preventDefault(); onClick(); }}
      style={{ padding: '4px 8px', border: '1px solid var(--border-light)', borderRadius: 4, background: 'var(--bg)', cursor: 'pointer', fontSize: 13, color: 'var(--text-primary)', fontFamily: 'inherit', lineHeight: 1.4 }}>
      {content}
    </button>
  );

  return (
    <>
      {showLink && (
        <LinkModal
          onInsert={handleInsertLink}
          onClose={() => setShowLink(false)}
        />
      )}
      <div style={{ border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden', ...style }}>
        {/* Toolbar */}
        <div style={{ display: 'flex', gap: 4, padding: '6px 8px', borderBottom: '1px solid var(--border-light)', background: 'var(--bg)', flexWrap: 'wrap' }}>
          {toolbarBtn(() => exec('bold'),      'Bold (Ctrl+B)',      <b>B</b>)}
          {toolbarBtn(() => exec('italic'),    'Italic (Ctrl+I)',    <i>I</i>)}
          {toolbarBtn(() => exec('underline'), 'Underline (Ctrl+U)', <u>U</u>)}
          <div style={{ width: 1, background: 'var(--border-light)', margin: '0 2px' }} />
          {toolbarBtn(() => { saveSelection(); setShowLink(true); }, 'Link (Ctrl+K)', '🔗')}
          <div style={{ width: 1, background: 'var(--border-light)', margin: '0 2px' }} />
          {toolbarBtn(() => exec('removeFormat'), 'Clear formatting', '✕')}
        </div>

        {/* Editable area */}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onMouseUp={saveSelection}
          onKeyUp={saveSelection}
          data-placeholder={placeholder}
          style={{
            minHeight: 72, padding: '10px 12px', outline: 'none',
            fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.6,
            background: 'var(--surface)',
          }}
        />
      </div>
      <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: var(--text-muted);
          pointer-events: none;
        }
      `}</style>
    </>
  );
}

export default RichTextEditor;
