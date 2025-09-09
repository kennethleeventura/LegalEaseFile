# Client Secret Configuration Guide

## 🔐 Authentication Setup for LegalFile AI

Your application uses **Replit Auth** which handles client credentials automatically when deployed on Replit. However, you need to configure several environment variables.

## 📋 Required Environment Variables for Authentication

### 1. Replit Auth Configuration

```bash
# These are automatically set by Replit when deployed:
REPL_ID=your-repl-id                    # Auto-set by Replit
REPLIT_DOMAINS=your-app.replit.app      # Your Replit domain
ISSUER_URL=https://replit.com/oidc      # Default OIDC issuer

# You must set this manually:
SESSION_SECRET=your-secure-session-secret-key-here
```

### 2. How to Set Environment Variables in Replit

**Method 1: Using Replit Secrets (Recommended)**
1. Go to your Repl
2. Click on "Secrets" tab in the left sidebar
3. Add these secrets:

```
SESSION_SECRET = generate-a-secure-random-key-at-least-32-characters-long
DATABASE_URL = your-postgresql-connection-string
STRIPE_SECRET_KEY = sk_test_or_sk_live_your_stripe_key
VITE_STRIPE_PUBLIC_KEY = pk_test_or_pk_live_your_stripe_public_key
OPENAI_API_KEY = sk-your-openai-api-key
AIRTABLE_API_KEY = keyYourAirtableApiKey
AIRTABLE_BASE_ID = appYourAirtableBaseId
```

**Method 2: Using .env file (Development only)**
Create a `.env` file in your project root:

```bash
# .env file (DO NOT commit to git)
SESSION_SECRET=your-secure-session-secret-key-here
DATABASE_URL=postgresql://username:password@host:port/database
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
OPENAI_API_KEY=sk-your-openai-api-key
AIRTABLE_API_KEY=keyYourAirtableApiKey
AIRTABLE_BASE_ID=appYourAirtableBaseId
```
    - key: DATABASE_URL
        fromDatabase: legal-ease-db
      - key: OPENAI_API_KEY
        value: "
"
      - key: STRIPE_SECRET_KEY
        value: "REDACTED_FOR_SECURITY"
      - key: STRIPE_WEBHOOK_SECRET
        value: "whsec_YHQzlsJcnCX5oOKSIv4KRwVaVlWngk4Q"
      - key: SESSION_SECRET
        value: "AC502CAD4EA12947F6327CB41AD6DDFED5829046DB2F808CC8010E59FFF08778"
      - key: AIRTABLE_API_KEY
        value: "patbjis6NWPwNi9zQ.4f35b89eacbb8729893c3e2d6ed42e0bd3af4cd577c31ebf6933354056b29316"
      - key: REPLIT_CLIENT_ID
        value: "@kennethleeventu"
      - key: REPLIT_CLIENT_SECRET
        value: "<YOUR_REPLIT_CLIENT_SECRET>"
## 🔑 Generating a Secure Session Secret

You need a strong SESSION_SECRET for secure session management. Here are several ways to generate one:

**Option 1: Using Node.js**
```javascript
// Run this in Node.js console or create a temp file
const crypto = require('crypto');
console.log(crypto.randomBytes(64).toString('hex'));
```

**Option 2: Using OpenSSL (if available)**
```bash
openssl rand -hex 64
```

**Option 3: Using Online Generator**
- Go to https://generate-secret.vercel.app/64
- Copy the generated key

**Option 4: Manual Generation**
Use a password manager to generate a 64+ character random string.

## 🚀 Service-Specific Client Secrets

### Stripe Configuration
1. Go to https://dashboard.stripe.com/
2. Navigate to "Developers" → "API keys"
3. Copy your keys:
   - **Secret key** (starts with `sk_test_` or `sk_live_`)
   - **Publishable key** (starts with `pk_test_` or `pk_live_`)

### OpenAI Configuration
1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Copy the key (starts with `sk-`)

### Airtable Configuration
1. Go to https://airtable.com/create/tokens
2. Create a personal access token
3. Copy the API key (starts with `key`)
4. Get your Base ID from your Airtable base URL (starts with `app`)

## 🔧 Testing Your Configuration

After setting up the environment variables, run this command to verify:

```bash
node deployment-check.js
```

This will check if all required environment variables are properly configured.

## 🛠️ Troubleshooting Authentication Issues

### Issue: "Environment variable REPLIT_DOMAINS not provided"
**Solution:** Set REPLIT_DOMAINS to your Replit app domain:
```bash
REPLIT_DOMAINS=your-app-name.your-username.repl.co
```

### Issue: "Missing required Stripe secret"
**Solution:** Ensure STRIPE_SECRET_KEY is set and starts with `sk_`

### Issue: "Airtable credentials not configured"
**Solution:** Set both AIRTABLE_API_KEY and AIRTABLE_BASE_ID

### Issue: Session/Authentication not working
**Solution:** Ensure SESSION_SECRET is set and is at least 32 characters long

## 📝 Complete Environment Variables Checklist

```bash
# Authentication & Sessions
✅ SESSION_SECRET=your-64-character-random-key
✅ REPLIT_DOMAINS=your-app.replit.app

# Database
✅ DATABASE_URL=postgresql://user:pass@host:port/db

# Payment Processing
✅ STRIPE_SECRET_KEY=sk_test_or_live_...
✅ VITE_STRIPE_PUBLIC_KEY=pk_test_or_live_...

# AI Services
✅ OPENAI_API_KEY=sk-...

# Case Management
✅ AIRTABLE_API_KEY=key...
✅ AIRTABLE_BASE_ID=app...

# Optional (auto-set by Replit)
REPL_ID=auto-set-by-replit
ISSUER_URL=https://replit.com/oidc
NODE_ENV=production
PORT=5000
```

## 🔒 Security Best Practices

1. **Never commit secrets to git**
2. **Use Replit Secrets for production**
3. **Rotate keys regularly**
4. **Use test keys for development**
5. **Monitor API usage and set limits**

## 🚀 Next Steps

1. Set all required environment variables
2. Run `node deployment-check.js` to verify configuration
3. Test authentication by running `npm run dev`
4. Deploy to production with `npm run build` and `npm run start`

---

**Note:** Replit Auth doesn't require a traditional "client secret" because it uses your REPL_ID and the Replit platform handles the OAuth flow automatically. The SESSION_SECRET is what you need for secure session ```bash
node deployment-check.js
```management.
```bash
node deployment-check.js
```