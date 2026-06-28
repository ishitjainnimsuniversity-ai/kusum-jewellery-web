import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Settings, AlertCircle, TrendingUp as UpIcon } from 'lucide-react';

export default function LiveRates({ rates, onRateChange }) {
  const [showAdmin, setShowAdmin] = useState(false);
  const [phone, setPhone] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [trends, setTrends] = useState({
    gold24k: 'up',
    gold22k: 'up',
    silver: 'down',
    baseAlloy: 'up'
  });

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (phone.trim()) {
      setSubscribed(true);
    }
  };

  const [history, setHistory] = useState({
    gold24k: [7120, 7150, 7135, 7180, 7195, 7200],
    gold22k: [6520, 6550, 6535, 6580, 6595, 6600],
    silver: [92.4, 91.8, 91.2, 90.6, 89.8, 89.5],
    baseAlloy: [4.85, 4.90, 4.95, 4.92, 5.05, 5.10]
  });

  // Periodically fluctuate rates slightly to simulate live feed
  useEffect(() => {
    const interval = setInterval(() => {
      const randomFactor = () => (Math.random() - 0.5) * 6; // +/- 3 INR
      const randomFactorSilver = () => (Math.random() - 0.5) * 0.5; // +/- 0.25 INR
      const randomFactorBase = () => (Math.random() - 0.5) * 0.08; // +/- 0.04 INR

      const delta24k = randomFactor();
      const delta22k = randomFactor() * 0.916; // 22k is 91.6% of 24k
      const deltaSilver = randomFactorSilver();
      const deltaBase = randomFactorBase();

      const nextRates = {
        gold24k: Math.max(6000, Math.round((rates.gold24k + delta24k) * 100) / 100),
        gold22k: Math.max(5500, Math.round((rates.gold22k + delta22k) * 100) / 100),
        silver: Math.max(60, Math.round((rates.silver + deltaSilver) * 100) / 100),
        baseAlloy: Math.max(1, Math.round((rates.baseAlloy + deltaBase) * 100) / 100)
      };

      onRateChange(nextRates);

      setTrends({
        gold24k: delta24k >= 0 ? 'up' : 'down',
        gold22k: delta22k >= 0 ? 'up' : 'down',
        silver: deltaSilver >= 0 ? 'up' : 'down',
        baseAlloy: deltaBase >= 0 ? 'up' : 'down'
      });

      setHistory(prev => ({
        gold24k: [...prev.gold24k.slice(1), nextRates.gold24k],
        gold22k: [...prev.gold22k.slice(1), nextRates.gold22k],
        silver: [...prev.silver.slice(1), nextRates.silver],
        baseAlloy: [...prev.baseAlloy.slice(1), nextRates.baseAlloy]
      }));
    }, 4500);

    return () => clearInterval(interval);
  }, [rates, onRateChange]);

  const handleSliderChange = (metal, val) => {
    const floatVal = parseFloat(val);
    onRateChange({
      ...rates,
      [metal]: floatVal
    });
  };

  // Computes smooth SVG sparkline path mapping historic rates array
  const getSparklinePath = (dataPoints) => {
    if (dataPoints.length === 0) return '';
    const min = Math.min(...dataPoints);
    const max = Math.max(...dataPoints);
    const range = max - min === 0 ? 1 : max - min;
    const padding = 10;
    const height = 60;
    const width = 220;

    const coords = dataPoints.map((val, idx) => {
      const x = (idx / (dataPoints.length - 1)) * width;
      const y = height - padding - ((val - min) / range) * (height - 2 * padding);
      return `${x},${y}`;
    });

    return `M ${coords.join(' L ')}`;
  };

  return (
    <div className="rates-dashboard" id="rates">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--light-gold)', letterSpacing: '1.5px', fontWeight: 500 }}>
            Live Market Valuations
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px', fontWeight: 300 }}>
            Dynamic pricing index calculations representing bullion market spot rates per gram (INR)
          </p>
        </div>
        <button 
          className="btn-card-secondary"
          style={{ width: 'auto', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}
          onClick={() => setShowAdmin(!showAdmin)}
        >
          <Settings size={14} />
          {showAdmin ? 'Hide Panel' : 'Market Config'}
        </button>
      </div>

      <div className="rates-grid">
        {/* Gold 24K */}
        <div className="rate-card">
          <div className="rate-title">Gold 24K (Fine 99.9%)</div>
          <div className="rate-price">₹{rates.gold24k.toLocaleString('en-IN')}</div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}>
            {trends.gold24k === 'up' ? (
              <span className="ticker-change up"><TrendingUp size={14} /> +0.04%</span>
            ) : (
              <span className="ticker-change down"><TrendingDown size={14} /> -0.02%</span>
            )}
          </div>
          <svg className="rate-chart-sparkline" viewBox="0 0 220 60">
            <path 
              d={getSparklinePath(history.gold24k)} 
              className={trends.gold24k === 'up' ? 'trend-up' : 'trend-down'}
            />
          </svg>
        </div>

        {/* Gold 22K */}
        <div className="rate-card">
          <div className="rate-title">Gold 22K (Standard)</div>
          <div className="rate-price">₹{rates.gold22k.toLocaleString('en-IN')}</div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}>
            {trends.gold22k === 'up' ? (
              <span className="ticker-change up"><TrendingUp size={14} /> +0.03%</span>
            ) : (
              <span className="ticker-change down"><TrendingDown size={14} /> -0.01%</span>
            )}
          </div>
          <svg className="rate-chart-sparkline" viewBox="0 0 220 60">
            <path 
              d={getSparklinePath(history.gold22k)} 
              className={trends.gold22k === 'up' ? 'trend-up' : 'trend-down'}
            />
          </svg>
        </div>

        {/* Silver */}
        <div className="rate-card">
          <div className="rate-title">Silver (Fine 99%)</div>
          <div className="rate-price">₹{rates.silver.toLocaleString('en-IN')}</div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}>
            {trends.silver === 'up' ? (
              <span className="ticker-change up"><TrendingUp size={14} /> +0.12%</span>
            ) : (
              <span className="ticker-change down"><TrendingDown size={14} /> -0.09%</span>
            )}
          </div>
          <svg className="rate-chart-sparkline" viewBox="0 0 220 60">
            <path 
              d={getSparklinePath(history.silver)} 
              className={trends.silver === 'up' ? 'trend-up' : 'trend-down'}
            />
          </svg>
        </div>

        {/* Base Alloy */}
        <div className="rate-card">
          <div className="rate-title">Base Alloy (Imitation)</div>
          <div className="rate-price">₹{rates.baseAlloy.toLocaleString('en-IN')}</div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}>
            {trends.baseAlloy === 'up' ? (
              <span className="ticker-change up"><TrendingUp size={14} /> +0.32%</span>
            ) : (
              <span className="ticker-change down"><TrendingDown size={14} /> -0.15%</span>
            )}
          </div>
          <svg className="rate-chart-sparkline" viewBox="0 0 220 60">
            <path 
              d={getSparklinePath(history.baseAlloy)} 
              className={trends.baseAlloy === 'up' ? 'trend-up' : 'trend-down'}
            />
          </svg>
        </div>
      </div>

      {showAdmin && (
        <div className="rate-controls-panel">
          <div className="panel-header-small">
            <Settings size={16} className="pin-icon" style={{ color: 'var(--primary-gold)', filter: 'none', animation: 'none' }} />
            <span>Bullion Desk Overrides (Live Index simulation controller)</span>
          </div>
          
          <div className="sliders-grid">
            <div className="slider-container">
              <div className="slider-label">
                <span>Gold 24K Limit</span>
                <span>₹{rates.gold24k}/g</span>
              </div>
              <input 
                type="range" 
                min="6800" 
                max="7800" 
                step="5" 
                value={rates.gold24k} 
                onChange={(e) => handleSliderChange('gold24k', e.target.value)}
                className="slider-input"
              />
            </div>
            
            <div className="slider-container">
              <div className="slider-label">
                <span>Gold 22K Limit</span>
                <span>₹{rates.gold22k}/g</span>
              </div>
              <input 
                type="range" 
                min="6200" 
                max="7200" 
                step="5" 
                value={rates.gold22k} 
                onChange={(e) => handleSliderChange('gold22k', e.target.value)}
                className="slider-input"
              />
            </div>

            <div className="slider-container">
              <div className="slider-label">
                <span>Silver Limit</span>
                <span>₹{rates.silver}/g</span>
              </div>
              <input 
                type="range" 
                min="80" 
                max="105" 
                step="0.2" 
                value={rates.silver} 
                onChange={(e) => handleSliderChange('silver', e.target.value)}
                className="slider-input"
              />
            </div>

            <div className="slider-container">
              <div className="slider-label">
                <span>Base Alloy Limit</span>
                <span>₹{rates.baseAlloy}/g</span>
              </div>
              <input 
                type="range" 
                min="2" 
                max="12" 
                step="0.05" 
                value={rates.baseAlloy} 
                onChange={(e) => handleSliderChange('baseAlloy', e.target.value)}
                className="slider-input"
              />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '20px', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
            <AlertCircle size={12} style={{ color: 'var(--primary-gold)' }} />
            <span>Overriding spot indices dynamically recalibrates formulas across all kundan and base metal item cards.</span>
          </div>
        </div>
      )}
      {/* Daily Rates Alert Subscription Form */}
      <div style={{
        marginTop: '30px',
        padding: '24px',
        background: 'rgba(255, 255, 255, 0.01)',
        border: '1px dashed var(--border-gold)',
        borderRadius: '2px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px',
        backdropFilter: 'blur(8px)'
      }}>
        <div style={{ flex: 1, minWidth: '280px' }}>
          <h4 style={{ fontFamily: 'var(--font-serif)', color: 'var(--primary-gold)', letterSpacing: '1px', fontSize: '1rem', marginBottom: '4px' }}>
            Subscribe to Daily Bullion Price Alerts
          </h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 300, margin: 0 }}>
            Get morning updates of current metal spot prices and exclusive festival collections directly on WhatsApp.
          </p>
        </div>

        {subscribed ? (
          <div style={{ color: '#4caf50', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4caf50', boxShadow: '0 0 8px #4caf50' }}></span>
            Subscription Active! Welcome to the Kusum Insider Circle.
          </div>
        ) : (
          <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '10px', flexGrow: 0.8, maxWidth: '400px', width: '100%' }}>
            <input 
              type="text" 
              placeholder="Your Phone (WhatsApp)" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              style={{
                flexGrow: 1,
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid var(--border-gold)',
                padding: '10px 16px',
                fontSize: '0.85rem',
                color: 'var(--text-primary)',
                outline: 'none',
                borderRadius: '1px'
              }}
            />
            <button 
              type="submit" 
              className="btn-primary"
              style={{ padding: '10px 24px', fontSize: '0.8rem', borderRadius: '1px' }}
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
