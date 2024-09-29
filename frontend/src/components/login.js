import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import GoogleAuth from './GoogleAuth';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log(formData);
      // const response = await axios.post('https://m-zbr0.onrender.com/api/login/', formData);
      const response = await axios.post('http://localhost:8001/api/login/', formData);
      console.log(response.data);
      const { token, userId } = response.data;
      localStorage.setItem('token', token); 
      localStorage.setItem('userEmail', formData.email);
      setLoading(false);
      navigate('/documentpage');
    } catch (error) {
      setLoading(false);
      console.error('Error:', error);
      if (error.response && error.response.status === 400) {
        alert("Invalid Credentials");
        console.log("Invalid credentials");
      }
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
      <div className="bg-white w-full md:w-1/2 p-8 flex flex-col justify-center">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6">Log in</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-md md:text-lg font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-md md:text-lg text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              name="email"
              placeholder="user@email.com"
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-gray-700 text-md md:text-lg font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-md md:text-lg text-gray-700 mb-2 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              name="password"
              placeholder="Enter your Password"
              onChange={handleChange}
            />
            <a className="inline-block align-baseline font-bold text-sm text-black hover:text-gray-800" href="#">
              Forgot password?
            </a>
          </div>
          <div className="flex flex-col items-center justify-between pt-2">
            <button
              className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mb-3 text-md md:text-lg"
              type="submit"
            >
              Login
            </button>
            <p className="text-sm">
              Don't have an account? 
              <a href="/signup" className="text-black hover:text-gray-800 font-bold ml-1">
                Sign up!
              </a>
            </p>
          </div>
        </form>
        {/* <GoogleOAuthProvider clientId="407596730605-tkapgflq4sue875k83d8vqakr33fnoul.apps.googleusercontent.com"> */}
      {/* <div className="App"> */}
        {/* <GoogleAuth /> */}
      {/* </div> */}
    {/* </GoogleOAuthProvider> */}
      </div>
    </div>
  );
};

export default LoginPage;