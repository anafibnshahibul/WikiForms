import React, { useState, useEffect } from 'react';

const LANG_NAMES = {
  en: 'English', bn: 'বাংলা', es: 'Español', fr: 'Français',
  de: 'Deutsch', ar: 'العربية', zh: '中文', hi: 'हिन्दी',
  ru: 'Русский', pt: 'Português', ja: '日本語', tr: 'Türkçe',
};

function ContributeEditor({ T, wikiUser, onLogin, lang }) {
  const [languages, setLanguages]     = useState([]);
  const [targetLang, setTargetLang]   = useState('');
  const [newLangCode, setNewLangCode] = useState('');
  const [newLangName, setNewLangName] = useState('');
  const [sourceKeys, setSourceKeys]   = useState({});
  const [drafts, setDrafts]           = useState({});
  const [edited, setEdited]           = useState({});
  const [saving, setSaving]           = useState({});
  const [saved, setSaved]             = useState({});
  const [publishing, setPublishing]   = useState({});
  const [loadingDrafts, setLoadingDrafts] = useState(false);
  const [filter, setFilter]           = useState('all');
  const [search, setSearch]           = useState('');

  // Load available languages on mount
  useEffect(() => {
    fetch('/api/usr-lang')
      .then(r => r.json())
      .then(d => { if (d.status === 'success') setLanguages(d.languages); })
      .catch(() => {});
  }, []);

  // Load drafts + source whenever targetLang changes
  useEffect(() => {
    if (!targetLang) return;
    setLoadingDrafts(true);
    setEdited({});
    setSaved({});
    fetch(`/api/editor/${targetLang}`)
      .then(r => r.json())
      .then(d => {
        if (d.status === 'success') {
          setSourceKeys(d.source || {});
          const draftMap = {};
          (d.drafts || []).forEach(row => { draftMap[row.key] = row; });
          setDrafts(draftMap);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingDrafts(false));
  }, [targetLang]);

  const allKeys   = Object.keys(sourceKeys);
  const liveCount = allKeys.filter(k => drafts[k]?.status === 'live').length;
  const coverage  = allKeys.length > 0 ? Math.round((liveCount / allKeys.length) * 100) : 0;
  const coverageColor = coverage >= 80 ? '#00af89' : coverage >= 40 ? '#f59e0b' : '#d92d20';

  const filteredKeys = allKeys.filter(k => {
    if (search && !k.includes(search) && !sourceKeys[k]?.toLowerCase().includes(search.toLowerCase())) return false;
    if (filter === 'missing') return !drafts[k];
    if (filter === 'draft')   return drafts[k]?.status === 'draft';
    if (filter === 'live')    return drafts[k]?.status === 'live';
    return true;
  });

  const handleSave = async (key) => {
    const value = edited[key] ?? drafts[key]?.value ?? '';
    if (!value.trim()) return;
    setSaving(s => ({ ...s, [key]: true }));
    try {
      const res = await fetch('/api/editor', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lang_code: targetLang,
          lang_name: languages.find(l => l.code === targetLang)?.name || newLangName || targetLang,
          translation_key: key,
          value,
          contributed_by: wikiUser.username,
        }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        setDrafts(d => ({ ...d, [key]: { ...d[key], key, value, status: 'draft', contributed_by: wikiUser.username } }));
        setSaved(s => ({ ...s, [key]: 'saved' }));
        setTimeout(() => setSaved(s => ({ ...s, [key]: null })), 2000);
      }
    } catch (e) {}
    setSaving(s => ({ ...s, [key]: false }));
  };

  const handlePublish = async (key) => {
    setPublishing(p => ({ ...p, [key]: true }));
    try {
      const res = await fetch('/api/publisher', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lang_code: targetLang, translation_key: key, published_by: wikiUser.username }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        setDrafts(d => ({ ...d, [key]: { ...d[key], status: 'live', published_by: wikiUser.username } }));
        setSaved(s => ({ ...s, [key]: 'published' }));
        setTimeout(() => setSaved(s => ({ ...s, [key]: null })), 2000);
      }
    } catch (e) {}
    setPublishing(p => ({ ...p, [key]: false }));
  };

  const handleAddLanguage = async () => {
    if (!newLangCode.trim() || !newLangName.trim()) return;
    const code = newLangCode.trim().toLowerCase();
    setTargetLang(code);
    setLanguages(l => [...l.filter(x => x.code !== code), { code, name: newLangName.trim(), live_count: 0, total: 0, coverage: 0 }]);
    setNewLangCode('');
    setNewLangName('');
  };

  const inputStyle = { width: '100%', padding: '8px 10px', border: '1px solid var(--border)', borderRadius: 6, fontSize: 13, background: 'var(--bg)', color: 'var(--text-primary)', fontFamily: 'inherit', boxSizing: 'border-box' };
  const labelStyle = { fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 4 };

  if (!wikiUser) return (
    <div className="wikiform-container" style={{ marginTop: 60, textAlign: 'center' }}>
      <div className="wiki-card" style={{ padding: '52px 32px', borderTop: '4px solid #3366cc' }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>🌐</div>
        <h2 style={{ color: 'var(--text-primary)', margin: '0 0 12px' }}>Contribute Translations</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 28, fontSize: 15 }}>
          Help make WikiForms available in your language. Log in with your Wikipedia account to get started.
        </p>
        <button onClick={onLogin} className="wiki-btn" style={{ padding: '12px 32px', fontSize: 15 }}>
          Log In with Wikipedia
        </button>
      </div>
    </div>
  );

  return (
    <div className="wikiform-container" style={{ marginTop: 24, paddingBottom: 60 }}>
      {/* Header */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border-light)', borderTop: '4px solid #3366cc', borderRadius: 10, padding: '24px 28px', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <span style={{ fontSize: 28 }}>🌐</span>
          <div>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: 'var(--text-primary)' }}>Contribute Translations</h1>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)' }}>Help translate WikiForms into your language — anyone with a Wikipedia account can contribute.</p>
          </div>
        </div>
      </div>

      {/* Language selector */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border-light)', borderRadius: 10, padding: '20px 24px', marginBottom: 16 }}>
        <label style={labelStyle}>Select target language</label>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {languages.filter(l => l.code !== 'en').map(l => (
            <button key={l.code} onClick={() => setTargetLang(l.code)}
              style={{ padding: '8px 16px', borderRadius: 20, border: '1px solid', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit', transition: 'all 0.15s',
                borderColor: targetLang === l.code ? '#3366cc' : 'var(--border)',
                background: targetLang === l.code ? '#eaf3ff' : 'var(--bg)',
                color: targetLang === l.code ? '#3366cc' : 'var(--text-primary)',
              }}>
              {l.name}
              <span style={{ marginLeft: 6, fontSize: 11, opacity: 0.7 }}>{l.coverage}%</span>
            </button>
          ))}
        </div>

        {/* Add new language */}
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px dashed var(--border-light)' }}>
          <label style={labelStyle}>Add a new language</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <input type="text" placeholder="Language code (e.g. de, ar, zh)" value={newLangCode}
              onChange={e => setNewLangCode(e.target.value)}
              style={{ ...inputStyle, width: 220 }} />
            <input type="text" placeholder="Language name (e.g. Deutsch)" value={newLangName}
              onChange={e => {
                setNewLangName(e.target.value);
                if (LANG_NAMES[newLangCode.trim().toLowerCase()]) setNewLangName(LANG_NAMES[newLangCode.trim().toLowerCase()]);
              }}
              style={{ ...inputStyle, width: 200 }} />
            <button onClick={handleAddLanguage} className="wiki-btn" style={{ padding: '8px 18px', fontSize: 13 }}>
              Add Language
            </button>
          </div>
        </div>
      </div>

      {/* Translation editor */}
      {targetLang && (
        <>
          {/* Progress */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border-light)', borderRadius: 10, padding: '16px 24px', marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                {languages.find(l => l.code === targetLang)?.name || targetLang} — Translation Progress
              </span>
              <span style={{ fontSize: 13, fontWeight: 800, color: coverageColor }}>{coverage}%</span>
            </div>
            <div style={{ background: 'var(--border-light)', borderRadius: 8, height: 8 }}>
              <div style={{ width: `${coverage}%`, background: coverageColor, borderRadius: 8, height: '100%', transition: 'width 0.6s ease' }} />
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 10, fontSize: 12, color: 'var(--text-muted)' }}>
              <span>✅ Live: <b style={{ color: '#00af89' }}>{liveCount}</b></span>
              <span>📝 Draft: <b style={{ color: '#f59e0b' }}>{allKeys.filter(k => drafts[k]?.status === 'draft').length}</b></span>
              <span>❌ Missing: <b style={{ color: '#d92d20' }}>{allKeys.filter(k => !drafts[k]).length}</b></span>
              <span>Total: <b>{allKeys.length}</b></span>
            </div>
          </div>

          {/* Filter + Search */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            {['all','missing','draft','live'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                style={{ padding: '6px 14px', borderRadius: 20, border: '1px solid', cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
                  borderColor: filter === f ? '#3366cc' : 'var(--border)',
                  background: filter === f ? '#eaf3ff' : 'var(--bg)',
                  color: filter === f ? '#3366cc' : 'var(--text-secondary)',
                }}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
            <input type="text" placeholder="Search keys..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ ...inputStyle, width: 200, marginLeft: 'auto' }} />
          </div>

          {/* Keys list */}
          {loadingDrafts ? (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>Loading...</div>
          ) : filteredKeys.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No keys match this filter.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {filteredKeys.map(key => {
                const draft    = drafts[key];
                const status   = draft?.status || 'missing';
                const current  = edited[key] ?? draft?.value ?? '';
                const statusColor = status === 'live' ? '#00af89' : status === 'draft' ? '#f59e0b' : '#d92d20';
                const statusLabel = status === 'live' ? '✅ Live' : status === 'draft' ? '📝 Draft' : '❌ Missing';
                const isDirty  = edited[key] !== undefined && edited[key] !== (draft?.value ?? '');

                return (
                  <div key={key} style={{ background: 'var(--surface)', border: `1px solid var(--border-light)`, borderLeft: `3px solid ${statusColor}`, borderRadius: 8, padding: '14px 18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
                      <div>
                        <code style={{ fontSize: 12, background: 'var(--bg)', padding: '2px 6px', borderRadius: 4, color: '#3366cc', fontWeight: 700 }}>{key}</code>
                        <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 700, color: statusColor }}>{statusLabel}</span>
                        {draft?.contributed_by && <span style={{ marginLeft: 8, fontSize: 11, color: 'var(--text-muted)' }}>by {draft.contributed_by}</span>}
                      </div>
                    </div>

                    {/* Source (English) */}
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, padding: '6px 10px', background: 'var(--bg)', borderRadius: 4, borderLeft: '3px solid #3366cc' }}>
                      <span style={{ fontWeight: 700, color: '#3366cc' }}>EN: </span>{sourceKeys[key]}
                    </div>

                    {/* Translation input */}
                    <textarea
                      rows={2}
                      value={current}
                      onChange={e => setEdited(ed => ({ ...ed, [key]: e.target.value }))}
                      placeholder={`Translate to ${languages.find(l => l.code === targetLang)?.name || targetLang}...`}
                      style={{ ...inputStyle, resize: 'vertical', marginBottom: 8 }}
                    />

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => handleSave(key)}
                        disabled={saving[key] || !current.trim()}
                        className="wiki-btn"
                        style={{ padding: '6px 16px', fontSize: 12, opacity: (!current.trim() || saving[key]) ? 0.5 : 1 }}>
                        {saving[key] ? 'Saving...' : isDirty ? 'Save Draft *' : 'Save Draft'}
                      </button>

                      {draft && (
                        <button
                          onClick={() => handlePublish(key)}
                          disabled={publishing[key]}
                          className="wiki-btn"
                          style={{ padding: '6px 16px', fontSize: 12, background: '#00af89', borderColor: '#00af89', opacity: publishing[key] ? 0.5 : 1 }}>
                          {publishing[key] ? 'Publishing...' : '✓ Publish'}
                        </button>
                      )}

                      {saved[key] && (
                        <span style={{ fontSize: 12, fontWeight: 700, color: saved[key] === 'published' ? '#00af89' : '#3366cc' }}>
                          {saved[key] === 'published' ? '✅ Published!' : '💾 Saved!'}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ContributeEditor;