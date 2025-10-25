import React from 'react';
import { X, Save } from 'lucide-react';

const CreateBookModal = ({
    showCreateModal,
    setShowCreateModal,
    newBookData,
    setNewBookData,
    categories,
    isSaving,
    handleCreateBook
}) => {
    if (!showCreateModal) return null;

    return (
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
    );
};

export default CreateBookModal;