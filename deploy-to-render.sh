#!/bin/bash

echo "🚀 Preparing Friend-Lite for Render deployment..."

# Check if we're in the right directory
if [ ! -f "backends/advanced/Dockerfile" ]; then
    echo "❌ Please run this script from the friendlite root directory"
    exit 1
fi

# Add all changes
echo "📦 Adding all changes to git..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "Prepare Friend-Lite backend for Render deployment

- Optimized Dockerfile for Render
- Added render.yaml configuration
- Updated environment variables for cloud deployment
- Added comprehensive deployment guide"

# Push to GitHub
echo "⬆️  Pushing to GitHub..."
git push origin main

echo "✅ Ready for Render deployment!"
echo ""
echo "Next steps:"
echo "1. Go to https://render.com"
echo "2. Connect your GitHub repo: amywork777/friendlite"  
echo "3. Set root directory: backends/advanced"
echo "4. Follow the guide in backends/advanced/RENDER_DEPLOYMENT.md"
echo ""
echo "🎉 Your app will be available at: https://friendlite-backend.onrender.com"