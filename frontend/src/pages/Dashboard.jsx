import React, { useState, useEffect, useCallback } from 'react';
import { Home, Book, List, LogOut, Menu, X, Search, BookOpen, GraduationCap, Heart, TrendingUp, Users, ArrowRight } from 'lucide-react';

// ===============================================
// API Configuration & Data Setup
// ===============================================

// *** GANTI DENGAN BASE URL API NYATA ANDA ***
const API_BASE_URL = "http://127.0.0.1:8000/api";
const BOOKS_API_URL = `${API_BASE_URL}/books`;

const categoryMap = {
    // Sesuaikan mapping ini dengan ID kategori di database Laravel Anda
    2: 'psychology',
    3: 'nonfiction',
    4: 'fantasy',
    5: 'detective', 
    6: 'drama',    
    7: 'drama',    
    8: 'fantasy', 
    9: 'nonfiction' 
};

const categories = [
    { id: 'all', name: 'Semua', icon: BookOpen },
    { id: 'fantasy', name: 'Fantasi', icon: Book },
    { id: 'drama', name: 'Drama', icon: Heart },
    { id: 'detective', name: 'Detektif', icon: Search },
    { id: 'education', name: 'Edukasi', icon: GraduationCap },
    { id: 'psychology', name: 'Psikologi', icon: Users },
    { id: 'business', name: 'Bisnis', icon: TrendingUp },
    { id: 'nonfiction', name: 'Nonfiksi', icon: BookOpen }
];

const allMenuItems = [
    { id: 'home', name: 'Beranda', icon: Home, roles: ['admin', 'member', 'guest'] },
    { id: 'books', name: 'Daftar Buku', icon: Book, roles: ['admin', 'member', 'guest'] },
    { id: 'borrowing', name: 'Peminjaman', icon: List, roles: ['admin', 'member'] }
];

const COVER_STYLES = [
    'linear-gradient(to bottom right, #E8D1A7, #442D1C)', 
    'linear-gradient(to bottom right, #2dd4bf, #06b6d4)', 
    'linear-gradient(to bottom right, #1f2937, #111827)', 
    'linear-gradient(to bottom right, #059669, #10b981)', 
    'linear-gradient(to bottom right, #a855f7, #ec4899)', 
];

const getBookCoverStyle = (id) => {
    return COVER_STYLES[id % COVER_STYLES.length];
};

// ===============================================
// DASHBOARD COMPONENT (Berisi UI utama)
// ===============================================

