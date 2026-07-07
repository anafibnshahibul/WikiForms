import React from 'react';

function Footer() {
  return (
    <footer style={{ marginTop: '40px', padding: '16px 20px', borderTop: '1px solid var(--border)', fontSize: '12px', color: 'var(--text-muted)', backgroundColor: 'var(--surface)', width: '100%', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <p style={{ margin: 0, textAlign: 'center', lineHeight: '1.6' }}>
          Available under the{' '}
          <a href="https://creativecommons.org/licenses/by-sa/4.0/" style={{ color: '#3366cc' }}>Creative Commons Attribution-ShareAlike License</a>
          {' • '}
          <a href="https://foundation.wikimedia.org/wiki/Policy:Terms_of_Use" style={{ color: '#3366cc' }}>Terms of Use</a>
          {' • '}
          <a href="https://foundation.wikimedia.org/wiki/Policy:Privacy_policy" style={{ color: '#3366cc' }}>Privacy Policy</a>
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <a href="https://mediawiki.org" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', border: '1px solid var(--border)', borderRadius: '6px', backgroundColor: 'var(--bg)', textDecoration: 'none', flexShrink: 0 }}>
            <img src="https://commons.wikimedia.org/w/resources/assets/mediawiki_compact.svg" alt="MediaWiki" width="22" height="22" style={{ display: 'block', flexShrink: 0 }} />
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
