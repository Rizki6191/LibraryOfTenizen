import React from "react";
import RegisterForm from "../components/auth/RegisterForm";
import { RegisterHelmet } from "../components/SEOHelmet";

export default function Register() {
    return (
        <>
            <RegisterHelmet />
            <RegisterForm />
        </>
    );
}