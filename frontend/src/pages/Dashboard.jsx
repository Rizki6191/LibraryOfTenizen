import React, { useState } from 'react';
import { Home, Book, List, LogOut, Menu, X, Search, BookOpen, GraduationCap, Heart, TrendingUp, Users } from 'lucide-react';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All', icon: BookOpen },
    { id: 'fantasy', name: 'Fantasy', icon: Book },
    { id: 'drama', name: 'Drama', icon: Heart },
    { id: 'detective', name: 'Detective', icon: Search },
    { id: 'education', name: 'Education', icon: GraduationCap },
    { id: 'psychology', name: 'Psychology', icon: Users },
    { id: 'business', name: 'Business', icon: TrendingUp },
    { id: 'nonfiction', name: 'Nonfiction', icon: BookOpen }
  ];

  const books = [
    { id: 1, title: 'Fredrik Backman', subtitle: 'Anxious People', cover: 'linear-gradient(to bottom right, #E8D1A7, #442D1C)', featured: true },
    { id: 2, title: 'Fredrick Backman', subtitle: 'A Man Called Ove', cover: 'linear-gradient(to bottom right, #2dd4bf, #06b6d4)', featured: true },
    { id: 3, title: 'Sarah Waters', subtitle: 'The Paying Guests', cover: 'linear-gradient(to bottom right, #1f2937, #111827)', featured: true },
    { id: 4, title: 'Tara Westover', subtitle: 'The Hobbit', cover: 'linear-gradient(to bottom right, #059669, #10b981)' },
    { id: 5, title: 'Yuval Noah Harari', subtitle: 'Hamnet and Judith', cover: 'linear-gradient(to bottom right, #67e8f9, #3b82f6)' },
    { id: 6, title: 'Jojo Moyes', subtitle: 'Me Before You', cover: 'linear-gradient(to bottom right, #a855f7, #ec4899)' },
    { id: 7, title: 'Fitzgerald', subtitle: 'The Great Gatsby', cover: 'linear-gradient(to bottom right, #facc15, #E8D1A7)' }
  ];

  const menuItems = [
    { id: 'home', name: 'Home', icon: Home },
    { id: 'books', name: 'Books', icon: Book },
    { id: 'borrowing', name: 'Borrow Book', icon: List }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100">
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
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all font-medium">
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-white shadow-md sticky top-0 z-30">
          <div className="flex items-center gap-4 px-4 lg:px-8 py-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-orange-50 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" style={{ color: '#442D1C' }} />
            </button>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search name of the book or author..."
                  className="w-full pl-12 pr-4 py-3 rounded-full bg-gray-50 border-2 border-transparent focus:border-amber-400 focus:bg-white transition-all outline-none text-sm"
                />
              </div>
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-3 bg-orange-50 px-4 py-2 rounded-full cursor-pointer hover:bg-orange-100 transition-all">
              <img 
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" 
                alt="User" 
                className="w-10 h-10 rounded-full object-cover border-2 border-amber-300"
              />
              <div className="hidden md:block">
                <p className="font-semibold text-sm" style={{ color: '#442D1C' }}>Katja Austen</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-4 lg:p-8">
          {activeMenu === 'home' && (
            <>
              {/* Categories */}
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

              {/* Hero Section */}
              <div className="bg-white rounded-3xl shadow-xl p-6 lg:p-8 mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-30" style={{ background: 'linear-gradient(135deg, #fde68a, #fed7aa)' }}></div>
                <div className="relative z-10">
                  <h2 className="text-3xl lg:text-5xl font-bold mb-4 leading-tight" style={{ color: '#442D1C' }}>
                    POPULAR<br />BESTSELLERS
                  </h2>
                  <p className="text-gray-600 mb-6 max-w-md">
                    We picked up the perfect books<br />
                    recommended for you based on your taste.
                  </p>
                  <button className="px-8 py-4 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all" style={{ background: 'linear-gradient(90deg, #E8D1A7, #442D1C)' }}>
                    Watch full list
                  </button>
                </div>
              </div>

              {/* Featured Books */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
                {books.filter(b => b.featured).map(book => (
                  <div key={book.id} className="group cursor-pointer">
                    <div 
                      className="rounded-2xl shadow-lg aspect-[3/4] p-4 lg:p-6 flex flex-col justify-end transform group-hover:scale-105 group-hover:shadow-2xl transition-all duration-300"
                      style={{ background: book.cover }}
                    >
                      <div className="text-white">
                        <p className="text-xs lg:text-sm opacity-90 mb-1">{book.title}</p>
                        <h3 className="text-base lg:text-xl font-bold">{book.subtitle}</h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Can Be Interesting Section */}
              <div className="bg-white rounded-3xl shadow-xl p-6 lg:p-8">
                <h3 className="text-2xl lg:text-3xl font-bold mb-4 lg:mb-6 leading-tight" style={{ color: '#442D1C' }}>
                  CAN BE<br />INTERESTING
                </h3>
                <p className="text-gray-600 mb-6 lg:mb-8">
                  Select the best books picked<br />
                  specifically for you
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6">
                  {books.filter(b => !b.featured).map(book => (
                    <div key={book.id} className="group cursor-pointer">
                      <div 
                        className="rounded-xl shadow-md aspect-[3/4] p-3 lg:p-4 flex flex-col justify-end transform group-hover:scale-105 group-hover:shadow-xl transition-all duration-300"
                        style={{ background: book.cover }}
                      >
                        <div className="text-white">
                          <p className="text-xs opacity-90 mb-1">{book.title}</p>
                          <h4 className="text-sm font-bold">{book.subtitle}</h4>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeMenu === 'books' && (
            <div className="bg-white rounded-3xl shadow-xl p-6 lg:p-8">
              <h2 className="text-2xl lg:text-3xl font-bold mb-6" style={{ color: '#442D1C' }}>All Books</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 lg:gap-6">
                {books.map(book => (
                  <div key={book.id} className="group cursor-pointer">
                    <div 
                      className="rounded-xl shadow-md aspect-[3/4] p-3 lg:p-4 flex flex-col justify-end transform group-hover:scale-105 group-hover:shadow-xl transition-all duration-300"
                      style={{ background: book.cover }}
                    >
                      <div className="text-white">
                        <p className="text-xs opacity-90 mb-1">{book.title}</p>
                        <h4 className="text-sm font-bold">{book.subtitle}</h4>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeMenu === 'borrowing' && (
            <div className="bg-white rounded-3xl shadow-xl p-6 lg:p-8">
              <h2 className="text-2xl lg:text-3xl font-bold mb-6" style={{ color: '#442D1C' }}>Borrow Book</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ borderBottom: '2px solid #E8D1A7' }}>
                      <th className="text-left py-4 px-4 font-semibold" style={{ color: '#442D1C' }}>No</th>
                      <th className="text-left py-4 px-4 font-semibold" style={{ color: '#442D1C' }}>Judul Buku</th>
                      <th className="text-left py-4 px-4 font-semibold" style={{ color: '#442D1C' }}>Tanggal Pinjam</th>
                      <th className="text-left py-4 px-4 font-semibold" style={{ color: '#442D1C' }}>Tanggal Kembali</th>
                      <th className="text-left py-4 px-4 font-semibold" style={{ color: '#442D1C' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b hover:bg-orange-50 transition-colors">
                      <td className="py-4 px-4">1</td>
                      <td className="py-4 px-4 font-medium">Anxious People</td>
                      <td className="py-4 px-4">01 Oct 2025</td>
                      <td className="py-4 px-4">08 Oct 2025</td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          Dipinjam
                        </span>
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-orange-50 transition-colors">
                      <td className="py-4 px-4">1</td>
                      <td className="py-4 px-4 font-medium">Anxious People</td>
                      <td className="py-4 px-4">01 Oct 2025</td>
                      <td className="py-4 px-4">08 Oct 2025</td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          Dipinjam
                        </span>
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-orange-50 transition-colors">
                      <td className="py-4 px-4">2</td>
                      <td className="py-4 px-4 font-medium">The Great Gatsby</td>
                      <td className="py-4 px-4">25 Sep 2025</td>
                      <td className="py-4 px-4">02 Oct 2025</td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                          Dikembalikan
                        </span>
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-orange-50 transition-colors">
                      <td className="py-4 px-4">3</td>
                      <td className="py-4 px-4 font-medium">A Man Called Ove</td>
                      <td className="py-4 px-4">20 Sep 2025</td>
                      <td className="py-4 px-4">27 Sep 2025</td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                          Dikembalikan
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;