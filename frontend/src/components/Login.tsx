// src/components/Login.tsx
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAuthStore } from '../store/authStore';

interface LoginProps {
  onSwitchToSignup: () => void;
  onClose: () => void;
  onAuthSuccess?: () => void; // Add this prop
}

export default function Login({ onSwitchToSignup, onClose, onAuthSuccess }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
      // Call onAuthSuccess after successful login
      if (onAuthSuccess) {
        onAuthSuccess();
      }
      onClose(); // Close the modal
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Welcome Back! 👋</h2>
        <p className="text-slate-600">Sign in to your account to continue</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm"
          >
            {error}
          </motion.div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="Enter your email"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="Enter your password"
            required
            disabled={isLoading}
          />
        </div>

        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: isLoading ? 1 : 1.02 }}
          whileTap={{ scale: isLoading ? 1 : 0.98 }}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Signing in...
            </div>
          ) : (
            'Sign In'
          )}
        </motion.button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-slate-600">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToSignup}
            className="text-blue-500 hover:text-blue-600 font-medium transition"
            disabled={isLoading}
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}