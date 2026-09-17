import React from 'react';
import { Ticket, ShieldCheck, Zap, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 py-12 px-4 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg gradient-btn flex items-center justify-center">
              <Ticket className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight gradient-text">
              COLLABUZ
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            The premier college event ticketing & hosting ecosystem. Connecting students with campus hackathons, cultural fests, sports tournaments, and tech symposiums.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-3">Quick Navigation</h4>
          <ul className="space-y-2 text-xs">
            <li><a href="/" className="hover:text-indigo-400 transition-colors">Browse College Events</a></li>
            <li><a href="/my-bookings" className="hover:text-indigo-400 transition-colors">My Digital Tickets</a></li>
            <li><a href="/college-dashboard" className="hover:text-indigo-400 transition-colors">College Host Portal</a></li>
            <li><a href="/admin-dashboard" className="hover:text-indigo-400 transition-colors">Admin Analytics Panel</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-3">Platform Features</h4>
          <ul className="space-y-2 text-xs">
            <li className="flex items-center space-x-1.5 text-slate-300">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Instant Razorpay Payment Checkout</span>
            </li>
            <li className="flex items-center space-x-1.5 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verified QR Code E-Tickets</span>
            </li>
            <li className="flex items-center space-x-1.5 text-slate-300">
              <Ticket className="w-3.5 h-3.5 text-indigo-400" />
              <span>Live Ticket Stock & Sales Counter</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-3">Verified College Partners</h4>
          <div className="flex flex-wrap gap-2 text-[11px]">
            <span className="bg-slate-900 border border-slate-800 px-2 py-1 rounded text-slate-300">Stanford University</span>
            <span className="bg-slate-900 border border-slate-800 px-2 py-1 rounded text-slate-300">MIT Campus</span>
            <span className="bg-slate-900 border border-slate-800 px-2 py-1 rounded text-slate-300">IIT Tech Cell</span>
            <span className="bg-slate-900 border border-slate-800 px-2 py-1 rounded text-slate-300">Harvard Council</span>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
        <p>© 2026 Collabuz Inc. All rights reserved.</p>
        <p className="flex items-center space-x-1 mt-2 md:mt-0">
          <span>Engineered with</span>
          <Heart className="w-3 h-3 text-pink-500 fill-pink-500" />
          <span>for Colleges & Students</span>
        </p>
      </div>
    </footer>
  );
};
