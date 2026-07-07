import React, { useState } from 'react';

function WelcomeScreen({ onSelectType, lang, T }) {
  const [step, setStep] = useState('intro');

  const Logo = ({ size = 72 }) => (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 8px 16px rgba(51,102,204,0.2))' }}>
      <path d="M6 3C4.34 3 3 4.34 3 6V26C3 27.66 4.34 29 6 29H26C27.66 29 29 27.66 29 26V6C29 4.34 27.66 3 26 3H6Z" fill="#3366cc"/>
      <path d="M9 10L12 21L15 13L18 21L21 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="23" cy="23" r="5" fill="#00af89"/>
      <path d="M21 23L22.5 24.5L25 21.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  return (
    <div className="welcome-wrapper">
      {step === 'intro' && (
        <div className="welcome-card">
          <span className="welcome-badge">{T('welcome_badge')}</span>
          <div style={{ margin: '24px auto 20px' }}><Logo /></div>
          <h1 className="welcome-title">{T('welcome_title')}</h1>
          <hr className="welcome-divider" />
          <p className="welcome-desc">{T('welcome_desc')}</p>
          <button onClick={() => setStep('select')} className="wiki-btn welcome-cta">{T('welcome_start')}</button>
        </div>
      )}

      {step === 'select' && (
        <div className="select-wrapper">
          <h2 className="select-title">{T('build_title')}</h2>
          <p className="select-desc">{T('build_desc')}</p>
          <div className="select-grid">
            <div className="type-card type-card--form" onClick={() => onSelectType('form')}>
              <div className="type-icon-wrap type-icon-wrap--blue">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3366cc" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="8" y1="8" x2="16" y2="8"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="16" x2="12" y2="16"/></svg>
              </div>
              <h3 style={{ color: '#3366cc' }}>{T('form_title')}</h3>
              <p>{T('form_desc')}</p>
            </div>
            <div className="type-card type-card--quiz" onClick={() => onSelectType('quiz')}>
              <div className="type-icon-wrap type-icon-wrap--green">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00af89" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 3"/></svg>
              </div>
              <h3 style={{ color: '#00af89' }}>{T('quiz_title')}</h3>
              <p>{T('quiz_desc')}</p>
            </div>
          </div>
          <button onClick={() => setStep('intro')} className="wiki-btn-secondary" style={{ marginTop: '32px', padding: '8px 20px' }}>{T('back_intro')}</button>
        </div>
      )}
    </div>
  );
}

export default WelcomeScreen;
