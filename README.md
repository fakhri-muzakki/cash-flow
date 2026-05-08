# 💰 Cash Flow Manager - Frontend

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6)](https://www.typescriptlang.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4)](https://tailwindcss.com/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-5.0-FF4154)](https://tanstack.com/query)
[![Zustand](https://img.shields.io/badge/Zustand-5.0-brown)](https://zustand-demo.pmnd.rs/)

> Frontend untuk aplikasi manajemen keuangan pribadi. Catat pemasukan/pengeluaran, lihat grafik tren, filter periode, dan ekspor laporan PDF. Dibangun dengan Next.js 15 App Router, React 19, TypeScript, dan berbagai library modern.

**🔗 Live Demo:** (belum deploy)  
**Backend Repository:** [api-cash-flow](https://github.com/fakhri-muzakki/api-cash-flow)

---

## ✨ Fitur

### 👤 Autentikasi

- Register & Login dengan JWT
- Proteksi route (middleware)
- Zustand persist untuk menyimpan session

### 📊 Manajemen Transaksi (CRUD)

- Tambah pendapatan atau pengeluaran (nominal, catatan, tanggal)
- Edit dan hapus transaksi
- Optimistic update dengan TanStack Query

### 🔍 Filter & Visualisasi

- Filter periode: Hari Ini, Minggu Ini, Bulan Ini, Tahun Ini, atau pilih tanggal custom
- Line chart perbandingan pendapatan vs pengeluaran (Recharts)
- Infinite scroll pada daftar transaksi

### 📄 Ekspor Laporan

- Export ke PDF (tabel transaksi, ringkasan total, periode laporan)
- Menggunakan `@react-pdf/renderer`

### 🎨 UX/UI

- Tema terang/gelap (shadcn/ui + next-themes)
- Notifikasi toast (react-hot-toast)
- Loading skeleton & modal
- Responsif mobile

---

## 🛠️ Tech Stack

| Kategori          | Teknologi                                  |
| ----------------- | ------------------------------------------ |
| Framework         | Next.js 15.5 (App Router, Turbopack)       |
| UI Library        | React 19                                   |
| Styling           | Tailwind CSS 4 + shadcn/ui                 |
| State Management  | Zustand (client) + TanStack Query (server) |
| Form & Validation | React Hook Form + Zod                      |
| Chart             | Recharts                                   |
| PDF Export        | @react-pdf/renderer                        |
| Date Handling     | date-fns                                   |
| Icons             | Lucide React                               |
| HTTP Client       | Fetch API (with TanStack Query)            |

---

## 📁 Folder Structure

```txt
cash-flow/
├── app/
│   ├── (auth)/                     # Login & Register pages
│   │   ├── login/
│   │   └── register/
│   │
│   ├── (customer)/                 # Public & authenticated customer pages
│   │   ├── page.tsx                # Landing page
│   │   └── dashboard/              # Dashboard (main feature)
│   │       ├── components/         # Dashboard-specific components
│   │       ├── type.ts
│   │       └── page.tsx
│   │
│   ├── layout.tsx
│   └── globals.css
│
├── components/                     # Shared reusable components
│   └── ui/                         # shadcn/ui components
│
├── stores/                         # Zustand global stores
│   └── authStore.ts
│
├── lib/                            # Helpers, constants, utilities
│
└── public/                         # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- Backend API running (see [api-cash-flow](https://github.com/fakhri-muzakki/api-cash-flow))

### Installation

```bash
git clone https://github.com/fakhri-muzakki/cash-flow.git
cd cash-flow
npm install
cp .env.example .env.local   # Isi dengan nilai yang sesuai
npm run dev
```

Buka http://localhost:3000

---

## Environment Variables

```conf
NEXT_PUBLIC_API_URL=http://localhost:8080
```

---

## Backend API Integration

Frontend mengharapkan backend dengan endpoint berikut:

| Method | Endpoint                | Keterangan                                               |
| ------ | ----------------------- | -------------------------------------------------------- |
| POST   | `/api/auth/register`    | Registrasi user                                          |
| POST   | `/api/auth/login`       | Login dan mengembalikan JWT                              |
| GET    | `/api/transactions`     | Mengambil daftar transaksi (support pagination & filter) |
| POST   | `/api/transactions`     | Menambahkan transaksi baru                               |
| PUT    | `/api/transactions/:id` | Mengupdate transaksi berdasarkan ID                      |
| DELETE | `/api/transactions/:id` | Menghapus transaksi berdasarkan ID                       |

Query params untuk GET transactions:

- page & limit → pagination
- period → today, week, month, year, custom
- date_start & date_end → jika period=custom

Response harus mengandung data array dan meta.pagination.

---

## 👨‍💻 Author

Fakhri Muzakki
