# Changelog 📋

All notable changes to the WikiForms project will be documented in this file. This project adheres to Semantic Versioning specifications.

## - 2026-07-07

### Added
* **Monorepo Architecture:** Initial separation of isolated `frontend/` (React) and `backend/` (Laravel) workspaces.
* **Form Builder Engine:** Drag-and-drop functional elements added inside `FormBuilder.jsx`.
* **Quiz Viewer Engine:** Core rendering mechanics inside `QuizViewer.jsx`.
* **Multi-Container Infrastructure:** Standardized local `docker-compose.yml` orchestrating React, Laravel, and MySQL 8.0 instances.
* **Production Build Maps:** Integrated native symlink routing rules mapping directly into `public_html/`.

### Fixed
* **Storage Permissions:** Configured forced `www-data` ownership adjustments for Laravel's caching structures within Docker instances.
* **Markdown Rendering Grid:** Rebalanced table syntax layouts inside repository documentation files to prevent column breaks.

### Completed
* **Contributor Ledger:** The live [hall-of-fame.html](https://wikiforms.toolforge.org/hall-of-fame.html) infrastructure is fully initialized and operational. **[Status: Done ✓]**
