import React, { useState, useEffect } from 'react';
import { User, Mail, MapPin, Link as LinkIcon, Edit, Settings, BarChart2, MessageSquare, Heart } from 'lucide-react';

const ProfilePage = () => {
  const [user, setUser] = useState({
    name: 'Soheil Alavi',
    role: 'Chief Product Officer @ Tribe',
    email: 'soheil@example.com',
    location: 'San Francisco, CA',
    website: 'https://soheil.com',
    bio: 'Passionate about building great products and fostering communities. Always learning, always growing.',
    joinDate: 'Joined September 2021',
    stats: {
      posts: 142,
      followers: 1240,
      following: 567
    }
  });

  const [activities, setActivities] = useState([
    { type: 'post', content: 'Just launched our new feature! Check it out and let me know what you think.', likes: 23, comments: 5, time: '2 hours ago' },
    { type: 'comment', content: 'Great insights! I\'ve been thinking about this topic a lot lately.', likes: 7, time: '1 day ago' },
    { type: 'post', content: 'Excited to announce I\'ll be speaking at the upcoming Tech Conference 2023!', likes: 56, comments: 12, time: '3 days ago' },
  ]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Sidebar - you can reuse the sidebar from the QuestionList component */}
      <aside className="w-full md:w-64 bg-white p-6 border-r">
        {/* Sidebar content */}
      </aside>

      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <header className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row items-center">
              <img src="/api/placeholder/120/120" alt="Profile" className="w-24 h-24 rounded-full mb-4 md:mb-0 md:mr-6" />
              <div className="text-center md:text-left">
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="text-gray-600">{user.role}</p>
                <p className="text-sm text-gray-500 mt-1">{user.joinDate}</p>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-4">
              <button className="px-4 py-2 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 flex items-center">
                <Edit size={16} className="mr-2" /> Edit Profile
              </button>
              <button className="px-4 py-2 bg-gray-200 text-gray-700 font-bold rounded-full hover:bg-gray-300 flex items-center">
                <Settings size={16} className="mr-2" /> Settings
              </button>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <section className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">About</h2>
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-600">
                    <Mail size={18} className="mr-2" /> {user.email}
                  </li>
                  <li className="flex items-center text-gray-600">
                    <MapPin size={18} className="mr-2" /> {user.location}
                  </li>
                  <li className="flex items-center text-gray-600">
                    <LinkIcon size={18} className="mr-2" /> <a href={user.website} className="text-blue-600 hover:underline">{user.website}</a>
                  </li>
                </ul>
                <p className="mt-4 text-gray-700">{user.bio}</p>
              </section>

              <section className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Activity</h2>
                {activities.map((activity, index) => (
                  <div key={index} className="mb-4 pb-4 border-b last:border-b-0">
                    <p className="mb-2">{activity.content}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="mr-4 flex items-center">
                        <Heart size={14} className="mr-1" /> {activity.likes} likes
                      </span>
                      {activity.comments && (
                        <span className="mr-4 flex items-center">
                          <MessageSquare size={14} className="mr-1" /> {activity.comments} comments
                        </span>
                      )}
                      <span>{activity.time}</span>
                    </div>
                  </div>
                ))}
              </section>
            </div>

            <div>
              <section className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Stats</h2>
                <ul className="space-y-4">
                  <li className="flex justify-between items-center">
                    <span className="text-gray-600">Posts</span>
                    <span className="font-bold">{user.stats.posts}</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-gray-600">Followers</span>
                    <span className="font-bold">{user.stats.followers}</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-gray-600">Following</span>
                    <span className="font-bold">{user.stats.following}</span>
                  </li>
                </ul>
              </section>

              <section className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Achievements</h2>
                <ul className="space-y-2">
                  <li className="flex items-center text-gray-600">
                    <BarChart2 size={18} className="mr-2 text-yellow-500" /> Top Contributor
                  </li>
                  <li className="flex items-center text-gray-600">
                    <MessageSquare size={18} className="mr-2 text-blue-500" /> Engaging Commenter
                  </li>
                  <li className="flex items-center text-gray-600">
                    <Heart size={18} className="mr-2 text-red-500" /> Most Liked Post
                  </li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;