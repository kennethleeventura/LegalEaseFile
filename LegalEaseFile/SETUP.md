# LegalFile AI Setup Guide

This guide explains how to connect real services to your LegalFile AI application.

## ✅ Already Configured

### User Authentication
- **Replit Auth**: Fully configured and working
- Users can sign in/out using their Replit accounts
- Session management with PostgreSQL storage

### Database
- **PostgreSQL**: Fully operational with all tables
- User data, documents, legal aid organizations, filing history
- Real Massachusetts legal aid organizations seeded

### Payment Processing  
- **Stripe**: Configured with your API keys
- Three subscription tiers: Basic ($29.99), Professional ($79.99), Enterprise ($199.99)
- Real payment processing ready

### AI Document Analysis
- **OpenAI GPT-4o**: Configured with your API key
- Real document analysis and classification
- Emergency filing detection

## 🔧 Services Requiring Setup

### 1. PACER/CM-ECF Integration
**Status**: Not implemented (requires official approval)

**What you need:**
- PACER account with API access
- Administrative Office approval for CM/ECF integration
- CM/ECF API credentials

**Setup steps:**
1. Contact PACER customer service: (800) 676-6856
2. Request CM/ECF API access for your application
3. Provide business documentation and use case
4. Once approved, update environment variables:
   ```
   PACER_API_KEY=your_pacer_api_key
   PACER_API_URL=https://ecf.mad.uscourts.gov/cgi-bin/
   ```

**Documentation**: https://pacer.uscourts.gov/help/pacer-case-management-electronic-case-files-cm-ecf

### 2. Airtable MPC Integration
**Status**: Configured but requires your credentials

**What you need:**
- Airtable account with API access
- Base ID and API key for case management

**Current status**: Uses your provided AIRTABLE_API_KEY and AIRTABLE_BASE_ID

**To verify setup:**
```bash
curl -X POST http://localhost:5000/api/airtable/cases \
  -H "Content-Type: application/json" \
  -d '{"caseNumber":"TEST-001","clientName":"Test Client","documentType":"Motion"}'
```

### 3. Document Processing Services
**Status**: Basic implementation ready for enhancement

**Current**: PDF/DOC text extraction with placeholders
**Recommended upgrades:**
- Adobe PDF Services API for better PDF handling
- Microsoft Graph API for Word document processing
- Google Cloud Document AI for advanced extraction

## 🚫 Removed Mock Data

The following mock endpoints have been removed or updated:

- ❌ Mock CM/ECF status - now requires real PACER account
- ❌ Mock PACER linking - now requires real credentials  
- ❌ Mock filing history - now uses real user data
- ✅ Real legal aid organizations (Massachusetts)
- ✅ Real subscription plans with Stripe integration
- ✅ Real authentication with Replit Auth

## 🔐 Security Considerations

### Data Protection
- AES-256 encryption for sensitive case data
- Session-based authentication with secure cookies
- HTTPS required for production deployment

### Compliance
- Privacy policy and terms of service included
- "Not lawyers" disclaimers throughout application
- GDPR-compliant data handling

## 🚀 Production Deployment

### Required Environment Variables
```bash
# Database
DATABASE_URL=postgresql://...

# Authentication  
SESSION_SECRET=your_session_secret

# Payment Processing
STRIPE_SECRET_KEY=sk_live_...
VITE_STRIPE_PUBLIC_KEY=pk_live_...

# AI Services
OPENAI_API_KEY=sk-...

# Airtable (Case Management)
AIRTABLE_API_KEY=key...
AIRTABLE_BASE_ID=app...

# PACER Integration (when approved)
PACER_API_KEY=your_pacer_key
PACER_API_URL=https://ecf.mad.uscourts.gov/cgi-bin/
```

### Production Checklist
- [ ] Switch Stripe to live mode
- [ ] Update OpenAI usage limits
- [ ] Configure production database
- [ ] Set up monitoring and logging
- [ ] SSL certificate configuration
- [ ] PACER integration testing
- [ ] Legal compliance review

## 📞 Support Contacts

### Technical Support
- PACER: (800) 676-6856
- Stripe: stripe.com/support
- OpenAI: help.openai.com

### Legal Compliance
- Massachusetts Bar Association
- Federal Court Electronic Filing Help Desk

## 🔄 Development vs Production

### Development (Current)
- Uses Stripe test keys
- Real Replit authentication
- Real OpenAI API calls
- Local PostgreSQL database
- Airtable integration (your credentials)

### Production (Next Steps)
- Live Stripe processing
- Production database hosting
- PACER/CM-ECF official integration
- Enhanced monitoring and logging
- Professional legal review