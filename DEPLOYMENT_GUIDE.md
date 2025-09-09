# LegalFile AI - Production Deployment Guide

## ✅ Pre-Deployment Checklist

### 1. Code Quality & Build
- [x] TypeScript compilation passes (`npm run check`)
- [x] Frontend builds successfully (`vite build`)
- [x] Server builds successfully (`esbuild`)
- [x] All critical dependencies installed
- [x] Cross-platform compatibility (cross-env added)

### 2. Environment Variables Setup

**Required Environment Variables:**

```bash
# Database Configuration
DATABASE_URL=postgresql://username:password@host:port/database

# Authentication
REPLIT_DOMAINS=your-repl-name.replit.app,your-custom-domain.com
SESSION_SECRET=your-secure-random-session-secret-key-here

# Payment Processing (Stripe)
STRIPE_SECRET_KEY=sk_live_... # Use sk_test_... for testing
VITE_STRIPE_PUBLIC_KEY=pk_live_... # Use pk_test_... for testing

# AI Services
OPENAI_API_KEY=sk-your-openai-api-key-here

# Case Management (Airtable)
AIRTABLE_API_KEY=keyYourAirtableApiKey
AIRTABLE_BASE_ID=appYourAirtableBaseId

# Optional
NODE_ENV=production
PORT=5000
```

### 3. Database Setup

**Step 1: Create PostgreSQL Database**
- Use Neon, Supabase, or any PostgreSQL provider
- Ensure the database supports UUID generation (`gen_random_uuid()`)

**Step 2: Push Database Schema**
```bash
npm run db:push
```

**Step 3: Verify Tables Created**
The following tables should be created:
- `sessions` - User session storage
- `users` - User accounts and subscriptions
- `documents` - Uploaded documents and analysis
- `document_templates` - Legal document templates
- `legal_aid_organizations` - Pro bono attorney directory
- `filing_history` - Document filing records
- `subscription_plans` - Pricing tiers

### 4. External Service Configuration

**Stripe Setup:**
1. Create Stripe account
2. Configure webhook endpoints for subscription events
3. Set up subscription products with these price IDs:
   - Basic: `price_1QZixNJFx4DyG3C8MF9yzuGQ`
   - Professional: Update in `server/storage.ts`
   - Enterprise: Update in `server/storage.ts`

**OpenAI Setup:**
1. Create OpenAI account
2. Generate API key with GPT-4o access
3. Set usage limits and billing alerts

**Airtable Setup:**
1. Create Airtable base for case management
2. Generate API key with base access
3. Configure tables for secure case data storage

### 5. Security Configuration

**HTTPS Requirements:**
- SSL certificate configured
- Secure cookie settings enabled
- CORS properly configured for production domains

**Data Protection:**
- AES-256 encryption for sensitive case data
- Session-based authentication with secure cookies
- Environment variables properly secured

## 🚀 Deployment Steps

### Step 1: Environment Setup
```bash
# Set all required environment variables
export DATABASE_URL="postgresql://..."
export STRIPE_SECRET_KEY="sk_live_..."
# ... (set all other variables)
```

### Step 2: Database Migration
```bash
npm run db:push
```

### Step 3: Build Application
```bash
npm run build
```

### Step 4: Start Production Server
```bash
npm run start
```

### Step 5: Verify Deployment
1. Check server starts without errors
2. Verify database connectivity
3. Test authentication flow
4. Validate API endpoints
5. Confirm payment processing
6. Test document upload and analysis

## 🔧 Production Configuration

### Replit Deployment
The application is configured for Replit autoscale deployment:
- Build command: `npm run build`
- Start command: `npm run start`
- Port: 5000 (configured in .replit)

### Environment-Specific Settings

**Development:**
- Uses Vite dev server with HMR
- Development error overlay enabled
- Debug logging enabled

**Production:**
- Serves static files from `dist/public`
- Optimized builds with minification
- Error handling without stack traces
- Secure session configuration

## 📊 Monitoring & Maintenance

### Health Checks
- Database connection status
- External API availability (OpenAI, Stripe, Airtable)
- Memory and CPU usage
- Error rates and response times

### Logging
- API request/response logging
- Error tracking and alerting
- User activity monitoring
- Performance metrics

### Backup Strategy
- Database backups (automated)
- Document storage backups
- Configuration backups
- Disaster recovery plan

## 🚨 Troubleshooting

### Common Issues

**Build Failures:**
- Check TypeScript compilation: `npm run check`
- Verify all dependencies installed: `npm install`
- Check for missing environment variables

**Database Connection:**
- Verify DATABASE_URL format
- Check database server accessibility
- Ensure UUID extension enabled

**Authentication Issues:**
- Verify REPLIT_DOMAINS configuration
- Check SESSION_SECRET is set
- Validate HTTPS configuration

**Payment Processing:**
- Confirm Stripe keys are correct (live vs test)
- Verify webhook endpoints configured
- Check subscription product IDs

### Support Contacts
- **Technical Issues:** Check application logs and error messages
- **Database Issues:** Contact your PostgreSQL provider
- **Payment Issues:** Stripe support (stripe.com/support)
- **AI Issues:** OpenAI support (help.openai.com)

## 📋 Post-Deployment Verification

### Functional Tests
- [ ] User registration and login
- [ ] Document upload and analysis
- [ ] Payment processing and subscriptions
- [ ] Legal aid directory search
- [ ] Emergency filing workflows
- [ ] Case management integration

### Performance Tests
- [ ] Page load times < 3 seconds
- [ ] API response times < 500ms
- [ ] Document processing < 30 seconds
- [ ] Concurrent user handling

### Security Tests
- [ ] HTTPS enforcement
- [ ] Session security
- [ ] Data encryption
- [ ] Input validation
- [ ] SQL injection protection

---

**Note:** This application handles sensitive legal data. Ensure all security measures are properly implemented and regularly audited before processing real client information.
