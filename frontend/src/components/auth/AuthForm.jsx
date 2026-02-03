import React from "react";
import { Link } from "react-router-dom";
import AuthLayout from "./AuthLayout";

const AuthForm = () => {
    return (
        <AuthLayout
            title="Selamat Datang"
            subtitle="Sistem Perpustakaan Digital Berbasis Web"
        >
            <div className="space-y-6">
                {/* Features List */}
                <div className="space-y-4">
                    <div className="feature-item flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0 text-xl shadow-inner">
                            📖
                        </div>
                        <div className="flex-1">
                            <h3 className="text-sm font-bold text-primary-900">Koleksi Digital</h3>
                            <p className="text-xs text-primary-600">Akses ribuan buku kapan saja</p>
                        </div>
                    </div>

                    <div className="feature-item flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0 text-xl shadow-inner text-primary-700">
                            ⚡
                        </div>
                        <div className="flex-1">
                            <h3 className="text-sm font-bold text-primary-900">Peminjaman Cepat</h3>
                            <p className="text-xs text-primary-600">Proses instan tanpa antri</p>
                        </div>
                    </div>
                </div>

                {/* Primary Action */}
                <div className="pt-2">
                    <Link to="/login" className="block">
                        <button className="btn-primary w-full flex items-center justify-center gap-2 group">
                            <span>Mulai Sekarang</span>
                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </button>
                    </Link>
                </div>

                {/* Secondary Info */}
                <div className="text-center">
                    <p className="text-primary-600 text-xs leading-relaxed">
                        Nikmati pengalaman membaca yang lebih baik dengan ekosistem digital kami.
                    </p>
                </div>
            </div>
        </AuthLayout>
    );
};

export default AuthForm;