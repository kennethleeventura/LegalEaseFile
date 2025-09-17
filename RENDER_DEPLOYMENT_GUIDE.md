# 🚀 LegalEaseFile - Render Deployment Guide

## 📋 Prerequisites
- GitHub repository: `https://github.com/kennethleeventura/LegalEaseFile.git`
- Render account: [render.com](https://render.com)

## 🎯 Quick Deploy Steps

### 1. Create New Web Service on Render
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub account if not already connected
4. Select **"kennethleeventura/LegalEaseFile"** repository

### 2. Configure Service Settings
```yaml
Name: legaleasefile
Runtime: Node
Region: Oregon (or closest to your users)
Branch: main
Build Command: npm ci && npm run build
Start Command: npm start
```

### 3. Set Environment Variables
In the Render dashboard, add these environment variables:

**Required Variables:**
```env
NODE_ENV=production
DATABASE_URL=file:./production.db
SESSION_SECRET=[Generate a secure random string]
ALLOWED_DOMAINS=your-app-name.onrender.com,www.your-domain.com
```

**Optional API Keys (for full functionality):**
```env
OPENAI_API_KEY=[Your OpenAI API key for AI features]
STRIPE_SECRET_KEY=[Your Stripe secret key for payments]
AIRTABLE_API_KEY=[Your Airtable API key for MPC features]
AIRTABLE_BASE_ID=[Your Airtable base ID]
```

### 4. Advanced Settings
- **Auto-Deploy**: ✅ Enabled (deploys automatically on git push)
- **Health Check Path**: `/health`
- **Plan**: Start with **Starter** ($7/month), upgrade to **Standard** as needed

## 🏗️ Deployment Features Included

### ✅ Complete LegalEaseFile Platform
- **Tier 1**: Case Assessment, Document Assembly, E-Filing Integration
- **Tier 2**: AI Strategy Advisor, Compliance Monitor, Evidence Management
- **Tier 3**: Predictive Analytics, Advanced Litigation Management
- **Content Systems**: Automated Blog, Glossary, SEO, Link Management
- **Specialty Features**: Emergency Filing, Pro Bono Directory, MPC AI Assistant

### ✅ Production-Ready Configuration
- Health check endpoint at `/health`
- Production database (SQLite)
- Session management
- CORS configured for your domain
- Environment-based configuration

## 🌐 Custom Domain Setup (Optional)

### 1. Add Custom Domain in Render
1. Go to your service → **Settings** → **Custom Domains**
2. Add your domain (e.g., `legaleasefile.com`)
3. Configure DNS records as shown in Render

### 2. Update Environment Variables
```env
ALLOWED_DOMAINS=legaleasefile.com,www.legaleasefile.com,your-app-name.onrender.com
```

## 🔧 Post-Deployment Setup

### 1. Verify Deployment
- Visit your app URL: `https://your-app-name.onrender.com`
- Check health endpoint: `https://your-app-name.onrender.com/health`
- Test core features and authentication

### 2. Configure API Keys (Optional)
- **OpenAI**: Add your API key for AI-powered features
- **Stripe**: Add keys for payment processing
- **Airtable**: Add credentials for MPC AI Assistant

### 3. Database Initialization
The SQLite database will be automatically created and initialized on first run.

## 📊 Monitoring & Scaling

### Basic Monitoring
- Render provides built-in metrics and logs
- Health check ensures uptime monitoring
- Automatic deployments on code changes

### Scaling Options
- **Starter**: Good for development/testing
- **Standard**: Production workloads (recommended)
- **Pro**: High-traffic applications

## 🔒 Security Features

### Included Security
- HTTPS automatically enabled
- Session management with secure cookies
- CORS protection
- Environment variable protection
- Authentication system

### Additional Security (Recommended)
- Set strong SESSION_SECRET
- Use environment variables for all sensitive data
- Regular dependency updates via Dependabot

## 🚨 Troubleshooting

### Common Issues

**Build Failures:**
- Check Node.js version compatibility
- Verify all dependencies in package.json
- Review build logs in Render dashboard

**Database Issues:**
- SQLite is file-based and persistent on Render
- Database resets only on manual deletion
- Check file permissions and paths

**Environment Variables:**
- Double-check variable names and values
- Ensure no trailing spaces or special characters
- Restart service after changing variables

### Getting Help
- Check Render logs: Service → Logs
- Review health endpoint: `/health`
- Monitor service metrics in dashboard

## 🎉 Success!

Your LegalEaseFile platform should now be live at:
`https://your-app-name.onrender.com`

The complete legal automation suite is ready for production use with all features:
- AI-powered legal document processing
- Automated content management
- Emergency filing capabilities
- Pro bono directory and MPC AI assistant
- Professional coral-centric design

## 📞 Support

For deployment issues:
- Check Render documentation
- Review service logs
- Verify environment configuration
- Test locally before deploying

---

**Deployment Status**: ✅ Ready for Production
**Last Updated**: December 2024
**Platform**: Complete LegalEaseFile Suite