# Project Memory Bank

This document serves as the single source of truth for the portfolio architecture, database designs, migration details, and code mappings. It enables future executions to understand the system state instantly without scanning the whole repository, saving context window tokens.

---

## 1. Environment Configuration (`.env.local`)

Ensure `.env.local` contains the following parameters:

| Variable | Required In | Description |
| :--- | :--- | :--- |
| `DATABASE_URL` | Dev & Prod | Neon Serverless Postgres connection string (with SSL mode enabled). |
| `BLOB_READ_WRITE_TOKEN` | Dev & Prod | Vercel Blob token (used to read and write media files). |
| `NEXTAUTH_SECRET` | Dev & Prod | Secret key for signing session JWT tokens. |
| `NEXTAUTH_URL` | Dev & Prod | Root URL of the site (`http://localhost:3000` in dev). |
| `ADMIN_EMAIL` | Script/Seed | The administrator's sign-in email (seeded to Neon DB). |
| `ADMIN_PASSWORD` | Script/Seed | The administrator's sign-in password (salted & hashed prior to seeding). |
| `SITE_URL` | Prod | Production URL of your live deployment. |
| `REVALIDATION_SECRET` | Prod | Token to authorize remote cache revalidation requests. |

---

## 2. Neon Database Schema (DDL)

The database schema consists of six core tables created and managed via `scripts/create-tables.mjs`:

