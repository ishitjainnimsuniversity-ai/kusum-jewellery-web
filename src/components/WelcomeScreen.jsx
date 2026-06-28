import React, { useState, useEffect } from 'react';

export default function WelcomeScreen({ onEnter }) {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  const handleEnter = () => {
    setFading(true);
    setTimeout(() => {
      setVisible(false);
      onEnter();
    }, 1200); // match transition speed in CSS
  };

  if (!visible) return null;

  return (
    <div className={`welcome-container ${fading ? 'fade-out' : ''}`}>
      <div className="bg-particles"></div>
      <div className="bg-vignette"></div>
      <div className="gold-orb"></div>
      
      <div className="welcome-content">
        {/* Beautiful Animated SVG for Namaste Hands Greeting */}
        <svg className="namaste-icon" viewBox="0 0 100 100">
          <g className="namaste-hands">
            {/* Left Hand outline */}
            <path 
              d="M 50 15 
                 C 42 22, 38 42, 45 68 
                 C 46 72, 48 78, 48 82 
                 L 50 82 
                 Z" 
            />
            {/* Right Hand outline */}
            <path 
              d="M 50 15 
                 C 58 22, 62 42, 55 68 
                 C 54 72, 52 78, 52 82 
                 L 50 82 
                 Z" 
            />
            {/* Center lines / hand detail creases */}
            <path d="M 50 15 L 50 82" strokeWidth="0.8" opacity="0.6" />
            <path d="M 45 42 Q 48 45 50 45" strokeWidth="0.6" opacity="0.5" />
            <path d="M 55 42 Q 52 45 50 45" strokeWidth="0.6" opacity="0.5" />
            <path d="M 46 55 Q 48 58 50 58" strokeWidth="0.6" opacity="0.5" />
            <path d="M 54 55 Q 52 58 50 58" strokeWidth="0.6" opacity="0.5" />
            
            {/* Golden rays of light around hands */}
            <path d="M 50 8 L 50 4" strokeWidth="1" opacity="0.7" />
            <path d="M 38 12 L 35 9" strokeWidth="1" opacity="0.7" />
            <path d="M 62 12 L 65 9" strokeWidth="1" opacity="0.7" />
            <path d="M 28 22 L 24 20" strokeWidth="1" opacity="0.7" />
            <path d="M 72 22 L 76 20" strokeWidth="1" opacity="0.7" />
          </g>
        </svg>

        <h1 className="welcome-title">KUSUM</h1>
        <h2 className="welcome-subtitle">IMITATION JEWELLERY</h2>
        
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '0.9rem',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          marginBottom: '8px',
          opacity: 0,
          animation: 'fade-up 1.5s 1.7s forwards'
        }}>
          Owner: Prabhuram Choudhary
        </p>
        <p style={{
          color: 'var(--primary-gold)',
          fontSize: '0.8rem',
          letterSpacing: '1px',
          marginBottom: '40px',
          opacity: 0,
          animation: 'fade-up 1.5s 1.9s forwards'
        }}>
          📍 Malad, Mumbai
        </p>

        <button className="welcome-button" onClick={handleEnter}>
          ENTER BOUTIQUE
        </button>
      </div>
    </div>
  );
}
