import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import { Home, Book, List, LogOut, Menu, X, Search, BookOpen, GraduationCap, Heart, TrendingUp, Users, User, Mail, School, IdCard, Calendar } from 'lucide-react';
import "../styles/dashboard.css";

// ===============================================
// API Configuration & Data Setup
// ===============================================

const API_BASE_URL = "http://127.0.0.1:8000/api";
const BOOKS_API_URL = `${API_BASE_URL}/books`;
const USER_PROFILE_URL = `${API_BASE_URL}/user`;
const BORROWING_API_URL = `${API_BASE_URL}/borrowing`;
// const USER_PROFILE_URL = `${API_BASE_URL}/user`;

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
    const navigate = useNavigate();
    
    // State untuk UI/Navigasi
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState('books');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // State untuk Data
    const [books, setBooks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(null);
    
    // State user data yang akan diisi dari API
    const [userData, setUserData] = useState({ 
        name: 'Loading...', 
        role: 'guest',
        email: '',
        nis: '',
        major: '',
        grade: '',
        created_at: ''
    });

    const menuItems = allMenuItems.filter(item => item.roles.includes(userData.role));

    // Fungsi untuk mendapatkan data user dari token
    const fetchUserData = useCallback(async () => {
        const token = localStorage.getItem('userToken');
        
        if (!token) {
            setUserData({ 
                name: 'Tamu', 
                role: 'guest',
                email: '',
                nis: '',
                major: '',
                grade: '',
                created_at: ''
            });
            return;
        }

        try {
            const response = await axios.get(USER_PROFILE_URL, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json'
                }
            });

            if (response.data && response.data.data) {
                const user = response.data.data;
                setUserData({
                    name: user.name || 'Anggota Perpustakaan',
                    role: user.role || 'member',
                    email: user.email || '',
                    nis: user.nis || '',
                    major: user.major || '',
                    grade: user.grade || '',
                    created_at: user.created_at || ''
                });
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            const savedUserData = localStorage.getItem('userData');
            if (savedUserData) {
                setUserData(JSON.parse(savedUserData));
            }
        }
    }, []);

    // --- Logika Pengambilan Data Buku Asli ---
    const fetchBooks = useCallback(async () => {
        setIsLoading(true);
        setIsError(null);

        try {
            const token = localStorage.getItem('userToken');
            
            // Ambil data user terlebih dahulu
            await fetchUserData();

            // Panggilan API untuk mendapatkan buku
            const response = await axios.get(BOOKS_API_URL, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json'
                }
            });

            console.log("Books API Response:", response.data); // Debug log

            if (response.data && response.data.data) { 
                const apiBooks = response.data.data;
                
                const processedBooks = apiBooks.map((book, index) => ({
                    id: book.id,
                    title: book.title, 
                    author: book.author,
                    subtitle: book.description || `oleh ${book.author}`,
                    cover: getBookCoverStyle(book.id), 
                    category: categoryMap[book.category_id] || 'nonfiction', 
                    featured: index < 3,
                    stock: book.stock || 0,
                    category_id: book.category_id,
                    published_year: book.published_year,
                    isbn: book.isbn
                }));

                setBooks(processedBooks);
            } else {
                setIsError("Gagal mengambil data buku dari API. Format data tidak sesuai.");
            }

        } catch (error) {
            console.error("Error fetching books:", error);
            setIsError(`Terjadi kesalahan saat memuat data: ${error.message}. Pastikan API server berjalan di ${API_BASE_URL}.`);
            setBooks([]);
        } finally {
            setIsLoading(false);
        }
    }, [fetchUserData]);

    // Panggil fetchBooks saat komponen dimuat
    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]);

    // --- Logout Functionality ---
    const handleLogout = () => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');
        setUserData({ 
            name: 'Tamu', 
            role: 'guest',
            email: '',
            nis: '',
            major: '',
            grade: '',
            created_at: ''
        });
        setActiveMenu('home');
        navigate("/login");
        setBooks([]);
        setIsError("Anda telah logout.");
        setProfileDropdownOpen(false);
    };

    // --- Profile Handler ---
    const handleProfileClick = () => {
        setProfileDropdownOpen(!profileDropdownOpen);
    };

    const handleViewProfile = () => {
        setShowProfileModal(true);
        setProfileDropdownOpen(false);
    };

    // Filter books berdasarkan kategori dan pencarian
    const filteredBooks = books.filter(book => {
        const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
        const matchesSearch = searchQuery === '' || 
            book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.author.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

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
                    {/* Pesan Error/Peringatan */}
                    {isError && (
                        <div className="p-4 mb-6 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-xl font-medium">
                            <p>⚠️ Peringatan: {isError}</p>
                            <p className="text-sm">Silakan ganti URL API base di `API_BASE_URL` dan pastikan server API (Laravel) berjalan.</p>
                        </div>
                    )}

                    <div className="bg-white rounded-3xl shadow-xl p-6 lg:p-8">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                            <h2 className="text-2xl lg:text-3xl font-bold mb-4 lg:mb-0" style={{ color: '#442D1C' }}>
                                Semua Buku ({filteredBooks.length})
                            </h2>
                            
                            {/* Search Bar untuk Books Page */}
                            <div className="w-full lg:w-64">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Cari judul atau penulis..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-50 border border-gray-200 focus:border-amber-400 focus:bg-white transition-all outline-none text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Categories Filter */}
                        <div className="mb-6">
                            <div className="flex gap-2 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                                {categories.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.id)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap font-medium transition-all text-sm ${
                                                selectedCategory === cat.id
                                                    ? 'text-white shadow-lg'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-orange-50'
                                        }`}
                                        style={selectedCategory === cat.id ? { background: 'linear-gradient(90deg, #E8D1A7, #442D1C)' } : {}}
                                    >
                                        <cat.icon className="w-3 h-3" />
                                        <span>{cat.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Books Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
                            {filteredBooks.length > 0 ? (
                                filteredBooks.map(book => (
                                    <div key={book.id} className="group cursor-pointer">
                                        <div 
                                            className="rounded-xl shadow-md aspect-[3/4] p-3 lg:p-4 flex flex-col justify-end transform group-hover:scale-105 group-hover:shadow-xl transition-all duration-300"
                                            style={{ background: book.cover }}
                                        >
                                            <div className="text-white">
                                                <p className="text-xs opacity-90 mb-1 truncate">{book.author}</p>
                                                <h4 className="text-sm font-bold line-clamp-2 mb-1">{book.title}</h4>
                                                <div className="flex justify-between items-center text-xs opacity-70">
                                                    <span>Stok: {book.stock}</span>
                                                    <span className="capitalize">{book.category}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-12">
                                    <Book className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500 text-lg mb-2">Tidak ada buku ditemukan</p>
                                    <p className="text-gray-400 text-sm">
                                        {searchQuery ? `Untuk pencarian "${searchQuery}"` : `Untuk kategori ${categories.find(c => c.id === selectedCategory)?.name || 'yang dipilih'}`}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            );
        }
        
        // --- Tampilan Beranda (Home) ---
        if (activeMenu === 'home') {
            const featuredBooks = books.filter(b => b.featured).slice(0, 4); 
            const interestingBooks = books.filter(b => !b.featured);

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

                    {/* Hero Section */}
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
                                            <p className="text-xs lg:text-sm opacity-90 mb-1">{book.author}</p>
                                            <h3 className="text-base lg:text-xl font-bold">{book.title}</h3>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-8">
                                <Book className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                                <p className="text-gray-500">Tidak ada buku unggulan ditemukan.</p>
                            </div>
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
                                                <p className="text-xs opacity-90 mb-1">{book.author}</p>
                                                <h4 className="text-sm font-bold">{book.title}</h4>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-8">
                                    <Book className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                                    <p className="text-gray-500">Tidak ada buku lain ditemukan.</p>
                                </div>
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
            
            // Data riwayat peminjaman mock
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

    // Format tanggal untuk ditampilkan
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
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
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 rounded-full bg-gray-50 border-2 border-transparent focus:border-amber-400 focus:bg-white transition-all outline-none text-sm"
                                />
                            </div>
                        </div>

                        {/* User Profile dengan Dropdown */}
                        <div className="relative">
                            <div 
                                className="flex items-center gap-3 bg-orange-50 px-4 py-2 rounded-full cursor-pointer hover:bg-orange-100 transition-all"
                                onClick={handleProfileClick}
                            >
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

                            {/* Dropdown Menu */}
                            {profileDropdownOpen && (
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50">
                                    <button
                                        onClick={handleViewProfile}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-orange-50 transition-colors"
                                    >
                                        <User className="w-4 h-4" />
                                        <span>Profil Saya</span>
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="p-4 lg:p-8">
                    {renderContent()}
                </main>
            </div>

            {/* Modal Profil */}
            {showProfileModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        {/* Header Modal */}
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold" style={{ color: '#442D1C' }}>Profil Saya</h2>
                                <button 
                                    onClick={() => setShowProfileModal(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>
                        </div>

                        {/* Content Modal */}
                        <div className="p-6">
                            {/* Foto Profil */}
                            <div className="flex justify-center mb-6">
                                <div className="w-24 h-24 rounded-full border-4 border-amber-300 flex items-center justify-center font-bold text-3xl"
                                    style={{ backgroundColor: '#FACC15', color: '#442D1C' }}>
                                    {userData.name[0].toUpperCase()}
                                </div>
                            </div>

                            {/* Informasi Profil */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl">
                                    <User className="w-5 h-5 text-amber-600" />
                                    <div>
                                        <p className="text-sm text-gray-500">Nama Lengkap</p>
                                        <p className="font-semibold" style={{ color: '#442D1C' }}>{userData.name}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl">
                                    <Mail className="w-5 h-5 text-amber-600" />
                                    <div>
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="font-semibold" style={{ color: '#442D1C' }}>{userData.email || '-'}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl">
                                    <IdCard className="w-5 h-5 text-amber-600" />
                                    <div>
                                        <p className="text-sm text-gray-500">NIS</p>
                                        <p className="font-semibold" style={{ color: '#442D1C' }}>{userData.nis || '-'}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl">
                                    <School className="w-5 h-5 text-amber-600" />
                                    <div>
                                        <p className="text-sm text-gray-500">Jurusan</p>
                                        <p className="font-semibold" style={{ color: '#442D1C' }}>{userData.major || '-'}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl">
                                    <GraduationCap className="w-5 h-5 text-amber-600" />
                                    <div>
                                        <p className="text-sm text-gray-500">Kelas</p>
                                        <p className="font-semibold" style={{ color: '#442D1C' }}>{userData.grade || '-'}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl">
                                    <Calendar className="w-5 h-5 text-amber-600" />
                                    <div>
                                        <p className="text-sm text-gray-500">Bergabung Sejak</p>
                                        <p className="font-semibold" style={{ color: '#442D1C' }}>{formatDate(userData.created_at)}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl">
                                    <Users className="w-5 h-5 text-amber-600" />
                                    <div>
                                        <p className="text-sm text-gray-500">Role</p>
                                        <p className="font-semibold capitalize" style={{ color: '#442D1C' }}>{userData.role}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Modal */}
                        <div className="p-6 border-t border-gray-100">
                            <button
                                onClick={() => setShowProfileModal(false)}
                                className="w-full py-3 px-6 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition-colors"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;