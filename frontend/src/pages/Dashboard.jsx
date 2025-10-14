import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios'; // ⚠️ PERBAIKAN: Import axios asli
import { Home, Book, List, LogOut, Menu, X, Search, BookOpen, GraduationCap, Heart, TrendingUp, Users } from 'lucide-react';
import "../styles/dashboard.css"; 

// ===============================================
// API Configuration & Data Setup
// ===============================================

const API_BASE_URL = "http://127.0.0.1:8000/api";
const BOOKS_API_URL = `${API_BASE_URL}/books`; // ⚠️ API nyata yang akan diakses

// --- Data Tambahan (Tetap) ---
const categoryMap = {
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

const Dashboard = () => {
    // State untuk UI/Navigasi
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState('books'); // Default ke Daftar Buku
    const [selectedCategory, setSelectedCategory] = useState('all');

    // State untuk Data
    const [books, setBooks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(null);
    // Default user: Anggota Perpustakaan
    const [userData, setUserData] = useState({ name: 'Anggota Perpustakaan', role: 'member' }); 

    // Daftar menu yang difilter berdasarkan peran pengguna
    const menuItems = allMenuItems.filter(item => item.roles.includes(userData.role));

    // --- Logika Pengambilan Data Buku Asli ---
    const fetchBooks = useCallback(async () => {
        setIsLoading(true);
        setIsError(null);

        try {
            const token = localStorage.getItem('userToken');
            let currentName = 'Tamu';
            let currentRole = 'guest';

            // Logika Otentikasi & Peran Fleksibel (Simulasi Peran Berdasarkan Token)
            if (token === 'valid_admin_token') {
                currentName = 'Admin Perpustakaan';
                currentRole = 'admin';
                // ⚠️ PESAN PERINGATAN DISESUAIKAN: Data diambil dari API asli.
                setIsError("Simulasi Admin: Token ditemukan. Data diambil dari API books.");
            } else if (token === 'valid_member_token') { 
                currentName = 'Anggota Perpustakaan'; 
                currentRole = 'member';
                // ⚠️ PESAN PERINGATAN DISESUAIKAN: Data diambil dari API asli.
                setIsError("Simulasi Anggota: Token ditemukan. Data diambil dari API books.");
            } else {
                currentName = 'Tamu';
                currentRole = 'guest';
                setIsError("Token tidak ditemukan. Anda berhak melihat data buku."); 
            }

            setUserData({ name: currentName, role: currentRole });
            
            // Panggilan API ke API nyata (http://127.0.0.1:8000/api/books)
            const response = await axios.get(BOOKS_API_URL, {
                headers: {
                    Authorization: `Bearer ${token}` 
                }
            });

            // Asumsi API mengembalikan format { status: true, data: [...] }
            if (response.data && response.data.data) { 
                const apiBooks = response.data.data;
                
                const processedBooks = apiBooks.map((book, index) => ({
                    id: book.id,
                    // Membalik posisi author dan title untuk tampilan cover agar judul lebih besar
                    title: book.author, 
                    subtitle: book.title, 
                    // Gunakan ID buku, bukan index, untuk gaya cover yang lebih konsisten 
                    cover: getBookCoverStyle(book.id), 
                    category: categoryMap[book.category_id] || 'nonfiction', 
                    featured: index < 3, // 3 buku pertama dianggap unggulan
                    stock: book.stock
                }));

                setBooks(processedBooks);
            } else {
                setIsError("Gagal mengambil data buku dari API. Format data tidak sesuai atau status false.");
            }

            // Pengecekan ulang menu aktif (jika peran berubah)
            const availableMenus = allMenuItems.filter(item => item.roles.includes(currentRole));
            if (!availableMenus.some(item => item.id === activeMenu)) {
                setActiveMenu('home');
            }

        } catch (error) {
            console.error("Error fetching books:", error);
            // ⚠️ PESAN ERROR DISESUAIKAN untuk koneksi API
            setIsError(`Terjadi kesalahan saat memuat data: ${error.message}. Pastikan API server berjalan di ${API_BASE_URL}.`);
            setBooks([]); // Kosongkan buku jika gagal
        } finally {
            setIsLoading(false);
        }
    }, [activeMenu]); 

    // Panggil fetchBooks saat komponen dimuat
    useEffect(() => {
        // PERBAIKAN: Set token default member JIKA TIDAK ADA token sama sekali.
        if (!localStorage.getItem('userToken')) {
             localStorage.setItem('userToken', 'valid_member_token'); 
        }

        fetchBooks();
    }, [fetchBooks]);

    // --- Logout Functionality (Simulasi) ---
    const handleLogout = () => {
        localStorage.removeItem('userToken');
        // Set token ke null untuk simulasi 'Tamu'
        setUserData({ name: 'Tamu', role: 'guest' });
        setActiveMenu('home');
        setBooks([]);
        setIsError("Anda telah logout. Mencoba mengambil data sebagai Tamu...");
        // Panggil fetchBooks lagi untuk mengambil data sebagai Guest/Tamu
        fetchBooks(); 
    };

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
                        <div className="p-4 mb-6 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-xl font-medium">
                            <p>⚠️ Peringatan: {isError}</p>
                            <p className="text-sm">Silakan ganti URL API base di `API_BASE_URL` dan pastikan server API (Laravel) berjalan.</p>
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
                                <p className="col-span-full text-center text-gray-500 py-10">Tidak ada buku ditemukan untuk kategori ini.</p>
                            )}
                        </div>
                    </div>
                </>
            );
        }
        
        // --- Tampilan Beranda (Home) ---
        if (activeMenu === 'home') {
            const featuredBooks = filteredBooks.filter(b => b.featured).slice(0, 4); 
            const interestingBooks = filteredBooks.filter(b => !b.featured);

            return (
                <>
                    {/* Pesan Error/Peringatan */}
                    {isError && (
                        <div className="p-4 mb-6 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-xl font-medium">
                            <p>⚠️ Peringatan: {isError}</p>
                            <p className="text-sm">Silakan ganti URL API base di `API_BASE_URL` dan pastikan server API (Laravel) berjalan.</p>
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

                    {/* Hero Section - Konten dinamis berdasarkan peran */}
                    <div className="bg-white rounded-3xl shadow-xl p-6 lg:p-8 mb-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-30" style={{ background: 'linear-gradient(135deg, #fde68a, #fed7aa)' }}></div>
                        <div className="relative z-10">
                            <h2 className="text-3xl lg:text-5xl font-bold mb-4 leading-tight" style={{ color: '#442D1C' }}>
                                {userData.role === 'guest' ? 'SELAMAT DATANG!' : 'POPULAR'}
                                <br />
                                {userData.role === 'guest' ? 'Akses Terbatas' : 'BESTSELLERS'}
                            </h2>
                            <p className="text-gray-600 mb-6 max-w-md">
                                {userData.role === 'guest' ? 'Silakan login untuk melihat riwayat peminjaman.' : `Selamat datang kembali, ${userData.name}! Kami memilih buku-buku terbaik yang direkomendasikan untuk Anda.`}
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
                        {featuredBooks.length > 0 ? (
                            featuredBooks.map(book => (
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
                            ))
                        ) : (
                            <p className="col-span-full text-center text-gray-500">Tidak ada buku unggulan ditemukan.</p>
                        )}
                    </div>

                    {/* Can Be Interesting Section */}
                    <div className="bg-white rounded-3xl shadow-xl p-6 lg:p-8">
                        <h3 className="text-2xl lg:text-3xl font-bold mb-4 lg:mb-6 leading-tight" style={{ color: '#442D1C' }}>
                            MUNGKIN MENARIK<br />BAGI ANDA ({interestingBooks.length})
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6">
                            {interestingBooks.length > 0 ? (
                                interestingBooks.map(book => (
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
                                ))
                            ) : (
                                <p className="col-span-full text-center text-gray-500 py-5">Tidak ada buku lain ditemukan.</p>
                            )}
                        </div>
                    </div>
                </>
            );
        }

        // --- Tampilan Peminjaman (Borrowing) ---
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
            
            // Data riwayat peminjaman mock (BELUM TERHUBUNG API)
            const mockBorrowings = [
                { id: 1, title: 'Atomic Habits', borrowDate: '01 Okt 2025', returnDate: '08 Okt 2025', status: 'Dipinjam', statusClass: 'bg-green-100 text-green-700' },
                { id: 2, title: 'The Subtle Art of Not Giving a F*ck', borrowDate: '25 Sep 2025', returnDate: '02 Okt 2025', status: 'Dikembalikan', statusClass: 'bg-blue-100 text-blue-700' },
                { id: 3, title: 'Sapiens: A Brief History of Humankind', borrowDate: '15 Okt 2025', returnDate: '22 Okt 2025', status: 'Terlambat', statusClass: 'bg-red-100 text-red-700' },
            ];

            return (
                <div className="bg-white rounded-3xl shadow-xl p-6 lg:p-8">
                    <h2 className="text-2xl lg:text-3xl font-bold mb-6" style={{ color: '#442D1C' }}>Riwayat Peminjaman {userData.name}</h2>
                    <div className="overflow-x-auto">
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

        // Fallback
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
                            {/* Menu item difilter berdasarkan peran pengguna */}
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

export default Dashboard;