# WikiForms

> Open-source form and quiz builder for the Wikimedia ecosystem.

[![License: GPL-3.0 license](https://img.shields.io/badge/license-%20%20GNU%20GPLv3%20-green)](https://www.gnu.org/licenses/gpl-3.0.html)
[![Toolforge](https://img.shields.io/badge/Hosted%20on-Toolforge-green)](https://wikitech.wikimedia.org/wiki/Portal:Toolforge)
[![PHP](https://img.shields.io/badge/PHP-8.2%2B-purple)](https://php.net)
[![React](https://img.shields.io/badge/React-18%2B-61dafb)](https://react.dev)

**Live:** https://wikiforms.toolforge.org  
**Repo:** https://github.com/anafibnshahibul/WikiForms  
**Docs:** https://wikiforms.toolforge.org/docs.php

---

## What is WikiForms?

WikiForms lets Wikipedia editors, researchers, and community members create forms and quizzes without leaving the Wikimedia ecosystem — and without sharing data with third-party corporations like Google.

Log in with your Wikipedia account. No separate sign-up needed.

---

## Features

| Feature | Description |
|---------|-------------|
| 🔐 Wikipedia Login | MediaWiki OAuth 2.0 — no password stored |
| 📋 Form Builder | Drag-and-drop, multiple question types |
| 🧠 Quiz Mode | Points, correct answers, scheduled start/end |
| 🔒 Encrypted Storage | AES-256-CBC for form questions |
| 🌐 Multilingual | EN, BN, ES, FR + community contributions |
| 👥 Collaborators | Share edit access with other Wikipedia users |
| 🔗 Wiki Links | Rich text with interwiki link support |
| 🛡 Anti-Cheat | Tab-switch detection for quizzes |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Backend | Laravel 11 (PHP 8.2+) |
| Database | MySQL/MariaDB (Toolforge) |
| Auth | MediaWiki OAuth 2.0 |
| Hosting | Wikimedia Toolforge |

---

## Project Structure

```
├── docker-compose.yml
├── LICENSE
├── jobs.yaml
├── README.md
├── frontend/
│   ├── README.md
│   ├── deploy.sh
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── public
│   │   ├── agents.txt
│   │   ├── browserconfig.xml
│   │   ├── capabilities.xml
│   │   ├── clientaccesspolicy.xml
│   │   ├── crossdomain.xml
│   │   ├── favicon.svg
│   │   ├── fonts
│   │   │   └── inter-400.woff2
│   │   ├── hall-of-fame.html
│   │   ├── humans.txt
│   │   ├── icons.svg
│   │   ├── keybase.txt
│   │   ├── lgappxml.xml
│   │   ├── llms.txt
│   │   ├── manifest.json
│   │   ├── opensearch-style.xsl
│   │   ├── opensearch.xml
│   │   ├── pgp-key.txt
│   │   ├── robots.txt
│   │   ├── security-policy.html
│   │   ├── security-report.xml
│   │   ├── security-report.xsl
│   │   ├── sitemap.xml
│   │   └── style.xsl
│   ├── src/
│   │   ├── components/
│   │   │   ├── FormBuilder.jsx
│   │   │   ├── QuizViewer.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── WelcomeScreen.jsx
│   │   │   ├── ContributeEditor.jsx
│   │   │   ├── MyFormsDashboard.jsx
│   │   │   ├── AboutPage.jsx
│   │   │   ├── PrivacyPage.jsx
│   │   │   ├── TermsPage.jsx
│   │   │   └── RichTextEditor.jsx
│   │   ├── App.jsx
│   │   ├── i18n.js
│   │   └── api.js
│   │   ├── index.css
│   │   └── main.jsx
│   └── vite.config.js
├── backend/
│   ├── README.md
│   ├── app
│   │   ├── Http
│   │   │   └── Controllers
│   │   ├── Models
│   │   │   ├── Quiz.php
│   │   │   ├── QuizResponse.php
│   │   │   └── User.php
│   │   └── Providers
│   │       └── AppServiceProvider.php
│   ├── artisan
│   ├── bootstrap
│   │   ├── app.php
│   │   ├── cache
│   │   │   ├── packages.php
│   │   │   └── services.php
│   │   └── providers.php
│   ├── composer.json
│   ├── composer.lock
│   ├── config
│   │   ├── app.php
│   │   ├── auth.php
│   │   ├── cache.php
│   │   ├── database.php
│   │   ├── filesystems.php
│   │   ├── logging.php
│   │   ├── mail.php
│   │   ├── queue.php
│   │   ├── sanctum.php
│   │   ├── services.php
│   │   └── session.php
│   ├── database
│   │   ├── database.sqlite
│   │   ├── factories
│   │   │   └── UserFactory.php
│   │   ├── migrations
│   │   │   ├── 0001_01_01_000000_create_users_table.php
│   │   │   ├── 0001_01_01_000001_create_cache_table.php
│   │   │   ├── 0001_01_01_000002_create_jobs_table.php
│   │   │   ├── 2026_06_02_144159_create_personal_access_tokens_table.php
│   │   │   ├── 2026_06_02_145225_create_quizzes_table.php
│   │   │   ├── 2026_06_02_151323_create_quiz_responses_table.php
│   │   │   ├── 2026_06_04_061022_create_forms_table.php
│   │   │   ├── 2026_06_16_000001_add_collaborators_to_forms_table.php
│   │   │   └── 2026_06_16_000002_add_timer_to_forms.php
│   │   └── seeders
│   │       └── DatabaseSeeder.php
│   ├── package.json
│   ├── phpunit.xml
│   ├── public
│   │   ├── favicon.ico
│   │   ├── index.php
│   │   ├── robots.txt
│   │   └── storage
│   ├── resources
│   │   ├── css
│   │   │   └── app.css
│   │   ├── js
│   │   │   ├── app.js
│   │   │   └── bootstrap.js
│   │   └── views
│   │       └── welcome.blade.php
│   ├── routes
│   │   ├── api.php
│   │   ├── console.php
│   │   └── web.php
│   ├── server.js
│   ├── storage
│   │   ├── app
│   │   │   ├── private
│   │   │   └── public
│   │   ├── framework
│   │   │   ├── cache
│   │   │   ├── sessions
│   │   │   ├── testing
│   │   │   └── views
│   │   └── logs
│   │       └── laravel.log
│   ├── tests
│   │   ├── Feature
│   │   │   └── ExampleTest.php
│   │   ├── TestCase.php
│   │   └── Unit
│   │       └── ExampleTest.php
│   └── vite.config.js
```
---

## API

Base URL: `https://wikiforms.toolforge.org/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/test-connection` | Health check |
| GET | `/auth/mediawiki` | Start OAuth login |
| POST | `/save-form` | Create/update form |
| GET | `/get-form/{slug}` | Get form metadata |
| POST | `/get-form-questions/{slug}` | Get encrypted questions |
| POST | `/save-response` | Submit form response |
| GET | `/get-responses/{slug}` | Get responses (owner only) |
| POST | `/grade-response` | AI grading via OpenRouter |
| GET | `/usr-lang/{lang}` | Get translations |
| POST | `/editor` | Save draft translation |
| POST | `/publisher` | Publish translation |
| GET | `/my-forms/{username}` | Get user's forms |

Full docs: https://wikiforms.toolforge.org/docs.php

---

## Local Development

```bash
git clone https://github.com/anafibnshahibul/WikiForms.git
cd WikiForms

# Backend
cd backend
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate

# Frontend
cd ../frontend
npm install
npm run dev
```

Or with Docker:

```bash
docker compose up -d --build
docker compose exec backend php artisan migrate
```

---

## Contributing

Contributions are welcome!

- **Code:** Open a PR on GitHub
- **Translations:** Visit https://wikiforms.toolforge.org/contribute (Wikipedia account required)
- **Bugs:** https://github.com/anafibnshahibul/WikiForms/issues
- **Security:** Contact via [Wikipedia talk page](https://en.wikipedia.org/wiki/User_talk:Anaf_Ibn_Shahibul)

---

## Privacy & Compliance

- No PII collected
- No tracking or ads
- Compliant with [Toolforge Terms of Use](https://wikitech.wikimedia.org/wiki/Wikitech:Cloud_Services_Terms_of_use)
- Full [Privacy Policy](https://wikiforms.toolforge.org/privacy)

---

## License

- **Code:** [GPL-3.0 license](LICENSE)
- **Documentation:** [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)

Not affiliated with or endorsed by the Wikimedia Foundation.

---

*Developed with ❤️ by [Anaf Ibn Shahibul](https://en.wikipedia.org/wiki/User:Anaf_Ibn_Shahibul)*
EOF
