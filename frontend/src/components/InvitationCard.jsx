import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Clock, Heart } from 'lucide-react';

export default function InvitationCard() {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = +new Date('2026-08-15T10:30:00') - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return timeLeft;
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="wedding-card">
      <span className="invitation-sub">First Holy Communion</span>
      
      <div className="couple-names">
        Felix & Festin
      </div>

      <div className="floral-divider">
        <svg viewBox="0 0 100 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
          <path d="M10 10C30 5, 40 15, 50 10C60 5, 70 15, 90 10" stroke="#cda34f" strokeWidth="1" />
          <circle cx="50" cy="10" r="3" fill="#cda34f" />
        </svg>
      </div>

      <p className="invitation-request" style={{ fontStyle: 'italic', fontSize: '18px', color: '#cda34f', fontFamily: 'var(--font-serif)' }}>
        "I am the bread of life. Whoever comes to me will never go hungry." <br/> — John 6:35
      </p>

      <p className="invitation-request" style={{ marginTop: '15px' }}>
        Together with our families, we cordially invite you to join us in celebrating the First Holy Communion of our twin boys as they receive the Holy Eucharist for the first time.
      </p>

      {/* Twins Communion Image Frame */}
      <div className="twins-photo-container">
        <img src="/twins_uploaded.jpg" alt="Felix & Festin Communion" className="twins-photo" />
      </div>

      <div className="wedding-date-hero">
        <span>AUG</span>
        <span style={{ fontSize: '36px', fontWeight: 'bold', color: '#cda34f' }}>15</span>
        <span>2026</span>
      </div>

      <div className="countdown-container">
        <div className="countdown-item">
          <span className="countdown-val">{timeLeft.days || 0}</span>
          <span className="countdown-lbl">Days</span>
        </div>
        <div className="countdown-item">
          <span className="countdown-val">{String(timeLeft.hours || 0).padStart(2, '0')}</span>
          <span className="countdown-lbl">Hours</span>
        </div>
        <div className="countdown-item">
          <span className="countdown-val">{String(timeLeft.minutes || 0).padStart(2, '0')}</span>
          <span className="countdown-lbl">Mins</span>
        </div>
        <div className="countdown-item">
          <span className="countdown-val">{String(timeLeft.seconds || 0).padStart(2, '0')}</span>
          <span className="countdown-lbl">Secs</span>
        </div>
      </div>

      {/* Schedule Details */}
      <h3 className="gold-text" style={{ fontSize: '28px', marginTop: '60px', marginBottom: '20px' }}>The Ceremony & Celebration</h3>
      <div className="timeline-section">
        
        {/* Church Mass Details */}
        <div className="timeline-event">
          <div className="event-header">
            <span className="event-title">Holy Communion Mass</span>
            <span className="event-time">10:30 AM</span>
          </div>
          <div className="event-venue">Christ King Church</div>
          <div className="event-address">
            Annamanada, Kerala, India
          </div>
          <a 
            href="https://www.google.com/maps/search/?api=1&query=Christ+King+Church+Annamanada" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="map-btn"
          >
            <MapPin size={14} /> View on Google Maps
          </a>
        </div>

        {/* Reception Details */}
        <div className="timeline-event">
          <div className="event-header">
            <span className="event-title">Fellowship Lunch</span>
            <span className="event-time">12:00 PM onwards</span>
          </div>
          <div className="event-venue">Parish Hall</div>
          <div className="event-address">
            Christ King Church Premises, Annamanada
          </div>
          <a 
            href="https://www.google.com/maps/search/?api=1&query=Christ+King+Church+Annamanada" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="map-btn"
          >
            <MapPin size={14} /> Get Directions
          </a>
        </div>

      </div>
    </div>
  );
}
