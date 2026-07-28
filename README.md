# WorkSync Pro — Sistem Absensi Digital

A full-stack attendance management system built with Next.js 14, Express.js, PostgreSQL, and Prisma ORM. Features geo-fenced check-in/out with selfie capture, leave management, role-based dashboards, and report exports.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14 (App Router), TypeScript, Tailwind CSS v3, Zustand, Axios |
| **Backend** | Express.js, TypeScript, Prisma ORM, JWT, Multer |
| **Database** | PostgreSQL |
| **Auth** | JWT (access token, 24h expiry), role-based (admin / employee) |
| **Geofencing** | Haversine formula — validates GPS within 100m office radius |
| **Design System** | Google Stitch "ProTrack Attendance" spec (Custom Tailwind theme with Inter, Manrope, JetBrains Mono + Material Symbols) |

---

## Features

- **Authentication** — Login / Register with JWT; role-based access control
- **Geo-fenced Attendance** — Check-in & check-out with camera selfie + GPS location verification (100m radius)
- **Leave Management** — Submit leave requests (sick, annual, personal, unpaid, maternity) with file attachment; admin approval workflow
- **Admin Dashboard** — Real-time stats cards, weekly attendance chart, activity feed
- **Employee Dashboard** — Live clock, today's status, monthly summary, recent history
- **Reports** — Filterable attendance report table with PDF (print) & XLS export
- **Settings** — Change username & password
- **Mobile-first** — Responsive layout with bottom navigation on mobile & sidebar on desktop

---

## Project Structure

```
absen/
├── backend/                      # Express.js API server
│   ├── prisma/
│   │   ├── schema.prisma         # Database schema (User, Office, Attendance, LeaveRequest)
│   │   └── migrations/           # Prisma migration files
│   ├── src/
│   │   ├── index.ts              # Express server entry point
│   │   ├── seed.ts               # Database seeder (admin + 4 employees + sample data)
│   │   ├── controllers/          # Route handlers
│   │   │   ├── authController.ts
│   │   │   ├── attendanceController.ts
│   │   │   ├── leaveController.ts
│   │   │   └── adminController.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts           # JWT authentication & role authorization
│   │   │   └── upload.ts         # Multer file upload config
│   │   ├── routes/
│   │   │   ├── authRoutes.ts
│   │   │   ├── attendanceRoutes.ts
│   │   │   ├── leaveRoutes.ts
│   │   │   └── adminRoutes.ts
│   │   └── utils/
│   │       ├── token.ts          # JWT sign/verify
│   │       └── geofencing.ts     # Haversine distance calculation
│   ├── uploads/                  # Uploaded selfies & attachments
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                     # Next.js 14 client
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx        # Root layout (fonts, metadata)
│   │   │   ├── globals.css       # Tailwind directives & global styles
│   │   │   ├── page.tsx          # Home redirect
│   │   │   ├── login/            # Login / Register page
│   │   │   ├── attendance/       # Check-in / Check-out (camera + GPS)
│   │   │   ├── settings/         # Change username & password
│   │   │   ├── admin/
│   │   │   │   ├── layout.tsx     # Admin layout (Navbar + Sidebar + BottomNav)
│   │   │   │   ├── dashboard/    # Admin dashboard (stats, chart, activity)
│   │   │   │   ├── attendance/   # All attendance logs table
│   │   │   │   ├── leaves/       # Leave approval management
│   │   │   │   └── reports/      # Reports with PDF & XLS export
│   │   │   └── employee/
│   │   │       ├── layout.tsx     # Employee layout
│   │   │       ├── dashboard/    # Employee home (clock, summary, history)
│   │   │       ├── history/      # Personal attendance history
│   │   │       └── leave/        # Leave request form + my requests
│   │   ├── components/
│   │   │   ├── layout/           # Navbar, Sidebar, BottomNav
│   │   │   ├── ui/               # Button, Card, Input, Modal, StatusBadge
│   │   │   ├── AttendanceChart.tsx
│   │   │   ├── ActivityFeed.tsx
│   │   │   ├── CameraCapture.tsx
│   │   │   ├── LiveClock.tsx
│   │   │   └── LocationMap.tsx
│   │   ├── lib/
│   │   │   ├── api.ts            # Axios instance with JWT interceptor
│   │   │   └── auth.ts           # localStorage helpers
│   │   ├── store/
│   │   │   └── attendanceStore.ts # Zustand global state
│   │   └── types/
│   │       └── index.ts          # TypeScript interfaces
│   ├── .env.example
│   ├── tailwind.config.ts
│   ├── next.config.js
│   ├── package.json
│   └── tsconfig.json
│
└── README.md
```

