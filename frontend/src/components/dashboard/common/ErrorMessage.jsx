import React from 'react';

const ErrorMessage = ({ message, type = "warning" }) => {
    const isSuccess = message.includes("berhasil");
    
    return (
        <div className={`p-4 mb-6 rounded-xl font-medium ${
            isSuccess 
                ? "bg-green-100 border border-green-300 text-green-800"
                : "bg-yellow-100 border border-yellow-300 text-yellow-800"
        }`}>
            <p>{isSuccess ? "✅" : "⚠️"} {message}</p>
        </div>
    );
};

export default ErrorMessage;