import React, { useState } from 'react';
import { FiPlus, FiChevronLeft, FiChevronRight, FiX, FiSearch } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({
  isCollapsed,
  toggleSidebar,
  recentChats,
  activeChat,
  onNewChat,
  onSelectChat,
  closeMobileSidebar,
  isMobile,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const filteredChats = recentChats.filter(
    (chat) =>
      chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className={`flex flex-col h-full ${
        isCollapsed ? 'w-20' : 'w-72'
      } bg-black text-white transition-all duration-300 ${
        isMobile ? 'fixed inset-y-0 left-0 z-30 shadow-2xl' : ''
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-600">
        {!isCollapsed && (
          <h2 className="text-xl font-bold tracking-tight">Conversations</h2>
        )}
        {isMobile ? (
          <button
            onClick={closeMobileSidebar}
            className="p-2 rounded-full hover:bg-[#5a47a5] transition-colors focus:outline-none focus:ring-2 focus:ring-[#7B54D3]"
            aria-label="Close sidebar"
          >
            <FiX size={26} />
          </button>
        ) : (
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-full hover:bg-[#5a47a5] transition-colors focus:outline-none focus:ring-2 focus:ring-[#7B54D3]"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <FiChevronRight size={26} /> : <FiChevronLeft size={26} />}
          </button>
        )}
      </div>

      {/* Search Bar */}
      {!isCollapsed && (
        <div className="p-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-md bg-[#5a47a5] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7B54D3] transition-colors"
              aria-label="Search conversations"
            />
          </div>
        </div>
      )}

      {/* New Chat Button */}
      <button
        onClick={onNewChat}
        className={`flex items-center ${
          isCollapsed ? 'justify-center' : 'justify-start'
        } p-4 hover:bg-[#5a47a5] transition-colors focus:outline-none focus:ring-2 focus:ring-[#7B54D3]`}
        aria-label="Start new chat"
      >
        <FiPlus size={22} className={isCollapsed ? '' : 'mr-3'} />
        {!isCollapsed && <span className="font-semibold">New Conversation</span>}
      </button>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto px-2 ">
        <AnimatePresence>
          {filteredChats.length === 0 && !isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 text-gray-400 text-center "
            >
              No chats found
            </motion.div>
          )}
          {filteredChats.map((chat) => (
            <motion.div
              key={chat.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              onClick={() => onSelectChat(chat.id)}
              className={`p-4 mx-2 rounded-lg border-b border-gray-600 cursor-pointer hover:bg-[#5a47a5] transition-colors focus:outline-none focus:ring-2 focus:ring-[#7B54D3] ${
                activeChat === chat.id ? 'bg-[#5a47a5]' : ''
              }`}
              role="button"
              aria-label={`Select chat: ${chat.title}`}
            >
              {isCollapsed ? (
                <div className="text-center text-lg font-bold" title={chat.title}>
                  {chat.title.charAt(0).toUpperCase()}
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="font-semibold truncate text-lg">{chat.title}</div>
                  <div className="text-sm text-gray-300 truncate">{chat.lastMessage}</div>
                  <div className="text-xs text-gray-400">
                    {new Date(chat.timestamp).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Sidebar;