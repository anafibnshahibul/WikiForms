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

function TermsPage({ T }) {
  return (
    <div className="wikiform-container" style={{ marginTop: 24, paddingBottom: 60 }}>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border-light)', borderTop: '4px solid #3366cc', borderRadius: 10, padding: '32px' }}>
        <a href="/" style={{ fontSize: 13, color: '#3366cc', textDecoration: 'none', display: 'inline-block', marginBottom: 20 }}>{T('back_home_link')}</a>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px' }}>{T('terms_title')}</h1>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 24 }}>{T('last_updated')}</p>

        <div style={{ background: '#eaf3ff', borderLeft: '4px solid #3366cc', padding: '14px 18px', borderRadius: 4, fontSize: 14, color: '#1e40af', marginBottom: 28 }}>
          By using WikiForms, you agree to these terms. WikiForms is a volunteer-run, open-source tool hosted on Wikimedia Toolforge.
        </div>

        <Section title={`1. ${T('terms_accept_title')}`}>
          <P>By using WikiForms, you agree to these Terms and our <a href="/privacy" style={{ color: '#3366cc' }}>Privacy Policy</a>. If you do not agree, do not use the service.</P>
        </Section>

        <Section title="2. Service Description">
          <P>WikiForms is a free, open-source form and quiz builder hosted on <a href="https://wikitech.wikimedia.org/wiki/Portal:Toolforge" style={{ color: '#3366cc' }}>Wikimedia Toolforge</a>, subject to <a href="https://wikitech.wikimedia.org/wiki/Wikitech:Cloud_Services_Terms_of_use" style={{ color: '#3366cc' }}>Wikimedia Cloud Services Terms of Use</a>.</P>
        </Section>

        <Section title={`3. ${T('terms_use_title')}`}>
          <P>You must NOT use WikiForms to:</P>
          <ul style={{ paddingLeft: 20 }}>
            <Li>Collect personally identifiable information (PII) — names, addresses, phone numbers, financial or health data</Li>
            <Li>Harass, deceive, or harm other users</Li>
            <Li>Violate any applicable laws or Wikimedia policies</Li>
            <Li>Use for commercial purposes or advertising</Li>
            <Li>Attempt unauthorized access or circumvent security measures</Li>
          </ul>
        </Section>

        <Section title={`4. ${T('terms_pii_title')}`}>
          <P>Per <a href="https://wikitech.wikimedia.org/wiki/Wikitech:Cloud_Services_Terms_of_use#7.2_If_this_is_a_Toolforge_Project" style={{ color: '#3366cc' }}>Toolforge Terms Section 7.2</a>, collecting personally identifiable information is prohibited. Form creators are solely responsible for compliance.</P>
        </Section>

        <Section title={`5. ${T('terms_data_title')}`}>
          <P>You retain ownership of content you create. You may delete your forms and data at any time. Form responses are visible only to you and collaborators you explicitly authorize.</P>
        </Section>

        <Section title="6. Service Availability">
          <P>WikiForms is provided "as is" without warranty. As a volunteer project, we cannot guarantee uninterrupted availability and may modify or discontinue the service at any time.</P>
        </Section>

        <Section title={`7. ${T('terms_liability_title')}`}>
          <P>WikiForms and its contributors are not liable for any damages arising from use of the service. Use is at your own risk.</P>
        </Section>

        <Section title="8. Intellectual Property">
          <P>Source code: <a href="https://opensource.org/licenses/MIT" style={{ color: '#3366cc' }}>MIT License</a> · Documentation: <a href="https://creativecommons.org/licenses/by-sa/4.0/" style={{ color: '#3366cc' }}>CC BY-SA 4.0</a>. WikiForms is not affiliated with the Wikimedia Foundation.</P>
        </Section>

        <Section title="9. Contact">
          <P><a href="https://en.wikipedia.org/wiki/User_talk:Anaf_Ibn_Shahibul" style={{ color: '#3366cc' }}>Wikipedia talk page</a> · <a href="https://github.com/anafibnshahibul/WikiForms/issues" style={{ color: '#3366cc' }}>GitHub Issues</a></P>
        </Section>
      </div>
    </div>
  );
}

export default TermsPage;
