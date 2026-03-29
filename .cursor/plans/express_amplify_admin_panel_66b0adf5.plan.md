---
name: Express Amplify Admin Panel
overview: "Full-stack admin panel: Angular frontend + Express.js backend in one repo, deployed together on AWS Amplify. Prisma ORM connects directly to Supabase PostgreSQL. Custom JWT auth with bcrypt (no external auth service). S3 for image storage. Feature flag for safe gallery migration."
todos:
  - id: e1
    content: Create server/ directory with Express project, Prisma schema, and configs
    status: completed
  - id: e2
    content: "Set up Prisma: schema.prisma with AdminUser + GalleryImage models, generate client"
    status: completed
  - id: e3
    content: "Build auth routes: login (bcrypt verify + JWT sign), logout, seed admin user script"
    status: completed
  - id: e4
    content: "Build gallery routes: list (public), upload (S3 + Prisma), delete (S3 + Prisma)"
    status: completed
  - id: e5
    content: Add JWT auth middleware for protected routes
    status: completed
  - id: e6
    content: Create Angular auth service, gallery API service, and auth guard
    status: completed
  - id: e7
    content: Create login component (email + password form)
    status: completed
  - id: e8
    content: Create admin dashboard component (drag-drop upload, image grid, edit/delete)
    status: completed
  - id: e9
    content: Create Moments component (new dynamic gallery, behind feature flag)
    status: completed
  - id: e10
    content: Add feature flag system and update routing (old Gallery vs new Moments)
    status: completed
  - id: e11
    content: Register all components, add /login, /admin (guarded), /moments routes
    status: completed
  - id: e12
    content: Create amplify.yml for combined frontend + backend deployment
    status: completed
  - id: e13
    content: Add FacultyMember model to Prisma schema with all fields + display order
    status: completed
  - id: e14
    content: "Build faculty Express routes: list (public, sorted), create/update/toggle/delete (admin)"
    status: completed
  - id: e15
    content: Create Angular faculty API service
    status: completed
  - id: e16
    content: Create public Our Faculty page (Principal on top, grouped by designation)
    status: completed
  - id: e17
    content: Create admin faculty management panel (add/edit/disable/reorder faculty)
    status: completed
  - id: e18
    content: Add 'Our Faculty' to ABOUT dropdown in navbar
    status: completed
  - id: e19
    content: "Test full flow: login, upload, gallery, faculty CRUD, logout"
    status: completed
isProject: false
---

# Admin Panel: Angular + Express + Prisma + Custom JWT

## Current Codebase Reference

Key existing files that will be modified or referenced:

- `[src/app/bs-navbar/bs-navbar.component.html](src/app/bs-navbar/bs-navbar.component.html)` -- Current navbar: HOME | ADMISSIONS | FACILITIES | GALLERY | VIDEOS | ABOUT (dropdown: School Info, 10th Board Results, CBSE Information) | CONTACT
- `[src/app/bs-navbar/bs-navbar.component.ts](src/app/bs-navbar/bs-navbar.component.ts)` -- Uses `IMAGES.branding.logo`, has `closeMenu()`, `toggleAboutSubmenu()`, listens to `NavigationEnd`
- `[src/app/shared/image-registry.ts](src/app/shared/image-registry.ts)` -- Central image paths + `GALLERY_IMAGES` array with `generateEventImages()` helper
- `[src/app/shared/school-info.ts](src/app/shared/school-info.ts)` -- School contact info, social URLs, form URLs, imports from `image-registry`
- `[src/app/gallery/gallery.component.ts](src/app/gallery/gallery.component.ts)` -- Uses `GALLERY_IMAGES` from image-registry, has lightbox, pagination, filter
- `[src/environments/environment.ts](src/environments/environment.ts)` -- Currently only has `youtubeApiKey`
- `[src/app/app-routing.module.ts](src/app/app-routing.module.ts)` -- Current routes: '', about, services, admission, contact, gallery, videos, result, cbse
- `[src/app/app.module.ts](src/app/app.module.ts)` -- All components declared, `HttpClientModule` already imported

## Architecture

```mermaid
flowchart TB
  subgraph AmplifyDeploy["AWS Amplify (single repo, single deployment)"]
    subgraph AngularFE["Angular Frontend (CDN)"]
      PublicPages["Home, Gallery, Faculty, About, etc."]
      LoginPage["Login Page (/login)"]
      AdminDash["Admin Dashboard (/admin)"]
    end
    subgraph LambdaAPI["Express API (Lambda)"]
      AuthAPI["/api/auth/*"]
      GalleryAPI["/api/gallery/*"]
      FacultyAPI["/api/faculty/*"]
    end
  end
  subgraph SupabasePG["Supabase PostgreSQL"]
    AdminUsers["admin_users"]
    GalleryTable["gallery_images"]
    FacultyTable["faculty_members"]
  end
  subgraph S3["AWS S3: alok-central-school"]
    GalleryDir["gallery/*.jpg"]
    FacultyDir["faculty/*.jpg"]
  end
  LoginPage -->|"POST credentials"| AuthAPI
  AuthAPI -->|"Prisma: bcrypt verify"| AdminUsers
  PublicPages -->|"GET (no auth)"| GalleryAPI
  PublicPages -->|"GET (no auth)"| FacultyAPI
  GalleryAPI -->|"Prisma query"| GalleryTable
  FacultyAPI -->|"Prisma query"| FacultyTable
  AdminDash -->|"POST/PUT/DELETE + JWT"| GalleryAPI
  AdminDash -->|"POST/PUT/DELETE + JWT"| FacultyAPI
  GalleryAPI -->|"PutObject/DeleteObject"| GalleryDir
  FacultyAPI -->|"PutObject/DeleteObject"| FacultyDir
```



## Tech Stack


