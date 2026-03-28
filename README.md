# Alok Central School

Full-stack web application for **Alok Central School**, Shahpura, Bhilwara (Rajasthan). Features a public-facing school website with gallery, faculty directory, board results, video gallery, and contact form — plus a secure admin panel for content management.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Angular 16, Bootstrap 5, ng-bootstrap 15, RxJS 7.8 |
| Backend | Node.js, Express 4, TypeScript 5 |
| Database | PostgreSQL (Supabase) via Prisma 5 ORM |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| File Storage | AWS S3 with Multer for uploads |
| Hosting | AWS Amplify (SPA + Lambda) |

## Architecture

```
Browser → AWS Amplify CDN → Angular SPA (static files)
                          → Lambda (Express API) → Supabase PostgreSQL
                                                 → AWS S3 (images)
```

The Angular SPA is served from Amplify's CDN. API requests (`/api/*`) are proxied to an Express server running on AWS Lambda via `serverless-http`. Images are stored in S3 and the database is hosted on Supabase.

## Features

### Public Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Hero carousel, school highlights, and quick links |
| About | `/about` | School history, mission, and vision |
| Services | `/services` | Facilities and services offered |
| Admissions | `/admission` | Admission process with embedded Google Form |
| Gallery | `/gallery` | Photo gallery organized by categories |
| Moments | `/moments` | School event moments |
| Videos | `/videos` | YouTube video gallery via YouTube Data API v3 |
| Faculty | `/faculty` | Staff directory with photos and designations |
| Board Results | `/results` | Student board exam results filterable by year |
| CBSE | `/cbse` | CBSE-related information |
| Contact | `/contact` | Contact form, school address, and embedded map |

### Admin Panel

Accessible at `/admin` behind JWT authentication (`/login`).

- **Gallery Management** — Upload, edit, toggle visibility, and delete gallery images (stored in S3)
- **Faculty Management** — Add/edit/reorder/remove faculty members with photo uploads
- **Board Results** — Add/edit/delete student results with bulk management
- **Contact Messages** — View submitted contact messages, mark as read, delete

### Shared Components

Reusable components in `src/app/shared/`:

- `PageHeroComponent` — Consistent page header with title and breadcrumb
- `GenderAvatarComponent` — SVG avatar with gender-based variants
- `IconComponent` — Centralized icon component

### API Services

All HTTP communication goes through dedicated services:

- `AuthService` — Login, token management, auto-refresh
- `GalleryApiService` — Gallery CRUD operations
- `FacultyApiService` — Faculty CRUD operations
- `ResultsApiService` — Board results CRUD operations
- `ContactApiService` — Contact form submission and message management
- `YouTubeService` — YouTube Data API integration for video gallery

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── home/                  # Landing page
│   │   ├── about-page/            # About the school
│   │   ├── services/              # Services page
│   │   ├── admissions/            # Admission info
│   │   ├── gallery/               # Photo gallery
│   │   ├── moments/               # School moments
│   │   ├── video-gallery/         # YouTube videos
│   │   ├── faculty/               # Faculty directory
│   │   ├── board-results/         # Board exam results
│   │   ├── result/                # Individual results
│   │   ├── cbse/                  # CBSE info
│   │   ├── contact/               # Contact page
│   │   ├── login/                 # Admin login
│   │   ├── admin/                 # Admin dashboard
│   │   ├── bs-navbar/             # Navigation bar
│   │   ├── footer/                # Footer
│   │   ├── carousel/              # Home carousel
│   │   ├── features/              # Feature highlights
│   │   └── shared/                # Shared components & services
│   ├── assets/                    # Static images and assets
│   ├── environments/              # Environment configs
│   └── styles.css                 # Global styles & design tokens
├── server/
│   ├── src/
│   │   ├── index.ts               # Express app + Lambda handler
│   │   ├── routes/
│   │   │   ├── auth.routes.ts     # Login, refresh, profile
│   │   │   ├── gallery.routes.ts  # Gallery CRUD + S3 upload
│   │   │   ├── faculty.routes.ts  # Faculty CRUD
│   │   │   ├── results.routes.ts  # Board results CRUD
│   │   │   └── contact.routes.ts  # Contact form + messages
│   │   ├── middleware/            # Auth middleware (JWT)
│   │   └── lib/                   # Prisma client, S3 client
│   ├── prisma/
│   │   └── schema.prisma          # Database schema
│   ├── scripts/
│   │   └── seed-admin.ts          # Admin user seeder
│   └── package.json
├── amplify.yml                    # AWS Amplify build config
├── angular.json                   # Angular CLI config
├── DEPLOYMENT.md                  # Production deployment guide
└── package.json
```

## Database Schema

Five Prisma models mapped to PostgreSQL tables:

| Model | Table | Purpose |
|-------|-------|---------|
| `AdminUser` | `admin_users` | Admin login credentials |
| `GalleryImage` | `gallery_images` | Photos with S3 URLs, categories, and visibility |
| `FacultyMember` | `faculty_members` | Staff profiles with photos, qualifications, and ordering |
| `StudentResult` | `student_results` | Board exam results with percentage, year, and class |
| `ContactMessage` | `contact_messages` | Submitted contact form entries |

## API Endpoints

### Public (no auth)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/gallery` | List active gallery images |
| `GET` | `/api/gallery/categories` | List gallery categories |
| `GET` | `/api/faculty` | List active faculty |
| `GET` | `/api/faculty/:id` | Get faculty member details |
| `GET` | `/api/results` | List student results |
| `GET` | `/api/results/years` | List available result years |
| `POST` | `/api/contact` | Submit contact form |

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/login` | Admin login (returns JWT) |
| `POST` | `/api/auth/refresh` | Refresh JWT token |
| `GET` | `/api/auth/me` | Get current admin profile |

### Admin (JWT required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/admin/gallery` | List all gallery images (incl. hidden) |
| `POST` | `/api/upload` | Upload image to S3 |
| `PUT` | `/api/gallery/:id` | Update gallery image |
| `PATCH` | `/api/gallery/:id/toggle` | Toggle image visibility |
| `DELETE` | `/api/gallery/:id` | Delete gallery image |
| `GET` | `/api/admin/faculty` | List all faculty (incl. inactive) |
| `POST` | `/api/faculty` | Add faculty member |
| `PUT` | `/api/faculty/:id` | Update faculty member |
| `PATCH` | `/api/faculty/:id/toggle` | Toggle faculty visibility |
| `PATCH` | `/api/faculty/:id/order` | Update display order |
| `DELETE` | `/api/faculty/:id` | Delete faculty member |
| `GET` | `/api/admin/results` | List all results |
| `POST` | `/api/results` | Add student result |
| `PUT` | `/api/results/:id` | Update student result |
| `DELETE` | `/api/results/:id` | Delete student result |
| `GET` | `/api/admin/messages` | List contact messages |
| `PATCH` | `/api/admin/messages/:id/read` | Mark message as read |
| `DELETE` | `/api/admin/messages/:id` | Delete message |

