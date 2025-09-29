# LegalEaseFile AI - GitHub Copilot Instructions

## Project Architecture & Context

**LegalEaseFile** is a production-ready legal document management system with AI-powered document analysis, designed for Massachusetts legal professionals. The application integrates real services (no mock data) including Stripe payments, OpenAI document analysis, and Airtable case management.

## Core Technologies & Stack

- **Frontend**: React + TypeScript with Vite, using wouter for routing (not React Router)
- **UI System**: shadcn/ui components built on Radix UI primitives with Tailwind CSS
- **Backend**: Express.js with TypeScript, using ESM modules (`"type": "module"`)
- **Database**: PostgreSQL with Drizzle ORM, session storage for Replit Auth
- **State Management**: TanStack React Query for server state, React hooks for local state
- **Authentication**: Replit Auth with session-based authentication (not JWT)

## Key Development Patterns

### Database & Schema Management
- All schemas defined in `shared/schema.ts` using Drizzle with Zod validation
- Database push: `npm run db:push` (no migrations, uses push-based workflow)
- Shared types exported for both client and server: `type User = typeof users.$inferSelect`

### Authentication Flow
- Authentication handled by `server/replitAuth.ts` with `isAuthenticated` middleware
- Client-side auth state via `useAuth()` hook with React Query caching
- Conditional routing: unauthenticated users see `Landing`, authenticated see main app
- User data fetched from `/api/auth/user` endpoint with automatic session validation

### Component Organization
```
client/src/components/
├── ui/          # shadcn/ui primitive components (don't edit manually)
├── layout/      # Navigation, headers, structural components  
├── legal/       # Legal-specific features (emergency alerts, CMECF status)
├── document/    # Document upload, templates, file processing
└── airtable/    # Case management integration components
```

### API Route Patterns
- All API routes in `server/routes.ts` with consistent error handling
- Authentication middleware: `app.post("/api/endpoint", isAuthenticated, handler)`
- Stripe integration for subscription management with real payment processing
- Document upload uses multer with base64 storage in database

### Service Layer Architecture
```
server/services/
├── airtable-mpc.ts    # Multi-party computation for secure case data
├── document-processor.ts  # PDF/Word text extraction with multer
├── openai.ts          # GPT-4o document analysis with MA court expertise
├── ma-courts.ts       # Massachusetts court system integration
├── mpc-ai.ts         # AI-powered case management features
└── pdf-export.ts     # Document export functionality
```

## Critical Development Guidelines

### Environment & Dependencies
- **Required ENV vars**: DATABASE_URL, SESSION_SECRET, STRIPE_SECRET_KEY, OPENAI_API_KEY, AIRTABLE_API_KEY, ENCRYPTION_KEY
- Start development: `npm run dev` (not `npm start` - that's production)
- Build process: `npm run build` (builds both client and server with esbuild)

### UI Component Usage
- Use existing shadcn/ui components from `@/components/ui/*` - they're fully configured
- Import icons from `lucide-react`, not other icon libraries
- All components use `cn()` utility from `@/lib/utils` for className merging
- Form validation with `react-hook-form` + `@hookform/resolvers` using Zod schemas

### Data Flow Patterns
- Server state: React Query with keys like `["/api/endpoint"]` 
- API calls via `apiRequest()` utility from `@/lib/queryClient`
- File uploads: Use `FormData` with `multer` middleware on server
- Real-time features: WebSocket integration ready via `ws` package

### Legal Domain Specifics
- **Massachusetts Court System**: Federal, Superior, Probate & Family, District courts
- **PACER Integration**: Placeholder implementation (requires official approval)
- **Document Types**: Motions, pleadings, discovery, emergency filings
- **Compliance**: HIPAA-compliant data handling with AES-256 encryption

## Subscription & Payment Flow
- Three tiers: Basic ($29.99), Professional ($79.99), Enterprise ($199.99)
- Stripe checkout via React Stripe.js elements in `/subscribe` page
- User subscription status tracked in database with `subscriptionStatus` field
- Payment forms use Stripe Elements, not custom credit card inputs

## File Structure Context
- **Path aliases**: Use `@/*` for client src, `@shared/*` for shared types
- **Build output**: Client builds to `dist/public`, server to `dist/index.js`
- **Static files**: Place in `attached_assets/`, referenced via `@assets` alias
- **Database**: Production uses Neon PostgreSQL, local development configurable

## External Integrations
- **OpenAI**: GPT-4o model for document analysis with legal expertise prompting
- **Airtable**: Secure MPC integration for case management data
- **Stripe**: Live payment processing (test keys for development)
- **Replit**: Authentication provider and deployment platform

## Testing & Deployment
- No test framework currently configured - add Jest/Vitest if implementing tests  
- Production deployment via Replit with render.yaml configuration
- Environment-specific settings handled via process.env with proper fallbacks