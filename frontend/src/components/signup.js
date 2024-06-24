import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

  const navigate = useNavigate();


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(formData);
      const response = await axios.post('http://localhost:8000/api/signup/', formData);
      console.log(response.data);
      navigate('/login'); // Handle success response
    } catch (error) {
      console.error('Error:', error); // Handle error
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-[#0077b5] text-3xl font-bold text-center mb-4">LinkedIn</h1>
        <h2 className="text-gray-700 text-xl text-center mb-6">Make the most of your professional life</h2>
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              placeholder="First name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              placeholder="Last name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="email"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="mb-6">
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              type="password"
              placeholder="Password (6 or more characters)"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <p className="text-gray-600 text-xs italic mb-4">
            By clicking Join now, you agree to LinkedIn's User Agreement, Privacy Policy, and Cookie Policy.
          </p>
          <div className="flex items-center justify-between">
            <button
              className="bg-[#0077b5] hover:bg-[#006097] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              type="submit"
            >
              Join now
            </button>
          </div>
        </form>
        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-600">or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
        <p className="text-center">
          <a className="text-[#0077b5] hover:underline" href="#">
            Already on LinkedIn? Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
