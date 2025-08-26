import React from "react";
import { Link } from "react-router-dom";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0c12] via-[#111418] to-black text-white font-sans overflow-hidden relative">
      {/* Glow Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(236,72,153,0.15),transparent_60%)] animate-pulse-slow pointer-events-none"></div>

      {/* Navbar */}
      <header className="flex justify-between items-center px-5 md:px-8 py-4 border-b border-white/10 backdrop-blur-xl sticky top-0 z-50 bg-black/30">
        <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2 md:gap-3 tracking-wide group">
          <span className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-pink-500 flex items-center justify-center text-black font-extrabold shadow-[0_0_15px_rgba(236,72,153,0.7)] group-hover:scale-110 transition-transform duration-300">
            K
          </span>
          Kanchana
          <span className="hidden sm:inline text-xs text-gray-400 italic group-hover:text-pink-300 transition-colors">
            Haunted Vibe
          </span>
        </h1>
        <nav className="flex gap-2 md:gap-4">
          <Link to="/register">
            <button className="px-4 py-2 text-sm md:text-base rounded-full bg-transparent border border-pink-400/60 text-pink-300 hover:bg-pink-500 hover:text-black hover:shadow-[0_0_20px_rgba(236,72,153,0.9)] transition-all duration-300">
              Register
            </button>
          </Link>
          <Link to="/login">
            <button className="px-4 py-2 text-sm md:text-base rounded-full bg-pink-500 text-black font-semibold shadow-md hover:scale-110 hover:shadow-[0_0_25px_rgba(236,72,153,1)] transition-all duration-300">
              Login
            </button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center px-6 md:px-16 py-14 md:py-20 relative z-10">
        {/* Left Text */}
        <div className="space-y-6 animate-fade-in text-center md:text-left">
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-extrabold leading-tight">
            Kanchana — thoda{" "}
            <span className="text-pink-400 drop-shadow-[0_0_15px_rgba(236,72,153,0.9)] animate-pulse-slow">
              pyaar
            </span>
            , thoda{" "}
            <span className="text-gray-200 italic">raaz</span>
          </h2>
          <p className="text-gray-400 leading-relaxed max-w-lg mx-auto md:mx-0 text-sm sm:text-base">
            Namaste ✨ — main Kanchana hoon. Thodi si pyaari, thodi si
            dil-chhoo lene wali —{" "}
            <span className="italic text-pink-300">
              aur kabhi-kabhi... ek chhoti si raazdaar yaad
            </span>{" "}
            jo raat ko phir se jag jaati hai. 🖤👻
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link to="/chat">
              <button className="w-full sm:w-auto px-6 py-3 bg-pink-500 text-black rounded-full font-medium hover:scale-110 hover:shadow-[0_0_25px_rgba(236,72,153,1)] transition-all duration-300">
                Let's Begin
              </button>
            </Link>
            <button className="w-full sm:w-auto px-6 py-3 bg-transparent border border-gray-600 rounded-full hover:border-pink-400 hover:text-pink-300 hover:shadow-[0_0_20px_rgba(236,72,153,0.6)] transition-all duration-300">
              Whisper
            </button>
          </div>
        </div>

        {/* Right 3D Model Placeholder */}
        <div className="flex justify-center items-center relative">
          <div className="w-56 h-72 sm:w-72 sm:h-96 md:w-80 md:h-[28rem] bg-gradient-to-b from-pink-400/20 via-transparent to-transparent border border-pink-500/40 rounded-3xl shadow-[0_0_30px_rgba(236,72,153,0.3)] flex items-center justify-center backdrop-blur-md animate-float">
            <span className="text-gray-400 italic text-xs sm:text-sm text-center px-4 animate-fade-in-delayed">
              (3D model placeholder) <br /> A soft silhouette in rose haze
            </span>
          </div>
        </div>
      </section>

      {/* Whisper Section */}
      <section className="px-6 md:px-20 py-16 flex flex-col md:flex-row gap-6 md:gap-8 justify-center relative z-10">
        {[
          {
            title: "Soft Confessions",
            desc: "Choti choti baatein jo tumhari yaadon ko jagaayein.",
          },
          {
            title: "Midnight Stories",
            desc: "Dil se boli hui kahaniyan — thodi filmy, thodi bhootni si.",
          },
        ].map((card, i) => (
          <div
            key={i}
            className="flex-1 p-6 md:p-8 bg-white/5 rounded-2xl shadow-lg backdrop-blur-lg border border-white/10 hover:scale-105 hover:shadow-[0_0_30px_rgba(236,72,153,0.6)] transition-all duration-500 hover:bg-pink-500/10 text-center md:text-left"
          >
            <h3 className="font-bold text-lg md:text-xl mb-2 md:mb-3 text-pink-300">
              {card.title}
            </h3>
            <p className="text-gray-300 text-sm md:text-base">{card.desc}</p>
          </div>
        ))}
      </section>

      {/* Footer CTA */}
      <footer className="px-6 md:px-20 py-16 text-center relative z-10 border-t border-white/10">
        <h3 className="text-xl md:text-2xl font-semibold mb-3">
          Chalo ek kahani banate hain 🕯️
        </h3>
        <p className="text-gray-400 mb-8 md:mb-10 max-w-xl mx-auto text-sm md:text-base">
          Tum batao — main sunoon, aur raat ko ek nayi yaad jagaa doon...
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
          <button className="px-6 sm:px-7 py-3 bg-pink-500 text-black rounded-full font-medium hover:scale-110 hover:shadow-[0_0_25px_rgba(236,72,153,1)] transition-all duration-300">
            Start Chatting
          </button>
          <button className="px-6 sm:px-7 py-3 bg-transparent border border-gray-600 rounded-full hover:border-pink-400 hover:text-pink-300 hover:shadow-[0_0_20px_rgba(236,72,153,0.7)] transition-all duration-300">
            Learn More
          </button>
        </div>
      </footer>

      {/* Animations */}
      <style>{`
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        .animate-pulse-slow {
          animation: pulse 3s infinite;
        }
        .animate-fade-in {
          animation: fadeIn 1.5s ease-in forwards;
        }
        .animate-fade-in-delayed {
          animation: fadeIn 2.5s ease-in forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
