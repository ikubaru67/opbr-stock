# OPBR Ikubaru — RD Accounts Stock

Website storefront untuk jual-beli akun **One Piece Bounty Rush (OPBR)**, khususnya akun starter / RD (Ready Stock). Buyer bisa browsing stok akun, filter berdasarkan server, karakter extreme, jumlah diamond & gold fragment, lalu order langsung via WhatsApp ke admin.

## Fitur

- **Ready Stock** — daftar akun milik toko yang tersimpan di database. Admin bisa tambah/edit/hapus akun.
- **Custom Request** — pencarian real-time ke vendor eksternal (shokan.org & OPBR vendor API) untuk akun sesuai permintaan buyer: pilih karakter extreme, range gold fragment, dan server.
- **Filter & sortir lengkap** — server (Global/JP, Android/iOS), karakter extreme, diamond, GF, kode akun, dan jumlah karakter extreme (terbanyak/sedikit).
- **Halaman detail akun** per akun (`/account/<kode>`).
- **Dua bahasa** — Indonesia & English, bisa diganti dari header, tersimpan di browser.
- **Panel admin** — login JWT, CRUD akun Ready Stock langsung dari halaman utama.
- **Deteksi karakter extreme otomatis** — daftar karakter extreme diambil dari vendor API dengan fallback ke daftar bawaan.

## Teknologi

| Bagian | Teknologi |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 + TypeScript |
| Styling | Tailwind CSS v4 |
| Database | Neon Postgres + Prisma ORM |
| Auth | JWT (httpOnly cookie) |
| Deployment | Vercel |

## Cara kerja singkat

Akun Ready Stock disimpan di Postgres (model `Account`). Akun Custom Request **tidak** disimpan — hanya hasil pencarian live ke API vendor, diterjemahkan lewat layer mapping (`src/lib/mapping.ts`) yang menyamakan penamaan karakter antara DB. Semua request ke vendor melewati proxy route internal (`/api/proxy/*`), jadi browser tidak pernah kontak langsung ke vendor.
