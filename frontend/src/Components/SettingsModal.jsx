import React, { useState, useEffect } from "react";
import {
  FiX,
  FiMoon,
  FiSun,
  FiTrash2,
  FiLogOut,
  FiShield,
  FiChevronRight,
} from "react-icons/fi";

const SettingsModal = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState("general");
  const [theme, setTheme] = useState("light");
  const [enableMFA, setEnableMFA] = useState(false);

  useEffect(() => {
    // Load theme from localStorage on mount
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) setTheme(savedTheme);
  }, []);

  useEffect(() => {
    // Apply theme and save it to localStorage
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/20 dark:bg-gray-900/50 text-black dark:text-white transition-colors duration-300">
      {/* Glass morphic container */}
      <div
        className="bg-gradient-to-br from-gray-900/80 to-gray-800/90 border border-gray-700/50 shadow-2xl shadow-black/50 rounded-2xl w-full max-w-4xl h-[560px] flex relative overflow-hidden"
        style={{
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        {/* Close button */}
        <button
          className="absolute top-4 right-5 p-1.5 rounded-full bg-gray-700/50 hover:bg-gray-600/70 transition-all text-gray-300 hover:text-white z-10"
          onClick={onClose}
          aria-label="Close settings"
        >
          <FiX className="w-5 h-5" />
        </button>

        {/* Side Navigation - Modern vertical tabs */}
        <nav
          className="w-56 bg-gray-800/30 border-r border-gray-700/50 flex flex-col py-8 px-4"
          aria-label="Settings tabs"
        >
          <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider px-3 mb-5">
            Settings
          </h3>

          {["general", "security"].map((tab) => (
            <button
              key={tab}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm mb-1 transition-all ${
                activeTab === tab
                  ? "bg-blue-500/10 text-purple-400"
                  : "text-gray-300 hover:bg-gray-700/40"
              }`}
              onClick={() => setActiveTab(tab)}
              aria-selected={activeTab === tab}
              role="tab"
            >
              <span className="capitalize">{tab}</span>
              <FiChevronRight
                className={`w-4 h-4 transition-transform ${
                  activeTab === tab ? "rotate-90" : ""
                }`}
              />
            </button>
          ))}

          <div className="mt-auto px-3 pt-5 border-t border-gray-700/50">
            <div className="text-xs text-gray-400 mb-1">v2.4.1</div>
            <div className="text-xs text-gray-500">© 2023 YourApp</div>
          </div>
        </nav>

        {/* Content Area with subtle scroll */}
        <section
          className="flex-1 p-6 overflow-y-auto custom-scroll"
          role="tabpanel"
        >
          {activeTab === "general" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                <span className="w-1 h-6 bg-purple-500 rounded-full mr-3"></span>
                General Settings
              </h2>

              {/* Theme Selection Card */}
              <div className="bg-gray-200/50 dark:bg-gray-800/50 border border-gray-400/50 dark:border-gray-700/50 rounded-xl p-5 transition-all hover:border-gray-600/70 w-full">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-blue-500/10 mr-3">
                      {theme === "dark" ? (
                        <FiMoon className="w-5 h-5 text-purple-400" />
                      ) : (
                        <FiSun className="w-5 h-5 text-yellow-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        Appearance
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Customize your theme
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setTheme("light")}
                      className={`p-1.5 rounded-lg ${
                        theme === "light"
                          ? "bg-gray-700"
                          : "hover:bg-gray-700/50"
                      }`}
                      aria-label="Set light theme"
                    >
                      <FiSun
                        className={`w-5 h-5 ${
                          theme === "light"
                            ? "text-yellow-400"
                            : "text-gray-400"
                        }`}
                      />
                    </button>
                    <button
                      onClick={() => setTheme("dark")}
                      className={`p-1.5 rounded-lg ${
                        theme === "dark"
                          ? "bg-gray-700"
                          : "hover:bg-gray-700/50"
                      }`}
                      aria-label="Set dark theme"
                    >
                      <FiMoon
                        className={`w-5 h-5 ${
                          theme === "dark" ? "text-purple-400" : "text-gray-400"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Danger Zone Card */}
              <div className="bg-gray-800/50 border border-red-900/50 rounded-xl p-5 transition-all hover:border-red-800/70">
                <h3 className="font-medium text-white mb-4 flex items-center">
                  <FiTrash2 className="w-4 h-4 text-red-400 mr-2" />
                  Danger Zone
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-white">
                        Delete All Chats
                      </h4>
                      <p className="text-xs text-gray-400">
                        Permanently remove all your conversation history
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-red-600/10 border border-red-600/30 text-red-400 text-sm rounded-lg hover:bg-red-600/20 transition-all">
                      Delete All
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                    <div>
                      <h4 className="text-sm font-medium text-white">
                        Log Out
                      </h4>
                      <p className="text-xs text-gray-400">
                        Sign out of your account on this device
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-gray-700/50 border border-gray-600/30 text-white text-sm rounded-lg hover:bg-gray-600/50 transition-all flex items-center">
                      <FiLogOut className="mr-2" /> Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                <span className="w-1 h-6 bg-blue-500 rounded-full mr-3"></span>
                Security Settings
              </h2>

              {/* MFA Card */}
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5 transition-all hover:border-gray-600/70">
                <div className="flex items-start justify-between">
                  <div className="flex items-start">
                    <div className="p-2 rounded-lg bg-blue-500/10 mr-3">
                      <FiShield className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">
                        Multi-Factor Authentication
                      </h3>
                      <p className="text-xs text-gray-400 mt-1 max-w-md">
                        Add an extra layer of security to your account. When
                        enabled, you'll be required to enter both your password
                        and an authentication code from your mobile device.
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer ml-4">
                    <input
                      type="checkbox"
                      checked={enableMFA}
                      onChange={() => setEnableMFA(!enableMFA)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-blue-500 transition-all"></div>
                    <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5"></div>
                  </label>
                </div>
              </div>

              {/* Active Sessions */}
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5 transition-all hover:border-gray-600/70">
                <h3 className="font-medium text-white mb-4">Active Sessions</h3>
                <ul className="divide-y divide-gray-700/50 max-h-48 overflow-y-auto">
                  <li className="flex justify-between items-center py-2">
                    <div>
                      <p className="text-sm font-semibold text-white">
                        Chrome on Windows
                      </p>
                      <p className="text-xs text-gray-400">
                        Last active: 10 mins ago
                      </p>
                    </div>
                    <button
                      className="text-red-500 hover:text-red-400 text-sm font-medium"
                      aria-label="Log out from Chrome on Windows"
                    >
                      Log out
                    </button>
                  </li>
                  <li className="flex justify-between items-center py-2">
                    <div>
                      <p className="text-sm font-semibold text-white">
                        Safari on iPhone
                      </p>
                      <p className="text-xs text-gray-400">
                        Last active: 2 hours ago
                      </p>
                    </div>
                    <button
                      className="text-red-500 hover:text-red-400 text-sm font-medium"
                      aria-label="Log out from Safari on iPhone"
                    >
                      Log out
                    </button>
                  </li>
                  {/* Add more sessions dynamically as needed */}
                </ul>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default SettingsModal;
