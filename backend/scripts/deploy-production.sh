#!/bin/bash

echo "🌍 Production Deployment Script for ZimLayers Legal SaaS"

# Configuration
BACKEND_PORT=5000
FRONTEND_PORT=3000
NODE_ENV="production"
MONGODB_URI="mongodb://localhost:27017/zimlayers"

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "❌ PM2 not found. Installing PM2..."
    npm install -g pm2
fi

# Kill existing processes
echo "🔄 Stopping existing processes..."
pm2 kill all

# Set environment variables
export NODE_ENV=$NODE_ENV
export MONGODB_URI=$MONGODB_URI

# Start backend in production mode
echo "📡 Starting backend server in production mode..."
cd "$(dirname "$0")/.."
pm2 start backend --name "zimlayers-backend" --start "NODE_ENV=production node server.js" --log "backend.log"

# Wait for backend to start
sleep 5

# Check if frontend build exists
if [ -d "$(dirname "$0")/../legal-saas-frontend/.next" ]; then
    echo "📱 Frontend build found, starting server..."
    cd "$(dirname "$0")/../legal-saas-frontend"
    
    # Start frontend server
    pm2 start frontend --name "zimlayers-frontend" --start "npm start" --log "frontend.log" --cwd "$(dirname "$0")/../legal-saas-frontend"
    
    echo "✅ Production deployment complete!"
    echo ""
    echo "📊 Services Status:"
    pm2 list
    echo ""
    echo "🌐 Frontend: http://localhost:$FRONTEND_PORT"
    echo "📡 Backend: http://localhost:$BACKEND_PORT"
    echo ""
    echo "📝 Logs:"
    echo "Backend: pm2 logs zimlayers-backend"
    echo "Frontend: pm2 logs zimlayers-frontend"
    echo ""
    echo "🛑 Stop services: pm2 kill all"
else
    echo "❌ Frontend build not found! Run 'npm run build' in frontend directory first."
    exit 1
fi
