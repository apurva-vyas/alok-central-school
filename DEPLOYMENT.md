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

## Step 3: Create AWS Lambda Function (one-time)

1. Go to **AWS Console → Lambda → Create function**
2. Choose **Author from scratch**
3. Settings:
   - **Function name:** `alok-central-school-api` (must match the name in `amplify.yml`)
   - **Runtime:** `Node.js 20.x`
   - **Architecture:** `x86_64`
4. Click **Create function**
5. Go to **Configuration → General configuration → Edit**:
   - **Handler:** `index.handler`
   - **Timeout:** `30 seconds`
   - **Memory:** `256 MB`
6. Go to **Configuration → Environment variables** and add:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | `postgresql://postgres:PASSWORD@db.PROJECT.supabase.co:5432/postgres` |
| `DIRECT_URL` | `postgresql://postgres:PASSWORD@db.PROJECT.supabase.co:5432/postgres` |
| `JWT_SECRET` | (random 64+ character string) |
| `STORAGE_PROVIDER` | `aws` |
| `S3_BUCKET` | `alok-central-school` |
| `S3_REGION` | `ap-south-1` |
| `S3_ACCESS_KEY_ID` | (your IAM access key) |
| `S3_SECRET_ACCESS_KEY` | (your IAM secret key) |
| `CORS_ORIGIN` | `https://your-app.amplifyapp.com` |
| `NODE_ENV` | `production` |

7. Go to **Configuration → Function URL → Create function URL**
   - Auth type: **NONE**
   - Save and copy the URL (e.g., `https://abc123.lambda-url.ap-south-1.on.aws`)

## Step 4: Grant Amplify Permission to Deploy Lambda

The `amplify.yml` auto-deploys the backend to Lambda on every push. For this to work, the Amplify service role needs Lambda + S3 permissions:

1. Go to **Amplify Console → App settings → General → Service role** — note the role name (e.g., `amplifyconsole-backend-role`)
2. Go to **AWS Console → IAM → Roles** → find that role
3. Click **Add permissions → Create inline policy** → JSON tab → paste:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "lambda:UpdateFunctionCode",
      "Resource": "arn:aws:lambda:ap-south-1:YOUR_ACCOUNT_ID:function:alok-central-school-api"
    },
    {
      "Effect": "Allow",
      "Action": "s3:PutObject",
      "Resource": "arn:aws:s3:::alok-central-school/deploy/*"
    }
  ]
}
```

Replace `YOUR_ACCOUNT_ID` with your 12-digit AWS account ID.

## Step 5: AWS Amplify Setup

1. Go to **AWS Amplify Console** → **New App** → **Host web app**
2. Connect your GitHub repo (`alok-central-school`)
3. Select the branch (e.g., `release-v2`)
4. Amplify will auto-detect `amplify.yml`

### Amplify Environment Variables

Go to **Amplify Console → Hosting → Environment variables → Manage variables** and add:

> **Note:** Amplify reserves the `AWS_` prefix — all S3 variables use the `S3_` prefix instead.

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |

(Database and S3 credentials go in the **Lambda** environment variables in Step 3, not here.)

### Rewrites / Redirects

Go to **Amplify Console → Hosting → Rewrites and redirects → Manage redirects** and add (in this order):

| Source | Target | Type |
|--------|--------|------|
| `/api/<*>` | `https://YOUR-LAMBDA-FUNCTION-URL/api/<*>` | 200 (Rewrite) |
| `/<*>` | `/index.html` | 200 (Rewrite) |

Replace `YOUR-LAMBDA-FUNCTION-URL` with the Function URL from Step 3.

## Step 6: Deploy

1. Push to GitHub:

```bash
git add .
git commit -m "Production deployment"
git push origin release-v2
```

2. Amplify auto-builds frontend + auto-deploys backend to Lambda
3. Check build logs in Amplify Console

## Step 7: Verify

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

## Amplify Build Notes

- In `amplify.yml`, **all phases share a single shell** — the working directory persists across backend preBuild → backend build → frontend preBuild → frontend build.
- Backend commands that `cd server` must be wrapped in **subshells** using parentheses `(cd server && ...)` so the CWD resets to the project root after each command. Without this, the frontend phases would run inside `server/` and execute the wrong `package.json`.
- Current backend build flow: both `preBuild` and `build` use `(cd server && ...)` subshells, so the frontend always starts from the project root.
- Both frontend and backend `npm ci` must use `--include=dev` because `NODE_ENV=production` (set in Amplify env vars) causes npm to skip devDependencies. The server needs `@types/*` packages and `typescript`; the frontend needs `@angular/cli`, `@angular-devkit/build-angular`, and `typescript` at build time.

## Troubleshooting

| Issue | Solution |
|-------|----------|
| API returns 401 | JWT token expired — re-login |
| Image upload fails | Check S3 credentials and bucket permissions |
| DB connection error | Verify DATABASE_URL in Amplify env vars |
| CORS error | Add your Amplify URL to CORS_ORIGIN env var |
| Angular routing 404 | Add `/<*>` → `/index.html` rewrite rule |
| Build fails | Check `amplify.yml` and build logs in console |
| Frontend runs `tsc` instead of `ng build` | Backend `cd server` leaked into frontend — wrap backend commands in subshells: `(cd server && ...)` |
| `TS7016: Could not find declaration file` | `NODE_ENV=production` skips devDependencies — use `npm ci --include=dev` in the backend preBuild |
