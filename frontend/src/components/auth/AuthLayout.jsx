import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AuthLayout = ({ children, title, subtitle }) => {
    const location = useLocation();
    const isLogin = location.pathname === '/login';

    return (
        <div className="min-h-screen bg-primary-50 relative overflow-hidden flex flex-col items-center justify-center p-4">
            {/* Ambient Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-200/30 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-300/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>

            {/* Animated Wave Background */}
            <div className="wave-bg"></div>

            <div className="relative z-10 w-full max-w-[440px] animate-card-slide">
                {/* Main Card */}
                <div className="glass-card overflow-hidden">
                    <div className="p-6 sm:p-8">
                        {/* Logo & Header Inside Card */}
                        <div className="text-center mb-6">
                            <div className="logo-container mx-auto">
                                <span className="text-3xl">📚</span>
                            </div>
                            <h1 className="text-3xl font-bold text-primary-900 mb-2 mt-4 tracking-tight">
                                {title}
                            </h1>
                            {subtitle && (
                                <p className="text-primary-600 text-base font-medium leading-relaxed">
                                    {subtitle}
                                </p>
                            )}
                        </div>

                        {/* Auth Navigation Tabs - Now below header */}
                        <div className="flex p-1.5 bg-primary-100/50 border border-primary-100/50 rounded-2xl mb-8">
                            <Link
                                to="/login"
                                className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold text-center transition-all duration-300 ${isLogin
                                        ? 'bg-white text-primary-900 shadow-sm ring-1 ring-primary-900/5'
                                        : 'text-primary-600 hover:text-primary-800'
                                    }`}
                            >
                                Masuk
                            </Link>
                            <Link
                                to="/register"
                                className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold text-center transition-all duration-300 ${!isLogin
                                        ? 'bg-white text-primary-900 shadow-sm ring-1 ring-primary-900/5'
                                        : 'text-primary-600 hover:text-primary-800'
                                    }`}
                            >
                                Daftar
                            </Link>
                        </div>

                        <div className="animate-fade-in-up">
                            {children}
                        </div>
                    </div>
                </div>

                {/* Footer Link */}
                <div className="text-center mt-8">
                    <p className="text-primary-700 text-sm">
                        © 2025 LibraryOfTenizen
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;