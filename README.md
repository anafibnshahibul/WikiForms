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
├── frontend
│   ├── src
│   │   ├── components
│   │   │   ├── FormBuilder.jsx   # Core drag-and-drop mechanics
│   │   │   ├── QuizViewer.jsx    # Interactive quiz rendered logic
│   │   │   ├── Header.jsx        # Navigation system
│   │   │   └── Footer.jsx        # Platform footer links
│   │   ├── App.jsx               # Central router and state entry
│   │   └── i18n.js               # Localization configuration
│   └── public                    # Public configurations (robots, human, security policies)
└── backend                       # Core API microservice (Laravel engine)
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
