import React from 'react';

const AuthLayout = ({ children, title, subtitle }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 font-inter relative overflow-hidden">
            {/* Very subtle background elements */}
            <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-br from-primary-900 to-primary-400 opacity-3 animate-wave-float"></div>
            <div className="absolute inset-0 bg-pattern opacity-10"></div>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="min-h-screen flex items-center justify-center py-12">
                    <div className="w-full max-w-md">
                        <div className="bg-white/95 backdrop-blur-md border border-white/30 rounded-2xl shadow-soft p-8 sm:p-10 animate-card-slide">
                            {/* <div className="text-center mb-8">
                                <div className="flex justify-center mb-6">
                                    <div className="w-20 h-20 bg-gradient-to-br from-primary-900 to-primary-400 rounded-full flex items-center justify-center text-white text-3xl shadow-hard animate-logo-float hover:scale-110 hover:rotate-6 transition-all duration-400">
                                        📚
                                    </div>
                                </div>
                                <h1 className="text-3xl font-bold bg-gradient-to-br from-primary-900 to-primary-400 bg-clip-text text-transparent mb-2">
                                    {title}
                                </h1>
                                {subtitle && (
                                    <p className="text-primary-700 text-lg font-medium">
                                        {subtitle}
                                    </p>
                                )}
                            </div> */}
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;