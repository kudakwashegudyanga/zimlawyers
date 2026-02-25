# 🚀 ZimLayers Legal SaaS Deployment Guide

This guide covers deployment to GitHub Actions, Render (Backend), and Vercel (Frontend).

## 📋 Prerequisites

### Required Accounts & Services
- **GitHub Account** (for code hosting & CI/CD)
- **Render Account** (for backend hosting)
- **Vercel Account** (for frontend hosting)
- **MongoDB Atlas** (recommended for production database)
- **Domain Name** (optional, for custom domain)

### Environment Variables Needed
```bash
# Backend (Render)
NODE_ENV=production
MONGODB_URI=mongodb+srv://your-connection-string
JWT_SECRET=your-jwt-secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Frontend (Vercel)
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
```

## 🌐 Deployment Options

### Option 1: GitHub Actions + Render + Vercel (Recommended)
**Best for:** Production, automated deployments, team collaboration

### Option 2: Manual Deployment
**Best for:** Quick testing, full control

---

## 🎯 Option 1: Automated Deployment

### Step 1: Setup GitHub Repository
```bash
# Initialize Git if not already done
git init
git add .
git commit -m "Initial commit: ZimLayers Legal SaaS"

# Add remote
git remote add origin https://github.com/yourusername/zimlayers.git
git push -u origin main
```

### Step 2: Setup Backend on Render
1. **Create Render Account:**
   - Go to [render.com](https://render.com)
   - Sign up and create New Web Service

2. **Connect GitHub Repository:**
   - In Render dashboard, connect your GitHub repository
   - Select `main` branch
   - Set build command: `npm install && npm run start`

3. **Configure Environment Variables:**
   - Add all required environment variables (see Prerequisites section)
   - **Important:** Never commit sensitive data to Git

4. **Deploy Backend:**
   - Push to GitHub main branch
   - Render will auto-deploy on push
   - Backend will be available at: `https://your-app-name.onrender.com`

### Step 3: Setup Frontend on Vercel
1. **Create Vercel Account:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub account

2. **Import GitHub Repository:**
   - In Vercel dashboard, click "Add New Project"
   - Import your GitHub repository
   - Select `main` branch

3. **Configure Environment Variables:**
   - Add `NEXT_PUBLIC_API_URL` pointing to your Render backend URL
   - Example: `https://zimlayers-backend.onrender.com`

4. **Deploy Frontend:**
   - Vercel will auto-deploy on GitHub push
   - Frontend will be available at: `https://your-app-name.vercel.app`

### Step 4: Setup GitHub Actions (Optional but Recommended)
1. **Create GitHub Secrets:**
   ```bash
   # In GitHub repo settings > Secrets and variables > Actions
   RENDER_SERVICE_ID=your-render-service-id
   RENDER_API_KEY=your-render-api-key
   VERCEL_ORG_ID=your-vercel-org-id
   VERCEL_PROJECT_ID=your-vercel-project-id
   MONGODB_URI=your-mongodb-connection-string
   JWT_SECRET=your-jwt-secret
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

2. **Deploy Workflow:**
   - Push to GitHub main branch
   - GitHub Actions will automatically deploy both services
   - Monitor deployment in Actions tab

---

## 🛠️ Option 2: Manual Deployment

### Manual Backend Deployment
```bash
# Clone and setup
git clone https://github.com/yourusername/zimlayers.git
cd zimlayers/backend
npm install

# Configure environment
cp .env.example .env
# Edit .env with your production values

# Deploy to Render manually
npm install -g render-cli
render login
render deploy --env-file .env
```

### Manual Frontend Deployment
```bash
# Clone and setup
cd ../legal-saas-frontend
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your production values

# Build and deploy
npm run build
npm install -g vercel
vercel --prod
```

---

## 🔧 Configuration Files

### Backend Configuration
- **`render.yaml`** - Render service configuration
- **`server.js`** - Main server file (already configured)
- **`.env`** - Environment variables (create from `.env.example`)

### Frontend Configuration
- **`vercel.json`** - Vercel deployment settings
- **`next.config.js`** - Next.js configuration
- **`.env.local`** - Local environment variables

---

## 📊 Monitoring & Logs

### Render Backend
- **Dashboard:** `https://dashboard.render.com`
- **Logs:** Available in Render dashboard
- **Health Check:** `https://your-app-name.onrender.com/health`

### Vercel Frontend
- **Dashboard:** `https://vercel.com/dashboard`
- **Logs:** Available in Vercel dashboard
- **Analytics:** Built-in Vercel analytics

---

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow
- **Trigger:** Push to `main` or `develop` branches
- **Backend:** Deploys to Render
- **Frontend:** Deploys to Vercel
- **Environment:** Production
- **Rollback:** Previous deployments available in both platforms

---

## 🚨 Troubleshooting

### Common Issues
1. **Build Failures:** Check Node.js version compatibility
2. **Database Connection:** Verify MongoDB URI and network access
3. **Environment Variables:** Ensure all required variables are set
4. **CORS Issues:** Check frontend API URL configuration
5. **Deployment Failures:** Review logs in respective dashboards

### Quick Commands
```bash
# Check deployment status
pm2 list

# View logs
pm2 logs zimlayers-backend

# Restart services
pm2 restart all

# Stop all services
pm2 kill all
```

---

## 🎯 Production URLs

After successful deployment:
- **Backend API:** `https://your-app-name.onrender.com/api`
- **Frontend App:** `https://your-app-name.vercel.app`
- **Health Check:** `https://your-app-name.onrender.com/health`

---

## 📞 Support

For deployment issues:
- **Render Support:** [support.render.com](https://support.render.com)
- **Vercel Support:** [vercel.com/support](https://vercel.com/support)
- **GitHub Issues:** Check Actions tab for failed workflows

---

## ✅ Deployment Checklist

Before going live:
- [ ] All environment variables configured
- [ ] Database connection tested
- [ ] Frontend builds successfully
- [ ] API endpoints tested
- [ ] Authentication flow working
- [ ] Email service configured
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificates verified
- [ ] Monitoring setup
- [ ] Backup strategy implemented

---

**Happy Deploying! 🚀**
