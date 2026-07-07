# WikiForms 📝

WikiForms is an amazing, intuitive, and modern drag-and-drop form builder specially designed for the Wikimedia ecosystem. It allows users to build, view, and manage interactive components, forms, and quizzes effortlessly. Built as a monorepo, the application features a blazing-fast React frontend paired with a robust and secure Laravel backend.

| Home Page | Drag-and-Drop Form Builder | Interactive Login Window |
| :---: | :---: | :---: |
| <img src="Screenshot 2026-07-07 19.15.51.png" width="100%" alt="WikiForms Builder Dashboard"> | <img src="Screenshot 2026-07-07 19.16.01.png" width="100%" alt="Interactive Quiz Interface - Step 1"> | <img src="Screenshot 2026-07-07 19.16.23.png" width="100%" alt="Interactive Quiz Interface - Step 2"> |
| [See more](https://wikiforms.toolforge.org/) | [🏗️ Open Form Builder](https://wikiforms.toolforge.org/create) | [View Live](https://wikiforms.toolforge.org/) |


---

## 🚀 Key Features

* **Drag-and-Drop Form Builder:** Design custom forms seamlessly with an interactive building interface.
* **Quiz Viewer Component:** Native support for viewing and participating in interactive quizzes and assessments.
* **Modern UI/UX:** Styled beautifully using responsive layouts and the crisp Inter font family.
* **Monorepo Architecture:** Frontend and backend codebases housed cleanly in dedicated, isolated directories.
* **SEO & Analytics Ready:** Shipped with out-of-the-box configurations for web crawlers, open-search capabilities, and security metadata.
* **Dockerized Setup:** Local development environments fully standardized using multi-container orchestrations.

---

## 🛠 Tech Stack

### Frontend
* **Core:** React 18+ (Vite)
* **Internationalization:** i18n localization engine for global language support.
* **Styling & Assets:** Scalable Vector Graphics (SVG), custom icon mappings, and embedded typography fonts.

### Backend
* **Core:** Laravel 10+ / 11 (PHP 8.2+)
* **Architecture:** Traditional MVC setup serving APIs directly to the frontend.

### Infrastructure & Database
* **Database:** MySQL 8.0
* **Containerization:** Docker & Docker Compose

---

## 📂 System Overview (Core Structure)

The system isolates public assets from primary application logic:
```text
├── docker-compose.yml
├── LICENSE
├── README.md
├── frontend/
│   ├── README.md
│   ├── deploy.sh
│   ├── dist
│   │   ├── agents.txt
│   │   ├── assets
│   │   │   ├── FormBuilder-DuhY64Oq.js
│   │   │   ├── favicon-hF1YpoPe.svg
│   │   │   ├── index-DfIME6Xd.css
│   │   │   ├── index-PudhWcJJ.js
│   │   │   └── manifest-Ddc4YVGy.json
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
│   │   ├── index.html
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
│   ├── src
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── components
│   │   │   ├── Footer.jsx
│   │   │   ├── FormBuilder.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── QuizViewer.jsx
│   │   │   └── WelcomeScreen.jsx
│   │   ├── i18n.js
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
├── public_html/
│   ├── agents.txt
│   ├── api.php
│   ├── assets
│   │   ├── FormBuilder-BbwHEhko.js
│   │   ├── FormBuilder-DuhY64Oq.js
│   │   ├── favicon-hF1YpoPe.svg
│   │   ├── index-C3esGQui.js
│   │   ├── index-DfIME6Xd.css
│   │   ├── index-PudhWcJJ.js
│   │   └── manifest-Ddc4YVGy.json
│   ├── browserconfig.xml
│   ├── capabilities.xml
│   ├── clientaccesspolicy.xml
│   ├── crossdomain.xml
│   ├── docs.php
│   ├── favicon.svg
│   ├── fonts
│   │   └── inter-400.woff2
│   ├── hall-of-fame.html
│   ├── humans.txt
│   ├── icons.svg
│   ├── index.html
│   ├── index.php
│   ├── keybase.txt
│   ├── lgappxml.xml
│   ├── llms.txt
│   ├── manifest.json
│   ├── opensearch-style.xsl
│   ├── opensearch.xml
│   ├── pgp-key.txt
│   ├── robots.txt
│   ├── security-policy.html
│   ├── security-report.xml
│   ├── security-report.xsl
│   ├── sitemap.xml
│   └── style.xsl
```

---

## 🐋 Local Docker Setup Guide

Follow these steps to spin up the local development environment using Docker:

### Prerequisites
Make sure you have the following installed on your machine:
* Docker Desktop (or Engine)
* Docker Compose V2

### 1. File Infrastructure
Ensure you have created the configuration files (`Dockerfile` inside `frontend/`, `Dockerfile` inside `backend/`, and `docker-compose.yml` in the root) as mapped out by your project generation wizard.

### 2. Launching Containers
Open your terminal at the root folder of the project and execute the build command:
```bash
docker compose up -d --build
```
*This command runs the processes in detached mode (`-d`), downloading and packaging the React, Laravel, and MySQL networks simultaneously.*

### 3. Running Backend Services
Once the containers are successfully online, execute your asset compilation, application key generation, and database scaffolding:
```bash
# Generate the application encryption key
docker compose exec backend php artisan key:generate

# Build database structures and run schemas
docker compose exec backend php artisan migrate
```

### 4. Port Configuration Mappings
Once fully initialized, your services will be bound to the following network ports locally:

| Service | Technology | Access Link |
| :--- | :--- | :--- |
| **Frontend** | React (Vite) | `http://localhost:5173` |
| **Backend** | Laravel (Artisan) | `http://localhost:8000` |
| **Database** | MySQL Server | `localhost:3306` |

---

## 🔒 Security & Optimization Best Practices

* **System Policies:** Cross-domain access rules and structural XML metadata are kept natively inside the public static layer to support Wikimedia security-report protocols.
* **State Syncing:** Hot module reloading (HMR) maps code updates in your terminal to your container instances dynamically during active coding sessions.

---

## 📄 License

This repository is officially open-sourced. For full details regarding reproduction, rights, and usage permissions, please read our dedicated [LICENSE](https://github.com/anafibnshahibul/WikiForms?tab=License-1-ov-file) page.
