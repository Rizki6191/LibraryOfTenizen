import React from 'react';
import { X, User, Mail, IdCard, School, GraduationCap, Calendar, Users } from 'lucide-react';

const ProfileModal = ({ showProfileModal, setShowProfileModal, userData }) => {
    if (!showProfileModal) return null;

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
    );
};

export default ProfileModal;