import React from 'react';
import { Home, Book, List, LogOut, X } from 'lucide-react';

// Mapping string ke komponen ikon
const iconMap = {
    'Home': Home,
    'Book': Book,
    'List': List,
    'LogOut': LogOut
};

const allMenuItems = [
    { id: 'home', name: 'Beranda', icon: 'Home', roles: ['member', 'guest'] },
    { id: 'books', name: 'Daftar Buku', icon: 'Book', roles: ['admin', 'member', 'guest'] },
    { id: 'borrowing', name: 'Peminjaman', icon: 'List', roles: ['admin', 'member'] }
];

const Sidebar = ({ 
    sidebarOpen, 
    setSidebarOpen, 
    activeMenu, 
    setActiveMenu, 
    userData, 
    handleLogout 
}) => {
    const menuItems = allMenuItems.filter(item => item.roles.includes(userData.role));

    return (
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
                        {menuItems.map(item => {
                            const IconComponent = iconMap[item.icon];
                            return (
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
                                    <IconComponent className="w-5 h-5" />
                                    <span>{item.name}</span>
                                </button>
                            );
                        })}
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
    );
};

export default Sidebar;