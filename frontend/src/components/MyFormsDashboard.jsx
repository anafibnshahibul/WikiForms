import { apiFetch } from '../api.js';
import React, { useState, useEffect } from 'react';
import Icon from './Icon.jsx';

function Sparkline({ dates, color = '#3366cc' }) {
  if (!dates || dates.length === 0) return <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>No data</span>;

  const now = new Date();
  const days = 14;
  const counts = Array(days).fill(0);

  dates.forEach(d => {
    const diff = Math.floor((now - new Date(d)) / 86400000);
    if (diff < days) counts[days - 1 - diff]++;
  });

  const max = Math.max(...counts, 1);
  const w = 80, h = 28;
  const pts = counts.map((c, i) => `${(i / (days - 1)) * w},${h - (c / max) * h}`).join(' ');

  return (
    <svg width={w} height={h} style={{ display: 'block' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      {counts[days - 1] > 0 && (
        <circle cx={w} cy={h - (counts[days - 1] / max) * h} r="2.5" fill={color} />
      )}
    </svg>
  );
}

function StatCard({ label, value, color = '#3366cc' }) {
  return (
    <div style={{ background: 'var(--bg)', border: '1px solid var(--border-light)', borderRadius: 2, padding: '14px 18px', textAlign: 'center', flex: 1, minWidth: 100 }}>
      <div style={{ fontSize: 26, fontWeight: 900, color }}>{value}</div>
      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 2 }}>{label}</div>
    </div>
  );
}

