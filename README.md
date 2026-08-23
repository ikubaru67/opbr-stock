# OPBR Account Stock Website

## Setup

### 1. Database (Vercel Postgres)
- Deploy ke Vercel dulu
- Add Vercel Postgres integration → dapat DATABASE_URL
- Set DATABASE_URL di Vercel Environment Variables

Atau buat manual di [Neon](https://neon.tech) (free 500MB):
```bash
# Set DATABASE_URL di .env.local
DATABASE_URL="postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/dbname"
```

### 2. Install & Run
```bash
npm install
npx prisma db push    # sync schema ke DB
npm run seed           # seed karakter + admin (admin:admin123)
npm run dev
```

### 3. Environment Variables
Buat `.env.local`:
```
DATABASE_URL="postgresql://..."
JWT_SECRET="your-random-secret"
CRON_API_KEY="random-key-for-cron-auth"
```

### 4. Admin Login
- Buka `/admin/login`
- Username: `admin`, Password: `admin123`
- Ganti password setelah login pertama

### 5. Sync Data
- Klik "Sync Shokan" / "Sync OPBR Store" di halaman admin
- Atau via cron (GitHub Actions): set `VERCEL_URL` dan `CRON_API_KEY` di GitHub Secrets

## Deploy ke Vercel

1. Push ke GitHub
2. Import ke Vercel
3. Add Vercel Postgres integration
4. Set `JWT_SECRET` dan `CRON_API_KEY` di Environment Variables
5. Deploy
6. Buka terminal Vercel: `npx prisma db push && npm run seed`
