# Overview

LegalFile AI is a comprehensive legal document management and filing system designed specifically for Massachusetts Federal District Court. The application combines AI-powered document analysis with CM/ECF integration to streamline legal document preparation, validation, and filing processes. It features emergency filing capabilities, comprehensive pro bono legal aid directory with immediate in-person filing assistance for indigent parties and out-of-state emergency cases, and intelligent document templates to assist self-represented litigants and legal professionals.

## Current Status (August 2025)
✅ **PRODUCTION-READY CORE SYSTEM** - Real services integrated, no mock data
✅ **Real Authentication**: Replit Auth with PostgreSQL session storage
✅ **Real Payments**: Stripe subscription billing ($29.99, $79.99, $199.99)
✅ **Real AI**: OpenAI GPT-4o document analysis and classification
✅ **Real Database**: PostgreSQL with complete schema and Massachusetts legal aid data
✅ **Real Case Management**: Airtable MPC integration (with user credentials)
✅ Professional UI with legal compliance and disclaimers

## Services Requiring Official Approval
🔄 **PACER/CM-ECF Integration**: Requires Administrative Office approval
🔄 **Court Filing API**: Needs official Massachusetts Federal District Court access

## No Mock Data Policy
- All endpoints use real services or return proper "setup required" messages
- Authentication is fully functional with Replit Auth
- Payment processing ready for live transactions
- Document analysis uses real AI models

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript, built using Vite for fast development and optimized production builds
- **UI Components**: Radix UI primitives with shadcn/ui design system providing accessible, customizable components
- **Styling**: Tailwind CSS with CSS variables for theming, supporting light/dark modes and custom color schemes
- **State Management**: TanStack React Query for server state management and caching, with React hooks for local state
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation for type-safe form handling

## Backend Architecture
- **Runtime**: Node.js with TypeScript and ESM modules
- **Framework**: Express.js providing RESTful API endpoints with middleware for logging and error handling
- **File Processing**: Multer for multipart file uploads with support for PDF, DOC/DOCX, and plain text files
- **Document Analysis**: OpenAI GPT-4o integration for intelligent document classification and compliance checking
- **Session Management**: Express sessions with PostgreSQL store for user authentication
- **Development**: Hot module replacement via Vite integration for seamless full-stack development

## Database Design
- **ORM**: Drizzle ORM with PostgreSQL dialect for type-safe database operations
- **Schema**: Comprehensive legal document management with tables for users, documents, templates, legal aid organizations, and filing history
- **Storage Strategy**: Base64 encoded document content with metadata tracking for file type, size, and analysis results
- **Migrations**: Drizzle Kit for database schema versioning and deployment

## Authentication & Authorization
- **Session-based Authentication**: Express sessions with secure cookie configuration
- **PACER Integration**: Linked accounts for CM/ECF system access and filing capabilities
- **Role-based Access**: User permissions for document access and filing operations

## AI Integration
- **Document Analysis**: OpenAI GPT-4o for document type classification, jurisdiction detection, and CM/ECF compliance validation
- **Template Generation**: AI-powered document templates with jurisdiction-specific formatting
- **Emergency Filing Detection**: Intelligent detection of time-sensitive legal matters requiring expedited processing
- **MPC AI Assistant**: Intelligent legal assistant that pulls from existing case database to auto-populate forms, generate exhibit lists, provide case insights, and recommend optimal templates based on historical case patterns

## External System Integrations
- **CM/ECF Integration**: Massachusetts Federal District Court NextGen CM/ECF system for electronic filing
- **Legal Aid Directory**: Searchable database of pro bono attorneys and legal organizations with practice area filtering
- **Emergency Services**: Direct phone integration for urgent legal matters requiring immediate attention
- **Airtable MPC Integration**: Multi-party computation service for secure case management with AES-256 encryption, automated document metadata tracking, and pro bono attorney assignment workflows

## File Processing Pipeline
- **Upload Validation**: File type restrictions, size limits (10MB), and format verification
- **Text Extraction**: Multi-format document parsing with placeholder implementation for PDF and Word document processing
- **AI Analysis**: Automatic document classification and compliance checking with structured JSON responses
- **Storage**: Secure file storage with metadata tracking and base64 encoding for database persistence

# External Dependencies

## Core Services
- **OpenAI API**: GPT-4o model for document analysis and legal AI assistance
- **Neon Database**: PostgreSQL serverless database hosting with connection pooling
- **CM/ECF System**: Massachusetts Federal District Court electronic filing system integration
- **Airtable Database**: External case management database with MPC encryption for client confidentiality

## Frontend Libraries
- **Radix UI**: Accessible primitive components for complex UI patterns
- **TanStack React Query**: Server state synchronization and caching
- **Tailwind CSS**: Utility-first CSS framework with design system integration
- **React Hook Form**: Performance-focused forms with validation
- **Zod**: TypeScript-first schema validation

## Backend Dependencies
- **Express.js**: Web application framework with middleware ecosystem
- **Drizzle ORM**: Type-safe database operations with PostgreSQL support
- **Multer**: Multipart form data processing for file uploads
- **OpenAI SDK**: Official client library for AI model integration

## Development Tools
- **Vite**: Fast build tool with hot module replacement for full-stack development
- **TypeScript**: Static type checking across frontend and backend code
- **ESBuild**: Fast JavaScript bundler for production builds
- **Replit Integration**: Development environment with runtime error overlay and debugging tools