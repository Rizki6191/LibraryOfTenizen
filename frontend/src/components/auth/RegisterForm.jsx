import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/register";

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        nis: "",
        major: "",
        grade: "",
        password: "",
        confirmPassword: "",
        role: "member",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();

    // Handle change untuk semua input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear error ketika user mulai mengetik
        if (error) setError(null);
    };

    // Handle NIS input - hanya angka
    const handleNisChange = (e) => {
        const value = e.target.value.replace(/\D/g, ''); // Hanya angka
        setFormData(prev => ({
            ...prev,
            nis: value.slice(0, 7) // Maksimal 7 digit
        }));
    };

    // Validasi form
    const validateForm = () => {
        // Validasi password match
        if (formData.password !== formData.confirmPassword) {
            setError("Kata Sandi dan Konfirmasi Kata Sandi tidak cocok.");
            return false;
        }

        // Validasi panjang password
        if (formData.password.length < 6) {
            setError("Kata sandi harus minimal 6 karakter.");
            return false;
        }

        // Validasi email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError("Format email tidak valid.");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        // Validasi client-side
        if (!validateForm()) {
            return;
        }

        setLoading(true);

        // Prepare data untuk API (exclude confirmPassword)
        const { confirmPassword, ...apiPayload } = formData;

        try {
            const response = await axios.post(API_URL, apiPayload);
            
            if (response.data.success) {
                // Registration successful
                setSuccess(true);
                setTimeout(() => {
                    navigate("/login", { 
                        state: { message: "Pendaftaran berhasil! Silakan masuk." }
                    });
                }, 1500);
            } else {
                setError(response.data.message || "Registrasi gagal karena kesalahan yang tidak diketahui.");
            }
        } catch (err) {
            console.error("Registration API Error:", err);
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError("Terjadi kesalahan jaringan. Periksa koneksi internet Anda.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full border border-amber-200">
                {/* Header */}
                <div className="text-center mb-8">
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
                            className="flex-1 text-amber-700 py-2 px-4 rounded-md text-sm font-semibold text-center hover:bg-amber-200 transition-colors"
                        >
                            Login
                        </Link>
                        <Link 
                            to="/register" 
                            className="flex-1 bg-amber-700 text-white py-2 px-4 rounded-md text-sm font-semibold text-center transition-colors"
                        >
                            Register
                        </Link>
                    </div>
                </div>

                {/* Success Message */}
                {success && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 flex items-center gap-2 text-green-700 text-sm">
                        <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-2 h-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <span className="font-medium">✅ Pendaftaran berhasil! Mengarahkan ke halaman masuk...</span>
                    </div>
                )}

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

                {/* Register Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-3">
                        {/* Full Name Input */}
                        <div>
                            <label className="block text-amber-800 text-sm font-semibold mb-2">
                                Nama Lengkap
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <input 
                                    type="text"
                                    className="block w-full pl-10 pr-3 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors placeholder-amber-400"
                                    placeholder="Masukkan nama lengkap"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required 
                                    disabled={loading}
                                />
                            </div>
                        </div>

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
                                    placeholder="nama@email.com"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required 
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* NIS Input */}
                        <div>
                            <label className="block text-amber-800 text-sm font-semibold mb-2">
                                NIS
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <input 
                                    type="text"
                                    className="block w-full pl-10 pr-3 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors placeholder-amber-400"
                                    placeholder="Masukkan NIS"
                                    name="nis"
                                    value={formData.nis}
                                    onChange={handleNisChange}
                                    maxLength="7"
                                    pattern="\d{7}"
                                    inputMode="numeric"
                                    required 
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Major and Grade Row */}
                        <div className="grid grid-cols-2 gap-3">
                            {/* Grade Input */}
                            <div>
                                <label className="block text-amber-800 text-sm font-semibold mb-2">
                                    Kelas
                                </label>
                                <div className="relative">
                                    <select
                                        className="block w-full pl-3 pr-3 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors appearance-none bg-white"
                                        name="grade"
                                        value={formData.grade}
                                        onChange={handleChange}
                                        required
                                        disabled={loading}
                                    >
                                        <option value="">Pilih Kelas</option>
                                        <option value="10">Kelas 10</option>
                                        <option value="11">Kelas 11</option>
                                        <option value="12">Kelas 12</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Major Input */}
                            <div>
                                <label className="block text-amber-800 text-sm font-semibold mb-2">
                                    Jurusan
                                </label>
                                <div className="relative">
                                    <select
                                        className="block w-full pl-3 pr-3 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors appearance-none bg-white"
                                        name="major"
                                        value={formData.major}
                                        onChange={handleChange}
                                        required
                                        disabled={loading}
                                    >
                                        <option value="">Pilih Jurusan</option>
                                        <option value="RPL">RPL</option>
                                        <option value="BR">BR</option>
                                        <option value="BD">BD</option>
                                        <option value="AKL1">AKL1</option>
                                        <option value="AKL2">AKL2</option>
                                        <option value="ML">ML</option>
                                        <option value="MP">MP</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
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
                                    minLength="6"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-amber-500 hover:text-amber-700 transition-colors"
                                    onClick={() => setShowPassword(!showPassword)}
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
                            <div className="text-amber-600 text-xs mt-1">Kata sandi minimal 6 karakter</div>
                        </div>

                        {/* Confirm Password Input */}
                        <div>
                            <label className="block text-amber-800 text-sm font-semibold mb-2">
                                Konfirmasi Kata Sandi
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    className="block w-full pl-10 pr-10 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors placeholder-amber-400"
                                    placeholder="Ulangi kata sandi"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                    minLength="6"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-amber-500 hover:text-amber-700 transition-colors"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    disabled={loading}
                                    aria-label={showConfirmPassword ? "Sembunyikan konfirmasi kata sandi" : "Tampilkan konfirmasi kata sandi"}
                                >
                                    {showConfirmPassword ? (
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

                    {/* Register Button */}
                    <button 
                        type="submit" 
                        className="w-full bg-amber-700 text-white py-3 px-4 rounded-lg font-semibold hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Mendaftarkan...</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                                <span>Daftar Sekarang</span>
                            </>
                        )}
                    </button>

                    {/* Login Link */}
                    <div className="text-center">
                        <p className="text-amber-700 text-sm">
                            Sudah punya akun?{" "}
                            <Link 
                                to="/login" 
                                className="font-semibold text-amber-600 hover:text-amber-800 transition-colors"
                            >
                                Masuk disini
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterForm;