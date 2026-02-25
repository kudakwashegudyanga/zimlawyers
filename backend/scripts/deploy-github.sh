#!/bin/bash

echo "🚀 Deploying ZimLayers to GitHub..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📝 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit: ZimLayers Legal SaaS"
    echo "✅ Git repository initialized"
fi

# Add remote if not exists
if ! git remote get-url origin &> /dev/null; then
    echo "🔗 Adding GitHub remote..."
    git remote add origin https://github.com/yourusername/zimlayers.git
fi

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push -u origin main

echo "✅ Code pushed to GitHub!"
echo ""
echo "🌐 GitHub Actions will now deploy to:"
echo "   Backend: Render"
echo "   Frontend: Vercel"
echo ""
echo "📊 Monitor deployment at:"
echo "   GitHub: https://github.com/yourusername/zimlayers/actions"
