import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Shield, GraduationCap, User, Sparkles } from 'lucide-react';

export const RoleSwitcherDemo = () => {
  const { user, demoLogin } = useContext(AuthContext);

  return (
    <div className="bg-slate-900/90 border-b border-indigo-500/20 px-4 py-2 text-xs backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2 text-slate-300 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>Demo Role Quick Switcher:</span>
          <span className="text-indigo-400 font-bold bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-500/30">
            Active: {user ? user.role.toUpperCase() : 'GUEST'} {user?.collegeName ? `(${user.collegeName})` : ''}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => demoLogin('user')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded transition-all ${
              user?.role === 'user'
                ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <User className="w-3 h-3" />
            <span>Student User</span>
          </button>

          <button
            onClick={() => demoLogin('college')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded transition-all ${
              user?.role === 'college'
                ? 'bg-purple-600 text-white font-semibold shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <GraduationCap className="w-3 h-3" />
            <span>College Host</span>
          </button>

          <button
            onClick={() => demoLogin('admin')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded transition-all ${
              user?.role === 'admin'
                ? 'bg-pink-600 text-white font-semibold shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Shield className="w-3 h-3" />
            <span>Master Admin</span>
          </button>
        </div>
      </div>
    </div>
  );
};
