import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchApi } from '../services/api';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { Calendar, MapPin, Building, Ticket, Plus, Minus, ShoppingBag, ArrowLeft, ShieldCheck, Check } from 'lucide-react';

export const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);

  useEffect(() => {
    loadEvent();
  }, [id]);

  const loadEvent = async () => {
    try {
      const data = await fetchApi(`/events/${id}`);
      setEvent(data);
      if (data.ticketTypes && data.ticketTypes.length > 0) {
        setSelectedTicket(data.ticketTypes[0]);
      }
    } catch (err) {
      console.error('Failed to load event details:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400 text-sm">Loading event details...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Event Not Found</h2>
        <button
          onClick={() => navigate('/')}
          className="text-indigo-400 hover:underline text-sm"
        >
          Return to All Events
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedTicket) return;
    addToCart(event, selectedTicket, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  const handleBuyNow = () => {
    if (!selectedTicket) return;
    addToCart(event, selectedTicket, quantity);
    navigate('/cart');
  };

  const remainingQty = selectedTicket ? selectedTicket.totalQty - selectedTicket.soldQty : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center space-x-2 text-slate-400 hover:text-white text-sm font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Events</span>
      </button>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Image Banner & Details */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="relative h-80 sm:h-96 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
            <img
              src={event.bannerUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200'}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

            <div className="absolute bottom-6 left-6 right-6 space-y-2">
              <span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {event.category}
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                {event.title}
              </h1>
            </div>
          </div>

          {/* Key Quick Info Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
            <div className="glass-card p-4 rounded-2xl flex items-center space-x-3">
              <Building className="w-5 h-5 text-indigo-400 shrink-0" />
              <div>
                <span className="text-slate-400 block font-medium">Hosted By</span>
                <span className="text-slate-100 font-bold truncate block">{event.collegeName}</span>
              </div>
            </div>

            <div className="glass-card p-4 rounded-2xl flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-indigo-400 shrink-0" />
              <div>
                <span className="text-slate-400 block font-medium">Date & Time</span>
                <span className="text-slate-100 font-bold block">{event.date} ({event.time})</span>
              </div>
            </div>

            <div className="glass-card p-4 rounded-2xl flex items-center space-x-3 col-span-2 sm:col-span-1">
              <MapPin className="w-5 h-5 text-indigo-400 shrink-0" />
              <div>
                <span className="text-slate-400 block font-medium">Venue Location</span>
                <span className="text-slate-100 font-bold truncate block">{event.location}</span>
              </div>
            </div>
          </div>

          {/* Program Description */}
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">
              About this Program & Event
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
              {event.description}
            </p>

            <div className="pt-4 border-t border-slate-800 flex items-center space-x-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verified College Organizer • Instant Razorpay QR Pass E-Ticket</span>
            </div>
          </div>

        </div>

        {/* Right Column: Ticket Selection Box */}
        <div className="space-y-6">
          
          <div className="glass-panel p-6 rounded-3xl space-y-6 sticky top-24 border border-indigo-500/20 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <Ticket className="w-5 h-5 text-indigo-400" />
                <span>Select Ticket Tier</span>
              </h3>
            </div>

            {/* Ticket Tier Options */}
            <div className="space-y-3">
              {event.ticketTypes && event.ticketTypes.map((ticket) => {
                const isSelected = selectedTicket?.name === ticket.name;
                const available = ticket.totalQty - ticket.soldQty;

                return (
                  <div
                    key={ticket.name}
                    onClick={() => {
                      setSelectedTicket(ticket);
                      setQuantity(1);
                    }}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-indigo-950/60 border-indigo-500 shadow-lg shadow-indigo-500/20'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-bold text-white flex items-center space-x-2">
                          <span>{ticket.name}</span>
                          {isSelected && <Check className="w-4 h-4 text-indigo-400" />}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {available > 0 ? (
                            <span className="text-emerald-400">{available} seats left</span>
                          ) : (
                            <span className="text-red-400">Sold Out</span>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-lg font-extrabold text-indigo-300">₹{ticket.price}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quantity Selector */}
            {selectedTicket && (
              <div className="space-y-4 border-t border-slate-800 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300">Number of Tickets</span>
                  <div className="flex items-center space-x-3 bg-slate-900 border border-slate-700 rounded-xl p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center text-sm font-bold text-white">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(remainingQty, quantity + 1))}
                      className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Subtotal preview */}
                <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                  <span className="text-slate-400">Total Price:</span>
                  <span className="text-xl font-extrabold text-white">
                    ₹{selectedTicket.price * quantity}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <button
                    onClick={handleAddToCart}
                    disabled={remainingQty <= 0}
                    className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold rounded-xl transition-colors flex items-center justify-center space-x-2 text-xs"
                  >
                    <ShoppingBag className="w-4 h-4 text-indigo-400" />
                    <span>Add to Cart</span>
                  </button>

                  <button
                    onClick={handleBuyNow}
                    disabled={remainingQty <= 0}
                    className="w-full py-3.5 gradient-btn text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 flex items-center justify-center space-x-2 text-xs"
                  >
                    <Ticket className="w-4 h-4" />
                    <span>Proceed to Book (Razorpay)</span>
                  </button>
                </div>

                {addedNotice && (
                  <div className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs text-center py-2 rounded-xl animate-fade-in">
                    Added to cart successfully!
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
