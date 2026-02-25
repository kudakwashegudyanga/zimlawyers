#!/bin/bash

echo "🚀 Starting ZimLayers Legal SaaS Deployment..."

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "❌ PM2 not found. Installing PM2..."
    npm install -g pm2
fi

# Kill existing processes
echo "🔄 Stopping existing processes..."
pm2 kill all

# Start backend
echo "📡 Starting backend server..."
cd "$(dirname "$0")/.."
pm2 start backend --name "zimlayers-backend" --start "node server.js" --log "backend.log"

# Wait a moment for backend to start
sleep 3

# Check if frontend directory exists
if [ -d "$(dirname "$0")/../legal-saas-frontend" ]; then
    echo "📱 Starting frontend build..."
    cd "$(dirname "$0")/../legal-saas-frontend"
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        echo "📦 Installing frontend dependencies..."
        npm install
    fi
    
    # Build frontend
    echo "🏗 Building frontend for production..."
    npm run build
    
    # Start frontend server
    echo "🌐 Starting frontend server..."
    pm2 start frontend --name "zimlayers-frontend" --start "npm start" --log "frontend.log" --cwd "$(dirname "$0")/../legal-saas-frontend"
    
    echo "✅ Deployment complete!"
    echo ""
    echo "📊 Services Status:"
    pm2 list
    echo ""
    echo "🌐 Frontend: http://localhost:3000"
    echo "📡 Backend: http://localhost:5000"
    echo ""
    echo "📝 Logs:"
    echo "Backend: pm2 logs zimlayers-backend"
    echo "Frontend: pm2 logs zimlayers-frontend"
    echo ""
    echo "🛑 Stop services: pm2 kill all"
else
    echo "❌ Frontend directory not found!"
    exit 1
fi
