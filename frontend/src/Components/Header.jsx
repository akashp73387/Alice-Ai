import React, { useState, useEffect } from 'react';
import { FiMenu, FiUser, FiMoon, FiSun, FiLogOut, FiSettings, FiBell } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Header = ({ onMenuClick, onSidebarToggle, title, isSidebarCollapsed }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [notifications, setNotifications] = useState(0);
  const navigate = useNavigate();

  // Simulate notification updates
  useEffect(() => {
    const interval = setInterval(() => {
      setNotifications((prev) => (prev < 5 ? prev + 1 : prev));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
    document.documentElement.classList.toggle('dark', !isDarkTheme);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/signin');
  };

  const handleSettings = () => {
    setIsProfileOpen(false);
    navigate('/settings');
  };

  return (
    <header className="flex items-center justify-between p-4 bg-black text-white shadow-lg">
      {/* Mobile Menu Button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-full hover:bg-[#5a47a5] transition-colors focus:outline-none focus:ring-2 focus:ring-[#7B54D3]"
        aria-label="Toggle mobile sidebar"
      >
        <FiMenu size={26} />
      </button>

      {/* Desktop Sidebar Toggle */}
      <button
        onClick={onSidebarToggle}
        className="hidden lg:hidden p-2 rounded-full hover:bg-[#5a47a5] transition-colors focus:outline-none focus:ring-2 focus:ring-[#7B54D3]"
        aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <FiMenu size={26} />
      </button>

      {/* Title */}
      <h1 className="text-xl md:text-2xl font-bold truncate flex-1 text-center">
        Alice Ai 
      </h1>

      {/* Controls */}
      <div className="relative flex items-center space-x-3">
        {/* Notification Bell */}
        <button
          className="relative p-2 rounded-full hover:bg-[#5a47a5] transition-colors focus:outline-none focus:ring-2 focus:ring-[#7B54D3]"
          aria-label={`Notifications (${notifications} new)`}
        >
          <FiBell size={24} />
          {notifications > 0 && (
            <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {notifications}
            </span>
          )}
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-[#5a47a5] transition-colors focus:outline-none focus:ring-2 focus:ring-[#7B54D3]"
          aria-label={isDarkTheme ? 'Switch to light theme' : 'Switch to dark theme'}
        >
          {isDarkTheme ? <FiSun size={24} /> : <FiMoon size={24} />}
        </button>

        {/* Profile Button */}
        <button
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className="p-2 rounded-full hover:bg-[#5a47a5] transition-colors focus:outline-none focus:ring-2 focus:ring-[#7B54D3]"
          aria-label="Toggle profile menu"
        >
          <FiUser size={24} />
        </button>

        {/* Profile Dropdown */}
        <AnimatePresence>
          {isProfileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-14 w-56 bg-[#4C3B8B] rounded-lg shadow-xl py-2 z-50 border border-[#7B54D3]"
            >
              <div className="px-4 py-2 text-sm font-semibold text-gray-200 border-b border-gray-600">
                {localStorage.getItem('user') || 'User Profile'}
              </div>
              <button
                onClick={handleSettings}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-200 hover:bg-[#5a47a5] transition-colors focus:outline-none focus:bg-[#5a47a5]"
              >
                <FiSettings className="mr-2" size={18} /> Settings
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-200 hover:bg-[#5a47a5] transition-colors focus:outline-none focus:bg-[#5a47a5]"
              >
                <FiLogOut className="mr-2" size={18} /> Logout
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;