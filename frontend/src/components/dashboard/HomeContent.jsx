import React from 'react';
import { Book } from 'lucide-react';

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

const HomeContent = ({
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
    setActiveMenu,
    filteredBooks
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

    const featuredBooks = books.filter(b => b.featured).slice(0, 4); 
    const interestingBooks = filteredBooks.filter(b => !b.featured);

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
            
            {/* HAPUS BAGIAN KATEGORI DARI SINI */}
            
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
            
            {/* Pilihan Unggulan - Horizontal */}
            <div className="bg-white rounded-3xl shadow-xl p-6 lg:p-8 mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold" style={{ color: '#442D1C' }}>Pilihan Unggulan ({featuredBooks.length})</h3>
                </div>
                <div className="flex gap-4 lg:gap-6 overflow-x-auto pb-4 scroll-smooth">
                    {featuredBooks.length > 0 ? (
                        featuredBooks.map(book => (
                            <div 
                                key={book.id} 
                                className="flex-shrink-0 w-56 group cursor-pointer"
                                onClick={() => handleBookClick(book)}
                            >
                                <div 
                                    className="rounded-2xl shadow-lg aspect-[3/4] p-6 flex flex-col justify-end transform group-hover:scale-105 group-hover:shadow-2xl transition-all duration-300"
                                    style={{ background: book.cover || getBookCoverStyle(book.id) }}
                                >
                                    <div className="text-white">
                                        <p className="text-sm opacity-90 mb-1">{book.author}</p>
                                        <h3 className="text-lg font-bold">{book.title}</h3>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="w-full text-center py-8">
                            <Book className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                            <p className="text-gray-500">Tidak ada buku unggulan ditemukan.</p>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Mungkin Menarik - Horizontal */}
            <div className="bg-white rounded-3xl shadow-xl p-6 lg:p-8">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl lg:text-3xl font-bold leading-tight" style={{ color: '#442D1C' }}>
                        MUNGKIN MENARIK BAGI ANDA ({interestingBooks.length})
                    </h3>
                </div>
                <div className="flex gap-4 lg:gap-6 overflow-x-auto pb-4 scroll-smooth">
                    {interestingBooks.length > 0 ? (
                        interestingBooks.map(book => (
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
                                        <p className="text-xs opacity-90 mb-1">{book.author}</p>
                                        <h4 className="text-sm font-bold">{book.title}</h4>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="w-full text-center py-8">
                            <Book className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                            <p className="text-gray-500">Tidak ada buku lain ditemukan.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default HomeContent;