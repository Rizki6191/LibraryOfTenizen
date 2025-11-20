import React from 'react';
import { Edit, Trash2, RotateCcw, Save, Hash, CalendarDays, Book, Clock, CheckCircle, AlertCircle, X } from 'lucide-react';

const BookModal = ({
    selectedBook,
    isEditing,
    editBookData,
    setEditBookData,
    categories,
    userData,
    borrowLoading,
    isSaving,
    handleCloseBookModal,
    handleDoubleClickEdit,
    handleDeleteBook,
    handleCancelEdit,
    handleUpdateBook,
    handleBorrowBook,
    navigate
}) => {
    if (!selectedBook) return null;

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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold" style={{ color: '#442D1C' }}>
                            {isEditing ? 'Edit Buku' : 'Detail Buku'}
                        </h2>
                        <div className="flex items-center gap-2">
                            {/* Tombol X untuk tutup di posisi edit/delete sebelumnya */}
                            <button
                                onClick={handleCloseBookModal}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
                                title="Tutup"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="p-6">
                    {/* CONTAINER UTAMA: Gambar Kiri (lg:w-1/4) dan Konten Kanan (lg:w-3/4) */}
                    <div className="flex flex-wrap gap-6">
                        {/* 1. Gambar di Kiri (Lebih besar di desktop: 1/4 lebar) */}
                        <div className="flex-shrink-0 lg:w-1/4 flex justify-center lg:justify-start">
                            <div 
                                className="rounded-2xl shadow-lg w-40 h-52 flex items-center justify-center"
                                style={{ background: selectedBook.cover }}
                            >
                                <div className="text-white text-center p-3">
                                    <p className="text-xs opacity-90 mb-1">{selectedBook.author}</p>
                                    <h3 className="text-sm font-bold leading-tight">{selectedBook.title}</h3>
                                </div>
                            </div>
                        </div>
                        
                        {/* 2. Konten di Kanan (Lebih besar di desktop: 3/4 lebar) */}
                        <div className="flex-1 lg:w-3/4">
                            {isEditing ? (
                                // --- EDITING MODE (FORM) ---
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
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Sinopsis</label>
                                        <textarea
                                            value={editBookData.description || ''}
                                            onChange={(e) => setEditBookData({...editBookData, description: e.target.value})}
                                            rows="4"
                                            className="w-full p-3 border border-gray-300 rounded-xl focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                    <div className="flex gap-3 pt-4">
                                        {/* Tombol Edit/Delete dipindahkan ke sini */}
                                        {userData.role === 'admin' && !isEditing && (
                                            <>
                                                <button
                                                    onClick={handleDoubleClickEdit}
                                                    className="flex-1 py-3 px-6 border border-blue-500 text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <Edit className="w-5 h-5" />
                                                    <span>Edit Buku</span>
                                                </button>
                                                <button
                                                    onClick={handleDeleteBook}
                                                    className="flex-1 py-3 px-6 border border-red-500 text-red-600 rounded-xl font-semibold hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                    <span>Hapus Buku</span>
                                                </button>
                                            </>
                                        )}
                                        {isEditing && (
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
                                                    className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-colors ${
                                                        isSaving
                                                            ? 'bg-amber-300 text-white cursor-not-allowed'
                                                            : 'bg-amber-500 text-white hover:bg-amber-600'
                                                    }`}
                                                >
                                                    {isSaving ? (
                                                        <div className="flex items-center justify-center gap-2">
                                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                                            <span>Menyimpan...</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center justify-center gap-2">
                                                            <Save className="w-5 h-5" />
                                                            <span>Simpan Perubahan</span>
                                                        </div>
                                                    )}
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                // --- DETAIL MODE (STATIC CONTENT) ---
                                <div className="space-y-6">
                                    {/* Judul dan Penulis */}
                                    <div>
                                        <h1 className="text-3xl font-bold mb-2" style={{ color: '#442D1C' }}>{selectedBook.title}</h1>
                                        <h2 className="text-xl text-gray-600">oleh: {selectedBook.author}</h2>
                                    </div>

                                    {/* Sinopsis */}
                                    <div onDoubleClick={handleDoubleClickEdit}>
                                        <h3 className="text-xl font-semibold mb-3" style={{ color: '#442D1C' }}>Sinopsis</h3>
                                        <p className="text-gray-700 leading-relaxed text-justify">{selectedBook.description}</p>
                                        {userData.role === 'admin' && (
                                            <p className="text-xs text-gray-400 mt-2">Double click untuk edit</p>
                                        )}
                                    </div>

                                    {/* Informasi Buku dalam 2x2 Grid (Sesuai Layout Gambar) */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
                                        {/* Kategori */}
                                        <div>
                                            <h4 className="font-semibold mb-2" style={{ color: '#442D1C' }}>Kategori</h4>
                                            <p className="text-gray-700 capitalize">{selectedBook.category}</p>
                                        </div>
                                        {/* Tahun Terbit */}
                                        <div>
                                            <h4 className="font-semibold mb-2" style={{ color: '#442D1C' }}>Tahun Terbit</h4>
                                            <p className="text-gray-700">{selectedBook.published_year || 'Tidak diketahui'}</p>
                                        </div>
                                        {/* ISBN */}
                                        <div>
                                            <h4 className="font-semibold mb-2" style={{ color: '#442D1C' }}>ISBN</h4>
                                            <p className="text-gray-700">{selectedBook.isbn || 'Tidak Tersedia'}</p>
                                        </div>
                                        {/* Ditambahkan */}
                                        <div>
                                            <h4 className="font-semibold mb-2" style={{ color: '#442D1C' }}>Ditambahkan</h4>
                                            <p className="text-gray-700">{formatDate(selectedBook.created_at)}</p>
                                        </div>
                                    </div>

                                    {/* Status Ketersediaan */}
                                    <div className={`flex items-center gap-3 p-4 rounded-xl ${
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

                                    {/* Tombol Aksi */}
                                    <div className="flex gap-3 pt-4">
                                        {/* Tombol Edit/Delete dipindahkan ke sini */}
                                        {userData.role === 'admin' && (
                                            <>
                                                <button
                                                    onClick={handleDoubleClickEdit}
                                                    className="flex-1 py-3 px-6 border border-blue-500 text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <Edit className="w-5 h-5" />
                                                    <span>Edit Buku</span>
                                                </button>
                                                <button
                                                    onClick={handleDeleteBook}
                                                    className="flex-1 py-3 px-6 border border-red-500 text-red-600 rounded-xl font-semibold hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                    <span>Hapus Buku</span>
                                                </button>
                                            </>
                                        )}
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
                                                    handleCloseBookModal();
                                                    navigate("/login");
                                                }}
                                                className="flex-1 py-3 px-6 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition-colors"
                                            >
                                                Login untuk Meminjam
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookModal;