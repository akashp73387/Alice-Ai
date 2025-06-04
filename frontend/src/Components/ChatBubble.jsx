import React from "react";
import { motion } from "framer-motion";
import { FiEdit, FiCopy } from "react-icons/fi";
import useTheme from "../hooks/theme";
import alicedark from "../../assets/Alice-logo.png";
import toast from "react-hot-toast";

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const ChatBubble = ({ message, isConsecutive, onEdit }) => {
  const bubbleClasses = {
    user: {
      container: "justify-end",
      bubble: "bg-[#e5e5ea] dark:bg-[#3a3a38] text-black dark:text-[#f0f0ea]",
      time: "text-[#666] dark:text-[#a0a098]",
    },
    bot: {
      container: "justify-start",
      bubble: "",
      time: "text-[#666] dark:text-[#a0a098]",
      line: "border-l-4 border-gray-400 dark:border-gray-600 pl-4 text-black dark:text-[#f0f0ea]",
    },
  };

  const currentStyle = bubbleClasses[message.from];

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    toast.success("Message copied!");
  };

  const { theme } = useTheme();

  const isWelcomeMessage =
    message.from === "bot" && message.text.toLowerCase().includes("welcome");

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className={`flex ${currentStyle.container} ${
        isConsecutive ? "mt-1" : "mt-4"
      } px-4 relative`}
    >
      <div className="flex flex-col max-w-[80%] md:max-w-[70%]">
        {!isConsecutive && message.from === "bot" && (
          <div className="flex items-center gap-2 mb-2">
            <img
              src={alicedark}
              alt="Bot Logo"
              className="w-8 h-8 rounded-full object-cover shadow-md"
            />
            <span className="text-sm font-medium text-black dark:text-white">
              Alice AI
            </span>
          </div>
        )}

        <div className="flex items-end relative">
          <div
            className={`relative px-4 py-3 rounded-xl ${currentStyle.bubble} shadow-lg backdrop-blur-sm bg-opacity-80`}
          >
            <div className="whitespace-pre-wrap break-words text-sm md:text-base">
              {message.text}
            </div>
            <div className={`text-xs mt-1 text-right ${currentStyle.time}`}>
              {formatTime(message.timestamp)}
            </div>
          </div>
        </div>

        {/* Copy button for bot message (except welcome message) */}
        {message.from === "bot" && !message.text.startsWith("Hello!") && (
          <div className="flex gap-4 mt-1 ms-2">
            <div className="relative group flex flex-col items-center">
              <button
                onClick={handleCopy}
                className="text-gray-600 dark:text-white hover:text-purple-600 dark:hover:text-purple-300 transition-colors"
              >
                <FiCopy size={16} />
              </button>
              <span className="absolute mt-6 text-xs opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 dark:text-gray-300">
                Copy
              </span>
            </div>
          </div>
        )}

        {/* Copy and Edit icons for user messages */}
        {message.from === "user" && (
          <div className="flex gap-4 mt-1 ms-2">
            {/* Copy Button */}
            <div className="relative group flex flex-col items-center">
              <button
                onClick={handleCopy}
                className="text-gray-600 dark:text-white hover:text-purple-600 dark:hover:text-purple-300 transition-colors"
              >
                <FiCopy size={16} />
              </button>
              <span className="absolute mt-6 text-xs opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 dark:text-gray-300">
                Copy
              </span>
            </div>

            {/* Edit Button */}
            <div className="relative group flex flex-col items-center">
              <button
                onClick={() => onEdit(message)}
                className="text-gray-600 dark:text-white hover:text-purple-600 dark:hover:text-purple-300 transition-colors"
              >
                <FiEdit size={16} />
              </button>
              <span className="absolute mt-6 text-xs opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 dark:text-gray-300">
                Edit
              </span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ChatBubble;
