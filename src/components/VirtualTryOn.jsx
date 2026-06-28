import React, { useState } from 'react';
import { X, Sparkles, ZoomIn, RotateCw, Move } from 'lucide-react';

export default function VirtualTryOn({ product, onClose }) {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [activeModel, setActiveModel] = useState('model1');
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const models = {
    model1: {
      name: "Traditional Bridal Portrait",
      url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80",
      defaultY: 35 // Initial vertical offset for neck alignment
    },
    model2: {
      name: "Modern Evening Portrait",
      url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
      defaultY: 45
    },
    model3: {
      name: "Heritage Wrist Preview",
      url: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=600&q=80",
      defaultY: 10
    }
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetOverlay = () => {
    setScale(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 1100 }} onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '800px', overflow: 'hidden' }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        <div className="modal-body" style={{ gridTemplateColumns: '1fr 1.1fr', gap: '30px', padding: '40px' }}>
          {/* Left panel: try-on mirror canvas */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div 
              style={{
                width: '100%',
                height: '380px',
                background: '#0a0a0a',
                border: '1px solid var(--border-gold)',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '2px',
                cursor: isDragging ? 'grabbing' : 'grab',
                userSelect: 'none'
              }}
              onMouseMove={handleMouseMove}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {/* Model portrait background */}
              <img 
                src={models[activeModel].url} 
                alt="Model Portrait" 
                style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }}
              />

              {/* Draggable and scalable jewelry overlay item */}
              <div 
                style={{
                  position: 'absolute',
                  top: `calc(50% + ${models[activeModel].defaultY}px + ${position.y}px)`,
                  left: `calc(50% + ${position.x}px)`,
                  transform: `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`,
                  width: product.category === 'Earrings' ? '80px' : '150px',
                  pointerEvents: 'none',
                  filter: 'drop-shadow(0 6px 15px rgba(0,0,0,0.5))',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <img 
                  src={product.image} 
                  alt={product.name} 
                  style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                />
              </div>

              {/* Controls guide hint */}
              <div style={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                background: 'rgba(0,0,0,0.75)',
                border: '1px solid var(--border-gold)',
                padding: '4px 8px',
                fontSize: '0.65rem',
                color: 'var(--primary-gold)',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                borderRadius: '2px'
              }}>
                <Move size={10} /> Drag to position item
              </div>
            </div>

            {/* Model Selectors */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Select Canvas Profile:
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {Object.keys(models).map(key => (
                  <button 
                    key={key}
                    onClick={() => { setActiveModel(key); resetOverlay(); }}
                    className={`btn-filter ${activeModel === key ? 'active' : ''}`}
                    style={{ flexGrow: 1, padding: '8px', fontSize: '0.7rem' }}
                  >
                    {models[key].name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right panel: try-on tools configuration */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--primary-gold)', fontSize: '0.75rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>
              <Sparkles size={12} /> Augmented Mirror
            </span>
            <h3 className="modal-title" style={{ fontSize: '1.4rem', marginBottom: '8px' }}>Virtual Fitting Room</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '24px', fontWeight: 300 }}>
              Adjust rotation and size scales using the sliders below to see how this piece fits standard ears or wristlines.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Scale Control */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--light-gold)', marginBottom: '8px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><ZoomIn size={12} /> Scale Size</span>
                  <span>{Math.round(scale * 100)}%</span>
                </div>
                <input 
                  type="range" 
                  min="0.3" 
                  max="2.5" 
                  step="0.05"
                  value={scale} 
                  onChange={(e) => setScale(parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--primary-gold)' }}
                />
              </div>

              {/* Rotation Control */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--light-gold)', marginBottom: '8px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><RotateCw size={12} /> Rotation Angle</span>
                  <span>{rotation}°</span>
                </div>
                <input 
                  type="range" 
                  min="-180" 
                  max="180" 
                  step="2"
                  value={rotation} 
                  onChange={(e) => setRotation(parseInt(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--primary-gold)' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button 
                  className="btn-secondary" 
                  style={{ flexGrow: 1, padding: '12px', fontSize: '0.8rem', justifyContent: 'center' }}
                  onClick={resetOverlay}
                >
                  Reset Fitting
                </button>
              </div>

              <div style={{ borderTop: '1px dashed var(--border-gold)', paddingTop: '20px', marginTop: '10px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '10px', fontWeight: 300 }}>
                  Loved the look? Direct order the exact design matching your measurements:
                </div>
                <a 
                  className="btn-primary" 
                  style={{ width: '100%', textDecoration: 'none', justifyContent: 'center' }}
                  href={`https://wa.me/919372822884?text=Hello%20Kusum%20Imitation%20Jewellery!%20I%20tried%20on%20Design%20No:%20${product.code}%20-%20"${product.name}"%20in%20your%20Virtual%20Fitting%20Room%20and%20absolutely%20loved%20it!%20Is%20it%20available%20for%20shipping?`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <X size={0} /> Order This Design Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
