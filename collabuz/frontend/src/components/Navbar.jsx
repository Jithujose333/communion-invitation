import React, { useContext, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { Ticket, ShoppingBag, LayoutDashboard, Shield, LogOut, User, Menu, X, PlusCircle } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { totalItemCount } = useContext(CartContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-40 glass-panel border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <RouterLink to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl gradient-btn flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Ticket className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-2xl font-extrabold tracking-tight gradient-text">
                COLLABUZ
              </span>
              <span className="block text-[10px] text-slate-400 font-medium tracking-widest uppercase -mt-1">
                College Event Portal
              </span>
            </div>
          </RouterLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <RouterLink 
              to="/" 
              className="text-slate-300 hover:text-white font-medium transition-colors text-sm"
            >
              Explore Events
            </RouterLink>

            {user?.role === 'user' && (
              <RouterLink 
                to="/my-bookings" 
                className="text-slate-300 hover:text-white font-medium transition-colors text-sm flex items-center space-x-1"
              >
                <Ticket className="w-4 h-4 text-indigo-400" />
                <span>My Tickets</span>
              </RouterLink>
            )}

            {user?.role === 'college' && (
              <RouterLink 
                to="/college-dashboard" 
                className="text-slate-300 hover:text-indigo-400 font-medium transition-colors text-sm flex items-center space-x-1 bg-indigo-950/40 border border-indigo-500/30 px-3 py-1.5 rounded-lg"
              >
                <LayoutDashboard className="w-4 h-4 text-indigo-400" />
                <span>College Portal</span>
              </RouterLink>
            )}

            {user?.role === 'admin' && (
              <RouterLink 
                to="/admin-dashboard" 
                className="text-slate-300 hover:text-pink-400 font-medium transition-colors text-sm flex items-center space-x-1 bg-pink-950/40 border border-pink-500/30 px-3 py-1.5 rounded-lg"
              >
                <Shield className="w-4 h-4 text-pink-400" />
                <span>Admin Analytics</span>
              </RouterLink>
            )}

            {/* Cart Icon */}
            <RouterLink 
              to="/cart" 
              className="relative p-2 text-slate-300 hover:text-white transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-500 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce shadow-md shadow-indigo-500/50">
                  {totalItemCount}
                </span>
              )}
            </RouterLink>

            {/* User Profile / Auth State */}
            {user ? (
              <div className="flex items-center space-x-3 border-l border-slate-800 pl-4">
                <div className="text-right">
                  <div className="text-sm font-semibold text-slate-200">{user.name}</div>
                  <div className="text-[11px] text-indigo-400 font-medium capitalize">
                    {user.role} {user.collegeName ? `• ${user.collegeName}` : ''}
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  title="Logout"
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3 border-l border-slate-800 pl-4">
                <RouterLink 
                  to="/login"
                  className="text-sm font-medium text-slate-300 hover:text-white px-3 py-1.5"
                >
                  Login
                </RouterLink>
                <RouterLink 
                  to="/register"
                  className="text-sm font-semibold text-white gradient-btn px-4 py-1.5 rounded-lg shadow-md"
                >
                  Sign Up
                </RouterLink>
              </div>
            )}

          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center space-x-3 md:hidden">
            <RouterLink to="/cart" className="relative p-2 text-slate-300">
              <ShoppingBag className="w-5 h-5" />
              {totalItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItemCount}
                </span>
              )}
            </RouterLink>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-2 text-sm">
          <RouterLink
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-300 hover:text-white"
          >
            Explore Events
          </RouterLink>
          {user?.role === 'user' && (
            <RouterLink
              to="/my-bookings"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-300 hover:text-white"
            >
              My Tickets
            </RouterLink>
          )}
          {user?.role === 'college' && (
            <RouterLink
              to="/college-dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-indigo-400 font-semibold"
            >
              College Portal
            </RouterLink>
          )}
          {user?.role === 'admin' && (
            <RouterLink
              to="/admin-dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-pink-400 font-semibold"
            >
              Admin Analytics
            </RouterLink>
          )}
          {user ? (
            <button
              onClick={() => {
                logout();
                setMobileMenuOpen(false);
                navigate('/login');
              }}
              className="block w-full text-left py-2 text-red-400 font-medium"
            >
              Logout ({user.name})
            </button>
          ) : (
            <div className="pt-2 flex flex-col space-y-2">
              <RouterLink
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2 bg-slate-800 rounded-lg text-slate-200"
              >
                Login
              </RouterLink>
              <RouterLink
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2 gradient-btn rounded-lg text-white font-semibold"
              >
                Sign Up
              </RouterLink>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
