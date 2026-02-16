import { Send } from 'lucide-react';

const Input = ({ handleSend, input, onInputChange, disabled }) => {
  return (
    <form onSubmit={handleSend} className="absolute bottom-0 left-0 w-full p-4 md:p-6">
      <div className="mx-auto flex max-w-4xl items-center gap-3 rounded-2xl border border-white/20 bg-black/40 p-2 backdrop-blur-xl">
        <input
          type="text"
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="Dil ki baat type karo..."
          disabled={disabled}
          className="h-11 grow rounded-xl border border-transparent bg-transparent px-4 text-sm text-white placeholder:text-white/50 outline-none focus:border-red-500/40 disabled:opacity-60"
        />

        <button
          type="submit"
          disabled={disabled}
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 px-4 text-sm font-semibold text-white transition-all hover:scale-[1.03] disabled:opacity-60 disabled:hover:scale-100"
        >
          Send <Send size={16} />
        </button>
      </div>
    </form>
  );
};

export default Input;
