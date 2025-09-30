# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application (AFTER-42/AF42) that manages company-candidate relationships with AI-powered features. The application uses:
- **Database**: Turso (LibSQL) with Drizzle ORM
- **Authentication**: Kinde Auth
- **AI Framework**: Mastra with OpenAI integration
- **UI**: React 19, Radix UI components, Tailwind CSS
- **Deployment**: Vercel

## Environment Setup

Required environment variables (copy from `env.example` to `.env`):
- `TURSO_DATABASE_URL` - Turso database URL
- `TURSO_AUTH_TOKEN` - Turso authentication token
- `KINDE_ISSUER_URL` - Kinde issuer URL
- `KINDE_CLIENT_ID` - Kinde client ID
- `KINDE_CLIENT_SECRET` - Kinde client secret
- `OPENAI_API_KEY` - OpenAI API key

Environment validation is handled automatically by `env.ts` using Zod schemas.

## Common Commands

```bash
# Development
npm run dev          # Start development server with Turbopack

# Production
npm run build        # Build for production
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint

# Database
npx drizzle-kit generate    # Generate migrations
npx drizzle-kit migrate     # Run migrations
npx drizzle-kit studio      # Open Drizzle Studio
```

## Architecture

### Database Layer (`db/`)
- **Schema**: Located in `db/schema/` - one file per table (users, companies, candidates, challenges, engineers, evaluations, etc.)
- **Connection**: `db/index.ts` exports drizzle client instance
- **Migrations**: Generated in `db/migrations/`
- **ORM**: Drizzle ORM with LibSQL/Turso dialect

### Service-Controller Pattern

The application follows a service-controller architecture:

- **Controllers** (`controllers/`): Handle request validation and response formatting
  - `users/`: User-related controllers (getAllUser, getUserByKindeId, updateUserRole, updateUserCompanyId)
  - `companies/`: Company-related controllers (getAllCompanies, getCompanyByID, getCompanyId, getCompanyMembers)

- **Services** (`services/`): Business logic and database operations
  - `users/users.service.ts`: User business logic
  - `companies/companies.services.ts`: Company business logic

### Route Structure

The app uses Next.js App Router with route groups:

- `app/(auth)/`: Authentication routes (onboarding)
- `app/(users)/`: Protected user routes (dashboard, challenge)
- `app/(public)/`: Public-facing routes
- `app/api/`: API endpoints
  - `api/auth/`: Kinde authentication callbacks
  - `api/users/`: User management endpoints
  - `api/companies/`: Company management endpoints
  - `api/kinde-webhook/`: Webhook handler for Kinde events
  - `api/extract-text/`: File text extraction
  - `api/extract-tech-stack/`: Tech stack extraction
  - `api/translate-text/`: Translation service

### AI/Mastra Integration (`mastra/`)

Mastra configuration in `mastra/index.ts`:
- **Agents**: AI agents (e.g., "timmy" agent)
- **Storage**: LibSQL store for telemetry/evals (currently using `:memory:`)
- **Logger**: Pino logger
- **Deployer**: Vercel deployer
- **Tools**: Custom tools in `mastra/tools/`
- **Schemas**: Data schemas in `mastra/schemas/`

### Authentication

Uses Kinde Auth with the following flow:
- User authentication managed by `@kinde-oss/kinde-auth-nextjs`
- User records synchronized to local DB via webhook (`api/kinde-webhook`)
- User sessions tracked with `kinde_id` as foreign key
- Role-based access control via `users.role` field

### User Roles & Organizations

- Users can belong to organizations (stored as text in `users.organizations`)
- Users have roles (stored in `users.role`)
- Companies have owners (`companies.owner_id`) and members (`companies.members` as JSON array)

### File Utilities

`lib/file-utils.ts` provides file processing utilities for document parsing (PDF, DOCX, Excel, etc.) used by the text extraction endpoints.

## Path Aliases

TypeScript paths are configured with `@/*` pointing to the root directory.

## Key Design Patterns

1. **Environment validation**: All env vars validated at startup via `Env.initialize()`
2. **Type safety**: Zod schemas for runtime validation
3. **Separation of concerns**: Controllers handle HTTP, services handle business logic
4. **Schema-first database**: Drizzle schemas define the database structure
5. **Server-side AI processing**: Mastra operations are server-side only, accessed via API routes
