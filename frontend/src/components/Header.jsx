import React, { useState, useEffect, useRef } from 'react';

function Header({ wikiUser, onLogin, onLogout, lang, onChangeLanguage, T, translations }) {
  const [showMenu, setShowMenu] = useState(false);
  const [availableLangs, setAvailableLangs] = useState([
    { code: 'en', name: 'English' },
    { code: 'bn', name: 'বাংলা' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
  ]);
  const menuRef = useRef(null);

  useEffect(() => {
    fetch('/api/usr-lang')
      .then(r => r.json())
      .then(d => { if (d.status === 'success') setAvailableLangs(d.languages.map(l => ({ code: l.code, name: l.name }))); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handler = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const displayName = wikiUser?.name || wikiUser?.username || '';

  return (
    <header style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: 'var(--shadow-sm)', position: 'sticky', top: 0, zIndex: 100, width: '100%', boxSizing: 'border-box' }}>
      <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
          <path d="M6 3C4.34 3 3 4.34 3 6V26C3 27.66 4.34 29 6 29H26C27.66 29 29 27.66 29 26V6C29 4.34 27.66 3 26 3H6Z" fill="#3366cc"/>
          <path d="M9 10L12 21L15 13L18 21L21 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="23" cy="23" r="5" fill="#00af89"/>
          <path d="M21 23L22.5 24.5L25 21.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <strong style={{ fontSize: '18px', color: 'var(--text-primary)', fontFamily: 'inherit' }}>
          {T('app_name')}
        </strong>
      </a>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <select aria-label="Select language" value={lang} onChange={e => onChangeLanguage(e.target.value)}
          style={{ padding: '5px 8px', border: '1px solid var(--border)', borderRadius: '6px', background: 'var(--surface)', color: 'var(--text-primary)', fontSize: '13px', cursor: 'pointer' }}>
          {availableLangs.map(l => (
            <option key={l.code} value={l.code}>{l.name}</option>
          ))}
        </select>

        <div ref={menuRef} style={{ position: 'relative' }}>
          <button aria-label={wikiUser ? 'Account menu' : 'Login menu'} onClick={() => setShowMenu(s => !s)}
            style={{ background: wikiUser ? '#eaf3ff' : 'var(--bg)', border: '1px solid var(--border)', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={wikiUser ? '#3366cc' : 'var(--text-secondary)'} strokeWidth="2" strokeLinecap="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </button>

          {wikiUser && (
            <span className="header-username" style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: '500', marginRight: '4px' }}>
              {T('header_greeting', { name: displayName })}
            </span>
          )}

          {showMenu && (
            <div style={{ position: 'absolute', right: 0, top: '44px', background: 'var(--surface)', border: '1px solid var(--border-light)', borderRadius: '10px', boxShadow: 'var(--shadow-lg)', minWidth: '200px', zIndex: 200, overflow: 'hidden' }}>
              {wikiUser ? (
                <>
                  <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-light)' }}>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>{displayName}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{T('wiki_account')}</div>
                  </div>
                  <button onClick={() => { onLogout(); setShowMenu(false); }}
                    style={{ width: '100%', padding: '12px 16px', border: 'none', background: 'none', textAlign: 'left', fontSize: '14px', color: '#d92d20', cursor: 'pointer', fontFamily: 'inherit', fontWeight: '500' }}>
                    {T('header_logout')}
                  </button>
                </>
              ) : (
                <button onClick={() => { onLogin(); setShowMenu(false); }}
                  style={{ width: '100%', padding: '12px 16px', border: 'none', background: 'none', textAlign: 'left', fontSize: '14px', color: '#3366cc', cursor: 'pointer', fontFamily: 'inherit', fontWeight: '600' }}>
                  {T('header_login')}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
