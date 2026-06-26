# Aman Kumar Jha | Portfolio

A modern, fully responsive AI & Full-Stack portfolio built with Next.js.
The application includes a secure admin dashboard, real-time database integration, and production-ready authentication. Deployed on Vercel.

---

## Overview

This portfolio showcases:

* AI and Full-Stack projects (Machine Learning, Deep Learning, Web Apps)
* Professional experience (date-sorted)
* Certifications
* Technical articles
* A secure admin dashboard for real-time content management

The system is designed with scalability, security, and clean architecture in mind.

---

## Tech Stack

**Frontend**

* Next.js (App Router with Turbopack)
* React
* TypeScript
* Vanilla CSS (Neobrutalist theme)

**Backend**

* Next.js Serverless API Routes
* Node.js

**Database & Storage**

* Neon (Serverless Postgres)
* Vercel Blob Storage (CDN for images, demo videos, and QR codes)

**Authentication & Security**

* NextAuth.js (`CredentialsProvider` database check)
* PBKDF2 (SHA-512) password hashing with random salting
* Next.js Edge Middleware JWT token validation

**Deployment**

* Vercel (CI/CD via GitHub integration)

---

## Key Features

* **Neobrutalist Design System**: A sleek, high-contrast flat design layout with thick borders, offset shadows, card tilts, and smooth dark/light mode switches.
* **Unified Console Panel**: Administrative dashboard to manage **Projects**, **Experience**, **Certificates**, and **Expertise/Tech Stack** without modifying code.
* **Dynamic Expertise Grid**: Categorized tech stack showcasing tools (like React, n8n, etc.) using SVG icons, fully manageable from the admin panel.
* **Secure File Pipeline**: Direct upload of images and videos (up to 50MB) to Vercel Blob CDN.
* **Date-based Sorting**: Automated sorting for timelines (Experience, Certifications) and projects.
* **Contact & Message Hub**: Validated contact form that saves inquiries to the database.

---

## Database Design

The database schema is managed via Neon Postgres:

* `projects`: Single table listing consolidated AI/ML and web applications.
* `experiences`: Professional timeline tracks.
* `certificates`: Educational certifications.
* `site_cards`: Flexible configuration cards (e.g. contact links, QR codes, and tech stack categories).
* `contact_messages`: Inquiry emails and messages.

---

## Security & Architectural Safeguards

* **Next.js Edge Middleware**: Unauthenticated route guard blocks access to `/console` and yields `404` for `/api/admin` requests.
* **No Client Secrets**: DB pool queries and blob upload write-tokens are restricted exclusively to server-side executions.
* **PBKDF2 Cryptography**: Hashed admin passwords stored as `salt:hash` using 1000 iterations of SHA-512.
* **Revalidation Endpoints**: Authorized site cache revalidation endpoint to refresh ISR pages immediately after console edits.

---

## Deployment

Hosted on Vercel with automatic deployment from GitHub.
Environment variables configured securely in production.

---

## Author

Aman Kumar Jha
AI & Full-Stack Engineer

Portfolio: [My Portfolio App](https://aman-kumar-jha.vercel.app)

LinkedIn: [My LinkedIn](https://linkedin.com/in/your-linkedin-username)

GitHub: [My GitHub](https://github.com/your-github-username)

X: [My X](https://x.com/your-x-username)