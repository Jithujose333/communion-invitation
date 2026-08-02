import React, { useState } from 'react';
import { MailOpen } from 'lucide-react';

export default function Envelope({ onOpen }) {
  const [isOpened, setIsOpened] = useState(false);

  const handleOpenEnvelope = (e) => {
    e.stopPropagation();
    setIsOpened(true);
  };

  return (
    <div className="envelope-wrapper">
      <div className={`envelope ${isOpened ? 'opened' : ''}`} onClick={handleOpenEnvelope}>
        {/* Flaps */}
        <div className="flap top-flap"></div>
        <div className="flap left-flap"></div>
        <div className="flap right-flap"></div>
        <div className="flap bottom-flap"></div>

        {/* Wax Seal */}
        <div className="wax-seal" onClick={handleOpenEnvelope}>
          <div className="wax-seal-text">F&F</div>
        </div>

        {/* Invitation Letter sliding out */}
        <div className="letter-card">
          <div className="letter-preview-title">First Holy Communion of</div>
          <div className="letter-preview-names">Felix & Festin</div>
          <div className="letter-preview-title" style={{ fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase', color: '#cda34f' }}>
            15th August 2026
          </div>
          
          {isOpened && (
            <button 
              className="gold-btn" 
              style={{ marginTop: '20px', padding: '8px 18px', fontSize: '11px', animation: 'fadeIn 1s ease-out' }}
              onClick={(e) => {
                e.stopPropagation();
                onOpen();
              }}
            >
              Open Invitation
            </button>
          )}

          {!isOpened && (
            <div className="letter-click-hint">
              Click to Open
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
