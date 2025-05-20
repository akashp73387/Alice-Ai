import React from "react";
import { motion } from "framer-motion";

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const ChatBubble = ({ message, isConsecutive }) => {
  // Tailwind classes for different message types
  const bubbleClasses = {
    user: {
      container: "justify-end",
      bubble: "bg-[#6B21A8] text-white rounded-br-none", // Deep violet purple
      tail: "bg-[#6B21A8]",
      time: "text-purple-100",
    },
    bot: {
      container: "justify-start",
      bubble: "bg-[#3a3a38] text-[#f0f0ea] rounded-bl-none", // Dark gray
      tail: "bg-[#3a3a38]",
      time: "text-[#a0a098]",
    },
  };

  const currentStyle = bubbleClasses[message.from];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className={`flex ${currentStyle.container} ${
        isConsecutive ? "mt-1" : "mt-3"
      } px-4`}
    >
      <div className="flex flex-col max-w-[85%]">
        {!isConsecutive && (
          <div className="flex items-center gap-2 mb-1">
            <img
              src={
                message.from === "bot"
                  ? "https://img.freepik.com/free-vector/hand-drawn-flat-design-anarchy-symbol_23-2149244363.jpg?semt=ais_hybrid&w=740"
                  : "https://cdn-icons-png.flaticon.com/512/149/149071.png" // replace with your user image
              }
              alt={message.from === "bot" ? "Bot Logo" : "User Avatar"}
              className="w-5 h-5 rounded-full object-cover"
            />
            <span className="text-xs text-gray-400">
              {message.from === "bot" ? "Alice Ai" : "You"}
            </span>
          </div>
        )}

        <div className="flex items-end">
          <motion.div
            className={`relative px-4 py-2.5 rounded-lg ${currentStyle.bubble} shadow-md`}
            whileHover={{ scale: 1.01 }}
          >
            <div className="whitespace-pre-wrap break-words">
              {message.text}
            </div>
            <div className={`text-xs mt-1 text-right ${currentStyle.time}`}>
              {formatTime(message.timestamp)}
            </div>

            {/* Speech bubble tail */}
            {!isConsecutive && (
              <div
                className={`absolute w-3 h-3 ${currentStyle.tail} -bottom-1 ${
                  message.from === "user" ? "-right-1" : "-left-1"
                }`}
                style={{
                  clipPath:
                    message.from === "user"
                      ? "polygon(0% 0%, 100% 100%, 0% 100%)"
                      : "polygon(100% 0%, 0% 100%, 100% 100%)",
                }}
              />
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatBubble;
