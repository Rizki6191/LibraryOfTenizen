import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import { Home, Book, List, LogOut, Menu, X, Search, BookOpen, GraduationCap, Heart, TrendingUp, Users, User, Mail, School, IdCard, Calendar, Clock, Hash, CalendarDays, AlertCircle, CheckCircle, Eye, Edit, Trash2, Plus, Save, RotateCcw } from 'lucide-react';
import "../styles/dashboard.css";

// ===============================================
// API Configuration & Data Setup
// ===============================================
const API_BASE_URL = "http://127.0.0.1:8000/api";
const BOOKS_API_URL = `${API_BASE_URL}/books`;
const USER_PROFILE_URL = `${API_BASE_URL}/user`;
const BORROWING_API_URL = `${API_BASE_URL}/borrowing`;
const ALL_BORROWINGS_URL = `${API_BASE_URL}/borrowing`;
const CATEGORIES_API_URL = `${API_BASE_URL}/categories`; // ✅ Ditambahkan

// --- Daftar Kategori ---
// `id` adalah angka sesuai `category_id` di database.
// Ini hanya untuk UI, data sebenarnya diambil dari API.
const categories = [
    { id: 'all', name: 'Semua', icon: BookOpen },
    { id: 1, name: 'Romansa', icon: Heart },
    { id: 2, name: 'Self-Help', icon: GraduationCap },
    { id: 3, name: 'Biografi', icon: Users },
    { id: 4, name: 'Fantasi', icon: Book },
    { id: 5, name: 'Fiksi Ilmiah', icon: Search },
    { id: 6, name: 'Misteri', icon: AlertCircle },
    { id: 7, name: 'Thriller', icon: TrendingUp },
    { id: 8, name: 'Horor', icon: AlertCircle },
    { id: 9, name: 'Sejarah', icon: BookOpen },
    { id: 10, name: 'Bisnis', icon: TrendingUp },
    { id: 11, name: 'Kesehatan & Kebugaran', icon: Users },
    { id: 12, name: 'Anak-Anak', icon: Book },
    { id: 14, name: 'Drama', icon: Heart },
    { id: 15, name: 'Slice of Life', icon: BookOpen },
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
    const [selectedBook, setSelectedBook] = useState(null);
    const [borrowLoading, setBorrowLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editBookData, setEditBookData] = useState({});
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newBookData, setNewBookData] = useState({
        title: '',
        author: '',
        description: '',
        category_id: 1, // Default ke Romansa (ID 1)
        stock: 1,
        published_year: new Date().getFullYear(),
        isbn: ''
    });
    // State untuk Data
    const [books, setBooks] = useState([]);
    const [borrowings, setBorrowings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingBorrowings, setIsLoadingBorrowings] = useState(false);
    const [isError, setIsError] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    // State user data yang akan diisi dari API
    const [userData, setUserData] = useState({ 
        name: 'Loading...', 
        role: 'guest',
        email: '',
        nis: '',
        major: '',
        grade: '',
        created_at: '',
        id: null
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
                created_at: '',
                id: null
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
                    created_at: user.created_at || '',
                    id: user.id || null
                });
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            const savedUserData = localStorage.getItem('userData');
            if (savedUserData) {
                const parsedData = JSON.parse(savedUserData);
                setUserData({
                    ...parsedData,
                    id: parsedData.id || null
                });
            }
        }
    }, []);

    // Fungsi untuk mengambil data peminjaman
    const fetchBorrowings = useCallback(async () => {
        const token = localStorage.getItem('userToken');
        if (!token || (userData.role === 'guest' && userData.role !== 'admin')) {
            setBorrowings([]);
            return;
        }
        setIsLoadingBorrowings(true);
        try {
            let url = ALL_BORROWINGS_URL;
            if (userData.role === 'admin') {
                url = ALL_BORROWINGS_URL;
            } else {
                url = `${ALL_BORROWINGS_URL}?user_id=${userData.id}`;
            }
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json'
                }
            });
            if (response.data && response.data.data) {
                const formattedBorrowings = response.data.data.map(borrowing => ({
                    id: borrowing.id,
                    user_id: borrowing.user_id,
                    book_id: borrowing.book_id,
                    borrow_date: borrowing.borrowed_at || borrowing.created_at,
                    due_date: borrowing.due_date,
                    return_date: borrowing.returned_at,
                    status: borrowing.status || 'dipinjam',
                    user: borrowing.user ? {
                        id: borrowing.user.id,
                        name: borrowing.user.name,
                        nis: borrowing.user.nis,
                        email: borrowing.user.email,
                        major: borrowing.user.major,
                        grade: borrowing.user.grade,
                        role: borrowing.user.role
                    } : null,
                    book: borrowing.book ? {
                        id: borrowing.book.id,
                        title: borrowing.book.title,
                        author: borrowing.book.author,
                        description: borrowing.book.description
                    } : null
                }));
                setBorrowings(formattedBorrowings);
            } else {
                setBorrowings([]);
            }
        } catch (error) {
            console.error("Error fetching borrowings:", error);
            setBorrowings([]);
        } finally {
            setIsLoadingBorrowings(false);
        }
    }, [userData.role, userData.id]);

    // --- Logika Pengambilan Data Buku Asli ---
    const fetchBooks = useCallback(async () => {
        setIsLoading(true);
        setIsError(null);
        try {
            const token = localStorage.getItem('userToken');
            await fetchUserData();
            const response = await axios.get(BOOKS_API_URL, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json'
                }
            });
            
            // ✅ Perbaikan: Tangani kasus di mana API tidak mengembalikan data
            if (!response.data || !Array.isArray(response.data.data)) {
                console.error("Invalid API response format:", response.data);
                setIsError("Format data API tidak valid. Pastikan backend mengembalikan { data: [...] }.");
                setBooks([]);
                return;
            }

            const apiBooks = response.data.data;
            const processedBooks = apiBooks.map((book, index) => {
                // ✅ Ambil nama kategori dari relasi jika tersedia, jika tidak, gunakan ID
                let categoryName = 'Unknown';
                if (book.category && book.category.name) {
                    categoryName = book.category.name;
                } else if (book.category_id) {
                    // Fallback: Cari nama berdasarkan category_id
                    const cat = categories.find(c => c.id === book.category_id);
                    categoryName = cat ? cat.name : `Kategori ${book.category_id}`;
                }

                return {
                    id: book.id,
                    title: book.title, 
                    author: book.author,
                    description: book.description || `Buku ${book.title} karya ${book.author}`,
                    cover: getBookCoverStyle(book.id), 
                    category: categoryName, // ✅ Gunakan nama yang sudah diproses
                    featured: index < 3,
                    stock: book.stock || 0,
                    category_id: book.category_id,
                    published_year: book.published_year,
                    isbn: book.isbn,
                    created_at: book.created_at,
                    updated_at: book.updated_at,
                    cover_image: book.cover_image
                };
            });
            setBooks(processedBooks);
        } catch (error) {
            console.error("Error fetching books:", error);
            if (error.response) {
                // Error dari server (4xx, 5xx)
                setIsError(`Error ${error.response.status}: ${error.response.data.message || 'Gagal memuat data buku.'}`);
            } else if (error.request) {
                // Tidak ada respon dari server
                setIsError("Tidak dapat terhubung ke server API. Pastikan Laravel berjalan di http://127.0.0.1:8000.");
            } else {
                // Error lain
                setIsError(`Terjadi kesalahan: ${error.message}`);
            }
            setBooks([]);
        } finally {
            setIsLoading(false);
        }
    }, [fetchUserData]);

    useEffect(() => { fetchBooks(); }, [fetchBooks]);
    useEffect(() => {
        if (activeMenu === 'borrowing' && userData.role !== 'guest') {
            fetchBorrowings();
        }
    }, [activeMenu, userData.role, fetchBorrowings]);

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
            created_at: '',
            id: null
        });
        setBorrowings([]);
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

    // --- Book Detail Handler ---
    const handleBookClick = (book) => {
        setSelectedBook(book);
        setEditBookData({ ...book });
        setIsEditing(false);
    };
    const handleCloseBookModal = () => {
        setSelectedBook(null);
        setIsEditing(false);
        setEditBookData({});
    };

    // --- User Detail Handler (untuk admin) ---
    const handleUserClick = (user) => {
        setSelectedUser(user);
    };
    const handleCloseUserModal = () => {
        setSelectedUser(null);
    };

    // --- Edit Mode Handler ---
    const handleDoubleClickEdit = () => {
        if (userData.role === 'admin') {
            setIsEditing(true);
        }
    };
    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditBookData(selectedBook ? { ...selectedBook } : {});
    };

    // --- Update Book Handler ---
    const handleUpdateBook = async () => {
    if (!selectedBook) return;
    setIsSaving(true);
    try {
        const token = localStorage.getItem('userToken');
        const response = await axios.put(
            `${BOOKS_API_URL}/${selectedBook.id}`,
            {
                ...editBookData,
                category_id: parseInt(editBookData.category_id)
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json'
                }
            }
        );
        if (response.data.success) {
            // 1. Fetch data buku terbaru
            await fetchBooks();
            
            // 2. Tampilkan notifikasi sukses
            setIsError("Buku berhasil diupdate!");
            
            // 3. Reset semua state edit secara bersamaan (PENTING)
            setIsEditing(false);
            setEditBookData({});
            
            // 4. Close modal dengan delay untuk memastikan React render selesai
            setTimeout(() => {
                setSelectedBook(null);
            }, 100);
            
            // 5. Switch menu SETELAH modal benar-benar tertutup
            setTimeout(() => {
                setActiveMenu('books');
            }, 200);
            
            // 6. Hapus notifikasi
            setTimeout(() => { setIsError(null); }, 2500);
        } else {
            setIsError(response.data.message || "Gagal mengupdate buku.");
            setIsSaving(false);
        }
    } catch (error) {
        console.error("Error updating book:", error);
        if (error.response && error.response.data && error.response.data.message) {
            setIsError(error.response.data.message);
        } else {
            setIsError("Terjadi kesalahan saat mengupdate buku.");
        }
        setIsSaving(false);
    }
};

    // --- Delete Book Handler ---
    const handleDeleteBook = async () => {
    if (!selectedBook) return;
    if (!window.confirm(`Apakah Anda yakin ingin menghapus buku "${selectedBook.title}"?`)) {
        return;
    }
    setIsSaving(true);
    try {
        const token = localStorage.getItem('userToken');
        const response = await axios.delete(
            `${BOOKS_API_URL}/${selectedBook.id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json'
                }
            }
        );
        if (response.data.success) {
            // 1. Fetch data buku terbaru
            await fetchBooks();
            
            // 2. Tampilkan notifikasi sukses
            setIsError("Buku berhasil dihapus!");
            
            // 3. Reset semua state edit secara bersamaan (PENTING)
            setIsEditing(false);
            setEditBookData({});
            
            // 4. Close modal dengan delay
            setTimeout(() => {
                setSelectedBook(null);
            }, 100);
            
            // 5. Switch menu SETELAH modal benar-benar tertutup
            setTimeout(() => {
                setActiveMenu('books');
            }, 200);
            
            // 6. Hapus notifikasi
            setTimeout(() => { setIsError(null); }, 2500);
        } else {
            setIsError(response.data.message || "Gagal menghapus buku.");
            setIsSaving(false);
        }
    } catch (error) {
        console.error("Error deleting book:", error);
        if (error.response && error.response.data && error.response.data.message) {
            setIsError(error.response.data.message);
        } else {
            setIsError("Terjadi kesalahan saat menghapus buku.");
        }
        setIsSaving(false);
    }
};

    // --- Create Book Handler ---
    const handleCreateBook = async () => {
    setIsSaving(true);
    try {
        const token = localStorage.getItem('userToken');
        const response = await axios.post(
            BOOKS_API_URL,
            {
                ...newBookData,
                category_id: parseInt(newBookData.category_id)
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json'
                }
            }
        );
        if (response.data.success) {
            // 1. PENTING: Ambil data buku baru dari response
            const newBook = response.data.data;
            
            // 2. Tambahkan buku baru ke state books secara IMMEDIATE
            // Ini membuat buku langsung muncul di UI tanpa tunggu fetchBooks()
            if (newBook) {
                const categoryName = categories.find(c => c.id === newBook.category_id)?.name || 'Unknown';
                const processedNewBook = {
                    id: newBook.id,
                    title: newBook.title,
                    author: newBook.author,
                    description: newBook.description || `Buku ${newBook.title} karya ${newBook.author}`,
                    cover: getBookCoverStyle(newBook.id),
                    category: categoryName,
                    featured: false,
                    stock: newBook.stock || 0,
                    category_id: newBook.category_id,
                    published_year: newBook.published_year,
                    isbn: newBook.isbn,
                    created_at: newBook.created_at,
                    updated_at: newBook.updated_at,
                    cover_image: newBook.cover_image
                };
                
                // Tambahkan ke array books
                setBooks(prevBooks => [processedNewBook, ...prevBooks]);
            }
            
            // 3. Tampilkan notifikasi sukses
            setIsError("Buku berhasil ditambahkan!");
            
            // 4. Reset form
            setNewBookData({
                title: '',
                author: '',
                description: '',
                category_id: 1,
                stock: 1,
                published_year: new Date().getFullYear(),
                isbn: ''
            });
            
            // 5. Close modal dengan delay
            setTimeout(() => {
                setShowCreateModal(false);
            }, 100);
            
            // 6. Switch menu SETELAH modal tertutup
            setTimeout(() => {
                setActiveMenu('books');
                // OPTIONAL: Clear filter agar buku baru terlihat di "Semua"
                setSelectedCategory('all');
            }, 200);
            
            // 7. Fetch data untuk sync dengan backend (di background, tidak critical)
            // Ini opsional, cuma untuk memastikan data sync dengan backend
            setTimeout(() => {
                fetchBooks();
            }, 500);
            
            // 8. Hapus notifikasi
            setTimeout(() => { setIsError(null); }, 2500);
        } else {
            setIsError(response.data.message || "Gagal menambahkan buku.");
            setIsSaving(false);
        }
    } catch (error) {
        console.error("Error creating book:", error);
        if (error.response && error.response.data && error.response.data.message) {
            setIsError(error.response.data.message);
        } else {
            setIsError("Terjadi kesalahan saat menambahkan buku.");
        }
        setIsSaving(false);
    }
};

    // --- Borrow Book Handler ---
    const handleBorrowBook = async (bookId) => {
        if (userData.role === 'guest') {
            setIsError("Anda harus login terlebih dahulu untuk meminjam buku.");
            setSelectedBook(null);
            navigate("/login");
            return;
        }
        if (userData.role === 'admin') {
            setIsError("Admin tidak dapat meminjam buku.");
            return;
        }
        setBorrowLoading(true);
        try {
            const token = localStorage.getItem('userToken');
            const response = await axios.post(
                BORROWING_API_URL,
                {
                    book_id: bookId,
                    user_id: userData.id
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json'
                    }
                }
            );
            if (response.data.success) {
                await fetchBooks();
                if (activeMenu === 'borrowing') {
                    await fetchBorrowings();
                }
                setIsError("Buku berhasil dipinjam!");
                setSelectedBook(null);
                setTimeout(() => { setIsError(null); }, 2000);
            } else {
                setIsError(response.data.message || "Gagal meminjam buku.");
            }
        } catch (error) {
            console.error("Error borrowing book:", error);
            if (error.response && error.response.data && error.response.data.message) {
                setIsError(error.response.data.message);
            } else {
                setIsError("Terjadi kesalahan saat meminjam buku.");
            }
        } finally {
            setBorrowLoading(false);
        }
    };

    // Filter books berdasarkan kategori dan pencarian
    const filteredBooks = books.filter(book => {
        const matchesCategory = selectedCategory === 'all' || book.category_id === selectedCategory;
        const matchesSearch = searchQuery === '' || 
            book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.author.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Helper function untuk menentukan status dan styling peminjaman
    const getBorrowingStatus = (borrowing) => {
        const today = new Date();
        const dueDate = new Date(borrowing.due_date);
        const returnDate = borrowing.return_date ? new Date(borrowing.return_date) : null;
        if (returnDate) {
            return {
                text: 'Dikembalikan',
                class: 'bg-blue-100 text-blue-700',
                icon: '✅'
            };
        }
        if (today > dueDate) {
            return {
                text: 'Terlambat',
                class: 'bg-red-100 text-red-700',
                icon: '⚠️'
            };
        }
        return {
            text: 'Dipinjam',
            class: 'bg-green-100 text-green-700',
            icon: '📖'
        };
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

    // Helper untuk rendering konten berdasarkan menu yang aktif
    const renderContent = () => {
        if (isLoading && activeMenu !== 'borrowing') {
            return (
                <div className="text-center p-12 bg-white rounded-3xl shadow-xl">
                    <div className="animate-spin inline-block w-8 h-8 border-4 border-t-4 border-amber-500 border-opacity-25 rounded-full mb-4"></div>
                    <p className="text-lg font-medium text-gray-700">Memuat Buku...</p>
                </div>
            );
        }

        if (activeMenu === 'books') {
            return (
                <>
                    {isError && (
                        <div className={`p-4 mb-6 rounded-xl font-medium ${
                            isError.includes("berhasil") 
                                ? "bg-green-100 border border-green-300 text-green-800"
                                : "bg-yellow-100 border border-yellow-300 text-yellow-800"
                        }`}>
                            <p>{isError.includes("berhasil") ? "✅" : "⚠️"} {isError}</p>
                        </div>
                    )}
                    <div className="bg-white rounded-3xl shadow-xl p-6 lg:p-8">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                            <h2 className="text-2xl lg:text-3xl font-bold mb-4 lg:mb-0" style={{ color: '#442D1C' }}>
                                Semua Buku ({filteredBooks.length})
                            </h2>
                            <div className="flex flex-col lg:flex-row gap-4">
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
                                {userData.role === 'admin' && (
                                    <button
                                        onClick={() => setShowCreateModal(true)}
                                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-full font-semibold hover:bg-green-600 transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span>Tambah Buku</span>
                                    </button>
                                )}
                            </div>
                        </div>
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
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
                            {filteredBooks.length > 0 ? (
                                filteredBooks.map(book => (
                                    <div 
                                        key={book.id} 
                                        className="group cursor-pointer"
                                        onClick={() => handleBookClick(book)}
                                    >
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

        if (activeMenu === 'home') {
            const featuredBooks = books.filter(b => b.featured).slice(0, 4); 
            const interestingBooks = books.filter(b => !b.featured);
            return (
                <>
                    {isError && (
                        <div className={`p-4 mb-6 rounded-xl font-medium ${
                            isError.includes("berhasil") 
                                ? "bg-green-100 border border-green-300 text-green-800"
                                : "bg-yellow-100 border border-yellow-300 text-yellow-800"
                        }`}>
                            <p>{isError.includes("berhasil") ? "✅" : "⚠️"} {isError}</p>
                        </div>
                    )}
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
                    <div className="bg-white rounded-3xl shadow-xl p-6 lg:p-8 mb-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-30" style={{ background: 'linear-gradient(135deg, #fde68a, #fed7aa)' }}></div>
                        <div className="relative z-10">
                            <h2 className="text-3xl lg:text-5xl font-bold mb-4 leading-tight" style={{ color: '#442D1C' }}>
                                {userData.role === 'guest' ? 'SELAMAT DATANG!' : 'POPULAR'}
                                <br />
                                {userData.role === 'guest' ? 'Akses Terbatas' : 'BESTSELLERS'}
                            </h2>
                            <p className="text-gray-600 mb-6 max-w-md">
                                {userData.role === 'guest' ? 'Silakan login untuk melihat riwayat peminjaman.' : `Selamat datang kembali, ${userData.name}!`}
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
                    <h3 className="text-xl font-semibold mb-4" style={{ color: '#442D1C' }}>Pilihan Unggulan ({featuredBooks.length})</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
                        {featuredBooks.length > 0 ? (
                            featuredBooks.map(book => (
                                <div 
                                    key={book.id} 
                                    className="group cursor-pointer"
                                    onClick={() => handleBookClick(book)}
                                >
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
                    <div className="bg-white rounded-3xl shadow-xl p-6 lg:p-8">
                        <h3 className="text-2xl lg:text-3xl font-bold mb-4 lg:mb-6 leading-tight" style={{ color: '#442D1C' }}>
                            MUNGKIN MENARIK<br />BAGI ANDA ({interestingBooks.length})
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6">
                            {interestingBooks.length > 0 ? (
                                interestingBooks.map(book => (
                                    <div 
                                        key={book.id} 
                                        className="group cursor-pointer"
                                        onClick={() => handleBookClick(book)}
                                    >
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
            if (isLoadingBorrowings) {
                return (
                    <div className="text-center p-12 bg-white rounded-3xl shadow-xl">
                        <div className="animate-spin inline-block w-8 h-8 border-4 border-t-4 border-amber-500 border-opacity-25 rounded-full mb-4"></div>
                        <p className="text-lg font-medium text-gray-700">Memuat Data Peminjaman...</p>
                    </div>
                );
            }
            return (
                <div className="bg-white rounded-3xl shadow-xl p-6 lg:p-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                        <h2 className="text-2xl lg:text-3xl font-bold mb-4 lg:mb-0" style={{ color: '#442D1C' }}>
                            {userData.role === 'admin' ? 'Semua Data Peminjaman' : `Riwayat Peminjaman ${userData.name}`}
                        </h2>
                        <div className="text-sm text-gray-500">
                            Total: {borrowings.length} peminjaman
                            {userData.role === 'admin' && ' • Admin View'}
                        </div>
                    </div>
                    {borrowings.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr style={{ borderBottom: '2px solid #E8D1A7' }}>
                                        <th className="text-left py-4 px-4 font-semibold text-sm" style={{ color: '#442D1C' }}>No</th>
                                        {userData.role === 'admin' && (
                                            <th className="text-left py-4 px-4 font-semibold text-sm" style={{ color: '#442D1C' }}>Peminjam</th>
                                        )}
                                        <th className="text-left py-4 px-4 font-semibold text-sm" style={{ color: '#442D1C' }}>Judul Buku</th>
                                        <th className="text-left py-4 px-4 font-semibold text-sm" style={{ color: '#442D1C' }}>Penulis</th>
                                        <th className="text-left py-4 px-4 font-semibold text-sm" style={{ color: '#442D1C' }}>Tanggal Pinjam</th>
                                        <th className="text-left py-4 px-4 font-semibold text-sm" style={{ color: '#442D1C' }}>Batas Kembali</th>
                                        <th className="text-left py-4 px-4 font-semibold text-sm" style={{ color: '#442D1C' }}>Tanggal Kembali</th>
                                        <th className="text-left py-4 px-4 font-semibold text-sm" style={{ color: '#442D1C' }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {borrowings.map((borrowing, index) => {
                                        const status = getBorrowingStatus(borrowing);
                                        return (
                                            <tr key={borrowing.id} className="border-b hover:bg-orange-50 transition-colors">
                                                <td className="py-4 px-4 text-sm">{index + 1}</td>
                                                {userData.role === 'admin' && (
                                                    <td className="py-4 px-4">
                                                        {borrowing.user ? (
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center font-semibold text-amber-700 text-sm">
                                                                    {borrowing.user.name[0].toUpperCase()}
                                                                </div>
                                                                <div>
                                                                    <p className="font-medium text-sm">{borrowing.user.name}</p>
                                                                    <p className="text-xs text-gray-500">NIS: {borrowing.user.nis}</p>
                                                                </div>
                                                                <button
                                                                    onClick={() => handleUserClick(borrowing.user)}
                                                                    className="ml-2 p-1 hover:bg-gray-100 rounded transition-colors"
                                                                    title="Lihat detail user"
                                                                >
                                                                    <Eye className="w-4 h-4 text-gray-500" />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-400 text-sm">Data user tidak tersedia</span>
                                                        )}
                                                    </td>
                                                )}
                                                <td className="py-4 px-4 font-medium text-sm">
                                                    {borrowing.book?.title || 'Judul tidak tersedia'}
                                                </td>
                                                <td className="py-4 px-4 text-sm">
                                                    {borrowing.book?.author || 'Penulis tidak tersedia'}
                                                </td>
                                                <td className="py-4 px-4 text-sm">{formatDate(borrowing.borrow_date)}</td>
                                                <td className="py-4 px-4 text-sm">{formatDate(borrowing.due_date)}</td>
                                                <td className="py-4 px-4 text-sm">
                                                    {borrowing.return_date ? formatDate(borrowing.return_date) : '-'}
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.class}`}>
                                                        {status.icon} {status.text}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <List className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg mb-2">
                                {userData.role === 'admin' ? 'Belum ada data peminjaman' : 'Belum ada riwayat peminjaman'}
                            </p>
                            <p className="text-gray-400 text-sm">
                                {userData.role === 'admin' 
                                    ? 'Sistem akan menampilkan data peminjaman dari semua user di sini.'
                                    : 'Silakan pinjam buku terlebih dahulu untuk melihat riwayat peminjaman Anda.'
                                }
                            </p>
                            {userData.role === 'member' && (
                                <button
                                    onClick={() => setActiveMenu('books')}
                                    className="mt-4 px-6 py-2 bg-amber-500 text-white rounded-full font-semibold hover:bg-amber-600 transition-colors"
                                >
                                    Pinjam Buku Sekarang
                                </button>
                            )}
                        </div>
                    )}
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
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
            <div className="lg:ml-64">
                <header className="bg-white shadow-md sticky top-0 z-30">
                    <div className="flex items-center gap-4 px-4 lg:px-8 py-4">
                        <button 
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 hover:bg-orange-50 rounded-lg transition-colors"
                            aria-label="Buka sidebar"
                        >
                            <Menu className="w-6 h-6" style={{ color: '#442D1C' }} />
                        </button>
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
                <main className="p-4 lg:p-8">
                    {renderContent()}
                </main>
            </div>
            {/* Modal Profil */}
            {showProfileModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
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
                        <div className="p-6">
                            <div className="flex justify-center mb-6">
                                <div className="w-24 h-24 rounded-full border-4 border-amber-300 flex items-center justify-center font-bold text-3xl"
                                    style={{ backgroundColor: '#FACC15', color: '#442D1C' }}>
                                    {userData.name[0].toUpperCase()}
                                </div>
                            </div>
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
            {/* Modal Detail User (untuk admin) */}
            {selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold" style={{ color: '#442D1C' }}>Detail Peminjam</h2>
                                <button 
                                    onClick={handleCloseUserModal}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="flex justify-center mb-6">
                                <div className="w-24 h-24 rounded-full border-4 border-amber-300 flex items-center justify-center font-bold text-3xl"
                                    style={{ backgroundColor: '#FACC15', color: '#442D1C' }}>
                                    {selectedUser.name[0].toUpperCase()}
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl">
                                    <User className="w-5 h-5 text-amber-600" />
                                    <div>
                                        <p className="text-sm text-gray-500">Nama Lengkap</p>
                                        <p className="font-semibold" style={{ color: '#442D1C' }}>{selectedUser.name}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl">
                                    <Mail className="w-5 h-5 text-amber-600" />
                                    <div>
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="font-semibold" style={{ color: '#442D1C' }}>{selectedUser.email || '-'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl">
                                    <IdCard className="w-5 h-5 text-amber-600" />
                                    <div>
                                        <p className="text-sm text-gray-500">NIS</p>
                                        <p className="font-semibold" style={{ color: '#442D1C' }}>{selectedUser.nis || '-'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl">
                                    <School className="w-5 h-5 text-amber-600" />
                                    <div>
                                        <p className="text-sm text-gray-500">Jurusan</p>
                                        <p className="font-semibold" style={{ color: '#442D1C' }}>{selectedUser.major || '-'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl">
                                    <GraduationCap className="w-5 h-5 text-amber-600" />
                                    <div>
                                        <p className="text-sm text-gray-500">Kelas</p>
                                        <p className="font-semibold" style={{ color: '#442D1C' }}>{selectedUser.grade || '-'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl">
                                    <Users className="w-5 h-5 text-amber-600" />
                                    <div>
                                        <p className="text-sm text-gray-500">Role</p>
                                        <p className="font-semibold capitalize" style={{ color: '#442D1C' }}>{selectedUser.role}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-100">
                            <button
                                onClick={handleCloseUserModal}
                                className="w-full py-3 px-6 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition-colors"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Modal Detail Buku */}
            {selectedBook && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold" style={{ color: '#442D1C' }}>
                                    {isEditing ? 'Edit Buku' : 'Detail Buku'}
                                </h2>
                                <div className="flex items-center gap-2">
                                    {userData.role === 'admin' && !isEditing && (
                                        <>
                                            <button
                                                onClick={handleDoubleClickEdit}
                                                className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-blue-600"
                                                title="Edit buku"
                                            >
                                                <Edit className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={handleDeleteBook}
                                                className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                                                title="Hapus buku"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </>
                                    )}
                                    {isEditing && (
                                        <button
                                            onClick={handleCancelEdit}
                                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
                                            title="Batal edit"
                                        >
                                            <RotateCcw className="w-5 h-5" />
                                        </button>
                                    )}
                                    <button 
                                        onClick={handleCloseBookModal}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <X className="w-5 h-5 text-gray-500" />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="flex flex-col lg:flex-row gap-6">
                                <div className="flex-shrink-0">
                                    <div 
                                        className="rounded-2xl shadow-lg w-48 h-64 flex items-center justify-center mx-auto lg:mx-0"
                                        style={{ background: selectedBook.cover }}
                                    >
                                        <div className="text-white text-center p-4">
                                            <p className="text-sm opacity-90 mb-2">{selectedBook.author}</p>
                                            <h3 className="text-lg font-bold">{selectedBook.title}</h3>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    {isEditing ? (
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Judul Buku</label>
                                                <input
                                                    type="text"
                                                    value={editBookData.title || ''}
                                                    onChange={(e) => setEditBookData({...editBookData, title: e.target.value})}
                                                    className="w-full p-3 border border-gray-300 rounded-xl focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Penulis</label>
                                                <input
                                                    type="text"
                                                    value={editBookData.author || ''}
                                                    onChange={(e) => setEditBookData({...editBookData, author: e.target.value})}
                                                    className="w-full p-3 border border-gray-300 rounded-xl focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                                                <textarea
                                                    value={editBookData.description || ''}
                                                    onChange={(e) => setEditBookData({...editBookData, description: e.target.value})}
                                                    rows="4"
                                                    className="w-full p-3 border border-gray-300 rounded-xl focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                                                    <select
                                                        value={editBookData.category_id}
                                                        onChange={(e) => setEditBookData({...editBookData, category_id: parseInt(e.target.value)})}
                                                        className="w-full p-3 border border-gray-300 rounded-xl focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none"
                                                    >
                                                        {categories.filter(cat => cat.id !== 'all').map(cat => (
                                                            <option key={cat.id} value={cat.id}>
                                                                {cat.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Stok</label>
                                                    <input
                                                        type="number"
                                                        value={editBookData.stock || 0}
                                                        onChange={(e) => setEditBookData({...editBookData, stock: parseInt(e.target.value)})}
                                                        className="w-full p-3 border border-gray-300 rounded-xl focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none"
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tahun Terbit</label>
                                                    <input
                                                        type="number"
                                                        value={editBookData.published_year || ''}
                                                        onChange={(e) => setEditBookData({...editBookData, published_year: parseInt(e.target.value)})}
                                                        className="w-full p-3 border border-gray-300 rounded-xl focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">ISBN</label>
                                                    <input
                                                        type="text"
                                                        value={editBookData.isbn || ''}
                                                        onChange={(e) => setEditBookData({...editBookData, isbn: e.target.value})}
                                                        className="w-full p-3 border border-gray-300 rounded-xl focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <h3 className="text-2xl font-bold mb-2" style={{ color: '#442D1C' }}>{selectedBook.title}</h3>
                                            <p className="text-gray-600 mb-4">oleh {selectedBook.author}</p>
                                            <div className="mb-6" onDoubleClick={handleDoubleClickEdit}>
                                                <h4 className="font-semibold mb-2" style={{ color: '#442D1C' }}>Deskripsi</h4>
                                                <p className="text-gray-700 leading-relaxed">{selectedBook.description}</p>
                                                {userData.role === 'admin' && (
                                                    <p className="text-xs text-gray-400 mt-1">Double click untuk edit</p>
                                                )}
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                                <div className="flex items-center gap-3">
                                                    <Hash className="w-4 h-4 text-amber-600" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Kategori</p>
                                                        <p className="font-semibold capitalize">{selectedBook.category}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <CalendarDays className="w-4 h-4 text-amber-600" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Tahun Terbit</p>
                                                        <p className="font-semibold">{selectedBook.published_year || 'Tidak diketahui'}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Book className="w-4 h-4 text-amber-600" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">ISBN</p>
                                                        <p className="font-semibold">{selectedBook.isbn || 'Tidak tersedia'}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Clock className="w-4 h-4 text-amber-600" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Ditambahkan</p>
                                                        <p className="font-semibold">{formatDate(selectedBook.created_at)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={`flex items-center gap-3 p-4 rounded-xl mb-6 ${
                                                selectedBook.stock > 0 
                                                    ? 'bg-green-50 border border-green-200' 
                                                    : 'bg-red-50 border border-red-200'
                                            }`}>
                                                {selectedBook.stock > 0 ? (
                                                    <>
                                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                                        <div>
                                                            <p className="font-semibold text-green-700">Tersedia</p>
                                                            <p className="text-sm text-green-600">{selectedBook.stock} buku tersedia untuk dipinjam</p>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <AlertCircle className="w-5 h-5 text-red-600" />
                                                        <div>
                                                            <p className="font-semibold text-red-700">Stok Habis</p>
                                                            <p className="text-sm text-red-600">Buku sedang tidak tersedia untuk dipinjam</p>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </>
                                    )}
                                    <div className="flex gap-3">
                                        {isEditing ? (
                                            <>
                                                <button
                                                    onClick={handleCancelEdit}
                                                    className="flex-1 py-3 px-6 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                                                >
                                                    Batal
                                                </button>
                                                <button
                                                    onClick={handleUpdateBook}
                                                    disabled={isSaving}
                                                    className="flex-1 py-3 px-6 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                                                >
                                                    {isSaving ? (
                                                        <>
                                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                                            <span>Menyimpan...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Save className="w-4 h-4" />
                                                            <span>Simpan</span>
                                                        </>
                                                    )}
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={handleCloseBookModal}
                                                    className="flex-1 py-3 px-6 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                                                >
                                                    Tutup
                                                </button>
                                                {userData.role === 'member' && (
                                                    <button
                                                        onClick={() => handleBorrowBook(selectedBook.id)}
                                                        disabled={selectedBook.stock === 0 || borrowLoading}
                                                        className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-colors ${
                                                            selectedBook.stock === 0
                                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                                : 'bg-amber-500 text-white hover:bg-amber-600'
                                                        }`}
                                                    >
                                                        {borrowLoading ? (
                                                            <div className="flex items-center justify-center gap-2">
                                                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                                                <span>Meminjam...</span>
                                                            </div>
                                                        ) : (
                                                            'Pinjam Buku'
                                                        )}
                                                    </button>
                                                )}
                                                {userData.role === 'guest' && (
                                                    <button
                                                        onClick={() => {
                                                            setSelectedBook(null);
                                                            navigate("/login");
                                                        }}
                                                        className="flex-1 py-3 px-6 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition-colors"
                                                    >
                                                        Login untuk Meminjam
                                                    </button>
                                                )}
                                                {userData.role === 'admin' && (
                                                    <div className="text-center text-gray-500 py-2">
                                                        Admin tidak dapat meminjam buku
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Modal Create Book */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold" style={{ color: '#442D1C' }}>Tambah Buku Baru</h2>
                                <button 
                                    onClick={() => setShowCreateModal(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Judul Buku *</label>
                                    <input
                                        type="text"
                                        value={newBookData.title}
                                        onChange={(e) => setNewBookData({...newBookData, title: e.target.value})}
                                        className="w-full p-3 border border-gray-300 rounded-xl focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none"
                                        placeholder="Masukkan judul buku"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Penulis *</label>
                                    <input
                                        type="text"
                                        value={newBookData.author}
                                        onChange={(e) => setNewBookData({...newBookData, author: e.target.value})}
                                        className="w-full p-3 border border-gray-300 rounded-xl focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none"
                                        placeholder="Masukkan nama penulis"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                                    <textarea
                                        value={newBookData.description}
                                        onChange={(e) => setNewBookData({...newBookData, description: e.target.value})}
                                        rows="4"
                                        className="w-full p-3 border border-gray-300 rounded-xl focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none"
                                        placeholder="Masukkan deskripsi buku"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                                        <select
                                            value={newBookData.category_id}
                                            onChange={(e) => setNewBookData({...newBookData, category_id: parseInt(e.target.value)})}
                                            className="w-full p-3 border border-gray-300 rounded-xl focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none"
                                        >
                                            {categories.filter(cat => cat.id !== 'all').map(cat => (
                                                <option key={cat.id} value={cat.id}>
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Stok *</label>
                                        <input
                                            type="number"
                                            value={newBookData.stock}
                                            onChange={(e) => setNewBookData({...newBookData, stock: parseInt(e.target.value)})}
                                            className="w-full p-3 border border-gray-300 rounded-xl focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none"
                                            min="0"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tahun Terbit</label>
                                        <input
                                            type="number"
                                            value={newBookData.published_year}
                                            onChange={(e) => setNewBookData({...newBookData, published_year: parseInt(e.target.value)})}
                                            className="w-full p-3 border border-gray-300 rounded-xl focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none"
                                            min="1900"
                                            max={new Date().getFullYear()}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">ISBN</label>
                                        <input
                                            type="text"
                                            value={newBookData.isbn}
                                            onChange={(e) => setNewBookData({...newBookData, isbn: e.target.value})}
                                            className="w-full p-3 border border-gray-300 rounded-xl focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none"
                                            placeholder="Optional"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="flex-1 py-3 px-6 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleCreateBook}
                                    disabled={isSaving || !newBookData.title || !newBookData.author}
                                    className="flex-1 py-3 px-6 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                >
                                    {isSaving ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                            <span>Menyimpan...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4" />
                                            <span>Simpan Buku</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;