const DashboardContent = ({ userData, userToken, handleLogout, isError, setIsError }) => {
    // State untuk UI/Navigasi
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState('books'); 
    const [selectedCategory, setSelectedCategory] = useState('all');

    // State untuk Data
    const [books, setBooks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const menuItems = allMenuItems.filter(item => item.roles.includes(userData.role));

    // Logika Fetch Books
    const fetchBooks = useCallback(async () => {
        setIsLoading(true);
        setIsError(null);

        try {
            const response = await fetch(BOOKS_API_URL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // Mengirim token ke route yang terproteksi oleh 'auth:sanctum'
                    ...(userToken && { 'Authorization': `Bearer ${userToken}` }) 
                }
            });

            if (!response.ok) {
                // Jika server merespons 401 Unauthorized, anggap token kedaluwarsa
                if (response.status === 401) {
                    throw new Error("Token kedaluwarsa atau tidak valid. Silakan login kembali.");
                }
                const errorData = await response.json().catch(() => ({ message: 'Kesalahan jaringan.' }));
                throw new Error(`Gagal mengambil data: ${response.status} ${errorData.message || response.statusText}`);
            }

            const apiData = await response.json();

            // PENTING: Sesuaikan pemetaan data ini dengan output API Laravel Anda
            if (apiData.status || (apiData.data && Array.isArray(apiData.data))) {
                const processedBooks = apiData.data.map((book, index) => ({
                    id: book.id,
                    title: book.author, // Menggunakan author sebagai title cover
                    subtitle: book.title, // Menggunakan title sebagai subtitle cover
                    cover: getBookCoverStyle(book.id), 
                    category: categoryMap[book.category_id] || 'nonfiction', 
                    // Simulasi featured, ganti dengan data API nyata jika tersedia
                    featured: index < 3, 
                    stock: book.stock
                }));

                setBooks(processedBooks);
            } else {
                throw new Error(apiData.message || "Struktur respons API tidak valid.");
            }

        } catch (error) {
            console.error("Error fetching books:", error);
            setIsError(`Terjadi kesalahan saat memuat data buku: ${error.message}.`);
            setBooks([]);
        } finally {
            setIsLoading(false);
        }
    }, [userToken, setIsError]); 

    // Panggil fetchBooks saat userToken berubah (login berhasil)
    useEffect(() => {
        if (userToken) {
            fetchBooks();
        }
        // Jika token null (guest), kita tetap bisa memuat buku jika API /books tidak terproteksi
        // Tapi di sini kita asumsikan /books terproteksi atau menampilkan data terbatas untuk guest
        // Kita hanya fetch jika ada token agar menghindari error 401 berulang
        if (!userToken) {
            setIsLoading(false);
            setBooks([]);
        }

    }, [userToken, fetchBooks]);

    const filteredBooks = selectedCategory === 'all'
        ? books
        : books.filter(book => book.category === selectedCategory);

    // Helper untuk rendering konten berdasarkan menu yang aktif
    const renderContent = () => {

        // --- Loading State ---
        if (isLoading) {
            return (
                <div className="text-center p-12 bg-white rounded-3xl shadow-xl">
                    <div className="animate-spin inline-block w-8 h-8 border-4 border-t-4 border-amber-500 border-opacity-25 rounded-full mb-4"></div>
                    <p className="text-lg font-medium text-gray-700">Memuat Buku...</p>
                </div>
            );
        }

        // --- Tampilan Daftar Buku ---
        if (activeMenu === 'books') {
            return (
                <>
                    {/* Pesan Error/Peringatan Diletakkan di sini */}
                    {isError && (
                        <div className="p-4 mb-6 bg-red-100 border border-red-300 text-red-800 rounded-xl font-medium">
                            <p>⚠️ Kesalahan API: {isError}</p>
                            <p className="text-sm">Pastikan **`API_BASE_URL`** Anda sudah benar, API sudah berjalan, dan token Anda valid.</p>
                        </div>
                    )}

                    <div className="bg-white rounded-3xl shadow-xl p-6 lg:p-8">
                        <h2 className="text-2xl lg:text-3xl font-bold mb-6" style={{ color: '#442D1C' }}>Semua Buku ({filteredBooks.length})</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 lg:gap-6">
                            {filteredBooks.length > 0 ? (
                                filteredBooks.map(book => (
                                    <div key={book.id} className="group cursor-pointer">
                                        <div 
                                            className="rounded-xl shadow-md aspect-[3/4] p-3 lg:p-4 flex flex-col justify-end transform group-hover:scale-105 group-hover:shadow-xl transition-all duration-300"
                                            style={{ background: book.cover }}
                                        >
                                            <div className="text-white">
                                                <p className="text-xs opacity-90 mb-1">{book.title}</p>
                                                <h4 className="text-sm font-bold">{book.subtitle}</h4>
                                                <p className="text-xs opacity-70 mt-1">Stok: {book.stock}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 col-span-full">Tidak ada buku yang ditemukan. Coba ganti kategori atau periksa koneksi API Anda.</p>
                            )}
                        </div>
                    </div>
                </>
            );
        }
        
        if (activeMenu === 'home') {
            const featuredBooks = filteredBooks.filter(b => b.featured).slice(0, 4); 
            const interestingBooks = filteredBooks.filter(b => !b.featured);

            return (
                <>
                    {isError && (
                         <div className="p-4 mb-6 bg-red-100 border border-red-300 text-red-800 rounded-xl font-medium">
                            <p>⚠️ Kesalahan API: {isError}</p>
                            <p className="text-sm">Pastikan **`API_BASE_URL`** Anda sudah benar, API sudah berjalan, dan token Anda valid.</p>
                        </div>
                    )}

                    {/* Categories */}
                    <div className="mb-8">
                        <div className="flex gap-3 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-full whitespace-nowrap font-medium transition-all ${
                                        selectedCategory === cat.id
                                            ? 'text-white shadow-lg'
                                            : 'bg-white text-gray-600 hover:bg-orange-50'
                                    }`}
                                    style={selectedCategory === cat.id ? { background: 'linear-gradient(90deg, #E8D1A7, #442D1C)' } : {}}
                                >
                                    <cat.icon className="w-4 h-4" />
                                    <span>{cat.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Hero Section */}
                    <div className="bg-white rounded-3xl shadow-xl p-6 lg:p-8 mb-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-30" style={{ background: 'linear-gradient(135deg, #fde68a, #fed7aa)' }}></div>
                        <div className="relative z-10">
                            <h2 className="text-3xl lg:text-5xl font-bold mb-4 leading-tight" style={{ color: '#442D1C' }}>
                                {userData.role === 'guest' ? 'SILAKAN LOGIN' : 'POPULAR'}
                                <br />
                                {userData.role === 'guest' ? 'Akses Penuh' : 'BESTSELLERS'}
                            </h2>
                            <p className="text-gray-600 mb-6 max-w-md">
                                {userData.role === 'guest' ? 'Anda masuk sebagai Tamu. Login untuk melihat fitur peminjaman.' : `Selamat datang kembali, ${userData.name}! Berikut buku terbaik yang direkomendasikan untuk Anda.`}
                            </p>
                            <button 
                                onClick={() => setActiveMenu('books')}
                                className="px-8 py-4 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all" 
                                style={{ background: 'linear-gradient(90deg, #E8D1A7, #442D1C)' }}
                            >
                                Lihat Daftar Lengkap
                            </button>
                        </div>
                    </div>

                    {/* Featured Books */}
                    <h3 className="text-xl font-semibold mb-4" style={{ color: '#442D1C' }}>Pilihan Unggulan ({featuredBooks.length})</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
                        {featuredBooks.map(book => (
                            <div key={book.id} className="group cursor-pointer">
                                <div 
                                    className="rounded-2xl shadow-lg aspect-[3/4] p-4 lg:p-6 flex flex-col justify-end transform group-hover:scale-105 group-hover:shadow-2xl transition-all duration-300"
                                    style={{ background: book.cover }}
                                >
                                    <div className="text-white">
                                        <p className="text-xs lg:text-sm opacity-90 mb-1">{book.title}</p>
                                        <h3 className="text-base lg:text-xl font-bold">{book.subtitle}</h3>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Can Be Interesting Section */}
                    <div className="bg-white rounded-3xl shadow-xl p-6 lg:p-8">
                        <h3 className="text-2xl lg:text-3xl font-bold mb-4 lg:mb-6 leading-tight" style={{ color: '#442D1C' }}>
                            MUNGKIN MENARIK<br />BAGI ANDA ({interestingBooks.length})
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6">
                            {interestingBooks.map(book => (
                                <div key={book.id} className="group cursor-pointer">
                                    <div 
                                        className="rounded-xl shadow-md aspect-[3/4] p-3 lg:p-4 flex flex-col justify-end transform group-hover:scale-105 group-hover:shadow-xl transition-all duration-300"
                                        style={{ background: book.cover }}
                                    >
                                        <div className="text-white">
                                            <p className="text-xs opacity-90 mb-1">{book.title}</p>
                                            <h4 className="text-sm font-bold">{book.subtitle}</h4>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            );
        }

        if (activeMenu === 'borrowing') {
            if (userData.role === 'guest') {
                 return (
                     <div className="text-center p-12 bg-white rounded-3xl shadow-xl">
                         <X className="w-12 h-12 text-red-500 mx-auto mb-4" />
                         <p className="text-xl font-bold text-red-700 mb-2">Akses Ditolak</p>
                         <p className="text-gray-600">Anda perlu masuk sebagai anggota (member) untuk melihat riwayat peminjaman.</p>
                     </div>
                 );
            }
            
            // Data riwayat peminjaman mock (Harusnya di-fetch dari /api/borrowing)
            const mockBorrowings = [
                { id: 1, title: 'Atomic Habits', borrowDate: '01 Okt 2025', returnDate: '08 Okt 2025', status: 'Dipinjam', statusClass: 'bg-green-100 text-green-700' },
                { id: 2, title: 'The Subtle Art of Not Giving a F*ck', borrowDate: '25 Sep 2025', returnDate: '02 Okt 2025', status: 'Dikembalikan', statusClass: 'bg-blue-100 text-blue-700' },
                { id: 3, title: 'Sapiens: A Brief History of Humankind', borrowDate: '15 Okt 2025', returnDate: '22 Okt 2025', status: 'Terlambat', statusClass: 'bg-red-100 text-red-700' },
            ];

            return (
                <div className="bg-white rounded-3xl shadow-xl p-6 lg:p-8">
                    <h2 className="text-2xl lg:text-3xl font-bold mb-6" style={{ color: '#442D1C' }}>Riwayat Peminjaman {userData.name}</h2>
                    <div className="overflow-x-auto">
                        {/* PENTING: Untuk data nyata, Anda perlu fetch dari /api/borrowing dengan token */}
                        <p className="mb-4 text-sm text-gray-600">⚠️ Catatan: Data di bawah ini masih *mock* dan harus dihubungkan ke endpoint **`/api/borrowing`** Anda.</p>
                        <table className="w-full">
                            <thead>
                                <tr style={{ borderBottom: '2px solid #E8D1A7' }}>
                                    <th className="text-left py-4 px-4 font-semibold text-sm" style={{ color: '#442D1C' }}>No</th>
                                    <th className="text-left py-4 px-4 font-semibold text-sm" style={{ color: '#442D1C' }}>Judul Buku</th>
                                    <th className="text-left py-4 px-4 font-semibold text-sm" style={{ color: '#442D1C' }}>Tanggal Pinjam</th>
                                    <th className="text-left py-4 px-4 font-semibold text-sm" style={{ color: '#442D1C' }}>Tanggal Kembali</th>
                                    <th className="text-left py-4 px-4 font-semibold text-sm" style={{ color: '#442D1C' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mockBorrowings.map((item, index) => (
                                    <tr key={item.id} className="border-b hover:bg-orange-50 transition-colors">
                                        <td className="py-4 px-4 text-sm">{index + 1}</td>
                                        <td className="py-4 px-4 font-medium text-sm">{item.title}</td>
                                        <td className="py-4 px-4 text-sm">{item.borrowDate}</td>
                                        <td className="py-4 px-4 text-sm">{item.returnDate}</td>
                                        <td className="py-4 px-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${item.statusClass}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            );
        }

        return null;
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 font-sans">
            {/* Sidebar */}
            <aside 
                className={`fixed top-0 left-0 h-full w-64 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } lg:translate-x-0`}
            >
                <div className="flex flex-col h-full">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #E8D1A7, #442D1C)' }}>
                                    <Book className="w-5 h-5 text-white" />
                                </div>
                                <h1 className="text-2xl font-bold" style={{ color: '#442D1C' }}>LoT</h1>
                            </div>
                            <button 
                                onClick={() => setSidebarOpen(false)} 
                                className="lg:hidden p-1 hover:bg-gray-100 rounded-lg transition-colors"
                                aria-label="Tutup sidebar"
                            >
                                <X className="w-6 h-6" style={{ color: '#442D1C' }} />
                            </button>
                        </div>

                        <nav className="space-y-2">
                            {menuItems.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        setActiveMenu(item.id);
                                        setSidebarOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                                        activeMenu === item.id 
                                            ? 'text-white shadow-lg' 
                                            : 'text-gray-600 hover:bg-orange-50'
                                    }`}
                                    style={activeMenu === item.id ? { background: 'linear-gradient(90deg, #E8D1A7, #442D1C)' } : {}}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span>{item.name}</span>
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="mt-auto p-6">
                        <button 
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all font-medium"
                        >
                            <LogOut className="w-5 h-5" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Overlay */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <div className="lg:ml-64">
                {/* Header */}
                <header className="bg-white shadow-md sticky top-0 z-30">
                    <div className="flex items-center gap-4 px-4 lg:px-8 py-4">
                        <button 
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 hover:bg-orange-50 rounded-lg transition-colors"
                            aria-label="Buka sidebar"
                        >
                            <Menu className="w-6 h-6" style={{ color: '#442D1C' }} />
                        </button>

                        {/* Search Bar */}
                        <div className="flex-1 max-w-2xl">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Cari nama buku atau penulis..."
                                    className="w-full pl-12 pr-4 py-3 rounded-full bg-gray-50 border-2 border-transparent focus:border-amber-400 focus:bg-white transition-all outline-none text-sm"
                                />
                            </div>
                        </div>

                        {/* User Profile */}
                        <div className="flex items-center gap-3 bg-orange-50 px-4 py-2 rounded-full cursor-pointer hover:bg-orange-100 transition-all">
                            <div className="w-10 h-10 rounded-full object-cover border-2 border-amber-300 flex items-center justify-center font-bold text-lg" 
                                style={{ backgroundColor: '#FACC15', color: '#442D1C' }}
                            >
                                {userData.name[0].toUpperCase()}
                            </div>
                            <div className="hidden md:block">
                                <p className="font-semibold text-sm" style={{ color: '#442D1C' }}>{userData.name}</p>
                                <p className="text-xs text-gray-500 capitalize">{userData.role}</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="p-4 lg:p-8">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

// ===============================================
// LOGIN SCREEN COMPONENT
// ===============================================

const LoginScreen = ({ handleLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginAs, setLoginAs] = useState('member'); // default

    const handleSubmit = (e) => {
        e.preventDefault();
        // Memanggil fungsi login dari App, meneruskan peran yang dipilih
        handleLogin(loginAs, username, password); 
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 p-4 font-sans">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 lg:p-10 transform hover:scale-[1.01] transition-transform duration-300">
                <div className="flex items-center gap-3 justify-center mb-6">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #E8D1A7, #442D1C)' }}>
                        <Book className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold" style={{ color: '#442D1C' }}>Perpustakaan Online</h1>
                </div>
                <p className="text-center text-gray-500 mb-8">Masuk untuk mendapatkan akses penuh ke koleksi buku.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Input Username */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-amber-500 focus:border-amber-500 transition-all outline-none"
                            placeholder="username@email.com"
                            required
                        />
                    </div>
                    
                    {/* Input Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-amber-500 focus:border-amber-500 transition-all outline-none"
                            placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
                            required
                        />
                    </div>

                    {/* Role Selector (Simulasi untuk membedakan dashboard) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Login Sebagai (Simulasi)</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 p-3 bg-orange-50 rounded-xl cursor-pointer">
                                <input
                                    type="radio"
                                    name="loginAs"
                                    value="member"
                                    checked={loginAs === 'member'}
                                    onChange={() => setLoginAs('member')}
                                    className="text-amber-500 focus:ring-amber-500"
                                />
                                <span className="font-medium text-gray-700">Anggota (Member)</span>
                            </label>
                            <label className="flex items-center gap-2 p-3 bg-orange-50 rounded-xl cursor-pointer">
                                <input
                                    type="radio"
                                    name="loginAs"
                                    value="admin"
                                    checked={loginAs === 'admin'}
                                    onChange={() => setLoginAs('admin')}
                                    className="text-amber-500 focus:ring-amber-500"
                                />
                                <span className="font-medium text-gray-700">Admin</span>
                            </label>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 px-8 py-3 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300" 
                        style={{ background: 'linear-gradient(90deg, #E8D1A7, #442D1C)' }}
                    >
                        Masuk ke Dashboard <ArrowRight className="w-4 h-4" />
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Belum punya akun? 
                    <a href="#" className="font-semibold text-amber-600 hover:text-amber-700 ml-1">Daftar di sini</a> 
                    (endpoint: `/api/register`)
                </p>
            </div>
        </div>
    );
};


// ===============================================
// MAIN APPLICATION WRAPPER (Dashboard)
// ===============================================

const Dashboard = () => {
    // State Otentikasi
    const [userToken, setUserToken] = useState(localStorage.getItem('userToken') || null);
    const [userData, setUserData] = useState({ name: 'Tamu', role: 'guest' }); 
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [isError, setIsError] = useState(null);

    // Fungsi untuk mendapatkan detail user (di dunia nyata: hit /api/user)
    const getUserDetailsFromToken = useCallback((token) => {
        // Simulasi: Menguraikan peran dari token string (di dunia nyata: ambil dari respons login)
        if (token === 'mock_admin_token') {
            return { name: 'Admin Perpustakaan', role: 'admin' };
        }
        if (token === 'mock_member_token') {
            return { name: 'Anggota Perpustakaan', role: 'member' };
        }
        return { name: 'Tamu', role: 'guest' };
    }, []);

    // Effect saat dimuat: Cek token dan set userData
    useEffect(() => {
        if (userToken) {
            setUserData(getUserDetailsFromToken(userToken));
        } else {
             setUserData({ name: 'Tamu', role: 'guest' });
        }
        setIsAuthReady(true);
    }, [userToken, getUserDetailsFromToken]);


    // Handler Simulasi Login
    const handleLogin = (role, username, password) => {
        let token;
        let details;

        // *** PENTING: GANTI LOGIKA INI DENGAN PANGGILAN FETCH API KE /api/login ***
        // Logika saat ini hanya simulasi untuk menguji tampilan dashboard
        
        // Contoh struktur fetch nyata:
        /*
        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: username, password })
            });
            const result = await response.json();
            if (response.ok && result.token) {
                token = result.token;
                // Asumsi API mengembalikan role dan name user setelah login
                details = { name: result.user.name, role: result.user.role }; 
            } else {
                throw new Error(result.message || 'Login gagal.');
            }
        } catch (error) {
            setIsError(`Login gagal: ${error.message}`);
            return;
        }
        */

        if (role === 'admin') {
            token = 'mock_admin_token';
            details = { name: 'Admin Perpustakaan', role: 'admin' };
        } else {
            // Member
            token = 'mock_member_token';
            details = { name: 'Anggota Perpustakaan', role: 'member' };
        }

        // 1. Simpan token yang didapat dari respons API
        localStorage.setItem('userToken', token);
        setUserToken(token);
        
        // 2. Set user details
        setUserData(details); 
        setIsError(null);
    };

    // Handler Logout
    const handleLogout = async () => {
        setIsError(null);
        try {
            // Panggilan API ke /api/logout
            if (userToken) {
                const response = await fetch(`${API_BASE_URL}/logout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (!response.ok) {
                    // Log error tapi tetap paksa logout di sisi klien
                    console.error("API Logout gagal:", await response.text());
                }
            }
            
            // 1. Hapus token
            localStorage.removeItem('userToken');
            setUserToken(null);
            
            // 2. Reset state
            setUserData({ name: 'Tamu', role: 'guest' });
            
        } catch (error) {
            console.error("Logout failed:", error);
            // Tetap logout di sisi klien meskipun ada error jaringan
            localStorage.removeItem('userToken');
            setUserToken(null);
            setUserData({ name: 'Tamu', role: 'guest' });
            setIsError("Logout berhasil di sisi klien, namun terjadi error di API server.");
        }
    };

    if (!isAuthReady) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin w-10 h-10 border-4 border-t-4 border-amber-500 rounded-full"></div>
            </div>
        );
    }
    
    // Tampilkan Login Screen jika tidak ada token
    if (!userToken) {
        return <LoginScreen handleLogin={handleLogin} />;
    }

    // Tampilkan Dashboard jika ada token (sudah login)
    return (
        <DashboardContent 
            userData={userData} 
            userToken={userToken}
            handleLogout={handleLogout}
            isError={isError}
            setIsError={setIsError}
        />
    );
};

export default Dashboard;
