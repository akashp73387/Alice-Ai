import { useState, useEffect } from "react";
import { FiMenu, FiX, FiPlus, FiUser, FiSettings } from "react-icons/fi";
import aliceLogo from "../../assets/alicelogo.png";

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const [activeItem, setActiveItem] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // TODO: Replace with actual logic for starting a new chat
  const startNewChat = () => {
    // For now, just resetting activeItem or some state could work
    setActiveItem("newChat");
  };

  const handleClick = (item) => {
    setActiveItem(item);
  };

  const baseButtonClasses =
    "flex items-center w-full p-3 text-left transition-all duration-200 border-b border-gray-700";
  const collapsedButtonClasses = isCollapsed ? "justify-center" : "px-4";

  const getButtonStyle = (item) =>
    activeItem === item ? "bg-[#2a2a2a]" : "hover:bg-[#2a2a2a]";

  const gradientText =
    "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300";

  // Collapse on screen resize (mobile)
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 640;
      setIsMobile(mobile);
      if (mobile && !isCollapsed) {
        toggleSidebar(); // collapse if open on mobile
      }
    };
    handleResize(); // run on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isCollapsed, toggleSidebar]);

  return (
    <>
      {/* Overlay for mobile when sidebar is open */}
      {isMobile && !isCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      <div
        className={`fixed top-0 left-0 z-50 h-full bg-[#1f1e1d] transition-transform duration-300 ease-in-out 
        ${isCollapsed ? "-translate-x-full" : "translate-x-0"} 
        sm:translate-x-0 sm:static sm:flex 
        w-64 border-r border-gray-700 flex flex-col`}
      >
        {/* Header */}
        <div className="p-3 border-b border-gray-700 flex justify-between items-center bg-[#1f1e1d]/90">
          {!isCollapsed && (
            <img
              src={aliceLogo}
              alt="Alice Ai"
              style={{ height: "50px", width: "200px" }}
            />
          )}
          <button
            onClick={toggleSidebar}
            className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-[#2a2a2a] transition-all duration-200"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <FiMenu
                size={20}
                className="hover:scale-110 transition-transform"
                aria-hidden="true"
              />
            ) : (
              <FiX
                size={20}
                className="hover:scale-110 transition-transform"
                aria-hidden="true"
              />
            )}
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          <button
            className={`${baseButtonClasses} ${collapsedButtonClasses} ${getButtonStyle(
              "newChat"
            )}`}
            onClick={startNewChat}
            aria-current={activeItem === "newChat" ? "page" : undefined}
          >
            <FiPlus className="text-gray-300" size={18} />
            {!isCollapsed && (
              <span className={`ml-3 font-medium ${gradientText}`}>
                New Chat
              </span>
            )}
          </button>
          {/* Add more buttons or chat list items here */}
        </div>

        {/* Bottom Buttons */}
        <div className="border-t border-gray-700 p-2 bg-[#1f1e1d]/90">
          {[
            { key: "settings", icon: FiSettings, label: "Settings" },
            { key: "login", icon: FiUser, label: "Akash" },
          ].map(({ key, icon: Icon, label }) => {
            const isActive = activeItem === key;
            return (
              <button
                key={key}
                className={`flex items-center w-full p-2 rounded-md ${
                  isActive ? "bg-[#2a2a2a]" : "hover:bg-[#2a2a2a]"
                } ${isCollapsed ? "justify-center" : ""}`}
                onClick={() => handleClick(key)}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon size={16} className="text-gray-300" />
                {!isCollapsed && (
                  <span className={`ml-3 text-sm font-medium ${gradientText}`}>
                    {label}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
