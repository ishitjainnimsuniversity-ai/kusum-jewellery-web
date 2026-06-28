import React, { useState } from 'react';
import { Sparkles, ArrowRight, RotateCcw, Heart, Eye } from 'lucide-react';
import { resolveAsset } from './ProductCatalog';

export default function StylingConcierge({ onSelectProduct }) {
  const [step, setStep] = useState(1);
  const [selections, setSelections] = useState({
    occasion: '',
    neckline: '',
    color: ''
  });

  const productsCatalog = [
    {
      id: 'dno_2238',
      code: 'D.no-2238',
      name: 'Royal Heritage Kundan Bangle Set',
      image: '/assets/media__1782633382239.png',
      category: 'Bangles',
      description: 'Handcrafted with intricate glass-set Kundan stones and delicate red-green meenakari backing.'
    },
    {
      id: 'dno_2239',
      code: 'D.no-2239',
      name: 'Kundan Antique Choker Set',
      image: '/assets/media__1782633530159.png',
      category: 'Necklace Sets',
      description: 'Classical choker set adorned with premium white glass Kundan work and hanging emerald beads.'
    },
    {
      id: 'dno_2240',
      code: 'D.no-2240',
      name: 'Gold-Plated Sapphire Chandelier Earrings',
      image: '/assets/sapphire_earrings.png',
      category: 'Earrings',
      description: 'Intricately structured chandelier drops set with royal blue sapphires and fine micro-pearls.'
    },
    {
      id: 'dno_2241',
      code: 'D.no-2241',
      name: 'Emerald & Polki Diamond Royal Kada',
      image: '/assets/emerald_kada.png',
      category: 'Bangles',
      description: 'A heavy bridal gold-plated kada featuring hand-carved emerald stones and uncut polki accents.'
    },
    {
      id: 'dno_2242',
      code: 'D.no-2242',
      name: 'Ruby & Sapphire Bridal Choker Set',
      image: '/assets/ruby_choker.png',
      category: 'Necklace Sets',
      description: 'A stunning multi-gemstone bridal choker necklace combining rich rubies and blue sapphires.'
    },
    {
      id: 'dno_2243',
      code: 'D.no-2243',
      name: 'Classic Gold-Plated Pearl Rani Haar',
      image: '/assets/pearl_rani_haar.png',
      category: 'Necklace Sets',
      description: 'An elegant long rani haar necklace composed of five layers of premium round pearls.'
    }
  ].map(p => ({ ...p, image: resolveAsset(p.image) }));

  const handleSelect = (key, value) => {
    setSelections(prev => ({ ...prev, [key]: value }));
    setStep(prev => prev + 1);
  };

  const resetQuiz = () => {
    setSelections({ occasion: '', neckline: '', color: '' });
    setStep(1);
  };

  // Selection matching algorithm to provide a perfect product recommendation
  const getRecommendation = () => {
    const { occasion, neckline, color } = selections;
    if (color === 'red' || occasion === 'wedding') {
      return productsCatalog.find(p => p.id === 'dno_2242') || productsCatalog[1]; // Ruby Choker
    }
    if (color === 'green' || occasion === 'festive') {
      return productsCatalog.find(p => p.id === 'dno_2239') || productsCatalog[1]; // Kundan/Emerald Choker
    }
    if (neckline === 'offShoulder' || occasion === 'party') {
      return productsCatalog.find(p => p.id === 'dno_2240') || productsCatalog[2]; // Sapphire Chandelier
    }
    return productsCatalog.find(p => p.id === 'dno_2243') || productsCatalog[5]; // Pearl Rani Haar
  };

  const recommendedProduct = step === 4 ? getRecommendation() : null;

  return (
    <div className="section-container" style={{ padding: '80px 0', borderTop: '1px solid var(--border-gold)' }}>
      <div className="section-header" style={{ marginBottom: '50px' }}>
        <span className="section-subtitle">AI Style Advisor</span>
        <h2 className="section-title">The Heritage Styling Concierge</h2>
        <div className="luxury-divider">
          <div className="divider-line"></div>
          <Sparkles className="divider-icon" />
          <div className="divider-line"></div>
        </div>
      </div>

      <div style={{
        maxWidth: '750px',
        margin: '0 auto',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-gold)',
        padding: '50px 40px',
        borderRadius: '2px',
        minHeight: '380px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        boxShadow: 'var(--gold-glow-bright)',
        backdropFilter: 'blur(10px)'
      }}>
        {step === 1 && (
          <div>
            <span style={{ fontSize: '0.75rem', letterSpacing: '2px', color: 'var(--primary-gold)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
              Step 1 of 3
            </span>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--text-primary)', marginBottom: '30px', fontWeight: 500 }}>
              Select the occasion for your look:
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              <button className="btn-filter" style={{ padding: '20px', height: 'auto' }} onClick={() => handleSelect('occasion', 'wedding')}>
                💍 Wedding Bridalwear
              </button>
              <button className="btn-filter" style={{ padding: '20px', height: 'auto' }} onClick={() => handleSelect('occasion', 'festive')}>
                🌸 Festive Celebration
              </button>
              <button className="btn-filter" style={{ padding: '20px', height: 'auto' }} onClick={() => handleSelect('occasion', 'party')}>
                ✨ Evening Cocktail Party
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <span style={{ fontSize: '0.75rem', letterSpacing: '2px', color: 'var(--primary-gold)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
              Step 2 of 3
            </span>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--text-primary)', marginBottom: '30px', fontWeight: 500 }}>
              Select your dress neck type:
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              <button className="btn-filter" style={{ padding: '20px', height: 'auto' }} onClick={() => handleSelect('neckline', 'vneck')}>
                📐 Deep V-Neck / U-Shape
              </button>
              <button className="btn-filter" style={{ padding: '20px', height: 'auto' }} onClick={() => handleSelect('neckline', 'collar')}>
                👔 High Neck / Collar / Boat
              </button>
              <button className="btn-filter" style={{ padding: '20px', height: 'auto' }} onClick={() => handleSelect('neckline', 'offShoulder')}>
                👗 Off-Shoulder / Strapless
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <span style={{ fontSize: '0.75rem', letterSpacing: '2px', color: 'var(--primary-gold)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
              Step 3 of 3
            </span>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--text-primary)', marginBottom: '30px', fontWeight: 500 }}>
              Select your primary color tone:
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              <button className="btn-filter" style={{ padding: '20px', height: 'auto' }} onClick={() => handleSelect('color', 'red')}>
                🔴 Ruby Crimson Red
              </button>
              <button className="btn-filter" style={{ padding: '20px', height: 'auto' }} onClick={() => handleSelect('color', 'green')}>
                🟢 Emerald Forest Green
              </button>
              <button className="btn-filter" style={{ padding: '20px', height: 'auto' }} onClick={() => handleSelect('color', 'blue')}>
                🔵 Sapphire Royal Blue
              </button>
              <button className="btn-filter" style={{ padding: '20px', height: 'auto' }} onClick={() => handleSelect('color', 'pearl')}>
                ⚪ Classic White & Pearls
              </button>
            </div>
          </div>
        )}

        {step === 4 && recommendedProduct && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', letterSpacing: '3px', color: 'var(--primary-gold)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Sparkles size={14} /> Perfect Styling Match Found
            </span>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: '25px', fontWeight: 600 }}>
              {recommendedProduct.name}
            </h3>

            <div style={{
              width: '180px',
              height: '180px',
              borderRadius: '2px',
              overflow: 'hidden',
              border: '1px solid var(--border-gold)',
              marginBottom: '20px',
              boxShadow: 'var(--gold-glow)'
            }}>
              <img 
                src={recommendedProduct.image} 
                alt={recommendedProduct.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6', maxWidth: '500px', marginBottom: '30px', fontWeight: 300 }}>
              {recommendedProduct.description}
            </p>

            <div style={{ display: 'flex', gap: '15px', width: '100%', justifyContent: 'center' }}>
              <button 
                className="btn-secondary" 
                style={{ padding: '12px 24px', fontSize: '0.8rem' }}
                onClick={resetQuiz}
              >
                <RotateCcw size={14} /> Retake Quiz
              </button>
              <button 
                className="btn-primary" 
                style={{ padding: '12px 24px', fontSize: '0.8rem' }}
                onClick={() => onSelectProduct(recommendedProduct)}
              >
                <Eye size={14} /> View Details & Try On
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
