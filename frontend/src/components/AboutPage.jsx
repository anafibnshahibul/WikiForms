import React from 'react';

function AboutPage({ T, lang }) {
  const features = [
    ['lock', T('feat_login_title') || 'Wikipedia Login', T('feat_login_desc') || 'One-click login with your existing Wikipedia account.'],
    ['clipboard', T('feat_builder_title') || 'Drag & Drop Builder', T('feat_builder_desc') || 'Multiple question types, sections, and custom options.'],
    ['globe', T('feat_multilang_title') || 'Multilingual', T('feat_multilang_desc') || 'EN, BN, ES, FR — and growing via community contributions.'],
    ['shield', T('feat_encrypt_title') || 'Encrypted Storage', T('feat_encrypt_desc') || 'Form questions encrypted at rest with AES-256-CBC.'],
    ['users', T('feat_collab_title') || 'Collaborators', T('feat_collab_desc') || 'Share edit and view access with other Wikipedia users.'],
    ['clock', T('feat_schedule_title') || 'Scheduled Quizzes', T('feat_schedule_desc') || 'Automatic start and end times for time-limited quizzes.'],
    ['link', T('feat_wikilink_title') || 'Wiki Links', T('feat_wikilink_desc') || 'Rich text editor with native Wikipedia interwiki link support.'],
    ['translate', T('feat_contribute_title') || 'Contribute', T('feat_contribute_desc') || 'Any Wikipedia user can contribute translations.'],
  ];

  const Icon = ({ name }) => {
    const icons = {
      lock: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3366cc" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
      clipboard: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3366cc" strokeWidth="2" strokeLinecap="round"><rect x="9" y="2" width="6" height="4" rx="1"/><path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-3"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/></svg>,
      globe: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3366cc" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
      shield: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3366cc" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
      users: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3366cc" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
      clock: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3366cc" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
      link: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3366cc" strokeWidth="2" strokeLinecap="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
      translate: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3366cc" strokeWidth="2" strokeLinecap="round"><path d="M5 8l6 6"/><path d="M4 14l6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="M22 22l-5-10-5 10"/><path d="M14 18h6"/></svg>,
    };
    return icons[name] || null;
  };

  return (
    <div className="wikiform-container" style={{ marginTop: 24, paddingBottom: 60 }}>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border-light)', borderTop: '4px solid #3366cc', borderRadius: 2, padding: '32px', marginBottom: 16 }}>
        <a href="/" style={{ fontSize: 13, color: '#3366cc', textDecoration: 'none', display: 'inline-block', marginBottom: 20 }}>{T('back_home_link')}</a>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px' }}>{T('about_title')}</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15, margin: '0 0 24px' }}>{T('about_subtitle')}</p>
        <div style={{ background: '#eaf3ff', borderLeft: '4px solid #3366cc', padding: '14px 18px', borderRadius: 2, fontSize: 14, color: '#1e40af' }}>
          {T('about_why_desc')}
        </div>
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border-light)', borderRadius: 2, padding: '24px 28px', marginBottom: 12 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 12px' }}>{T('about_what_title')}</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7 }}>{T('about_what_desc')}</p>
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border-light)', borderRadius: 2, padding: '24px 28px', marginBottom: 12 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 16px' }}>{T('features_title')}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
          {features.map(([icon, title, desc]) => (
            <div key={icon} style={{ background: 'var(--bg)', border: '1px solid var(--border-light)', borderRadius: 2, padding: '14px' }}>
              <div style={{ marginBottom: 8 }}><Icon name={icon} /></div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{title}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border-light)', borderRadius: 2, padding: '24px 28px', marginBottom: 12 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 16px' }}>{T('about_dev_title')}</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'var(--bg)', border: '1px solid var(--border-light)', borderRadius: 2, padding: 20 }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#3366cc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 18, flexShrink: 0 }}>A</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>Anaf Ibn Shahibul</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', margin: '2px 0' }}>Founder & Lead Developer · Toolforge: tools.wikiforms</div>
            <div style={{ fontSize: 13, marginTop: 6, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a href="https://en.wikipedia.org/wiki/User:Anaf_Ibn_Shahibul" target="_blank" rel="noopener noreferrer" style={{ color: '#3366cc' }}>Wikipedia</a>
              <a href="https://github.com/anafibnshahibul" target="_blank" rel="noopener noreferrer" style={{ color: '#3366cc' }}>GitHub</a>
              <a href="https://en.wikipedia.org/wiki/User_talk:Anaf_Ibn_Shahibul" target="_blank" rel="noopener noreferrer" style={{ color: '#3366cc' }}>Talk page</a>
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border-light)', borderRadius: 2, padding: '24px 28px', marginBottom: 12 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 12px' }}>{T('about_contrib_title')}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            ['https://github.com/anafibnshahibul/WikiForms', 'GitHub', T('about_contrib_code') || 'Contribute code via pull requests'],
            ['/contribute', T('contribute'), T('about_contrib_translate') || 'Help translate WikiForms into your language'],
            ['https://github.com/anafibnshahibul/WikiForms/issues', T('about_contrib_bugs') || 'Bug Reports', T('about_contrib_bugs_desc') || 'Report issues on GitHub'],
            ['https://en.wikipedia.org/wiki/User_talk:Anaf_Ibn_Shahibul', T('about_contrib_feedback') || 'Feedback', T('about_contrib_feedback_desc') || 'Share ideas via Wikipedia talk page'],
          ].map(([href, label, desc]) => (
            <div key={href} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '10px 14px', background: 'var(--bg)', borderRadius: 2, border: '1px solid var(--border-light)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3366cc" strokeWidth="2" strokeLinecap="round" style={{ marginTop: 2, flexShrink: 0 }}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              <div>
                <a href={href} target={href.startsWith('http') ? '_blank' : '_self'} rel="noopener noreferrer" style={{ color: '#3366cc', fontWeight: 600, fontSize: 14 }}>{label}</a>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: '#fffaeb', border: '1px solid #f59e0b', borderLeft: '4px solid #f59e0b', borderRadius: 2, padding: '14px 18px', fontSize: 14, color: '#92400e' }}>
        <strong>{T('about_status_title')}:</strong> {T('about_status')}
      </div>
    </div>
  );
}

export default AboutPage;