| Layer        | Technology                               | Purpose                                                                 |
| ------------ | ---------------------------------------- | ----------------------------------------------------------------------- |
| Frontend     | Angular 16 (existing)                    | School website                                                          |
| Backend      | Express.js                               | API routes, business logic                                              |
| ORM          | Prisma                                   | Direct `postgres://` connection, auto table creation, type-safe queries |
| Database     | Supabase PostgreSQL (free tier)          | 500MB storage, direct connection                                        |
| Auth         | Custom JWT (`bcryptjs` + `jsonwebtoken`) | No external auth service                                                |
| File Storage | AWS S3 `alok-central-school` (existing)  | Image uploads                                                           |
| Deployment   | AWS Amplify                              | Frontend + backend from single repo                                     |


## Login / Auth UX Flow

### Navbar: Login Icon (far right corner)

Current navbar from `[bs-navbar.component.html](src/app/bs-navbar/bs-navbar.component.html)`:

```
HOME | ADMISSIONS | FACILITIES | GALLERY | VIDEOS | ABOUT▼ | CONTACT
                                                     └─ School Info
                                                     └─ Our Faculty (NEW)
                                                     └─ 10th Board Results
                                                     └─ CBSE Information
```

Login icon added after CONTACT:

```
Logged out:
┌────────────────────────────────────────────────────────────────────────────┐
│ [LOGO] HOME  ADMISSIONS  FACILITIES  GALLERY  VIDEOS  ABOUT▼  CONTACT   [👤] │
└────────────────────────────────────────────────────────────────────────────┘
                                                                      ↑ person icon

Logged in:
┌────────────────────────────────────────────────────────────────────────────┐
│ [LOGO] HOME  ADMISSIONS  FACILITIES  GALLERY  VIDEOS  ABOUT▼  CONTACT   [A▼] │
└────────────────────────────────────────────────────────────────────────────┘
                                                                      ↑ avatar
                                                                        Dashboard
                                                                        Logout
```

**Implementation in `[bs-navbar.component.html](src/app/bs-navbar/bs-navbar.component.html)`:**

```html
<!-- Add AFTER the </ul> closing tag of navbar-nav, INSIDE navbar-collapse -->

<!-- Login/User icon (always visible, outside hamburger on mobile) -->
<div class="nav-auth">
  <!-- Logged out: person icon -->
  <a *ngIf="!authService.isLoggedIn()" routerLink="/login"
     class="auth-icon" (click)="closeMenu()">
    <app-icon name="person" [size]="20"></app-icon>
  </a>

  <!-- Logged in: avatar dropdown -->
  <div *ngIf="authService.isLoggedIn()" class="auth-dropdown"
       (click)="toggleAuthDropdown($event)">
    <span class="avatar">{{ authService.currentUserInitial() }}</span>
    <ul class="dropdown-menu-custom" [class.open]="isAuthDropdownOpen">
      <li><a routerLink="/admin" (click)="closeMenu()">Dashboard</a></li>
      <li><a (click)="logout()">Logout</a></li>
    </ul>
  </div>
</div>
```

**Changes to `[bs-navbar.component.ts](src/app/bs-navbar/bs-navbar.component.ts)`:**

```typescript
import { AuthService } from '../shared/auth.service';

export class BsNavbarComponent {
  // ...existing properties
  isAuthDropdownOpen = false;

  constructor(private router: Router, public authService: AuthService) {
    // ...existing NavigationEnd subscription
  }

  toggleAuthDropdown(event: Event) {
    event.stopPropagation();
    this.isAuthDropdownOpen = !this.isAuthDropdownOpen;
    this.isAboutSubmenuOpen = false;
  }

  logout() {
    this.authService.logout();
    this.closeMenu();
    this.router.navigate(['/']);
  }

  closeMenu() {
    this.isMenuCollapsed = true;
    this.isAboutSubmenuOpen = false;
    this.isAuthDropdownOpen = false;
  }

  @HostListener('document:click')
  closeAllSubmenus() {
    this.isAboutSubmenuOpen = false;
    this.isAuthDropdownOpen = false;
  }
}
```

### Login Page (`/login`)

```
┌──────────────────────────────────────────────────┐
│               PAGE HERO (school image)            │
│              "Admin Login"                        │
└──────────────────────────────────────────────────┘

      ┌────────────────────────────────┐
      │  card-custom                   │
      │                                │
      │  Email:    [________________]  │  ← required, email format
      │  Password: [________________]  │  ← required, min 6 chars
      │                                │
      │  [!] Invalid email or password │  ← shown only on error (red)
      │                                │
      │       [ LOGIN ]                │  ← disabled while loading
      │       (loading spinner)        │  ← shown while request in progress
      │                                │
      └────────────────────────────────┘
```

**Full login flow:**

```mermaid
sequenceDiagram
  participant User
  participant LoginPage
  participant AuthService
  participant Express
  participant Prisma
  participant DB

  User->>LoginPage: Clicks login icon in navbar
  LoginPage->>LoginPage: Show login form
  User->>LoginPage: Enter email + password, click LOGIN
  LoginPage->>LoginPage: Validate inputs (required, format)
  LoginPage->>AuthService: login(email, password)
  AuthService->>Express: POST /api/auth/login {email, password}
  Express->>Prisma: findUnique({ where: { email } })
  Prisma->>DB: SELECT * FROM admin_users WHERE email = ?
  DB-->>Prisma: User row
  Prisma-->>Express: AdminUser { id, email, password_hash, name }
  Express->>Express: bcrypt.compare(password, password_hash)
  alt Invalid credentials
    Express-->>AuthService: 401 { error: "Invalid email or password" }
    AuthService-->>LoginPage: Error
    LoginPage->>LoginPage: Show error message, re-enable button
  else Valid credentials
    Express->>Express: jwt.sign({ id, email, name }, SECRET, { expiresIn: "24h" })
    Express-->>AuthService: 200 { token, user: { id, email, name } }
    AuthService->>AuthService: Store token in localStorage, update currentUser$
    AuthService-->>LoginPage: Success
    LoginPage->>User: Redirect to home page (/)
    Note over User: Navbar now shows avatar + dropdown
  end
```



**Validation rules (both frontend + backend):**