## Getting Started

### Prerequisites

- **Node.js** 18+
- **npm** 9+
- **Angular CLI** 16 (`npm install -g @angular/cli`)
- **PostgreSQL** database (local or [Supabase](https://supabase.com) free tier)
- **AWS S3** bucket for image storage (optional for local dev)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/alok-central-school.git
cd alok-central-school

# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
```

### Environment Setup

```bash
# In server/
cp .env.example .env
```

Edit `server/.env` with your credentials:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/alok_central_school
DIRECT_URL=postgresql://user:password@localhost:5432/alok_central_school
JWT_SECRET=your-secret-key-here
STORAGE_PROVIDER=aws
AWS_S3_BUCKET=your-bucket-name
AWS_S3_REGION=ap-south-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
CORS_ORIGIN=http://localhost:4200
```

### Database Setup

```bash
cd server

# Push schema to database
npx prisma db push

# Generate Prisma client
npx prisma generate

# Seed the admin user
npx ts-node scripts/seed-admin.ts
```

### Running Locally

Open two terminals:

```bash
# Terminal 1 — Backend (http://localhost:3000)
cd server
npm run dev

# Terminal 2 — Frontend (http://localhost:4200)
ng serve
```

| URL | Purpose |
|-----|---------|
| http://localhost:4200 | Frontend |
| http://localhost:3000 | Backend API |
| http://localhost:4200/admin | Admin panel |
| http://localhost:4200/login | Admin login |

## Build

```bash
# Frontend — outputs to dist/hello/
npm run build

# Backend — outputs to server/dist/
cd server
npm run build
```

## Deployment

Production deployment uses **AWS Amplify** (frontend CDN + Lambda API), **Supabase** (PostgreSQL), and **AWS S3** (image storage).

See [DEPLOYMENT.md](./DEPLOYMENT.md) for the full step-by-step production deployment guide covering:

- Supabase database setup
- S3 bucket configuration
- Amplify environment variables
- Rewrite rules for SPA routing and API proxying
- Custom domain setup
- Troubleshooting

## Environment Files

| File | Purpose | In Git? |
|------|---------|---------|
| `server/.env` | Local dev secrets | No (gitignored) |
| `server/.env.example` | Template for `.env` | Yes |
| `src/environments/environment.ts` | Angular dev config (localhost:3000) | Yes |
| `src/environments/environment.prod.ts` | Angular prod config (`/api` proxy) | Yes |

## Scripts Reference

### Frontend (root `package.json`)

| Script | Command | Description |
|--------|---------|-------------|
| `start` | `ng serve` | Start dev server on port 4200 |
| `build` | `ng build` | Production build to `dist/hello/` |
| `test` | `ng test` | Run unit tests via Karma |
| `watch` | `ng build --watch` | Watch mode build |

### Backend (`server/package.json`)

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `ts-node-dev --respawn` | Start dev server with hot reload |
| `build` | `tsc` | Compile TypeScript to `dist/` |
| `start` | `node dist/index.js` | Start production server |
| `seed` | `ts-node scripts/seed-admin.ts` | Seed admin user |
| `prisma:push` | `prisma db push` | Push schema to database |
| `prisma:generate` | `prisma generate` | Generate Prisma client |

## License

This project is private and proprietary to Alok Central School.
