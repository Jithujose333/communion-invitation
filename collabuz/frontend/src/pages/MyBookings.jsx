import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchApi } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Ticket, Calendar, MapPin, Building, ArrowRight, ShieldCheck } from 'lucide-react';

export const MyBookings = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMyOrders();
  }, []);

  const loadMyOrders = async () => {
    try {
      const data = await fetchApi('/orders/my-orders');
      setOrders(data);
    } catch (err) {
      console.error('Failed to load my orders:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400 text-sm">Fetching your booked tickets...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center space-x-2">
            <Ticket className="w-6 h-6 text-indigo-400" />
            <span>My Digital Ticket Passes</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Access your active event entry passes and booking details.
          </p>
        </div>

        <button
          onClick={() => navigate('/')}
          className="text-xs font-semibold text-indigo-400 hover:underline"
        >
          + Book More Events
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center space-y-3">
          <Ticket className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-slate-200">No Tickets Booked Yet</h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            You haven't booked any college event tickets yet. Explore upcoming hackathons and cultural nights.
          </p>
          <button
            onClick={() => navigate('/')}
            className="gradient-btn text-white text-xs font-semibold px-6 py-2.5 rounded-xl shadow-md"
          >
            Browse College Events
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="glass-card p-6 rounded-3xl space-y-4 border border-slate-800 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="bg-indigo-950 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                    Ref: {order.ticketCode}
                  </span>
                  <span className="text-emerald-400 text-xs font-semibold flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Confirmed</span>
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white leading-snug">
                  {order.eventTitle}
                </h3>

                <div className="space-y-1.5 text-xs text-slate-400">
                  <div className="flex items-center space-x-2">
                    <Building className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span className="text-slate-200 font-medium">{order.collegeName}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>{order.eventDate || 'Scheduled Event'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>{order.eventLocation || 'Campus Venue'}</span>
                  </div>
                </div>

                {/* Ticket Details */}
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
                  {order.tickets?.map((t, idx) => (
                    <div key={idx} className="flex justify-between text-slate-300">
                      <span>{t.name} (x{t.qty})</span>
                      <span className="font-bold text-indigo-300">₹{t.price * t.qty}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <div className="text-xs">
                  <span className="text-slate-400 block">Total Amount</span>
                  <span className="text-sm font-extrabold text-white">₹{order.totalAmount}</span>
                </div>

                <button
                  onClick={() => navigate(`/ticket-confirmation/${order._id}`)}
                  className="gradient-btn text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center space-x-1"
                >
                  <span>View QR Ticket</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