| Field         | Frontend validation           | Server validation              |
| ------------- | ----------------------------- | ------------------------------ |
| Email         | Required, valid email format  | Required, trimmed, lowercased  |
| Password      | Required, min 6 characters    | Required, bcrypt compared      |
| Rate limiting | Disable button during request | Optional: limit login attempts |


**Edge cases handled:**

- Already logged in -> visit `/login` -> redirect to `/`
- Token expired -> any API call returns 401 -> AuthService auto-logout -> redirect to `/login`
- Browser tab closed -> reopen -> AuthService checks localStorage for token -> if valid, still logged in
- Multiple tabs -> logout in one tab -> others detect on next API call (401)

### What Each Page Shows (Public vs Admin)


| Page            | URL        | Public User (no login)                                           | Admin User (logged in)                      |
| --------------- | ---------- | ---------------------------------------------------------------- | ------------------------------------------- |
| Home            | `/`        | Normal view                                                      | Same + avatar in navbar                     |
| Gallery         | `/gallery` | View photos, filter, lightbox, pagination                        | Exactly the same (clean, no edit buttons)   |
| Faculty         | `/faculty` | View faculty list grouped by designation                         | Exactly the same (clean, no edit buttons)   |
| Results         | `/results` | View board results by year/board, pagination, detail popup       | Exactly the same (clean, no edit buttons)   |
| Videos          | `/videos`  | View YouTube videos                                              | Exactly the same                            |
| About/CBSE/etc. | various    | Normal view                                                      | Same                                        |
| Login           | `/login`   | Login form                                                       | Redirected to `/`                           |
| Admin           | `/admin`   | **Redirected to `/login`** (AuthGuard)                           | Full dashboard: Gallery + Faculty + Results |
| Admin (API)     | `/api/*`   | GET endpoints work (public data), POST/PUT/DELETE return **401** | All endpoints work with JWT                 |


### Logout Flow

```mermaid
sequenceDiagram
  participant Admin
  participant Navbar
  participant AuthService
  participant Router

  Admin->>Navbar: Click avatar dropdown -> "Logout"
  Navbar->>AuthService: logout()
  AuthService->>AuthService: Remove token from localStorage
  AuthService->>AuthService: Set currentUser$ to null
  AuthService-->>Navbar: isLoggedIn() returns false
  Navbar->>Navbar: Show person icon (login state)
  Navbar->>Router: Navigate to /
  Note over Admin: /admin is now blocked by AuthGuard
```



## Project Structure (single repo)

```
alok-central-school/
├── src/                                    # Angular frontend (EXISTING)
│   ├── app/
│   │   ├── gallery/                        # EXISTING: static gallery (stays unchanged)
│   │   ├── moments/                        # NEW: dynamic gallery (behind feature flag)
│   │   │   ├── moments.component.ts        #   Same features as gallery: filter, lightbox, zoom, pagination
│   │   │   ├── moments.component.html      #   But fetches from /api/gallery instead of image-registry
│   │   │   └── moments.component.css
│   │   ├── faculty/                        # NEW: public faculty page
│   │   │   ├── faculty.component.ts        #   Fetches from /api/faculty, groups by designation
│   │   │   ├── faculty.component.html      #   Principal featured card + grouped grid
│   │   │   └── faculty.component.css       #   Circular photos, responsive grid, fallback avatar
│   │   ├── board-results/                  # NEW: public results page
│   │   │   ├── board-results.component.ts  #   Year sidebar, board tabs, pagination, detail popup
│   │   │   ├── board-results.component.html#   Sidebar + card grid + popup
│   │   │   └── board-results.component.css #   Responsive sidebar->tabs on mobile
│   │   ├── admin/                          # NEW: admin dashboard (protected by AuthGuard)
│   │   │   ├── admin.component.ts          #   Tab management (Gallery | Faculty), auth check
│   │   │   ├── admin.component.html        #   Dashboard shell with tabs + content
│   │   │   └── admin.component.css
│   │   ├── login/                          # NEW: login page
│   │   │   ├── login.component.ts          #   Form validation, AuthService.login(), redirect
│   │   │   ├── login.component.html        #   Email + password form inside card-custom
│   │   │   └── login.component.css
│   │   ├── bs-navbar/                      # MODIFY: add login icon + auth dropdown
│   │   ├── shared/
│   │   │   ├── auth.service.ts             # NEW: login(), logout(), getToken(), isLoggedIn(), currentUser$
│   │   │   ├── auth.guard.ts               # NEW: CanActivate guard, checks AuthService.isLoggedIn()
│   │   │   ├── auth.interceptor.ts         # NEW: HttpInterceptor, attaches Bearer token, handles 401
│   │   │   ├── gallery-api.service.ts      # NEW: HttpClient calls to /api/gallery endpoints
│   │   │   ├── faculty-api.service.ts      # NEW: HttpClient calls to /api/faculty endpoints
│   │   │   ├── results-api.service.ts     # NEW: HttpClient calls to /api/results endpoints
│   │   │   ├── image-registry.ts           # EXISTING: keep unchanged (used by old gallery)
│   │   │   ├── school-info.ts              # EXISTING: keep unchanged
│   │   │   ├── youtube.service.ts          # EXISTING: keep unchanged
│   │   │   ├── icon/icon.component.ts      # MODIFY: add 'person' icon for login
│   │   │   └── page-hero/                  # EXISTING: keep unchanged
│   │   └── ...existing components
│   └── environments/
│       └── environment.ts                  # MODIFY: add apiUrl, featureFlags
├── server/                                 # NEW: Express backend
│   ├── prisma/
│   │   └── schema.prisma                   # AdminUser + GalleryImage + FacultyMember
│   ├── src/
│   │   ├── index.ts                        # Express app + cors + routes + serverless-http export
│   │   ├── middleware/
│   │   │   └── auth.middleware.ts           # JWT verify + DB user lookup + error responses
│   │   ├── routes/
│   │   │   ├── auth.routes.ts              # POST /login, GET /me, POST /logout
│   │   │   ├── gallery.routes.ts           # Public + admin gallery CRUD
│   │   │   ├── faculty.routes.ts           # Public + admin faculty CRUD
│   │   │   └── results.routes.ts          # Public + admin results CRUD
│   │   └── lib/
│   │       ├── prisma.ts                   # PrismaClient singleton (reuse across Lambda invocations)
│   │       └── s3.ts                       # S3Client with bucket/region config
│   ├── scripts/
│   │   └── seed-admin.ts                   # One-time: create admin user with bcrypt hash
│   ├── package.json                        # Express + Prisma + bcrypt + jwt + multer + aws-sdk
│   └── tsconfig.json
├── amplify.yml                             # NEW: combined frontend + backend build
├── package.json                            # EXISTING: Angular deps
└── angular.json                            # MODIFY: increase anyComponentStyle budget if needed
```

