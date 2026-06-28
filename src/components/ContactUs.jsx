import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, MessageSquare, ShieldCheck, Map } from 'lucide-react';

export default function ContactUs() {
  const [zoomLevel, setZoomLevel] = useState(16);
  const [copied, setCopied] = useState(false);

  const handleZoom = (direction) => {
    if (direction === 'in') {
      setZoomLevel(prev => Math.min(19, prev + 1));
    } else {
      setZoomLevel(prev => Math.max(13, prev - 1));
    }
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(
      "Kusum Imitation Jewellery, Shop No. 21, 22, Crystal Plaza, Anand Road, Opposite Railway Station, Malad, Mumbai, Maharashtra 400064"
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="section-container" id="contact" style={{ paddingBottom: '100px' }}>
      <div className="section-header">
        <span className="section-subtitle">Visit Our Boutique</span>
        <h2 className="section-title">Store Location & Contacts</h2>
      </div>

      <div className="contact-grid">
        {/* Contact Details Card */}
        <div className="contact-card">
          <h3 className="contact-shop-name">Kusum Imitation Jewellery</h3>
          
          <div className="contact-item">
            <MapPin className="contact-icon" />
            <div>
              <div className="contact-label" style={{ color: 'var(--primary-gold)', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.8rem' }}>Store Address</div>
              <div className="contact-text" style={{ color: '#ffffff', fontSize: '0.95rem', lineHeight: '1.6', fontWeight: 400 }}>
                <span style={{ color: 'var(--light-gold)', fontWeight: 600 }}>Ground Floor, Shop No. 21, 22, Crystal Plaza</span><br />
                Anand Road, Station Road, Opposite Railway Station,<br />
                Malad (West), Mumbai, Maharashtra 400064
              </div>
              <button 
                onClick={copyAddress}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--primary-gold)',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  textDecoration: 'underline',
                  marginTop: '8px',
                  fontFamily: 'var(--font-sans)',
                  padding: 0
                }}
              >
                {copied ? 'Address Copied! ✓' : 'Copy Full Address'}
              </button>
            </div>
          </div>

          <div className="contact-item">
            <Phone className="contact-icon" />
            <div>
              <div className="contact-label" style={{ color: 'var(--primary-gold)', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.8rem' }}>Inquiries & Direct Orders</div>
              <div className="contact-text" style={{ color: '#ffffff', fontSize: '0.95rem', lineHeight: '1.6' }}>
                <a href="tel:+919372822884" style={{ color: '#ffffff', textDecoration: 'none', fontWeight: 600 }}>+91 93728 22884</a><br />
                <a 
                  href="https://wa.me/919372822884" 
                  target="_blank" 
                  rel="noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#25D366',
                    textDecoration: 'none',
                    fontWeight: 600,
                    marginTop: '6px',
                    fontSize: '0.9rem',
                    textShadow: '0 0 10px rgba(37, 211, 102, 0.2)'
                  }}
                >
                  <MessageSquare size={14} fill="#25D366" style={{ color: '#fff' }} /> Message on WhatsApp
                </a>
              </div>
            </div>
          </div>

          <div className="contact-item">
            <Clock className="contact-icon" />
            <div>
              <div className="contact-label" style={{ color: 'var(--primary-gold)', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.8rem' }}>Boutique Hours</div>
              <div className="contact-text" style={{ color: '#e0e0e0', fontSize: '0.9rem' }}>
                Monday – Saturday: 11:00 AM – 9:00 PM<br />
                Sunday: Closed
              </div>
            </div>
          </div>

          <div className="contact-item">
            <ShieldCheck className="contact-icon" />
            <div>
              <div className="contact-label" style={{ color: 'var(--primary-gold)', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.8rem' }}>Boutique Owner</div>
              <div className="contact-text" style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 500 }}>
                Prabhuram Choudhary
              </div>
            </div>
          </div>
        </div>

        {/* Cinematic Map Simulation */}
        <div className="simulated-map-container">
          <div className="map-canvas-sim">
            {/* Grid background lines */}
            <div className="map-grid-lines"></div>
            
            {/* Roads */}
            <div className="map-road-h road-main">
              <span style={{
                position: 'absolute',
                top: '50%',
                left: '20px',
                transform: 'translateY(-50%)',
                fontSize: '0.65rem',
                color: 'rgba(255,255,255,0.2)',
                letterSpacing: '2px',
                textTransform: 'uppercase'
              }}>
                Anand Road / Station Road
              </span>
            </div>
            
            <div className="map-road-v road-sub"></div>
            <div className="map-road-h road-rail"></div>
            <span className="map-station-label">Western Railway Line</span>

            {/* Landmarks */}
            <div className="map-landmark landmark-mall" style={{ transform: `scale(${zoomLevel / 16})` }}>
              <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Crystal Plaza</div>
              <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>Shopping Mall</div>
            </div>

            <div className="map-landmark landmark-station" style={{ transform: `scale(${zoomLevel / 16})` }}>
              <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Malad Station 🚉</div>
              <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>Platform Entrance</div>
            </div>

            {/* Shop location pin */}
            <div 
              className="map-shop-pin"
              style={{
                transform: `translate(-50%, -100%) scale(${zoomLevel / 16})`
              }}
            >
              <div className="pin-tooltip">Kusum Jewellery (Shop 21-22)</div>
              <MapPin className="pin-icon" size={32} />
              <div className="pin-pulse"></div>
            </div>

            {/* Map UI overlays */}
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              background: 'rgba(0,0,0,0.85)',
              border: '1px solid var(--border-gold)',
              padding: '8px 12px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.5)'
            }}>
              <Map size={14} style={{ color: 'var(--primary-gold)' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.5px' }}>
                Malad (West), Mumbai
              </span>
            </div>

            {/* Zoom Controls */}
            <div className="map-controls">
              <button className="map-btn" onClick={() => handleZoom('in')}>+</button>
              <button className="map-btn" onClick={() => handleZoom('out')}>-</button>
              <span style={{
                color: 'var(--text-secondary)',
                fontSize: '0.6rem',
                alignSelf: 'center',
                padding: '0 4px'
              }}>
                {zoomLevel}x
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
