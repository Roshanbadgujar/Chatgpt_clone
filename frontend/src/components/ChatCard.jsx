export default function ChatCard({ msg, isUser }) {
  const sender = msg.sender?.toLowerCase() === 'model' ? 'Kanchana' : 'You';

  return (
    <div
      className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-3 shadow-lg border backdrop-blur-md transition-all ${
        isUser
          ? 'self-end bg-gradient-to-r from-red-500/70 to-pink-500/60 border-red-300/40 text-white'
          : 'self-start bg-black/35 border-white/15 text-white/95'
      }`}
    >
      <div className="mb-1 text-[11px] uppercase tracking-widest text-white/70">{sender}</div>
      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
    </div>
  );
}
