import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loading from '../components/Loading';
import { Link, useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';
import AlertPopup from '../components/AlertPopup';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: {
      firstName: '',
      lastName: '',
    },
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [popup, setPopup] = useState({ type: 'error', message: '' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/chat');
      return;
    }
    setLoading(false);
  }, [navigate]);

  if (loading) {
    return <Loading />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'firstName' || name === 'lastName') {
      setForm((prev) => ({
        ...prev,
        fullName: {
          ...prev.fullName,
          [name]: value,
        },
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPopup({ type: 'error', message: '' });
    setSubmitting(true);

    try {
      const { data } = await axios.post(API_ENDPOINTS.register, form);
      localStorage.setItem('token', data.token);
      setPopup({ type: 'success', message: 'Registration successful! Redirecting...' });
      setTimeout(() => navigate('/chat'), 700);
    } catch (error) {
      setPopup({
        type: 'error',
        message: error.response?.data?.error || 'Registration failed. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0c12] via-[#111418] to-black text-white relative overflow-hidden px-4">
      <AlertPopup
        type={popup.type}
        message={popup.message}
        onClose={() => setPopup((prev) => ({ ...prev, message: '' }))}
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(236,72,153,0.15),transparent_60%)] animate-pulse-slow pointer-events-none" />

      <div className="w-full max-w-md p-8 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-[0_0_30px_rgba(236,72,153,0.4)] animate-fade-in">
        <h2 className="text-3xl font-bold text-center mb-6">
          Create <span className="text-pink-400">Account</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={form.fullName.firstName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-xl focus:border-pink-400 focus:ring-2 focus:ring-pink-400/50 outline-none transition-all"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={form.fullName.lastName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-xl focus:border-pink-400 focus:ring-2 focus:ring-pink-400/50 outline-none transition-all"
            />
          </div>

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-xl focus:border-pink-400 focus:ring-2 focus:ring-pink-400/50 outline-none transition-all"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-xl focus:border-pink-400 focus:ring-2 focus:ring-pink-400/50 outline-none transition-all"
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-pink-500 text-black font-semibold hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(236,72,153,0.8)] transition-all duration-300 disabled:opacity-60"
          >
            {submitting ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-pink-400 hover:underline hover:text-pink-300">
            Login
          </Link>
        </p>
      </div>

      <style>{`
        .animate-pulse-slow {
          animation: pulse 3s infinite;
        }
        .animate-fade-in {
          animation: fadeIn 1.5s ease-in forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
