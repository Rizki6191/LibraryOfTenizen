import React from 'react';

const LoadingSpinner = ({ message = "Memuat..." }) => {
    return (
        <div className="text-center p-12 bg-white rounded-3xl shadow-xl">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-t-4 border-amber-500 border-opacity-25 rounded-full mb-4"></div>
            <p className="text-lg font-medium text-gray-700">{message}</p>
        </div>
    );
};

export default LoadingSpinner;