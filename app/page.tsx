// app/page.tsx
import {
  ArrowRight,
  Calendar,
  DollarSign,
  Filter,
  PieChart,
  Trash2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col container mx-auto">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-emerald-600" />
            <span className="text-xl font-bold font-sans">CashFlow</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className={buttonVariants({
                variant: "ghost",
                size: "sm",
                className: "font-sans",
              })}
            >
              Login
            </Link>
            <Link
              href="/register"
              className={buttonVariants({ size: "sm", className: "font-sans" })}
            >
              Register
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-32">
          <div className="container">
            <div className="flex flex-col items-center text-center">
              <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium">
                <span className="bg-linear-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                  Kelola Keuangan Jadi Mudah
                </span>
              </div>
              <h1 className="mt-6 max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                Catat Setiap Transaksi,
                <span className="bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  {" "}
                  Kuasai Keuanganmu
                </span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
                Aplikasi pencatatan keuangan pribadi yang membantu Anda
                mengelola pemasukan dan pengeluaran dengan mudah. Lihat kemana
                uang Anda pergi dan kendalikan keuangan dengan lebih baik.
              </p>
              <div className="mt-10 flex flex-wrap gap-4 justify-center">
                <Link
                  href="/register"
                  className={buttonVariants({
                    size: "lg",
                    className: "gap-2 font-sans",
                  })}
                >
                  Mulai Gratis
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="#features"
                  className={buttonVariants({
                    variant: "outline",
                    size: "lg",
                    className: "gap-2 font-sans",
                  })}
                >
                  Lihat Fitur
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Preview */}
        <section className="border-y bg-muted/30 py-12">
          <div className="container">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-emerald-100 p-3 dark:bg-emerald-900/30">
                  <TrendingUp className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="mt-3 text-2xl font-bold">+Rp 5.000.000</div>
                <p className="text-sm text-muted-foreground">
                  Total Pendapatan
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-rose-100 p-3 dark:bg-rose-900/30">
                  <TrendingDown className="h-6 w-6 text-rose-600" />
                </div>
                <div className="mt-3 text-2xl font-bold">-Rp 3.200.000</div>
                <p className="text-sm text-muted-foreground">
                  Total Pengeluaran
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/30">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
                <div className="mt-3 text-2xl font-bold">Rp 1.800.000</div>
                <p className="text-sm text-muted-foreground">Saldo Tersisa</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 md:py-28">
          <div className="container">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Fitur Lengkap untuk
                <span className="text-emerald-600"> Keuanganmu</span>
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Semua yang Anda butuhkan untuk mengelola keuangan pribadi dalam
                satu aplikasi
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 - Catat Pendapatan */}
              <div className="rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
                <div className="rounded-lg w-fit bg-emerald-100 p-2 dark:bg-emerald-900/30">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                </div>
                <h3 className="mt-4 text-xl font-semibold">Catat Pendapatan</h3>
                <p className="mt-2 text-muted-foreground">
                  Tambahkan pemasukan dengan nominal, catatan, dan tanggal.
                  Saldo akan bertambah secara otomatis.
                </p>
                <div className="mt-4 text-sm text-muted-foreground">
                  <code className="rounded bg-muted px-1 py-0.5">
                    + Rp 5.000.000
                  </code>{" "}
                  dari Gaji
                </div>
              </div>

              {/* Feature 2 - Catat Pengeluaran */}
              <div className="rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
                <div className="rounded-lg w-fit bg-rose-100 p-2 dark:bg-rose-900/30">
                  <TrendingDown className="h-5 w-5 text-rose-600" />
                </div>
                <h3 className="mt-4 text-xl font-semibold">
                  Catat Pengeluaran
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Catat setiap pengeluaran dengan detail. Saldo akan berkurang
                  dan keuangan tetap terkontrol.
                </p>
                <div className="mt-4 text-sm text-muted-foreground">
                  <code className="rounded bg-muted px-1 py-0.5">
                    - Rp 150.000
                  </code>{" "}
                  untuk Makan Siang
                </div>
              </div>

              {/* Feature 3 - Update & Delete */}
              <div className="rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
                <div className="rounded-lg w-fit bg-amber-100 p-2 dark:bg-amber-900/30">
                  <Trash2 className="h-5 w-5 text-amber-600" />
                </div>
                <h3 className="mt-4 text-xl font-semibold">Update & Hapus</h3>
                <p className="mt-2 text-muted-foreground">
                  Edit atau hapus transaksi yang sudah dibuat. Saldo akan
                  menyesuaikan secara otomatis.
                </p>
              </div>

              {/* Feature 4 - Kelompok Per Hari */}
              <div className="rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
                <div className="rounded-lg w-fit bg-purple-100 p-2 dark:bg-purple-900/30">
                  <Calendar className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="mt-4 text-xl font-semibold">Ringkasan Harian</h3>
                <p className="mt-2 text-muted-foreground">
                  Lihat semua pengeluaran dan pendapatan yang dikelompokkan per
                  hari untuk analisis Lebih baik.
                </p>
              </div>

              {/* Feature 5 - Filter Waktu */}
              <div className="rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
                <div className="rounded-lg w-fit bg-indigo-100 p-2 dark:bg-indigo-900/30">
                  <Filter className="h-5 w-5 text-indigo-600" />
                </div>
                <h3 className="mt-4 text-xl font-semibold">Filter Waktu</h3>
                <p className="mt-2 text-muted-foreground">
                  Filter transaksi berdasarkan Hari Ini, Minggu Ini, Bulan Ini,
                  atau Tahun Ini dengan mudah.
                </p>
              </div>

              {/* Feature 6 - Pilih Tanggal */}
              <div className="rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
                <div className="rounded-lg w-fit bg-cyan-100 p-2 dark:bg-cyan-900/30">
                  <PieChart className="h-5 w-5 text-cyan-600" />
                </div>
                <h3 className="mt-4 text-xl font-semibold">
                  Cari Berdasarkan Tanggal
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Pilih tanggal spesifik untuk melihat pengeluaran dan
                  pendapatan di hari tersebut secara detail.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t bg-linear-to-br from-emerald-50 to-teal-50 py-16 dark:from-emerald-950/20 dark:to-teal-950/20">
          <div className="container">
            <div className="flex flex-col items-center text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Mulai Kelola Keuanganmu Sekarang
              </h2>
              <p className="mt-4 max-w-2xl text-muted-foreground">
                Bergabunglah dengan ribuan pengguna yang sudah mengatur keuangan
                mereka dengan lebih baik. Gratis dan mudah digunakan.
              </p>
              <Link
                href="/register"
                className={buttonVariants({
                  size: "lg",
                  className: "mt-8 gap-2",
                })}
              >
                Daftar Sekarang
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t py-8">
          <div className="container">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-emerald-600" />
                <span className="text-sm font-medium">KeuanganKu</span>
              </div>
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} © 2026 CashFlow. All rights
                reserved.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