## Prisma Schema

`**server/prisma/schema.prisma`:**

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")    // Direct connection to Supabase PostgreSQL
}

generator client {
  provider = "prisma-client-js"
}

model AdminUser {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String   // bcrypt hashed, 12 salt rounds
  name      String?
  createdAt DateTime @default(now()) @map("created_at")

  @@map("admin_users")
}

model GalleryImage {
  id         String   @id @default(uuid())
  title      String
  category   String
  alt        String?
  s3Url      String   @map("s3_url")
  s3Key      String   @map("s3_key")
  date       DateTime @default(now())
  isActive   Boolean  @default(true) @map("is_active")
  createdAt  DateTime @default(now()) @map("created_at")
  updatedAt  DateTime @updatedAt @map("updated_at")
  uploadedBy String?  @map("uploaded_by")

  @@map("gallery_images")
}

model FacultyMember {
  id            String    @id @default(uuid())
  name          String
  designation   String    // Principal, Vice Principal, Head Teacher, Teacher, PET, Librarian, Other
  department    String?   // Mathematics, Science, Hindi, English, etc.
  qualification String?   // M.A., B.Ed., M.Sc., etc.
  experience    String?   // "15 years"
  email         String?
  phone         String?
  photoUrl      String?   @map("photo_url")
  photoKey      String?   @map("photo_key")
  bio           String?
  joiningDate   DateTime? @map("joining_date")
  isActive      Boolean   @default(true) @map("is_active")
  displayOrder  Int       @default(0) @map("display_order")
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")

  @@map("faculty_members")
}

model StudentResult {
  id             String    @id @default(uuid())
  name           String
  fatherName     String    @map("father_name")
  gender         String                              // Male, Female, Other
  percentage     Float
  board          String                              // CBSE, RBSE
  year           Int                                 // 2026, 2025, etc.
  rollNumber     String?   @map("roll_number")
  dob            DateTime? @map("dob")
  admissionNo    String?   @map("admission_no")
  contactNumber  String?   @map("contact_number")    // NEVER exposed in public API
  photoUrl       String?   @map("photo_url")
  photoKey       String?   @map("photo_key")
  className      String    @default("10th") @map("class_name")
  isActive       Boolean   @default(true) @map("is_active")
  createdAt      DateTime  @default(now()) @map("created_at")
  updatedAt      DateTime  @updatedAt @map("updated_at")

  @@map("student_results")
}
```

**Commands:**

```bash
cd server
npx prisma db push         # Creates all 4 tables (admin_users, gallery_images, faculty_members, student_results)
npx prisma generate        # Generates type-safe client
npx ts-node scripts/seed-admin.ts  # Creates first admin user
```

## All API Endpoints (23 total)

**Auth (2):**


| Method | Endpoint          | Auth | Request               | Response                                        |
| ------ | ----------------- | ---- | --------------------- | ----------------------------------------------- |
| POST   | `/api/auth/login` | No   | `{ email, password }` | `{ token, user: { id, email, name } }` or `401` |
| GET    | `/api/auth/me`    | JWT  | --                    | `{ id, email, name }` or `401`                  |


**Gallery - Public (2):**


| Method | Endpoint                  | Auth | Response                                                                            |
| ------ | ------------------------- | ---- | ----------------------------------------------------------------------------------- |
| GET    | `/api/gallery`            | No   | `[{ id, title, category, s3Url, date }]` where `isActive=true`, sorted by date DESC |
| GET    | `/api/gallery?category=x` | No   | Same, filtered by category                                                          |


**Gallery - Admin (5):**


| Method | Endpoint                  | Auth | Request                                           | Response                                      |
| ------ | ------------------------- | ---- | ------------------------------------------------- | --------------------------------------------- |
| GET    | `/api/admin/gallery`      | JWT  | --                                                | ALL images including `isActive=false`         |
| POST   | `/api/upload`             | JWT  | multipart: `file` + `title` + `category` + `date` | `{ id, title, s3Url }` or `401`               |
| PUT    | `/api/gallery/:id`        | JWT  | `{ title?, category?, alt?, date? }`              | Updated image or `401/404`                    |
| PATCH  | `/api/gallery/:id/toggle` | JWT  | --                                                | `{ isActive: true/false }` or `401/404`       |
| DELETE | `/api/gallery/:id`        | JWT  | --                                                | `204` (deletes S3 file + DB row) or `401/404` |


**Faculty - Public (2):**


| Method | Endpoint           | Auth | Response                                                                                          |
| ------ | ------------------ | ---- | ------------------------------------------------------------------------------------------------- |
| GET    | `/api/faculty`     | No   | `[{ designation, members: [{ id, name, designation, photoUrl }] }]` grouped, `isActive=true` only |
| GET    | `/api/faculty/:id` | No   | Single faculty full details                                                                       |


**Faculty - Admin (6):**


| Method | Endpoint                  | Auth | Request                                                    | Response                                       |
| ------ | ------------------------- | ---- | ---------------------------------------------------------- | ---------------------------------------------- |
| GET    | `/api/admin/faculty`      | JWT  | --                                                         | ALL faculty including `isActive=false`         |
| POST   | `/api/faculty`            | JWT  | multipart: `file?` + `name` + `designation` + other fields | `{ id, name }` or `401`                        |
| PUT    | `/api/faculty/:id`        | JWT  | multipart: `file?` + fields to update                      | Updated faculty or `401/404`                   |
| PATCH  | `/api/faculty/:id/toggle` | JWT  | --                                                         | `{ isActive: true/false }` or `401/404`        |
| PATCH  | `/api/faculty/:id/order`  | JWT  | `{ displayOrder: number }`                                 | `204` or `401/404`                             |
| DELETE | `/api/faculty/:id`        | JWT  | --                                                         | `204` (deletes S3 photo + DB row) or `401/404` |


## Admin Dashboard (`/admin`) -- 3 Tabs: Gallery | Faculty | Results

```
┌──────────────────────────────────────────────────────────────────┐
│  Admin Dashboard                                     [Logout]    │
│                                                                   │
│  [Gallery]  [Faculty]  [Results]                                  │
│  ─────────────────────────────────────────────────────────────── │
│                                                                   │
│  GALLERY TAB:                                                     │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  ┌──────────────────────────────────────────────────────┐  │  │
│  │  │  DRAG & DROP IMAGE HERE  (or click to browse)        │  │  │
│  │  │  Title: [________]  Category: [Select ▼]  [UPLOAD]   │  │  │
│  │  └──────────────────────────────────────────────────────┘  │  │
│  │                                                             │  │
│  │  Search: [________]  Category: [All ▼]  Status: [All ▼]   │  │
│  │                                                             │  │
│  │  ┌─────┐ Science Fair 2024      ☑ Active   [Edit] [Delete] │  │
│  │  │thumb│ science fair | 15 Feb 2024                         │  │
│  │  └─────┘                                                    │  │
│  │  ┌─────┐ Annual Function        ☑ Active   [Edit] [Delete] │  │
│  │  │thumb│ annual function | 10 Jan 2024                      │  │
│  │  └─────┘                                                    │  │
│  │  ┌─────┐ Old Photo              ☐ Hidden   [Edit] [Delete] │  │
│  │  │thumb│ events | 05 Mar 2023           (grayed out row)    │  │
│  │  └─────┘                                                    │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  FACULTY TAB:                                                     │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  [+ Add Faculty Member]                                     │  │
│  │                                                             │  │
│  │  Search: [________]  Designation: [All ▼]  Status: [All ▼] │  │
│  │                                                             │  │
│  │  ┌─────┐ Virendra Kumar Sharma  Principal  ☑  [Edit][Del] │  │
│  │  ┌─────┐ Rajesh Sharma          Teacher    ☑  [Edit][Del] │  │
│  │  ┌─────┐ Former Teacher         Teacher    ☐  [Edit][Del] │  │  ← grayed out
│  │  ┌─────┐ Sunita Devi            Teacher    ☑  [Edit][Del] │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

