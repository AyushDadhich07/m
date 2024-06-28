import React from 'react';

const Widget = () => {
  return (
    <nav className="bg-black border-b border-zinc-300 dark:border-zinc-700">
      <div className="container mx-auto flex justify-between items-center p-4">
        <div className="flex items-center space-x-4">
          {/* <img src="\" alt="Logo" className="h-10"> */}
          <div className="hidden md:flex space-x-8">
            <a href="#" className="text-white hover:text-zinc-400">About</a>
            <a href="#" className="text-white hover:text-zinc-400">Solutions</a>
            <a href="#" className="text-white hover:text-zinc-400">Resources</a>
            <a href="/community" className="text-white hover:text-zinc-400">Community</a>
            <a href="#" className="text-white hover:text-zinc-400">Pricing</a>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="border border-white text-white px-4 py-2 rounded hover:bg-zinc-800">
            <a href="/login">Log in</a>
            
            {/* <img src="https://placehold.co/20x20" alt="Arrow" className="inline-block ml-2"> */}
          </button>
          <button className="bg-white text-black px-4 py-2 rounded hover:bg-zinc-700">
            Contact us
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Widget;
