import React from "react";
import AuthLayout from "../components/auth/AuthLayout";
import RegisterForm from "../components/auth/RegisterForm";
import { RegisterHelmet } from "../components/SEOHelmet";

export default function Register() {
    return (
        <>
            <RegisterHelmet />
            <AuthLayout title="Daftar Akun" subtitle="Isi data diri Anda untuk membuat akun">
                <RegisterForm />
            </AuthLayout>
        </>
    );
}