import React from "react";
import AuthLayout from "../components/auth/AuthLayout";
import LoginForm from "../components/auth/LoginForm";
import { LoginHelmet } from "../components/SEOHelmet";

export default function Login() {
    return (
        <>
            <LoginHelmet />
            <AuthLayout title="Masuk Akun" subtitle="Silakan masuk untuk melanjutkan">
                <LoginForm />
            </AuthLayout>
        </>
    );
}