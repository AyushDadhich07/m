import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginSuccess = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Get query parameters from the URL
        const queryParams = new URLSearchParams(window.location.search);
        const token = queryParams.get('token');
        const email = queryParams.get('email');

        console.log(token);
        console.log(email);

        if (token) {
            localStorage.setItem('token', token);
            localStorage.setItem('userEmail', email);
            console.log("Navigating to /documentpage");
            navigate('/documentpage'); // Adjust this route according to your app
        }
    }, [navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white rounded-lg shadow-md p-8 max-w-sm w-full text-center">
                <h1 className="text-2xl font-semibold mb-4">Login Successful</h1>
            </div>
        </div>
    );
};

export default LoginSuccess;
