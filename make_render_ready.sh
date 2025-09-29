#!/bin/bash

# ----------------------------
# CONFIGURATION
# ----------------------------
PROJECT_DIR="LegalEaseFile"
ZIP_NAME="LegalEaseFile_render_ready.zip"

# ----------------------------
# 1. Update package.json
# ----------------------------
PACKAGE_JSON="$PROJECT_DIR/package.json"
if [ -f "$PACKAGE_JSON" ]; then
  jq '
    .engines.node = ">=18 <=22" |
    .scripts.start = (.scripts.start // "node dist/index.js") |
    .scripts.build = (.scripts.build // "vite build && tsc")
  ' "$PACKAGE_JSON" > "$PACKAGE_JSON.tmp" && mv "$PACKAGE_JSON.tmp" "$PACKAGE_JSON"
else
  echo "❌ package.json not found!"
  exit 1
fi

# ----------------------------
# 2. Create or update render.yaml
# ----------------------------
cat > "$PROJECT_DIR/render.yaml" <<EOL
services:
  - type: web
    name: legaleasefile
    env: node
    plan: starter
    buildCommand: npm install && npm run build
    startCommand: npm run start
    healthCheckPath: /api/health
    envVars:
      - key: NODE_ENV
        value: production
EOL

# ----------------------------
# 3. Create .gitignore
# ----------------------------
cat > "$PROJECT_DIR/.gitignore" <<EOL
node_modules/
dist/
.env
.DS_Store
EOL

# ----------------------------
# 4. Add Render deployment guide
# ----------------------------
cat > "$PROJECT_DIR/DEPLOY-TO-RENDER.md" <<EOL
# Deploy to Render

1. Push this project to a GitHub repository.
2. Go to [Render](https://dashboard.render.com/) → **New +** → **Blueprint**.
3. Select your repo and deploy.
4. Build Command: \`npm install && npm run build\`
5. Start Command: \`npm run start\`
6. Health Check Path: \`/api/health\`
EOL

# ----------------------------
# 5. Remove node_modules and dist
# ----------------------------
rm -rf "$PROJECT_DIR/node_modules" "$PROJECT_DIR/dist"

# ----------------------------
# 6. Create ZIP
# ----------------------------
zip -r "$ZIP_NAME" "$PROJECT_DIR" -x "*/node_modules/*" -x "*/dist/*"
echo "✅ Render-ready ZIP created: $ZIP_NAME"

# ----------------------------
# 7. Initialize Git Repo & Push to GitHub
# ----------------------------
cd "$PROJECT_DIR" || exit
git init
git add .
git commit -m "Initial Render-ready commit"

echo "✅ Local Git repo initialized."

# Ask for GitHub repo URL
read -p "Enter your GitHub repository URL (e.g., git@github.com:username/repo.git): " REMOTE_URL

# Add remote and push
git remote add origin "$REMOTE_URL"
git branch -M main
git push -u origin main

echo "✅ Code pushed to GitHub: $REMOTE_URL"
echo "🎯 Now go to Render and deploy using Blueprint mode!"