## Public Faculty Page (`/faculty`)

```
┌──────────────────────────────────────────────────┐
│               PAGE HERO (school image)            │
│              "Our Faculty"                        │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│  ┌──────────┐                                     │
│  │  PHOTO   │  Virendra Kumar Sharma              │
│  │ (large,  │  Principal                          │
│  │ centered)│                                     │
│  └──────────┘                                     │
│  ─── Featured Card (highlighted border) ───       │
└──────────────────────────────────────────────────┘

  ── Teaching Staff ──────────────────────
  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐
  │circle│  │circle│  │circle│  │circle│
  │photo │  │photo │  │photo │  │ [AV] │  ← fallback avatar (initials)
  │ Name │  │ Name │  │ Name │  │ Name │
  │Desgn.│  │Desgn.│  │Desgn.│  │Desgn.│
  └──────┘  └──────┘  └──────┘  └──────┘

  ── Support Staff ───────────────────────
  ┌──────┐  ┌──────┐
  │circle│  │circle│
  │photo │  │photo │
  │ Name │  │ Name │
  │Desgn.│  │Desgn.│
  └──────┘  └──────┘
```

Designation groups sorted: Principal > Vice Principal > Head Teacher > Teacher > PET > Librarian > Other

## Feature Flag

In `[src/environments/environment.ts](src/environments/environment.ts)`:

```typescript
export const environment = {
  production: false,
  youtubeApiKey: '...',
  apiUrl: 'http://localhost:3000/api',  // Express server URL (local dev)
  featureFlags: {
    useNewGallery: false,  // false = existing static gallery, true = new Moments from API
  },
};
```

In `[src/app/app-routing.module.ts](src/app/app-routing.module.ts)`:

```typescript
import { environment } from '../environments/environment';

const galleryComponent = environment.featureFlags.useNewGallery
  ? MomentsComponent
  : GalleryComponent;

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutPageComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'admission', component: AdmissionsComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'gallery', component: galleryComponent },           // switches based on flag
  { path: 'moments', component: MomentsComponent },           // always available for testing
  { path: 'videos', component: VideoGalleryComponent },
  { path: 'result', component: ResultComponent },
  { path: 'cbse', component: CBSEComponent },
  { path: 'faculty', component: FacultyComponent },            // NEW
  { path: 'login', component: LoginComponent },                // NEW
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] },  // NEW (protected)
  { path: '**', redirectTo: '' },
];
```

## AuthService Implementation

```typescript
// src/app/shared/auth.service.ts
@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUser = new BehaviorSubject<{id: string, email: string, name: string} | null>(null);
  currentUser$ = this.currentUser.asObservable();

  constructor(private http: HttpClient) {
    // On app start, check if token exists in localStorage
    const token = localStorage.getItem('acs_token');
    const user = localStorage.getItem('acs_user');
    if (token && user && !this.isTokenExpired(token)) {
      this.currentUser.next(JSON.parse(user));
    }
  }

  login(email: string, password: string): Observable<any> { ... }
  logout(): void { localStorage.removeItem('acs_token'); localStorage.removeItem('acs_user'); this.currentUser.next(null); }
  getToken(): string | null { return localStorage.getItem('acs_token'); }
  isLoggedIn(): boolean { return !!this.getToken() && !this.isTokenExpired(this.getToken()!); }
  currentUserInitial(): string { return this.currentUser.value?.name?.charAt(0)?.toUpperCase() || 'A'; }
  private isTokenExpired(token: string): boolean { /* decode JWT, check exp */ }
}
```

