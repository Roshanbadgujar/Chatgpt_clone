export default function ChatCard({ msg, isUser }) {
  return (
    <div
      className={`chat-bubble max-w-[70%] p-3 rounded-xl ${
        isUser ? "self-end" : "self-start"
      }`}
    >
      {msg.text}
    </div>
  );
}
