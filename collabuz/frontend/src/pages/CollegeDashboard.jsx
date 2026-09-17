import React, { useState, useEffect, useContext } from 'react';
import { fetchApi } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, PlusCircle, DollarSign, Ticket, Users, Calendar, Trash2, Edit3, X, CheckCircle2, ShieldCheck, Building } from 'lucide-react';

export const CollegeDashboard = () => {
  const { user } = useContext(AuthContext);
  
  const [salesData, setSalesData] = useState(null);
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State for creating a new program/event
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Technical');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');

  // Ticket Tiers Form State
  const [ticketRegularPrice, setTicketRegularPrice] = useState('199');
  const [ticketRegularQty, setTicketRegularQty] = useState('200');
  const [ticketVipPrice, setTicketVipPrice] = useState('499');
  const [ticketVipQty, setTicketVipQty] = useState('50');

  useEffect(() => {
    loadCollegeData();
  }, []);

  const loadCollegeData = async () => {
    setLoading(true);
    try {
      const [sales, events] = await Promise.all([
        fetchApi('/orders/college-sales'),
        fetchApi('/events/college/my-events')
      ]);
      setSalesData(sales);
      setMyEvents(events);
    } catch (err) {
      console.error('Failed to load college portal data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEventSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        title,
        description,
        category,
        location,
        date,
        time,
        bannerUrl: bannerUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200',
        ticketTypes: [
          { name: 'Regular', price: Number(ticketRegularPrice), totalQty: Number(ticketRegularQty), soldQty: 0 },
          { name: 'VIP Pass', price: Number(ticketVipPrice), totalQty: Number(ticketVipQty), soldQty: 0 }
        ]
      };

      await fetchApi('/events', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      setIsModalOpen(false);
      // Reset form
      setTitle('');
      setDescription('');
      setLocation('');
      setDate('');
      setTime('');
      loadCollegeData();
    } catch (err) {
      alert('Failed to publish program: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to remove this college program?')) return;
    try {
      await fetchApi(`/events/${eventId}`, { method: 'DELETE' });
      loadCollegeData();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400 text-sm">Loading College Host Portal...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-indigo-400 text-xs font-semibold bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-500/30 mb-2">
            <Building className="w-3.5 h-3.5" />
            <span>{user?.collegeName || 'College Host Portal'}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Event Hosting & Sales Control
          </h1>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="gradient-btn text-white text-xs font-bold px-5 py-3 rounded-xl shadow-lg shadow-indigo-500/25 flex items-center space-x-2 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Host New College Program</span>
        </button>
      </div>

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Total Ticket Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400">
            ₹{salesData?.totalRevenue || 0}
          </div>
          <div className="text-[11px] text-slate-500">Gross revenue collected via Razorpay</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Total Tickets Sold</span>
            <Ticket className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-extrabold text-indigo-300">
            {salesData?.totalTicketsSold || 0}
          </div>
          <div className="text-[11px] text-slate-500">Verified student ticket passes</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Remaining Tickets Capacity</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-amber-400">
            {salesData?.remainingTickets || 0}
          </div>
          <div className="text-[11px] text-slate-500">Available seats across programs</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Active Programs Hosted</span>
            <Calendar className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold text-purple-300">
            {myEvents.length}
          </div>
          <div className="text-[11px] text-slate-500">Published college events</div>
        </div>

      </div>

      {/* Hosted Events & Programs List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-indigo-400" />
          <span>My College Programs & Ticket Inventory</span>
        </h2>

        {myEvents.length === 0 ? (
          <div className="glass-panel p-8 rounded-3xl text-center text-slate-400 text-xs">
            No events hosted yet. Click "Host New College Program" above to create your first event!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myEvents.map((evt) => {
              const totalCap = evt.ticketTypes.reduce((sum, t) => sum + t.totalQty, 0);
              const totalSold = evt.ticketTypes.reduce((sum, t) => sum + (t.soldQty || 0), 0);
              const percentSold = totalCap > 0 ? Math.round((totalSold / totalCap) * 100) : 0;

              return (
                <div key={evt._id} className="glass-card p-5 rounded-3xl space-y-4 border border-slate-800 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="bg-indigo-950 border border-indigo-500/30 text-indigo-300 text-[10px] font-semibold px-2.5 py-0.5 rounded-full uppercase">
                        {evt.category}
                      </span>
                      <button
                        onClick={() => handleDeleteEvent(evt._id)}
                        className="text-slate-500 hover:text-red-400 transition-colors p-1"
                        title="Delete Program"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h3 className="text-lg font-bold text-white">{evt.title}</h3>

                    <div className="text-xs text-slate-400 space-y-1">
                      <div>📅 {evt.date} at {evt.time}</div>
                      <div>📍 {evt.location}</div>
                    </div>

                    {/* Ticket Tiers Summary */}
                    <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-2 text-xs">
                      <div className="text-slate-400 font-semibold text-[11px]">Ticket Tiers & Price:</div>
                      {evt.ticketTypes.map((t, idx) => (
                        <div key={idx} className="flex justify-between text-slate-300">
                          <span>{t.name} (₹{t.price})</span>
                          <span className="font-mono text-indigo-300">{t.soldQty || 0} / {t.totalQty} Sold</span>
                        </div>
                      ))}
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                        <span>Sales Progress</span>
                        <span>{percentSold}% Capacity Sold</span>
                      </div>
                      <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full"
                          style={{ width: `${percentSold}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Attendees Roster Table */}
      <div className="glass-panel p-6 rounded-3xl space-y-4 border border-slate-800">
        <h2 className="text-lg font-bold text-white flex items-center space-x-2">
          <Users className="w-5 h-5 text-indigo-400" />
          <span>Live Attendee Roster & Ticket Sales Log</span>
        </h2>

        {(!salesData?.orders || salesData.orders.length === 0) ? (
          <div className="text-xs text-slate-400 py-6 text-center">
            No sales recorded yet. Once students purchase tickets via Razorpay, attendee details will appear here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Ticket Code</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Program Title</th>
                  <th className="py-3 px-4">Tickets Booked</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {salesData.orders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-slate-900/50">
                    <td className="py-3 px-4 font-mono text-indigo-300 font-bold">{ord.ticketCode}</td>
                    <td className="py-3 px-4 font-semibold text-white">{ord.userName}</td>
                    <td className="py-3 px-4 text-slate-400">{ord.userEmail}</td>
                    <td className="py-3 px-4 max-w-xs truncate">{ord.eventTitle}</td>
                    <td className="py-3 px-4">
                      {ord.tickets?.map(t => `${t.name} (x${t.qty})`).join(', ')}
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-400">₹{ord.totalAmount}</td>
                    <td className="py-3 px-4">
                      <span className="bg-emerald-950 border border-emerald-500/40 text-emerald-400 text-[10px] font-semibold px-2 py-0.5 rounded">
                        Razorpay Verified
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Host New College Program */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                <PlusCircle className="w-5 h-5 text-indigo-400" />
                <span>Publish New College Event / Program</span>
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEventSubmit} className="space-y-4 text-xs">
              
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Event / Program Title</label>
                <input
                  type="text"
                  required
                  placeholder="Stanford AI & Robotics Hackathon 2026"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Technical">Technical</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Sports">Sports</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Symposium">Symposium</option>
                    <option value="Management">Management</option>
                    <option value="Music">Music</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Campus Venue Location</label>
                  <input
                    type="text"
                    required
                    placeholder="Memorial Auditorium, Hall B"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Event Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Start Time</label>
                  <input
                    type="text"
                    required
                    placeholder="09:30 AM"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Banner Image URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={bannerUrl}
                  onChange={(e) => setBannerUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Detailed Description & Rules</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Enter program details, hackathon themes, team capacity, and prizes..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Set Ticket Pricing & Quantities */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <span className="text-indigo-400 font-bold block text-xs">Set Ticket Pricing & Seat Allocation</span>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-400 block mb-1">Regular Ticket Price (₹)</label>
                    <input
                      type="number"
                      required
                      value={ticketRegularPrice}
                      onChange={(e) => setTicketRegularPrice(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Regular Capacity (Qty)</label>
                    <input
                      type="number"
                      required
                      value={ticketRegularQty}
                      onChange={(e) => setTicketRegularQty(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-800">
                  <div>
                    <label className="text-slate-400 block mb-1">VIP Ticket Price (₹)</label>
                    <input
                      type="number"
                      required
                      value={ticketVipPrice}
                      onChange={(e) => setTicketVipPrice(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">VIP Capacity (Qty)</label>
                    <input
                      type="number"
                      required
                      value={ticketVipQty}
                      onChange={(e) => setTicketVipQty(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 gradient-btn text-white font-bold rounded-xl text-xs shadow-lg shadow-indigo-500/25 flex items-center justify-center space-x-2"
              >
                {submitting ? <span>Publishing Program...</span> : <span>Publish College Program</span>}
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