```sql
-- 1. Authentication credentials
CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL, -- format: "salt:hash"
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Projects (Consolidated - AI/ML, Full-Stack, Analytics, etc.)
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  github_url TEXT,
  huggingface_url TEXT,
  tags TEXT[] DEFAULT '{}',
  image TEXT, -- Vercel Blob public CDN URL
  demo_video TEXT, -- Vercel Blob public CDN URL
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Professional Experiences
CREATE TABLE IF NOT EXISTS experiences (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  organization TEXT NOT NULL,
  location TEXT DEFAULT '',
  start_date TEXT NOT NULL,
  end_date TEXT DEFAULT 'Present',
  description TEXT DEFAULT '',
  highlights TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Certifications
CREATE TABLE IF NOT EXISTS certificates (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  issue_date TEXT NOT NULL,
  credential_url TEXT,
  description TEXT DEFAULT '',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. General Site Content Cards
CREATE TABLE IF NOT EXISTS site_cards (
  id SERIAL PRIMARY KEY,
  section TEXT NOT NULL,
  card_data JSONB NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Contact Enquiries
CREATE TABLE IF NOT EXISTS contact_messages (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 3. Codebase File Directory & Core Implementation Logic

```
d:\aman portfolio/
├── app/
│   ├── api/
│   │   ├── admin/
│   │   │   ├── certificates/route.ts            # Protected CRUD for certificates
│   │   │   ├── experience/route.ts              # Protected CRUD for experiences
│   │   │   ├── projects/route.ts                # Protected CRUD for consolidated projects
│   │   │   ├── site-cards/route.ts              # Protected CRUD for landing cards
│   │   │   ├── upload-image/route.ts            # Image uploader (Vercel Blob)
│   │   │   ├── upload-qr/route.ts               # QR uploader (Vercel Blob)
│   │   │   └── upload-video/route.ts            # Video uploader (Vercel Blob)
│   │   ├── auth/
│   │   │   └── [...nextauth]/route.ts           # NextAuth route handler
│   │   ├── certificates/route.ts                # Public list endpoint
│   │   ├── contact/route.ts                     # Contact Form POST (captches/stores/emails)
│   │   ├── experience/route.ts                  # Public list endpoint
│   │   ├── media/[table]/[id]/route.ts          # Legacy Base64 to Vercel Blob redi│   │   ├── certificates/page.tsx                # Certificate CRUD Dashboard Interface
│   │   ├── experience/page.tsx                  # Experience CRUD Dashboard Interface
│   │   ├── expertise/page.tsx                   # Tech Stack Categories CRUD Dashboard Interface
│   │   ├── projects/page.tsx                    # Consolidated Projects CRUD Dashboard Interface
│   │   ├── layout.tsx                           # Neobrutalist wrapper for dashboard sub-pages
│   │   ├── LoginForm.tsx                        # Client component calling NextAuth signIn
│   │   └── page.tsx                             # Dashboard overview page or login gateway
│   ├── projects/[id]/
│   │   └── page.tsx                             # Dynamic details page for unified projects
│   ├── view-cv/
│   │   └── page.tsx                             # Displays CV PDF in a Neobrutalist container
│   ├── layout.tsx                               # Global metadata, theme loaders, and JSON-LD schema
│   ├── page.tsx                                 # Public portfolio landing (loads Neon data)
│   └── globals.css                              # Core styles, variables, Neobrutalist layout cards
├── components/                                  # Resilient layout cards, cursors, headers, and inputs
│   ├── ContactCard.tsx                          # Contact info card loading from profile.ts
│   ├── Footer.tsx                               # Dynamic footer reading profile.ts info
│   ├── Header.tsx                               # Header navigation and custom dark-mode toggle
│   └── ...                                      # Custom typewriter elements and parallax scripts
├── lib/
│   ├── auth.ts                                  # NextAuth config with db CredentialsProvider
│   ├── crypto.ts                                # PBKDF2 SHA-512 salting & verify modules
│   ├── db.ts                                    # Neon PG Pool client wrapper (supports query template tags)
│   ├── profile.ts                               # Consolidated personal bio, names, contacts, URLs
│   └── revalidate.ts                            # Cache invalidators and page cache pre-warmers
├── scripts/
│   ├── create-tables.mjs                        # Neon table initializer and credentials seeder
│   └── migrate-base64-to-storage.mjs            # One-time Base64 to Vercel Blob migration script
├── middleware.ts                                # Edge protection for console dashboards & admin API
├── package.json                                 # Project dependencies and deployment tasks
└── next.config.js                               # Next.js configurations (image domains, caching headers)
```

---

## 4. Key Architectural Details

### A. Centralized User Settings (`lib/profile.ts`)
All personal strings (e.g., name, typewriter slogans, bio description, contact details, social links, and CV filename) are grouped in `lib/profile.ts`. This allows editing the portfolio details instantly without modification of React components.

### B. Smart Neon DB Query Client (`lib/db.ts`)
The `sql` function handles two query interfaces natively:
1. **Tagged Template Literals**:
   ```typescript
   await sql`SELECT * FROM projects WHERE id = ${id}`
   ```
2. **Parameterized Calls**:
   ```typescript
   await sql("SELECT * FROM projects WHERE id = $1", [id])
   ```
This client uses Neon's `@neondatabase/serverless` connection `Pool` to support clean connection reuse and avoid connection exhaustion in serverless environments.

### C. Authentication Flow & Cryptography
*   **Cryptography (`lib/crypto.ts`)**: Password hashing uses PBKDF2 (SHA-512) with a random 16-byte salt and 1000 iterations. Stored format is `salt:hash`.
*   **NextAuth (`lib/auth.ts`)**: Implements `CredentialsProvider` checking against the `admins` table. Configured to use secure JSON Web Tokens (JWT) for sessions.
*   **Edge Protection (`middleware.ts`)**: Runs on Next.js Edge runtime. Checks the session token cookie (`next-auth.session-token` or secure equivalent). Intercepts and redirects unauthenticated visits targeting `/console/...` back to `/console` (which shows the login form), and yields 404 for unauthenticated `/api/admin/...` API attempts.

### D. File Storage Pipeline (Vercel Blob)
*   **Images**: Up to 5MB, uploaded directly from the console to Vercel Blob via `/api/admin/upload-image`.
*   **Videos**: Up to 50MB, uploaded via `/api/admin/upload-video` with file type validation (MP4, WebM, OGG, MOV).
*   **Fallback Migration API**: The route `/api/media/[table]/[id]` automatically detects if an item's image is saved as raw base64. If base64 is detected, it uploads it to Vercel Blob, rewrites the database cell with the CDN URL, and redirects the client. If it is already a CDN URL, it redirects instantly.

---

## 5. Detailed Change Log

| Category / File | Modification | Purpose |
| :--- | :--- | :--- |
| **package.json** | Installed `@neondatabase/serverless` and `@vercel/blob`. Removed `@supabase/supabase-js` and `next-auth` Google provider. | Backend stack migration. |
| **lib/db.ts** | **[NEW]** Connection pool client for Neon Postgres supporting both templated and parameterized queries. | Replaces Supabase JS client. |
| **lib/crypto.ts** | **[NEW]** SHA-512 PBKDF2 salting and password verification. | Secures admin panel credentials. |
| **lib/auth.ts** | Refactored NextAuth configuration. Replaced Google OAuth with a custom `CredentialsProvider` verifying against Neon database. | Keeps auth internal & credential-based. |
| **app/console/** | **[NEW]** Replaced `app/admin/` files. Built new `LoginForm.tsx` and updated dashboards to communicate with `/api/admin/...` and Vercel Blob. | Modern, protected console panels. |
| **middleware.ts** | Refactored matching rules for `/console/:path*` and `/api/admin/:path*` using JWT tokens. | Secures dashboard and data mutation endpoints. |
| **lib/profile.ts** | **[NEW]** Integrated centralized portfolio bio, typewriter slogans, links, and filenames. Modified email to a static, client-safe string (`"amanjhaa.work@gmail.com"`) to resolve hydration mismatch errors. Removed `medium` social links. | Avoids hardcoded strings, prevents client-server mismatches, and conforms to regional settings. |
| **app/layout.tsx** | Configured Dynamic Metadata and structured JSON-LD Person/WebSite/Organization schema queries to read variables from `lib/profile.ts`. Removed the legacy `SUPABASE_URL` preconnect tag. Removed `socialLinks.medium` from schemas. | SEO centralization, resolved console empty-href link warnings, and prevents build errors. |
| **app/page.tsx** | Refactored to fetch all projects from the single `projects` table in parallel. Consolidated homepage sections to list all projects in a single Projects section, and fully removed the Articles section. Revamped the **Expertise** section: moved animations to the top of each card (Animation -> Title -> Description), removed "E.g." examples panels from the homepage grid, and stripped all card numbering across the entire homepage. | Connects frontend to Neon DB under the simplified layout structure and supports clean, modern service visualizer cards. |
| **app/projects/\[id\]/page.tsx** | Cleaned up references to other category detail carousels. It now only fetches `/api/projects` and displays the single dynamic projects carousel. Deleted `/fullstack-projects/[id]` and `/data-analytics-projects/[id]` folders. | Simplifies dynamic detail pages. |
| **components/ContactCard.tsx** | Wrapped default links initialization in safety checks to prevent crashes when optional social handles are empty in `profile.ts`. Removed Medium from options. | Resiliency and layout safety. |
| **components/ScrollProgress.tsx** | Updated section identifiers to remove full-stack, data analytics, and articles. Replaced stale `/admin` paths with `/console` mappings. | Fixes navigation indicator bugs. |
| **components/Header.tsx** | Re-ordered navigation links (desktop and mobile) to prepend **Home** and **Expertise** before others. Added the console link to the admin header view. | Simplifies user routing. |
| **components/Footer.tsx** | Added Home and Expertise quick links. Removed articles link from quick navigation and removed the Medium link from social channels. | Clean up footer references. |
| **app/api/admin/site-cards/route.ts** | Allowed `'expertise'` section type in payload whitelist validator. | Saves tech stack configurations. |
| **app/console/expertise/page.tsx** | **[NEW]** Interactive admin CRUD dashboard letting the user define, delete, reorder, and save tech categories, descriptions, example texts, and color themes. | Admin control of the landing page stack. |
| **components/ExpertiseCardAnimation.tsx** | **[NEW]** Micro-animations component displaying specialized visual animations (agent terminal coding, router workflow flows, wave triggers, funnel syncs, programmatic SEO pages, OCR doc scans) at the top of each expertise card. | Engaging, high-fidelity visual context for each service domain. |
| **components/AnimatedTechCards.tsx** | **[NEW]** Bespoke Neobrutalist interactive animations situated below the WhatsApp QR code section illustrating: Agentic Coding workspace (file list + parser logs), AI Workflows routing (glowing pulse nodes), and Full-Stack AI apps (live audio sine wave + speak syncs). | Rich animations explaining technical folio pillars. |
| **scripts/create-tables.mjs** | **[NEW]** Automated DDL initializer. Hashes admin credentials in `.env.local` and seeds the `admins` table. Refactored to drop obsolete tables and build only the consolidated schema. | Sets up database structures. |
| **scripts/migrate-base64-to-storage.mjs**| **[NEW]** One-time runner that sweeps base64 DB cells, uploads them to Vercel Blob, and updates tables. Refactored to only scan the single projects table. | Migrates legacy base64 data to CDN storage. |

---

## 6. Current Status & Next Steps

1.  **Database Migration**: Done. Tables are initialized, the admin credentials seeded, and custom `site_cards` support is in place.
2.  **Expertise Stack**: Done. Fully manageable via `/console/expertise` and dynamic on the homepage.
3.  **Custom Animations**: Done. Integrated customized Neobrutalist animations at both the top of expertise cards and within the bottom QR code segment.
4.  **Compilation**: Validated. `npm run build` runs and compiles cleanly with zero compilation or TypeScript errors.
5.  **Local Testing**:
    *   Start local server: `npm run dev` (or `cmd /c npm run dev` on Windows).
    *   Populate `BLOB_READ_WRITE_TOKEN` in `.env.local` to enable image/video uploading.
    *   Navigate to `http://localhost:3000/console` to authenticate using the email and password defined in `.env.local`.
    *   Edit your skills and categories under `/console/expertise`.


