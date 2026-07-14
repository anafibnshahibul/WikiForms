import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import WelcomeScreen from './components/WelcomeScreen';
const ContributeEditor = React.lazy(() => import('./components/ContributeEditor'));
const MyFormsDashboard = React.lazy(() => import('./components/MyFormsDashboard'));
import { loadLang } from './i18n';
const FormBuilder = React.lazy(() => import('./components/FormBuilder'));
import QuizViewer from './components/QuizViewer';

function App() {
  const [lang, setLang] = useState(() => localStorage.getItem('wf_lang') || 'en');
  const [translations, setTranslations] = useState({});
  const [langReady, setLangReady] = useState(true); // Always ready — FALLBACK keys load instantly
  const [appStep, setAppStep] = useState(() => window.location.pathname === '/create' ? 'builder' : 'welcome');
  const [contentType, setContentType] = useState('form');
  const [editSlug, setEditSlug] = useState(null);
  const [formTitle, setFormTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [questions, setQuestions] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [wikiUser, setWikiUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('wf_user')) || null; } catch { return null; }
  });
  const _path = window.location.pathname;
  const [isViewMode, setIsViewMode] = useState(() => _path.startsWith('/view/'));
  const [isContributeMode, setIsContributeMode] = useState(() => _path === '/contribute');
  const [isMyFormsMode, setIsMyFormsMode] = useState(() => _path === '/my-forms');
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [remoteData, setRemoteData] = useState(null);

  // Load only the active language on mount and on every switch.
  // Previously loaded languages are served from in-memory cache instantly.
  useEffect(() => {
    setLangReady(false);
    loadLang(lang).then(keys => {
      setTranslations(keys);
      setLangReady(true);
      localStorage.setItem('wf_lang', lang);
      document.documentElement.lang = lang;
    });
  }, [lang]);

  useEffect(() => {
    if (wikiUser) localStorage.setItem('wf_user', JSON.stringify(wikiUser));
    else localStorage.removeItem('wf_user');
  }, [wikiUser]);

  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith('/view/')) {
      const slug = path.replace('/view/', '');
      setLoading(true);
      // Only metadata is fetched here. Questions stay server-side until the user actually starts the form.
      fetch(`/api/get-form/${slug}`)
        .then(res => { if (!res.ok) throw new Error('Not found'); return res.json(); })
        .then(data => { setRemoteData({ ...data, id: slug }); setLoading(false); })
        .catch(() => { setRemoteData(null); setLoading(false); });
    }
  }, []);

  // T() uses live translations state; falls back to i18n module cache (which has FALLBACK).
  const T = (key, vars = {}) => {
    let val = translations[key] ?? key;
    if (val === key) val = key; // i18n module fallback already applied via loadLang
    Object.entries(vars).forEach(([k, v]) => { val = val.replace(`{${k}}`, v); });
    return val;
  };

  const applyLoginSuccess = async (u) => {
    const userData = {
      name: u.username,
      username: u.username,
      isAuthenticated: true,
      auth_token: u.auth_token || null,
    };
    setWikiUser(userData);
    localStorage.setItem('wf_user', JSON.stringify(userData));
    setStatusMessage(T('welcome_user', { name: u.username }) || `Welcome, ${u.username}!`);
    setTimeout(() => setStatusMessage(''), 3000);

    // Initialize main window session using the one-time token from the popup
    if (u.session_token) {
      try {
        await fetch('/api/auth/session-init', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ session_token: u.session_token }),
        });
      } catch (e) {}
    }
  };

  const handleWikipediaLogin = () => {
    const width = 600, height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    const popup = window.open('/api/auth/mediawiki', 'MediaWiki Login',
      `width=${width},height=${height},top=${top},left=${left},status=no,resizable=yes,scrollbars=yes`);

    // Primary path: postMessage
    const handleAuthMessage = (event) => {
      if (event.origin !== window.location.origin) return;
      if (event.data && event.data.type === 'WIKI_AUTH_SUCCESS') {
        applyLoginSuccess(event.data.user);
        window.removeEventListener('message', handleAuthMessage);
      }
    };
    window.addEventListener('message', handleAuthMessage);

    // Fallback: localStorage storage event
    const handleStorageEvent = (event) => {
      if (event.key !== 'wikiforms_auth_event' || !event.newValue) return;
      try {
        const parsed = JSON.parse(event.newValue);
        if (parsed.type === 'WIKI_AUTH_SUCCESS') {
          applyLoginSuccess(parsed.user);
          localStorage.removeItem('wikiforms_auth_event');
          window.removeEventListener('storage', handleStorageEvent);
        }
      } catch (e) {}
    };
    window.addEventListener('storage', handleStorageEvent);

    // Fallback 2: poll for popup close
    const pollTimer = setInterval(() => {
      if (popup && popup.closed) {
        clearInterval(pollTimer);
        try {
          const raw = localStorage.getItem('wikiforms_auth_event');
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed.type === 'WIKI_AUTH_SUCCESS') {
              applyLoginSuccess(parsed.user);
              localStorage.removeItem('wikiforms_auth_event');
            }
          }
        } catch (e) {}
      }
    }, 500);
  };

  const handleLogout = () => {
    setWikiUser(null);
    localStorage.removeItem('wf_user');
  };

  const handleEditForm = async (slug) => {
    try {
      const res = await fetch(`/api/get-form-for-edit/${slug}`, {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) { const err = await res.json(); alert(err.message || 'Permission denied.'); return; }
      const data = await res.json();
      setEditSlug(slug);
      setContentType(data.contentType || 'form');
      setFormTitle(data.title || '');
      setDescription(data.description || '');
      setCoverImage(data.cover_image || '');
      setCustomSlug(slug);
      const qs = (data.questions || []).map((q, i) => {
        if (typeof q === 'string') return { id: 'f_' + i, type: 'text', text: q, required: false, points: 5, options: ['Option 1', 'Option 2'], correctAnswer: '' };
        return { id: q.id || 'f_' + i, ...q };
      });
      setQuestions(qs);
      setGeneratedUrl('');
      setStatusMessage('');
      setIsEditMode(true);
      setAppStep('builder');
      window.history.pushState({}, '', '/create');
    } catch { alert('Failed to load form for editing.'); }
  };

  const submitConfiguration = async (timerData = {}) => {
    if (!formTitle.trim()) { setStatusMessage(T('provide_title')); return; }
    const generateSecureSlug = () => {
      const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let result = '';
      for (let i = 0; i < 22; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
      return result;
    };
    const finalSlug = customSlug.trim().replace(/\s+/g, '-') || generateSecureSlug();
    try {
      setStatusMessage(T('saving'));
      const res = await fetch('/api/save-form', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: finalSlug, contentType, title: formTitle, description,
          cover_image: coverImage, questions,
          owner_username: wikiUser?.username || 'Anonymous',
          timer_type: timerData.timerType || 'none',
          timer_duration: timerData.timerDuration || 0,
          timer_start: timerData.timerStart || null,
          timer_end: timerData.timerEnd || null,
          timer_before_msg: timerData.timerBeforeMsg || {},
          timer_after_msg: timerData.timerAfterMsg || {},
          result_timing: timerData.resultTiming || 'instant',
        }),
      });
      if (res.ok) {
        setGeneratedUrl(`${window.location.origin}/view/${finalSlug}`);
        setStatusMessage(T('published_success'));
        setEditSlug(null);
        setIsEditMode(false);
      } else {
        setStatusMessage(T('save_failed'));
      }
    } catch { setStatusMessage(T('server_error')); }
  };

  const handleSelectType = (type) => {
    setContentType(type); setQuestions([]); setFormTitle('');
    setDescription(''); setCoverImage(''); setCustomSlug('');
    setGeneratedUrl(''); setStatusMessage(''); setEditSlug(null);
    setIsEditMode(false); setAppStep('builder');
    window.history.pushState({}, '', '/create');
  };

  const handleCancel = () => {
    setAppStep('welcome'); setStatusMessage('');
    setEditSlug(null); setIsEditMode(false);
    window.history.pushState({}, '', '/');
  };

  const handleChangeLang = (l) => setLang(l);

  // App renders immediately — T() falls back to the key name until translations arrive.

  const showViewer = isViewMode && !isEditMode;
  const showBuilder = isEditMode || appStep === 'builder';
  const showContribute = isContributeMode && !isEditMode;
  const showMyForms = isMyFormsMode && !isEditMode;

  return (
    <div className="wikiform-main-layout">
      <Header wikiUser={wikiUser} onLogin={handleWikipediaLogin}
        onLogout={handleLogout} lang={lang} onChangeLanguage={handleChangeLang}
        T={T} translations={translations} />
      <main style={{ flex: 1 }}>
        {showMyForms ? (
          <React.Suspense fallback={<div className="wikiform-container" style={{ marginTop: 60, textAlign: 'center' }}>{T('loading')}</div>}>
            <MyFormsDashboard T={T} wikiUser={wikiUser} onLogin={handleWikipediaLogin} onEditForm={handleEditForm} onSelectType={handleSelectType} />
          </React.Suspense>
        ) : showContribute ? (
          <React.Suspense fallback={<div className="wikiform-container" style={{ marginTop: 60, textAlign: 'center' }}>{T('loading')}</div>}>
            <ContributeEditor T={T} wikiUser={wikiUser} onLogin={handleWikipediaLogin} lang={lang} />
          </React.Suspense>
        ) : showViewer ? (
          loading
            ? <div className="wikiform-container" style={{ marginTop: 60, textAlign: 'center' }}>{T('loading')}</div>
            : !remoteData
              ? <div className="wikiform-container" style={{ marginTop: 60, textAlign: 'center' }}><h2>{T('form_not_found')}</h2></div>
              : <QuizViewer lang={lang} T={T} remoteData={remoteData} wikiUser={wikiUser} onLogin={handleWikipediaLogin} onEditForm={handleEditForm} />
        ) : showBuilder ? (
          <React.Suspense fallback={<div className="wikiform-container" style={{ marginTop: 60, textAlign: 'center' }}>{T('loading_editor')}</div>}>
            <FormBuilder
              lang={lang} T={T} contentType={contentType} editSlug={editSlug}
              formTitle={formTitle} setFormTitle={setFormTitle}
              description={description} setDescription={setDescription}
              coverImage={coverImage} setCoverImage={setCoverImage}
              customSlug={customSlug} setCustomSlug={setCustomSlug}
              questions={questions} setQuestions={setQuestions}
              statusMessage={statusMessage} generatedUrl={generatedUrl}
              submitConfiguration={submitConfiguration} onCancel={handleCancel}
              wikiUser={wikiUser} onLogin={handleWikipediaLogin}
            />
          </React.Suspense>
        ) : (
          <WelcomeScreen T={T} onSelectType={handleSelectType} lang={lang} />
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;
