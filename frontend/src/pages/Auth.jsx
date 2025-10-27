import React from "react";
import AuthLayout from "../components/auth/AuthLayout";
import AuthForm from "../components/auth/AuthForm";
import { AuthHelmet } from "../components/SEOHelmet";

export default function Auth() {
    return (
        <>
            <AuthHelmet />
            <AuthLayout title="Selamat Datang" subtitle="Sistem Perpustakaan Digital">
                <AuthForm />
            </AuthLayout>
        </>
    );
}