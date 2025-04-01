'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const InitialPage: React.FC = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-green-50 to-white flex justify-center items-center px-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="fixed top-20 left-20 w-64 h-64 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="fixed top-40 right-20 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="fixed bottom-20 left-1/4 w-56 h-56 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      
      <div className="w-full max-w-md flex flex-col justify-start items-center gap-11 z-10">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-2">Getting Started</h1>
          <p className="text-gray-600">Begin your educational journey</p>
        </div>
        
        <div className="w-full max-w-sm mx-auto perspective">
          <div className="relative group">
            <div className="absolute top-6 left-0 right-0 bottom-0 bg-green-200 rounded-xl -z-10 transform rotate-6 group-hover:rotate-0 transition-transform duration-500"></div>
            <div className="absolute top-3 left-0 right-0 bottom-0 bg-green-300 rounded-xl -z-10 transform rotate-3 group-hover:rotate-0 transition-transform duration-500"></div>
            <div className="relative bg-white p-3 rounded-xl shadow-lg overflow-hidden transform transition-all duration-500 group-hover:shadow-xl">
              <div className="relative aspect-square overflow-hidden rounded-lg">
                <Image 
                  src="/initialPage.jpg"
                  alt="Educational Platform"
                  fill
                  className="object-cover scale-105 group-hover:scale-100 transition-transform duration-700"
                />
                {/* Decorative dots */}
                <div className="absolute top-4 right-4 flex space-x-1.5">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-600 animate-pulse delay-100"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse delay-200"></div>
                </div>
                {/* Green transparent gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-green-600/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <div className="pt-4 pb-2 px-1">
                <div className="flex items-center justify-between">
                  <div className="bg-green-50 px-3 py-1 rounded-full border border-green-100">
                    <span className="text-xs font-medium text-green-700">Educational App</span>
                  </div>
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, index) => (
                      <svg key={index} className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="w-full space-y-4 mt-6">
          <button
            type="button"
            onClick={() => router.push('/signup')}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 tracking-wider flex items-center justify-center"
          >
            <span>SIGN UP</span>
          </button>
          
          <button
            type="button"
            onClick={() => router.push('/signin')}
            className="w-full bg-white border-2 border-green-500 text-green-600 hover:bg-green-50 font-bold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 tracking-wider flex items-center justify-center"
          >
            <span>SIGN IN</span>
          </button>
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>The smart platform for educational assessments</p>
        </div>
      </div>
    </div>
  );
};

export default InitialPage;