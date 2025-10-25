import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

// Components
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';
import HomeContent from '../components/dashboard/HomeContent';
import BooksContent from '../components/dashboard/BooksContent';
import BorrowingContent from '../components/dashboard/BorrowingContent';
import BookModal from '../components/dashboard/BookModal';
import CreateBookModal from '../components/dashboard/CreateBookModal';
import ProfileModal from '../components/dashboard/ProfileModal';
import UserModal from '../components/dashboard/UserModal';

import { CATEGORY_ICON_MAPPING } from '../utils/IconMapping';

// API Configuration
const API_BASE_URL = "http://127.0.0.1:8000/api";
const BOOKS_API_URL = `${API_BASE_URL}/books`;
const USER_PROFILE_URL = `${API_BASE_URL}/users`;
const BORROWING_API_URL = `${API_BASE_URL}/borrowing`;
const ALL_BORROWINGS_URL = `${API_BASE_URL}/borrowing`;
const CATEGORIES_API_URL = `${API_BASE_URL}/categories`;

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
    const [selectedUser, setSelectedUser] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);

    // State untuk Data
    const [books, setBooks] = useState([]);
    const [borrowings, setBorrowings] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingBorrowings, setIsLoadingBorrowings] = useState(false);
    const [isLoadingCategories, setIsLoadingCategories] = useState(false);
    const [isError, setIsError] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [borrowLoading, setBorrowLoading] = useState(false);
    
    // State user data
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

    // State untuk edit book
    const [isEditing, setIsEditing] = useState(false);
    const [editBookData, setEditBookData] = useState({});
    const [newBookData, setNewBookData] = useState({
        title: '',
        author: '',
        description: '',
        category_id: 1,
        stock: 1,
        published_year: new Date().getFullYear(),
        isbn: ''
    });

    // Menu items
    const allMenuItems = [
        { id: 'home', name: 'Beranda', icon: 'Home', roles: ['member', 'guest'] },
        { id: 'books', name: 'Daftar Buku', icon: 'Book', roles: ['admin', 'member', 'guest'] },
        { id: 'borrowing', name: 'Peminjaman', icon: 'List', roles: ['admin', 'member'] }
    ];

    const menuItems = allMenuItems.filter(item => item.roles.includes(userData.role));

    // ==================== FUNGSI UTAMA ====================

    // --- Fetch User Data dari localStorage saja ---
    const fetchUserData = useCallback(() => {
        console.log('Fetching user data from localStorage...');
        
        const token = localStorage.getItem('userToken');
        const savedUserData = localStorage.getItem('userData');
        
        if (!token || !savedUserData) {
            console.log('No token or user data found in localStorage, setting as guest');
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
            const parsedData = JSON.parse(savedUserData);
            console.log('User data from localStorage:', parsedData);
            
            setUserData({
                name: parsedData.name || 'Anggota Perpustakaan',
                role: parsedData.role || 'member',
                email: parsedData.email || '',
                nis: parsedData.nis || '',
                major: parsedData.major || '',
                grade: parsedData.grade || '',
                created_at: parsedData.created_at || '',
                id: parsedData.id || null
            });
        } catch (error) {
            console.error("Error parsing user data from localStorage:", error);
            // Fallback ke guest jika parsing gagal
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
        }
    }, []);

    // --- Fetch Categories ---
    const fetchCategories = useCallback(async () => {
        setIsLoadingCategories(true);
        try {
            const token = localStorage.getItem('userToken');
            console.log('Fetching categories...');
            
            const response = await axios.get(CATEGORIES_API_URL, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json'
                }
            });
            
            console.log('Categories response:', response.data);
            
            if (response.data && Array.isArray(response.data.data)) {
                // Tambahkan icon untuk setiap kategori
                const categoriesWithIcons = response.data.data.map(cat => ({
                    ...cat,
                    icon: 'Book' // Default icon sementara
                }));
                
                setCategories(categoriesWithIcons);
                if (response.data.data.length > 0) {
                    setNewBookData(prev => ({
                        ...prev,
                        category_id: response.data.data[0].id
                    }));
                }
            } else {
                console.error("Invalid categories API response format:", response.data);
                setCategories([]);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
            setCategories([]);
        } finally {
            setIsLoadingCategories(false);
        }
    }, []);

    // --- Fetch Books ---
    const fetchBooks = useCallback(async () => {
        setIsLoading(true);
        setIsError(null);
        try {
            const token = localStorage.getItem('userToken');
            console.log('Fetching books...');
            
            const response = await axios.get(BOOKS_API_URL, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json'
                }
            });
            
            console.log('Books response:', response.data);
            
            if (!response.data || !Array.isArray(response.data.data)) {
                console.error("Invalid API response format:", response.data);
                setIsError("Format data API tidak valid.");
                setBooks([]);
                return;
            }

            const apiBooks = response.data.data;
            const processedBooks = apiBooks.map((book, index) => ({
                id: book.id,
                title: book.title, 
                author: book.author,
                description: book.description || `Buku ${book.title} karya ${book.author}`,
                cover: book.cover_image || `linear-gradient(to bottom right, #E8D1A7, #442D1C)`,
                category: book.category?.name || 'Unknown',
                category_id: book.category_id,
                featured: index < 3,
                stock: book.stock || 0,
                published_year: book.published_year,
                isbn: book.isbn,
                created_at: book.created_at,
                updated_at: book.updated_at,
                cover_image: book.cover_image
            }));
            setBooks(processedBooks);
        } catch (error) {
            console.error("Error fetching books:", error);
            if (error.response) {
                setIsError(`Error ${error.response.status}: ${error.response.data?.message || 'Gagal memuat data buku.'}`);
            } else if (error.request) {
                setIsError("Tidak dapat terhubung ke server API. Pastikan backend berjalan.");
            } else {
                setIsError(`Terjadi kesalahan: ${error.message}`);
            }
            setBooks([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // --- Fetch Borrowings ---
    const fetchBorrowings = useCallback(async () => {
        const token = localStorage.getItem('userToken');
        if (!token || userData.role === 'guest') {
            setBorrowings([]);
            return;
        }
        
        setIsLoadingBorrowings(true);
        try {
            let url = userData.role === 'admin' ? ALL_BORROWINGS_URL : `${ALL_BORROWINGS_URL}?user_id=${userData.id}`;
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json'
                }
            });
            if (response.data && response.data.data) {
                setBorrowings(response.data.data);
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
                await fetchBooks();
                setIsError("Buku berhasil diupdate!");
                setIsEditing(false);
                setEditBookData({});
                setTimeout(() => {
                    setSelectedBook(null);
                    setActiveMenu('books');
                }, 100);
                setTimeout(() => { setIsError(null); }, 2500);
            } else {
                setIsError(response.data.message || "Gagal mengupdate buku.");
            }
        } catch (error) {
            console.error("Error updating book:", error);
            setIsError(error.response?.data?.message || "Terjadi kesalahan saat mengupdate buku.");
        } finally {
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
                await fetchBooks();
                setIsError("Buku berhasil dihapus!");
                setIsEditing(false);
                setEditBookData({});
                setTimeout(() => {
                    setSelectedBook(null);
                    setActiveMenu('books');
                }, 100);
                setTimeout(() => { setIsError(null); }, 2500);
            } else {
                setIsError(response.data.message || "Gagal menghapus buku.");
            }
        } catch (error) {
            console.error("Error deleting book:", error);
            setIsError(error.response?.data?.message || "Terjadi kesalahan saat menghapus buku.");
        } finally {
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
                const newBook = response.data.data;
                if (newBook) {
                    const processedNewBook = {
                        id: newBook.id,
                        title: newBook.title,
                        author: newBook.author,
                        description: newBook.description || `Buku ${newBook.title} karya ${newBook.author}`,
                        cover: `linear-gradient(to bottom right, #E8D1A7, #442D1C)`,
                        category: categories.find(c => c.id === newBook.category_id)?.name || 'Unknown',
                        featured: false,
                        stock: newBook.stock || 0,
                        category_id: newBook.category_id,
                        published_year: newBook.published_year,
                        isbn: newBook.isbn,
                        created_at: newBook.created_at,
                        updated_at: newBook.updated_at,
                        cover_image: newBook.cover_image
                    };
                    setBooks(prevBooks => [processedNewBook, ...prevBooks]);
                }
                setIsError("Buku berhasil ditambahkan!");
                setNewBookData({
                    title: '',
                    author: '',
                    description: '',
                    category_id: categories.length > 0 ? categories[0].id : 1,
                    stock: 1,
                    published_year: new Date().getFullYear(),
                    isbn: ''
                });
                setTimeout(() => {
                    setShowCreateModal(false);
                    setActiveMenu('books');
                    setSelectedCategory('all');
                }, 100);
                setTimeout(() => { setIsError(null); }, 2500);
            } else {
                setIsError(response.data.message || "Gagal menambahkan buku.");
            }
        } catch (error) {
            console.error("Error creating book:", error);
            setIsError(error.response?.data?.message || "Terjadi kesalahan saat menambahkan buku.");
        } finally {
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
            setIsError(error.response?.data?.message || "Terjadi kesalahan saat meminjam buku.");
        } finally {
            setBorrowLoading(false);
        }
    };

    // ==================== EFFECTS ====================

    useEffect(() => {
        console.log('Dashboard mounted, fetching initial data...');
        fetchUserData(); // Sekarang hanya dari localStorage
        fetchCategories();
    }, [fetchUserData, fetchCategories]);

    useEffect(() => { 
        if (categories.length > 0) {
            console.log('Categories loaded, fetching books...');
            fetchBooks(); 
        }
    }, [fetchBooks, categories]);

    useEffect(() => {
        if (activeMenu === 'borrowing' && userData.role !== 'guest') {
            console.log('Fetching borrowings...');
            fetchBorrowings();
        }
    }, [activeMenu, userData.role, fetchBorrowings]);

    // ==================== RENDER CONTENT ====================

    const renderContent = () => {
        const contentProps = {
            isLoading,
            isLoadingCategories,
            isError,
            books,
            categories,
            selectedCategory,
            setSelectedCategory,
            searchQuery,
            setSearchQuery,
            handleBookClick,
            userData,
            setShowCreateModal,
            borrowings,
            isLoadingBorrowings,
            handleUserClick,
            setActiveMenu,
            filteredBooks: books.filter(book => {
                const matchesCategory = selectedCategory === 'all' || book.category_id === selectedCategory;
                const matchesSearch = searchQuery === '' || 
                    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    book.author.toLowerCase().includes(searchQuery.toLowerCase());
                return matchesCategory && matchesSearch;
            })
        };

        switch (activeMenu) {
            case 'home':
                return <HomeContent {...contentProps} />;
            case 'books':
                return <BooksContent {...contentProps} />;
            case 'borrowing':
                return <BorrowingContent {...contentProps} />;
            default:
                return null;
        }
    };

    // ==================== RENDER ====================

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 font-sans">
            <Sidebar 
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
                userData={userData}
                handleLogout={handleLogout}
            />
            
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <div className="lg:ml-64">
                <Header 
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    setSidebarOpen={setSidebarOpen}
                    userData={userData}
                    profileDropdownOpen={profileDropdownOpen}
                    handleProfileClick={handleProfileClick}
                    handleViewProfile={handleViewProfile}
                    handleLogout={handleLogout}
                />

                <main className="p-4 lg:p-8">
                    {renderContent()}
                </main>
            </div>

            {/* Modals */}
            <ProfileModal 
                showProfileModal={showProfileModal}
                setShowProfileModal={setShowProfileModal}
                userData={userData}
            />

            <UserModal 
                selectedUser={selectedUser}
                handleCloseUserModal={handleCloseUserModal}
            />

            <BookModal 
                selectedBook={selectedBook}
                isEditing={isEditing}
                editBookData={editBookData}
                setEditBookData={setEditBookData}
                categories={categories}
                userData={userData}
                borrowLoading={borrowLoading}
                isSaving={isSaving}
                handleCloseBookModal={handleCloseBookModal}
                handleDoubleClickEdit={handleDoubleClickEdit}
                handleDeleteBook={handleDeleteBook}
                handleCancelEdit={handleCancelEdit}
                handleUpdateBook={handleUpdateBook}
                handleBorrowBook={handleBorrowBook}
                navigate={navigate}
            />

            <CreateBookModal 
                showCreateModal={showCreateModal}
                setShowCreateModal={setShowCreateModal}
                newBookData={newBookData}
                setNewBookData={setNewBookData}
                categories={categories}
                isSaving={isSaving}
                handleCreateBook={handleCreateBook}
            />
        </div>
    );
};

export default Dashboard;