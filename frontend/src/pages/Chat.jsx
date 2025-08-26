"use client";
import { io } from "socket.io-client";
import { useState, useEffect, useRef } from "react";
import { Menu, X, Plus, Send } from "lucide-react";
import Loader from "../components/Loading";
import axios from "axios";

export default function ChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const socketRef = useRef(null);

  // Fetch logged-in user
  const fetchUser = async (token) => {
    try {
      const response = await axios.get("http://localhost:5000/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { data } = response;
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
    } catch (error) {
      console.error("❌ Fetch User Error:", error);
      window.location.href = "/login";
    }
  };

  const getchats = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const response = await axios.get("http://localhost:5000/api/chat/chat", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const { data } = response;
      setChats(data);
    } catch (error) {
      console.log(error);
    }
  }

  const getMessages = async (chatId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/message/messages/${chatId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const { data } = response;
      setMessages(data);
    } catch (error) {
      console.log(error);
    }
  }

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;


    // Message payload
    const message = { message: input };
    if (activeChat) {
      message.chatId = activeChat; // send only if already exists
    }

    // Emit to server
    socketRef.current.emit("ai-message", message);

    // Add user message locally
    setMessages((prev) => [...prev, { sender: "User", text: input, time: new Date() }]);
    setInput("");
  };


  // Initialize socket once
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return (window.location.href = "/login");

    (async () => {
      await fetchUser(token);
      await getchats();
      setLoading(false);
    })();

    socketRef.current = io("http://localhost:5000", {
      auth: { token },
    });

    socketRef.current.on("ai-message", (msg) => {

      if (msg.chatId && !activeChat) {
        setActiveChat(msg.chatId);
      }

      setChats((prev) => {
        const exists = prev.find((c) => c._id === msg.chatId);
        if (exists) return prev;
        return [...prev, { _id: msg.chatId, chatName: msg.title }];
      });

      setMessages((prev) => [...prev, { sender: msg.sender || "AI", text: msg.message, time: new Date() }]);
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    if (activeChat) {
      getMessages(activeChat);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChat]);


  if (loading) {
    return <Loader />;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">
      {/* Sidebar */}
      <div
        className={`fixed md:static inset-y-0 left-0 w-64 bg-black/40 backdrop-blur-xl border-r border-white/10 transform transition-transform duration-300 z-40 ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
      >
        <div className="p-4 flex items-center justify-between border-b border-white/10">
          <h2 className="text-lg font-bold">💬 Chats</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-2 rounded-lg hover:bg-white/10"
          >
            <X size={18} />
          </button>
        </div>

        {/* Chats List */}
        <div className="overflow-y-auto h-[calc(100%-80px)] p-3 space-y-2">
          {chats.map((chat) => (
            <div
              key={chat._id}
              onClick={() => setActiveChat(chat._id)}
              className={`px-3 py-2 text-sm rounded-lg cursor-pointer transition-all ${activeChat === chat._id
                ? "bg-pink-500 text-black shadow-lg"
                : "bg-white/5 hover:bg-white/10"
                }`}
            >
              {chat.chatName}
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Navbar */}
        <div className="md:hidden p-3 border-b border-white/10 flex items-center justify-between bg-black/50 backdrop-blur-xl">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-white/10"
          >
            <Menu size={22} />
          </button>
          <h2 className="text-sm font-bold">Chat</h2>
          <button
            onClick={() => setActiveChat(null)}
            className="p-2 rounded-lg hover:bg-white/10"
          >
            <Plus size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
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
                <div
                  key={idx}
                  className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-md transition-all ${isUser
                    ? "ml-auto bg-pink-500 text-black rounded-br-none"
                    : "mr-auto bg-white/20 backdrop-blur-md rounded-bl-none"
                    }`}
                >
                  <p className="text-xs font-bold opacity-70 mb-0.5">
                    {isUser ? "You" : "AI"}
                  </p>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <p className="text-[10px] opacity-50 mt-1 text-right">
                    {new Date(msg.time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              );
            })}
        </div>


        {/* Input */}
        <form
          onSubmit={handleSend}
          className="p-4 border-t rounded-2xl border-white/10 bg-black/30 backdrop-blur-xl flex gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type message..."
            className="flex-1 px-4 py-2 text-sm bg-white/10 border border-white/20 rounded-lg focus:border-pink-400 focus:ring-2 focus:ring-pink-400/40 outline-none transition-all"
          />
          <button
            type="submit"
            className="px-5 py-2 text-sm bg-pink-500 text-black font-semibold rounded-lg hover:scale-[1.05] hover:shadow-[0_0_12px_rgba(236,72,153,0.6)] transition-all flex items-center gap-2"
          >
            Send <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
