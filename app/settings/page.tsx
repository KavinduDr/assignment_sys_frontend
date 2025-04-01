'use client'

import { useRouter } from 'next/navigation'
import React, { useState } from 'react';
import Navbar from '../components/Navbar/Navbar';
import Image from 'next/image';

const Settings: React.FC = () => {
  const router = useRouter();
  const [name, setName] = useState("PERERA A. B. C");
  const [password, setPassword] = useState("********");

  const handleUpdate = () => {
    // Handle update logic here
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Navbar */}
      <div className="w-full bg-white shadow-md">
        <div className="max-w-7xl mx-auto">
          <Navbar />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-green-700 mb-2">Account Settings</h1>
          <p className="text-gray-600">Manage your profile and preferences</p>
        </div>

        {/* Settings Content */}
        <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
          {/* Profile Section */}
          <div className="flex flex-col items-center pb-6 border-b border-gray-200">
            <div className="relative mb-4">
              <div className="w-32 h-32 bg-gray-200 rounded-full overflow-hidden">
                <Image 
                  src="/profile.jpg" 
                  alt="Profile" 
                  width={380} 
                  height={380}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.jpg";
                  }}
                />
              </div>
              <button className="absolute bottom-0 right-0 bg-green-500 text-white rounded-full p-2 shadow-md hover:bg-green-600 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.5 6.5L17.5 7.5M12 21H21M3 16.5L16.5 3C17.3284 3 18.5 3.5 19.5 4.5C20.5 5.5 21 6.67157 21 7.5L7.5 21H3V16.5Z" 
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">EG/XXXX/XXXX</h2>
            <p className="text-gray-500 text-sm">Student ID</p>
          </div>

          {/* Form Fields */}
          <div className="py-6">
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="flex items-center w-full relative">
                <input 
                  type="text" 
                  id="name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-green-50 border border-green-200 text-gray-800 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-3 pr-10"
                />
                <button className="absolute right-3 text-gray-600 hover:text-green-600">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11 4H7.2c-1.12 0-1.68 0-2.108.218a2 2 0 00-.874.874C4 5.52 4 6.08 4 7.2v9.6c0 1.12 0 1.68.218 2.108a2 2 0 00.874.874C5.52 20 6.08 20 7.2 20h9.6c1.12 0 1.68 0 2.108-.218a2 2 0 00.874-.874C20 18.48 20 17.92 20 16.8v-4.3m-4.5-7l2.828 2.828m-7.565 1.91l6.648-6.649a2 2 0 112.828 2.828l-6.862 6.862c-.761.762-1.142 1.143-1.576 1.446-.385.269-.8.491-1.237.663-.492.194-1.02.3-2.076.514L8 16l.047-.332c.168-1.175.252-1.763.443-2.312a6 6 0 01.69-1.377c.323-.482.743-.902 1.583-1.742z"
                    />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="flex items-center w-full relative">
                <input 
                  type="password" 
                  id="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-green-50 border border-green-200 text-gray-800 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-3 pr-10"
                />
                <button className="absolute right-3 text-gray-600 hover:text-green-600">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11 4H7.2c-1.12 0-1.68 0-2.108.218a2 2 0 00-.874.874C4 5.52 4 6.08 4 7.2v9.6c0 1.12 0 1.68.218 2.108a2 2 0 00.874.874C5.52 20 6.08 20 7.2 20h9.6c1.12 0 1.68 0 2.108-.218a2 2 0 00.874-.874C20 18.48 20 17.92 20 16.8v-4.3m-4.5-7l2.828 2.828m-7.565 1.91l6.648-6.649a2 2 0 112.828 2.828l-6.862 6.862c-.761.762-1.142 1.143-1.576 1.446-.385.269-.8.491-1.237.663-.492.194-1.02.3-2.076.514L8 16l.047-.332c.168-1.175.252-1.763.443-2.312a6 6 0 01.69-1.377c.323-.482.743-.902 1.583-1.742z"
                    />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Additional field examples */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="flex items-center w-full relative">
                <input 
                  type="email" 
                  id="email" 
                  placeholder="student@example.com"
                  className="bg-green-50 border border-green-200 text-gray-800 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-3 pr-10"
                />
                <button className="absolute right-3 text-gray-600 hover:text-green-600">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11 4H7.2c-1.12 0-1.68 0-2.108.218a2 2 0 00-.874.874C4 5.52 4 6.08 4 7.2v9.6c0 1.12 0 1.68.218 2.108a2 2 0 00.874.874C5.52 20 6.08 20 7.2 20h9.6c1.12 0 1.68 0 2.108-.218a2 2 0 00.874-.874C20 18.48 20 17.92 20 16.8v-4.3m-4.5-7l2.828 2.828m-7.565 1.91l6.648-6.649a2 2 0 112.828 2.828l-6.862 6.862c-.761.762-1.142 1.143-1.576 1.446-.385.269-.8.491-1.237.663-.492.194-1.02.3-2.076.514L8 16l.047-.332c.168-1.175.252-1.763.443-2.312a6 6 0 01.69-1.377c.323-.482.743-.902 1.583-1.742z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          {/* Update Button */}
          <div className="mt-2 text-center">
            <button
              type="button"
              onClick={handleUpdate}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium rounded-lg px-8 py-3 shadow-md hover:shadow-lg transition-all duration-200"
            >
              Update Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;