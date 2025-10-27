import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/login";

const LoginForm = () => {
    const [formData, setFormData] = useState({
        email: "", 
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        if (error) setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const payload = {
            email: formData.email,
            password: formData.password,
        };

        try {
            const response = await axios.post(API_URL, payload);
            
            if (response.data.success) {
                console.log("Login successful:", response.data);
                
                // SIMPAN DATA KE LOCALSTORAGE
                localStorage.setItem('userToken', response.data.token);
                
                // Pastikan data user disimpan dengan struktur yang konsisten
                const userData = response.data.data || {};
                localStorage.setItem('userData', JSON.stringify({
                    id: userData.id || null,
                    name: userData.name || 'Anggota Perpustakaan',
                    role: userData.role || 'member',
                    email: userData.email || '',
                    nis: userData.nis || '',
                    major: userData.major || '',
                    grade: userData.grade || '',
                    created_at: userData.created_at || new Date().toISOString()
                }));

                // Navigate to dashboard
                navigate('/dashboard'); 
            } else {
                setError(response.data.message || "Login failed due to an unknown error.");
            }
        } catch (err) {
            console.error("Login API Error:", err);
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError("Failed to connect to the server. Please check your credentials and try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword((s) => !s);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center p-4">
            {/* Main Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full border border-amber-200">
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

                    {/* Login/Register Tabs */}
                    <div className="flex bg-amber-100 rounded-lg p-1 mb-6">
                        <Link 
                            to="/login" 
                            className="flex-1 bg-amber-700 text-white py-2 px-4 rounded-md text-sm font-semibold text-center transition-colors"
                        >
                            Login
                        </Link>
                        <Link 
                            to="/register" 
                            className="flex-1 text-amber-700 py-2 px-4 rounded-md text-sm font-semibold text-center hover:bg-amber-200 transition-colors"
                        >
                            Register
                        </Link>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-center gap-2 text-red-700 text-sm">
                        <div className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-2 h-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <span className="font-medium">{error}</span>
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        {/* Email Input */}
                        <div>
                            <label className="block text-amber-800 text-sm font-semibold mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <input 
                                    type="email"
                                    className="block w-full pl-10 pr-3 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors placeholder-amber-400"
                                    placeholder="Masukkan email Anda"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required 
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div>
                            <label className="block text-amber-800 text-sm font-semibold mb-2">
                                Kata Sandi
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="block w-full pl-10 pr-10 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors placeholder-amber-400"
                                    placeholder="Masukkan kata sandi"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-amber-500 hover:text-amber-700 transition-colors"
                                    onClick={togglePasswordVisibility}
                                    disabled={loading}
                                    aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                                >
                                    {showPassword ? (
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Login Button */}
                    <button 
                        type="submit" 
                        className="w-full bg-amber-700 text-white py-3 px-4 rounded-lg font-semibold hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Memproses...</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                </svg>
                                <span>Masuk</span>
                            </>
                        )}
                    </button>

                    {/* Register Link */}
                    <div className="text-center">
                        <p className="text-amber-700 text-sm">
                            Belum punya akun?{" "}
                            <Link 
                                to="/register" 
                                className="font-semibold text-amber-600 hover:text-amber-800 transition-colors"
                            >
                                Daftar disini
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;