![header](https://capsule-render.vercel.app/api?type=waving&height=300&color=6F4E37&text=Library%20Of%20Tenizen&section=header&reversal=false&fontColor=000000&fontSize=66)

# 📚 LibraryOfTenizen
Library Of Tenizen (LOT) adalah platform perpustakaan digital modern yang dirancang khusus untuk lingkungan sekolah. Sistem ini menyediakan solusi komprehensif untuk manajemen perpustakaan dan peminjaman buku digital.

## 🛠️Fitur
- Member :
    - Register = Siswa/i dapat membuat akun yang akan terdaftar sebagai member supaya dapat melihat-lihat buku yang ingin dipinjam di perpustakaan
    - Login = Siswa/i dapat Login ke dalam akun yang iya buat untuk dapat masuk ke Library Of Tenizen
    - Searching = Siswa/i dapat mencari buku dengan genre atau tema yang ia inginkan
    - List Buku = Siswa/i dapat melihat buku apa saja yang tersedia
    - Status Buku = Siswa/i dapat melihat apakah buku tersedia atau tidak
    - Detail Buku = Siswa/i dapat melihat apakah buku yang ia ingin pinjam sesuai dengan keinginannya serta dapat melihat detail lain dari Buku
    - Category = Siswa/i dapat melihat buku yang direkomendasikan sesuai dengan kategori atau tema buku tersebut
    - Popular =  Siswa/i dapat melihat buku apa saja yang sering dipinjam oleh siswa lain

 -Admin :
     - Kontrol Member = Admin dapat mengelola akun member yang dibuat
     - List Buku = Admin dapat melihat buku apa saja yang tersedia 
     - Status Buku = Admin dapat melihat apakah buku tersedia atau tidak
     - Detail Buku = Admin dapat melihat detail lain dari Buku, Serta dapat mengubahnya
     - Kontrol Daftar Buku = Admin dapat mengelola atau mengubah Daftar Buku
     - Kontrol Peminjaman = Admin dapat mengontrol serta mengelola peminjaman buku
     

## 🛠️ Teknologi yang Digunakan
-
-
-
-
-

### Frontend
- React.js 18
- Vite
- Tailwind CSS
- React Router DOM
- Axios

### Backend
- PHP(Laravel)
- Database (MySQL)

## 🚀 Panduan Instalasi & Penggunaan
### 🖥️ Instalasi & Menjalankan Frontend
    cd frontend
    npm install
    npm run dev
    # Akses http://localhost:5173

### 🗄️ Instalasi & Menjalankan Backend
    cd backend
    composer install
    cp .env.example .env
    php artisan key:generate
#### Konfigurasi .env
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=library_tenizen
    DB_USERNAME=your_username
    DB_PASSWORD=your_password
#### jalankan migration dan server
    php artisan migrate
    php artisan serve
    # Akses http://localhost:8000

## LINK FIGMA
    https://www.figma.com/design/W53Vmh77YxJOwXaeXIWGwb/Untitled?node-id=0-1&p=f&t=xATjnpj9Te8KRbSR-0

Library Of Tenizen - ✨ Membangun Generasi Cerdas Melalui Literasi Digital! 📖
