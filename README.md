# WikiForms

> An open-source, privacy-first form and quiz builder built specifically for the Wikimedia ecosystem.

<table width="100%">
  <tr>
    <td width="33.3%" align="center">
      <img src="Screenshots/Screenshot 2026-07-07 19.15.51.png" alt="WikiForms Interface Screenshot 1" width="100%" style="border-radius: 8px;" />
    </td>
    <td width="33.3%" align="center">
      <img src="Screenshots/Screenshot 2026-07-07 19.16.01.png" alt="WikiForms Interface Screenshot 2" width="100%" style="border-radius: 8px;" />
    </td>
    <td width="33.3%" align="center">
      <img src="Screenshots/Screenshot 2026-07-07 19.16.23.png" alt="WikiForms Interface Screenshot 3" width="100%" style="border-radius: 8px;" />
    </td>
  </tr>
</table>

<p align="left">
  <a href="https://www.gnu.org/licenses/gpl-3.0.html"><img src="https://img.shields.io/badge/License-GNU%20GPLv3-green.svg" alt="License: GPL-3.0"></a>
  <a href="https://wikitech.wikimedia.org/wiki/Portal:Toolforge"><img src="https://img.shields.io/badge/Hosted%20on-Toolforge-green.svg" alt="Toolforge"></a>
  <a href="https://php.net"><img src="https://img.shields.io/badge/PHP-8.2%2B-777BB4.svg?logo=php&logoColor=white" alt="PHP 8.2+"></a>
  <a href="https://react.dev"><img src="https://img.shields.io/badge/React-18%2B-61DAFB.svg?logo=react&logoColor=black" alt="React 18+"></a>
  <a href="https://wikipedia.org"><img src="https://img.shields.io/badge/Wikipedia-OAuth_2.0-000000.svg?logo=wikipedia&logoColor=white" alt="Wikipedia OAuth"></a>
</p>

