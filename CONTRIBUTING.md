# Contributing to WikiForms 🤝

Thank you for your interest in contributing to WikiForms! This project is an open-source platform designed to bring modern form building and interactive quiz components to the Wikimedia ecosystem. We welcome developers, testers, and documentation writers to join us.

---

## 🌐 Live Project Ecosystem

Before you start writing code, make sure to check out our live environments and documentation layers:
* **Production Link:** [wikiforms.toolforge.org](https://wikiforms.toolforge.org)
* **Developer Reference Specifications:** [wikiforms.toolforge.org/docs.php](https://wikiforms.toolforge.org/docs.php) — Check here for full API schemas, payload specifications, and component architectures.
* **Contributor Ledger:** [wikiforms.toolforge.org/hall-of-fame.html](https://wikiforms.toolforge.org/hall-of-fame.html) — **[Status: Done ✓]** All merged contributions are officially recognized on our live platform.

---

## 🚀 How to Get Started

### 1. Fork and Clone
First, create an independent copy of this project under your GitHub profile by clicking the **Fork** button. Then, pull it down to your local Linux machine:
```bash
git clone https://github.com/anafibnshahibul/WikiForms
cd WikiForms
```

### 2. Isolate Your Work
Always build your adjustments inside a dedicated feature branch instead of working straight on the `main` branch. This keeps pull requests clean:
```bash
git checkout -b feature/your-awesome-patch
```

### 3. Setup Your Local Workspace
We use a dockerized multi-container setup to keep development standardized. Make sure your local Docker environment is online and initialized correctly:
```bash
# Spin up your local React, Laravel, and MySQL networks
docker compose up -d --build

# Run backend framework scaffolding and asset schemas
docker compose exec backend php artisan key:generate
docker compose exec backend php artisan migrate
```

---

## 🛠️ Code Standards & Expectations

To keep the codebase maintainable, please ensure your code complies with these guidelines before opening a pull request:

### Frontend (React & Vite)
* Follow modular, functional React component practices.
* Keep strings abstracted where possible to support our global `i18n.js` localization engine.
* Keep public assets mapped clearly inside the `frontend/public/` folder without breaking system-level XML configurations.

### Backend (Laravel)
* Adhere strictly to clean PSR-12 coding standard models.
* Secure all api logic by routing tracking states gracefully through appropriate controller middlewares.
* If your change requires updating the database structure, supply a clean migration file inside `database/migrations/`.

---

## 📥 Submitting Your Changes

1. **Commit changes cleanly:** Group related files together. Write concise commit messages explaining the *why* behind your changes.
2. **Push to your fork:** Push your isolated branch up to your personal GitHub repository:
   ```bash
   git push origin feature/your-awesome-patch
   ```
3. **Open a Pull Request:** Navigate back to the primary source repository on GitHub and open a pull request against our `main` branch. Include a descriptive summary of your fixes or implementations.

Once your pull request is audited and merged by a maintainer, your profile will be permanently cataloged on our live [Hall of Fame](https://toolforge.orghall-of-fame.html) tracking ledger!
