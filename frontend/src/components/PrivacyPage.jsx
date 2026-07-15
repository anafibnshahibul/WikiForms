import React from 'react';

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 10px', paddingTop: 24, borderTop: '1px solid var(--border-light)' }}>{title}</h2>
      {children}
    </div>
  );
}

function Li({ children }) {
  return <li style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 6 }}>{children}</li>;
}

function P({ children }) {
  return <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7, marginBottom: 10 }}>{children}</p>;
}

function PrivacyPage({ T }) {
  return (
    <div className="wikiform-container" style={{ marginTop: 24, paddingBottom: 60 }}>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border-light)', borderTop: '4px solid #3366cc', borderRadius: 10, padding: '32px' }}>
        <a href="/" style={{ fontSize: 13, color: '#3366cc', textDecoration: 'none', display: 'inline-block', marginBottom: 20 }}>{T('back_home_link')}</a>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px' }}>{T('privacy_title')}</h1>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 24 }}>{T('last_updated')}</p>

        <div style={{ background: '#eaf3ff', borderLeft: '4px solid #3366cc', padding: '14px 18px', borderRadius: 4, fontSize: 14, color: '#1e40af', marginBottom: 28 }}>
          WikiForms is a free, open-source tool hosted on <a href="https://wikitech.wikimedia.org/wiki/Portal:Toolforge" style={{ color: '#1e40af' }}>Wikimedia Toolforge</a>. We collect the minimum data necessary and share nothing with third parties.
        </div>

        <Section title="1. Who We Are">
          <P>WikiForms is an open-source volunteer project hosted on Wikimedia Toolforge. Not affiliated with or endorsed by the Wikimedia Foundation.</P>
          <P>Developer: <a href="https://en.wikipedia.org/wiki/User:Anaf_Ibn_Shahibul" style={{ color: '#3366cc' }}>Anaf Ibn Shahibul</a> · <a href="https://github.com/anafibnshahibul/WikiForms" style={{ color: '#3366cc' }}>Source code</a></P>
        </Section>

        <Section title={`2. ${T('privacy_collect_title')}`}>
          <ul style={{ paddingLeft: 20 }}>
            <Li><strong>Wikipedia username</strong> — via MediaWiki OAuth 2.0. We never receive or store your password.</Li>
            <Li><strong>Form content</strong> — titles and questions you create, encrypted with AES-256-CBC before storage.</Li>
            <Li><strong>Form responses</strong> — answers submitted to forms, visible only to the form owner and authorized collaborators.</Li>
            <Li><strong>Session cookie</strong> — a temporary cookie to keep you logged in during your visit.</Li>
          </ul>
        </Section>

        <Section title={`3. ${T('privacy_nocollect_title')}`}>
          <ul style={{ paddingLeft: 20 }}>
            <Li>No email addresses or personally identifiable information (PII)</Li>
            <Li>No Google Analytics, Google Ads, or third-party tracking</Li>
            <Li>No IP address logging beyond standard Toolforge server logs</Li>
            <Li>No data sold, shared, or used for any commercial purpose</Li>
          </ul>
        </Section>

        <Section title={`4. ${T('privacy_storage_title')}`}>
          <P>All data is stored on Wikimedia Toolforge infrastructure. Form questions are encrypted at rest. Access to responses is restricted to form owners and explicitly authorized collaborators. The full source code is publicly auditable at <a href="https://github.com/anafibnshahibul/WikiForms" style={{ color: '#3366cc' }}>GitHub</a>.</P>
        </Section>

        <Section title={`5. ${T('privacy_cookies_title')}`}>
          <P>WikiForms uses a single session cookie, set only when you log in, used solely to authenticate your requests, and deleted when you log out. No tracking or advertising cookies are used.</P>
        </Section>

        <Section title={`6. ${T('privacy_rights_title')}`}>
          <ul style={{ paddingLeft: 20 }}>
            <Li>Delete any forms you created at any time</Li>
            <Li>Request deletion of all your data via <a href="https://en.wikipedia.org/wiki/User_talk:Anaf_Ibn_Shahibul" style={{ color: '#3366cc' }}>Wikipedia talk page</a> or <a href="https://github.com/anafibnshahibul/WikiForms/issues" style={{ color: '#3366cc' }}>GitHub Issues</a></Li>
          </ul>
        </Section>

        <Section title={`7. ${T('privacy_compliance')}`}>
          <P>WikiForms operates in compliance with the <a href="https://wikitech.wikimedia.org/wiki/Wikitech:Cloud_Services_Terms_of_use" style={{ color: '#3366cc' }}>Wikimedia Cloud Services Terms of Use</a>. Form creators are responsible for ensuring their forms do not collect PII.</P>
        </Section>
      </div>
    </div>
  );
}

export default PrivacyPage;
