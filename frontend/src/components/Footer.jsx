import React from 'react';

function Footer({ lang, T }) {
  return (
    <footer style={{ marginTop: '40px', padding: '24px 20px', borderTop: '1px solid var(--border)', fontSize: '12px', color: 'var(--text-muted)', backgroundColor: 'var(--surface)', width: '100%', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Top row — links */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 16px', justifyContent: 'center', lineHeight: 2 }}>
          <a href="/privacy.html" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Privacy Policy</a>
          <span style={{ color: 'var(--border)' }}>•</span>
          <a href="/terms.html" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Terms of Use</a>
          <span style={{ color: 'var(--border)' }}>•</span>
          <a href="/about.html" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>About</a>
          <span style={{ color: 'var(--border)' }}>•</span>
          <a href="/docs.php" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>API Docs</a>
          <span style={{ color: 'var(--border)' }}>•</span>
          <a href="https://github.com/anafibnshahibul/WikiForms" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>GitHub</a>
          <span style={{ color: 'var(--border)' }}>•</span>
          <a href="https://github.com/anafibnshahibul/WikiForms/issues" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Report a Bug</a>
        </div>

        {/* Bottom row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ margin: 0, textAlign: 'center', flex: 1 }}>
            Available under{' '}
            <a href="https://creativecommons.org/licenses/by-sa/4.0/" style={{ color: '#3366cc' }}>CC BY-SA 4.0</a>
            {' '}(docs) · MIT License (code) · Hosted on{' '}
            <a href="https://wikitech.wikimedia.org/wiki/Portal:Toolforge" style={{ color: '#3366cc' }}>Wikimedia Toolforge</a>
          </p>
          <a href="https://mediawiki.org" target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', border: '1px solid var(--border)', borderRadius: '6px', backgroundColor: 'var(--bg)', textDecoration: 'none', flexShrink: 0 }}>
            <img src="https://commons.wikimedia.org/w/resources/assets/mediawiki_compact.svg" alt="MediaWiki" width="22" height="22" style={{ display: 'block' }} />
            <span style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: '1.3', whiteSpace: 'nowrap' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Powered by</span>
              MediaWiki
            </span>
          </a>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
