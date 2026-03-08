# 🔗 LinkBio SaaS – Production-Ready Link-in-Bio Platform

A full-stack Link-in-Bio SaaS built for the Indian market with Next.js 14, TypeScript, PostgreSQL, Prisma, Tailwind CSS, and Framer Motion.

---

## 🚀 Features

- **Auth System** – JWT-based email/password auth with secure httpOnly cookies
- **Public Profiles** – `/username` pages with SEO metadata, OpenGraph tags
- **10 Pre-built Themes** – Including Indian festive themes (Diwali, Holi)
- **Link Management** – Drag & drop reorder, scheduling, click tracking
- **Analytics** – Total clicks, page views, per-link stats with charts
- **QR Code Generator** – Styled QR codes with color customization, SVG/PNG download
- **Media Uploads** – Local storage (dev), structured for S3 migration
- **Templates Marketplace** – Architecture ready, DB schema in place
- **SEO** – Dynamic metadata, OpenGraph, sitemap.xml
- **Fully Typed** – End-to-end TypeScript with Zod validation

---

## 🗂️ Folder Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/          # login, register, logout, me
│   │   ├── links/         # CRUD + reorder
│   │   ├── profile/       # profile update
│   │   ├── analytics/     # dashboard stats
│   │   ├── themes/        # all themes
│   │   ├── upload/        # file upload
│   │   ├── click/[id]/    # click tracking redirect
│   │   ├── qr/            # QR code generation
│   │   └── templates/     # templates marketplace
│   ├── dashboard/         # protected dashboard pages
│   │   ├── page.tsx       # overview
│   │   ├── links/         # link manager
│   │   ├── appearance/    # theme picker
│   │   ├── analytics/     # analytics charts
│   │   ├── qr/            # QR generator
│   │   ├── templates/     # marketplace
│   │   └── settings/      # profile settings
│   ├── [username]/        # public profile page
│   ├── login/
│   ├── register/
│   ├── layout.tsx
│   ├── page.tsx           # landing page
│   └── sitemap.ts
├── components/
│   ├── dashboard/         # all dashboard UI
│   └── profile/           # public profile UI
├── lib/
│   ├── prisma.ts          # Prisma singleton
│   ├── auth.ts            # JWT helpers
│   ├── validations.ts     # Zod schemas
│   ├── analytics.ts       # analytics helpers
│   ├── upload.ts          # file upload utility
│   ├── api-response.ts    # response helpers
│   └── utils.ts           # utility functions
├── middleware.ts           # route protection
└── types/index.ts         # shared TS types
prisma/
├── schema.prisma           # complete DB schema
└── seed.ts                 # 10 themes seeder
```

---

## ⚙️ Local Development

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or pnpm

### 1. Clone & Install

```bash
git clone <your-repo>
cd linkbio-saas
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/linkbio_db"
JWT_SECRET="your-super-secret-key-at-least-32-characters"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Database Setup

```bash
# Create database
createdb linkbio_db

# Push schema
npm run db:push

# Seed themes
npm run db:seed
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Explore

- Register at `/register`
- Dashboard at `/dashboard`
- Your public page at `/{username}`
- DB Studio: `npm run db:studio`

---

## 🗄️ Database Schema

```
User         → email, password, username, plan
Profile      → bio, avatar, theme, seo, social links
Link         → title, url, scheduling, media, click tracking
Theme        → 10 pre-built themes with config JSON
Analytics    → page views, link clicks, device/browser info
ClickDaily   → aggregated daily click counts
Template     → marketplace architecture (future)
UserTheme    → tracks unlocked themes per user
```

---

## 🌐 Production Deployment (Vercel)

### 1. Vercel Setup

```bash
npm i -g vercel
vercel login
vercel
```

### 2. Environment Variables (Vercel Dashboard)

```
DATABASE_URL          # Neon/Supabase/Railway PostgreSQL URL
JWT_SECRET            # openssl rand -base64 32
NEXT_PUBLIC_APP_URL   # https://yourdomain.com
```

### 3. Recommended Services

| Service | Purpose |
|---------|---------|
| [Neon](https://neon.tech) | Serverless PostgreSQL (free tier) |
| [Railway](https://railway.app) | Managed Postgres |
| [Vercel](https://vercel.com) | Next.js hosting |
| [Cloudflare R2](https://r2.cloudflare.com) | File storage (future S3 migration) |

### 4. Database Migration on Deploy

Add to `vercel.json`:
```json
{
  "buildCommand": "prisma generate && prisma migrate deploy && next build"
}
```

### 5. File Uploads in Production

Switch from local storage to S3/R2:
1. Install `@aws-sdk/client-s3`
2. Update `src/lib/upload.ts` to use S3 client
3. Add AWS env vars from `.env.example`

---

## 🔐 Security

- Passwords hashed with bcrypt (12 rounds)
- JWT stored in httpOnly cookies
- Input validated with Zod on all API routes
- Auth middleware protects all dashboard routes
- CSRF protection via SameSite cookie policy

---

## 📦 Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Auth | JWT (jose) + bcryptjs |
| Validation | Zod + React Hook Form |
| Charts | Recharts |
| QR Code | qrcode |
| Icons | Lucide React |

---

## 🛣️ Roadmap

- [ ] S3/R2 file upload integration
- [ ] Email verification (Resend)
- [ ] Custom domain support
- [ ] Templates marketplace
- [ ] Razorpay/Stripe subscriptions
- [ ] UPI payment links
- [ ] WhatsApp Business integration
- [ ] Instagram auto-sync
- [ ] Multi-language support (Hindi, Tamil, etc.)
