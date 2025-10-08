// ============================================
// 3. Register.jsx (Updated)
// ============================================
import React, { useState } from "react";
import "../styles/auth.css";
import { Link } from "react-router-dom";
import { RegisterHelmet } from "../components/SEOHelmet"; // Import helmet

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <>
            <RegisterHelmet /> {/* Tambahkan helmet */}
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
                                        <p className="subtitle">atau Masuk ke Akun</p>
                                    </div>

                                    <form>
                                        <div className="mb-3">
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                placeholder="Nama Lengkap" 
                                                required 
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                placeholder="NIS" 
                                                maxLength="5"
                                                pattern="\d*"
                                                inputMode="numeric"
                                                required 
                                            />
                                        </div>

                                        <div className="row g-2 mb-3">
                                            <div className="col-6">
                                                <select className="form-select" required>
                                                    <option value="">Pilih Kelas</option>
                                                    <option value="10">10</option>
                                                    <option value="11">11</option>
                                                    <option value="12">12</option>
                                                </select>
                                            </div>
                                            <div className="col-6">
                                                <select className="form-select" required>
                                                    <option value="">Pilih Jurusan</option>
                                                    <option value="TKJ">RPL</option>
                                                    <option value="RPL">BR</option>
                                                    <option value="MM">BD</option>
                                                    <option value="TKRO">ML</option>
                                                    <option value="TBSM">AKL</option>
                                                </select>
                                            </div>
                                        </div>

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
                                                type={showPassword ? "text" : "password"}
                                                className="form-control"
                                                placeholder="Kata Sandi"
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

                                        <button type="submit" className="btn btn-primary mb-3">Daftar</button>

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