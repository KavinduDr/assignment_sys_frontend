'use client'

import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { LogOut, User, Home, CheckCircle, Settings } from 'lucide-react';

const Navbar = () => {
  const router = useRouter();
  const { user } = useUser();
  const [apiUrl, setApiUrl] = useState('');
  const [name, setName] = useState('');
  const [activeTab, setActiveTab] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setName(sessionStorage.getItem('name') || user?.name || '');
      // Set active tab based on current path
      const path = window.location.pathname;
      if (path.includes('dashboard')) setActiveTab('dashboard');
      else if (path.includes('completed')) setActiveTab('completed');
      else if (path.includes('settings')) setActiveTab('settings');
    }
  }, [user]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // This will run only on the client side
      if (window.location.hostname === 'localhost') {
        setApiUrl('http://localhost:4000');
      } else {
        setApiUrl(`${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}`);
      }
    }
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('name');
    router.push('/signin');
  };

  const handleNavigation = (path) => {
    setActiveTab(path);
    router.push(`/${path}`);
  };

  return (
    <div className="w-full h-[100px] flex justify-between items-center px-4 mt-2">
      <div className="w-full h-[100px] bg-white border-green-500 border-2 rounded-3xl flex justify-between items-center px-6 shadow-md hover:shadow-lg transition-shadow duration-300">
        {/* User Profile Section */}
        <div 
          className="flex items-center space-x-3 cursor-pointer group" 
          onClick={() => handleNavigation('settings')}
        >
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
            <User size={20} />
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-gray-800 group-hover:text-green-600 transition-colors">
              {name || 'User'}
            </span>
            <span className="text-xs text-gray-500">Student</span>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex space-x-8 text-gray-700 font-medium">
          <button 
            onClick={() => handleNavigation('dashboard')} 
            className={`flex items-center space-x-1 py-2 px-3 rounded-lg transition-all duration-300 hover:text-green-600 hover:bg-green-50 ${activeTab === 'dashboard' ? 'text-green-600 bg-green-50' : ''}`}
          >
            <Home size={18} />
            <span>Dashboard</span>
          </button>
          <button 
            onClick={() => handleNavigation('completed')} 
            className={`flex items-center space-x-1 py-2 px-3 rounded-lg transition-all duration-300 hover:text-green-600 hover:bg-green-50 ${activeTab === 'completed' ? 'text-green-600 bg-green-50' : ''}`}
          >
            <CheckCircle size={18} />
            <span>Completed</span>
          </button>
          <button 
            onClick={() => handleNavigation('settings')} 
            className={`flex items-center space-x-1 py-2 px-3 rounded-lg transition-all duration-300 hover:text-green-600 hover:bg-green-50 ${activeTab === 'settings' ? 'text-green-600 bg-green-50' : ''}`}
          >
            <Settings size={18} />
            <span>Settings</span>
          </button>
        </div>

        {/* Logout Button */}
        <div 
          onClick={handleLogout}
          className="flex items-center space-x-2 cursor-pointer text-gray-700 hover:text-red-500 transition-colors py-2 px-3 rounded-lg hover:bg-red-50"
        >
          <LogOut size={20} />
          <span className="hidden md:inline">Logout</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;