import React, { useState, useEffect } from 'react';
import { Mail, MapPin, Link as LinkIcon, Edit, Settings, BarChart2, MessageSquare, Heart } from 'lucide-react';
import axios from 'axios';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [activities, setActivities] = useState([]); // Initialize activities as an empty array

  useEffect(() => {
    const fetchUser = async () => {
      const user_email = localStorage.getItem('userEmail');
      try {
        const response = await axios.get(`http://localhost:8000/api/user/?user_email=${user_email}`);
        setProfile(response.data);
        console.log(profile);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, []);

  // Assuming activities data structure is an array of objects like [{ content: '', likes: '', comments: '', time: '' }]
  // Replace with your actual data structure

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Sidebar - you can reuse the sidebar from the QuestionList component */}
      <aside className="w-full md:w-64 bg-white p-6 border-r">
        {/* Sidebar content */}
        <h1 className="text-2xl font-bold mb-6">Project M</h1>
        <nav>
          <ul className="space-y-2">
            <li><a href="/documentpage" className="flex items-center space-x-2 text-gray-700 hover:bg-gray-100 rounded p-2">Documents</a></li>
            <li><a href="/support" className="flex items-center space-x-2 text-gray-700 hover:bg-gray-100 rounded p-2">Help</a></li>
          </ul>
        </nav>
      </aside>

      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto"> {/* Render content only if profile data is available */}
            <header className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex flex-col md:flex-row items-center">
                <img src="/api/placeholder/120/120" alt="Profile" className="w-24 h-24 rounded-full mb-4 md:mb-0 md:mr-6" />
                <div className="text-center md:text-left">
                  <h1 className="text-2xl font-bold">{profile.first_name} {profile.last_name}</h1>
                  <p className="text-gray-600">Role</p>
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
                      <Mail size={18} className="mr-2" /> {profile.email}
                    </li>
                    <li className="flex items-center text-gray-600">
                      <MapPin size={18} className="mr-2" /> Location
                    </li>
                    <li className="flex items-center text-gray-600">
                      <LinkIcon size={18} className="mr-2" /> <a href="#" className="text-blue-600 hover:underline">Website</a>
                    </li>
                  </ul>
                  <p className="mt-4 text-gray-700">Bio</p>
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
                    <span className="font-bold">2</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-gray-600">Followers</span>
                    <span className="font-bold">2000</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-gray-600">Following</span>
                    <span className="font-bold">100</span>
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
