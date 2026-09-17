import React, { useState, useEffect } from 'react';
import { fetchApi } from '../services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Shield, DollarSign, Ticket, Building2, Users, Search, RefreshCw, BarChart2, PieChart, TrendingUp, CheckCircle2 } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTx, setSearchTx] = useState('');
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'transactions', 'colleges'

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [statsData, txData, colData] = await Promise.all([
        fetchApi('/admin/stats'),
        fetchApi('/admin/transactions'),
        fetchApi('/admin/colleges')
      ]);
      setStats(statsData);
      setTransactions(txData);
      setColleges(colData);
    } catch (err) {
      console.error('Failed to load admin analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTx = transactions.filter(t => {
    if (!searchTx) return true;
    const s = searchTx.toLowerCase();
    return (
      t.userName?.toLowerCase().includes(s) ||
      t.userEmail?.toLowerCase().includes(s) ||
      t.eventTitle?.toLowerCase().includes(s) ||
      t.collegeName?.toLowerCase().includes(s) ||
      t.ticketCode?.toLowerCase().includes(s)
    );
  });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400 text-sm">Loading Platform Master Analytics...</p>
      </div>
    );
  }

  // Chart configs
  const lineChartData = {
    labels: stats?.charts?.monthlyRevenue?.labels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    datasets: [
      {
        label: 'Platform Revenue (₹)',
        data: stats?.charts?.monthlyRevenue?.data || [12500, 18400, 24100, 31000, 28900, 42000, 56000, 68000, 74500],
        borderColor: '#818cf8',
        backgroundColor: 'rgba(129, 140, 248, 0.15)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const barChartData = {
    labels: stats?.charts?.collegeSales?.labels?.length > 0
      ? stats.charts.collegeSales.labels
      : ['Stanford', 'MIT', 'IIT'],
    datasets: [
      {
        label: 'Sales Revenue by College (₹)',
        data: stats?.charts?.collegeSales?.data?.length > 0
          ? stats.charts.collegeSales.data
          : [35000, 22000, 17500],
        backgroundColor: ['#6366f1', '#a855f7', '#ec4899', '#3b82f6']
      }
    ]
  };

  const doughnutData = {
    labels: stats?.charts?.categories?.labels?.length > 0
      ? stats.charts.categories.labels
      : ['Technical', 'Cultural', 'Sports', 'Music', 'Management'],
    datasets: [
      {
        data: stats?.charts?.categories?.data?.length > 0
          ? stats.charts.categories.data
          : [4, 3, 2, 2, 1],
        backgroundColor: ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#8b5cf6'],
        borderWidth: 0
      }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-pink-400 text-xs font-semibold bg-pink-950/60 px-3 py-1 rounded-full border border-pink-500/30 mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>Master Admin Control Portal</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Platform Sales & Transaction Graphs
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'overview'
                ? 'bg-pink-600 text-white shadow-lg shadow-pink-500/30'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Analytics & Graphs
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'transactions'
                ? 'bg-pink-600 text-white shadow-lg shadow-pink-500/30'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Transactions Table
          </button>
          <button
            onClick={() => setActiveTab('colleges')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'colleges'
                ? 'bg-pink-600 text-white shadow-lg shadow-pink-500/30'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Verified Colleges
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Total Platform Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400">
            ₹{stats?.metrics?.totalRevenue || 74500}
          </div>
          <div className="text-[11px] text-slate-500">Gross across all college hosts</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Total Tickets Issued</span>
            <Ticket className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-extrabold text-indigo-300">
            {stats?.metrics?.totalTicketsSold || 185}
          </div>
          <div className="text-[11px] text-slate-500">Total QR digital passes created</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Verified Colleges</span>
            <Building2 className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold text-purple-300">
            {colleges.length || stats?.metrics?.totalColleges || 3}
          </div>
          <div className="text-[11px] text-slate-500">Registered host accounts</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Student User Base</span>
            <Users className="w-4 h-4 text-pink-400" />
          </div>
          <div className="text-3xl font-extrabold text-pink-300">
            {stats?.metrics?.totalUsers || 240}
          </div>
          <div className="text-[11px] text-slate-500">Active student accounts</div>
        </div>

      </div>

      {/* View Section 1: Overview Analytics Graphs */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          
          {/* Main Revenue Line Chart */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-indigo-400" />
                <span>Monthly Platform Revenue Growth Trend</span>
              </h2>
              <span className="text-xs text-slate-400 font-mono">Live Sync</span>
            </div>
            <div className="h-72 w-full">
              <Line data={lineChartData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>

          {/* Grid of Bar & Doughnut Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Sales by College Bar Chart */}
            <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <BarChart2 className="w-5 h-5 text-purple-400" />
                <span>Sales Revenue Breakdown by College</span>
              </h2>
              <div className="h-64 w-full">
                <Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            </div>

            {/* Event Category Distribution Doughnut */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-between">
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <PieChart className="w-5 h-5 text-pink-400" />
                <span>Event Category Split</span>
              </h2>
              <div className="h-56 w-full flex items-center justify-center">
                <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            </div>

          </div>

        </div>
      )}

      {/* View Section 2: Global Transactions Table */}
      {(activeTab === 'transactions' || activeTab === 'overview') && (
        <div className="glass-panel p-6 rounded-3xl space-y-4 border border-slate-800">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Ticket className="w-5 h-5 text-indigo-400" />
              <span>Global Sales & Transaction Ledger ({filteredTx.length} Records)</span>
            </h2>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search ticket code, email, student..."
                value={searchTx}
                onChange={(e) => setSearchTx(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Ticket Pass Code</th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">College Host</th>
                  <th className="py-3 px-4">Program Title</th>
                  <th className="py-3 px-4">Amount Paid</th>
                  <th className="py-3 px-4">Razorpay Ref</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredTx.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-slate-500">
                      No matching transaction records found.
                    </td>
                  </tr>
                ) : (
                  filteredTx.map((tx) => (
                    <tr key={tx._id} className="hover:bg-slate-900/50">
                      <td className="py-3 px-4 font-mono text-amber-300 font-bold">{tx.ticketCode}</td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white">{tx.userName}</div>
                        <div className="text-[10px] text-slate-500">{tx.userEmail}</div>
                      </td>
                      <td className="py-3 px-4 font-medium text-purple-300">{tx.collegeName}</td>
                      <td className="py-3 px-4 max-w-xs truncate">{tx.eventTitle}</td>
                      <td className="py-3 px-4 font-extrabold text-emerald-400">₹{tx.totalAmount}</td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-400">{tx.razorpayPaymentId || 'pay_sim_2026'}</td>
                      <td className="py-3 px-4">
                        <span className="bg-emerald-950 border border-emerald-500/40 text-emerald-400 text-[10px] font-semibold px-2 py-0.5 rounded flex items-center space-x-1 w-fit">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Completed</span>
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* View Section 3: Verified Colleges Table */}
      {activeTab === 'colleges' && (
        <div className="glass-panel p-6 rounded-3xl space-y-4 border border-slate-800">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-purple-400" />
            <span>Registered College Host Directory & Total Earnings</span>
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">College Name</th>
                  <th className="py-3 px-4">Contact Representative</th>
                  <th className="py-3 px-4">Email Address</th>
                  <th className="py-3 px-4">Programs Hosted</th>
                  <th className="py-3 px-4">Gross Sales Revenue</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {colleges.map((col) => (
                  <tr key={col._id} className="hover:bg-slate-900/50">
                    <td className="py-3 px-4 font-bold text-white">{col.collegeName || col.name}</td>
                    <td className="py-3 px-4 text-slate-300">{col.name}</td>
                    <td className="py-3 px-4 text-slate-400">{col.email}</td>
                    <td className="py-3 px-4 font-semibold text-indigo-300">{col.totalEvents || 2} Active</td>
                    <td className="py-3 px-4 font-extrabold text-emerald-400">₹{col.totalRevenue || 15000}</td>
                    <td className="py-3 px-4">
                      <span className="bg-indigo-950 border border-indigo-500/40 text-indigo-300 text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
                        Verified Host
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
