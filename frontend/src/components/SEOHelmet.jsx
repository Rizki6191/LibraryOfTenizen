import React from 'react';
import { Helmet } from 'react-helmet';

// Komponen reusable untuk SEO metadata
export const SEOHelmet = ({ 
  title, 
  description, 
  keywords, 
  ogTitle, 
  ogDescription,
  canonical 
}) => {
  // Deteksi environment - untuk localhost tidak perlu canonical URL
  const isProduction = process.env.NODE_ENV === 'production';
  const baseUrl = isProduction ? 'https://libraryofteniizen.com' : 'http://localhost:3000';
  
  const defaultDescription = 'Sistem Perpustakaan Digital - Pinjam buku dengan mudah dan kelola peminjaman Anda dalam satu platform';
  const defaultKeywords = 'perpustakaan digital, library, peminjaman buku, digital library, sistem perpustakaan';

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description || defaultDescription} />
      <meta name="keywords" content={keywords || defaultKeywords} />
      <meta name="author" content="LibraryOfTeniizen" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={ogTitle || title} />
      <meta property="og:description" content={ogDescription || description || defaultDescription} />
      <meta property="og:site_name" content="LibraryOfTeniizen" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:title" content={ogTitle || title} />
      <meta property="twitter:description" content={ogDescription || description || defaultDescription} />

      {/* Canonical URL - hanya di production */}
      {isProduction && canonical && <link rel="canonical" href={canonical} />}

      {/* Additional Meta Tags */}
      <meta name="robots" content={isProduction ? "index, follow" : "noindex, nofollow"} />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content="Indonesian" />
    </Helmet>
  );
};

// Helmet untuk halaman Auth (Landing)
export const AuthHelmet = () => (
  <SEOHelmet
    title="LibraryOfTeniizen"
    description="Selamat datang di iPush, sistem perpustakaan digital untuk meminjam buku dengan mudah dan mengelola peminjaman dalam satu platform."
    keywords="perpustakaan digital, ipush, library system, peminjaman buku online, digital library indonesia"
    ogTitle="iPush - Perpustakaan Digital Modern"
    ogDescription="Pinjam buku dengan mudah dan kelola peminjaman Anda dalam satu platform terpadu."
    canonical="https://libraryofteniizen.com"
  />
);

// Helmet untuk halaman Login
export const LoginHelmet = () => (
  <SEOHelmet
    title="Masuk | LibraryOfTeniizen"
    description="Masuk ke akun perpustakaan digital Anda untuk mengakses koleksi buku dan mengelola peminjaman."
    keywords="login perpustakaan, masuk library, login ipush, akses perpustakaan digital"
    ogTitle="Masuk ke Akun - iPush Library"
    ogDescription="Akses akun perpustakaan digital Anda untuk meminjam dan mengelola buku."
    canonical="https://libraryofteniizen.com/login"
  />
);

// Helmet untuk halaman Register
export const RegisterHelmet = () => (
  <SEOHelmet
    title="Daftar Akun | LibraryOfTeniizen"
    description="Daftarkan akun baru untuk mengakses perpustakaan digital dan mulai meminjam buku dengan mudah."
    keywords="daftar perpustakaan, registrasi library, daftar ipush, buat akun perpustakaan"
    ogTitle="Daftar Akun Baru - iPush Library"
    ogDescription="Bergabung dengan perpustakaan digital kami dan nikmati kemudahan meminjam buku."
    canonical="https://libraryofteniizen.com/register"
  />
);

// Helmet untuk halaman Dashboard
export const DashboardHelmet = () => (
  <SEOHelmet
    title="Dashboard | LibraryOfTeniizen"
    description="Kelola koleksi perpustakaan Anda dengan dashboard yang efisien. Pantau status buku, anggota, dan peminjaman dalam satu tempat."
    keywords="dashboard perpustakaan, library management, kelola buku, statistik perpustakaan, manajemen library"
    ogTitle="Dashboard | LibraryOfTeniizen"
    ogDescription="Dashboard lengkap untuk mengelola perpustakaan digital Anda dengan efisien."
    canonical="https://libraryofteniizen.com/dashboard"
  />
);

// Export default untuk kemudahan import
export default {
  SEOHelmet,
  AuthHelmet,
  LoginHelmet,
  RegisterHelmet,
  DashboardHelmet
};