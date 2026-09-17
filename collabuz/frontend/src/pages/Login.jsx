import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Ticket, Lock, Mail, ArrowRight, Sparkles, UserCheck, GraduationCap, Shield } from 'lucide-react';

export const Login = () => {
  const { login, demoLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user.role === 'college') navigate('/college-dashboard');
      else if (user.role === 'admin') navigate('/admin-dashboard');
      else navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      
      <div className="glass-panel p-8 rounded-3xl space-y-6 border border-slate-800 shadow-2xl">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl gradient-btn flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/20">
            <Ticket className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Welcome Back to <span className="gradient-text">Collabuz</span>
          </h1>
          <p className="text-xs text-slate-400">
            Log in to manage tickets, events, or admin dashboard.
          </p>
        </div>

        {error && (
          <div className="bg-red-950/80 border border-red-500/40 text-red-300 text-xs p-3 rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="student@collabuz.com or host@stanford.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 gradient-btn text-white font-bold rounded-xl text-xs shadow-lg shadow-indigo-500/25 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <span>Logging in...</span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Fast Login Buttons */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <div className="text-[11px] text-slate-400 text-center font-medium flex items-center justify-center space-x-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Instant Demo Accounts (Click to test):</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-[11px]">
            <button
              onClick={() => {
                demoLogin('user');
                navigate('/');
              }}
              className="bg-slate-950 border border-slate-800 p-2 rounded-xl text-slate-300 hover:border-indigo-500 hover:text-white transition-all text-center"
            >
              <UserCheck className="w-3.5 h-3.5 text-indigo-400 mx-auto mb-0.5" />
              <span>Student</span>
            </button>
            <button
              onClick={() => {
                demoLogin('college');
                navigate('/college-dashboard');
              }}
              className="bg-slate-950 border border-slate-800 p-2 rounded-xl text-slate-300 hover:border-purple-500 hover:text-white transition-all text-center"
            >
              <GraduationCap className="w-3.5 h-3.5 text-purple-400 mx-auto mb-0.5" />
              <span>College</span>
            </button>
            <button
              onClick={() => {
                demoLogin('admin');
                navigate('/admin-dashboard');
              }}
              className="bg-slate-950 border border-slate-800 p-2 rounded-xl text-slate-300 hover:border-pink-500 hover:text-white transition-all text-center"
            >
              <Shield className="w-3.5 h-3.5 text-pink-400 mx-auto mb-0.5" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-400 font-semibold hover:underline">
            Register Here
          </Link>
        </div>

      </div>

    </div>
  );
};
