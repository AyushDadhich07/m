import React, { useState } from 'react';
import axios from 'axios';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import GoogleLogin  from './google.js';

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();



  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log(formData);
      const response = await axios.post('https://m-zbr0.onrender.com/api/signup/', formData);
      // const response = await axios.post('http://localhost:8001/api/signup/', formData);
      console.log(response.data);
      setLoading(false);
      navigate('/login');
    } catch (error) {
      setLoading(false);
      console.error('Error:', error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      {loading && (
        <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
        <div class="w-16 h-16 border-8 border-white/30 border-t-white rounded-full animate-spin"></div>
      </div>
      
      )}
      <div className="bg-black text-white w-full md:w-1/2 p-8 flex flex-col justify-center items-center md:items-start">
        <div className="mb-8">
          <svg className="w-16 h-16 md:w-20 md:h-20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
          </svg>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3 text-center md:text-left">Project M</h1>
        <p className="text-lg text-gray-300 text-center md:text-left">India's first ESG report analysing company</p>
      </div>
      <div className="bg-white w-full md:w-1/2 p-8 flex flex-col justify-center overflow-y-auto">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6">Sign up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-md md:text-lg text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              placeholder="First name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>
          <div>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-md md:text-lg text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              placeholder="Last name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
          <div>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-md md:text-lg text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="email"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-md md:text-lg text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="password"
              placeholder="Password (6 or more characters)"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <p className="text-gray-600 text-xs italic">
            By clicking Sign up, you agree to our User Agreement, Privacy Policy, and Cookie Policy.
          </p>
          <div className="pt-2">
            <button
              className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full text-md md:text-lg"
              type="submit"
            >
              Sign up
            </button>
          </div>
        </form>
        {/* <GoogleOAuthProvider clientId="407596730605-tkapgflq4sue875k83d8vqakr33fnoul.apps.googleusercontent.com"> */}
      {/* <div className="App"> */}
        {/* <GoogleAuth /> */}
      {/* </div> */}
    {/* </GoogleOAuthProvider> */}
        <div className="mt-4 text-center">
        <GoogleLogin/> 
          <p className="text-sm">
            Already have an account? 
            <a href="/login" className="text-black hover:text-gray-800 font-bold ml-1">
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;