#!/bin/bash

echo "🚀 ZimLayers Legal SaaS Deployment"

# Check if Git is initialized
if [ ! -d ".git" ]; then
    echo "📝 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit: ZimLayers Legal SaaS"
    echo "✅ Git repository initialized"
fi

# Add GitHub remote
git remote add origin https://github.com/yourusername/zimlayers.git

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push -u origin main

echo "✅ Deployment ready!"
echo ""
echo "🌐 Next steps:"
echo "1. Push code to GitHub main branch"
echo "2. GitHub Actions will auto-deploy to:"
echo "   - Backend: Render"
echo "   - Frontend: Vercel"
echo ""
echo "📊 Monitor at: https://github.com/yourusername/zimlayers/actions"