## AuthInterceptor Implementation

```typescript
// src/app/shared/auth.interceptor.ts
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    let authReq = req;
    if (token) {
      authReq = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    }
    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
}
```

Register in `[app.module.ts](src/app/app.module.ts)`:

```typescript
providers: [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
],
```

## Security (4 Layers)

### Layer 1: Frontend

- AuthGuard on `/admin` route
- AuthInterceptor auto-attaches JWT + handles 401
- Token expiry check on app startup
- No admin UI on public pages

### Layer 2: Server-Side JWT Middleware

```typescript
// server/src/middleware/auth.middleware.ts
async function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ error: 'No token' });

  try {
    const token = header.split('Bearer ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    const user = await prisma.adminUser.findUnique({ where: { id: decoded.id } });
    if (!user) return res.status(401).json({ error: 'User not found' });
    req.user = { id: user.id, email: user.email, name: user.name };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
```

### Layer 3: Input Validation & File Security

- Multer: only `image/jpeg`, `image/png`, `image/webp` allowed
- Multer: max file size 10MB
- Title/category: required, trimmed, max 200 chars
- Express CORS: whitelist only your domain + localhost:4200

### Layer 4: Data Protection

- Passwords: bcrypt 12 salt rounds
- JWT_SECRET: 32+ char random string in Amplify env vars
- S3/DB credentials: server-side only
- HTTPS: Amplify enforces automatically

### Attack Prevention Table


| Attack                              | Protection                   |
| ----------------------------------- | ---------------------------- |
| No token                            | 401                          |
| Tampered token                      | JWT signature check -> 401   |
| Expired token                       | JWT exp check -> 401         |
| Deleted user with cached token      | DB lookup -> 401             |
| SQL injection                       | Prisma parameterized queries |
| XSS via title                       | Input sanitization           |
| Wrong file type                     | Multer filter                |
| Oversized file                      | Multer 10MB limit            |
| CORS bypass                         | Express whitelist            |
| Direct API POST/DELETE from Postman | JWT required -> 401          |


## Dependencies

**Frontend** -- no new npm packages (Angular HttpClient already available)

**Backend (`server/package.json`):**


| Package             | Version | Purpose              |
| ------------------- | ------- | -------------------- |
| express             | latest  | HTTP framework       |
| cors                | latest  | Cross-origin         |
| multer              | latest  | File upload parsing  |
| prisma              | latest  | CLI + migration tool |
| @prisma/client      | latest  | Type-safe DB client  |
| bcryptjs            | latest  | Password hash/verify |
| jsonwebtoken        | latest  | JWT sign/verify      |
| @aws-sdk/client-s3  | latest  | S3 upload/delete     |
| dotenv              | latest  | Env vars             |
| serverless-http     | latest  | Lambda wrapper       |
| typescript          | latest  | Type safety          |
| ts-node             | latest  | Run scripts          |
| @types/express      | latest  | TS types             |
| @types/multer       | latest  | TS types             |
| @types/bcryptjs     | latest  | TS types             |
| @types/jsonwebtoken | latest  | TS types             |


## Environment Variables

**Local dev** (`server/.env` -- gitignored):

```
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
JWT_SECRET=generate-a-random-32-char-string-here
AWS_S3_BUCKET=alok-central-school
AWS_S3_REGION=ap-south-1
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
```

**Production** (Amplify Console > App Settings > Environment Variables -- same keys)

## Setup Steps (one-time)

1. **Supabase**: Create free project at supabase.com (Mumbai region), copy connection string from Settings > Database
2. **Server setup**: `cd server && npm install && npx prisma db push && npx prisma generate`
3. **Seed admin**: `npx ts-node scripts/seed-admin.ts` (creates [admin@alokcentralschool.com](mailto:admin@alokcentralschool.com))
4. **Local dev**: `cd server && npm run dev` (Express on port 3000) + `npm start` (Angular on port 4200)
5. **Amplify**: Set environment variables, connect GitHub repo, deploy
6. **Test**: Login at `/login`, manage at `/admin`, verify public pages clean

## Icon Addition

Add `person` icon to `[src/app/shared/icon/icon.component.ts](src/app/shared/icon/icon.component.ts)` for the login icon:

```typescript
person: 'M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z',
```

## Board Results Feature

### Overview

A public page showing 10th Board exam results for CBSE and RBSE students. Sorted by percentage (toppers first), filtered by year and board, with pagination (10 per page). Admin can add/edit/delete student results with photos.

### Prisma Model

```prisma
model StudentResult {
  id             String    @id @default(uuid())
  name           String                              // Student full name
  fatherName     String    @map("father_name")       // Father's name
  gender         String                              // Male, Female, Other
  percentage     Float                               // e.g. 95.4
  board          String                              // "CBSE" or "RBSE"
  year           Int                                 // e.g. 2026, 2025, 2024
  rollNumber     String?   @map("roll_number")       // Board roll number
  dob            DateTime? @map("dob")               // Date of birth
  admissionNo    String?   @map("admission_no")      // School admission number
  contactNumber  String?   @map("contact_number")    // Optional, never shown publicly
  photoUrl       String?   @map("photo_url")         // S3 URL
  photoKey       String?   @map("photo_key")         // S3 key for deletion
  className      String    @default("10th") @map("class_name")  // Always "10th" for now
  isActive       Boolean   @default(true) @map("is_active")
  createdAt      DateTime  @default(now()) @map("created_at")
  updatedAt      DateTime  @updatedAt @map("updated_at")

  @@map("student_results")
}
```

**Fields displayed publicly:** name, fatherName, gender, percentage, board, year, photo, rollNumber, dob, admissionNo

**Fields NEVER shown publicly:** contactNumber (admin-only, for school records)

**Fields stored for future use:** className (always "10th" now, expandable later)

### Public Page: Board Results (`/results`)

