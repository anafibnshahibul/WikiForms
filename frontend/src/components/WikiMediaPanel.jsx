import React, { useState, useCallback, useRef } from 'react';

const WD_API  = 'https://www.wikidata.org/w/api.php';
const WP_REST = (lang = 'en') => `https://${lang}.wikipedia.org/api/rest_v1`;
const WP_API  = (lang = 'en') => `https://${lang}.wikipedia.org/w/api.php`;
const WF_API  = 'https://www.wikifunctions.org/w/api.php';

async function searchWikidata(query, lang = 'en') {
  const url = `${WD_API}?action=wbsearchentities&search=${encodeURIComponent(query)}&language=${lang}&format=json&limit=8&origin=*`;
  const r = await fetch(url); return (await r.json()).search || [];
}
async function getWikidataEntity(qid, lang = 'en') {
  const url = `${WD_API}?action=wbgetentities&ids=${qid}&languages=${lang}&format=json&origin=*&props=labels|descriptions`;
  const r = await fetch(url); return (await r.json()).entities?.[qid] || null;
}
async function getWikipediaSummary(title, lang = 'en') {
  const r = await fetch(`${WP_REST(lang)}/page/summary/${encodeURIComponent(title)}`);
  return r.ok ? r.json() : null;
}
async function getWikipediaExtract(title, lang = 'en') {
  const url = `${WP_API(lang)}?action=query&titles=${encodeURIComponent(title)}&prop=extracts&exintro=1&explaintext=1&exchars=3000&format=json&origin=*`;
  const r = await fetch(url);
  const d = await r.json();
  return Object.values(d.query?.pages || {})[0]?.extract || '';
}
// Search Wikimedia Commons images
async function searchCommons(query, limit = 12) {
  // Step 1: search for files
  const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srnamespace=6&srlimit=${limit}&format=json&origin=*`;
  const r = await fetch(searchUrl);
  const d = await r.json();
  const items = d.query?.search || [];
  if (!items.length) return [];

  // Step 2: get thumbnails via imageinfo API
  const titles = items.map(i => i.title).join('|');
  const infoUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(titles)}&prop=imageinfo&iiprop=url|thumburl&iiurlwidth=200&format=json&origin=*`;
  const r2 = await fetch(infoUrl);
  const d2 = await r2.json();
  const pages = Object.values(d2.query?.pages || {});

  return items.map(item => {
    const title = item.title.replace('File:', '');
    const page_data = pages.find(p => p.title === item.title);
    const thumb = page_data?.imageinfo?.[0]?.thumburl || page_data?.imageinfo?.[0]?.url || '';
    const full  = page_data?.imageinfo?.[0]?.url || '';
    const page  = `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(title)}`;
    return { title, thumb, full, page, snippet: item.snippet?.replace(/<[^>]+>/g,'') };
  }).filter(i => i.thumb);
}

// Get MetaWiki user info
async function getMetaUser(username) {
  const url = `https://meta.wikimedia.org/w/api.php?action=query&list=users&ususers=${encodeURIComponent(username)}&usprop=groups|editcount|registration|blockinfo&format=json&origin=*`;
  const r = await fetch(url);
  const d = await r.json();
  return d.query?.users?.[0] || null;
}

// Search MetaWiki users
async function searchMetaUsers(query) {
  const url = `https://meta.wikimedia.org/w/api.php?action=query&list=allusers&aufrom=${encodeURIComponent(query)}&aulimit=8&auprop=editcount&format=json&origin=*`;
  const r = await fetch(url);
  const d = await r.json();
  return d.query?.allusers || [];
}

async function callWikifunction(zid, argStr = '') {
  const zo = argStr
    ? { Z1K1:'Z7', Z7K1: zid, Z10000K1: { Z1K1:'Z6', Z6K1: argStr } }
    : { Z1K1:'Z7', Z7K1: zid };
  const url = `${WF_API}?action=wikilambda_function_call&wikilambda_function_call_zobject=${encodeURIComponent(JSON.stringify(zo))}&format=json&origin=*`;
  const r = await fetch(url);
  const d = await r.json();
  return d.query?.wikilambda_function_call?.data || null;
}

