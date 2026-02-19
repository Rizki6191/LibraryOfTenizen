import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import AuthLayout from "./AuthLayout";

const API_URL = import.meta.env.VITE_API_BASE_URL + "/register";
// aneh
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (error) setError(null);
    };

    const handleNisChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        setFormData(prev => ({
            ...prev,
            nis: value.slice(0, 7)
       }));
    };

    const validateForm = () => {
        if (formData.password !== formData.confirmPassword) {
            setError("Konfirmasi kata sandi tidak cocok.");
            return false;
        }
        if (formData.password.length < 6) {
            setError("Kata sandi minimal 6 karakter.");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        if (!validateForm()) return;
        setLoading(true);

        const { confirmPassword, ...apiPayload } = formData;

        try {
            const response = await axios.post(API_URL, apiPayload);
            if (response.data.success) {
                setSuccess(true);
                setTimeout(() => {
                    navigate("/login", {
                        state: { message: "Pendaftaran berhasil! Silakan masuk." }
                    });
                }, 1500);
            } else {
                setError(response.data.message || "Registrasi gagal.");
            }
        } catch (err) {
            console.error("Registration API Error:", err);
            setError(err.response?.data?.message || "Terjadi kesalahan jaringan.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Daftar Akun"
            subtitle="Lengkapi data diri untuk bergabung"
        >
            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Status Messages */}
                {success && (
                    <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex items-start gap-3 text-green-700 text-sm animate-fade-in">
                        <svg className="w-5 h-5 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="font-medium">Pendaftaran berhasil! Mengalihkan...</span>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3 text-red-700 text-sm animate-shake">
                        <svg className="w-5 h-5 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium leading-relaxed">{error}</span>
                    </div>
                )}

                <div className="space-y-4">
                    {/* Basic Info */}
                    <div>
                        <label className="block text-primary-900 text-sm font-semibold mb-2">Nama Lengkap</label>
                        <div className="input-group">
                            <div className="input-icon"><svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg></div>
                            <input type="text" className="form-input" placeholder="Nama Lengkap" name="name" value={formData.name} onChange={handleChange} required disabled={loading} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-primary-900 text-sm font-semibold mb-2">Email</label>
                        <div className="input-group">
                            <div className="input-icon"><svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg></div>
                            <input type="email" className="form-input" placeholder="nama@email.com" name="email" value={formData.email} onChange={handleChange} required disabled={loading} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-primary-900 text-sm font-semibold mb-2">NIS</label>
                            <div className="input-group">
                                <div className="input-icon"><svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg></div>
                                <input type="text" className="form-input" placeholder="NIS" name="nis" value={formData.nis} onChange={handleNisChange} maxLength="7" required disabled={loading} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-primary-900 text-sm font-semibold mb-2">Kelas</label>
                                <select className="form-input !pl-3" name="grade" value={formData.grade} onChange={handleChange} required disabled={loading}>
                                    <option value="">Pilih</option>
                                    <option value="10">10</option>
                                    <option value="11">11</option>
                                    <option value="12">12</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-primary-900 text-sm font-semibold mb-2">Jurusan</label>
                                <select className="form-input !pl-3" name="major" value={formData.major} onChange={handleChange} required disabled={loading}>
                                    <option value="">Pilih</option>
                                    <option value="RPL">RPL</option>
                                    <option value="BR">BR</option>
                                    <option value="BD">BD</option>
                                    <option value="AKL">AKL</option>
                                    <option value="ML">ML</option>
                                    <option value="MP">MP</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-primary-900 text-sm font-semibold mb-2">Kata Sandi</label>
                            <div className="input-group">
                                <input type={showPassword ? "text" : "password"} className="form-input !pl-4" placeholder="••••••••" name="password" value={formData.password} onChange={handleChange} required disabled={loading} minLength="6" />
                                <button type="button" className="absolute inset-y-0 right-0 pr-3 text-primary-400" onClick={() => setShowPassword(!showPassword)}>{showPassword ? "🙈" : "👁️"}</button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-primary-900 text-sm font-semibold mb-2">Konfirmasi</label>
                            <div className="input-group">
                                <input type={showConfirmPassword ? "text" : "password"} className="form-input !pl-4" placeholder="••••••••" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required disabled={loading} minLength="6" />
                                <button type="button" className="absolute inset-y-0 right-0 pr-3 text-primary-400" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>{showConfirmPassword ? "🙈" : "👁️"}</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-2">
                    <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed" disabled={loading}>
                        {loading ? (
                            <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div><span>Mendaftarkan...</span></>
                        ) : (
                            <><span>Buat Akun Sekarang</span><svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg></>
                        )}
                    </button>
                </div>
            </form>
        </AuthLayout>
    );
};

export default RegisterForm;