```
┌──────────────────────────────────────────────────┐
│               PAGE HERO (school image)            │
│            "Board Results"                        │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                                                               │
│  ┌──────┐  ┌─────────────────────────────────────────────┐   │
│  │ YEAR │  │                                              │   │
│  │ LIST │  │  [CBSE]  [RBSE]         ← board tabs         │   │
│  │      │  │                                              │   │
│  │ 2026 │◄─│  Showing 85 results for CBSE 2026            │   │
│  │ 2025 │  │  Sorted by percentage (highest first)        │   │
│  │ 2024 │  │                                              │   │
│  │ 2023 │  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐│  │
│  │      │  │  │PHOTO │ │PHOTO │ │PHOTO │ │PHOTO │ │PHOTO ││  │
│  │      │  │  │Name  │ │Name  │ │Name  │ │Name  │ │Name  ││  │
│  │      │  │  │95.4% │ │93.2% │ │91.8% │ │90.5% │ │89.1% ││  │
│  │      │  │  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘│  │
│  │      │  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐│  │
│  │      │  │  │PHOTO │ │PHOTO │ │PHOTO │ │PHOTO │ │PHOTO ││  │
│  │      │  │  │Name  │ │Name  │ │Name  │ │Name  │ │Name  ││  │
│  │      │  │  │88.0% │ │87.5% │ │86.2% │ │85.0% │ │84.3% ││  │
│  │      │  │  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘│  │
│  │      │  │                                              │   │
│  │      │  │  [1] [2] [3] [4] ... [Next]  ← pagination    │   │
│  │      │  │                                              │   │
│  └──────┘  └─────────────────────────────────────────────┘   │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

**Layout details:**

- **Left sidebar**: Year list (vertical), latest year on top, selected year highlighted. On mobile: horizontal scroll tabs at top instead of sidebar
- **Board tabs**: CBSE | RBSE toggle buttons at top of results area. Default: CBSE
- **Student cards**: 5 per row on desktop, 3 on tablet, 2 on mobile. Each shows photo (or avatar fallback) + name + percentage
- **Sorting**: Always by percentage DESC (toppers first)
- **Pagination**: 10 students per page, page numbers + Prev/Next
- **Count**: "Showing 85 results for CBSE 2026" at top

**Click on student card -> Detail popup:**

```
┌──────────────────────────────────┐
│  [X Close]                        │
│                                   │
│  ┌──────────┐                     │
│  │  PHOTO   │  Rahul Sharma       │
│  │ (large)  │  Class: 10th        │
│  └──────────┘  Board: CBSE        │
│                Year: 2026          │
│                                   │
│  ────────────────────────────     │
│  Father's Name:  Rajesh Sharma    │
│  Gender:         Male             │
│  Roll Number:    1234567          │
│  Date of Birth:  15 Mar 2010     │
│  Admission No:   ACS/2020/045    │
│  Percentage:     95.4%           │
│  ────────────────────────────     │
│                                   │
│  ★ School Topper                  │  ← if rank 1
│                                   │
└──────────────────────────────────┘
```

**What is NOT shown in popup:** contactNumber (admin-only field)

**Default behavior:**

1. Page loads -> fetches available years from API -> selects latest year (e.g., 2026)
2. Fetches results for that year + CBSE board, page 1
3. User can switch board tab (RBSE) -> re-fetches
4. User can click a year in sidebar -> re-fetches
5. User can paginate -> fetches next page
6. User clicks student card -> popup with full details (except contact)

### Navbar Update

Add "Results" as a **separate item** in the main navbar (after VIDEOS, before ABOUT):

```
HOME | ADMISSIONS | FACILITIES | GALLERY | VIDEOS | RESULTS | ABOUT▼ | CONTACT | [👤]
                                                      ↑ NEW
```

Remove "10th Board Results" from the ABOUT dropdown (since it now has its own nav item).

Updated `[bs-navbar.component.html](src/app/bs-navbar/bs-navbar.component.html)`:

```html
<!-- Add before ABOUT dropdown -->
<li class="nav-item">
  <a class="nav-link" routerLink="results" routerLinkActive="active-link" (click)="closeMenu()">Results</a>
</li>

<!-- ABOUT dropdown: remove "10th Board Results" -->
<li class="nav-item has-dropdown" (click)="toggleAboutSubmenu($event)">
  <a class="nav-link dropdown-toggle-custom">About</a>
  <ul class="dropdown-menu-custom" [class.open]="isAboutSubmenuOpen">
    <li><a routerLink="about" (click)="closeMenu()">School Info</a></li>
    <li><a routerLink="faculty" (click)="closeMenu()">Our Faculty</a></li>
    <li><a routerLink="cbse" (click)="closeMenu()">CBSE Information</a></li>
  </ul>
</li>
```

### Express API Endpoints

**Results - Public (2):**


| Method | Endpoint             | Auth | Query Params                           | Response                                                     |
| ------ | -------------------- | ---- | -------------------------------------- | ------------------------------------------------------------ |
| GET    | `/api/results/years` | No   | --                                     | `[2026, 2025, 2024]` (distinct years, DESC)                  |
| GET    | `/api/results`       | No   | `year=2026&board=CBSE&page=1&limit=10` | `{ data: [...students], total: 85, page: 1, totalPages: 9 }` |


**Results - Admin (4):**


| Method | Endpoint             | Auth | Request                                 | Response                                       |
| ------ | -------------------- | ---- | --------------------------------------- | ---------------------------------------------- |
| GET    | `/api/admin/results` | JWT  | `?year=&board=&page=&search=`           | ALL results including inactive                 |
| POST   | `/api/results`       | JWT  | multipart: `file?` + all student fields | `{ id, name }` or `401`                        |
| PUT    | `/api/results/:id`   | JWT  | multipart: `file?` + fields to update   | Updated student or `401/404`                   |
| DELETE | `/api/results/:id`   | JWT  | --                                      | `204` (deletes S3 photo + DB row) or `401/404` |


**Server query for public list:**

```typescript
// GET /api/results?year=2026&board=CBSE&page=1&limit=10
const year = parseInt(req.query.year) || new Date().getFullYear();
const board = req.query.board || 'CBSE';
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 10;

