import React, { useState, useEffect, useRef } from 'react';
import Envelope from './components/Envelope';
import InvitationCard from './components/InvitationCard';
import Dashboard from './components/Dashboard';
import PigeonFlight from './components/PigeonFlight';
import BackgroundMusic from './components/BackgroundMusic';

export default function App() {
  const [viewState, setViewState] = useState('envelope'); // 'envelope', 'invitation', 'admin'
  const [triggerPigeons, setTriggerPigeons] = useState(false);
  const musicRef = useRef(null);

  // Sync hash routing for admin panel
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setViewState('admin');
      } else if (viewState === 'admin') {
        setViewState('invitation');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    // Initial check
    if (window.location.hash === '#admin') {
      setViewState('admin');
    }

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateToAdmin = () => {
    window.location.hash = '#admin';
    setViewState('admin');
  };

  const navigateToInvitation = () => {
    window.location.hash = '';
    setViewState('invitation');
  };

  const handleOpenInvitation = () => {
    setViewState('invitation');
    setTriggerPigeons(true);
    // Synchronously trigger YouTube audio playback on user click context
    if (musicRef.current) {
      musicRef.current.play();
    }
  };

  if (viewState === 'admin') {
    return <Dashboard onBack={navigateToInvitation} />;
  }

  return (
    <>
      {/* Background audio player (always mounted so YT API pre-loads) */}
      <BackgroundMusic ref={musicRef} showButton={viewState === 'invitation'} />

      {viewState === 'envelope' ? (
        <Envelope onOpen={handleOpenInvitation} />
      ) : (
        <div className="main-invitation-container">
          {/* Pigeon flight overlay animation */}
          <PigeonFlight active={triggerPigeons} />

          {/* Communion Invitation Card Section */}
          <InvitationCard />

          {/* Elegant Footer */}
          <footer className="invitation-footer">
            <div>Felix & Festin</div>
            <div style={{ fontSize: '14px', letterSpacing: '4px', textTransform: 'uppercase', color: '#cda34f', marginTop: '10px' }}>
              15 • 08 • 2026
            </div>
            <div className="footer-credits">
              Made with Love & Blessings
            </div>
            <div style={{ marginTop: '20px' }}>
              <button 
                onClick={navigateToAdmin}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#a2b4a9',
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Admin Panel
              </button>
            </div>
          </footer>
        </div>
      )}
    </>
  );
}
