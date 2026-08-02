import React, { useEffect, useState } from 'react';

export default function PigeonFlight({ active }) {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (active) {
      setShouldRender(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 5000); // Match CSS animation duration (5s)
      return () => clearTimeout(timer);
    }
  }, [active]);

  if (!shouldRender) return null;

  return (
    <div className="pigeon-overlay">
      {/* Left Flying Pigeon */}
      <div className="pigeon pigeon-left">
        <svg viewBox="0 0 100 100" className="pigeon-svg">
          {/* Left Wing */}
          <path
            className="pigeon-wing wing-left"
            d="M48 45 C25 25, 10 35, 2 55 C12 60, 30 55, 48 48 Z"
            fill="#ffffff"
            stroke="#b58d3d"
            strokeWidth="1.3"
          />
          {/* Right Wing */}
          <path
            className="pigeon-wing wing-right"
            d="M52 45 C75 25, 90 35, 98 55 C88 60, 70 55, 52 48 Z"
            fill="#ffffff"
            stroke="#b58d3d"
            strokeWidth="1.3"
          />
          {/* Tail */}
          <path
            d="M46 65 L40 90 L50 85 L60 90 L54 65 Z"
            fill="#f9f9f9"
            stroke="#b58d3d"
            strokeWidth="1.3"
          />
          {/* Body & Head */}
          <path
            d="M50 25 C53 25, 55 35, 55 50 C55 65, 53 72, 50 72 C47 72, 45 65, 45 50 C45 35, 47 25, 50 25 Z"
            fill="#ffffff"
            stroke="#b58d3d"
            strokeWidth="1.3"
          />
          {/* Olive Branch in Beak */}
          <path
            d="M48 24 C44 20, 38 18, 34 20 C38 22, 42 23, 44 24 C41 26, 36 28, 32 29 C37 28, 42 27, 44 25"
            fill="none"
            stroke="#2c6e4d"
            strokeWidth="0.8"
          />
          {/* Eye */}
          <circle cx="48" cy="30" r="1.2" fill="#1b4d34" />
        </svg>
      </div>

      {/* Right Flying Pigeon */}
      <div className="pigeon pigeon-right">
        <svg viewBox="0 0 100 100" className="pigeon-svg">
          {/* Left Wing */}
          <path
            className="pigeon-wing wing-left"
            d="M48 45 C25 25, 10 35, 2 55 C12 60, 30 55, 48 48 Z"
            fill="#ffffff"
            stroke="#b58d3d"
            strokeWidth="1.3"
          />
          {/* Right Wing */}
          <path
            className="pigeon-wing wing-right"
            d="M52 45 C75 25, 90 35, 98 55 C88 60, 70 55, 52 48 Z"
            fill="#ffffff"
            stroke="#b58d3d"
            strokeWidth="1.3"
          />
          {/* Tail */}
          <path
            d="M46 65 L40 90 L50 85 L60 90 L54 65 Z"
            fill="#f9f9f9"
            stroke="#b58d3d"
            strokeWidth="1.3"
          />
          {/* Body & Head */}
          <path
            d="M50 25 C53 25, 55 35, 55 50 C55 65, 53 72, 50 72 C47 72, 45 65, 45 50 C45 35, 47 25, 50 25 Z"
            fill="#ffffff"
            stroke="#b58d3d"
            strokeWidth="1.3"
          />
          {/* Olive Branch in Beak */}
          <path
            d="M52 24 C56 20, 62 18, 66 20 C62 22, 58 23, 56 24 C59 26, 64 28, 68 29 C63 28, 58 27, 56 25"
            fill="none"
            stroke="#2c6e4d"
            strokeWidth="0.8"
          />
          {/* Eye */}
          <circle cx="52" cy="30" r="1.2" fill="#1b4d34" />
        </svg>
      </div>
    </div>
  );
}
