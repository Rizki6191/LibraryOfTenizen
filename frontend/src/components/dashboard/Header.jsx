import React from 'react';
import { Menu, User, LogOut } from 'lucide-react';

const Header = ({
    setSidebarOpen,
    userData,
    profileDropdownOpen,
    handleProfileClick,
    handleViewProfile,
    handleLogout
}) => {
    return (
        <header className="bg-white shadow-md sticky top-0 z-30">
            <div className="flex items-center justify-between px-4 lg:px-8 py-4">
                <button 
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden p-2 hover:bg-orange-50 rounded-lg transition-colors"
                    aria-label="Buka sidebar"
                >
                    <Menu className="w-6 h-6" style={{ color: '#442D1C' }} />
                </button>
                
                {/* Spacer untuk mendorong profile ke kanan */}
                <div className="flex-1"></div>
                
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
                            {/* <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Logout</span>
                            </button> */}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;