import { Send } from 'lucide-react'
import React from 'react'
const Input = ({handleSend, input, setInput}) => {
    return (
        <>
            <form
                onSubmit={handleSend}
                className="h-[15%] absolute bottom-0 left-0 w-full p-6 flex gap-3"
            >
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type message..."
                    className="grow px-4 py-1 text-sm bg-black border border-white/20 rounded-lg focus:border-red-600/50 focus:ring-2 focus:ring-red-600/50 outline-none transition-all"
                />
                <button
                    type="submit"
                    className="px-5 py-2 text-sm bg-red-600/50 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-40 backdrop-saturate-60 backdrop-contrast-200  bg-blend-overlay text-white font-semibold rounded-lg hover:scale-[1.05] hover:shadow-[0_0_12px_rgba(236,72,153,0.6)] transition-all flex items-center gap-2"
                >
                    Send <Send size={16} />
                </button>
            </form>
        </>
    )
}

export default Input