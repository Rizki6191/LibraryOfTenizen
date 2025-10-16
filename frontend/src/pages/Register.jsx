import React, { useState } from "react";
import "../styles/auth.css";
import { Link, useNavigate } from "react-router-dom";
import { RegisterHelmet } from "../components/SEOHelmet";

export default function Register() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // State untuk form data
    const [formData, setFormData] = useState({
        name: "",
        nis: "",
        major: "",
        grade: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "member",
    });

    // State untuk handling loading dan errors
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

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

        // Validasi NIS (7 digit)
        // if (formData.nis.length !== 7) {
        //     setError("NIS harus terdiri dari 7 digit.");
        //     return false;
        // }

        // Validasi email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError("Format email tidak valid.");
            return false;
        }

        return true;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        // Validasi client-side
        if (!validateForm()) {
            return;
        }

        // Prepare data untuk API (exclude confirmPassword)
        const { confirmPassword, ...apiPayload } = formData;

        setLoading(true);

        try {
            const response = await fetch("http://127.0.0.1:8000/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(apiPayload),
            });

            const result = await response.json();

            if (response.ok) {
                // Registration successful
                setSuccess(true);
                setTimeout(() => {
                    navigate("/login", { 
                        state: { message: "Pendaftaran berhasil! Silakan masuk." }
                    });
                }, 1500);
            } else {
                // Registration failed
                const errorMessage = result.message || result.error || "Pendaftaran gagal. Silakan coba lagi.";
                setError(errorMessage);
            }
        } catch (err) {
            console.error("Registration error:", err);
            setError("Terjadi kesalahan jaringan. Periksa koneksi internet Anda.");
        } finally {
            setLoading(false);
        }
    };

    // Handle NIS input - hanya angka
    const handleNisChange = (e) => {
        const value = e.target.value.replace(/\D/g, ''); // Hanya angka
        setFormData(prev => ({
            ...prev,
            nis: value.slice(0, 7) // Maksimal 7 digit
        }));
    };

    return (
        <>
            <RegisterHelmet />
            <div className="login-page">
                {/* Wave gradient */}
                <div className="wave" aria-hidden="true"></div>

                {/* Konten */}
                <div className="content">
                    <div className="container-fluid">
                        <div className="row min-vh-100 align-items-center justify-content-center">
                            {/* Form section */}
                            <div className="col-12 col-md-6 col-lg-5 col-xl-4">
                                <div className="card login-card">
                                    <div className="text-center mb-4">
                                        <h4 className="fw-bold">Daftar Akun</h4>
                                        <p className="text-muted">Isi data diri Anda untuk membuat akun</p>
                                    </div>

                                    <form onSubmit={handleSubmit} noValidate>

                                        {/* Success message */}
                                        {success && (
                                            <div className="alert alert-success" role="alert">
                                                ✅ Pendaftaran berhasil! Mengarahkan ke halaman masuk...
                                            </div>
                                        )}

                                        {/* Error message */}
                                        {error && (
                                            <div className="alert alert-danger" role="alert">
                                                {error}
                                            </div>
                                        )}

                                        {/* Nama Lengkap */}
                                        <div className="mb-3">
                                            {/* <label htmlFor="name" className="form-label small text-muted">
                                                Nama Lengkap
                                            </label> */}
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="name"
                                                placeholder="Masukkan nama lengkap"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                disabled={loading}
                                            />
                                        </div>

                                        {/* NIS */}
                                        <div className="mb-3">
                                            {/* <label htmlFor="nis" className="form-label small text-muted">
                                                NIS
                                            </label> */}
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="nis"
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
                                            {/* <div className="form-text">NIS harus terdiri dari 7 digit angka</div> */}
                                        </div>

                                        {/* Kelas dan Jurusan */}
                                        <div className="row g-2 mb-3">
                                            <div className="col-6">
                                                {/* <label htmlFor="grade" className="form-label small text-muted">
                                                    Kelas
                                                </label> */}
                                                <select
                                                    className="form-select"
                                                    id="grade"
                                                    name="grade"
                                                    value={formData.grade}
                                                    onChange={handleChange}
                                                    required
                                                    disabled={loading}
                                                >
                                                    <option value="">Pilih Kelas</option>
                                                    <option value="10">10</option>
                                                    <option value="11">11</option>
                                                    <option value="12">12</option>
                                                </select>
                                            </div>
                                            <div className="col-6">
                                                {/* <label htmlFor="major" className="form-label small text-muted">
                                                    Jurusan
                                                </label> */}
                                                <select
                                                    className="form-select"
                                                    id="major"
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
                                            </div>
                                        </div>

                                        {/* Email */}
                                        <div className="mb-3">
                                            {/* <label htmlFor="email" className="form-label small text-muted">
                                                Email
                                            </label> */}
                                            <input
                                                type="email"
                                                className="form-control"
                                                id="email"
                                                placeholder="nama@email.com"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                disabled={loading}
                                            />
                                        </div>

                                        {/* Password */}
                                        <div className="mb-3">
                                            {/* <label htmlFor="password" className="form-label small text-muted">
                                                Kata Sandi
                                            </label> */}
                                            <div className="input-group">
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    className="form-control"
                                                    id="password"
                                                    placeholder="Masukkan kata sandi"
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    required
                                                    disabled={loading}
                                                    minLength="6"
                                                />
                                                <button
                                                    className="btn btn-outline-secondary"
                                                    type="button"
                                                    aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                                                    onClick={() => setShowPassword((s) => !s)}
                                                    disabled={loading}
                                                >
                                                    <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                                                </button>
                                            </div>
                                            <div className="form-text">Kata sandi minimal 6 karakter</div>
                                        </div>

                                        {/* Confirm Password */}
                                        <div className="mb-4">
                                            {/* <label htmlFor="confirmPassword" className="form-label small text-muted">
                                                Konfirmasi Kata Sandi
                                            </label> */}
                                            <div className="input-group">
                                                <input
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    className="form-control"
                                                    id="confirmPassword"
                                                    placeholder="Ulangi kata sandi"
                                                    name="confirmPassword"
                                                    value={formData.confirmPassword}
                                                    onChange={handleChange}
                                                    required
                                                    disabled={loading}
                                                    minLength="6"
                                                />
                                                <button
                                                    className="btn btn-outline-secondary"
                                                    type="button"
                                                    aria-label={showConfirmPassword ? "Sembunyikan konfirmasi kata sandi" : "Tampilkan konfirmasi kata sandi"}
                                                    onClick={() => setShowConfirmPassword((s) => !s)}
                                                    disabled={loading}
                                                >
                                                    <i className={showConfirmPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Submit Button */}
                                        <button
                                            type="submit"
                                            className="btn btn-primary w-100 py-2 mb-3"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    Mendaftarkan...
                                                </>
                                            ) : (
                                                'Daftar Sekarang'
                                            )}
                                        </button>

                                        {/* Login Link */}
                                        <div className="text-center">
                                            <p className="small mb-0">
                                                Sudah punya akun?{" "}
                                                <Link to="/login" className="auth-link fw-semibold">
                                                    Masuk disini
                                                </Link>
                                            </p>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}