'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar/Navbar';
import Image from 'next/image';

const Dashboard = () => {
  const router = useRouter();
  
  const modules = [
    { name: "Module A B C", teacher: "A B C Perera", img: "/module.jpg" },
    { name: "Module D E F", teacher: "D E F Perera", img: "/module1.jpg" },
    { name: "Module G H I", teacher: "G H I Perera", img: "/module2.jpg" },
    { name: "Module J K L", teacher: "J K L Perera", img: "/module3.jpg" },
    { name: "Module M N O", teacher: "M N O Perera", img: "/module4.jpg" },
    { name: "Module P Q R", teacher: "P Q R Perera", img: "/module5.jpg" },
  ];

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
          <h1 className="text-3xl font-bold text-green-700 mb-2">Student Dashboard</h1>
          <p className="text-gray-600">Welcome to your learning journey</p>
        </div>

        {/* Module Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="h-24 bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center">
                <div className="bg-white p-2 rounded-full">
                  <Image 
                    src={module.img} 
                    alt={module.name} 
                    width={64} 
                    height={64} 
                    className="rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.jpg";
                    }} 
                  />
                </div>
              </div>
              
              <div className="p-5">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{module.name}</h3>
                <p className="text-gray-600 mb-4">Instructor: {module.teacher}</p>
                
                <div className="flex justify-between items-center">
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    Active
                  </div>
                  <button
                    onClick={() => router.push('/modulepage')}
                    className="bg-green-500 hover:bg-green-600 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors"
                  >
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                      <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;