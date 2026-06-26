# Product Requirements Document (PRD)

## 1. Project Goal
The goal of this project is to take the cloned Neobrutalist portfolio codebase and customize it for the user (**Aman**) while keeping all layout animations, visual design tokens, and components fully intact. The backend will be migrated from Supabase to **Neon (Serverless Postgres)** and **Vercel Blob** for file storage, and personal info will be moved to a single configuration file for easy updates.

---

## 2. Technology Stack & Architecture

*   **Framework**: Next.js 16 (App Router) & React 19.
*   **Styling**: Tailwind CSS v4 + Neobrutalist design token CSS variables in `app/globals.css`.
*   **Database**: Neon Serverless Postgres.
*   **File Storage**: Vercel Blob (used for PDFs, project screenshots, and demo videos).
*   **Authentication**: NextAuth.js configured with a custom `CredentialsProvider`. User logging credentials (email and password hash) are stored securely in a database table named `admins`.
*   **Administrative Path**: Accessed via `/console` instead of `/admin`.
*   **Routing & Security**: Next.js Edge Middleware (`middleware.ts`) which validates session JWT cookies. If a user is not logged in, it redirects them to the `/console` login screen. Administrative API endpoints under `/api/admin/` require valid sessions.
*   **Caching & Performance**: Incremental Static Regeneration (ISR) with a revalidation period of 3600 seconds. A remote invalidation API endpoint `/api/revalidate` is called when updates are made, flushing the edge cache and pre-warming the homepage cache.

---

## 3. Detailed Feature Specifications

### A. The Public Portfolio Interface
*   **Interactive Custom Cursor & Background**: Floating shapes that drift with mouse movement; custom Neobrutalist pointer that grows on hoverable elements and turns into an I-beam over text fields.
*   **Sections**:
    *   **Hero Section**: Dynamic typewriter text displaying titles and bio.
    *   **AI Projects / Full-Stack Projects / Data Analytics Projects**: Filterable grids loaded from Neon.
    *   **Work Experience**: Interactive timeline listing organizations, periods, descriptions, highlights, and technology tags.
    *   **Certifications**: Listing of credentials with issuer and verification link.
    *   **Articles**: List of blogs/writings with tags and cover images.
    *   **Embedded CV Viewer**: A Neobrutalist iframe frame rendering the CV PDF.
*   **SEO & Analytics**: Structured JSON-LD metadata for Search Engines (Person, Organization, WebSite schemas) and web-vitals reporting to Google Analytics.

### B. The Administrative Portal (Access via `/console`)
*   **Authentication Form**: Secure login interface prompting for email and password.
*   **Dashboard**: Shows counts of all items.
*   **CRUD Forms**: Custom forms to create, read, update, and delete entries for all data tables.
*   **Media Upload**: Upload fields that store images and videos directly to Vercel Blob and retrieve public CDN URLs.

---

## 4. Migration Requirements

1.  **Neon Postgres Integration**:
    *   Initialize database tables for `admins`, `projects`, `fullstack_projects`, `data_analytics_projects`, `experiences`, `certificates`, `articles`, and `site_cards`.
    *   Use `@neondatabase/serverless` client to perform raw SQL queries.
2.  **Credentials Authentication**:
    *   Build secure PBKDF2 (SHA-512) password hashing module.
    *   Implement NextAuth login routing, redirecting unauthenticated requests targeting console subpages to `/console`.
3.  **Vercel Blob Integration**:
    *   Replace Supabase Storage with Vercel Blob API.
    *   Configure file uploads to use `@vercel/blob`'s client.
4.  **Personal Profile Separation**:
    *   Extract name, typewriter text, bio, social links, and CV filename into `lib/profile.ts`.
    *   Refactor all templates to read from this centralized config file.
