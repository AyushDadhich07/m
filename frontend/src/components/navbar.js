import React, { useState, useEffect } from 'react';

const Widget = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
}, []);
  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    if (confirmLogout) {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        window.location.href = '/';
    }
};
  return (
    <nav className="bg-black border-b border-zinc-300 dark:border-zinc-700">
      <div className="container mx-auto flex justify-between items-center p-4">
        <div className="flex items-center space-x-4">
          {/* <img src="\" alt="Logo" className="h-10"> */}
          <div className="hidden md:flex space-x-8">
            <a href="/" className="text-white hover:text-zinc-400">About</a>
            <a href="/documentpage" className="text-white hover:text-zinc-400">Documents</a>
            <a href="#" className="text-white hover:text-zinc-400">Resources</a>
            <a href="/company/" className="text-white hover:text-zinc-400">Companies</a>
            <a href="/discussion" className="text-white hover:text-zinc-400">Community</a>
            <a href="#" className="text-white hover:text-zinc-400">Pricing</a>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="border border-white text-white px-4 py-2 rounded hover:bg-zinc-800">
          {isLoggedIn ? (
                        <button onClick={handleLogout}>Logout</button>
                    ) : (
                        <a href="/login">Login</a>
                    )}
            
            {/* <img src="https://placehold.co/20x20" alt="Arrow" className="inline-block ml-2"> */}
          </button>
          <a href="/support" className="bg-white text-black px-4 py-2 rounded hover:bg-zinc-700">
            Contact us
          </a>
        </div>
      </div>
    </nav>
  );
}

export default Widget;
