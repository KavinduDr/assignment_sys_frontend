'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar/Navbar';
import Image from 'next/image';

const Completed = () => {
  const router = useRouter();
  
  const modules = [
    { name: "Module A B C", teacher: "A B C Perera", img: "/module.jpg" },
    { name: "Module D E F", teacher: "D E F Perera", img: "/module1.jpg" },
    { name: "Module G H I", teacher: "G H I Perera", img: "/module2.jpg" },
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
          <h1 className="text-3xl font-bold text-green-700 mb-2">Completed Modules</h1>
          <p className="text-gray-600">Your learning achievements</p>
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
                    Completed
                  </div>
                  <button
                    onClick={() => router.push('/modulepage')}
                    className="bg-green-500 hover:bg-green-600 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors"
                  >
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                      <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Empty state if no modules */}
        {modules.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Completed Modules Yet</h3>
            <p className="text-gray-600 mb-6">Complete your first module to see it here.</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Completed;