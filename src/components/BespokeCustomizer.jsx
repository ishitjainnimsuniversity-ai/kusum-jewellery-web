import React, { useState } from 'react';
import { X, Sparkles, MessageCircle, Info } from 'lucide-react';

export default function BespokeCustomizer({ product, onClose }) {
  const [baseMetal, setBaseMetal] = useState('alloy');
  const [platingGrams, setPlatingGrams] = useState('1.5');
  const [accentStone, setAccentStone] = useState('kundan');
  const [customNotes, setCustomNotes] = useState('');

  const metalsList = [
    { id: 'alloy', label: 'Imitation Alloy (Standard)', desc: 'Lightweight brass-alloy base. Good durability.' },
    { id: 'silver', label: '92.5 Sterling Silver (Premium)', desc: 'Noble base metal. Lifetime heirloom quality.' }
  ];

  const platingsList = [
    { id: '1.2', label: '1.2 Grams (Standard Micron)', desc: 'Polished 24K gold plating for festive wear.' },
    { id: '2.2', label: '2.2 Grams (Heavy Gold Vermeil)', desc: 'Extra thick plating depth. Highly resistant to tarnishing.' },
    { id: '3.5', label: '3.5 Grams (Bridal Royal Vermeil)', desc: 'Double thickness. Supreme premium gold feel.' }
  ];

  const stonesList = [
    { id: 'kundan', label: 'Uncut Glass Kundan (Classic)' },
    { id: 'emerald', label: 'Forest Green Emeralds & Kundan' },
    { id: 'ruby', label: 'Crimson Red Rubies & Pearls' },
    { id: 'sapphire', label: 'Royal Blue Sapphires' },
    { id: 'pearls', label: 'Baroque Pearls & Kundan' }
  ];

  const getCustomWhatsAppLink = () => {
    const selectedMetal = metalsList.find(m => m.id === baseMetal)?.label;
    const selectedPlating = platingsList.find(p => p.id === platingGrams)?.label;
    const selectedStone = stonesList.find(s => s.id === accentStone)?.label;

    const message = `Hello Kusum Imitation Jewellery! I want to configure a bespoke/custom version of Design No: ${product.code} - "${product.name}".\n\nCustom Choices:\n- Base Metal: ${selectedMetal}\n- Gold Plating: ${selectedPlating}\n- Stones/Accents: ${selectedStone}${customNotes ? `\n- Additional Notes: ${customNotes}` : ''}\n\nPlease verify details and provide a custom quotation. Thank you!`;
    return `https://wa.me/919372822884?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 1100 }} onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '680px' }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        <div style={{ padding: '40px' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--primary-gold)', fontSize: '0.75rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px' }}>
            <Sparkles size={12} /> Custom Bespoke Studio
          </span>
          <h3 className="modal-title" style={{ marginBottom: '6px' }}>Customize {product.name}</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '24px', fontWeight: 300 }}>
            Configure your dream piece. We hand-craft each customized piece on order at our Malad, Mumbai workshop.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Base Metal Choice */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--light-gold)', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                1. Base Metal Core
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {metalsList.map(metal => (
                  <label key={metal.id} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '12px',
                    border: `1px solid ${baseMetal === metal.id ? 'var(--primary-gold)' : 'var(--border-gold)'}`,
                    background: baseMetal === metal.id ? 'rgba(212, 175, 55, 0.03)' : 'rgba(0,0,0,0.1)',
                    cursor: 'pointer',
                    borderRadius: '2px'
                  }}>
                    <input 
                      type="radio" 
                      name="baseMetal" 
                      value={metal.id} 
                      checked={baseMetal === metal.id}
                      onChange={() => setBaseMetal(metal.id)}
                      style={{ marginTop: '3px', accentColor: 'var(--primary-gold)' }}
                    />
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{metal.label}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 300, marginTop: '2px' }}>{metal.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Plating Depth Choice */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--light-gold)', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                2. 24K Gold Plating Depth
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {platingsList.map(plating => (
                  <label key={plating.id} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '12px',
                    border: `1px solid ${platingGrams === plating.id ? 'var(--primary-gold)' : 'var(--border-gold)'}`,
                    background: platingGrams === plating.id ? 'rgba(212, 175, 55, 0.03)' : 'rgba(0,0,0,0.1)',
                    cursor: 'pointer',
                    borderRadius: '2px'
                  }}>
                    <input 
                      type="radio" 
                      name="plating" 
                      value={plating.id} 
                      checked={platingGrams === plating.id}
                      onChange={() => setPlatingGrams(plating.id)}
                      style={{ marginTop: '3px', accentColor: 'var(--primary-gold)' }}
                    />
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{plating.label}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 300, marginTop: '2px' }}>{plating.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Stone Accents Choice */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--light-gold)', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                3. Gemstone & Pearl Accents
              </label>
              <select 
                value={accentStone} 
                onChange={(e) => setAccentStone(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid var(--border-gold)',
                  padding: '12px',
                  color: 'var(--text-primary)',
                  outline: 'none',
                  fontSize: '0.85rem',
                  fontFamily: 'var(--font-sans)',
                  borderRadius: '2px'
                }}
              >
                {stonesList.map(stone => (
                  <option key={stone.id} value={stone.id} style={{ background: '#111' }}>
                    {stone.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Custom Notes */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--light-gold)', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Additional Notes / Sizing Customization
              </label>
              <textarea 
                placeholder="E.g. Ring size 14, bangle diameter 2.6 inches, or make necklace hanging drops red instead of green..."
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                style={{
                  width: '100%',
                  height: '80px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid var(--border-gold)',
                  padding: '12px',
                  color: 'var(--text-primary)',
                  outline: 'none',
                  fontSize: '0.85rem',
                  fontFamily: 'var(--font-sans)',
                  borderRadius: '2px',
                  resize: 'none'
                }}
              />
            </div>

            {/* Warning Callout */}
            <div style={{ display: 'flex', gap: '10px', background: 'rgba(212, 175, 55, 0.02)', border: '1px solid rgba(212, 175, 55, 0.15)', padding: '12px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              <Info size={16} style={{ color: 'var(--primary-gold)', flexShrink: 0 }} />
              <span>Bespoke orders require 7 to 10 working days to hand-craft, electroplate, and inspect before delivery.</span>
            </div>

            {/* Submit Link Button */}
            <a 
              className="btn-primary" 
              style={{ textDecoration: 'none', justifyContent: 'center', marginTop: '10px' }}
              href={getCustomWhatsAppLink()}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={18} /> Submit Bespoke Config on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
