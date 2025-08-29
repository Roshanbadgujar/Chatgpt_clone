import React from 'react'

const ChatCard = ({idx, msg, isUser}) => {
    return (
    <div
        className={`${isUser ? "max-w-[60%] w-fit" : "max-w-[80%] w-fit"} px-4 py-2 rounded-2xl shadow-md transition-all ${!isUser
            ? "mr-auto rounded-bl-none bg-red-600/50 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-40 backdrop-saturate-60 backdrop-contrast-200  bg-blend-overlay"
            : "ml-auto bg-white/20 backdrop-blur-md rounded-br-none"
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
    )
}

export default ChatCard