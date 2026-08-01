import React, { useState, useEffect, useRef } from 'react';
import Icon from './Icon.jsx';

function Header({ wikiUser, onLogin, onLogout, lang, onChangeLanguage, T, translations }) {
  const [showMenu, setShowMenu]     = useState(false);
  const [showBanner, setShowBanner] = useState(!localStorage.getItem('wf-banner-dismissed'));
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

  const handleDismissBanner = () => {
    localStorage.setItem('wf-banner-dismissed', 'true');
    setShowBanner(false);
  };

  const displayName = wikiUser?.name || wikiUser?.username || '';

  return (
    <div className="wf-header-root">
      {showBanner && (
        <div className="wf-banner">
          <span className="wf-banner__text">
            {T('banner_message') || '🚀 Welcome to WikiForms! Create, manage, and share forms natively within the Wikimedia ecosystem.'}
          </span>
          <button className="wf-banner__close" onClick={handleDismissBanner} aria-label="Dismiss banner">×</button>
        </div>
      )}

      <header className="wf-header">
        <a href="/" className="wf-header__brand">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <path d="M6 3C4.34 3 3 4.34 3 6V26C3 27.66 4.34 29 6 29H26C27.66 29 29 27.66 29 26V6C29 4.34 27.66 3 26 3H6Z" fill="#3366cc"/>
            <path d="M9 10L12 21L15 13L18 21L21 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="23" cy="23" r="5" fill="#00af89"/>
            <path d="M21 23L22.5 24.5L25 21.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <strong className="wf-header__brand-name">{T('app_name')}</strong>
        </a>

        <div className="wf-header__controls">
          <select aria-label="Select language" value={lang} onChange={e => onChangeLanguage(e.target.value)} className="wf-lang-select">
            {availableLangs.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
          </select>

          <div ref={menuRef} className="wf-user-menu">
            {wikiUser && <span className="wf-header__username">{T('header_greeting', { name: displayName })}</span>}
            <button aria-label={wikiUser ? 'Account menu' : 'Login menu'} onClick={() => setShowMenu(s => !s)} className={`wf-avatar-btn${wikiUser ? ' wf-avatar-btn--active' : ''}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={wikiUser ? '#3366cc' : 'var(--color-base--subtle)'} strokeWidth="2" strokeLinecap="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </button>

            {showMenu && (
              <div className="wf-dropdown">
                {wikiUser ? (
                  <>
                    <div className="wf-dropdown__header">
                      <div className="wf-dropdown__name">{displayName}</div>
                      <div className="wf-dropdown__sub">{T('wiki_account')}</div>
                    </div>
                    <a href="/my-forms" className="wf-dropdown__item"><Icon name='forms' size={14} />My Forms</a>
                    <a href="/contribute" className="wf-dropdown__item"><Icon name='globe' size={14} />{T('contribute')}</a>
                    <div className="wf-dropdown__divider" />
                    <button onClick={() => { onLogout(); setShowMenu(false); }} className="wf-dropdown__item wf-dropdown__item--danger">
                      <Icon name='logout' size={14} color='#d92d20'/>{T('header_logout')}
                    </button>
                  </>
                ) : (
                  <button onClick={() => { onLogin(); setShowMenu(false); }} className="wf-dropdown__item wf-dropdown__item--login">
                    {T('header_login')}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}

export default Header;