---

## Prerequisites

- **Node.js** v18+
- **PostgreSQL** v14+
- **npm** v9+

---

## Setup

### 1. Clone & Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment Variables

**Backend** — `backend/.env`:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/absen_db?schema=public"
JWT_SECRET="your-super-secret-key-change-in-production"
JWT_EXPIRES_IN="24h"
PORT=5000
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE=5242880
```

**Frontend** — `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Database Setup

```bash
cd backend

# Create the database (if it doesn't exist)
createdb absen_db

# Run migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# Seed sample data
npm run prisma:seed
```

### 4. Run Development Servers

```bash
# Terminal 1 — Backend (port 5000)
cd backend
npm run dev

# Terminal 2 — Frontend (port 3000)
cd frontend
npm run dev
```

Open **http://localhost:3000**.

---

## Seed Accounts

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |
| Employee | `employee1` | `employee123` |
| Employee | `employee2` | `employee123` |
| Employee | `employee3` | `employee123` |
| Employee | `employee4` | `employee123` |

---

## API Endpoints

Base URL: `http://localhost:5000/api`

### Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Server status |

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/register` | — | Register new employee |
| `POST` | `/api/auth/login` | — | Login, returns JWT |
| `POST` | `/api/auth/logout` | ✓ | Logout |
| `GET` | `/api/auth/me` | ✓ | Current user profile |
| `PUT` | `/api/auth/profile` | ✓ | Update username / fullName / email |
| `PUT` | `/api/auth/password` | ✓ | Change password (old + new) |

### Attendance

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/attendance/check-in` | ✓ | Check in (multipart: photo, lat, lng) |
| `POST` | `/api/attendance/check-out` | ✓ | Check out (multipart: photo, lat, lng) |
| `GET` | `/api/attendance/history` | ✓ | Paginated history (query: page, limit, month, year) |
| `GET` | `/api/attendance/today` | ✓ | Today's attendance status |

### Leave Requests

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/leaves/request` | ✓ | Submit leave request (multipart) |
| `GET` | `/api/leaves/my` | ✓ | My leave requests |

### Admin

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/admin/dashboard` | Admin | Dashboard stats & weekly chart |
| `GET` | `/api/admin/reports` | Admin | Filtered attendance reports |
| `GET` | `/api/admin/leaves/pending` | Admin | Pending leave requests |
| `PUT` | `/api/admin/leaves/:id/process` | Admin | Approve / reject leave |
| `GET` | `/api/admin/users` | Admin | All users |
| `GET` | `/api/admin/offices` | Admin | All offices |

---

## Scripts

### Backend

| Script | Command |
|--------|---------|
| `npm run dev` | Start dev server with hot-reload |
| `npm run build` | Compile TypeScript |
| `npm start` | Start production server |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:migrate` | Run pending migrations |
| `npm run prisma:seed` | Seed database with sample data |

### Frontend

| Script | Command |
|--------|---------|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

---

## Design System

The UI follows the **Google Stitch "ProTrack Attendance"** design specification:

- **Colors**: Primary green (`#1D6F42`), Error red (`#B42318`), Surface system with container elevation hierarchy
- **Typography**: Inter (body), Manrope (headline), JetBrains Mono (data/numbers)
- **Icons**: Material Symbols (Outlined)
- **Components**: Cards, Buttons, Badges, Modals with consistent Material 3-style theming

Configuration in `frontend/tailwind.config.ts`.

---

## Deployment

### Recommended Architecture

| Component | Platform |
|-----------|----------|
| **Frontend** | Vercel |
| **Backend** | Railway / Render / Fly.io |
| **Database** | Neon / Supabase / Railway PostgreSQL |
| **File Uploads** | Cloudinary / AWS S3 (replace local uploads/) |

### Deployment Steps

1. Set the database to a cloud PostgreSQL provider.
2. Deploy backend to Railway/Render — set all env vars; update CORS `FRONTEND_URL` to your domain.
3. Deploy frontend to Vercel — set `NEXT_PUBLIC_API_URL` to the backend URL.
4. For file uploads, replace `multer` local storage with cloud storage (e.g., `multer-s3`).
