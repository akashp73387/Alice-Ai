import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiEdit, FiTrash } from "react-icons/fi";
import useTheme from "../hooks/theme";

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const ChatBubble = ({ message, isConsecutive, onEdit, onDelete, onAddReaction }) => {
  const [showContextMenu, setShowContextMenu] = useState(false);

  const bubbleClasses = {
    user: {
      container: "justify-end",
      bubble: "bg-gradient-to-r from-[#6B21A8] to-[#7B54D3] text-white",
      time: "text-purple-100",
    },
    bot: {
      container: "justify-start",
      bubble: "bg-gradient-to-r from-[#3a3a38] to-[#4a4a48] text-[#f0f0ea]",
      time: "text-[#a0a098]",
    },
  };

  const currentStyle = bubbleClasses[message.from];

  const handleContextMenu = (e) => {
    e.preventDefault();
    if (message.from === "user") {
      setShowContextMenu(true);
    }
  };

  const { theme, setTheme, toggleTheme } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className={`flex ${currentStyle.container} ${isConsecutive ? "mt-1" : "mt-4"} px-4 relative`}
      onContextMenu={handleContextMenu}
    >
      <div className="flex flex-col max-w-[80%] md:max-w-[70%]">
        {!isConsecutive && (
          <div className="flex items-center gap-2 mb-2">
            <img
              src={
                message.from === "bot"
                  ? "https://img.freepik.com/free-vector/hand-drawn-flat-design-anarchy-symbol_23-2149244363.jpg?semt=ais_hybrid&w=740"
                  : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt={message.from === "bot" ? "Bot Logo" : "User Avatar"}
              className="w-8 h-8 rounded-full object-cover shadow-md"
            />
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {message.from === "bot" ? "Alice AI" : "You"}
            </span>
          </div>
        )}

        <div className="flex items-end relative">
          <motion.div
            className={`relative px-4 py-3 rounded-xl ${currentStyle.bubble} shadow-lg group backdrop-blur-sm bg-opacity-80`}
            whileHover={{ scale: 1.02, boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}
            transition={{ duration: 0.2 }}
          >
            <div className="whitespace-pre-wrap break-words text-sm md:text-base">
              {message.text}
            </div>
            <div className={`text-xs mt-1 text-right text-gray-500 dark:text-gray-300 ${currentStyle.time}`}>
              {formatTime(message.timestamp)}
            </div>

            {message.from === "user" && (
              <div className="absolute top-2 right-2 hidden group-hover:flex space-x-2">
                <button
                  onClick={() => onEdit(message)}
                  className="p-1 hover:bg-violet-300 dark:hover:bg-[#5a47a5]/80 rounded-full transition-colors backdrop-blur-sm"
                  aria-label="Edit message"
                >
                  <FiEdit size={16} />
                </button>
                <button
                  onClick={() => onDelete(message.id)}
                  className="p-1 hover:bg-red-300 dark:hover:bg-[#5a47a5]/80 rounded-full transition-colors backdrop-blur-sm"
                  aria-label="Delete message"
                >
                  <FiTrash size={16} />
                </button>
              </div>
            )}
          </motion.div>
        </div>

        {message.reactions?.length > 0 && (
          <div className="flex gap-2 mt-2">
            {message.reactions.map((reaction, index) => (
              <motion.span
                key={index}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="text-sm bg-purple-200 dark:bg-[#5a47a5]/50 px-2 py-1 rounded-full shadow-sm"
              >
                {reaction}
              </motion.span>
            ))}
          </div>
        )}

        <div className="flex gap-2 mt-2">
          {["👍", "❤️"].map((emoji) => (
            <motion.button
              key={emoji}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onAddReaction(message.id, emoji)}
              className="text-sm p-1 hover:bg-purple-300 dark:hover:bg-[#5a47a5]/50 rounded-full transition-colors backdrop-blur-sm"
              aria-label={`Add ${emoji} reaction`}
            >
              {emoji}
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showContextMenu && message.from === "user" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute right-4 top-0 bg-white dark:bg-[#5a47a5]/80 rounded-lg shadow-lg p-2 z-10 backdrop-blur-md"
            onClick={() => setShowContextMenu(false)}
          >
            <button
              onClick={() => onEdit(message)}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-[#6B46C1] transition-colors"
            >
              <FiEdit className="mr-2" size={16} /> Edit
            </button>
            <button
              onClick={() => onDelete(message.id)}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-[#6B46C1] transition-colors"
            >
              <FiTrash className="mr-2" size={16} /> Delete
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ChatBubble;