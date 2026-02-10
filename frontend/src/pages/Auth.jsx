import React from "react";
import AuthForm from "../components/auth/AuthForm";
import { AuthHelmet } from "../components/SEOHelmet";

export default function Auth() {
    return (
        <>
            <AuthHelmet />
            <AuthForm />
        </>
    );
}