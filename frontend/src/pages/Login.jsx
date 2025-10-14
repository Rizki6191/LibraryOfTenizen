// ============================================
// 3. Login.jsx (Implemented for Login)
// ============================================
import React, { useState } from "react";
import "../styles/auth.css";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import { LoginHelmet } from "../components/SEOHelmet"; // Import helmet
import axios from "axios"; // Using axios for easier API calls

// API endpoint URL
const API_URL = "http://127.0.0.1:8000/api/login";

export default function Login() {
    // State for form data (only need email/NIS and password for login)
    const [formData, setFormData] = useState({
        // Based on the provided successful response, the backend accepts an email, 
        // but often for student systems, 'nis' might be used for login. 
        // We'll stick to email and password as it's the most common approach for 'login' forms.
        // If the backend truly only supports 'nis' for login, change 'email' to 'nis' and 
        // update the input type and placeholder accordingly.
        email: "", 
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    // Handle input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        // Clear error on input change
        if (error) setError(null);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null); // Clear previous errors

        // In the API example, the request body includes many registration-related fields 
        // (name, nis, major, grade, role). However, for a *login* endpoint, 
        // typically only identifier (email/NIS) and password are required.
        // We'll send what is generally required for login (email and password).
        // If the backend insists on other fields for the *login* endpoint, you must adjust the payload.
        const payload = {
            email: formData.email,
            password: formData.password,
            // Assuming the 'name', 'nis', 'major', 'grade', and 'role' fields in the
            // example request body are mistakes or for a *register* endpoint, and 
            // not truly needed for the '/api/login' endpoint to work.
            // If they are needed, you should capture them in the form and add them here.
        };

        try {
            const response = await axios.post(API_URL, payload);
            
            // Check for success in the response body
            if (response.data.success) {
                console.log("Login successful:", response.data);
                // 1. Store the token (e.g., in localStorage or a state management library)
                localStorage.setItem('userToken', response.data.token);
                // 2. Store user data if needed
                localStorage.setItem('userData', JSON.stringify(response.data.data));

                // 3. Navigate to a protected route (e.g., dashboard)
                navigate('/dashboard'); 
            } else {
                // Handle API-level errors if 'success' is false
                setError(response.data.message || "Login failed due to an unknown error.");
            }
        } catch (err) {
            console.error("Login API Error:", err);
            // Handle network or non-2xx status code errors
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message); // Display message from API response
            } else {
                setError("Failed to connect to the server or login. Please check your credentials.");
            }
        } finally {
            setLoading(false);
        }
    };

    // Toggle password visibility
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
                                    
                                    {/* Display error message */}
                                    {error && (
                                        <div className="alert alert-danger" role="alert">
                                            {error}
                                        </div>
                                    )}

                                    {/* Updated form for Login (Email/NIS and Password) */}
                                    <form onSubmit={handleSubmit}>
                                        
                                        {/* Input Email/NIS */}
                                        <div className="mb-3">
                                            <input 
                                                type="text" // Can be 'text' for NIS or 'email'
                                                className="form-control" 
                                                placeholder="Email" // Changed placeholder
                                                name="email" // Use 'email' or 'nis' based on what the API accepts
                                                value={formData.email}
                                                onChange={handleChange}
                                                required 
                                            />
                                        </div>

                                        {/* Input Password */}
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

                                        {/* Submit Button */}
                                        <button 
                                            type="submit" 
                                            className="btn btn-primary mb-3 w-100" 
                                            disabled={loading} // Disable button while loading
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