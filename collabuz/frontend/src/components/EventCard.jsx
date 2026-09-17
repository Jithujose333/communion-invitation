import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Building, Ticket, ArrowRight, Tag } from 'lucide-react';

export const EventCard = ({ event }) => {
  // Determine min pricing range
  const minPrice = event.ticketTypes && event.ticketTypes.length > 0
    ? Math.min(...event.ticketTypes.map(t => t.price))
    : 0;

  const totalSeats = event.ticketTypes
    ? event.ticketTypes.reduce((sum, t) => sum + t.totalQty, 0)
    : 0;

  const soldSeats = event.ticketTypes
    ? event.ticketTypes.reduce((sum, t) => sum + (t.soldQty || 0), 0)
    : 0;

  const remainingSeats = Math.max(0, totalSeats - soldSeats);

  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col group border border-slate-800">
      
      {/* Event Image Banner */}
      <div className="relative h-48 overflow-hidden bg-slate-900">
        <img 
          src={event.bannerUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200'} 
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
        
        {/* Category Pill */}
        <div className="absolute top-3 left-3 bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-md flex items-center space-x-1">
          <Tag className="w-3 h-3 text-indigo-400" />
          <span>{event.category}</span>
        </div>

        {/* Seat Availability Badge */}
        <div className="absolute top-3 right-3 bg-slate-900/80 border border-slate-700/50 text-slate-300 text-xs px-2 py-1 rounded-md backdrop-blur-md">
          {remainingSeats > 0 ? (
            <span className="text-emerald-400 font-medium">{remainingSeats} tickets left</span>
          ) : (
            <span className="text-red-400 font-medium">Sold Out</span>
          )}
        </div>

        {/* College Tag */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center space-x-1.5 text-xs text-slate-300 font-medium">
          <Building className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span className="truncate">{event.collegeName}</span>
        </div>
      </div>

      {/* Event Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-lg font-bold text-slate-100 group-hover:text-indigo-400 transition-colors line-clamp-1">
            {event.title}
          </h3>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {event.description}
          </p>
        </div>

        <div className="space-y-2 text-xs text-slate-400 border-t border-slate-800/80 pt-3">
          <div className="flex items-center space-x-2">
            <Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>{event.date} at {event.time}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Starts from</span>
            <span className="text-lg font-extrabold text-indigo-300">
              ₹{minPrice}
            </span>
          </div>

          <Link
            to={`/events/${event._id}`}
            className="gradient-btn text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center space-x-1 shadow-md shadow-indigo-500/20 group-hover:shadow-indigo-500/40"
          >
            <span>Book Tickets</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>

    </div>
  );
};