function WikiMediaPanel({ field, updateField, contentType, lang = 'en', onClose, onSetCoverImage }) {
  const [tab, setTab]             = useState('wikidata');
  const [query, setQuery]         = useState('');
  const [results, setResults]     = useState([]);
  const [loading, setLoading]     = useState(false);
  const [status, setStatus]       = useState('');
  const [wfZid, setWfZid]         = useState('Z10000');
  const [wfArg, setWfArg]         = useState('');
  const [wfResult, setWfResult]   = useState('');
  const [wpLang, setWpLang]       = useState(lang);
  const [commonsQuery, setCommonsQuery] = useState('');
  const [commonsResults, setCommonsResults] = useState([]);
  const [commonsLoading, setCommonsLoading] = useState(false);
  const [metaUsername, setMetaUsername] = useState('');
  const [metaUser, setMetaUser] = useState(null);
  const [metaLoading, setMetaLoading] = useState(false);
  const debRef = useRef(null);
  const accent = '#3366cc';

  const handleWDSearch = useCallback((q) => {
    setQuery(q);
    clearTimeout(debRef.current);
    if (!q.trim()) { setResults([]); return; }
    debRef.current = setTimeout(async () => {
      setLoading(true);
      try { setResults(await searchWikidata(q, wpLang)); }
      catch { setStatus('Search failed'); }
      setLoading(false);
    }, 400);
  }, [wpLang]);

  const applyWDEntity = async (entity) => {
    setLoading(true);
    try {
      const full  = await getWikidataEntity(entity.id, wpLang);
      const label = full?.labels?.[wpLang]?.value || entity.label;
      if (!field.text) updateField(field.id, 'text', label);
      if (contentType === 'quiz') {
        updateField(field.id, 'correctAnswer', label);
        updateField(field.id, 'successMsg', `✅ Correct! ${entity.description || ''}`);
        updateField(field.id, 'failMsg', `❌ The answer is "${label}". ${entity.description || ''}`);
      }
      if (['radio','select','checkbox'].includes(field.type)) {
        const related = await searchWikidata(label, wpLang);
        const opts = [...new Set([label, ...related.map(r => r.label)])].slice(0,5);
        updateField(field.id, 'options', opts);
      }
      updateField(field.id, 'description', `Source: <a href="https://www.wikidata.org/wiki/${entity.id}" target="_blank" style="color:#3366cc">${entity.id} — ${entity.description || label}</a>`);
      setStatus(`✅ Applied: ${label} (${entity.id})`);
      setResults([]); setQuery('');
    } catch { setStatus('❌ Failed to fetch entity'); }
    setLoading(false);
  };


  const runWikifunction = async () => {
    setLoading(true); setWfResult('');
    try {
      const result = await callWikifunction(wfZid, wfArg);
      const val = result ? JSON.stringify(result, null, 2) : 'No result';
      setWfResult(val);
      if (contentType === 'quiz' && result) {
        const v = typeof result === 'string' ? result : JSON.stringify(result);
        updateField(field.id, 'correctAnswer', v);
        setStatus(`✅ Correct answer set from Wikifunctions: ${v}`);
      }
    } catch (e) { setWfResult(`Error: ${e.message}`); }
    setLoading(false);
  };

  const searchCommonsImages = async (q) => {
    setCommonsQuery(q);
    if (!q.trim()) { setCommonsResults([]); return; }
    clearTimeout(debRef.current);
    debRef.current = setTimeout(async () => {
      setCommonsLoading(true);
      try { setCommonsResults(await searchCommons(q)); }
      catch { setStatus('Commons search failed'); }
      setCommonsLoading(false);
    }, 500);
  };

  const lookupMetaUser = async () => {
    if (!metaUsername.trim()) return;
    setMetaLoading(true); setMetaUser(null);
    try {
      const u = await getMetaUser(metaUsername);
      setMetaUser(u);
      if (u && !u.missing) {
        // Set field description with user info
        updateField(field.id, 'description',
          `Wikipedia user: <a href="https://meta.wikimedia.org/wiki/User:${encodeURIComponent(u.name)}" target="_blank" style="color:#3366cc">${u.name}</a> — ${u.editcount || 0} edits`
        );
        setStatus(`✅ Found user: ${u.name} (${u.editcount || 0} edits)`);
      } else {
        setStatus('❌ User not found');
      }
    } catch { setStatus('❌ MetaWiki lookup failed'); }
    setMetaLoading(false);
  };

  const applyCommonsImage = (img) => {
    const fullUrl = img.full || img.thumb || '';
    // Set as form cover image
    if (onSetCoverImage) {
      onSetCoverImage(fullUrl);
      setStatus('✅ Set as cover image: ' + img.title);
    }
    // Also embed in question description
    updateField(field.id, 'description',
      '<a href="' + img.page + '" target="_blank" style="color:#3366cc;font-size:11px">📷 ' + img.title + ' (Wikimedia Commons)</a>'
    );
  };

  const S = { input: { width:'100%', padding:'7px 10px', border:'1px solid var(--border)', borderRadius:2, fontSize:13, background:'var(--bg)', color:'var(--text-primary)', fontFamily:'inherit', boxSizing:'border-box' } };
  const tabBtn = (t, label) => (
    <button onClick={() => setTab(t)} style={{ padding:'8px 14px', border:'none', background:'none', fontWeight:600, fontSize:12, cursor:'pointer', color: tab===t ? accent : 'var(--text-muted)', borderBottom: tab===t ? `2px solid ${accent}` : '2px solid transparent', marginBottom:'-2px', whiteSpace:'nowrap', fontFamily:'inherit' }}>{label}</button>
  );

  return (
    <div style={{ gridColumn:'1 / span 2', background:'var(--bg)', border:'1px solid #3366cc44', borderRadius:2, overflow:'hidden' }}
      onClick={e => e.stopPropagation()} onPointerDown={e => e.stopPropagation()}>

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'8px 12px', background:'#eaf3ff', borderBottom:'1px solid #3366cc33' }}>
        <span style={{ fontSize:12, fontWeight:700, color:accent }}>🌐 Wikimedia Integration</span>
        <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', fontSize:16 }}>×</button>
      </div>

      <div style={{ display:'flex', borderBottom:'2px solid var(--border-light)', paddingLeft:8, overflowX:'auto' }}>
        {tabBtn('wikidata',      '🔍 Wikidata')}

        {tabBtn('commons',      '🖼️ Commons')}
        {tabBtn('metawiki',     '👤 MetaWiki')}
      </div>

      <div style={{ padding:'12px' }}>

        {tab === 'wikidata' && (
          <div>
            <div style={{ display:'flex', gap:6, marginBottom:8 }}>
              <input type="text" placeholder="Search Wikidata... (e.g. Bangladesh, Einstein)" value={query}
                onChange={e => handleWDSearch(e.target.value)} style={{ ...S.input, flex:1 }}
                onPointerDown={e => e.stopPropagation()} onClick={e => e.stopPropagation()} />
              <select value={wpLang} onChange={e => setWpLang(e.target.value)} style={{ ...S.input, width:70 }} onPointerDown={e => e.stopPropagation()}>
                {['en','bn','es','fr','de','ar','hi','zh'].map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
            {loading && <p style={{ fontSize:12, color:'var(--text-muted)' }}>Searching...</p>}
            {results.length > 0 && (
              <div style={{ border:'1px solid var(--border)', borderRadius:2, overflow:'hidden', marginBottom:8 }}>
                {results.map((r, i) => (
                  <div key={r.id} onClick={() => applyWDEntity(r)}
                    style={{ padding:'8px 12px', cursor:'pointer', borderBottom: i < results.length-1 ? '1px solid var(--border-light)' : 'none', background:'var(--surface)' }}
                    onMouseOver={e => e.currentTarget.style.background='#eaf3ff'}
                    onMouseOut={e => e.currentTarget.style.background='var(--surface)'}>
                    <div style={{ display:'flex', justifyContent:'space-between' }}>
                      <div><span style={{ fontSize:13, fontWeight:600, color:'var(--text-primary)' }}>{r.label}</span><span style={{ fontSize:11, color:'var(--text-muted)', marginLeft:6 }}>{r.id}</span></div>
                      <span style={{ fontSize:11, color:accent, fontWeight:600 }}>Apply →</span>
                    </div>
                    {r.description && <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:2 }}>{r.description}</div>}
                  </div>
                ))}
              </div>
            )}
            <p style={{ fontSize:11, color:'var(--text-muted)', margin:0 }}>Applies: correct answer, options (for choice fields), Wikidata source link.</p>
          </div>
        )}

        {tab === 'commons' && (
          <div>
            <div style={{ display:'flex', gap:6, marginBottom:10 }}>
              <input type="text" placeholder="Search Wikimedia Commons... (e.g. Bangladesh flag, Albert Einstein)"
                value={commonsQuery} onChange={e => searchCommonsImages(e.target.value)}
                style={{ ...S.input, flex:1 }}
                onPointerDown={e => e.stopPropagation()} onClick={e => e.stopPropagation()} />
            </div>
            {commonsLoading && <p style={{ fontSize:12, color:'var(--text-muted)' }}>Searching Commons...</p>}
            {commonsResults.length > 0 && (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, marginBottom:8 }}>
                {commonsResults.map((img, i) => (
                  <div key={i} onClick={() => applyCommonsImage(img)}
                    style={{ cursor:'pointer', border:'1px solid var(--border)', borderRadius:2, overflow:'hidden', background:'var(--surface)' }}
                    onMouseOver={e => e.currentTarget.style.borderColor=accent}
                    onMouseOut={e => e.currentTarget.style.borderColor='var(--border)'}>
                    <img src={img.thumb} alt={img.title} style={{ width:'100%', height:80, objectFit:'cover', display:'block' }} onError={e => e.target.style.display='none'} />
                    <div style={{ padding:'4px 6px', fontSize:10, color:'var(--text-muted)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{img.title}</div>
                  </div>
                ))}
              </div>
            )}
            <p style={{ fontSize:11, color:'var(--text-muted)', margin:0 }}>Click an image to embed it in the question description with a Commons attribution link.</p>
          </div>
        )}

        {tab === 'metawiki' && (
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:0.5, marginBottom:6 }}>Look up Wikipedia user</div>
            <div style={{ display:'flex', gap:6, marginBottom:10 }}>
              <input type="text" placeholder="Wikipedia username..."
                value={metaUsername} onChange={e => setMetaUsername(e.target.value)}
                style={{ ...S.input, flex:1 }}
                onPointerDown={e => e.stopPropagation()} onClick={e => e.stopPropagation()}
                onKeyDown={e => e.key === 'Enter' && lookupMetaUser()} />
              <button onClick={lookupMetaUser} disabled={metaLoading || !metaUsername.trim()}
                style={{ padding:'7px 14px', background:accent, color:'white', border:'none', borderRadius:2, cursor:'pointer', fontSize:12, fontWeight:600, fontFamily:'inherit' }}>
                {metaLoading ? '⏳' : '🔍 Lookup'}
              </button>
            </div>
            {metaUser && !metaUser.missing && (
              <div style={{ border:'1px solid var(--border)', borderRadius:2, padding:'12px 14px', background:'var(--surface)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
                  <div style={{ width:36, height:36, borderRadius:'50%', background:'#eaf3ff', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </div>
                  <div>
                    <div style={{ fontWeight:700, fontSize:14, color:'var(--text-primary)' }}>{metaUser.name}</div>
                    <a href={`https://meta.wikimedia.org/wiki/User:${encodeURIComponent(metaUser.name)}`} target="_blank" rel="noreferrer" style={{ fontSize:11, color:accent }}>View on MetaWiki ↗</a>
                  </div>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
                  <div style={{ background:'var(--bg)', padding:'6px 10px', borderRadius:2, fontSize:12 }}>
                    <div style={{ color:'var(--text-muted)', fontSize:10, fontWeight:700 }}>EDIT COUNT</div>
                    <div style={{ fontWeight:700, color:'var(--text-primary)', fontSize:16 }}>{(metaUser.editcount || 0).toLocaleString()}</div>
                  </div>
                  <div style={{ background:'var(--bg)', padding:'6px 10px', borderRadius:2, fontSize:12 }}>
                    <div style={{ color:'var(--text-muted)', fontSize:10, fontWeight:700 }}>GROUPS</div>
                    <div style={{ fontWeight:600, color:'var(--text-primary)', fontSize:11 }}>{(metaUser.groups || []).filter(g => g !== '*').join(', ') || 'user'}</div>
                  </div>
                  {metaUser.registration && (
                    <div style={{ background:'var(--bg)', padding:'6px 10px', borderRadius:2, fontSize:12, gridColumn:'1 / span 2' }}>
                      <div style={{ color:'var(--text-muted)', fontSize:10, fontWeight:700 }}>REGISTERED</div>
                      <div style={{ fontWeight:600, color:'var(--text-primary)' }}>{new Date(metaUser.registration).toLocaleDateString()}</div>
                    </div>
                  )}
                </div>
                {metaUser.blockinfo && (
                  <div style={{ marginTop:8, padding:'6px 10px', background:'#fff5f5', border:'1px solid #fecdca', borderRadius:2, fontSize:12, color:'#d92d20' }}>
                    ⚠️ This user is currently blocked on MetaWiki
                  </div>
                )}
              </div>
            )}
            {metaUser?.missing && <p style={{ fontSize:13, color:'#d92d20' }}>User not found on MetaWiki.</p>}
            <p style={{ fontSize:11, color:'var(--text-muted)', margin:'8px 0 0' }}>Looks up user across all Wikimedia projects via MetaWiki.</p>
          </div>
        )}

        {status && <div style={{ marginTop:8, fontSize:12, color: status.startsWith('✅') ? '#00af89' : '#d92d20', fontWeight:600 }}>{status}</div>}
      </div>
    </div>
  );
}

export default WikiMediaPanel;
