import React from 'react';
import { List, X, Eye } from 'lucide-react';

const BorrowingContent = ({
    userData,
    borrowings,
    isLoadingBorrowings,
    handleUserClick,
    setActiveMenu
}) => {
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

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
};

export default BorrowingContent;