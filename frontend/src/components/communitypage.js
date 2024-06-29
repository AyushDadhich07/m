import React from 'react';

const CommunityPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* New section added at the top */}
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Apple Support Community</h1>
        <p className="text-xl mb-8">
          Find answers. Ask questions. Connect with Apple customers around the world.
        </p>
        <div className="relative max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Search or ask a question"
            className="w-full px-4 py-2 border rounded-lg text-lg"
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            🔍
          </span>
        </div>
        <a href="#" className="block mt-4 text-blue-500 hover:underline">
          Learn more about the Apple Support Community &gt;
        </a>
      </section>
      <header className="mb-6">
        <nav className="text-sm text-gray-500">
          <span>macOS / macOS Ventura</span>
        </nav>
      </header>
      
      <main>
        <section className="mb-8">
          <div className="flex items-center mb-4">
            <img src="/path-to-avatar.jpg" alt="User avatar" className="w-10 h-10 rounded-full mr-3" />
            <div>
              <h2 className="font-semibold">edithfromor</h2>
              <p className="text-sm text-gray-500">Level 1 • 5 points</p>
            </div>
          </div>
          
          <h1 className="text-2xl font-bold mb-4">
            Desktop Stacks setting suddenly changed, what caused that, Ventura 13.6
          </h1>
          
          <div className="text-sm text-gray-600 mb-4">
            -macOS Ventura 13.6, Desktop; Safari 16.6 (18615.3.12.11.2)
          </div>
          
          <div className="mb-4">
            <p className="mb-2">-My gmail-composition-window (webmail) turned black at top, which progressed downward till filled entire window, then most of my "Desktop Stack" folders suddenly reorganized at right of my Desktop: from "sort by Kind" to "sort by Date," creating new folders and titles. The black screen area showed short lines of blue, red and white, which moved around. Couldn't view Inbox till 10-20 clicks on area where my personal icon should display ,for LogOut. Eventually Logged Out.</p>
            <p className="mb-2">-What caused the blackening and change of Stack settings? Is it Malware? Next, at Apple Support, using a link to an article, 1st page loaded in html-format; next link loaded in normal format. Any solutions?</p>
            <p>-If I simply change my "Desktop-Stacks-Setting" back to Sort by Kind, will I not lose any files, and they simply be reorganized to Kind-of-File Folders?</p>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <span>Posted on Oct 5, 2023 1:07 AM</span>
            <div className="ml-auto flex space-x-2">
              <button className="p-1 border rounded">↑</button>
              <button className="p-1 border rounded">↓</button>
              <button className="px-2 py-1 border rounded">Me too (1)</button>
              <button className="px-3 py-1 bg-blue-500 text-white rounded">Reply</button>
            </div>
          </div>
        </section>

        <section className="mb-8 bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center mb-4">
            <img src="/path-to-avatar.jpg" alt="User avatar" className="w-10 h-10 rounded-full mr-3" />
            <div>
              <h2 className="font-semibold">leroydouglas</h2>
              <p className="text-sm text-gray-500">Community+ 2024 • Level 10 • 185,364 points</p>
            </div>
          </div>
          
          <div className="mb-4">
            <p className="mb-2">ref: <a href="#" className="text-blue-600 hover:underline">Use desktop stacks on Mac - Apple Support</a></p>
            <p className="mb-2">To trouble shoot further you can:</p>
            <p className="mb-2">—A SafeBoot <a href="#" className="text-blue-600 hover:underline">Use safe mode on your Mac - Apple Support</a> will sort many anomalies</p>
            <p>Does a quick disk repair before it fully boots up, and certain system caches get cleared and rebuilt, third party system modifications and system accelerations are disabled.</p>
            <p>Login and test. Reboot as normal and test. Caches get rebuilt automatically.</p>
          </div>
          
          <p className="text-sm text-gray-500">Posted on Oct 5, 2023 8:29 AM</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Similar questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Repeat this div for each similar question */}
            <div className="border rounded p-4">
              <h3 className="font-semibold mb-2">Black windows in many apps incl. Safari, ZOOM, Apple mail /...</h3>
              <p className="text-sm text-gray-600 mb-2">Increasingly over the past 2-3 weeks I get m ore and more black windows in many apps incl Safari, ZOOM, Apple mail / messages , slack) Zoom...</p>
              <p className="text-xs text-gray-500">10 months ago • 205 • 2</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CommunityPage;