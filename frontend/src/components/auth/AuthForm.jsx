import React from "react";
import { Link } from "react-router-dom";

const AuthForm = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center p-4">
            {/* Main Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full border border-amber-200">
                {/* Header */}
                <div className="text-center mb-8">
                    {/* LOT Logo */}
                    <div className="mb-4">
                        <div className="bg-amber-700 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-2">
                            LOT
                        </div>
                        <h1 className="text-amber-800 text-2xl font-bold">
                            Library Of Tenizen
                        </h1>
                    </div>
                    
                    <p className="text-amber-700 text-sm mb-6">
                        Sistem Perpustakaan Digital
                    </p>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <span className="text-amber-800 font-medium text-sm">Koleksi Buku Lengkap</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <span className="text-amber-800 font-medium text-sm">Akses 24/7</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <span className="text-amber-800 font-medium text-sm">Aman & Terpercaya</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                    <Link to="/login" className="block">
                        <button className="w-full bg-amber-700 text-white py-3 px-4 rounded-lg font-semibold hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                            </svg>
                            Masuk ke Akun
                        </button>
                    </Link>
                    
                    <Link to="/register" className="block">
                        <button className="w-full bg-white text-amber-700 py-3 px-4 rounded-lg font-semibold border border-amber-300 hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                            Daftar Akun Baru
                        </button>
                    </Link>
                </div>

                {/* Footer */}
                <div className="text-center mt-6 pt-4 border-t border-amber-200">
                    <small className="text-amber-600 text-xs">
                        © 2025 LibraryOfTenizen - All rights reserved
                    </small>
                </div>
            </div>
        </div>
    );
};

export default AuthForm;