import React, { useState } from "react";
import "../styles/auth.css";
import { Link, useNavigate } from "react-router-dom";
import { RegisterHelmet } from "../components/SEOHelmet";

export default function Register() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // 1. State for form data, including all required API fields
    const [formData, setFormData] = useState({
        name: "",
        nis: "",
        major: "",
        grade: "",
        email: "",
        password: "",
        confirmPassword: "", // Added for client-side validation
        role: "member", // Default role as per API payload
    });

    // State for handling loading/submission status and errors
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 2. Handle change for all form inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // 3. Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // Basic client-side validation: Check if passwords match
        if (formData.password !== formData.confirmPassword) {
            setError("Kata Sandi dan Konfirmasi Kata Sandi tidak cocok.");
            return;
        }

        // Prepare data for API, excluding confirmPassword
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
                // alert("Pendaftaran Berhasil! Silakan masuk.");
                navigate("/login"); // Redirect to login page
            } else {
                // Registration failed (e.g., NIS or email already exists)
                // Use the message from the backend, or a generic fallback
                const errorMessage = result.message || "Pendaftaran gagal. Silakan coba lagi.";
                setError(errorMessage);
            }
        } catch (err) {
            // Network or other unexpected error
            setError("Terjadi kesalahan jaringan atau server.");
            console.error("Registration error:", err);
        } finally {
            setLoading(false);
        }
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
                            {/* KANAN: form */}
                            <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                                <div className="card login-card">
                                    <div className="text-center mb-4">
                                        <h4 className="fw-bold">Daftar Akun</h4>
                                    </div>

                                    {/* Attach handleSubmit to the form's onSubmit */}
                                    <form onSubmit={handleSubmit}>

                                        {/* Display error message if any */}
                                        {error && (
                                            <div className="alert alert-danger" role="alert">
                                                {error}
                                            </div>
                                        )}

                                        <div className="mb-3">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Nama Lengkap"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="NIS"
                                                name="nis"
                                                value={formData.nis}
                                                onChange={handleChange}
                                                maxLength="7" // Changed to 7 to match example data (2020101 is 7 digits)
                                                pattern="\d*" // Client-side validation for numeric input
                                                inputMode="numeric" // Better mobile keyboard
                                                required
                                            />
                                        </div>

                                        <div className="row g-2 mb-3">
                                            <div className="col-6">
                                                <select
                                                    className="form-select"
                                                    name="grade"
                                                    value={formData.grade}
                                                    onChange={handleChange}
                                                    required
                                                >
                                                    <option value="">Pilih Kelas</option>
                                                    <option value="10">10</option>
                                                    <option value="11">11</option>
                                                    <option value="12">12</option>
                                                </select>
                                            </div>
                                            <div className="col-6">
                                                <select
                                                    className="form-select"
                                                    name="major"
                                                    value={formData.major}
                                                    onChange={handleChange}
                                                    required
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

                                        <div className="mb-3">
                                            <input
                                                type="email"
                                                className="form-control"
                                                placeholder="Email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        <div className="mb-3 input-group">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                className="form-control"
                                                placeholder="Kata Sandi"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                required
                                            />
                                            <button
                                                className="btn btn-outline-secondary"
                                                type="button"
                                                aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                                                onClick={() => setShowPassword((s) => !s)}
                                            >
                                                <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                                            </button>
                                        </div>

                                        <div className="mb-4 input-group">
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                className="form-control"
                                                placeholder="Konfirmasi Kata Sandi"
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                required
                                            />
                                            <button
                                                className="btn btn-outline-secondary"
                                                type="button"
                                                aria-label={showConfirmPassword ? "Sembunyikan konfirmasi kata sandi" : "Tampilkan konfirmasi kata sandi"}
                                                onClick={() => setShowConfirmPassword((s) => !s)}
                                            >
                                                <i className={showConfirmPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                                            </button>
                                        </div>

                                        <button
                                            type="submit"
                                            className="btn btn-primary mb-3"
                                            disabled={loading} // Disable button while submission is in progress
                                        >
                                            {loading ? 'Mendaftar...' : 'Daftar'}
                                        </button>

                                        <div className="text-center">
                                            <p className="small mb-0">
                                                Sudah punya akun?
                                                <Link to="/login" className="auth-link">Masuk disini</Link>
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