import React, { useState, useEffect, useRef } from "react";
import SettingsModal from "./SettingsModal";
import {
  FiChevronDown,
  FiLogOut,
  FiSettings,
  FiUser,
  FiHelpCircle,
  FiBell,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const dropdownRef = useRef(null);
  const notificationsRef = useRef(null);

  // Notifications state with example data
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      text: "New message from support",
      time: "2 mins ago",
      read: false,
    },
    { id: 2, text: "System update available", time: "1 hour ago", read: false },
    {
      id: 3,
      text: "Your subscription is active",
      time: "1 day ago",
      read: true,
    },
  ]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Toggle user dropdown, close notifications if open
  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
    setNotificationsOpen(false);
  };

  // Toggle notifications panel, mark as read when opening
  const toggleNotifications = () => {
    setNotificationsOpen((prev) => {
      if (!prev) {
        // Mark all notifications as read
        setNotifications((prevNotifs) =>
          prevNotifs.map((n) => ({ ...n, read: true }))
        );
        setHasUnreadNotifications(false);
      }
      return !prev;
    });
    setDropdownOpen(false);
  };

  const closeAllPopups = () => {
    setDropdownOpen(false);
    setNotificationsOpen(false);
  };

  const onSettingsClick = () => {
    setShowSettingsModal(true);
    setDropdownOpen(false);
  };

  return (
    <header className="bg-[#1f1e1d] border-b border-gray-700 px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-lg">
      {/* Logo */}
      <div className="flex items-center space-x-4">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center"
        >
          <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
            Alice AI
          </h1>
          <span className="ml-2 px-2 py-0.5 text-xs bg-gray-700 text-gray-200 rounded-full border border-gray-600">
            Beta
          </span>
        </motion.div>
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-3">
        {/* Help button */}
        <motion.button
          className="text-gray-300 p-2 rounded-lg hover:bg-gray-700 transition-all duration-200"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="Help center"
          aria-label="Help Center"
        >
          <FiHelpCircle size={18} />
        </motion.button>

        {/* Notifications */}
        <div className="relative" ref={notificationsRef}>
          <motion.button
            onClick={toggleNotifications}
            className="text-gray-300 p-2 rounded-lg hover:bg-gray-700 transition-all duration-200 relative"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Notifications"
            aria-haspopup="true"
            aria-expanded={notificationsOpen}
          >
            <FiBell size={18} />
            {hasUnreadNotifications && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-400 rounded-full border border-gray-800"></span>
            )}
          </motion.button>

          <AnimatePresence>
            {notificationsOpen && (
              <motion.div
                className="absolute right-0 mt-2 w-72 bg-[#2a2928] rounded-lg shadow-xl border border-gray-700 z-50 overflow-hidden"
                initial={{ opacity: 0, y: -5, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -5, scale: 0.95 }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
              >
                <div className="px-4 py-3 border-b border-gray-700 flex justify-between items-center">
                  <h3 className="font-medium text-gray-100">Notifications</h3>
                  <button
                    className="text-xs text-blue-400 hover:text-blue-300"
                    onClick={() => {
                      setNotifications((prev) =>
                        prev.map((n) => ({ ...n, read: true }))
                      );
                      setHasUnreadNotifications(false);
                    }}
                  >
                    Mark all as read
                  </button>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="p-4 text-center text-gray-400">
                      No notifications
                    </p>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`px-4 py-3 border-b border-purple-900/30 ${
                          !notification.read
                            ? "bg-purple-800/30"
                            : "hover:bg-purple-700/20"
                        }`}
                      >
                        <p className="text-sm text-gray-100">
                          {notification.text}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {notification.time}
                        </p>
                      </div>
                    ))
                  )}
                </div>
                <div className="px-4 py-2 text-center">
                  <button className="text-xs text-blue-400 hover:text-blue-300">
                    View all notifications
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User dropdown */}
        <div className="relative" ref={dropdownRef}>
          <motion.button
            onClick={toggleDropdown}
            className="flex items-center space-x-2 text-gray-300 bg-gray-800 px-3 py-1.5 rounded-lg hover:bg-gray-700 transition-all duration-200 border border-gray-700"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            aria-haspopup="true"
            aria-expanded={dropdownOpen}
            aria-label="User menu"
          >
            <div className="relative">
              <img
                src="https://ui-avatars.com/api/?name=User&background=3b82f6&color=ffffff&bold=true"
                alt="User Avatar"
                className="w-7 h-7 rounded-full border border-gray-600"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border border-gray-800"></span>
            </div>
            <span className="text-sm font-medium">User</span>
            <motion.div
              animate={{ rotate: dropdownOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <FiChevronDown size={16} />
            </motion.div>
          </motion.button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                className="absolute right-0 mt-2 w-56 bg-[#2a2928] rounded-lg shadow-xl border border-gray-700 z-50 overflow-hidden"
                initial={{ opacity: 0, y: -5, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -5, scale: 0.95 }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
              >
                <div className="px-4 py-3 border-b border-gray-700">
                  <p className="text-sm font-medium text-gray-100">
                    Signed in as
                  </p>
                  <p className="text-sm text-gray-400 truncate">
                    user@example.com
                  </p>
                </div>
                <div className="py-1">
                  <button
                    className="w-full px-4 py-2 flex items-center gap-3 text-sm text-gray-300 hover:bg-gray-700"
                    onClick={closeAllPopups}
                  >
                    <FiUser size={16} />
                    Profile
                  </button>
                  <button
                    className="w-full px-4 py-2 flex items-center gap-3 text-sm text-gray-300 hover:bg-gray-700"
                    onClick={onSettingsClick}
                  >
                    <FiSettings size={16} />
                    Settings
                  </button>
                </div>
                <div className="py-1 border-t border-purple-900/50">
                  <button
                    className="w-full px-4 py-2 flex items-center gap-3 text-sm text-purple-300 hover:bg-purple-700/50"
                    onClick={closeAllPopups}
                  >
                    <FiLogOut size={16} />
                    Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettingsModal && (
        <SettingsModal onClose={() => setShowSettingsModal(false)} />
      )}
    </header>
  );
};

export default Header;
