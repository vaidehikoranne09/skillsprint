import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">SP</span>
            </div>
            <span className="text-3xl font-bold text-gray-900">SkillsPrint</span>
          </div>
          <p className="text-gray-500">Your Placement Preparation Platform</p>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;