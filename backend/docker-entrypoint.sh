#!/bin/bash
set -e
echo "⏳ Waiting for MySQL..."
until mysqladmin ping -h"$DB_HOST" -u"$DB_USERNAME" -p"$DB_PASSWORD" --silent 2>/dev/null; do
  sleep 2
done
echo "✅ DB ready"

if ! grep -q "APP_KEY=base64:" /app/.env 2>/dev/null; then
  echo "🔑 Generating APP_KEY..."
  php artisan key:generate --no-interaction --force
fi

echo "🗃️ Running migrations..."
php artisan migrate --no-interaction --force

echo "🧹 Clearing caches..."
php artisan config:clear
php artisan cache:clear

echo "🚀 Starting PHP-FPM..."
exec "$@"
