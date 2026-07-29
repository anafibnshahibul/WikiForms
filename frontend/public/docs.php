<?php
$version = '2.0.0';
$base    = 'https://wikiforms.toolforge.org';
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>WikiForms API Docs — v<?= $version ?></title>
  <meta name="description" content="Complete API reference for WikiForms — open-source form and quiz builder for the Wikimedia ecosystem." />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --blue: #3366cc; --blue-light: #eaf3ff; --blue-dark: #1e40af;
      --green: #00af89; --green-light: #e6faf5;
      --red: #d92d20; --red-light: #fff0f0;
      --yellow: #f59e0b; --yellow-light: #fffaeb;
      --purple: #7c3aed; --purple-light: #f3f0ff;
      --bg: #f8f9fa; --surface: #ffffff;
      --border: #e2e8f0; --border-dark: #cbd5e0;
      --text: #0f172a; --text-secondary: #334155; --muted: #64748b;
      --code-bg: #0f172a; --code-text: #e2e8f0;
      --sidebar-width: 272px;
    }

    html { scroll-behavior: smooth; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: var(--bg); color: var(--text); line-height: 1.6; font-size: 15px; }

    /* ── Layout ── */
    .layout { display: flex; min-height: 100vh; }
    .sidebar { width: var(--sidebar-width); background: var(--surface); border-right: 1px solid var(--border); padding: 0; position: sticky; top: 0; height: 100vh; overflow-y: auto; flex-shrink: 0; display: flex; flex-direction: column; }
    .content { flex: 1; padding: 56px 48px; max-width: 900px; min-width: 0; }

    /* ── Sidebar ── */
    .sidebar-logo { display: flex; align-items: center; gap: 12px; padding: 20px 20px 20px; border-bottom: 1px solid var(--border); text-decoration: none; background: var(--surface); }
    .sidebar-logo strong { font-size: 15px; font-weight: 700; color: var(--text); }
    .sidebar-logo span { font-size: 11px; color: var(--muted); display: block; margin-top: 1px; }
    .sidebar-nav { padding: 12px 0 24px; flex: 1; }
    .sidebar-section { font-size: 10px; font-weight: 800; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; padding: 16px 20px 6px; }
    .sidebar a { display: flex; align-items: center; gap: 8px; padding: 6px 20px; font-size: 13px; color: var(--text-secondary); text-decoration: none; border-left: 2px solid transparent; transition: all 0.12s; }
    .sidebar a:hover { color: var(--blue); background: var(--blue-light); }
    .sidebar a.active { color: var(--blue); border-left-color: var(--blue); background: var(--blue-light); font-weight: 600; }
    .sidebar-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--border-dark); flex-shrink: 0; }
    .sidebar a.active .sidebar-dot, .sidebar a:hover .sidebar-dot { background: var(--blue); }
    .sidebar-footer { padding: 16px 20px; border-top: 1px solid var(--border); font-size: 12px; color: var(--muted); }
    .sidebar-footer a { color: var(--blue); text-decoration: none; font-size: 12px; border: none; padding: 0; display: inline; }

    /* ── Typography ── */
    h1 { font-size: 32px; font-weight: 900; color: var(--text); margin-bottom: 8px; letter-spacing: -0.5px; }
    h2 { font-size: 22px; font-weight: 800; color: var(--text); margin: 56px 0 4px; padding-top: 56px; border-top: 1px solid var(--border); letter-spacing: -0.3px; }
    h2:first-of-type { margin-top: 0; padding-top: 0; border-top: none; }
    h2 .section-tag { font-size: 11px; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 0.8px; display: block; margin-bottom: 4px; }
    h3 { font-size: 14px; font-weight: 700; color: var(--text); margin: 24px 0 8px; text-transform: uppercase; letter-spacing: 0.5px; }
    p { color: var(--text-secondary); margin-bottom: 12px; font-size: 14px; line-height: 1.7; }
    a { color: var(--blue); text-decoration: none; }
    a:hover { text-decoration: underline; }
    strong { color: var(--text); }

    /* ── Hero ── */
    .hero { background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%); border-radius: 12px; padding: 40px; margin-bottom: 40px; color: white; position: relative; overflow: hidden; }
    .hero::before { content: ''; position: absolute; top: -40px; right: -40px; width: 200px; height: 200px; background: radial-gradient(circle, rgba(51,102,204,0.3) 0%, transparent 70%); }
    .hero::after { content: ''; position: absolute; bottom: -20px; left: 30%; width: 150px; height: 150px; background: radial-gradient(circle, rgba(0,175,137,0.2) 0%, transparent 70%); }
    .hero h1 { color: white; margin-bottom: 8px; }
    .hero p { color: rgba(255,255,255,0.7); margin-bottom: 24px; font-size: 15px; }
    .hero-chips { display: flex; gap: 8px; flex-wrap: wrap; position: relative; z-index: 1; }
    .chip { font-size: 12px; font-weight: 600; padding: 5px 14px; border-radius: 20px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: rgba(255,255,255,0.9); }
    .chip.chip-green { background: rgba(0,175,137,0.2); border-color: rgba(0,175,137,0.4); color: #4ade80; }

    /* ── Endpoint card ── */
    .endpoint { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; margin-bottom: 12px; overflow: hidden; transition: box-shadow 0.15s; }
    .endpoint:hover { box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
    .endpoint-header { display: flex; align-items: center; gap: 12px; padding: 14px 18px; cursor: pointer; user-select: none; gap: 10px; }
    .endpoint-header:hover { background: var(--bg); }
    .method { font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 4px; letter-spacing: 0.5px; flex-shrink: 0; font-family: monospace; }
    .GET  { background: var(--green-light); color: #065f46; }
    .POST { background: var(--blue-light); color: var(--blue-dark); }
    .endpoint-path { font-family: 'Fira Code', 'Cascadia Code', 'Consolas', monospace; font-size: 13px; font-weight: 600; color: var(--text); flex: 1; }
    .endpoint-badges { display: flex; gap: 6px; align-items: center; margin-left: auto; }
    .endpoint-chevron { color: var(--muted); transition: transform 0.2s; flex-shrink: 0; }
    .endpoint-header.open .endpoint-chevron { transform: rotate(180deg); }
    .endpoint-body { padding: 0 20px 20px; border-top: 1px solid var(--border); display: none; background: var(--bg); }
    .endpoint-body.open { display: block; }
    .endpoint-body > p:first-child { margin-top: 16px; }

    /* ── Code ── */
    .code-block { position: relative; margin: 12px 0; }
    .code-lang { position: absolute; top: 10px; right: 44px; font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.8px; }
    .copy-btn { position: absolute; top: 8px; right: 8px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12); color: #94a3b8; border-radius: 4px; padding: 4px 10px; font-size: 11px; cursor: pointer; font-weight: 600; transition: all 0.15s; }
    .copy-btn:hover { background: rgba(255,255,255,0.15); color: white; }
    .copy-btn.copied { color: #4ade80; border-color: #4ade80; }
    pre { background: var(--code-bg); color: var(--code-text); border-radius: 8px; padding: 18px 16px; font-size: 12.5px; overflow-x: auto; line-height: 1.75; tab-size: 2; }
    code { font-family: 'Fira Code', 'Cascadia Code', 'Consolas', monospace; }
    .inline-code { background: #f1f5f9; color: #0f172a; padding: 2px 7px; border-radius: 4px; font-size: 12.5px; font-family: monospace; border: 1px solid var(--border); }

    /* Syntax highlight classes */
    .kw { color: #c792ea; }
    .fn { color: #82aaff; }
    .str { color: #c3e88d; }
    .cm { color: #546e7a; font-style: italic; }
    .num { color: #f78c6c; }
    .key { color: #80cbc4; }

    /* ── Table ── */
    .table-wrap { overflow-x: auto; margin: 12px 0; border-radius: 6px; border: 1px solid var(--border); }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th { background: var(--bg); padding: 10px 14px; text-align: left; font-weight: 700; color: var(--text); border-bottom: 1px solid var(--border); font-size: 12px; text-transform: uppercase; letter-spacing: 0.4px; }
    td { padding: 10px 14px; border-bottom: 1px solid var(--border); color: var(--text-secondary); vertical-align: top; line-height: 1.5; }
    tr:last-child td { border-bottom: none; }
    td code { background: #f1f5f9; padding: 1px 6px; border-radius: 3px; font-size: 12px; color: var(--blue); border: 1px solid var(--border); }
    td.req-yes { color: var(--green); font-weight: 700; }
    td.req-no { color: var(--muted); }

    /* ── Badges ── */
    .badge { display: inline-flex; align-items: center; gap: 4px; font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 4px; letter-spacing: 0.3px; white-space: nowrap; }
    .badge-auth   { background: #fffbeb; color: #92400e; border: 1px solid #fde68a; }
    .badge-owner  { background: var(--purple-light); color: var(--purple); border: 1px solid #ddd6fe; }
    .badge-public { background: var(--green-light); color: #065f46; border: 1px solid #a7f3d0; }
    .badge-cached { background: var(--blue-light); color: var(--blue-dark); border: 1px solid #bfdbfe; }
    .badge-new    { background: #fef3c7; color: #92400e; border: 1px solid #fcd34d; }

    /* ── Alerts ── */
    .alert { border-radius: 6px; padding: 13px 16px; margin: 14px 0; font-size: 13.5px; line-height: 1.6; display: flex; gap: 10px; }
    .alert-icon { flex-shrink: 0; margin-top: 1px; }
    .alert-info   { background: var(--blue-light); border: 1px solid #bfdbfe; color: var(--blue-dark); }
    .alert-warn   { background: var(--yellow-light); border: 1px solid #fde68a; color: #92400e; }
    .alert-success { background: var(--green-light); border: 1px solid #a7f3d0; color: #065f46; }
    .alert-danger  { background: var(--red-light); border: 1px solid #fca5a5; color: #991b1b; }

    /* ── Rate limit pill ── */
    .rate-pill { display: inline-block; font-size: 11px; background: #fef3c7; color: #92400e; padding: 2px 10px; border-radius: 20px; font-weight: 700; border: 1px solid #fde68a; }

    /* ── Security section ── */
    .security-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 16px 0; }
    .security-card { background: var(--surface); border: 1px solid var(--border); border-radius: 6px; padding: 14px 16px; }
    .security-card h4 { font-size: 13px; font-weight: 700; color: var(--text); margin-bottom: 4px; display: flex; align-items: center; gap: 6px; }
    .security-card p { font-size: 12px; margin: 0; color: var(--muted); }

    /* ── Question types ── */
    .type-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin: 12px 0; }
    .type-card { background: var(--surface); border: 1px solid var(--border); border-radius: 6px; padding: 10px 14px; font-size: 12px; }
    .type-card .type-name { font-weight: 700; color: var(--text); font-family: monospace; font-size: 13px; }
    .type-card .type-desc { color: var(--muted); margin-top: 2px; }
    .type-card .type-ai { font-size: 10px; font-weight: 700; padding: 1px 6px; border-radius: 3px; margin-top: 4px; display: inline-block; }
    .ai-yes { background: var(--blue-light); color: var(--blue); }
    .ai-no  { background: var(--green-light); color: #065f46; }

    /* ── Changelog ── */
    .changelog-item { display: flex; gap: 14px; margin-bottom: 20px; }
    .changelog-ver { font-size: 12px; font-weight: 800; color: var(--blue); background: var(--blue-light); padding: 3px 10px; border-radius: 4px; white-space: nowrap; height: fit-content; margin-top: 2px; font-family: monospace; }
    .changelog-content h4 { font-size: 14px; font-weight: 700; color: var(--text); margin-bottom: 4px; }
    .changelog-content ul { padding-left: 16px; }
    .changelog-content li { font-size: 13px; color: var(--text-secondary); margin-bottom: 3px; }

    /* ── Misc ── */
    .divider { border: none; border-top: 1px solid var(--border); margin: 32px 0; }
    .tag-new { font-size: 10px; font-weight: 700; background: #fef3c7; color: #92400e; padding: 1px 6px; border-radius: 3px; margin-left: 6px; vertical-align: middle; }
    .response-example { background: #0a1628; border: 1px solid #1e3a5f; border-radius: 8px; padding: 16px; margin: 10px 0; }
    .response-example .res-label { font-size: 10px; font-weight: 700; color: #4ade80; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }

    @media (max-width: 900px) {
      .security-grid { grid-template-columns: 1fr; }
      .type-grid { grid-template-columns: 1fr 1fr; }
    }
    @media (max-width: 768px) {
      .layout { flex-direction: column; }
      .sidebar { width: 100%; height: auto; position: static; }
      .content { padding: 24px 16px; }
      .type-grid { grid-template-columns: 1fr; }
      .hero { padding: 24px; }
    }
  </style>
</head>
<body>
<div class="layout">

  <!-- ══ Sidebar ══ -->
  <nav class="sidebar">
    <a class="sidebar-logo" href="/">
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="6" fill="#3366cc"/>
        <path d="M9 10L12 21L15 13L18 21L21 10" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="24" cy="24" r="5" fill="#00af89"/>
        <path d="M22 24L23.5 25.5L26 22.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <div>
        <strong>WikiForms API</strong>
        <span>v<?= $version ?> Reference</span>
      </div>
    </a>

    <div class="sidebar-nav">
      <div class="sidebar-section">Getting Started</div>
      <a href="#intro"><span class="sidebar-dot"></span>Introduction</a>
      <a href="#quickstart"><span class="sidebar-dot"></span>Quick Start</a>
      <a href="#auth"><span class="sidebar-dot"></span>Authentication</a>
      <a href="#security"><span class="sidebar-dot"></span>Security</a>
      <a href="#rate-limits"><span class="sidebar-dot"></span>Rate Limits</a>
      <a href="#errors"><span class="sidebar-dot"></span>Error Codes</a>
      <a href="#question-types"><span class="sidebar-dot"></span>Question Types</a>

      <div class="sidebar-section">Forms</div>
      <a href="#save-form"><span class="sidebar-dot"></span>Save Form</a>
      <a href="#get-form"><span class="sidebar-dot"></span>Get Metadata</a>
      <a href="#get-form-questions"><span class="sidebar-dot"></span>Get Questions</a>
      <a href="#my-forms"><span class="sidebar-dot"></span>My Forms</a>

      <div class="sidebar-section">Responses</div>
      <a href="#save-response"><span class="sidebar-dot"></span>Save Response</a>
      <a href="#get-responses"><span class="sidebar-dot"></span>Get Responses</a>
      <a href="#grade-response"><span class="sidebar-dot"></span>Grade (AI)</a>

      <div class="sidebar-section">Anti-Cheat</div>
      <a href="#quiz-start"><span class="sidebar-dot"></span>Start Session</a>
      <a href="#quiz-heartbeat"><span class="sidebar-dot"></span>Heartbeat</a>
      <a href="#quiz-validate"><span class="sidebar-dot"></span>Validate Session</a>

      <div class="sidebar-section">Collaborators</div>
      <a href="#add-collaborator"><span class="sidebar-dot"></span>Add Collaborator</a>
      <a href="#remove-collaborator"><span class="sidebar-dot"></span>Remove Collaborator</a>

      <div class="sidebar-section">i18n</div>
      <a href="#usr-lang"><span class="sidebar-dot"></span>Get Translations</a>
      <a href="#editor"><span class="sidebar-dot"></span>Save Draft</a>
      <a href="#publisher"><span class="sidebar-dot"></span>Publish Translation</a>

      <div class="sidebar-section">Misc</div>
      <a href="#test-connection"><span class="sidebar-dot"></span>Health Check</a>
      <a href="#changelog"><span class="sidebar-dot"></span>Changelog</a>
    </div>

    <div class="sidebar-footer">
      <a href="https://github.com/anafibnshahibul/WikiForms" target="_blank">GitHub ↗</a> ·
      <a href="/">Home</a> ·
      <a href="/hall-of-fame.php">Hall of Fame</a>
    </div>
  </nav>

  <!-- ══ Content ══ -->
  <main class="content">

    <!-- Hero -->
    <div class="hero">
      <h1>WikiForms API</h1>
      <p>Complete REST API reference for building forms and quizzes on the Wikimedia ecosystem. Open-source, free, and Wikimedia-native.</p>
      <div class="hero-chips">
        <span class="chip">Base: <?= $base ?>/api</span>
        <span class="chip">v<?= $version ?></span>
        <span class="chip">JSON only</span>
        <span class="chip">MediaWiki OAuth 2.0</span>
        <span class="chip chip-green">Open Source · MIT</span>
      </div>
    </div>

    <!-- ── Introduction ── -->
    <h2 id="intro"><span class="section-tag">Overview</span>Introduction</h2>
    <p>WikiForms is a free, open-source form and quiz builder hosted on <a href="https://toolforge.org" target="_blank">Wikimedia Toolforge</a>. It allows Wikipedia editors, researchers, and community members to create structured forms and AI-proctored quizzes without leaving the Wikimedia ecosystem.</p>
    <p>All API endpoints are prefixed with <span class="inline-code">/api/</span>, accept and return <strong>JSON</strong>, and always include a <span class="inline-code">status</span> field in the response (<span class="inline-code">"success"</span> or <span class="inline-code">"error"</span>).</p>

    <div class="alert alert-info">
      <span class="alert-icon">ℹ️</span>
      <div>WikiForms is hosted on <strong>Wikimedia Toolforge Kubernetes</strong>. The API is publicly accessible but rate-limited. All form questions are encrypted at rest with AES-256-CBC.</div>
    </div>

    <!-- ── Quick Start ── -->
    <h2 id="quickstart"><span class="section-tag">Getting Started</span>Quick Start</h2>
    <p>Here's everything you need to create a quiz and collect responses in under 5 minutes.</p>

    <h3>Step 1 — Create a quiz</h3>
    <div class="code-block">
      <span class="code-lang">JS</span>
      <button class="copy-btn" onclick="copyCode(this)">Copy</button>
      <pre><code><span class="cm">// Requires Wikipedia login — send X-WF-Token header</span>
<span class="kw">const</span> res = <span class="kw">await</span> <span class="fn">fetch</span>(<span class="str">'/api/save-form'</span>, {
  method: <span class="str">'POST'</span>,
  headers: {
    <span class="str">'Content-Type'</span>: <span class="str">'application/json'</span>,
    <span class="str">'X-WF-Token'</span>: <span class="str">'YOUR_AUTH_TOKEN'</span>
  },
  body: <span class="fn">JSON.stringify</span>({
    slug: <span class="str">'my-first-quiz'</span>,
    contentType: <span class="str">'quiz'</span>,
    title: <span class="str">'My First Quiz'</span>,
    questions: [{
      id: <span class="str">'q1'</span>, type: <span class="str">'radio'</span>,
      text: <span class="str">'Capital of Bangladesh?'</span>,
      options: [<span class="str">'Dhaka'</span>, <span class="str">'Chittagong'</span>, <span class="str">'Sylhet'</span>],
      correctAnswer: <span class="str">'Dhaka'</span>, points: <span class="num">10</span>, required: <span class="kw">true</span>
    }],
    result_timing: <span class="str">'instant'</span>
  })
});
<span class="cm">// → { status: 'success' }</span></code></pre>
    </div>

    <h3>Step 2 — Submit an answer</h3>
    <div class="code-block">
      <span class="code-lang">JS</span>
      <button class="copy-btn" onclick="copyCode(this)">Copy</button>
      <pre><code><span class="kw">const</span> res = <span class="kw">await</span> <span class="fn">fetch</span>(<span class="str">'/api/save-response'</span>, {
  method: <span class="str">'POST'</span>,
  headers: { <span class="str">'Content-Type'</span>: <span class="str">'application/json'</span> },
  body: <span class="fn">JSON.stringify</span>({
    form_slug: <span class="str">'my-first-quiz'</span>,
    title: <span class="str">'My First Quiz'</span>,
    type: <span class="str">'quiz'</span>,
    answers: { q1: <span class="str">'Dhaka'</span> }
  })
});
<span class="kw">const</span> data = <span class="kw">await</span> res.<span class="fn">json</span>();
<span class="cm">// Server grades server-side — correct answers never sent to client:</span>
<span class="cm">// { status: 'success', score: { earned: 10, total: 10, results: [...] } }</span></code></pre>
    </div>

    <!-- ── Authentication ── -->
    <h2 id="auth"><span class="section-tag">Getting Started</span>Authentication</h2>
    <p>WikiForms uses <strong>MediaWiki OAuth 2.0</strong> via <span class="inline-code">meta.wikimedia.org</span>. Public read endpoints require no auth. Write operations (save form, add collaborator, publish translation) require a valid <span class="inline-code">X-WF-Token</span> header.</p>

    <div class="alert alert-info">
      <span class="alert-icon">🔑</span>
      <div>Tokens are 64-character hex strings stored in the <span class="inline-code">auth_tokens</span> table with a <strong>30-day expiry</strong>. After <span class="inline-code">APP_KEY</span> rotation, all existing tokens are invalidated and users must re-login.</div>
    </div>

    <div class="endpoint">
      <div class="endpoint-header" onclick="toggle(this)">
        <span class="method GET">GET</span>
        <span class="endpoint-path">/api/auth/mediawiki</span>
        <div class="endpoint-badges"><span class="badge badge-public">Public</span></div>
        <svg class="endpoint-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
      </div>
      <div class="endpoint-body">
        <p>Starts the OAuth 2.0 login flow. Redirects to MediaWiki authorization. Open in a popup — on success, the popup posts a <span class="inline-code">WIKI_AUTH_SUCCESS</span> message to the opener window.</p>
        <div class="code-block">
          <button class="copy-btn" onclick="copyCode(this)">Copy</button>
          <pre><code><span class="kw">const</span> popup = window.<span class="fn">open</span>(
  <span class="str">'<?= $base ?>/api/auth/mediawiki'</span>,
  <span class="str">'WikiForms Login'</span>,
  <span class="str">'width=600,height=600,popup=1'</span>
);

window.<span class="fn">addEventListener</span>(<span class="str">'message'</span>, (e) => {
  <span class="kw">if</span> (e.data.type === <span class="str">'WIKI_AUTH_SUCCESS'</span>) {
    <span class="kw">const</span> { username, auth_token } = e.data.user;
    <span class="cm">// Store token — send as X-WF-Token on all protected requests</span>
    localStorage.<span class="fn">setItem</span>(<span class="str">'wf_user'</span>, <span class="fn">JSON.stringify</span>(e.data.user));
  }
});</code></pre>
        </div>
        <p>After login, include the token on protected requests:</p>
        <div class="code-block">
          <button class="copy-btn" onclick="copyCode(this)">Copy</button>
          <pre><code>headers: {
  <span class="str">'Content-Type'</span>: <span class="str">'application/json'</span>,
  <span class="str">'X-WF-Token'</span>: user.auth_token
}</code></pre>
        </div>
      </div>
    </div>

    <div class="endpoint">
      <div class="endpoint-header" onclick="toggle(this)">
        <span class="method GET">GET</span>
        <span class="endpoint-path">/api/auth/me</span>
        <div class="endpoint-badges"><span class="badge badge-public">Public</span></div>
        <svg class="endpoint-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
      </div>
      <div class="endpoint-body">
        <p>Returns the currently authenticated user. Returns <span class="inline-code">{ status: 'guest' }</span> if not logged in.</p>
        <div class="code-block">
          <button class="copy-btn" onclick="copyCode(this)">Copy</button>
          <pre><code><span class="kw">const</span> data = <span class="kw">await</span> <span class="fn">fetch</span>(<span class="str">'/api/auth/me'</span>).<span class="fn">then</span>(r => r.<span class="fn">json</span>());
<span class="cm">// Logged in:  { status: 'success', username: 'Anaf' }</span>
<span class="cm">// Logged out: { status: 'guest' }</span></code></pre>
        </div>
      </div>
    </div>

    <!-- ── Security ── -->
    <h2 id="security"><span class="section-tag">Getting Started</span>Security</h2>
    <p>WikiForms implements multiple layers of security at both the server and application level.</p>
    <div class="security-grid">
      <div class="security-card">
        <h4>🔒 AES-256-CBC Encryption</h4>
        <p>All form questions encrypted at rest via Laravel's Crypt facade. Correct answers never reach the client.</p>
      </div>
      <div class="security-card">
        <h4>🛡️ Origin Enforcement</h4>
        <p>Browser requests from unauthorized origins are blocked (error code 677). Checked at both lighttpd and Laravel levels.</p>
      </div>
      <div class="security-card">
        <h4>🤖 Bot Blocking</h4>
        <p>Known scanner UAs (sqlmap, nikto, nmap, masscan, python-requests, wget, curl, etc.) are blocked at the API gate.</p>
      </div>
      <div class="security-card">
        <h4>📦 Request Size Limit</h4>
        <p>Requests over 1MB are rejected with HTTP 413 to prevent payload flooding attacks.</p>
      </div>
      <div class="security-card">
        <h4>⚡ Rate Limiting</h4>
        <p>Per-IP rate limiting via Laravel throttle middleware. Tighter limits on grading and submission endpoints.</p>
      </div>
      <div class="security-card">
        <h4>🧹 Token Cleanup</h4>
        <p>Expired auth tokens and old quiz sessions are automatically cleaned up (1% chance per request).</p>
      </div>
      <div class="security-card">
        <h4>🎯 Anti-Cheat System</h4>
        <p>Server-side heartbeat sessions with 5-second gap detection. Tab switches, DevTools, and keyboard shortcuts blocked client-side.</p>
      </div>
      <div class="security-card">
        <h4>✅ Input Validation</h4>
        <p>All endpoints validate: slug regex, contentType enum, cover_image URL format, result_timing enum, and array max sizes.</p>
      </div>
    </div>

    <!-- ── Rate Limits ── -->
    <h2 id="rate-limits"><span class="section-tag">Getting Started</span>Rate Limits</h2>
    <p>All endpoints are rate-limited per IP address. Exceeding any limit returns <strong>HTTP 429</strong> with a <span class="inline-code">Retry-After</span> header.</p>
    <div class="table-wrap">
      <table>
        <tr><th>Endpoint</th><th>Limit</th><th>Reason</th></tr>
        <tr><td>All endpoints (default)</td><td><span class="rate-pill">20 req / min</span></td><td>General abuse prevention</td></tr>
        <tr><td><code>/api/save-response</code></td><td><span class="rate-pill">10 req / min</span></td><td>Spam submission prevention</td></tr>
        <tr><td><code>/api/grade-response</code></td><td><span class="rate-pill">5 req / min</span></td><td>AI API cost protection</td></tr>
        <tr><td><code>/api/quiz/start</code></td><td><span class="rate-pill">10 req / min</span></td><td>Session abuse prevention</td></tr>
        <tr><td><code>/api/quiz/validate-session</code></td><td><span class="rate-pill">10 req / min</span></td><td>Session abuse prevention</td></tr>
        <tr><td><code>/api/usr-lang/{lang}</code></td><td>Cached 10 min (server) + 5 min (CDN)</td><td>DB load reduction</td></tr>
      </table>
    </div>

    <!-- ── Error Codes ── -->
    <h2 id="errors"><span class="section-tag">Getting Started</span>Error Codes</h2>
    <div class="table-wrap">
      <table>
        <tr><th>HTTP Code</th><th>Meaning</th><th>Common Cause</th></tr>
        <tr><td><code>200</code></td><td>Success</td><td>Request completed normally</td></tr>
        <tr><td><code>400</code></td><td>Bad Request</td><td>Validation failed — check request body fields</td></tr>
        <tr><td><code>403</code></td><td>Forbidden</td><td>Missing/expired token, unauthorized origin, or insufficient permissions</td></tr>
        <tr><td><code>404</code></td><td>Not Found</td><td>Form/resource with that slug doesn't exist</td></tr>
        <tr><td><code>413</code></td><td>Request Too Large</td><td>Body exceeds 1MB limit</td></tr>
        <tr><td><code>429</code></td><td>Rate Limited</td><td>Too many requests — wait 1 minute</td></tr>
        <tr><td><code>500</code></td><td>Server Error</td><td>Unexpected backend error — check logs</td></tr>
        <tr><td><code>502</code></td><td>Bad Gateway</td><td>OpenRouter AI service returned an invalid response</td></tr>
        <tr><td><code>503</code></td><td>Service Unavailable</td><td>AI grading failed after all retries — try again shortly</td></tr>
        <tr><td><code>677</code></td><td>Unauthorized Origin <span class="tag-new">Custom</span></td><td>Cross-origin request from unauthorized domain blocked</td></tr>
      </table>
    </div>

    <div class="alert alert-warn">
      <span class="alert-icon">⚠️</span>
      <div>Error code <strong>677</strong> is a WikiForms-specific code returned inside a 403 response body. Check for <span class="inline-code">data.code === 677</span> to distinguish it from regular permission errors.</div>
    </div>

    <!-- ── Question Types ── -->
    <h2 id="question-types"><span class="section-tag">Reference</span>Question Types</h2>
    <p>Every question object in the <span class="inline-code">questions</span> array has a <span class="inline-code">type</span> field. Grading method depends on type — exact-match types are graded locally, open-ended types use OpenRouter AI.</p>
    <div class="type-grid">
      <div class="type-card"><div class="type-name">text</div><div class="type-desc">Single-line text input</div><span class="type-ai ai-yes">AI graded</span></div>
      <div class="type-card"><div class="type-name">textarea</div><div class="type-desc">Multi-line text input</div><span class="type-ai ai-yes">AI graded</span></div>
      <div class="type-card"><div class="type-name">radio</div><div class="type-desc">Single choice from options</div><span class="type-ai ai-no">Exact match</span></div>
      <div class="type-card"><div class="type-name">checkbox</div><div class="type-desc">Multiple choice from options</div><span class="type-ai ai-no">Exact match</span></div>
      <div class="type-card"><div class="type-name">select</div><div class="type-desc">Dropdown selection</div><span class="type-ai ai-no">Exact match</span></div>
      <div class="type-card"><div class="type-name">true_false</div><div class="type-desc">True / False choice</div><span class="type-ai ai-no">Exact match</span></div>
      <div class="type-card"><div class="type-name">email</div><div class="type-desc">Email address input</div><span class="type-ai ai-no">Not graded</span></div>
      <div class="type-card"><div class="type-name">number</div><div class="type-desc">Numeric input</div><span class="type-ai ai-no">Not graded</span></div>
      <div class="type-card"><div class="type-name">star</div><div class="type-desc">Star rating (1–N)</div><span class="type-ai ai-no">Not graded</span></div>
      <div class="type-card"><div class="type-name">section</div><div class="type-desc">Section divider/header</div><span class="type-ai ai-no">Not a question</span></div>
    </div>

    <h3>Question Object Schema</h3>
    <div class="table-wrap">
      <table>
        <tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr>
        <tr><td><code>id</code></td><td>string</td><td class="req-yes">✅</td><td>Unique identifier within the form (e.g. <code>q1</code>, <code>uuid</code>)</td></tr>
        <tr><td><code>type</code></td><td>string</td><td class="req-yes">✅</td><td>One of the question types above</td></tr>
        <tr><td><code>text</code></td><td>string</td><td class="req-yes">✅</td><td>Question text — supports HTML (from RichTextEditor)</td></tr>
        <tr><td><code>required</code></td><td>boolean</td><td class="req-no">—</td><td>Whether an answer is mandatory before submission</td></tr>
        <tr><td><code>options</code></td><td>string[]</td><td class="req-no">—</td><td>Choices for radio/checkbox/select types</td></tr>
        <tr><td><code>correctAnswer</code></td><td>string</td><td class="req-no">—</td><td>Expected answer for quiz grading (encrypted at rest)</td></tr>
        <tr><td><code>points</code></td><td>integer</td><td class="req-no">—</td><td>Points awarded for a correct answer</td></tr>
        <tr><td><code>successMsg</code></td><td>string</td><td class="req-no">—</td><td>Feedback shown when answer is correct</td></tr>
        <tr><td><code>failMsg</code></td><td>string</td><td class="req-no">—</td><td>Feedback shown when answer is incorrect</td></tr>
        <tr><td><code>starMax</code></td><td>integer</td><td class="req-no">—</td><td>Max star rating value (default: 5)</td></tr>
        <tr><td><code>description</code></td><td>string</td><td class="req-no">—</td><td>Sub-text shown below question (section type)</td></tr>
      </table>
    </div>

    <!-- ══ FORMS ══ -->
    <h2 id="save-form"><span class="section-tag">Forms</span>Save Form</h2>
    <div class="endpoint">
      <div class="endpoint-header" onclick="toggle(this)">
        <span class="method POST">POST</span>
        <span class="endpoint-path">/api/save-form</span>
        <div class="endpoint-badges"><span class="badge badge-auth">Auth required</span></div>
        <svg class="endpoint-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
      </div>
      <div class="endpoint-body">
        <p>Creates or updates a form/quiz. If the slug already exists, ownership is verified before updating. Questions are AES-256-CBC encrypted before storage — <strong>correct answers never stored in plaintext</strong>.</p>
        <h3>Request Body</h3>
        <div class="table-wrap">
          <table>
            <tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr>
            <tr><td><code>slug</code></td><td>string</td><td class="req-yes">✅</td><td>URL identifier — alphanumeric, hyphens, underscores only (max 100)</td></tr>
            <tr><td><code>contentType</code></td><td><code>form</code> | <code>quiz</code></td><td class="req-yes">✅</td><td>Type of content</td></tr>
            <tr><td><code>title</code></td><td>string</td><td class="req-yes">✅</td><td>Display title (max 255 chars)</td></tr>
            <tr><td><code>questions</code></td><td>array</td><td class="req-yes">✅</td><td>Array of question objects (max 200)</td></tr>
            <tr><td><code>description</code></td><td>string</td><td class="req-no">—</td><td>Optional description (max 2000 chars)</td></tr>
            <tr><td><code>cover_image</code></td><td>URL string</td><td class="req-no">—</td><td>Valid URL to a cover image (Wikimedia Commons supported)</td></tr>
            <tr><td><code>timer_type</code></td><td><code>none</code> | <code>static</code> | <code>scheduled</code></td><td class="req-no">—</td><td>Timer mode (default: <code>none</code>)</td></tr>
            <tr><td><code>timer_duration</code></td><td>integer</td><td class="req-no">—</td><td>Duration in minutes for <code>static</code> mode (1–1440)</td></tr>
            <tr><td><code>timer_start</code></td><td>ISO datetime</td><td class="req-no">—</td><td>Start time for <code>scheduled</code> mode</td></tr>
            <tr><td><code>timer_end</code></td><td>ISO datetime</td><td class="req-no">—</td><td>End time for <code>scheduled</code> mode</td></tr>
            <tr><td><code>result_timing</code></td><td><code>instant</code> | <code>delayed</code></td><td class="req-no">—</td><td>When to show quiz results (default: <code>instant</code>)</td></tr>
          </table>
        </div>
        <div class="code-block">
          <button class="copy-btn" onclick="copyCode(this)">Copy</button>
          <pre><code><span class="kw">const</span> res = <span class="kw">await</span> <span class="fn">fetch</span>(<span class="str">'/api/save-form'</span>, {
  method: <span class="str">'POST'</span>,
  headers: {
    <span class="str">'Content-Type'</span>: <span class="str">'application/json'</span>,
    <span class="str">'X-WF-Token'</span>: token
  },
  body: <span class="fn">JSON.stringify</span>({
    slug: <span class="str">'bangladesh-history-quiz'</span>,
    contentType: <span class="str">'quiz'</span>,
    title: <span class="str">'Bangladesh History Quiz'</span>,
    description: <span class="str">'Test your knowledge of Bangladesh history.'</span>,
    questions: [
      {
        id: <span class="str">'q1'</span>, type: <span class="str">'radio'</span>, required: <span class="kw">true</span>,
        text: <span class="str">'When did Bangladesh gain independence?'</span>,
        options: [<span class="str">'1971'</span>, <span class="str">'1947'</span>, <span class="str">'1952'</span>, <span class="str">'1965'</span>],
        correctAnswer: <span class="str">'1971'</span>, points: <span class="num">10</span>,
        successMsg: <span class="str">'Correct! March 26, 1971.'</span>,
        failMsg: <span class="str">'Bangladesh declared independence on March 26, 1971.'</span>
      },
      {
        id: <span class="str">'q2'</span>, type: <span class="str">'text'</span>, required: <span class="kw">true</span>,
        text: <span class="str">'Who is known as the Father of the Nation of Bangladesh?'</span>,
        correctAnswer: <span class="str">'Sheikh Mujibur Rahman'</span>, points: <span class="num">10</span>
      }
    ],
    timer_type: <span class="str">'static'</span>, timer_duration: <span class="num">30</span>,
    result_timing: <span class="str">'instant'</span>
  })
});
<span class="cm">// → { status: 'success' }</span></code></pre>
        </div>
      </div>
    </div>

    <h2 id="get-form"><span class="section-tag">Forms</span>Get Form Metadata</h2>
    <div class="endpoint">
      <div class="endpoint-header" onclick="toggle(this)">
        <span class="method GET">GET</span>
        <span class="endpoint-path">/api/get-form/{slug}</span>
        <div class="endpoint-badges"><span class="badge badge-public">Public</span></div>
        <svg class="endpoint-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
      </div>
      <div class="endpoint-body">
        <p>Returns form metadata only. <strong>Questions are intentionally excluded</strong> — they are fetched separately via <span class="inline-code">/api/get-form-questions/{slug}</span> only when the user clicks Start, to prevent answer pre-loading.</p>
        <div class="code-block">
          <button class="copy-btn" onclick="copyCode(this)">Copy</button>
          <pre><code><span class="kw">const</span> form = <span class="kw">await</span> <span class="fn">fetch</span>(<span class="str">'/api/get-form/bangladesh-history-quiz'</span>)
  .<span class="fn">then</span>(r => r.<span class="fn">json</span>());

<span class="cm">/*
{
  id: 'bangladesh-history-quiz',
  contentType: 'quiz',
  title: 'Bangladesh History Quiz',
  description: 'Test your knowledge...',
  cover_image: null,
  owner_username: 'Anaf',
  collaborators: [],
  timer_type: 'static',
  timer_duration: 30,
  timer_start: null,
  timer_end: null,
  timer_before_msg: {},
  timer_after_msg: {},
  result_timing: 'instant'
}
*/</span></code></pre>
        </div>
      </div>
    </div>

    <h2 id="get-form-questions"><span class="section-tag">Forms</span>Get Questions</h2>
    <div class="endpoint">
      <div class="endpoint-header" onclick="toggle(this)">
        <span class="method POST">POST</span>
        <span class="endpoint-path">/api/get-form-questions/{slug}</span>
        <div class="endpoint-badges"><span class="badge badge-public">Public</span></div>
        <svg class="endpoint-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
      </div>
      <div class="endpoint-body">
        <p>Returns decrypted questions. For non-owners, <span class="inline-code">correctAnswer</span>, <span class="inline-code">successMsg</span>, and <span class="inline-code">failMsg</span> are <strong>stripped from the response</strong> — grading happens server-side in <span class="inline-code">/api/save-response</span>.</p>
        <div class="alert alert-warn">
          <span class="alert-icon">⚠️</span>
          <div>Only call this endpoint when the user actually starts the form. Calling it on page load defeats the security model.</div>
        </div>
        <div class="code-block">
          <button class="copy-btn" onclick="copyCode(this)">Copy</button>
          <pre><code><span class="kw">const</span> data = <span class="kw">await</span> <span class="fn">fetch</span>(<span class="str">`/api/get-form-questions/${slug}`</span>, {
  method: <span class="str">'POST'</span>
}).<span class="fn">then</span>(r => r.<span class="fn">json</span>());
<span class="cm">// { status: 'success', questions: [ ...questions without correctAnswer ] }</span></code></pre>
        </div>
      </div>
    </div>

    <h2 id="my-forms"><span class="section-tag">Forms</span>My Forms</h2>
    <div class="endpoint">
      <div class="endpoint-header" onclick="toggle(this)">
        <span class="method GET">GET</span>
        <span class="endpoint-path">/api/my-forms/{username}</span>
        <div class="endpoint-badges"><span class="badge badge-auth">Auth required</span></div>
        <svg class="endpoint-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
      </div>
      <div class="endpoint-body">
        <p>Returns all forms owned by or collaborated on by the given Wikipedia username. The authenticated user must match the username in the URL — you cannot view other users' forms.</p>
        <div class="code-block">
          <button class="copy-btn" onclick="copyCode(this)">Copy</button>
          <pre><code><span class="kw">const</span> data = <span class="kw">await</span> <span class="fn">fetch</span>(<span class="str">'/api/my-forms/Anaf'</span>, {
  headers: { <span class="str">'X-WF-Token'</span>: token }
}).<span class="fn">then</span>(r => r.<span class="fn">json</span>());

<span class="cm">/*
{
  status: 'success',
  forms: [{
    slug: 'bangladesh-history-quiz',
    title: 'Bangladesh History Quiz',
    content_type: 'quiz',
    owner_username: 'Anaf',
    collaborators: ['OtherUser'],
    timer_type: 'static',
    response_count: 42,
    recent_dates: ['2026-07-05T10:00:00', ...],  // last 30 responses
    created_at: '2026-06-01T00:00:00',
    updated_at: '2026-07-05T00:00:00'
  }]
}
*/</span></code></pre>
        </div>
      </div>
    </div>

    <!-- ══ RESPONSES ══ -->
    <h2 id="save-response"><span class="section-tag">Responses</span>Save Response</h2>
    <div class="endpoint">
      <div class="endpoint-header" onclick="toggle(this)">
        <span class="method POST">POST</span>
        <span class="endpoint-path">/api/save-response</span>
        <div class="endpoint-badges"><span class="badge badge-public">Public</span><span class="badge badge-new">Grading v2</span></div>
        <svg class="endpoint-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
      </div>
      <div class="endpoint-body">
        <p>Saves a form or quiz submission. For quizzes, <strong>grading is performed entirely server-side</strong> — the correct answers are decrypted on the server, never sent to the client, and the score is returned in the response.</p>
        <div class="alert alert-success">
          <span class="alert-icon">✅</span>
          <div><strong>Security note:</strong> <span class="inline-code">correctAnswer</span> values are decrypted server-side for grading only. They are never included in any API response to non-owners.</div>
        </div>
        <h3>Request Body</h3>
        <div class="table-wrap">
          <table>
            <tr><th>Field</th><th>Type</th><th>Description</th></tr>
            <tr><td><code>form_slug</code></td><td>string</td><td>Target form slug</td></tr>
            <tr><td><code>title</code></td><td>string</td><td>Form title (stored for display in response list)</td></tr>
            <tr><td><code>type</code></td><td><code>form</code> | <code>quiz</code></td><td>Content type — determines whether server grading runs</td></tr>
            <tr><td><code>answers</code></td><td>object</td><td>Map of <code>question_id → answer</code>. Checkbox answers are arrays.</td></tr>
          </table>
        </div>
        <div class="code-block">
          <button class="copy-btn" onclick="copyCode(this)">Copy</button>
          <pre><code><span class="kw">const</span> res = <span class="kw">await</span> <span class="fn">fetch</span>(<span class="str">'/api/save-response'</span>, {
  method: <span class="str">'POST'</span>,
  headers: { <span class="str">'Content-Type'</span>: <span class="str">'application/json'</span> },
  body: <span class="fn">JSON.stringify</span>({
    form_slug: <span class="str">'bangladesh-history-quiz'</span>,
    title: <span class="str">'Bangladesh History Quiz'</span>,
    type: <span class="str">'quiz'</span>,
    answers: {
      q1: <span class="str">'1971'</span>,
      q2: <span class="str">'Sheikh Mujibur Rahman'</span>,
      <span class="str">'__email__'</span>: <span class="str">'user@example.com'</span>  <span class="cm">// optional</span>
    }
  })
});
<span class="kw">const</span> data = <span class="kw">await</span> res.<span class="fn">json</span>();</code></pre>
        </div>
        <h3>Quiz Response</h3>
        <div class="response-example">
          <div class="res-label">Response — Quiz submission</div>
          <pre style="background:transparent;padding:0"><code>{
  <span class="key">"status"</span>: <span class="str">"success"</span>,
  <span class="key">"score"</span>: {
    <span class="key">"earned"</span>: <span class="num">20</span>,
    <span class="key">"total"</span>: <span class="num">20</span>,
    <span class="key">"results"</span>: [
      { <span class="key">"id"</span>: <span class="str">"q1"</span>, <span class="key">"correct"</span>: <span class="kw">true</span> },
      { <span class="key">"id"</span>: <span class="str">"q2"</span>, <span class="key">"correct"</span>: <span class="kw">true</span> }
    ]
  },
  <span class="key">"revealed"</span>: {
    <span class="key">"q1"</span>: {
      <span class="key">"correctAnswer"</span>: <span class="str">"1971"</span>,
      <span class="key">"successMsg"</span>: <span class="str">"Correct! March 26, 1971."</span>,
      <span class="key">"failMsg"</span>: <span class="str">"Bangladesh declared independence on March 26, 1971."</span>
    },
    <span class="key">"q2"</span>: { <span class="key">"correctAnswer"</span>: <span class="str">"Sheikh Mujibur Rahman"</span>, ... }
  }
}</code></pre>
        </div>
        <p>The <span class="inline-code">revealed</span> field is only present in quiz responses and is safe to send post-submission — the quiz is already saved at this point.</p>
        <h3>Form Response</h3>
        <div class="response-example">
          <div class="res-label">Response — Form submission</div>
          <pre style="background:transparent;padding:0"><code>{ <span class="key">"status"</span>: <span class="str">"success"</span> }</code></pre>
        </div>
      </div>
    </div>

    <h2 id="get-responses"><span class="section-tag">Responses</span>Get Responses</h2>
    <div class="endpoint">
      <div class="endpoint-header" onclick="toggle(this)">
        <span class="method GET">GET</span>
        <span class="endpoint-path">/api/get-responses/{slug}</span>
        <div class="endpoint-badges"><span class="badge badge-owner">Owner / Collaborator</span></div>
        <svg class="endpoint-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
      </div>
      <div class="endpoint-body">
        <p>Returns all submissions for a form. Restricted to the form owner and collaborators only.</p>
        <div class="code-block">
          <button class="copy-btn" onclick="copyCode(this)">Copy</button>
          <pre><code><span class="kw">const</span> data = <span class="kw">await</span> <span class="fn">fetch</span>(<span class="str">'/api/get-responses/bangladesh-history-quiz'</span>, {
  headers: { <span class="str">'X-WF-Token'</span>: token }
}).<span class="fn">then</span>(r => r.<span class="fn">json</span>());

<span class="cm">/*
{
  status: 'success',
  responses: [{
    id: 1,
    answers: { q1: '1971', q2: 'Sheikh Mujibur Rahman' },
    timestamp: '2026-07-05 10:00:00'
  }]
}
*/</span></code></pre>
        </div>
      </div>
    </div>

    <h2 id="grade-response"><span class="section-tag">Responses</span>Grade Response (AI)</h2>
    <div class="endpoint">
      <div class="endpoint-header" onclick="toggle(this)">
        <span class="method POST">POST</span>
        <span class="endpoint-path">/api/grade-response</span>
        <div class="endpoint-badges"><span class="badge badge-public">Public</span><span class="rate-pill">5 / min</span></div>
        <svg class="endpoint-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
      </div>
      <div class="endpoint-body">
        <p>Grades open-ended answers using AI (OpenRouter). Compares meaning not exact wording — <em>"the capital city of Bangladesh"</em> and <em>"Dhaka"</em> would both be marked correct for a <span class="inline-code">correctAnswer</span> of <em>"Dhaka"</em>.</p>
        <div class="alert alert-info">
          <span class="alert-icon">ℹ️</span>
          <div><strong>For quiz submissions, use <span class="inline-code">/api/save-response</span> instead.</strong> It grades server-side automatically without exposing correct answers. This endpoint is for standalone grading use cases only.</div>
        </div>
        <div class="alert alert-warn">
          <span class="alert-icon">⏱️</span>
          <div>AI grading may take 2–10 seconds. The endpoint retries automatically on 429/500/502/503 from OpenRouter. Returns <strong>503</strong> if all retries fail.</div>
        </div>
        <div class="code-block">
          <button class="copy-btn" onclick="copyCode(this)">Copy</button>
          <pre><code><span class="kw">const</span> res = <span class="kw">await</span> <span class="fn">fetch</span>(<span class="str">'/api/grade-response'</span>, {
  method: <span class="str">'POST'</span>,
  headers: { <span class="str">'Content-Type'</span>: <span class="str">'application/json'</span> },
  body: <span class="fn">JSON.stringify</span>({
    questions: [{
      id: <span class="str">'q1'</span>,
      question: <span class="str">'What is the capital of Bangladesh?'</span>,
      correctAnswer: <span class="str">'Dhaka'</span>,
      userAnswer: <span class="str">'the capital city is Dhaka'</span>
    }]
  })
});
<span class="kw">const</span> data = <span class="kw">await</span> res.<span class="fn">json</span>();
<span class="cm">// { status: 'success', results: [{ id: 'q1', correct: true }] }</span></code></pre>
        </div>
      </div>
    </div>

    <!-- ══ ANTI-CHEAT ══ -->
    <h2 id="quiz-start"><span class="section-tag">Anti-Cheat</span>Start Quiz Session</h2>
    <p>WikiForms has a server-side heartbeat anti-cheat system. For quizzes, call <span class="inline-code">/api/quiz/start</span> when the user starts, send heartbeats every 3 seconds, and validate the session before accepting a submission.</p>
    <div class="endpoint">
      <div class="endpoint-header" onclick="toggle(this)">
        <span class="method POST">POST</span>
        <span class="endpoint-path">/api/quiz/start</span>
        <div class="endpoint-badges"><span class="badge badge-public">Public</span><span class="rate-pill">10 / min</span></div>
        <svg class="endpoint-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
      </div>
      <div class="endpoint-body">
        <p>Creates a quiz session and returns a server-side deadline. Returns <span class="inline-code">{ status: 'skip' }</span> for non-quiz forms.</p>
        <div class="code-block">
          <button class="copy-btn" onclick="copyCode(this)">Copy</button>
          <pre><code><span class="kw">const</span> data = <span class="kw">await</span> <span class="fn">fetch</span>(<span class="str">'/api/quiz/start'</span>, {
  method: <span class="str">'POST'</span>,
  headers: { <span class="str">'Content-Type'</span>: <span class="str">'application/json'</span> },
  body: <span class="fn">JSON.stringify</span>({ form_slug: <span class="str">'my-quiz'</span>, username: <span class="str">'Anaf'</span> })
}).<span class="fn">then</span>(r => r.<span class="fn">json</span>());
<span class="cm">// { status: 'success', session_id: '64-char-hex', deadline: '2026-07-05T10:30:00Z' }</span></code></pre>
        </div>
      </div>
    </div>

    <h2 id="quiz-heartbeat"><span class="section-tag">Anti-Cheat</span>Heartbeat</h2>
    <div class="endpoint">
      <div class="endpoint-header" onclick="toggle(this)">
        <span class="method POST">POST</span>
        <span class="endpoint-path">/api/quiz/heartbeat</span>
        <div class="endpoint-badges"><span class="badge badge-public">Public</span></div>
        <svg class="endpoint-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
      </div>
      <div class="endpoint-body">
        <p>Send every <strong>3 seconds</strong> while the quiz is active. If the server detects a gap &gt; 5 seconds (tab switch or freeze), the session is terminated. Also enforces the server-side deadline.</p>
        <div class="code-block">
          <button class="copy-btn" onclick="copyCode(this)">Copy</button>
          <pre><code><span class="kw">const</span> interval = <span class="fn">setInterval</span>(<span class="kw">async</span> () => {
  <span class="kw">const</span> res = <span class="kw">await</span> <span class="fn">fetch</span>(<span class="str">'/api/quiz/heartbeat'</span>, {
    method: <span class="str">'POST'</span>,
    headers: { <span class="str">'Content-Type'</span>: <span class="str">'application/json'</span> },
    body: <span class="fn">JSON.stringify</span>({ session_id: sessionId })
  }).<span class="fn">then</span>(r => r.<span class="fn">json</span>());

  <span class="kw">if</span> (res.status === <span class="str">'terminated'</span>) {
    <span class="fn">clearInterval</span>(interval);
    <span class="cm">// Lock the quiz UI</span>
  }
  <span class="cm">// { status: 'alive', server_ts: '2026-07-05T10:15:03Z' }</span>
  <span class="cm">// { status: 'terminated', reason: 'heartbeat_missed' | 'deadline_exceeded' }</span>
}, <span class="num">3000</span>);</code></pre>
        </div>
      </div>
    </div>

    <h2 id="quiz-validate"><span class="section-tag">Anti-Cheat</span>Validate Session</h2>
    <div class="endpoint">
      <div class="endpoint-header" onclick="toggle(this)">
        <span class="method POST">POST</span>
        <span class="endpoint-path">/api/quiz/validate-session</span>
        <div class="endpoint-badges"><span class="badge badge-public">Public</span><span class="rate-pill">10 / min</span></div>
        <svg class="endpoint-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
      </div>
      <div class="endpoint-body">
        <p>Validates a session before accepting a submission. Call this immediately before <span class="inline-code">/api/save-response</span>. Marks the session as <span class="inline-code">submitted</span> to prevent double submissions.</p>
        <div class="code-block">
          <button class="copy-btn" onclick="copyCode(this)">Copy</button>
          <pre><code><span class="kw">const</span> validation = <span class="kw">await</span> <span class="fn">fetch</span>(<span class="str">'/api/quiz/validate-session'</span>, {
  method: <span class="str">'POST'</span>,
  headers: { <span class="str">'Content-Type'</span>: <span class="str">'application/json'</span> },
  body: <span class="fn">JSON.stringify</span>({ session_id: sessionId, form_slug: slug })
}).<span class="fn">then</span>(r => r.<span class="fn">json</span>());

<span class="kw">if</span> (validation.status === <span class="str">'terminated'</span>) {
  <span class="cm">// reject submission</span>
} <span class="kw">else if</span> (validation.status === <span class="str">'valid'</span>) {
  <span class="cm">// proceed to save-response</span>
}</code></pre>
        </div>
      </div>
    </div>

    <!-- ══ COLLABORATORS ══ -->
    <h2 id="add-collaborator"><span class="section-tag">Collaborators</span>Add Collaborator</h2>
    <div class="endpoint">
      <div class="endpoint-header" onclick="toggle(this)">
        <span class="method POST">POST</span>
        <span class="endpoint-path">/api/add-collaborator</span>
        <div class="endpoint-badges"><span class="badge badge-owner">Owner only</span></div>
        <svg class="endpoint-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
      </div>
      <div class="endpoint-body">
        <p>Grants a Wikipedia user edit and response-view access to a form. The form must be published before adding collaborators.</p>
        <div class="code-block">
          <button class="copy-btn" onclick="copyCode(this)">Copy</button>
          <pre><code><span class="kw">await</span> <span class="fn">fetch</span>(<span class="str">'/api/add-collaborator'</span>, {
  method: <span class="str">'POST'</span>,
  headers: { <span class="str">'Content-Type'</span>: <span class="str">'application/json'</span>, <span class="str">'X-WF-Token'</span>: token },
  body: <span class="fn">JSON.stringify</span>({
    slug: <span class="str">'my-quiz'</span>,
    new_collaborator: <span class="str">'AnotherWikipediaUser'</span>
  })
});
<span class="cm">// → { status: 'success' }</span></code></pre>
        </div>
      </div>
    </div>

    <h2 id="remove-collaborator"><span class="section-tag">Collaborators</span>Remove Collaborator</h2>
    <div class="endpoint">
      <div class="endpoint-header" onclick="toggle(this)">
        <span class="method POST">POST</span>
        <span class="endpoint-path">/api/remove-collaborator</span>
        <div class="endpoint-badges"><span class="badge badge-owner">Owner only</span></div>
        <svg class="endpoint-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
      </div>
      <div class="endpoint-body">
        <div class="code-block">
          <button class="copy-btn" onclick="copyCode(this)">Copy</button>
          <pre><code><span class="kw">await</span> <span class="fn">fetch</span>(<span class="str">'/api/remove-collaborator'</span>, {
  method: <span class="str">'POST'</span>,
  headers: { <span class="str">'Content-Type'</span>: <span class="str">'application/json'</span>, <span class="str">'X-WF-Token'</span>: token },
  body: <span class="fn">JSON.stringify</span>({ slug: <span class="str">'my-quiz'</span>, collaborator: <span class="str">'AnotherWikipediaUser'</span> })
});
<span class="cm">// → { status: 'success' }</span></code></pre>
        </div>
      </div>
    </div>

    <!-- ══ i18n ══ -->
    <h2 id="usr-lang"><span class="section-tag">i18n</span>Get Translations</h2>
    <div class="endpoint">
      <div class="endpoint-header" onclick="toggle(this)">
        <span class="method GET">GET</span>
        <span class="endpoint-path">/api/usr-lang/{lang}</span>
        <div class="endpoint-badges"><span class="badge badge-public">Public</span><span class="badge badge-cached">Cached 10 min</span></div>
        <svg class="endpoint-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
      </div>
      <div class="endpoint-body">
        <p>Returns all live translations for a language. Falls back to English for any missing keys. Currently supported: <span class="inline-code">en</span> (97 keys), <span class="inline-code">bn</span> (97 keys), <span class="inline-code">es</span> (72 keys), <span class="inline-code">fr</span> (72 keys), <span class="inline-code">de</span> (21 keys). Community members can contribute more via the <a href="/contribute">/contribute</a> page.</p>
        <div class="code-block">
          <button class="copy-btn" onclick="copyCode(this)">Copy</button>
          <pre><code><span class="cm">// List available languages with coverage percentages</span>
<span class="kw">const</span> langs = <span class="kw">await</span> <span class="fn">fetch</span>(<span class="str">'/api/usr-lang'</span>).<span class="fn">then</span>(r => r.<span class="fn">json</span>());
<span class="cm">// { languages: [{ code: 'bn', name: 'বাংলা', live_count: 97, coverage: 100 }] }</span>

<span class="cm">// Get Bengali translations</span>
<span class="kw">const</span> bn = <span class="kw">await</span> <span class="fn">fetch</span>(<span class="str">'/api/usr-lang/bn'</span>).<span class="fn">then</span>(r => r.<span class="fn">json</span>());
<span class="cm">/*
{
  status: 'success', lang: 'bn',
  keys: { app_name: 'উইকিফর্মস', welcome_title: 'উইকিফর্মে আপনাকে স্বাগত!', ... }
}
*/</span></code></pre>
        </div>
      </div>
    </div>

    <h2 id="editor"><span class="section-tag">i18n</span>Save Draft Translation</h2>
    <div class="endpoint">
      <div class="endpoint-header" onclick="toggle(this)">
        <span class="method POST">POST</span>
        <span class="endpoint-path">/api/editor</span>
        <div class="endpoint-badges"><span class="badge badge-auth">Wikipedia login</span></div>
        <svg class="endpoint-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
      </div>
      <div class="endpoint-body">
        <p>Saves or updates a translation as a draft. Any Wikipedia user can contribute. English source keys (contributed by <span class="inline-code">system</span>) are read-only.</p>
        <div class="code-block">
          <button class="copy-btn" onclick="copyCode(this)">Copy</button>
          <pre><code><span class="kw">await</span> <span class="fn">fetch</span>(<span class="str">'/api/editor'</span>, {
  method: <span class="str">'POST'</span>,
  headers: { <span class="str">'Content-Type'</span>: <span class="str">'application/json'</span>, <span class="str">'X-WF-Token'</span>: token },
  body: <span class="fn">JSON.stringify</span>({
    lang_code: <span class="str">'de'</span>,
    lang_name: <span class="str">'Deutsch'</span>,
    translation_key: <span class="str">'welcome_title'</span>,
    value: <span class="str">'Willkommen bei WikiForms!'</span>
  })
});
<span class="cm">// → { status: 'success', message: 'Translation saved as draft.' }</span></code></pre>
        </div>
      </div>
    </div>

    <h2 id="publisher"><span class="section-tag">i18n</span>Publish Translation</h2>
    <div class="endpoint">
      <div class="endpoint-header" onclick="toggle(this)">
        <span class="method POST">POST</span>
        <span class="endpoint-path">/api/publisher</span>
        <div class="endpoint-badges"><span class="badge badge-auth">Contributor only</span></div>
        <svg class="endpoint-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
      </div>
      <div class="endpoint-body">
        <p>Publishes a draft translation to live. <strong>Only the user who submitted the draft</strong> (<span class="inline-code">contributed_by</span>) can publish it. English system keys cannot be republished.</p>
        <div class="code-block">
          <button class="copy-btn" onclick="copyCode(this)">Copy</button>
          <pre><code><span class="kw">await</span> <span class="fn">fetch</span>(<span class="str">'/api/publisher'</span>, {
  method: <span class="str">'POST'</span>,
  headers: { <span class="str">'Content-Type'</span>: <span class="str">'application/json'</span>, <span class="str">'X-WF-Token'</span>: token },
  body: <span class="fn">JSON.stringify</span>({
    lang_code: <span class="str">'de'</span>,
    translation_key: <span class="str">'welcome_title'</span>
  })
});
<span class="cm">// → { status: 'success', message: 'Translation published.' }</span></code></pre>
        </div>
      </div>
    </div>

    <!-- ══ UTILITIES ══ -->
    <h2 id="test-connection"><span class="section-tag">Utilities</span>Health Check</h2>
    <div class="endpoint">
      <div class="endpoint-header" onclick="toggle(this)">
        <span class="method GET">GET</span>
        <span class="endpoint-path">/api/test-connection</span>
        <div class="endpoint-badges"><span class="badge badge-public">Public</span></div>
        <svg class="endpoint-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
      </div>
      <div class="endpoint-body">
        <p>Simple connectivity check. Use this to verify the API is reachable before making other requests.</p>
        <div class="code-block">
          <button class="copy-btn" onclick="copyCode(this)">Copy</button>
          <pre><code><span class="kw">const</span> data = <span class="kw">await</span> <span class="fn">fetch</span>(<span class="str">'/api/test-connection'</span>).<span class="fn">then</span>(r => r.<span class="fn">json</span>());
<span class="cm">// { status: 'success', message: 'Connected!' }</span></code></pre>
        </div>
      </div>
    </div>

    <!-- ══ CHANGELOG ══ -->
    <h2 id="changelog"><span class="section-tag">Reference</span>Changelog</h2>

    <div class="changelog-item">
      <span class="changelog-ver">v2.0.0</span>
      <div class="changelog-content">
        <h4>July 2026 — Security & Grading Overhaul</h4>
        <ul>
          <li>Server-side quiz grading — correct answers never reach the client</li>
          <li>Post-submission answer reveal via <code>revealed</code> field in save-response</li>
          <li>Exact-match question types (radio, checkbox, true_false, select) graded locally — no AI call</li>
          <li>Translation publisher restricted to the original contributor only</li>
          <li>Bot/scanner UA blocking at API gate (sqlmap, nikto, nmap, wget, curl etc.)</li>
          <li>Request size limit (1MB) enforced</li>
          <li>Per-endpoint rate limits (5/min grading, 10/min submissions)</li>
          <li>Expired token and quiz session auto-cleanup</li>
          <li>Anti-cheat: DevTools detection, F12/Ctrl+Shift+I keyboard blocks, right-click disable</li>
          <li>FormBuilder preview now renders RichTextEditor HTML correctly</li>
          <li>Progress bar replaces section dots in quiz UI</li>
          <li>Codex-style flat question cards (no border radius)</li>
        </ul>
      </div>
    </div>

    <div class="changelog-item">
      <span class="changelog-ver">v1.3.0</span>
      <div class="changelog-content">
        <h4>June 2026 — Anti-Cheat & i18n</h4>
        <ul>
          <li>Heartbeat anti-cheat system with server-side deadline enforcement</li>
          <li>Tab switch detection (visibilitychange + blur + pagehide)</li>
          <li>Custom warning popover — no browser alert()</li>
          <li>Translation cache clearing endpoint</li>
          <li>Rate limiting tightened on sensitive endpoints</li>
          <li>Error code 677 for unauthorized origin</li>
        </ul>
      </div>
    </div>

    <div class="changelog-item">
      <span class="changelog-ver">v1.2.0</span>
      <div class="changelog-content">
        <h4>May 2026 — Security Hardening (GrinningIodize Report)</h4>
        <ul>
          <li>Fixed: correctAnswer exposed in get-form-questions for non-owners</li>
          <li>Fixed: /my-forms IDOR — any username was accessible</li>
          <li>Fixed: OAuth state parameter not validated</li>
          <li>Fixed: XSS in renderResult() via $userJson interpolation</li>
          <li>Added: cover_image URL validation</li>
          <li>Added: slug and result_timing enum validation</li>
          <li>Added: session cookies HTTPS-only</li>
          <li>Added: DB-backed token auth replacing HMAC signing</li>
        </ul>
      </div>
    </div>

    <div class="changelog-item">
      <span class="changelog-ver">v1.0.0</span>
      <div class="changelog-content">
        <h4>2026 — Initial Release</h4>
        <ul>
          <li>Form and quiz builder with drag-and-drop</li>
          <li>MediaWiki OAuth 2.0 login</li>
          <li>AES-256-CBC question encryption</li>
          <li>Multilingual support (EN, BN, ES, FR)</li>
          <li>Collaborator access control</li>
          <li>Scheduled quizzes with auto start/end</li>
          <li>AI answer grading via OpenRouter</li>
        </ul>
      </div>
    </div>

    <p style="margin-top:56px;font-size:12px;color:var(--muted);text-align:center;padding-bottom:32px">
      WikiForms v<?= $version ?> — Open Source — MIT License —
      <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a> ·
      <a href="https://github.com/anafibnshahibul/WikiForms">GitHub</a> ·
      <a href="/hall-of-fame.php">Security Hall of Fame</a>
    </p>
  </main>
</div>

<script>
  // Toggle endpoint bodies
  function toggle(header) {
    header.classList.toggle('open');
    const body = header.nextElementSibling;
    body.classList.toggle('open');
  }

  // Copy code button
  function copyCode(btn) {
    const pre = btn.closest('.code-block, .response-example').querySelector('pre');
    const text = pre.innerText;
    navigator.clipboard.writeText(text).then(() => {
      btn.textContent = 'Copied!';
      btn.classList.add('copied');
      setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 2000);
    });
  }

  // Active sidebar highlighting on scroll
  const headings = document.querySelectorAll('h2[id]');
  const links    = document.querySelectorAll('.sidebar a[href^="#"]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.sidebar a[href="#${e.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-10% 0px -85% 0px' });
  headings.forEach(h => observer.observe(h));
</script>
</body>
</html>
