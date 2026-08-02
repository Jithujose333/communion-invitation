import React, { useState, useEffect } from 'react';
import { Users, UserCheck, UserX, Plus, FileText, Search, Trash2, ArrowLeft, ShieldAlert } from 'lucide-react';

export default function Dashboard({ onBack }) {
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [rsvps, setRsvps] = useState([]);
  const [stats, setStats] = useState({
    totalCount: 0,
    attendingCount: 0,
    declinedCount: 0,
    totalGuests: 0
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Check session storage for passcode
  useEffect(() => {
    const savedCode = sessionStorage.getItem('admin_passcode');
    if (savedCode) {
      verifyPasscode(savedCode);
    }
  }, []);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!passcode) return;
    verifyPasscode(passcode);
  };

  const verifyPasscode = async (codeToVerify) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/stats?passcode=${codeToVerify}`);
      if (response.ok) {
        const statsData = await response.json();
        setStats(statsData);
        
        // Fetch RSVPs
        const rsvpsRes = await fetch(`/api/rsvp?passcode=${codeToVerify}`);
        const rsvpsData = await rsvpsRes.json();
        
        setRsvps(rsvpsData);
        setIsAuthenticated(true);
        sessionStorage.setItem('admin_passcode', codeToVerify);
        setPasscode(codeToVerify); // Save in state for subsequent calls
      } else {
        setError('Incorrect passcode. Please try again.');
        sessionStorage.removeItem('admin_passcode');
      }
    } catch (err) {
      console.error('Auth check error:', err);
      setError('Network error. Is the server running?');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete the RSVP from "${name}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/rsvp/${id}?passcode=${passcode}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        // Refresh data
        verifyPasscode(passcode);
      } else {
        alert('Failed to delete RSVP.');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Network error while deleting RSVP.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_passcode');
    setPasscode('');
    setRsvps([]);
  };

  const exportToCSV = () => {
    if (rsvps.length === 0) return;

    const headers = ['Name', 'Email', 'Attending', 'Guests', 'Dietary Requirements', 'Message', 'Submitted At'];
    const rows = rsvps.map(r => [
      `"${r.name.replace(/"/g, '""')}"`,
      `"${r.email.replace(/"/g, '""')}"`,
      r.attending ? 'Yes' : 'No',
      r.attending ? r.guests : 0,
      `"${(r.dietaryRequirements || '').replace(/"/g, '""')}"`,
      `"${(r.message || '').replace(/"/g, '""')}"`,
      new Date(r.submittedAt).toLocaleDateString()
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `communion_rsvps_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredRsvps = rsvps.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.dietaryRequirements && r.dietaryRequirements.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (r.message && r.message.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (!isAuthenticated) {
    return (
      <div className="admin-container">
        <button className="admin-back-btn" onClick={onBack} style={{ margin: '20px auto 0 auto', display: 'flex' }}>
          <ArrowLeft size={14} /> Back to Invitation
        </button>

        <div className="login-card">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px', color: '#cda34f' }}>
            <ShieldAlert size={40} />
          </div>
          <h2 className="login-title">RSVP Manager Access</h2>
          
          <form onSubmit={handleLoginSubmit}>
            {error && (
              <div style={{ color: '#ff8a8a', fontSize: '13px', marginBottom: '20px', textAlign: 'center', fontWeight: '500' }}>
                {error}
              </div>
            )}
            <div className="form-group">
              <label className="form-label" htmlFor="passcode">Enter Admin Passcode</label>
              <input
                type="password"
                id="passcode"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="••••••••••••"
                required
                className="form-input"
                style={{ textAlign: 'center', letterSpacing: '4px' }}
              />
            </div>
            <button 
              type="submit" 
              disabled={isLoading}
              className="gold-btn" 
              style={{ width: '100%', marginTop: '10px' }}
            >
              {isLoading ? 'Authorizing...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      {/* Header */}
      <header className="admin-header">
        <div>
          <h1 className="admin-title">
            <Users size={28} /> RSVP Dashboard
          </h1>
          <p style={{ fontSize: '12px', color: '#a0aec0', marginTop: '4px' }}>
            Guest list administration for Felix & Festin's First Holy Communion
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="admin-back-btn" onClick={exportToCSV} disabled={rsvps.length === 0}>
            <FileText size={14} /> Export to CSV
          </button>
          <button className="admin-back-btn" onClick={handleLogout}>
            Logout
          </button>
          <button className="admin-back-btn" onClick={onBack}>
            <ArrowLeft size={14} /> View Invitation
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper">
            <Users size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Responses</span>
            <span className="stat-value">{stats.totalCount}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ color: '#4ade80', backgroundColor: 'rgba(74, 222, 128, 0.08)' }}>
            <UserCheck size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Attending</span>
            <span className="stat-value">{stats.attendingCount}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ color: '#f3e5ab', backgroundColor: 'rgba(243, 229, 171, 0.08)' }}>
            <Plus size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Guests</span>
            <span className="stat-value">{stats.totalGuests}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ color: '#f87171', backgroundColor: 'rgba(248, 113, 113, 0.08)' }}>
            <UserX size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Declined</span>
            <span className="stat-value">{stats.declinedCount}</span>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="table-container">
        <div className="table-header-controls">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '250px' }}>
            <Search size={16} style={{ color: '#a0aec0' }} />
            <input
              type="text"
              placeholder="Search guests, email, diet, message..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input search-input"
            />
          </div>
          <span style={{ fontSize: '13px', color: '#a0aec0' }}>
            Showing {filteredRsvps.length} of {rsvps.length} entries
          </span>
        </div>

        {filteredRsvps.length === 0 ? (
          <div className="empty-state">
            No RSVPs match your search criteria.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Guests</th>
                  <th>Dietary Needs</th>
                  <th>Personal Message</th>
                  <th>Submitted</th>
                  <th style={{ width: '60px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRsvps.map((rsvp) => (
                  <tr key={rsvp._id}>
                    <td style={{ fontWeight: '500', color: '#ffffff' }}>{rsvp.name}</td>
                    <td>{rsvp.email}</td>
                    <td>
                      <span className={`badge ${rsvp.attending ? 'badge-attending' : 'badge-declined'}`}>
                        {rsvp.attending ? 'Attending' : 'Declined'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: 'bold' }}>
                      {rsvp.attending ? rsvp.guests : '—'}
                    </td>
                    <td style={{ color: rsvp.dietaryRequirements ? '#f3e5ab' : '#718096' }}>
                      {rsvp.dietaryRequirements || 'None'}
                    </td>
                    <td style={{ fontStyle: 'italic', fontSize: '12px', maxWidth: '300px', whiteSpace: 'normal', wordBreak: 'break-word' }}>
                      {rsvp.message || '—'}
                    </td>
                    <td style={{ fontSize: '11px', color: '#a0aec0' }}>
                      {new Date(rsvp.submittedAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button 
                        className="delete-btn" 
                        onClick={() => handleDelete(rsvp._id, rsvp.name)}
                        title="Delete RSVP"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <p style={{ textAlign: 'center', color: '#4a5568', fontSize: '11px', marginTop: '30px' }}>
        Database Type: {stats.databaseType || 'Local JSON file'}
      </p>
    </div>
  );
}