function MyFormsDashboard({ T, wikiUser, onLogin, onEditForm, onSelectType, onNavigate }) {
  const [forms, setForms]       = useState([]);
  const [loading, setLoading]   = useState(false);
  const [sortBy, setSortBy]     = useState('updated');
  const [filter, setFilter]     = useState('all');
  const [search, setSearch]     = useState('');

  useEffect(() => {
    if (!wikiUser) return;
    setLoading(true);
    apiFetch(`/api/my-forms/${encodeURIComponent(wikiUser.username)}`)
      .then(r => r.json())
      .then(d => { if (d.status === 'success') setForms(d.forms || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [wikiUser]);

  if (!wikiUser) return (
    <div className="wikiform-container" style={{ marginTop: 60, textAlign: 'center' }}>
      <div className="wiki-card" style={{ padding: '52px 32px', borderTop: '4px solid #3366cc' }}>
        <div style={{ marginBottom: 16 }}><Icon name='forms' size={40} color='#3366cc'/></div>
        <h2 style={{ color: 'var(--text-primary)', margin: '0 0 12px' }}>My Forms</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 28 }}>Log in to view and manage your forms.</p>
        <button onClick={onLogin} className="wiki-btn" style={{ padding: '12px 32px', fontSize: 15 }}>
          Log In with Wikipedia
        </button>
      </div>
    </div>
  );

  const totalResponses = forms.reduce((s, f) => s + (f.response_count || 0), 0);

  // Temporary notice — remove after July 13, 2026
  const showResetNotice = new Date() < new Date('2026-07-13T00:00:00Z');
  const totalForms     = forms.length;
  const quizCount      = forms.filter(f => f.content_type === 'quiz').length;
  const formCount      = forms.filter(f => f.content_type === 'form').length;

  const filtered = forms
    .filter(f => {
      if (filter === 'form') return f.content_type === 'form';
      if (filter === 'quiz') return f.content_type === 'quiz';
      if (filter === 'collab') return f.owner_username !== wikiUser.username;
      return true;
    })
    .filter(f => !search || f.title.toLowerCase().includes(search.toLowerCase()) || f.slug.includes(search))
    .sort((a, b) => {
      if (sortBy === 'responses') return (b.response_count || 0) - (a.response_count || 0);
      if (sortBy === 'title')     return a.title.localeCompare(b.title);
      return new Date(b.updated_at) - new Date(a.updated_at);
    });

  const accent = '#3366cc';

  return (
    <div className="wikiform-container" style={{ marginTop: 24, paddingBottom: 60 }}>
      {/* Header */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border-light)', borderTop: `4px solid ${accent}`, borderRadius: 2, padding: '24px 28px', marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', display:'flex', alignItems:'center', gap:8 }}><Icon name='forms' size={20} color='#3366cc'/> My Forms</h1>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)' }}>Welcome back, <b>{wikiUser.username}</b></p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => onSelectType('form')} className="wiki-btn-secondary" style={{ padding: '8px 16px', fontSize: 13 }}>+ New Form</button>
            <button onClick={() => onSelectType('quiz')} className="wiki-btn" style={{ padding: '8px 16px', fontSize: 13, backgroundColor: '#00af89', borderColor: '#00af89' }}>+ New Quiz</button>
          </div>
        </div>
      </div>

      {/* Temporary reset notice */}
      {showResetNotice && (
        <div style={{ background: '#fffaeb', border: '1px solid #f59e0b', borderLeft: '4px solid #f59e0b', borderRadius: 2, padding: '14px 18px', marginBottom: 16, fontSize: 14, color: '#92400e', lineHeight: 1.6 }}>
          <strong>📢 Notice:</strong> As WikiForms was in its early testing phase, all previously created test forms have been removed. You can now create new forms — everything is working as expected. Thank you for your patience!
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <StatCard label="Total Forms"     value={totalForms}     color={accent} />
        <StatCard label="Forms"           value={formCount}      color="#3366cc" />
        <StatCard label="Quizzes"         value={quizCount}      color="#00af89" />
        <StatCard label="Total Responses" value={totalResponses} color="#f59e0b" />
      </div>

      {/* Filter + Search + Sort */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap', alignItems: 'center' }}>
        {[['all','All'],['form','Forms'],['quiz','Quizzes'],['collab','Collaborating']].map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)}
            style={{ padding: '6px 14px', borderRadius: 2, border: '1px solid', cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
              borderColor: filter === val ? accent : 'var(--border)',
              background: filter === val ? '#eaf3ff' : 'var(--bg)',
              color: filter === val ? accent : 'var(--text-secondary)',
            }}>
            {label}
          </button>
        ))}
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}
          style={{ marginLeft: 'auto', padding: '6px 10px', border: '1px solid var(--border)', borderRadius: 2, fontSize: 12, background: 'var(--bg)', color: 'var(--text-primary)', cursor: 'pointer' }}>
          <option value="updated">Sort: Recent</option>
          <option value="responses">Sort: Most Responses</option>
          <option value="title">Sort: Title</option>
        </select>
        <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ padding: '6px 10px', border: '1px solid var(--border)', borderRadius: 2, fontSize: 12, background: 'var(--bg)', color: 'var(--text-primary)', width: 160 }} />
      </div>

      {/* Forms list */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>Loading your forms...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60 }}>
          <div style={{ marginBottom: 12 }}><Icon name='inbox' size={36} color='var(--text-muted)'/></div>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{search ? 'No forms match your search.' : 'No forms yet. Create your first one!'}</p>
          {!search && (
            <button onClick={() => { onSelectType('form'); }} className="wiki-btn" style={{ marginTop: 16, padding: '10px 24px' }}>Create a Form</button>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(form => {
            const isOwner  = form.owner_username === wikiUser.username;
            const typeColor = form.content_type === 'quiz' ? '#00af89' : accent;
            return (
              <div key={form.slug} style={{ background: 'var(--surface)', border: '1px solid var(--border-light)', borderLeft: `3px solid ${typeColor}`, borderRadius: 2, padding: '16px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 2, background: form.content_type === 'quiz' ? '#e6faf5' : '#eaf3ff', color: typeColor, textTransform: 'uppercase' }}>
                        {form.content_type}
                      </span>
                      {!isOwner && (
                        <span style={{ fontSize: 11, fontWeight: 600, color: '#f59e0b', background: '#fffaeb', padding: '2px 8px', borderRadius: 2 }}>Collaborator</span>
                      )}
                    </div>
                    <h3 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {form.title || 'Untitled'}
                    </h3>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      /{form.slug} · Updated {new Date(form.updated_at).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Sparkline + response count */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                    <Sparkline dates={form.recent_dates} color={typeColor} />
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>
                      {form.response_count} response{form.response_count !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                  <a href={`/view/${form.slug}`} target="_blank" rel="noreferrer"
                    style={{ padding: '6px 14px', fontSize: 12, fontWeight: 600, border: '1px solid var(--border)', borderRadius: 2, textDecoration: 'none', color: 'var(--text-primary)', background: 'var(--bg)' }}>
                    <Icon name='eye' size={12} style={{marginRight:5}}/>View
                  </a>
                  <button onClick={() => onEditForm(form.slug)}
                    style={{ padding: '6px 14px', fontSize: 12, fontWeight: 600, border: `1px solid ${typeColor}`, borderRadius: 2, cursor: 'pointer', color: typeColor, background: 'var(--bg)', fontFamily: 'inherit' }}>
                    <Icon name='edit' size={12} style={{marginRight:5}}/>Edit
                  </button>
                  <button
                    onClick={() => navigator.clipboard.writeText(`${window.location.origin}/view/${form.slug}`)}
                    style={{ padding: '6px 14px', fontSize: 12, fontWeight: 600, border: '1px solid var(--border)', borderRadius: 2, cursor: 'pointer', color: 'var(--text-secondary)', background: 'var(--bg)', fontFamily: 'inherit' }}>
                    <Icon name='link' size={12} style={{marginRight:5}}/>Copy Link
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyFormsDashboard;
