import React from 'react';
import { Sparkles, Shield, Droplets, Wind, Star } from 'lucide-react';

export default function CareGuide() {
  const guidelines = [
    {
      icon: <Wind size={24} />,
      title: "Wear Last, Remove First",
      text: "Always put on your jewelry last after applying cosmetics, hairsprays, and perfumes. Chemical residues can dull the 24K micron plating."
    },
    {
      icon: <Droplets size={24} />,
      title: "Keep Moisture Away",
      text: "Avoid contact with water, chlorine, or sweat. Do not wear your pieces in pools, saunas, or during high-intensity workouts."
    },
    {
      icon: <Shield size={24} />,
      title: "Airtight Velvet Vaults",
      text: "Store each ornament individually in velvet pouches or airtight zip-lock bags. Friction with other jewelry causes plating scratches."
    },
    {
      icon: <Star size={24} />,
      title: "Gentle Microfiber Buffing",
      text: "After each wear, gently wipe your piece with a dry, lint-free microfiber cloth. Never use industrial metal polish, silver cleaners, or alcohol."
    }
  ];

  return (
    <div className="section-container" style={{ padding: '80px 0', borderTop: '1px solid var(--border-gold)' }}>
      <div className="section-header" style={{ marginBottom: '50px' }}>
        <span className="section-subtitle">Preservation Rules</span>
        <h2 className="section-title">Caring For Your Masterpieces</h2>
        <div className="luxury-divider">
          <div className="divider-line"></div>
          <Sparkles className="divider-icon" />
          <div className="divider-line"></div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '30px',
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        {guidelines.map((guide, idx) => (
          <div key={idx} className="rate-card" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '40px 30px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-gold)',
            borderRadius: '2px',
            textAlign: 'center',
            transition: 'var(--transition-smooth)',
            backdropFilter: 'blur(8px)'
          }}>
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              background: 'rgba(212, 175, 55, 0.05)',
              border: '1px solid var(--border-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary-gold)',
              marginBottom: '22px'
            }}>
              {guide.icon}
            </div>
            <h3 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.1rem',
              color: 'var(--text-primary)',
              letterSpacing: '1px',
              marginBottom: '12px',
              fontWeight: 500
            }}>
              {guide.title}
            </h3>
            <p style={{
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
              lineHeight: '1.7',
              fontWeight: 300,
              margin: 0
            }}>
              {guide.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
