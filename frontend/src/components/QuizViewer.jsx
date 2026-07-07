import React, { useState, useEffect, useMemo } from 'react';

function QuizViewer({ lang, T, remoteData, wikiUser, onLogin, onEditForm }) {
  const [warnings, setWarnings] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [showResponses, setShowResponses] = useState(false);
  const [responses, setResponses] = useState([]);
  const [loadingResponses, setLoadingResponses] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [scheduleStatus, setScheduleStatus] = useState('checking');
  const [currentSection, setCurrentSection] = useState(0);
  const [grading, setGrading] = useState(false);
  const [gradeError, setGradeError] = useState(false);
  const [gradeResults, setGradeResults] = useState(null);
  const [score, setScore] = useState(null);
  const [fetchedQuestions, setFetchedQuestions] = useState(null);
  const [autoEmail, setAutoEmail] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const isForm = remoteData?.contentType === 'form';
  const slug = remoteData?.id;
  const isOwner = wikiUser && wikiUser.username === remoteData?.owner_username;
  const isCollaborator = wikiUser && (remoteData?.collaborators || []).includes(wikiUser.username);
  const canEdit = isOwner || isCollaborator;
  const accent = isForm ? '#3366cc' : '#00af89';
  const resultTiming = remoteData?.result_timing || 'instant';

  const allFields = useMemo(() => {
    const raw = fetchedQuestions;
    if (!raw || !Array.isArray(raw)) return [];
    return raw.map((q, i) => {
      if (typeof q === 'string') return { id: 'q_' + i, type: 'text', text: q, required: false, options: [] };
      return {
        id: q.id || 'q_' + i,
        type: q.type || 'text',
        text: q.text || '',
        required: !!q.required,
        options: q.options || [],
        starMax: q.starMax || 5,
        description: q.description || '',
        points: q.points || 0,
        correctAnswer: q.correctAnswer || '',
        successMsg: q.successMsg || '',
        failMsg: q.failMsg || '',
      };
    });
  }, [fetchedQuestions]);

  // Prefetch questions on page load
  useEffect(() => {
    if (!slug || fetchedQuestions) return;
    fetch(`/api/get-form-questions/${slug}`, { method: 'POST' })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => setFetchedQuestions(data.questions || []))
      .catch(() => {});
  }, [slug]);

  // Schedule status check + real-time auto-start
  useEffect(() => {
    const timerType = remoteData?.timer_type;
    if (timerType !== 'scheduled') { setScheduleStatus('open'); return; }
    const start = remoteData?.timer_start ? new Date(remoteData.timer_start) : null;
    const end = remoteData?.timer_end ? new Date(remoteData.timer_end) : null;
    const check = () => {
      const now = new Date();
      if (end && now > end) { setScheduleStatus('after'); return; }
      if (start && now < start) { setScheduleStatus('before'); return; }
      setScheduleStatus('open');
      setIsStarted(true);
    };
    check();
    const poll = setInterval(check, 3000);
    return () => clearInterval(poll);
  }, [remoteData]);

  // Static timer countdown
  useEffect(() => {
    if (!isStarted || remoteData?.timer_type !== 'static') return;
    setTimeLeft((remoteData?.timer_duration || 30) * 60);
  }, [isStarted, remoteData]);

  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) { handleSubmit(); return; }
    const t = setTimeout(() => setTimeLeft(v => v - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft]);

  // Anti-cheat — works on both desktop and mobile.
  // visibilitychange is the only reliable signal on iOS/Android; blur alone
  // is not fired consistently by mobile browsers on app/tab switches.
  // pagehide covers cases where the browser freezes the page instead of hiding it.
  // All listeners are stored in named refs so removeEventListener actually removes them.
  useEffect(() => {
    if (isLocked || isForm || submitted || !isStarted) return;
    const warn = () => {
      setWarnings(prev => {
        const n = prev + 1;
        if (n >= 3) setIsLocked(true);
        else alert(`[${n}/2] ${T('warning_msg')}`);
        return n;
      });
    };
    const onVisibility = () => { if (document.hidden) warn(); };
    const onPageHide   = () => warn();
    window.addEventListener('blur', warn);
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', onPageHide);
    return () => {
      window.removeEventListener('blur', warn);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pagehide', onPageHide);
    };
  }, [isLocked, isForm, submitted, isStarted]);

  const sections = useMemo(() => {
    const result = [];
    let cur = { title: '', description: '', fields: [] };
    allFields.forEach(f => {
      if (f.type === 'section') { if (cur.fields.length > 0 || result.length > 0) result.push(cur); cur = { title: f.text, description: f.description, fields: [] }; }
      else cur.fields.push(f);
    });
    result.push(cur);
    return result.filter(s => s.fields.length > 0 || s.title);
  }, [allFields]);

  const finalSections = sections.length > 0 ? sections : [{ title: '', description: '', fields: [] }];
  const section = finalSections[currentSection] || finalSections[0];
  const isLastSection = currentSection === finalSections.length - 1;

  const coverImageUrl = useMemo(() => {
    const url = remoteData?.cover_image;
    if (!url) return null;
    if (url.includes('wiki/File:')) return `https://commons.wikimedia.org/wiki/Special:FilePath/${url.split('wiki/File:')[1]}`;
    return url;
  }, [remoteData]);

  const loadResponses = async () => {
    setLoadingResponses(true);
    try {
      const res = await fetch(`/api/get-responses/${slug}`);
      const data = await res.json();
      if (data.status === 'success') setResponses(data.responses);
    } catch (e) {}
    setLoadingResponses(false);
  };

  const validateSection = () => {
    const errors = {};
    section.fields.forEach(f => {
      if (!f.required) return;
      const val = answers[f.id];
      if (!val || (Array.isArray(val) ? val.length === 0 : val.toString().trim() === '')) errors[f.id] = true;
    });
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => { if (validateSection()) setCurrentSection(s => s + 1); };

  // Calls the AI grading endpoint and records the outcome, including failure —
  // used both on initial submit and from the "retry" action if grading failed.
  const gradeAnswers = async (gradable) => {
    setGrading(true);
    setGradeError(false);
    try {
      const items = gradable.map(q => ({ id: q.id, question: q.text, correctAnswer: q.correctAnswer, userAnswer: answers[q.id] || '' }));
      const gr = await fetch('/api/grade-response', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ questions: items }) });
      const data = await gr.json().catch(() => null);
      if (gr.ok && data?.status === 'success' && Array.isArray(data.results)) {
        setGradeResults(data.results);
        let earned = 0, total = 0;
        gradable.forEach(q => {
          total += q.points || 0;
          const ua = (answers[q.id] || '').toString().trim();
          const result = data.results.find(r => r.id === q.id);
          if (ua !== '' && result?.correct) earned += q.points || 0;
        });
        setScore({ earned, total });
      } else {
        setGradeError(true);
      }
    } catch (e) {
      setGradeError(true);
    }
    setGrading(false);
  };

  const handleSubmit = async () => {
    if (!validateSection()) return;
    try {
      const finalAnswers = { ...answers };
      if (autoEmail) finalAnswers['__email__'] = autoEmail;
      const res = await fetch('/api/save-response', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form_slug: slug, title: remoteData.title, type: remoteData.contentType || 'form', answers: finalAnswers }),
      });
      if (!res.ok) { alert('Failed to submit.'); return; }
      const gradable = allFields.filter(q => q.correctAnswer && q.correctAnswer.trim() !== '');
      if (!isForm && gradable.length > 0) {
        await gradeAnswers(gradable);
      } else if (!isForm) {
        setScore({ earned: 0, total: 0 });
      }
      setSubmitted(true);
    } catch { alert('Server error.'); }
  };

  const formatTime = s => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const PencilIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  );

  const renderField = (field, i) => {
    const hasError = validationErrors[field.id];
    const border = hasError ? '1px solid #d92d20' : '1px solid var(--border)';
    const base = { width: '100%', padding: '10px 12px', border, borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box', background: 'var(--bg)', color: 'var(--text-primary)', fontFamily: 'inherit' };
    return (
      <div key={field.id} style={{ background: 'var(--surface)', border: hasError ? '1px solid #d92d20' : '1px solid var(--border-light)', borderRadius: '10px', padding: '20px 24px', marginBottom: '10px' }}>
        <label style={{ display: 'block', fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '12px' }}>
          {i + 1}. {field.text}{field.required && <span style={{ color: '#d92d20', marginLeft: 4 }}>*</span>}
        </label>
        {field.type === 'text' && <input type="text" placeholder={T('your_answer')} value={answers[field.id] || ''} onChange={e => { setAnswers(p => ({ ...p, [field.id]: e.target.value })); if (hasError) setValidationErrors(v => ({ ...v, [field.id]: false })); }} style={base} />}
        {field.type === 'textarea' && <textarea rows={3} placeholder={T('your_answer')} value={answers[field.id] || ''} onChange={e => { setAnswers(p => ({ ...p, [field.id]: e.target.value })); if (hasError) setValidationErrors(v => ({ ...v, [field.id]: false })); }} style={base} />}
        {field.type === 'email' && <input type="email" placeholder="email@example.com" value={answers[field.id] || ''} onChange={e => { setAnswers(p => ({ ...p, [field.id]: e.target.value })); if (hasError) setValidationErrors(v => ({ ...v, [field.id]: false })); }} style={base} />}
        {field.type === 'number' && <input type="number" value={answers[field.id] || ''} onChange={e => { setAnswers(p => ({ ...p, [field.id]: e.target.value })); if (hasError) setValidationErrors(v => ({ ...v, [field.id]: false })); }} style={{ ...base, width: '160px' }} />}
        {field.type === 'select' && <select value={answers[field.id] || ''} onChange={e => { setAnswers(p => ({ ...p, [field.id]: e.target.value })); if (hasError) setValidationErrors(v => ({ ...v, [field.id]: false })); }} style={{ ...base, width: 'auto', minWidth: '200px' }}><option value="">{T('select_placeholder')}</option>{field.options?.map((o, j) => <option key={j} value={o}>{o}</option>)}</select>}
        {field.type === 'radio' && field.options?.map((o, j) => <label key={j} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 14, cursor: 'pointer', color: 'var(--text-primary)' }}><input type="radio" name={`q_${field.id}`} checked={answers[field.id] === o} onChange={() => { setAnswers(p => ({ ...p, [field.id]: o })); if (hasError) setValidationErrors(v => ({ ...v, [field.id]: false })); }} style={{ width: 17, height: 17 }} />{o}</label>)}
        {field.type === 'checkbox' && field.options?.map((o, j) => { const cur = answers[field.id] || []; const chk = cur.includes(o); return <label key={j} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 14, cursor: 'pointer', color: 'var(--text-primary)' }}><input type="checkbox" checked={chk} style={{ width: 17, height: 17 }} onChange={() => { const u = chk ? cur.filter(x => x !== o) : [...cur, o]; setAnswers(p => ({ ...p, [field.id]: u })); if (hasError) setValidationErrors(v => ({ ...v, [field.id]: false })); }} />{o}</label>; })}
        {field.type === 'true_false' && ['True', 'False'].map(v => <label key={v} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 14, cursor: 'pointer', color: 'var(--text-primary)' }}><input type="radio" name={`tf_${field.id}`} checked={answers[field.id] === v} onChange={() => { setAnswers(p => ({ ...p, [field.id]: v })); if (hasError) setValidationErrors(vv => ({ ...vv, [field.id]: false })); }} style={{ width: 17, height: 17 }} />{v}</label>)}
        {field.type === 'star' && <div style={{ display: 'flex', gap: 4 }}>{Array.from({ length: field.starMax || 5 }).map((_, si) => <svg key={si} width="32" height="32" viewBox="0 0 24 24" fill={(answers[field.id] || 0) > si ? '#f59e0b' : '#d0d5dd'} stroke={(answers[field.id] || 0) > si ? '#f59e0b' : '#d0d5dd'} strokeWidth="1" style={{ cursor: 'pointer' }} onClick={() => setAnswers(p => ({ ...p, [field.id]: si + 1 }))}><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>)}</div>}
        {hasError && <p style={{ color: '#d92d20', fontSize: 12, marginTop: 6, fontWeight: 600 }}>{T('field_required')}</p>}
      </div>
    );
  };

  if (scheduleStatus === 'checking') return null;

  if (scheduleStatus === 'before') {
    const msg = remoteData?.timer_before_msg?.[lang] || remoteData?.timer_before_msg?.en || T('quiz_not_started');
    return (
      <div className="wikiform-container" style={{ marginTop: 60, textAlign: 'center' }}>
        <div className="wiki-card" style={{ padding: '48px 32px', borderTop: `4px solid ${accent}` }}>
          <h2 style={{ color: 'var(--text-primary)' }}>{msg}</h2>
          {remoteData?.timer_start && <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{T('starts_at')}{new Date(remoteData.timer_start).toLocaleString()}</p>}
        </div>
      </div>
    );
  }

  if (scheduleStatus === 'after') {
    const msg = remoteData?.timer_after_msg?.[lang] || remoteData?.timer_after_msg?.en || T('quiz_ended');
    return (
      <div className="wikiform-container" style={{ marginTop: 60, textAlign: 'center' }}>
        <div className="wiki-card" style={{ padding: '48px 32px', borderTop: '4px solid #d92d20' }}>
          <h2 style={{ color: 'var(--text-primary)' }}>{msg}</h2>
        </div>
      </div>
    );
  }

  if (isLocked) return (
    <div className="wikiform-container" style={{ marginTop: 60, textAlign: 'center' }}>
      <div className="wiki-card" style={{ padding: '48px 32px' }}>
        <h2 style={{ color: '#d92d20' }}>{T('session_locked')}</h2>
        <p style={{ color: 'var(--text-secondary)' }}>{T('locked_desc')}</p>
        <a href="/" className="wiki-btn" style={{ textDecoration: 'none', display: 'inline-block', marginTop: 16 }}>{T('return_home')}</a>
      </div>
    </div>
  );

  // ===== SUBMITTED PAGE =====
  if (submitted) {
    if (showResult && score !== null) {
      const gradable = allFields.filter(q => q.correctAnswer && q.correctAnswer.trim() !== '');
      const pct = score.total > 0 ? Math.round((score.earned / score.total) * 100) : 0;
      const color = pct >= 80 ? '#00af89' : pct >= 50 ? '#f59e0b' : '#d92d20';
      return (
        <div className="wikiform-container" style={{ marginTop: 24, paddingBottom: 60 }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border-light)', borderTop: `4px solid ${color}`, borderRadius: '12px', padding: '32px', textAlign: 'center', marginBottom: 20 }}>
            <h2 style={{ color: 'var(--text-primary)', margin: '0 0 8px', fontSize: 22 }}>{remoteData?.title}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: '0 0 24px' }}>{T('your_result')}</p>
            <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', background: 'var(--bg)', border: `2px solid ${color}`, borderRadius: '16px', padding: '24px 48px', marginBottom: 24 }}>
              <span style={{ fontSize: 48, fontWeight: 900, color, lineHeight: 1 }}>{score.earned}</span>
              <span style={{ fontSize: 16, color: 'var(--text-muted)', margin: '4px 0' }}>/ {score.total}</span>
              <span style={{ fontSize: 28, fontWeight: 800, color }}>{pct}%</span>
            </div>
            <div style={{ width: '100%', background: 'var(--border-light)', borderRadius: 8, height: 10, maxWidth: 320, margin: '0 auto 8px' }}>
              <div style={{ width: `${pct}%`, background: color, borderRadius: 8, height: '100%', transition: 'width 0.8s ease' }} />
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
              {pct >= 80 ? T('excellent') : pct >= 50 ? T('good_job') : T('keep_practicing')}
            </p>
          </div>

          {gradable.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {gradable.map((q) => {
                const result = gradeResults?.find(r => r.id === q.id);
                const ua = (answers[q.id] || '').toString().trim();
                const isCorrect = ua !== '' && result?.correct;
                const feedback = isCorrect ? q.successMsg : q.failMsg;
                return (
                  <div key={q.id} style={{ background: 'var(--surface)', border: '1px solid var(--border-light)', borderLeft: `4px solid ${isCorrect ? '#00af89' : '#d92d20'}`, borderRadius: '10px', padding: '16px 20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)', flex: 1 }}>{q.text}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, padding: '3px 12px', borderRadius: 20, background: isCorrect ? '#00af8918' : '#d92d2018', color: isCorrect ? '#00af89' : '#d92d20', whiteSpace: 'nowrap' }}>
                        {isCorrect ? '✓ ' + T('correct') : '✗ ' + T('incorrect')}
                      </span>
                    </div>
                    {ua && <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '8px 0 0' }}>{T('your_answer_label')}<strong style={{ color: 'var(--text-secondary)' }}>{ua}</strong></p>}
                    {feedback && <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '6px 0 0', fontStyle: 'italic' }}>{feedback}</p>}
                  </div>
                );
              })}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <a href="/" className="wiki-btn" style={{ textDecoration: 'none', backgroundColor: accent, borderColor: accent }}>{T('back_home')}</a>
          </div>
        </div>
      );
    }

    return (
      <div className="wikiform-container" style={{ marginTop: 60, textAlign: 'center' }}>
        <div className="wiki-card" style={{ padding: '52px 32px', borderTop: '4px solid #00af89' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>✓</div>
          <h2 style={{ color: '#00af89', margin: '0 0 8px', fontSize: 24 }}>{T('thank_you')}</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: 15 }}>{T('response_recorded')}</p>
          {grading && <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 16 }}>{T('grading')}</p>}
          {gradeError && !grading && (
            <div style={{ marginBottom: 16 }}>
              <p style={{ color: '#d92d20', fontSize: 13, marginBottom: 10 }}>{T('grade_error')}</p>
              <button onClick={() => gradeAnswers(allFields.filter(q => q.correctAnswer && q.correctAnswer.trim() !== ''))} className="wiki-btn-secondary" style={{ padding: '8px 20px', fontSize: 13, fontWeight: 600 }}>
                {T('retry_grading')}
              </button>
            </div>
          )}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            {!isForm && !grading && !gradeError && resultTiming === 'instant' && (
              <button onClick={() => setShowResult(true)} className="wiki-btn" style={{ backgroundColor: accent, borderColor: accent, padding: '12px 28px', fontSize: 15, fontWeight: 700 }}>
                {T('view_result')}
              </button>
            )}
            {!isForm && !gradeError && resultTiming === 'delayed' && <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>{T('results_later')}</p>}
            <a href="/" className="wiki-btn" style={{ textDecoration: 'none', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-primary)', padding: '12px 28px' }}>{T('back_home')}</a>
          </div>
        </div>
      </div>
    );
  }

  // ===== START PAGE =====
  if (!isStarted) return (
    <div className="wikiform-container" style={{ marginTop: 32 }}>
      <div className="wiki-card" style={{ borderTop: `4px solid ${accent}`, padding: '36px 32px', textAlign: 'center', position: 'relative' }}>
        {canEdit && <button onClick={() => onEditForm(slug)} style={{ position: 'absolute', top: 16, right: 16, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '7px 14px', cursor: 'pointer', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600 }}><PencilIcon />{T('edit')}</button>}
        {coverImageUrl && <img src={coverImageUrl} alt="Cover" style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 8, marginBottom: 20 }} onError={e => { e.target.style.display = 'none'; }} />}
        <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 10px' }}>{remoteData?.title}</h1>
        {remoteData?.description && <p style={{ color: 'var(--text-secondary)', marginBottom: 24, fontSize: 15, lineHeight: 1.6 }}>{remoteData.description}</p>}
        {!isForm && <div style={{ display: 'inline-block', background: '#fff3cd', border: '1px solid #ffc107', color: '#856404', padding: '5px 14px', borderRadius: 6, fontSize: 13, fontWeight: 600, marginBottom: 20 }}>{T('anticheat_active')}</div>}
        <div>
          {!fetchedQuestions
            ? <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{T('preparing')}</p>
            : <button className="wiki-btn" onClick={() => setIsStarted(true)} style={{ padding: '12px 40px', fontSize: 16, fontWeight: 700, backgroundColor: accent, borderColor: accent }}>{isForm ? T('start_form') : T('start_quiz')}</button>
          }
        </div>
      </div>

      {canEdit && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border-light)', borderRadius: 8, marginTop: 16, overflow: 'hidden' }}>
          <div onClick={() => { setShowResponses(p => !p); if (!showResponses) loadResponses(); }} style={{ padding: '14px 20px', background: 'var(--bg)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>{T('responses')}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ transform: showResponses ? 'rotate(180deg)' : 'none', transition: '0.2s' }}><path d="m6 9 6 6 6-6"/></svg>
          </div>
          {showResponses && (
            <div style={{ padding: '16px 20px' }}>
              {loadingResponses
                ? <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{T('loading')}</p>
                : responses.length === 0
                  ? <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{T('no_responses')}</p>
                  : responses.map((r, i) => (
                    <div key={r.id} style={{ border: '1px solid var(--border-light)', borderRadius: 8, padding: '14px 16px', marginBottom: 10 }}>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, fontWeight: 600 }}>#{i + 1} — {r.timestamp}</div>
                      {Object.entries(r.answers).filter(([k]) => k !== '__email__').map(([q, a], idx) => (
                        <div key={idx} style={{ marginBottom: 6, fontSize: 14 }}>
                          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{q}:</span>{' '}
                          <span style={{ color: 'var(--text-secondary)' }}>{Array.isArray(a) ? a.join(', ') : (a || <i style={{ color: 'var(--text-muted)' }}>Empty</i>)}</span>
                        </div>
                      ))}
                    </div>
                  ))}
            </div>
          )}
        </div>
      )}
    </div>
  );

  // ===== QUIZ/FORM PAGE =====
  return (
    <div className="wikiform-container" style={{ marginTop: 24, paddingBottom: 80 }}>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border-light)', borderTop: `4px solid ${accent}`, borderRadius: 10, padding: '20px 28px', marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 800, color: 'var(--text-primary)' }}>{remoteData.title}</h1>
            {remoteData.description && <p style={{ color: 'var(--text-secondary)', fontSize: 13, margin: 0 }}>{remoteData.description}</p>}
          </div>
          {timeLeft !== null && (
            <div style={{ background: timeLeft < 60 ? '#fff0f0' : 'var(--bg)', border: `1px solid ${timeLeft < 60 ? '#d92d20' : 'var(--border)'}`, borderRadius: 8, padding: '8px 18px', textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{T('time_left')}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: timeLeft < 60 ? '#d92d20' : 'var(--text-primary)', fontFamily: 'monospace' }}>{formatTime(timeLeft)}</div>
            </div>
          )}
        </div>
      </div>

      {section.title && <div style={{ marginBottom: 16 }}><h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px' }}>{section.title}</h2>{section.description && <p style={{ color: 'var(--text-secondary)', fontSize: 14, margin: 0 }}>{section.description}</p>}</div>}

      {section.fields.length === 0 && finalSections.length === 1
        ? <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>{T('no_questions')}</div>
        : section.fields.map((f, i) => renderField(f, i))
      }

      {isLastSection && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border-light)', borderRadius: 10, padding: '18px 24px', marginTop: 10 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>{T('email_label')}</label>
          <input type="email" placeholder="email@example.com" value={autoEmail} onChange={e => setAutoEmail(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 6, fontSize: 14, boxSizing: 'border-box', background: 'var(--bg)', color: 'var(--text-primary)' }} />
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, flexWrap: 'wrap', gap: 10 }}>
        {currentSection > 0 && <button className="wiki-btn-secondary" onClick={() => setCurrentSection(s => s - 1)} style={{ padding: '12px 28px' }}>{T('back')}</button>}
        <div style={{ marginLeft: 'auto' }}>
          {!isLastSection
            ? <button className="wiki-btn" onClick={handleNext} style={{ padding: '12px 32px', fontWeight: 700, backgroundColor: accent, borderColor: accent }}>{T('next')}</button>
            : <button className="wiki-btn" onClick={handleSubmit} style={{ padding: '12px 36px', fontSize: 15, fontWeight: 700, backgroundColor: accent, borderColor: accent }}>{isForm ? T('submit_form') : T('submit_quiz')}</button>
          }
        </div>
      </div>

      {finalSections.length > 1 && (
        <div style={{ marginTop: 16, display: 'flex', gap: 6, justifyContent: 'center' }}>
          {finalSections.map((_, i) => <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: i === currentSection ? accent : 'var(--border)' }} />)}
        </div>
      )}
    </div>
  );
}

export default QuizViewer;
