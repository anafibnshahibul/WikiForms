import React from 'react';

function AboutPage({ T, lang }) {
  return (
    <div className="wikiform-container" style={{ marginTop: 24, paddingBottom: 60 }}>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border-light)', borderTop: '4px solid #3366cc', borderRadius: 10, padding: '32px', marginBottom: 16 }}>
        <a href="/" style={{ fontSize: 13, color: '#3366cc', textDecoration: 'none', display: 'inline-block', marginBottom: 20 }}>{T('back_home_link')}</a>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px' }}>{T('about_title')}</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15, margin: '0 0 24px' }}>{T('about_subtitle')}</p>
        <div style={{ background: '#eaf3ff', borderLeft: '4px solid #3366cc', padding: '14px 18px', borderRadius: 4, fontSize: 14, color: '#1e40af' }}>
          {T('about_why_desc')}
        </div>
      </div>

      {/* What is WikiForms */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border-light)', borderRadius: 10, padding: '24px 28px', marginBottom: 12 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 12px' }}>{T('about_what_title')}</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7 }}>{T('about_what_desc')}</p>
      </div>

      {/* Features */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border-light)', borderRadius: 10, padding: '24px 28px', marginBottom: 12 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 16px' }}>{T('features_title')}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
          {[
            ['🔐', 'Wikipedia Login', 'One-click login with your existing Wikipedia account.'],
            ['📋', 'Drag & Drop Builder', 'Multiple question types, sections, and custom options.'],
            ['🌐', 'Multilingual', 'EN, BN, ES, FR — and growing via community contributions.'],
            ['🔒', 'Encrypted Storage', 'Form questions encrypted at rest with AES-256-CBC.'],
            ['👥', 'Collaborators', 'Share edit and view access with other Wikipedia users.'],
            ['⏱', 'Scheduled Quizzes', 'Automatic start and end times for time-limited quizzes.'],
            ['🔗', 'Wiki Links', 'Rich text editor with native Wikipedia interwiki link support.'],
            ['🌍', 'Contribute', 'Any Wikipedia user can contribute translations.'],
          ].map(([icon, title, desc]) => (
            <div key={title} style={{ background: 'var(--bg)', border: '1px solid var(--border-light)', borderRadius: 8, padding: '14px' }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>{icon}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{title}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Developer */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border-light)', borderRadius: 10, padding: '24px 28px', marginBottom: 12 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 16px' }}>{T('about_dev_title')}</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'var(--bg)', border: '1px solid var(--border-light)', borderRadius: 10, padding: 20 }}>
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

      {/* Contributing */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border-light)', borderRadius: 10, padding: '24px 28px', marginBottom: 12 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 12px' }}>{T('about_contrib_title')}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14, color: 'var(--text-secondary)' }}>
          {[
            ['💻', 'Code', 'https://github.com/anafibnshahibul/WikiForms', 'github.com/anafibnshahibul/WikiForms'],
            ['🌐', 'Translations', '/contribute', 'wikiforms.toolforge.org/contribute'],
            ['🐛', 'Bug Reports', 'https://github.com/anafibnshahibul/WikiForms/issues', 'GitHub Issues'],
            ['💬', 'Feedback', 'https://en.wikipedia.org/wiki/User_talk:Anaf_Ibn_Shahibul', 'Wikipedia talk page'],
          ].map(([icon, label, href, linkText]) => (
            <div key={label} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <span>{icon}</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)', minWidth: 100 }}>{label}:</span>
              <a href={href} target={href.startsWith('http') ? '_blank' : '_self'} rel="noopener noreferrer" style={{ color: '#3366cc' }}>{linkText}</a>
            </div>
          ))}
        </div>
      </div>

      {/* Status */}
      <div style={{ background: '#fffaeb', border: '1px solid #f59e0b', borderLeft: '4px solid #f59e0b', borderRadius: 8, padding: '14px 18px', fontSize: 14, color: '#92400e' }}>
        <strong>{T('about_status_title')}:</strong> {T('about_status')}
      </div>
    </div>
  );
}

export default AboutPage;
