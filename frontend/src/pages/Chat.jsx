"use client";
import { io } from "socket.io-client";
import { useState, useEffect, useRef } from "react";
import { Menu, X, Plus, Loader2, ChevronDown } from "lucide-react";
import Loader from "../components/Loading";
import axios from "axios";
import ChatCard from "../components/ChatCard";
import Input from "../components/Input";

export default function ChatPage() {
  const chatContainerRef = useRef(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [showNewMsgBtn, setShowNewMsgBtn] = useState(false);

  const socketRef = useRef(null);

  // Fetch logged-in user
  const fetchUser = async (token) => {
    try {
      const response = await axios.get(
        "https://chatgpt-clone-sbne.onrender.com/api/auth/profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const { data } = response;
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
    } catch (error) {
      console.error("❌ Fetch User Error:", error);
      window.location.href = "/login";
    }
  };

  const getChats = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const response = await axios.get(
        "https://chatgpt-clone-sbne.onrender.com/api/chat/chat",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const { data } = response;
      setChats(data.reverse()); // latest chats top
    } catch (error) {
      console.log(error);
    }
  };

  const getMessages = async (chatId) => {
    try {
      const response = await axios.get(
        `https://chatgpt-clone-sbne.onrender.com/api/message/messages/${chatId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const { data } = response;
      setMessages(data);
    } catch (error) {
      console.log(error);
    }
  };

  // 🆕 New Chat Handler
  const handleNewChat = () => {
    if (loadingMessage) return; // prevent while AI typing
    const alreadyTemp = chats.find((c) => c._id.startsWith("temp-"));
    if (alreadyTemp) return; // prevent multiple temp chats

    const newChat = {
      _id: `temp-${Date.now()}`,
      chatName: "New Chat",
      isTemp: true,
    };

    setChats((prev) => [newChat, ...prev]);
    setActiveChat(newChat._id);
    setMessages([]);

    // close sidebar on mobile
    setSidebarOpen(false);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const message = { message: input };
    if (activeChat && !activeChat.startsWith("temp-")) {
      message.chatId = activeChat;
    }

    socketRef.current.emit("ai-message", message);

    setMessages((prev) => [
      ...prev,
      { sender: "User", text: input, time: new Date() },
    ]);
    setInput("");
    setLoadingMessage(true);

    chatContainerRef.current.scrollTop =
      chatContainerRef.current.scrollHeight + 100;
  };

  // Initialize socket
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return (window.location.href = "/login");

    (async () => {
      await fetchUser(token);
      await getChats();
      setLoading(false);
    })();

    socketRef.current = io("https://chatgpt-clone-sbne.onrender.com", {
      auth: { token },
    });

    socketRef.current.on("ai-message", (msg) => {
      // replace temp chat with real one
      if (msg.chatId) {
        setActiveChat((prev) =>
          !prev || prev.startsWith("temp-") ? msg.chatId : prev
        );

        setChats((prev) => {
          const tempIndex = prev.findIndex((c) => c._id.startsWith("temp-"));
          if (tempIndex !== -1) {
            const updated = [...prev];
            updated[tempIndex] = { _id: msg.chatId, chatName: msg.title };
            return updated;
          }
          const exists = prev.find((c) => c._id === msg.chatId);
          if (exists) return prev;
          return [{ _id: msg.chatId, chatName: msg.title }, ...prev];
        });
      }

      setMessages((prev) => [
        ...prev,
        { sender: msg.sender || "AI", text: msg.message, time: new Date() },
      ]);
      setLoadingMessage(false);
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    if (activeChat && !activeChat.startsWith("temp-")) {
      getMessages(activeChat);
    }
  }, [activeChat]);

  // Scroll detector for floating button
  useEffect(() => {
    const el = chatContainerRef.current;
    if (!el) return;

    const handleScroll = () => {
      const nearBottom =
        el.scrollHeight - el.scrollTop - el.clientHeight < 150;
      setShowNewMsgBtn(!nearBottom);
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  // Close sidebar when clicking outside (mobile only)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        sidebarOpen &&
        !e.target.closest(".sidebar") &&
        !e.target.closest(".toggle-sidebar")
      ) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [sidebarOpen]);

  if (loading) return <Loader />;

  return (
    <div className="flex h-screen bg-[url(./wallpaper.jpeg)] bg-cover text-white">
      {/* Sidebar */}
      <div
        className={`sidebar fixed md:static inset-y-0 left-0 w-64 bg-[#6b6a7536] backdrop-blur-xl transform transition-transform duration-300 z-40 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-4 flex items-center justify-between border-b border-white/10">
          <h2 className="text-lg font-bold">💬 Chats</h2>
          {/* Desktop → show New Chat, Mobile → show Close */}
          <button
            onClick={() =>
              window.innerWidth >= 768 ? handleNewChat() : setSidebarOpen(false)
            }
            className="p-2 rounded-lg hover:bg-white/10"
          >
            {window.innerWidth >= 768 ? (
              <Plus size={18} />
            ) : (
              <X size={18} />
            )}
          </button>
        </div>

        {/* Chats List */}
        <div className="overflow-y-auto h-[calc(100%-80px)] p-3 space-y-2">
          {chats.map((chat) => (
            <div
              key={chat._id}
              onClick={() => {
                if (!loadingMessage) setActiveChat(chat._id);
                setSidebarOpen(false);
              }}
              className={`px-3 py-2 text-sm rounded-lg cursor-pointer transition-all ${
                activeChat === chat._id
                  ? "bg-red-600/50 text-white shadow-lg"
                  : "bg-white/5 hover:bg-white/10"
              }`}
            >
              {chat.chatName}
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat */}
      <div className="flex-1 w-[80%] relative flex flex-col">
        {/* Mobile Navbar */}
        <div className="md:hidden p-3 border-b border-white/10 flex items-center justify-between bg-red-500/50 backdrop-blur-xl">
          <button
            onClick={() => setSidebarOpen(true)}
            className="toggle-sidebar p-2 rounded-lg hover:bg-white/10"
          >
            <Menu size={22} />
          </button>
          <h2 className="text-sm font-bold">Chat</h2>
          <button
            onClick={handleNewChat}
            className="p-2 rounded-lg hover:bg-white/10"
          >
            <Plus size={20} />
          </button>
        </div>

        {/* Messages */}
        <div
          ref={chatContainerRef}
          className="h-[100%] md:pb-[15%] pb-[30%] relative bg-[url(./wallpaper.jpeg)] bg-fit bg-no-repeat bg-left overflow-y-auto flex flex-col gap-4 p-5"
        >
          {messages.length === 0 && (
            <p className="text-gray-400 text-center">
              👋 Welcome! Start a conversation by typing your first message.
            </p>
          )}
          {[...messages]
            .sort((a, b) => {
              const diff = new Date(a.time).getTime() - new Date(b.time).getTime();
              if (diff === 0) {
                // ⏱️ Same timing → user first, then AI
                if (a.sender?.toLowerCase() === "user" && b.sender?.toLowerCase() === "model") return -1;
                if (a.sender?.toLowerCase() === "model" && b.sender?.toLowerCase() === "user") return 1;
                return 0;
              }
              return diff;
            })
            .map((msg, idx) => {
              const isUser = msg.sender?.toLowerCase() === "user";
              return (
                <ChatCard key={idx} msg={msg} isUser={isUser} />
              );
            })}
          {/* Loader for AI response */}
          {loadingMessage && (
            <div className="flex items-center gap-2 text-gray-300">
              <Loader2 className="animate-spin" size={20} />
              <span>AI is typing...</span>
            </div>
          )}
        </div>

        {/* Floating new message button */}
        {showNewMsgBtn && (
          <button
            onClick={() =>
              (chatContainerRef.current.scrollTop =
                chatContainerRef.current.scrollHeight)
            }
            className="absolute bottom-28 right-6 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg transition-all animate-bounce"
          >
            <ChevronDown size={18} /> New Messages
          </button>
        )}

        {/* Input */}
        <Input handleSend={handleSend} input={input} setInput={setInput} />
      </div>
    </div>
  );
}
