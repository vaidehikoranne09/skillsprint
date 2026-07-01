import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MainLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navItems = [
    { path: '/dashboard', icon: 'fa-chart-pie', label: 'Dashboard' },
    { path: '/subjects', icon: 'fa-book', label: 'Subjects' },
    { path: '/profile', icon: 'fa-user', label: 'Profile' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Check if path is active
  const isActive = (path) => {
    if (path === '/subjects') {
      return location.pathname.startsWith('/subject') || location.pathname === '/subjects';
    }
    return location.pathname === path;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:relative z-20 w-72 bg-white border-r border-gray-200 h-screen
          transition-all duration-300 shadow-lg
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Brand */}
          <div className="p-6 border-b border-gray-200">
            <Link to="/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-xl">SP</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">SkillsPrint</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600
                  transition-all duration-200 group
                  ${isActive(item.path) 
                    ? 'bg-gradient-to-r from-primary-50 to-purple-50 text-primary-600 font-semibold shadow-sm' 
                    : 'hover:bg-gray-50 hover:text-primary-600'}
                `}
              >
                <i className={`fas ${item.icon} w-5 text-center transition-colors ${isActive(item.path) ? 'text-primary-600' : 'text-gray-400 group-hover:text-primary-600'}`} />
                <span>{item.label}</span>
                {isActive(item.path) && (
                  <span className="ml-auto w-1.5 h-8 bg-gradient-to-b from-primary-600 to-purple-600 rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* User Profile & Logout */}
          <div className="p-4 border-t border-gray-200 space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100">
              <img
                src={user?.avatar || 'https://ui-avatars.com/api/?name=User&background=7c3aed&color=fff'}
                alt={user?.name}
                className="w-10 h-10 rounded-full border-2 border-primary-500"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email || 'user@email.com'}</p>
              </div>
            </div>
            
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all duration-200 font-medium hover:shadow-md"
            >
              <i className="fas fa-sign-out-alt" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <i className={`fas ${isSidebarOpen ? 'fa-times' : 'fa-bars'}`} />
              </button>
              <h1 className="text-xl font-semibold text-gray-900 hidden lg:block">
                {navItems.find(item => isActive(item.path))?.label || 'Dashboard'}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors hover:bg-gray-100 rounded-xl relative">
                <i className="fas fa-bell text-xl" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-10 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default MainLayout;