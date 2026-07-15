<?php
require __DIR__ . '/../../backend/vendor/autoload.php';
$app = require_once __DIR__ . '/../../backend/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;

$entries = DB::table('hall_of_fame')->orderBy('reported_at', 'asc')->get();
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Security Hall of Fame — WikiForms</title>
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg: #f8f9fa; --surface: #fff; --text: #1a202c; --muted: #64748b;
      --border: #e2e8f0; --blue: #3366cc; --green: #00af89;
    }
    @media (prefers-color-scheme: dark) {
      :root { --bg: #0f172a; --surface: #1e293b; --text: #f1f5f9; --muted: #94a3b8; --border: #334155; }
    }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: var(--bg); color: var(--text); line-height: 1.7; }
    .wrap { max-width: 760px; margin: 0 auto; padding: 48px 24px 80px; }
    header { display: flex; align-items: center; gap: 12px; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 2px solid var(--blue); }
    header a { text-decoration: none; color: var(--blue); font-weight: 800; font-size: 18px; }
    h1 { font-size: 26px; font-weight: 800; color: var(--text); margin-bottom: 8px; }
    p { color: var(--muted); font-size: 14px; margin-bottom: 12px; line-height: 1.7; }
    a { color: var(--blue); }
    .empty { background: var(--surface); border: 1px solid var(--border); border-left: 4px solid var(--blue); border-radius: 8px; padding: 20px; margin-top: 24px; }
    .card { background: var(--surface); border: 1px solid var(--border); border-left: 4px solid var(--green); border-radius: 8px; padding: 20px; margin-bottom: 14px; }
    .card-header { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 8px; margin-bottom: 8px; }
    .name { font-weight: 700; font-size: 15px; color: var(--text); }
    .date { font-size: 12px; color: var(--muted); background: var(--bg); padding: 2px 10px; border-radius: 10px; border: 1px solid var(--border); }
    .contribution { font-size: 13px; color: var(--muted); }
    .medal { font-size: 28px; margin-bottom: 12px; }
    .footer-links { margin-top: 48px; padding-top: 20px; border-top: 1px solid var(--border); font-size: 13px; color: var(--muted); text-align: center; line-height: 2; }
    .footer-links a { color: var(--blue); margin: 0 8px; }
  </style>
</head>
<body>
<div class="wrap">
  <header>
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
      <path d="M6 3C4.34 3 3 4.34 3 6V26C3 27.66 4.34 29 6 29H26C27.66 29 29 27.66 29 26V6C29 4.34 27.66 3 26 3H6Z" fill="#3366cc"/>
      <path d="M9 10L12 21L15 13L18 21L21 10" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="23" cy="23" r="5" fill="#00af89"/>
      <path d="M21 23L22.5 24.5L25 21.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <a href="/">WikiForms</a>
  </header>

  <div class="medal">🏅</div>
  <h1>Security Hall of Fame</h1>
  <p>We deeply appreciate security researchers who help keep WikiForms and the Wikimedia community safe by responsibly reporting vulnerabilities.</p>
  <p>To report a vulnerability, please contact via <a href="https://en.wikipedia.org/wiki/User_talk:Anaf_Ibn_Shahibul">Wikipedia talk page</a> or <a href="https://github.com/anafibnshahibul/WikiForms/issues">GitHub Issues</a>.</p>

  <?php if ($entries->isEmpty()): ?>
  <div class="empty">
    <div style="font-weight:700;color:var(--text);margin-bottom:6px;">Your Name Could Be Here!</div>
    <p style="margin:0">This spot is reserved for the first researcher who responsibly reports a valid security bug.</p>
  </div>
  <?php else: ?>
  <div style="margin-top:24px">
    <?php foreach ($entries as $i => $e): ?>
    <div class="card">
      <div class="card-header">
        <div>
          <?php if ($i === 0): ?><span style="font-size:18px;margin-right:6px;">🥇</span><?php elseif ($i === 1): ?><span style="font-size:18px;margin-right:6px;">🥈</span><?php elseif ($i === 2): ?><span style="font-size:18px;margin-right:6px;">🥉</span><?php endif; ?>
          <span class="name"><?= htmlspecialchars($e->name) ?></span>
          <?php if ($e->wiki_username): ?>
          <a href="https://en.wikipedia.org/wiki/User:<?= urlencode($e->wiki_username) ?>" style="font-size:12px;margin-left:8px;color:var(--blue)">@<?= htmlspecialchars($e->wiki_username) ?></a>
          <?php endif; ?>
        </div>
        <span class="date"><?= htmlspecialchars($e->reported_at) ?></span>
      </div>
      <div class="contribution"><?= htmlspecialchars($e->contribution) ?></div>
    </div>
    <?php endforeach; ?>
  </div>
  <?php endif; ?>

  <div class="footer-links">
    <p><a href="/">Home</a><a href="/about">About</a><a href="/privacy">Privacy Policy</a><a href="/terms">Terms of Use</a><a href="/docs.php">API Docs</a></p>
  </div>
</div>
</body>
</html>
