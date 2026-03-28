# Deployment Guide — Alok Central School

## Architecture

```
Browser → AWS Amplify CDN → Angular SPA (static files)
                          → Lambda (Express API) → Supabase PostgreSQL
                                                 → AWS S3 (images)
```

## Prerequisites

- GitHub repo connected to AWS Amplify
- Supabase project (free tier) with PostgreSQL
- AWS S3 bucket `alok-central-school` in `ap-south-1`
- AWS IAM user with S3 permissions

---

## Step 1: Supabase Database Setup

1. Go to [supabase.com](https://supabase.com) → Create project (Mumbai region)
2. Go to **Settings → Database** → Copy connection strings
3. Run locally to create tables:

```bash
cd server
cp .env.example .env
# Fill in DATABASE_URL and DIRECT_URL from Supabase
npx prisma db push
npx prisma generate
npx ts-node scripts/seed-admin.ts
```

This creates 5 tables: `admin_users`, `gallery_images`, `faculty_members`, `student_results`, `contact_messages`

## Step 2: AWS S3 Bucket

1. Go to **AWS Console → S3** → Create bucket
   - Name: `alok-central-school`
   - Region: `ap-south-1` (Mumbai)
   - Uncheck "Block all public access"
2. Go to **Bucket → Permissions → Bucket Policy** and add:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::alok-central-school/*"
    }
  ]
}
```

3. Create IAM user with programmatic access and attach policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:GetObject", "s3:DeleteObject"],
      "Resource": "arn:aws:s3:::alok-central-school/*"
    }
  ]
}
```

4. Save the Access Key ID and Secret Access Key

## Step 3: AWS Amplify Setup

1. Go to **AWS Amplify Console** → **New App** → **Host web app**
2. Connect your GitHub repo (`alok-central-school`)
3. Select the branch (e.g., `main`)
4. Amplify will auto-detect `amplify.yml`

### Environment Variables

Go to **Amplify Console → App Settings → Environment Variables** and add:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | `postgresql://postgres:PASSWORD@db.PROJECT.supabase.co:5432/postgres` |
| `DIRECT_URL` | `postgresql://postgres:PASSWORD@db.PROJECT.supabase.co:5432/postgres` |
| `JWT_SECRET` | (random 64+ character string) |
| `STORAGE_PROVIDER` | `aws` |
| `AWS_S3_BUCKET` | `alok-central-school` |
| `AWS_S3_REGION` | `ap-south-1` |
| `AWS_ACCESS_KEY_ID` | (your IAM access key) |
| `AWS_SECRET_ACCESS_KEY` | (your IAM secret key) |
| `CORS_ORIGIN` | `https://your-app.amplifyapp.com` |
| `NODE_ENV` | `production` |

### Rewrites / Redirects

Go to **Amplify Console → App Settings → Rewrites and redirects** and add:

| Source | Target | Type |
|--------|--------|------|
| `/api/<*>` | `https://your-lambda-url.amazonaws.com/api/<*>` | 200 (Proxy) |
| `/<*>` | `/index.html` | 200 (Rewrite) |

The first rule proxies API calls to Lambda. The second enables Angular routing.

## Step 4: Deploy

1. Push to GitHub:

```bash
git add .
git commit -m "Production deployment"
git push origin main
```

2. Amplify auto-builds and deploys
3. Check build logs in Amplify Console

## Step 5: Verify

1. Visit your Amplify URL
2. Check `/api/health` returns `{"status":"ok"}`
3. Log in at `/login` with `admin@alokcentralschool.com`
4. Upload an image in admin → verify it appears in Gallery
5. Add faculty → verify it appears on `/faculty`
6. Submit contact form → verify it appears in admin Messages tab

---

## Environment Files

| File | Purpose | Git |
|------|---------|-----|
| `server/.env` | Local dev secrets | .gitignored |
| `server/.env.example` | Template for .env | Committed |
| `src/environments/environment.ts` | Angular dev config (`localhost:3000`) | Committed |
| `src/environments/environment.prod.ts` | Angular prod config (`/api`) | Committed |

## Build Commands

| Command | Where | What |
|---------|-------|------|
| `npm run build` | Root | Angular production build → `dist/hello/` |
| `npm run build` | `server/` | TypeScript compile → `server/dist/` |
| `npx prisma generate` | `server/` | Generate Prisma client |
| `npx prisma db push` | `server/` | Create/update DB tables |

## Local Development

```bash
# Terminal 1: Backend
cd server && npm run dev

# Terminal 2: Frontend
npx ng serve
```

- Frontend: http://localhost:4200
- Backend: http://localhost:3000
- Admin: http://localhost:4200/admin
- Login: admin@alokcentralschool.com / ACS@admin2026

## Custom Domain (Optional)

1. Go to **Amplify Console → Domain Management**
2. Add your domain (e.g., `www.alokcentralschool.com`)
3. Follow DNS verification steps
4. Update `CORS_ORIGIN` env var to include your domain

## Troubleshooting

| Issue | Solution |
|-------|----------|
| API returns 401 | JWT token expired — re-login |
| Image upload fails | Check S3 credentials and bucket permissions |
| DB connection error | Verify DATABASE_URL in Amplify env vars |
| CORS error | Add your Amplify URL to CORS_ORIGIN env var |
| Angular routing 404 | Add `/<*>` → `/index.html` rewrite rule |
| Build fails | Check `amplify.yml` and build logs in console |
