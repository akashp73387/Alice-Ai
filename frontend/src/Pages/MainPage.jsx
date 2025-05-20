import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
// import SearchBar from "../Components/SearchBar";
import ChatBubble from "../Components/ChatBubble";
import { FiSend, FiPaperclip, FiMic, FiWifi, FiWifiOff } from "react-icons/fi";

const MainPage = () => {
  const isLoggedIn = !!localStorage.getItem("token"); 
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [chat, setChat] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [msg, setMsg] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [activeChat, setActiveChat] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [hasConnected, setHasConnected] = useState(false);

  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);
  




  useEffect(() => {
    if (!isLoggedIn && msg.trim() !== "") {
      navigate("/signin");
    }
  }, [msg, isLoggedIn, navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/signin");

    setChatHistory([
      {
        id: 1,
        title: "Marketing Strategy",
        lastMessage: "Let's discuss Q3 plans",
        timestamp: new Date(Date.now() - 86400000),
      },
      {
        id: 2,
        title: "Product Feedback",
        lastMessage: "Users love the new UI",
        timestamp: new Date(Date.now() - 172800000),
      },
      {
        id: 3,
        title: "Technical Support",
        lastMessage: "The API is working now",
        timestamp: new Date(Date.now() - 259200000),
      },
    ]);
  }, []);

  useEffect(() => {
    const socket = new WebSocket("http://localhost:3001");
    // ws://195.201.164.158:8765
    socketRef.current = socket;

    socket.onopen = () => {
      setConnectionStatus("connected");
      setHasConnected(true);
      addBotMessage(
        "Hello! I'm your Alice AI assistant. How can I help you today?"
      );
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      addMessage(data.type === "user" ? "user" : "bot", data.message);
      setIsTyping(false);
    };

    socket.onclose = () => {
      setConnectionStatus("disconnected");
      if (hasConnected) {
        addBotMessage("Connection lost. Trying to reconnect...");
      }
    };

    socket.onerror = () => {
      setConnectionStatus("disconnected");
    };

    return () => socket.close();
  }, []);

  const addMessage = (from, text) => {
    setChat((prev) => [...prev, { from, text, timestamp: new Date() }]);
  };

  const addBotMessage = (text) => addMessage("bot", text);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
      setIsListening(false);
      setIsTyping(false);
    }
  };

  const sendMessage = (messageToSend = null) => {
    stopListening(); // Ensure mic stops before sending

    const text = messageToSend !== null ? messageToSend : msg;
    if (!text.trim() || connectionStatus !== "connected" || !socketRef.current)
      return;

    socketRef.current.send(
      JSON.stringify({ user_id: 2090364640, message: text })
    );
    addMessage("user", text);
    setMsg("");
    setIsTyping(true);
    inputRef.current?.focus();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const isLoggedIn = !!localStorage.getItem("token");
      if (!isLoggedIn) {
        navigate("/signin");
        return;
      }
      sendMessage();
    }
  };

  // Sidebar toggle function
  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen((prev) => !prev);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      addMessage("user", `[File: ${file.name}]`);
      console.log("Uploading file:", file.name);
    }
  };

  const handleVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition not supported");
      return;
    }

    if (recognitionRef.current) {
      stopListening();
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    recognition.start();
    setIsListening(true);
    setIsTyping(true);

    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      setMsg(speechToText);
      sendMessage(speechToText);
    };

    recognition.onerror = (event) => {
      console.error("Speech error:", event.error);
      stopListening();
    };

    recognition.onend = () => stopListening();
  };

  const startNewChat = () => {
    setChat([]);
    setActiveChat(null);
    addBotMessage(
      "Hello! I'm your Alice AI assistant. What would you like to discuss?"
    );
  };

  const loadChat = (chatId) => {
    setActiveChat(chatId);
    setChat([
      { from: "bot", text: `Loading chat ${chatId}...`, timestamp: new Date() },
      {
        from: "user",
        text: "Sample message from this conversation",
        timestamp: new Date(Date.now() - 3600000),
      },
      {
        from: "bot",
        text: "Sample response from the assistant",
        timestamp: new Date(Date.now() - 3500000),
      },
    ]);
  };



  useEffect(() => {
    const focusInput = () => {
      inputRef.current?.focus();
    };

    // Initial focus
    focusInput();

    // Refocus on blur
    const inputElement = inputRef.current;
    inputElement.addEventListener("blur", focusInput);

    return () => {
      inputElement.removeEventListener("blur", focusInput);
    };
  }, []);


  return (
    <div className="h-screen w-screen flex flex-row bg-[#282828] text-[#2D3748] overflow-hidden relative">
      {/* Overlay */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
            onClick={toggleMobileSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar - desktop */}
      <motion.div
        className={`hidden lg:flex h-full ${
          isCollapsed ? "w-20" : "w-64"
        } flex-shrink-0 bg-[#4C3B8B] transition-all duration-300`}
        animate={{ x: 0 }}
      >
        <Sidebar
          isCollapsed={isCollapsed}
          toggleSidebar={toggleSidebar}
          recentChats={chatHistory}
          activeChat={activeChat}
          onNewChat={startNewChat}
          onSelectChat={loadChat}
          closeMobileSidebar={() => setIsMobileSidebarOpen(false)}
          isMobile={false}
        />
      </motion.div>

      {/* Sidebar - mobile */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 bottom-0 w-64 z-30 bg-[#4C3B8B] lg:hidden"
          >
            <Sidebar
              isCollapsed={false}
              toggleSidebar={toggleSidebar}
              recentChats={chatHistory}
              activeChat={activeChat}
              onNewChat={startNewChat}
              onSelectChat={loadChat}
              closeMobileSidebar={toggleMobileSidebar}
              isMobile={true}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header
          style={{ backgroundColor: "#4C3B8B", color: "#FFFFFF" }}
          onMenuClick={toggleMobileSidebar}
          onSidebarToggle={toggleSidebar}
          title={
            activeChat
              ? chatHistory.find((c) => c.id === activeChat)?.title
              : "New Chat"
          }
          isSidebarCollapsed={isCollapsed} // Optional: pass sidebar collapsed state if needed in Header
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <div
            className="flex-1 overflow-y-auto p-4 md:p-6 bg-gradient-to-b from-[#282828] to-[#282828]
"
          >
            <div className="max-w-3xl mx-auto w-full space-y-4">
              <AnimatePresence>
                {chat.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <div className="text-3xl font-bold text-[#4C3B8B] mb-4">
                      Alice AI Assistant
                    </div>
                    <div className="text-gray-600 max-w-md mx-auto">
                      Ask me anything or start a new conversation.
                    </div>
                  </motion.div>
                )}

                {chat.map((msg, i) => (
                  <ChatBubble
                    key={i}
                    message={msg}
                    isConsecutive={i > 0 && chat[i - 1].from === msg.from}
                  />
                ))}

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-end items-center space-x-2"
                  >
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full bg-[#4C3B8B] animate-bounce" />
                      <div
                        className="w-2 h-2 rounded-full bg-[#4C3B8B] animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      />
                      <div
                        className="w-2 h-2 rounded-full bg-[#4C3B8B] animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                    <div className="text-sm text-gray-500 italic">
                       is Typing...
                    </div>
                       
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input area */}
          <div className=" border-gray-700 bg-gradient-to-b from-[#282828] to-[#282828] p-4 flex items-center space-x-3 max-w-3xl mx-auto w-full">
            <textarea
              ref={inputRef}
              className="flex-grow resize-none rounded-md border border-gray-600 bg-[#1f1f1f] text-white p-2 focus:outline-none focus:ring-2 focus:ring-[#4C3B8B]"
              rows={1}
              placeholder="Type your message..."
              value={msg}
              onChange={(e) => {
                setMsg(e.target.value);
                stopListening();
              }}
              onKeyDown={handleKeyPress}
              aria-label="Message input"
            />

            <label
              htmlFor="file-upload"
              className="cursor-pointer p-2 rounded hover:bg-[#3a3a3a] transition-colors"
              title="Attach a file"
            >
              <FiPaperclip size={22} className="text-[#4C3B8B]" />
            </label>
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileUpload}
            />

            <button
              onClick={handleVoiceInput}
              className={`p-2 rounded-full transition-colors ${
                isListening
                  ? "bg-[#4C3B8B] text-white"
                  : "bg-gray-700 text-gray-100 hover:bg-gray-600"
              }`}
              aria-label={isListening ? "Listening..." : "Start voice input"}
              disabled={isTyping}
            >
              <FiMic size={22} />
            </button>
            <button
              onClick={() => sendMessage()}
              className="p-2 rounded-full bg-[#4C3B8B] text-white hover:bg-[#5a47a5] transition-colors"
              aria-label="Send message"
              disabled={isTyping || !msg.trim()}
            >
              <FiSend size={22} />
            </button>
          </div>
        </div>
      </div>
      {showSettings && <SettingsModal onClose={toggleSettingsModal} />}
    </div>
  );
};

export default MainPage;
