# Deployment Guide for LegalEaseFile

## Render Deployment Setup

### Prerequisites
1. PostgreSQL database (can be provisioned through Render)
2. Environment variables configured in Render dashboard

### Required Environment Variables
Copy the values from `.env.example` and set them in your Render service:

```bash
DATABASE_URL=postgresql://username:password@hostname:port/database
REPLIT_DOMAINS=your-render-domain.onrender.com
ISSUER_URL=https://replit.com/oidc
REPL_ID=your-repl-id
SESSION_SECRET=your-secure-session-secret
STRIPE_SECRET_KEY=sk_live_or_test_your_stripe_key
OPENAI_API_KEY=your-openai-api-key
AIRTABLE_API_KEY=your-airtable-api-key
AIRTABLE_BASE_ID=your-airtable-base-id
NODE_ENV=production
PORT=5000
```

### Build Commands
- **Build Command**: `npm run build`
- **Start Command**: `npm start`

### Database Setup
1. Provision a PostgreSQL database on Render
2. Set the DATABASE_URL environment variable
3. Run database migrations if needed: `npm run db:push`

### Deployment Steps
1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set build/start commands as above
4. Configure environment variables
5. Deploy

The application will be available at your Render service URL.

### Health Check
The server listens on `0.0.0.0:${PORT}` and serves both the API and static files.