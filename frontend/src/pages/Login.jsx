// ============================================
// 2. Login.jsx (Updated)
// ============================================
import React, { useState } from "react";
import "../styles/auth.css";
import { Link } from "react-router-dom";
import { LoginHelmet } from "../components/SEOHelmet"; // Import helmet

export default function Login() {
    const [show, setShow] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    return (
        <>
            <LoginHelmet /> {/* Tambahkan helmet */}
            <div className="login-page">
                {/* Wave gradient */}
                <div className="wave" aria-hidden="true"></div>

                {/* Konten */}
                <div className="content">
                    <div className="container-fluid">
                        {/* <div className="row min-vh-100 align-items-center justify-content-center"> */}
                            {/* KIRI: ilustrasi (hanya desktop) */}
                            <div className="col-md-6 d-none d-md-flex align-items-center justify-content-center">
                                <div className="illustration-wrap">
                                    {/* <img src={logo} alt="Illustration" className="img-fluid" /> */}
                                </div>
                            </div>

                            {/* KANAN: form */}
                            <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                                <div className="card login-card">
                                    <div className="text-center mb-4">
                                        <h4 className="fw-bold">Masuk</h4>
                                        <p className="subtitle">atau Buat Akun</p>
                                    </div>

                                    <form>
                                        <div className="mb-3">
                                            <input 
                                                type="email" 
                                                className="form-control" 
                                                placeholder="Email" 
                                                required 
                                            />
                                        </div>

                                        <div className="mb-3 input-group">
                                            <input
                                                type={show ? "text" : "password"}
                                                className="form-control"
                                                placeholder="Kata Sandi"
                                                required
                                            />
                                            <button
                                                className="btn btn-outline-secondary"
                                                type="button"
                                                aria-label={show ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                                                onClick={() => setShow((s) => !s)}
                                            >
                                                <i className={show ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                                            </button>
                                        </div>

                                        <div className="d-flex justify-content-between align-items-center mb-4">
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="rememberMe"
                                                    checked={rememberMe}
                                                    onChange={(e) => setRememberMe(e.target.checked)}
                                                />
                                                <label className="form-check-label" htmlFor="rememberMe">
                                                    Ingat saya
                                                </label>
                                            </div>
                                            <a href="#" className="forgot-password">
                                                Lupa Kata Sandi?
                                            </a>
                                        </div>

                                        <button type="submit" className="btn btn-primary">Masuk</button>

                                        <div className="text-center mt-3">
                                            <p className="small mb-0">
                                                Belum punya akun? 
                                                <Link to="/register" className="auth-link">Daftar disini</Link>
                                            </p>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        {/* </div> */}
                    </div>
                </div>
            </div>
        </>
    );
}