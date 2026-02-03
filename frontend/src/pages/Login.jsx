import React from "react";
import LoginForm from "../components/auth/LoginForm";
import { LoginHelmet } from "../components/SEOHelmet";

export default function Login() {
    return (
        <>
            <LoginHelmet />
            <LoginForm />
        </>
    );
}