import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const Widget = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const menuItems = [
    { href: "/home", text: "Home" },
    { href: "/documentpage", text: "Documents" },
    { href: "/glossary", text: "Resources" },
    { href: "/company/", text: "Companies" },
    { href: "/discussion", text: "Community" },
    { href: "/pricing", text: "Pricing" },
    { href: "/article", text: "Articles" },
  ];

  return (
    <nav className="bg-black border-b border-zinc-300 dark:border-zinc-700">
      <div className="container mx-auto flex justify-between items-center p-4">
        <div className="flex items-center space-x-4">
          {/* Logo placeholder */}
          
          {/* Hamburger menu button for small to medium screens */}
          <button onClick={toggleMenu} className="lg:hidden text-white">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop menu */}
          <div className="hidden lg:flex space-x-6">
            {menuItems.map((item, index) => (
              <a key={index} href={item.href} className="text-white hover:text-zinc-400 text-sm">
                {item.text}
              </a>
            ))}
          </div>
        </div>

        {/* Login and Contact us buttons */}
        <div className="flex items-center space-x-2">
          <button className="border border-white text-white px-3 py-1 rounded hover:bg-zinc-800 text-sm">
            {isLoggedIn ? (
              <button onClick={handleLogout}>Logout</button>
            ) : (
              <a href="/login">Login</a>
            )}
          </button>
          <a href="/support" className="bg-white text-black px-3 py-1 rounded hover:bg-zinc-200 text-sm">
            Contact us
          </a>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 right-0 bg-black z-50">
          {menuItems.map((item, index) => (
            <a 
              key={index} 
              href={item.href} 
              className="block text-white hover:text-zinc-400 p-3 border-b border-zinc-700 text-sm"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.text}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}

export default Widget;