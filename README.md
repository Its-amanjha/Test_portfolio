# ⚡ Aman Kumar Jha | AI & Full-Stack Engineer Portfolio

A premium, high-fidelity portfolio website engineered with a **Neobrutalist Design System**, dynamic **Blogs Engine**, and a secure **Unified Admin Console**.

Built on **Next.js 16 (App Router)** and backed by **Neon Serverless Postgres** and **Vercel Blob Storage**, this portfolio is optimized for speed, interactivity, and SEO.

* 🌐 **Live Website**: [amanbuilds.me](https://amanbuilds.me)
* 🛠️ **GitHub Repository**: [github.com/Its-amanjha/my-portfolio](https://github.com/Its-amanjha)

---

## 🎨 Design Philosophy: Neobrutalism
The user interface breaks away from generic modern layouts by fully adopting a bold **Neobrutalist Theme**:
* **High Contrast Elements**: Solid thick borders (`border-2 border-black`), offset shadows (`shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`), and high-saturation background highlights (`bg-neo-yellow`, `bg-neo-pink`, `bg-neo-blue`).
* **Visual Playfulness**: Card tilts, rotating action buttons, and active menu animations.
* **Responsive Layouts**: Designed mobile-first, ensuring all neobrutalist cards, typewriters, and grids auto-scale perfectly.

---

## 🛠️ Technology Stack

| Layer | Technologies | Key Features |
| :--- | :--- | :--- |
| **Frontend** | React 19, TypeScript, Vanilla CSS | Custom animations, responsive components, viewport scroll metrics. |
| **Framework** | Next.js 16 (App Router with Turbopack) | ISR page caching, Edge middleware routing, Turbopack compiling. |
| **Database** | Neon Serverless Postgres | SQL pool connections, dynamic content persistence. |
| **File Storage** | Vercel Blob | Public CDN storage for media uploads (up to 50MB). |
| **Authentication** | NextAuth.js (Credentials Provider) | Hashed password verification, Edge JWT session validation. |
| **SEO & Sitemap** | Next Sitemap, JSON-LD Schema | Search Engine Optimization, Google schema data indexing. |

---

## 🚀 Key Features

### 1. Unified Console Panel (`/console`)
A secure administrative dashboard that enables live updates to portfolio data:
* **Dashboard Cockpits**: Edit the **Hero Section** (badge, slogans, typewriter arrays), **Projects** (links, tags, media), **Experience** timeline, and **Expertise** domains.
* **Blogs Form Cockpit**: Add, update, or delete blog articles with a large, spacious Markdown Content Textarea (`rows={12}`).
* **Message Inbox**: Read client inquiries and messages sent via the contact form.

### 2. Local Blogs Engine (`/blogs/[id]`)
An integrated blogs page with a native, zero-dependency Markdown-to-HTML parser:
* Converts Markdown tags (headers, blockquotes, lists, bold/italic, code blocks) to semantic HTML on the server.
* Styled with neobrutalist classes (code highlighting with thick borders, highlighted H1/H2 header titles, blockquotes with thick left-border marks).
* API routes are optimized: list fetches exclude heavy markdown columns to save bandwidth, while dynamic pages load single posts instantly by `id`.

### 3. Settings Gear (⚙️) Live Customizer
Logged-in administrators can edit contact numbers, social links, CV downloads, and upload WhatsApp QR codes directly on the live homepage.

### 4. Dynamic Interactive Animations
High-fidelity visual animations designed at the top of each expertise card (terminal coder outputs, active routing node flows, and SVG coordinate precision animations).

---

## 🗄️ Database Schema Design

Managed via Neon Postgres through the SQL client configuration (`lib/db.ts`):
* `admins`: Password credential verification (`salt:hash` using SHA-512 PBKDF2).
* `projects`: Listing unified AI/ML, Full-Stack, and Data Analytics applications.
* `experiences`: Work history timelines.
* `blogs`: Local blog posts and external redirect articles.
* `site_cards`: Flexible configuration schemas for hero cards, dynamic footer data, and QR uploads.
* `contact_messages`: Client contact inquiries.

---

## ⚙️ Setup and Installation

### 1. Clone the Repository
```bash
git clone https://github.com/Its-amanjha/my-portfolio.git
cd my-portfolio
```

### 2. Configure Environment Variables (`.env.local`)
Create a `.env.local` file in the root directory:
```env
DATABASE_URL="your-neon-postgres-connection-string"
BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"
NEXTAUTH_SECRET="your-jwt-auth-signing-secret"
NEXTAUTH_URL="http://localhost:3000"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="secure-admin-password"
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Initialize Database Tables and Admin Seed
```bash
node scripts/create-tables.mjs
```

### 5. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## ✍️ Author
**Aman Kumar Jha**
* **Portfolio**: [amanbuilds.me](https://amanbuilds.me)
* **GitHub**: [github.com/Its-amanjha](https://github.com/Its-amanjha)
* **LinkedIn**: [linkedin.com/in/its-amanjha](https://linkedin.com/in/its-amanjha)
* **Email**: [amanjhaa.work@gmail.com](mailto:amanjhaa.work@gmail.com)