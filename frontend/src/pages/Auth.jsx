// ============================================
// 1. Auth.jsx (Updated)
// ============================================
import React from "react";
import "../styles/auth.css";
import { Link } from "react-router-dom";
import { AuthHelmet } from "../components/SEOHelmet"; // Import helmet

export default function Auth() {
    return (
        <>
            <AuthHelmet /> {/* Tambahkan helmet */}
            <div className="login-page">
                {/* Wave gradient */}
                <div className="wave" aria-hidden="true"></div>

                {/* Konten */}
                <div className="content">
                    <div className="container-fluid">
                        <div className="row min-vh-100 align-items-center justify-content-center">
                            {/* HOME CONTENT DI TENGAH */}
                            <div className="col-12 col-md-8 col-lg-6 col-xl-5 d-flex align-items-center justify-content-center">
                                <div className="card login-card">
                                    <div className="text-center mb-4">
                                        <img
                                            src="https://via.placeholder.com/120x40.png?text=iPush"
                                            alt="iPush Logo"
                                            className="logo"
                                        />
                                        <h4 className="fw-bold">Selamat Datang</h4>
                                        <p className="subtitle">Sistem Perpustakaan Digital</p>
                                    </div>

                                    <div className="text-center mb-4">
                                        <p className="mb-4">
                                            Pinjam buku dengan mudah, dan kelola peminjaman Anda dalam satu platform.
                                        </p>
                                    </div>

                                    <div className="d-grid gap-3">
                                        <Link to="/login" className="btn btn-primary">
                                            Masuk ke Akun
                                        </Link>
                                        <Link to="/register" className="btn btn-outline-primary">
                                            Daftar Akun Baru
                                        </Link>
                                    </div>

                                    <div className="row text-center mt-4">
                                        <div className="col-12">
                                            <small className="text-muted">
                                                © 2025 LibraryOfTeniizen.
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}