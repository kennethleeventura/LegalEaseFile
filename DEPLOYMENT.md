# LegalEaseFile Comprehensive Deployment Guide

## 🚀 **Quick Deploy Options**

### **Option 1: One-Click Replit Deploy (Recommended)**
[![Deploy on Replit](https://replit.com/badge/github/yourusername/legaleasefile)](https://replit.com/new/github/yourusername/legaleasefile)

### **Option 2: Render Deploy**
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

### **Option 3: Railway Deploy**
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template/your-template-id)

## 📋 **Prerequisites**

- ✅ Node.js 18+
- ✅ PostgreSQL database (Neon/Supabase recommended)
- ✅ Domain name with SSL
- ✅ Required API keys (see below)

## 🔑 **Required Environment Variables**

### **Essential Services**
```bash
# Database (Choose one)
DATABASE_URL=postgresql://user:pass@host:port/db

# OpenAI (Required for AI features)
OPENAI_API_KEY=sk-your-openai-key

# Stripe (Required for monetization)
STRIPE_SECRET_KEY=sk_live_your-stripe-secret
STRIPE_PUBLIC_KEY=pk_live_your-stripe-public
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# Authentication
REPLIT_DOMAINS=your-domain.com
ISSUER_URL=https://replit.com/oidc
REPL_ID=your-repl-id
SESSION_SECRET=your-secure-session-secret

# Production settings
NODE_ENV=production
PORT=5000
```

### **Optional Services (Enhanced Features)**
```bash
# Airtable (Case management)
AIRTABLE_API_KEY=keyyour-airtable-key
AIRTABLE_BASE_ID=appyour-base-id

# Email Service (Notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## 🏗️ **Build Process**

```bash
# 1. Install dependencies
npm install

# 2. Build application
npm run build

# 3. Set up database
npm run db:push

# 4. Start production server
npm start
```

## 🌐 **Deployment Configurations**

### **Replit Deployment (Easiest)**

1. **Fork Repository**: Click "Fork" on Replit
2. **Set Secrets**: Add all environment variables in Replit Secrets
3. **Auto-Deploy**: Replit handles everything automatically
4. **Custom Domain**: Add your domain in Replit settings

### **Render Deployment**

1. **Connect Repository**: Link your GitHub repo to Render
2. **Create Web Service**: Choose "Web Service" option
3. **Configure Build**:
   - Build Command: `npm run build`
   - Start Command: `npm start`
4. **Set Environment Variables**: Add all required env vars
5. **Deploy**: Click deploy button

### **Railway Deployment**

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

## 🗄️ **Database Setup**

### **Option 1: Neon (Recommended - Free Tier)**
1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Use as `DATABASE_URL`

### **Option 2: Render PostgreSQL**
1. Create PostgreSQL database in Render
2. Copy the internal connection string
3. Use as `DATABASE_URL`

## 💳 **Stripe Setup (Monetization)**

### **1. Create Stripe Account**
- Sign up at [stripe.com](https://stripe.com)
- Complete business verification
- Get API keys from Dashboard

### **2. Configure Webhooks**
- Endpoint: `https://yourdomain.com/api/stripe/webhook`
- Events: `customer.subscription.created`, `customer.subscription.updated`, `invoice.payment_succeeded`

## 🔒 **Security Configuration**

### **Environment Variables Security**
- Never commit `.env` files
- Use platform-specific secret management
- Rotate keys regularly
- Use different keys for staging/production

### **HTTPS Setup**
- Most platforms (Replit, Render, Railway) provide automatic HTTPS
- For custom domains, ensure SSL certificates are configured
- Enable HSTS headers for security

## 📊 **Monitoring & Analytics**

### **Built-in Features**
- Analytics dashboard at `/analytics`
- Revenue tracking in real-time
- User behavior monitoring
- Performance metrics

### **Health Checks**
- `/api/health` - Application health
- `/api/db-health` - Database connectivity
- Automatic monitoring on most platforms

## 🚨 **Troubleshooting**

### **Common Issues**

**1. Database Connection Failed**
```bash
# Check connection string format
# Ensure database is accessible
# Verify credentials
```

**2. Build Failures**
```bash
# Clear cache
rm -rf node_modules
npm install
npm run build
```

**3. Environment Variables Not Loading**
```bash
# Check variable names match exactly
# Ensure no trailing spaces
# Restart service after changes
```

## 💰 **Revenue Tracking Setup**

### **Analytics Dashboard**
- Access at `/analytics` after deployment
- Monitor all revenue streams
- Track conversion rates
- Export financial reports

### **Stripe Integration**
- Real-time payment processing
- Subscription management
- Automated billing
- Revenue analytics

## 🎉 **Deployment Checklist**

- [ ] Repository connected to deployment platform
- [ ] All environment variables configured
- [ ] Database set up and accessible
- [ ] Stripe account configured with webhooks
- [ ] Domain name configured (if using custom domain)
- [ ] SSL certificate active
- [ ] Health checks passing
- [ ] Analytics tracking enabled
- [ ] Backup system configured
- [ ] Monitoring alerts set up

## 🆘 **Support**

- 📧 **Email**: support@legaleasefile.com
- 💬 **Documentation**: Available in `/docs` route
- 🔧 **Issues**: GitHub Issues for technical problems

---

**🚀 Your LegalEaseFile platform is now ready for production with full monetization capabilities!**