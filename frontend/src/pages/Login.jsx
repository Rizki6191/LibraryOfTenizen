// ============================================
// 3. Login.jsx (Improved for better integration)
// ============================================
import React, { useState } from "react";
import "../styles/auth.css";
import { Link, useNavigate } from "react-router-dom";
import { LoginHelmet } from "../components/SEOHelmet";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/login";

export default function Login() {
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
        <>
            <LoginHelmet />
            <div className="login-page">
                <div className="wave" aria-hidden="true"></div>

                <div className="content">
                    <div className="container-fluid">
                        <div className="row min-vh-100 align-items-center justify-content-center">
                            <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                                <div className="card login-card">
                                    <div className="text-center mb-4">
                                        <h4 className="fw-bold">Masuk Akun</h4>
                                    </div>
                                    
                                    {error && (
                                        <div className="alert alert-danger" role="alert">
                                            {error}
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <input 
                                                type="text"
                                                className="form-control" 
                                                placeholder="Email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required 
                                            />
                                        </div>

                                        <div className="mb-4 input-group">
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
                                                onClick={togglePasswordVisibility}
                                                disabled={loading}
                                            >
                                                <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                                            </button>
                                        </div>

                                        <button 
                                            type="submit" 
                                            className="btn btn-primary mb-3 w-100" 
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                    <span> Loading...</span>
                                                </>
                                            ) : (
                                                "Masuk"
                                            )}
                                        </button>

                                        <div className="text-center">
                                            <p className="small mb-0">
                                                Belum punya akun? 
                                                <Link to="/register" className="auth-link">Daftar disini</Link>
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