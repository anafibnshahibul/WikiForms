#!/bin/bash
echo "🔄 Fetching the latest code from GitLab..."
cd ~/frontend || exit
git pull origin main

echo "📦 Building the React project (Vite)..."
npm run build

echo "🚀 Copying assets to public_html (index.html preserved)..."
cp -r ~/frontend/dist/assets ~/public_html/

# Auto-update asset filenames in our custom index.html
python3 - << 'PYEOF'
import os, re
dist = open(os.path.expanduser("~/frontend/dist/index.html")).read()

js  = re.search(r'src="/assets/(index-[^"]+\.js)"', dist)
css = re.search(r'href="/assets/(index-[^"]+\.css)"', dist)

html_path = os.path.expanduser("~/public_html/index.html")
html = open(html_path).read()

if js:
    html = re.sub(r'index-[A-Za-z0-9]+\.js', js.group(1), html)
if css:
    html = re.sub(r'index-[A-Za-z0-9]+\.css', css.group(1), html)

open(html_path, "w").write(html)
print(f"index.html updated — JS: {js.group(1) if js else '?'}, CSS: {css.group(1) if css else '?'}")
PYEOF

echo "♻️ Restarting Toolforge web service..."
webservice restart
echo "✅ Congratulations Anaf! Your website has been fully updated. 🎉"
