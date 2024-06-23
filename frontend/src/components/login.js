import React from 'react';

const LoginPage = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex flex-col md:flex-row w-full max-w-4xl mx-auto shadow-lg">
        <div className="bg-black text-white p-8 md:w-1/2">
          <div className="mb-8">
            <svg className="w-16 h-16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">CleanMyCar</h1>
          <p className="text-gray-300">India's first waterless car cleaning company</p>
        </div>
        <div className="bg-white p-8 md:w-1/2">
          <h2 className="text-2xl font-semibold mb-6">Log in</h2>
          <form>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                placeholder="user@email.com"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                placeholder="Enter your Password"
              />
              <a className="inline-block align-baseline font-bold text-sm text-black hover:text-gray-800" href="#">
                Forgot password?
              </a>
            </div>
            <div className="flex flex-col items-center justify-between">
              <button
                className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mb-4"
                type="button"
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
        </div>
      </div>
      {/* <div className="absolute top-4 right-4"> */}
        {/* <a href="/signup" className="text-sm text-gray-600 hover:text-gray-800">Don't Have An Account? Sign up!</a> */}
      {/* </div> */}
    </div>
  );
};

export default LoginPage;