<div align="center">

<img src="https://wikiforms.toolforge.org/assets/favicon-hF1YpoPe.svg" width="72" height="72" alt="WikiForms Logo" />

# WikiForms

**Free · Open-Source · Wikimedia-Native**

A drag-and-drop form and quiz builder built specifically for the Wikimedia ecosystem.
Log in with your Wikipedia account. No sign-up. No subscription. No tracking.

[![Live](https://img.shields.io/badge/🌐_Live-wikiforms.toolforge.org-3366cc?style=flat-square)](https://wikiforms.toolforge.org)
[![Docs](https://img.shields.io/badge/📖_API_Docs-docs.php-00af89?style=flat-square)](https://wikiforms.toolforge.org/docs.php)
[![License](https://img.shields.io/badge/License-GNU%20GPL-blue)](LICENSE)
[![PHP](https://img.shields.io/badge/PHP-8.2+-777BB4?style=flat-square&logo=php&logoColor=white)](https://php.net)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Toolforge](https://img.shields.io/badge/Hosted_on-Wikimedia_Toolforge-green?style=flat-square)](https://toolforge.org)

<table>
  <tr>
    <td><img src="Screenshots/Screenshot 2026-07-07 19.15.51.png" width="280" alt="Form Builder" /></td>
    <td><img src="Screenshots/Screenshot 2026-07-07 19.16.01.png" width="280" alt="Quiz View" /></td>
    <td><img src="Screenshots/Screenshot 2026-07-07 19.16.23.png" width="280" alt="Dashboard" /></td>
  </tr>
</table>

</div>

---

## ✨ Features

| | Feature | Details |
|---|---|---|
| 🔐 | **Wikipedia Login** | One-click OAuth 2.0 via MediaWiki — no passwords stored |
| 📋 | **Drag & Drop Builder** | 10 question types: text, radio, checkbox, dropdown, star rating, true/false, and more |
| 🧠 | **AI Quiz Grading** | Open-ended answers graded server-side by OpenRouter AI — correct answers never reach the client |
| 🏆 | **Leaderboard** | Ranked quiz scores with medals, progress bars, and percentage display |
| 🔒 | **AES-256-CBC Encryption** | All form questions encrypted at rest |
| 🛡️ | **Anti-Cheat System** | Server-side heartbeat sessions, tab-switch detection, DevTools blocking |
| 📊 | **Response Analytics** | Pie charts, bar charts, CSV/JSON export |
| 🌐 | **Multilingual** | EN, BN, ES, FR, DE — community-contributed via the `/contribute` page |
| 👥 | **Collaborators** | Share edit and response-view access with other Wikipedia users |
| ⏱️ | **Scheduled Quizzes** | Auto start/end times with custom before/after messages |
| 🔀 | **Conditional Logic** | Show/hide questions based on previous answers |
| 🎨 | **Wikimedia Codex** | Built on the official Wikimedia design system |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 + Vite 8 |
| **Backend** | Laravel 11 (PHP 8.2) |
| **Database** | MySQL / MariaDB |
| **Auth** | MediaWiki OAuth 2.0 |
| **Web Server** | lighttpd (mirrors Toolforge exactly in Docker) |
| **AI Grading** | OpenRouter API |
| **Design** | Wikimedia Codex design system |
| **Hosting** | Wikimedia Toolforge (Kubernetes) |

---

## 🚀 Quick Start

### Docker (Recommended — mirrors Toolforge exactly)

```bash
# 1. Clone
git clone https://github.com/anafibnshahibul/WikiForms.git
cd WikiForms

# 2. Set up environment
cp backend/.env.example backend/.env
# Edit backend/.env — add your MediaWiki OAuth keys and OpenRouter key
# DB credentials are pre-filled for local Docker (no changes needed)

# 3. Start everything
docker compose up -d --build

# Done! Open http://localhost:8080
```

On first run, Docker will automatically:
- Start MySQL and create all tables (`docker/mysql/init.sql`)
- Install Composer dependencies
- Generate `APP_KEY` if missing
- Run database migrations
- Build the React frontend
- Start lighttpd (same config as Toolforge production)

### Manual Setup

<details>
<summary>Backend (Laravel)</summary>

```bash
cd backend
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate
php artisan serve --port=8000
```
</details>

<details>
<summary>Frontend (React + Vite)</summary>

```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```
</details>

---

## 📡 API Reference

Base URL: `https://wikiforms.toolforge.org/api`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/test-connection` | — | Health check |
| `GET` | `/auth/mediawiki` | — | Start OAuth login |
| `GET` | `/auth/me` | — | Get current user |
| `POST` | `/save-form` | ✅ | Create/update form |
| `GET` | `/get-form/{slug}` | — | Get form metadata |
| `POST` | `/get-form-questions/{slug}` | — | Get questions (correctAnswer stripped for non-owners) |
| `POST` | `/save-response` | — | Submit response (quiz: server-side grading included) |
| `GET` | `/get-responses/{slug}` | ✅ Owner | Get all responses |
| `GET` | `/leaderboard/{slug}` | — | Top 20 quiz scores |
| `POST` | `/grade-response` | — | AI grading (OpenRouter) |
| `POST` | `/quiz/start` | — | Start anti-cheat session |
| `POST` | `/quiz/heartbeat` | — | Heartbeat ping (every 3s) |
| `POST` | `/quiz/validate-session` | — | Validate before submission |
| `POST` | `/add-collaborator` | ✅ Owner | Add collaborator |
| `POST` | `/remove-collaborator` | ✅ Owner | Remove collaborator |
| `DELETE` | `/delete-form/{slug}` | ✅ Owner | Delete form + all responses |
| `GET` | `/usr-lang/{lang}` | — | Get translations (cached 10min) |
| `POST` | `/editor` | ✅ | Save draft translation |
| `POST` | `/publisher` | ✅ Contributor | Publish own translation |

Full docs: [wikiforms.toolforge.org/docs.php](https://wikiforms.toolforge.org/docs.php)

---

## 🔒 Security

WikiForms implements multiple security layers:

- **AES-256-CBC** question encryption at rest
- **MediaWiki OAuth 2.0** — no passwords stored
- **DB-backed token auth** (64-char hex, 30-day expiry)
- **Origin enforcement** — unauthorized cross-origin requests blocked (error 677)
- **Bot/scanner blocking** — sqlmap, nikto, nmap, wget, curl, python-requests, etc.
- **Rate limiting** — 20 req/min global, 5/min AI grading, 10/min submissions
- **Request size limit** — 1MB max
- **Server-side quiz grading** — correct answers never reach the client
- **Anti-cheat** — heartbeat sessions, tab-switch detection, DevTools blocking
- **Input validation** — slug regex, enum checks, URL validation on every endpoint
- **HTTPS-only cookies** — httpOnly, SameSite=lax

Found a vulnerability? See our [Security Hall of Fame](https://wikiforms.toolforge.org/hall-of-fame.php).

---

## 🌍 Translations

WikiForms is available in:

| Language | Code | Coverage |
|---|---|---|
| English | `en` | 100% (97 keys) |
| বাংলা (Bengali) | `bn` | 100% (97 keys) |
| Español | `es` | 74% (72 keys) |
| Français | `fr` | 74% (72 keys) |
| Deutsch | `de` | 22% (21 keys) |

Want to add your language? Visit [/contribute](https://wikiforms.toolforge.org/contribute) — any Wikipedia user can contribute translations.

---

## 📁 Project Structure

```
WikiForms/
├── backend/                    # Laravel 11 API
│   ├── app/Http/Controllers/
│   │   ├── GradingController.php   # AI grading (OpenRouter)
│   │   └── WikiAuthController.php  # MediaWiki OAuth 2.0
│   ├── routes/api.php              # All API routes
│   └── .env.example
├── frontend/                   # React 18 + Vite SPA
│   ├── src/
│   │   ├── components/
│   │   │   ├── FormBuilder.jsx     # Drag-and-drop builder + conditional logic
│   │   │   ├── QuizViewer.jsx      # Quiz/form renderer + anti-cheat
│   │   │   ├── MyFormsDashboard.jsx
│   │   │   ├── ContributeEditor.jsx
│   │   │   └── Header.jsx
│   │   ├── App.css                 # Wikimedia Codex design tokens
│   │   └── i18n.js                 # Translation loader
│   └── public/                     # Static files
├── docker/
│   ├── lighttpd/
│   │   ├── Dockerfile
│   │   └── .lighttpd.conf           # Mirrors Toolforge production exactly
│   └── mysql/
│       └── init.sql                # Full schema — auto-runs on first start
├── docker-compose.yml
└── deploy.sh                       # Toolforge deploy script
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push and open a Pull Request

For translation contributions, use the [/contribute](https://wikiforms.toolforge.org/contribute) page directly.

Bug reports → [GitHub Issues](https://github.com/anafibnshahibul/WikiForms/issues)  
Security reports → [Wikipedia Talk Page](https://en.wikipedia.org/wiki/User_talk:Anaf_Ibn_Shahibul)

---

## 📄 License

- **Source Code** — [GNU General Public License v3.0](LICENSE)
- **Documentation & Media** — [GPL-3.0](https://www.gnu.org/licenses/gpl-3.0.html)

---

<div align="center">

Built with ❤️ by [Anaf Ibn Shahibul](https://en.wikipedia.org/wiki/User:Anaf_Ibn_Shahibul)  
Hosted on [Wikimedia Toolforge](https://toolforge.org) · Part of the open knowledge community

</div>
