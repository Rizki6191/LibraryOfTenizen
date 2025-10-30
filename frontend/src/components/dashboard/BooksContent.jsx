import React from 'react';
import { Search, Book, Plus } from 'lucide-react';

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

const BooksContent = ({
    isLoading,
    isLoadingCategories,
    isError,
    filteredBooks,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    handleBookClick,
    userData,
    setShowCreateModal
}) => {
    if (isLoading || isLoadingCategories) {
        return (
            <div className="text-center p-12 bg-white rounded-3xl shadow-xl">
                <div className="animate-spin inline-block w-8 h-8 border-4 border-t-4 border-amber-500 border-opacity-25 rounded-full mb-4"></div>
                <p className="text-lg font-medium text-gray-700">
                    {isLoadingCategories ? 'Memuat Kategori...' : 'Memuat Buku...'}
                </p>
            </div>
        );
    }

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
                {/* Baris 1: Judul */}
                <div className="mb-6">
                    <h2 className="text-2xl lg:text-3xl font-bold" style={{ color: '#442D1C' }}>
                        Semua Buku ({filteredBooks.length})
                    </h2>
                </div>

                {/* Baris 2: Search Input */}
                <div className="mb-4">
                    <div className="w-full max-w-md">
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

                {/* Baris 3: Tombol Tambah Buku */}
                {userData.role === 'admin' && (
                    <div className="mb-6">
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-full font-semibold hover:bg-green-600 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Tambah Buku</span>
                        </button>
                    </div>
                )}

                {/* Baris 4: Kategori */}
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
                                <span>{cat.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
                
                {/* Tampilan Buku Horizontal dengan Scroll */}
                <div>
                    <div 
                        className="flex gap-4 lg:gap-6 overflow-x-auto pb-6 scroll-smooth"
                        style={{ 
                            scrollbarWidth: 'none', 
                            msOverflowStyle: 'none',
                            scrollBehavior: 'smooth'
                        }}
                    >
                        {filteredBooks.length > 0 ? (
                            filteredBooks.map(book => (
                                <div 
                                    key={book.id} 
                                    className="flex-shrink-0 w-48 group cursor-pointer"
                                    onClick={() => handleBookClick(book)}
                                >
                                    <div 
                                        className="rounded-xl shadow-md aspect-[3/4] p-4 flex flex-col justify-end transform group-hover:scale-105 group-hover:shadow-xl transition-all duration-300"
                                        style={{ background: book.cover || getBookCoverStyle(book.id) }}
                                    >
                                        <div className="text-white">
                                            <p className="text-xs opacity-90 mb-1 truncate">{book.author}</p>
                                            <h4 className="text-sm font-bold line-clamp-2 mb-1">{book.title}</h4>
                                            <div className="flex justify-between items-center text-xs opacity-70">
                                                <span>Stok: {book.stock}</span>
                                                <span className="capitalize truncate max-w-16">{book.category}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="w-full text-center py-12">
                                <Book className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500 text-lg mb-2">Tidak ada buku ditemukan</p>
                                <p className="text-gray-400 text-sm">
                                    {searchQuery ? `Untuk pencarian "${searchQuery}"` : `Untuk kategori ${categories.find(c => c.id === selectedCategory)?.name || 'yang dipilih'}`}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default BooksContent;