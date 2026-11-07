#!/bin/bash
set -euo pipefail  # stop on the first failure (a failed build must not wipe the live assets)
echo "🔄 Fetching the latest code from GitLab..."
cd ~/frontend || exit
git pull origin main

echo "📦 Building the React project (Vite)..."
npm run build

echo "🧹 Cleaning old build assets..."
rm -rf ~/public_html/assets

echo "🚀 Copying new build files to public_html..."
cp -r ~/frontend/dist/* ~/public_html/

echo "♻️ Restarting Toolforge web service..."
webservice restart

echo "✅ Congratulations Anaf! Your website has been fully updated. 🎉"
