import React, { useRef, useEffect, useState } from 'react';

// Supported Wikipedia interwiki prefixes
const WIKI_PREFIXES = {
  'w':    'https://en.wikipedia.org/wiki/',
  'w:en': 'https://en.wikipedia.org/wiki/',
  'w:bn': 'https://bn.wikipedia.org/wiki/',
  'w:fr': 'https://fr.wikipedia.org/wiki/',
  'w:es': 'https://es.wikipedia.org/wiki/',
  'w:de': 'https://de.wikipedia.org/wiki/',
  'w:ar': 'https://ar.wikipedia.org/wiki/',
  'mw':   'https://www.mediawiki.org/wiki/',
  'q':    'https://en.wikiquote.org/wiki/',
  'q:en': 'https://en.wikiquote.org/wiki/',
  'q:bn': 'https://bn.wikiquote.org/wiki/',
  'wikt': 'https://en.wiktionary.org/wiki/',
  'b':    'https://en.wikibooks.org/wiki/',
  'n':    'https://en.wikinews.org/wiki/',
  's':    'https://en.wikisource.org/wiki/',
  'commons': 'https://commons.wikimedia.org/wiki/',
};

function resolveWikiLink(input) {
  const trimmed = input.trim();
  const colonIdx = trimmed.indexOf(':');
  if (colonIdx === -1) return null;

  // Check two-part prefix first (e.g. w:bn)
  const possibleTwo = trimmed.slice(0, colonIdx);
  const afterFirst   = trimmed.slice(colonIdx + 1);
  const colonIdx2    = afterFirst.indexOf(':');

  if (colonIdx2 !== -1) {
    const twoPrefix = possibleTwo + ':' + afterFirst.slice(0, colonIdx2);
    const article   = afterFirst.slice(colonIdx2 + 1);
    if (WIKI_PREFIXES[twoPrefix] && article) {
      return WIKI_PREFIXES[twoPrefix] + encodeURIComponent(article.replace(/ /g, '_'));
    }
  }

  // Single prefix (e.g. w, mw, q)
  const onePrefix = possibleTwo;
  const article   = afterFirst;
  if (WIKI_PREFIXES[onePrefix] && article) {
    return WIKI_PREFIXES[onePrefix] + encodeURIComponent(article.replace(/ /g, '_'));
  }

  return null;
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
              <div style={{ marginTop: 8, fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Supported: <code>w:</code> <code>w:bn:</code> <code>w:fr:</code> <code>mw:</code> <code>q:</code> <code>wikt:</code> <code>b:</code> <code>n:</code> <code>s:</code> <code>commons:</code>
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