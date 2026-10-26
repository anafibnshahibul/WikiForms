#!/usr/bin/env bash

PROJECT_DIR="/var/www/WikiForms"

echo "Showing live Laravel backend logs (Press Ctrl+C to exit)..."
tail -f "$PROJECT_DIR/backend/storage/logs/laravel.log"
