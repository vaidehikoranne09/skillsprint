import React from 'react';
import DynamicIllustration from '../ui/DynamicIllustration';

const WelcomeBanner = ({ user }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="relative bg-gradient-to-r from-primary-600 via-purple-600 to-indigo-600 rounded-3xl p-8 overflow-hidden shadow-xl">
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-white space-y-2 flex-1">
          <p className="text-sm font-medium text-white/80">{getGreeting()} 👋</p>
          <h1 className="text-3xl md:text-4xl font-bold">
            {user?.name || 'Learner'}
          </h1>
          <p className="text-white/90 text-lg">
            Keep learning, keep growing. You've got this! 🎉
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <span className="px-3 py-1.5 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm flex items-center gap-2">
              🔥 {user?.dailyStreak || 0} Day Streak
            </span>
            <span className="px-3 py-1.5 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm flex items-center gap-2">
              🎯 72% Accuracy
            </span>
          </div>
        </div>
        
        <div className="hidden md:block w-48 h-48 flex-shrink-0">
          <DynamicIllustration 
            gender={user?.gender || 'neutral'} 
            className="w-full h-full object-contain drop-shadow-lg"
          />
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
    </div>
  );
};

export default WelcomeBanner;