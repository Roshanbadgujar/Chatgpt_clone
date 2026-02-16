"use client";

import { io } from "socket.io-client";
import { useState, useEffect, useRef } from "react";
import {
  Menu,
  X,
  Plus,
  Loader2,
  ChevronDown,
  Sparkles,
  Mic,
  Crown,
} from "lucide-react";
import Loader from "../components/Loading";
import axios from "axios";
import ChatCard from "../components/ChatCard";
import Input from "../components/Input";
import { API_BASE_URL, API_ENDPOINTS } from "../config/api";

export default function ChatPage() {
  const chatContainerRef = useRef(null);
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const activeChatRef = useRef(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [showNewMsgBtn, setShowNewMsgBtn] = useState(false);

  const [socketError, setSocketError] = useState("");
  const [sparkLoading, setSparkLoading] = useState(false);
  const [spark, setSpark] = useState(null);
  const [voiceMode, setVoiceMode] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  const fetchUser = async (token) => {
    try {
      const response = await axios.get(API_ENDPOINTS.profile, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
      const response = await axios.get(API_ENDPOINTS.chats, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setChats(response.data.reverse());
    } catch (error) {
      console.log(error);
    }
  };

  const getMessages = async (chatId) => {
    try {
      const response = await axios.get(API_ENDPOINTS.messages(chatId), {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setMessages(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleNewChat = () => {
    if (loadingMessage) return;
    const alreadyTemp = chats.find((c) => c._id.startsWith("temp-"));
    if (alreadyTemp) return;

    const newChat = {
      _id: `temp-${Date.now()}`,
      chatName: "New Chat",
      isTemp: true,
    };

    setChats((prev) => [newChat, ...prev]);
    setActiveChat(newChat._id);
    setMessages([]);
    setSidebarOpen(false);
    setSocketError("");
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || !socketRef.current) return;

    const payload = {
      message: input,
      meta: {
        voiceMode,
        isPremium,
        memoryHints: [
          `User name: ${user?.fullName?.firstName || "User"}`,
          "Keep tone emotional but balanced.",
        ],
      },
    };

    if (activeChat && !activeChat.startsWith("temp-")) {
      payload.chatId = activeChat;
    }

    socketRef.current.emit("ai-message", payload);

    setMessages((prev) => [
      ...prev,
      { sender: "User", text: input, time: new Date() },
    ]);
    setInput("");
    setLoadingMessage(true);

    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight + 120;
    }
  };

  const handleInputChange = (value) => {
    setInput(value);

    if (!socketRef.current || !activeChat || activeChat.startsWith("temp-")) return;

    socketRef.current.emit("typing", {
      chatId: activeChat,
      isTyping: Boolean(value.trim()),
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current?.emit("typing", {
        chatId: activeChat,
        isTyping: false,
      });
    }, 900);
  };

  const requestCompanionSpark = () => {
    if (!socketRef.current) return;
    setSparkLoading(true);
    setSocketError("");
    socketRef.current.emit("fetch-companion-spark");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return (window.location.href = "/login");

    (async () => {
      await fetchUser(token);
      await getChats();
      setLoading(false);
    })();

    socketRef.current = io(API_BASE_URL, {
      auth: { token },
    });

    socketRef.current.on("connect_error", (err) => {
      setSocketError(err?.message || "Socket connection failed");
    });

    socketRef.current.on("ai-message", (msg) => {
      if (msg.chatId) {
        setActiveChat((prev) =>
          !prev || prev.startsWith("temp-") ? msg.chatId : prev,
        );

        setChats((prev) => {
          const tempIndex = prev.findIndex((c) => c._id.startsWith("temp-"));
          if (tempIndex !== -1) {
            const updated = [...prev];
            updated[tempIndex] = {
              _id: msg.chatId,
              chatName: msg.title || "New Chat",
            };
            return updated;
          }

          const exists = prev.find((c) => c._id === msg.chatId);
          if (exists) return prev;

          return [
            { _id: msg.chatId, chatName: msg.title || "New Chat" },
            ...prev,
          ];
        });
      }

      setMessages((prev) => [
        ...prev,
        { sender: msg.sender || "AI", text: msg.message, time: new Date() },
      ]);
      setLoadingMessage(false);
    });

    socketRef.current.on("new-message", (msg) => {
      if (msg.chatId !== activeChatRef.current) return;
      setMessages((prev) => [
        ...prev,
        { sender: msg.sender || "AI", text: msg.message, time: new Date() },
      ]);
    });

    socketRef.current.on("companion-spark", (payload) => {
      setSpark(payload);
      setSparkLoading(false);
    });

    socketRef.current.on("ai-error", (payload) => {
      setSocketError(payload?.error || "Something went wrong");
      setLoadingMessage(false);
    });

    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    activeChatRef.current = activeChat;

    if (!socketRef.current) return;
    if (activeChat && !activeChat.startsWith("temp-")) {
      socketRef.current.emit("join-chat", activeChat);
      getMessages(activeChat);
    }

    return () => {
      if (activeChat && !activeChat.startsWith("temp-")) {
        socketRef.current?.emit("leave-chat", activeChat);
      }
    };
  }, [activeChat]);

  useEffect(() => {
    const el = chatContainerRef.current;
    if (!el) return;

    const handleScroll = () => {
      const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 150;
      setShowNewMsgBtn(!nearBottom);
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

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
      <div className="absolute inset-0 bg-gradient-to-br from-black/55 via-black/35 to-[#2b0a23]/60 pointer-events-none" />

      <div
        className={`sidebar fixed md:static inset-y-0 left-0 w-72 bg-black/35 backdrop-blur-2xl transform transition-transform duration-300 z-40 border-r border-white/10 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-4 flex items-center justify-between border-b border-white/10">
          <div>
            <h2 className="text-lg font-bold">💬 Kanchana Chats</h2>
            <p className="text-xs text-white/60 mt-1">{user?.fullName?.firstName || "User"}</p>
          </div>
          <button
            onClick={() =>
              window.innerWidth >= 768 ? handleNewChat() : setSidebarOpen(false)
            }
            className="p-2 rounded-lg hover:bg-white/10"
          >
            {window.innerWidth >= 768 ? <Plus size={18} /> : <X size={18} />}
          </button>
        </div>

        <div className="overflow-y-auto h-[calc(100%-80px)] p-3 space-y-2">
          {chats.map((chat) => (
            <div
              key={chat._id}
              onClick={() => {
                if (!loadingMessage) setActiveChat(chat._id);
                setSidebarOpen(false);
              }}
              className={`px-3 py-2.5 text-sm rounded-xl cursor-pointer transition-all border ${
                activeChat === chat._id
                  ? "bg-gradient-to-r from-red-500/50 to-pink-500/40 border-pink-300/40 text-white shadow-lg"
                  : "bg-white/5 border-white/10 hover:bg-white/10"
              }`}
            >
              {chat.chatName}
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 flex-1 w-[80%] flex flex-col">
        <div className="md:hidden p-3 border-b border-white/10 flex items-center justify-between bg-black/40 backdrop-blur-xl">
          <button
            onClick={() => setSidebarOpen(true)}
            className="toggle-sidebar p-2 rounded-lg hover:bg-white/10"
          >
            <Menu size={22} />
          </button>
          <h2 className="text-sm font-bold">Kanchana</h2>
          <button
            onClick={handleNewChat}
            className="p-2 rounded-lg hover:bg-white/10"
          >
            <Plus size={20} />
          </button>
        </div>

        <div className="px-5 pt-4 flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={requestCompanionSpark}
            disabled={sparkLoading}
            className="px-3 py-2 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 flex items-center gap-2 disabled:opacity-60"
          >
            <Sparkles size={14} />
            {sparkLoading ? "Fetching spark..." : "Companion Spark"}
          </button>

          <button
            onClick={() => setVoiceMode((prev) => !prev)}
            className={`px-3 py-2 rounded-xl border border-white/20 flex items-center gap-2 ${
              voiceMode ? "bg-emerald-600/70" : "bg-white/10 hover:bg-white/20"
            }`}
          >
            <Mic size={14} /> Voice: {voiceMode ? "On" : "Off"}
          </button>

          <button
            onClick={() => setIsPremium((prev) => !prev)}
            className={`px-3 py-2 rounded-xl border border-white/20 flex items-center gap-2 ${
              isPremium ? "bg-amber-400/90 text-black" : "bg-white/10 hover:bg-white/20"
            }`}
          >
            <Crown size={14} /> {isPremium ? "Premium" : "Free"}
          </button>
        </div>

        {socketError && (
          <div className="mx-5 mt-3 p-3 rounded-xl bg-red-600/30 border border-red-400/40 text-sm">
            ⚠️ {socketError}
          </div>
        )}

        {spark && (
          <div className="mx-5 mt-3 p-3 rounded-xl bg-white/10 border border-white/20 text-sm space-y-1">
            <p>
              ✨ <strong>Advice:</strong> {spark.advice}
            </p>
            <p>
              🕯️ <strong>Quote:</strong> {spark.quote} — {spark.quoteAuthor}
            </p>
            <p>
              🎯 <strong>Activity:</strong> {spark.activity}
            </p>
          </div>
        )}

        <div
          ref={chatContainerRef}
          className="h-full pb-32 md:pb-28 overflow-y-auto flex flex-col gap-4 p-5"
        >
          {messages.length === 0 && (
            <p className="text-white/70 text-center mt-6">
              👋 Start a conversation. Kanchana is listening.
            </p>
          )}

          {[...messages]
            .sort((a, b) => {
              const diff = new Date(a.time).getTime() - new Date(b.time).getTime();
              if (diff === 0) {
                if (
                  a.sender?.toLowerCase() === "user" &&
                  b.sender?.toLowerCase() === "model"
                ) {
                  return -1;
                }
                if (
                  a.sender?.toLowerCase() === "model" &&
                  b.sender?.toLowerCase() === "user"
                ) {
                  return 1;
                }
                return 0;
              }
              return diff;
            })
            .map((msg, idx) => {
              const isUser = msg.sender?.toLowerCase() === "user";
              return <ChatCard key={idx} msg={msg} isUser={isUser} />;
            })}

          {loadingMessage && (
            <div className="flex items-center gap-2 text-gray-300">
              <Loader2 className="animate-spin" size={20} />
              <span>Kanchana is typing...</span>
            </div>
          )}
        </div>

        {showNewMsgBtn && (
          <button
            onClick={() => {
              if (chatContainerRef.current) {
                chatContainerRef.current.scrollTop =
                  chatContainerRef.current.scrollHeight;
              }
            }}
            className="absolute bottom-28 right-6 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg transition-all animate-bounce"
          >
            <ChevronDown size={18} /> New Messages
          </button>
        )}

        <Input
          handleSend={handleSend}
          input={input}
          onInputChange={handleInputChange}
          disabled={loadingMessage}
        />
      </div>
    </div>
  );
}
