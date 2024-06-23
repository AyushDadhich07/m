import React from 'react';

const Signup = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-[#0077b5] text-3xl font-bold text-center mb-4">LinkedIn</h1>
        <h2 className="text-gray-700 text-xl text-center mb-6">Make the most of your professional life</h2>
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="First name" />
          </div>
          <div className="mb-4">
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="Last name" />
          </div>
          <div className="mb-4">
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="email" placeholder="Email" />
          </div>
          <div className="mb-6">
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" type="password" placeholder="Password (6 or more characters)" />
          </div>
          <p className="text-gray-600 text-xs italic mb-4">
            By clicking Join now, you agree to LinkedIn's User Agreement, Privacy Policy, and Cookie Policy.
          </p>
          <div className="flex items-center justify-between">
            <button className="bg-[#0077b5] hover:bg-[#006097] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full" type="button">
              Join now
            </button>
          </div>
        </form>
        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-600">or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
        <button className="bg-[#3b5998] hover:bg-[#2d4373] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mb-4">
          Continue with Facebook
        </button>
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