import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/chat");
      return;
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    console.log(form)
    try {
      const { data } = await axios.post("http://localhost:5000/api/auth/login", form, {
        withCredentials: true,
      });
      localStorage.setItem("token", data.token);
      navigate("/chat");
    } catch (err) {
      console.log(err.response)
      setError(err.response?.data?.message || "Login failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 bg-gradient-to-b from-[#0a0c12] via-[#111418] to-black relative overflow-hidden">
      {/* Glow Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(236,72,153,0.12),transparent_70%)]"></div>

      <div className="w-full max-w-sm sm:max-w-md p-6 sm:p-8 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl relative z-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-pink-400 drop-shadow-[0_0_10px_rgba(236,72,153,0.6)]">
          Welcome Back 👻
        </h1>

        {error && (
          <p className="text-red-400 text-center mb-4 font-medium">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="relative">
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-lg focus:border-pink-400 outline-none peer text-white"
              placeholder=" "
            />
            <label className="absolute left-4 top-3 text-gray-400 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-pink-400 bg-[#0a0c12] px-1">
              Email Address
            </label>
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-lg focus:border-pink-400 outline-none peer text-white"
              placeholder=" "
            />
            <label className="absolute left-4 top-3 text-gray-400 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-pink-400 bg-[#0a0c12] px-1">
              Password
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-pink-500 text-black font-semibold rounded-lg hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(236,72,153,0.7)] transition-all duration-300 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-gray-400 text-center mt-6 text-sm sm:text-base">
          Don’t have an account?{" "}
          <a href="/register" className="text-pink-400 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