const [results, total] = await Promise.all([
  prisma.studentResult.findMany({
    where: { year, board, isActive: true },
    orderBy: { percentage: 'desc' },   // toppers first
    skip: (page - 1) * limit,
    take: limit,
    select: {                          // exclude contactNumber from public API
      id: true, name: true, fatherName: true, gender: true,
      percentage: true, board: true, year: true, rollNumber: true,
      dob: true, admissionNo: true, photoUrl: true, className: true,
      // contactNumber: NOT included
    },
  }),
  prisma.studentResult.count({ where: { year, board, isActive: true } }),
]);

res.json({ data: results, total, page, totalPages: Math.ceil(total / limit) });
```

### Admin Results Management (Dashboard tab)

Admin dashboard gets a **third tab** "Results" alongside Gallery and Faculty:

```
┌──────────────────────────────────────────────────────────────────┐
│  Admin Dashboard                                     [Logout]    │
│                                                                   │
│  [Gallery]  [Faculty]  [Results]                                  │
│  ─────────────────────────────────────────────────────────────── │
│                                                                   │
│  RESULTS TAB:                                                     │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  [+ Add Student Result]                                     │  │
│  │                                                             │  │
│  │  Year: [2026 ▼]  Board: [All ▼]  Search: [________]        │  │
│  │                                                             │  │
│  │  ┌─────┐ Rahul Sharma     CBSE 2026  95.4%   [Edit] [Del]  │  │
│  │  ┌─────┐ Priya Singh      CBSE 2026  93.2%   [Edit] [Del]  │  │
│  │  ┌─────┐ Amit Kumar       RBSE 2026  91.0%   [Edit] [Del]  │  │
│  │  ┌─────┐ Old Student      CBSE 2024  88.5%   [Edit] [Del]  │  │
│  │                                                             │  │
│  │  [1] [2] [3] [Next]                                        │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

**Add/Edit Student Result form:**

```
┌────────────────────────────────────────────┐
│  Add Student Result                [Close]  │
│                                             │
│  Year:           [2026 ▼]      (required)   │
│  Board:          [CBSE ▼]      (required)   │
│  Name:           [__________]  (required)   │
│  Father's Name:  [__________]  (required)   │
│  Gender:         [Male ▼]     (required)    │
│  Percentage:     [__________]  (required)   │
│  Roll Number:    [__________]  (optional)   │
│  Date of Birth:  [__________]  (optional)   │
│  Admission No:   [__________]  (optional)   │
│  Contact Number: [__________]  (optional)   │
│  Photo:          [Upload/Drag] (optional)   │
│                  [Preview]                  │
│                                             │
│          [SAVE]  [CANCEL]                   │
└────────────────────────────────────────────┘
```

**Admin capabilities:**

- **Add student**: Fill form with year, board, name, percentage, optional photo. Photo uploaded to S3 at `results/{year}/{id}.jpg`
- **Edit student**: Pre-filled form, can change any field or replace photo
- **Delete**: Permanent removal with confirmation dialog
- **Filter**: By year dropdown + board dropdown + search by name
- **Pagination**: Admin list also paginated

### Files to Create


| File                                                 | Purpose                                                                                |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `src/app/board-results/board-results.component.ts`   | Public results page (year sidebar, board tabs, student grid, detail popup, pagination) |
| `src/app/board-results/board-results.component.html` | Layout with sidebar + card grid + popup                                                |
| `src/app/board-results/board-results.component.css`  | Responsive styles (sidebar -> horizontal tabs on mobile)                               |
| `src/app/shared/results-api.service.ts`              | Angular service calling `/api/results` endpoints                                       |
| `server/src/routes/results.routes.ts`                | Express routes for results CRUD                                                        |


### Files to Modify


| File                                         | Change                                                                     |
| -------------------------------------------- | -------------------------------------------------------------------------- |
| `server/prisma/schema.prisma`                | Add `StudentResult` model                                                  |
| `src/app/admin/admin.component.`*            | Add Results tab with student management                                    |
| `src/app/bs-navbar/bs-navbar.component.html` | Add "Results" to main nav, remove "10th Board Results" from ABOUT dropdown |
| `src/app/app-routing.module.ts`              | Add `/results` route, update old `/result` to redirect to `/results`       |
| `src/app/app.module.ts`                      | Register BoardResultsComponent                                             |


### Responsive Layout

**Desktop (1200px+):** Year sidebar on left (200px) + results grid on right (5 cards per row)

**Tablet (768-1199px):** Year sidebar on left (160px) + results grid (3 cards per row)

**Mobile (below 768px):** Year tabs as horizontal scroll at top + results grid (2 cards per row)

**Very small (below 480px):** Year tabs + results grid (1 card per row, full width)

### Mobile Layout

```
┌──────────────────────────┐
│  PAGE HERO               │
│  "Board Results"         │
├──────────────────────────┤
│  [2026] [2025] [2024] →  │  ← horizontal scroll
├──────────────────────────┤
│  [CBSE]  [RBSE]          │  ← board tabs
├──────────────────────────┤
│  85 results | CBSE 2026  │
├──────────────────────────┤
│  ┌──────┐  ┌──────┐     │
│  │PHOTO │  │PHOTO │     │
│  │Name  │  │Name  │     │
│  │95.4% │  │93.2% │     │
│  └──────┘  └──────┘     │
│  ┌──────┐  ┌──────┐     │
│  │PHOTO │  │PHOTO │     │
│  │Name  │  │Name  │     │
│  │91.8% │  │90.5% │     │
│  └──────┘  └──────┘     │
│  ...                     │
│  [1] [2] [3] [Next]     │
└──────────────────────────┘
```

## Future Extensibility

Add new features by adding to `schema.prisma` + Express routes + Angular components:

```prisma
model Announcement { ... @@map("announcements") }
model Event { ... @@map("events") }
model StudentResult { ... @@map("student_results") }
```

Then: `npx prisma db push` -> add routes -> add component -> done.