🌐 **Live Application:** [wikiforms.toolforge.org](https://wikiforms.toolforge.org)  
📂 **Source Code:** [github.com/anafibnshahibul/WikiForms](https://github.com/anafibnshahibul/WikiForms)  
📖 **Documentation:** [wikiforms.toolforge.org/docs.php](https://wikiforms.toolforge.org/docs.php)

---

## 🌟 Overview

**WikiForms** empowers Wikipedia editors, researchers, and community managers to create custom forms and timed quizzes seamlessly without leaving the Wikimedia ecosystem. Built as a privacy-focused alternative to commercial form providers, WikiForms keeps community data secure, open, and free from third-party tracking.

* **No Extra Credentials:** Authenticate directly using your existing Wikipedia account via OAuth 2.0.
* **Privacy First:** Free from advertisements, commercial analytics, or third-party data tracking.
* **Wikimedia Ready:** Embedded rich text capabilities with full support for interwiki linking.

---

## ✨ Key Features

| Feature | Details |
| :--- | :--- |
| **🔐 Native MediaWiki Auth** | Authenticate securely with MediaWiki OAuth 2.0—no passwords stored locally. |
| **📋 Dynamic Form Builder** | Drag-and-drop interface supporting versatile input and question types. |
| **🧠 Interactive Quiz Engine** | Point assignment, auto-grading support, and scheduled release windows. |
| **🔒 Encrypted Questions** | End-to-end question configuration encryption using standard AES-256-CBC. |
| **🌐 Native Multilingualism** | Full support for English, Bengali (বাংলা), Spanish (Español), and French (Français). |
| **👥 Multi-User Collaboration** | Assign granular editing permissions to other Wikipedia community members. |
| **🛡️ Academic Integrity** | Integrated focus tracking and tab-switch detection for interactive quizzes. |

---

## 🛠️ Tech Stack

* **Frontend:** React 18, Vite, CSS Modules
* **Backend:** Laravel 11 (PHP 8.2+)
* **Database:** MySQL / MariaDB (Wikimedia Toolforge Managed)
* **Authentication:** MediaWiki OAuth 2.0 Provider
* **Hosting Infrastructure:** Wikimedia Toolforge

---

## 🚀 Quick Start & Local Setup
### Using Docker (Recommended)

```bash
# Clone repository
git clone [https://github.com/anafibnshahibul/WikiForms.git](https://github.com/anafibnshahibul/WikiForms.git)
cd WikiForms

# Launch containerized services
docker compose up -d --build

# Run database migrations
docker compose exec backend php artisan migrate
```
## Manual Setup
### Backend Setup
```bash
cd backend
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate

php artisan serve
```
## Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 📡 Core API Summary

Base Endpoint: `https://wikiforms.toolforge.org/api`

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/test-connection` | Service availability & status check | Public |
| `GET` | `/auth/mediawiki` | Initiate MediaWiki OAuth handshake | Public |
| `POST` | `/save-form` | Create or update form payload | Authenticated |
| `GET` | `/get-form/{slug}` | Fetch form metadata and setup | Public |
| `POST` | `/save-response` | Submit completed form entry | Public / Auth |
| `GET` | `/get-responses/{slug}` | Extract form submission records | Form Owner |
| `POST` | `/grade-response` | Execute AI assessment via OpenRouter | Form Owner |

For comprehensive payload specs and schema details, visit our [Full API Documentation](https://wikiforms.toolforge.org/docs.php).

---

## 🛡️ Security & Privacy Policy

WikiForms strictly complies with the [Wikimedia Cloud Services Terms of Use](https://wikitech.wikimedia.org/wiki/Wikitech:Cloud_Services_Terms_of_use).

* **Zero Tracking:** No personal identity vectors or external behavioral trackers are collected.
* **Vulnerability Reporting:** To report security concerns, contact us via the [Wikipedia User Talk Page](https://en.wikipedia.org/wiki/User_talk:Anaf_Ibn_Shahibul).

---

## 📁 Repository Structure

> 💡 The full repository directory tree is automatically generated and updated via GitHub Actions.  
> You can view the live file structure in [`.github/workflows/file-tree.md`](.github/workflows/file-tree.md).

```text
├── CHANGELOG.md
├── CONTRIBUTING.md
├── LICENSE
├── README.md
├── SECURITY.md
├── Screenshots
│   ├── Screenshot 2026-07-07 19.15.51.png
│   ├── Screenshot 2026-07-07 19.16.01.png
│   └── Screenshot 2026-07-07 19.16.23.png
├── backend
│   ├── Dockerfile
│   ├── README.md
│   ├── app
│   │   ├── Http
│   │   │   └── Controllers
│   │   │       ├── Controller.php
│   │   │       ├── GradingController.php
│   │   │       └── WikiAuthController.php
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
│   │   └── robots.txt
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
│   │   ├── api.php.bak
│   │   ├── console.php
│   │   └── web.php
│   ├── server.js
│   ├── storage
│   │   ├── app
│   │   │   ├── private
│   │   │   └── public
│   │   ├── framework
│   │   │   ├── cache
│   │   │   │   └── data
│   │   │   ├── sessions
│   │   │   ├── testing
│   │   │   └── views
│   │   └── logs
│   ├── tests
│   │   ├── Feature
│   │   │   └── ExampleTest.php
│   │   ├── TestCase.php
│   │   └── Unit
│   │       └── ExampleTest.php
│   └── vite.config.js
├── clean_cache.py
├── deploy.sh
├── docker-compose.yml
├── frontend
│   ├── Dockerfile
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
│   │   ├── docs.php
│   │   ├── favicon.svg
│   │   ├── fonts
│   │   │   └── inter-400.woff2
│   │   ├── hall-of-fame.html
│   │   ├── hall-of-fame.php
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
│   ├── src
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── api.js
│   │   ├── components
│   │   │   ├── AboutPage.jsx
│   │   │   ├── ContributeEditor.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── FormBuilder.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── Icon.jsx
│   │   │   ├── MyFormsDashboard.jsx
│   │   │   ├── PrivacyPage.jsx
│   │   │   ├── QuizViewer.jsx
│   │   │   ├── RichTextEditor.jsx
│   │   │   ├── TermsPage.jsx
│   │   │   └── WelcomeScreen.jsx
│   │   ├── i18n.js
│   │   ├── index.css
│   │   └── main.jsx
│   └── vite.config.js
├── jobs.yaml
├── package-lock.json
├── package.json
├── service.manifest
└── toolinfo.json
```

---

## 📄 License

* **Source Code:** Released under the [GNU General Public License v3.0](LICENSE).
* **Documentation & Media:** Licensed under [Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)](https://creativecommons.org/licenses/by-sa/4.0/).
