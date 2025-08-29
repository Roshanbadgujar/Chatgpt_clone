"use client";
import { io } from "socket.io-client";
import { useState, useEffect, useRef } from "react";
import { Menu, X, Plus, Send } from "lucide-react";
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

  const socketRef = useRef(null);

  // Fetch logged-in user
  const fetchUser = async (token) => {
    try {
      const response = await axios.get("https://chatgpt-clone-sbne.onrender.com/api/auth/profile", {
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
      const response = await axios.get("https://chatgpt-clone-sbne.onrender.com/api/chat/chat", {
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
      const response = await axios.get(`https://chatgpt-clone-sbne.onrender.com/api/message/messages/${chatId}`, {
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

    // Show chat loader
  setLoadingMessage(true);
  chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight + 100;
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

    socketRef.current = io("https://chatgpt-clone-sbne.onrender.com", {
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
    <div className="flex h-screen bg-[url(./wallpaper.jpeg)] bg-cover  text-white">
      {/* Sidebar */}
      <div
        className={`fixed md:static inset-y-0 left-0 w-64 bg-[#6b6a7536] backdrop-blur-xl transform transition-transform duration-300 z-40 ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
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
        <div id="chat-container" className="overflow-y-auto h-[calc(100%-80px)] p-3 space-y-2">
          {chats.map((chat) => (
            <div
              key={chat._id}
              onClick={() => setActiveChat(chat._id)}
              className={`px-3 py-2 text-sm rounded-lg cursor-pointer transition-all ${activeChat === chat._id
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
        <div  ref={chatContainerRef} className="h-[100%] w-fit md:pb-[15%] pb-[30%] relative bg-[url(./wallpaper.jpeg)] bg-fit bg-no-repeat bg-left overflow-y-auto flex flex-col gap-4 p-5 ">
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
        </div>


        {/* Input */}
        <Input handleSend={handleSend} input={input} setInput={setInput} />
      </div>
    </div>
  );
}
