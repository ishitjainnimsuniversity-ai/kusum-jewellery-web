import React, { useState, useEffect } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import LiveRates from './components/LiveRates';
import ProductCatalog from './components/ProductCatalog';
import ContactUs from './components/ContactUs';
import StylingConcierge from './components/StylingConcierge';
import CareGuide from './components/CareGuide';
import OwnerLogin from './components/OwnerLogin';
import OwnerDashboard, { loadNewArrivals } from './components/OwnerDashboard';
import { Sparkles, MessageCircle, MapPin, Award, Info, Diamond, Lock } from 'lucide-react';

export default function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [activeSection, setActiveSection] = useState('home');
  const [theme, setTheme] = useState('kusum'); // default: kusum
  
  // Lifted selection states for dialogs & fittings
  const [selectedProduct,    setSelectedProduct]    = useState(null);
  const [customizingProduct, setCustomizingProduct] = useState(null);
  const [tryOnProduct,       setTryOnProduct]       = useState(null);

  // Owner admin panel
  const [adminOpen,    setAdminOpen]    = useState(false);
  const [ownerAuthed,  setOwnerAuthed]  = useState(false);
  const [newArrivals,  setNewArrivals]  = useState(loadNewArrivals);
  
  // Live rates state passed down to calculate catalog prices reactively
  const [rates, setRates] = useState({
    gold24k: 7200,
    gold22k: 6600,
    silver: 90,
    baseAlloy: 5
  });

  // Apply theme class to document body dynamically
  useEffect(() => {
    document.body.className = `theme-${theme}`;
  }, [theme]);

  // Fetch real market gold and silver spot rates dynamically
  useEffect(() => {
    const fetchRealRates = async () => {
      try {
        const responseGold = await fetch('https://api.gold-api.com/price/XAU');
        const dataGold = await responseGold.json();
        const goldUsdOunce = dataGold.price;
        
        const responseSilver = await fetch('https://api.gold-api.com/price/XAG');
        const dataSilver = await responseSilver.json();
        const silverUsdOunce = dataSilver.price;
        
        if (goldUsdOunce && silverUsdOunce) {
          const usdToInr = 83.6; // Current USD/INR spot rate
          const goldPerGram24k = (goldUsdOunce / 31.1035) * usdToInr;
          const goldPerGram22k = goldPerGram24k * 0.916; // 22K ratio
          const silverPerGram = (silverUsdOunce / 31.1035) * usdToInr;
          
          setRates(prev => ({
            ...prev,
            gold24k: Math.round(goldPerGram24k),
            gold22k: Math.round(goldPerGram22k),
            silver: Math.round(silverPerGram * 10) / 10
          }));
        }
      } catch (error) {
        console.warn("Failed to fetch live spot prices. Using high-precision seeds.", error);
      }
    };
    
    fetchRealRates();
    const interval = setInterval(fetchRealRates, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleEnterBoutique = () => {
    setShowWelcome(false);
  };

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {showWelcome && <WelcomeScreen onEnter={handleEnterBoutique} />}
      
      <div className="app-container">
        {/* Subtle cinematic sparkles and vignette background effects */}
        <div className="bg-particles"></div>
        <div className="bg-vignette"></div>

        {/* Live Rates Ticker Bar */}
        <div className="ticker-bar">
          <div className="ticker-items">
            <div className="ticker-item">
              <span className="ticker-label">Gold 24K Index:</span>
              <span className="ticker-value">₹{rates.gold24k}/g</span>
            </div>
            <div className="ticker-item">
              <span className="ticker-label">Gold 22K Index:</span>
              <span className="ticker-value">₹{rates.gold22k}/g</span>
            </div>
            <div className="ticker-item">
              <span className="ticker-label">Silver Index:</span>
              <span className="ticker-value">₹{rates.silver}/g</span>
            </div>
          </div>
          <div style={{ color: 'var(--primary-gold)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '6px', height: '6px', backgroundColor: '#4caf50', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 8px #4caf50' }}></span>
            Real-Time Valuation Feed Active
          </div>
        </div>

        {/* Header */}
        <header className="main-header">
          <div className="logo-section">
            <Sparkles className="logo-icon" />
            <div>
              <div className="logo-text">KUSUM</div>
              <div className="logo-sub">Imitation Jewellery</div>
            </div>
          </div>

          <nav className="nav-links">
            <a 
              className={`nav-link ${activeSection === 'home' ? 'active' : ''}`}
              onClick={() => scrollToSection('home')}
            >
              Home
            </a>
            <a 
              className={`nav-link ${activeSection === 'rates' ? 'active' : ''}`}
              onClick={() => scrollToSection('rates')}
            >
              Valuations
            </a>
            <a 
              className={`nav-link ${activeSection === 'catalog' ? 'active' : ''}`}
              onClick={() => scrollToSection('catalog')}
            >
              Boutique Catalog
            </a>
            <a 
              className={`nav-link ${activeSection === 'contact' ? 'active' : ''}`}
              onClick={() => scrollToSection('contact')}
            >
              Contact Us
            </a>
          </nav>

          <div className="header-action" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {/* Dynamic theme switcher mapping Mejuri, Blue Nile, Catbird and Kusum styles */}
            <div className="theme-selector-wrapper">
              <button 
                className={`theme-selector-btn ${theme === 'kusum' ? 'active' : ''}`} 
                onClick={() => setTheme('kusum')}
                title="Kusum Royal Velvet"
                style={{ backgroundColor: '#900d0d' }}
              ></button>
              <button 
                className={`theme-selector-btn ${theme === 'mejuri' ? 'active' : ''}`} 
                onClick={() => setTheme('mejuri')}
                title="Mejuri Off-white Minimalist"
                style={{ backgroundColor: '#FAF9F6' }}
              ></button>
              <button 
                className={`theme-selector-btn ${theme === 'bluenile' ? 'active' : ''}`} 
                onClick={() => setTheme('bluenile')}
                title="Blue Nile Sapphire"
                style={{ backgroundColor: '#050d1a' }}
              ></button>
              <button 
                className={`theme-selector-btn ${theme === 'catbird' ? 'active' : ''}`} 
                onClick={() => setTheme('catbird')}
                title="Catbird Warm Celestial"
                style={{ backgroundColor: '#E7E4D8' }}
              ></button>
            </div>

            <a 
              className="btn-primary" 
              style={{ padding: '10px 22px', fontSize: '0.8rem', textDecoration: 'none' }}
              href="https://wa.me/919372822884"
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={14} /> Send WhatsApp Inquiry
            </a>
          </div>
        </header>

        {/* Hero Section */}
        <section className="hero-section" id="home">
          <div className="hero-text">
            <div className="hero-badge">
              <Award className="hero-badge-icon" />
              <span>Premium Heritage Designs since 2002</span>
            </div>
            
            <h1 className="hero-title">
              Crafting Royalty for the Modern Bride <span>Exquisite Masterpieces</span>
            </h1>
            
            <p className="hero-desc">
              Discover Mumbai's premium gold-plated bridal sets, antique jhumkas, and temple bangles. 
              Meticulously sculpted on fine sterling silver or high-grade alloy bases. Redefining royal elegance at accessible valuations.
            </p>
            
            <div className="hero-actions">
              <button className="btn-primary" onClick={() => scrollToSection('catalog')}>
                Explore Collection
              </button>
              <button className="btn-secondary" onClick={() => scrollToSection('contact')}>
                <MapPin size={16} /> Locate Store
              </button>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-ring-glow"></div>
            <div className="hero-ring-glow-2"></div>
            <div className="hero-circle-center">
              <span className="hero-center-jewelry">✨👑✨</span>
            </div>
          </div>
        </section>

        {/* Sabyasachi-style Callout Banner */}
        <div style={{
          textAlign: 'center',
          background: 'radial-gradient(circle, #0e0e0e 0%, #060606 100%)',
          padding: '60px 20px',
          borderTop: '1px solid var(--border-gold)',
          borderBottom: '1px solid var(--border-gold)'
        }}>
          <Diamond size={16} style={{ color: 'var(--primary-gold)', marginBottom: '20px' }} />
          <p style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.45rem',
            fontStyle: 'italic',
            letterSpacing: '2px',
            color: 'var(--light-gold)',
            maxWidth: '800px',
            margin: '0 auto',
            lineHeight: 1.6,
            fontWeight: 300
          }}>
            "Where ancient Indian temple carvings meet modern high-fashion aesthetics. Hand-plated in 24K gold layer, designed to capture the eternity of bridal dreams in Malad, Mumbai."
          </p>
          <div className="luxury-divider" style={{ margin: '20px auto 0' }}>
            <div className="divider-line" style={{ width: '80px' }}></div>
            <span style={{ fontSize: '0.7rem', letterSpacing: '4px', color: 'var(--text-secondary)' }}>KUSUM HERITAGE</span>
            <div className="divider-line" style={{ width: '80px' }}></div>
          </div>
        </div>

        {/* Live Rates Section */}
        <div style={{ backgroundColor: '#090909' }}>
          <div className="section-container" style={{ padding: '60px 40px' }}>
            <LiveRates rates={rates} onRateChange={setRates} />
          </div>
        </div>

        {/* Styling Concierge Section */}
        <StylingConcierge onSelectProduct={(product) => {
          setSelectedProduct(product);
          setTryOnProduct(product); // automatically launch try-on fitting too!
          scrollToSection('catalog');
        }} />

        {/* Product Catalog */}
        <ProductCatalog 
          rates={rates} 
          selectedProduct={selectedProduct}
          setSelectedProduct={setSelectedProduct}
          tryOnProduct={tryOnProduct}
          setTryOnProduct={setTryOnProduct}
          customizingProduct={customizingProduct}
          setCustomizingProduct={setCustomizingProduct}
          newArrivals={newArrivals}
        />

        {/* Care Guide */}
        <CareGuide />

        {/* Contact Us Map & Location */}
        <ContactUs />

        {/* Footer */}
        <footer className="main-footer">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="logo-section" style={{ marginBottom: '10px' }}>
                <Sparkles className="logo-icon" />
                <span className="logo-text">KUSUM</span>
              </div>
              <p className="footer-desc">
                Mumbai's leading boutique for premium gold-plated imitation, bridal ornaments, and temple jewelry. 
                Redefining the luxury e-commerce experience with transparent pricing calculations and real-time market integrations.
              </p>
            </div>

            <div>
              <h4 className="footer-title-small">Navigation</h4>
              <ul className="footer-links">
                <li className="footer-link"><a onClick={() => scrollToSection('home')}>Welcome Portal</a></li>
                <li className="footer-link"><a onClick={() => scrollToSection('rates')}>Market Indexes</a></li>
                <li className="footer-link"><a onClick={() => scrollToSection('catalog')}>Bridal Collection</a></li>
                <li className="footer-link"><a onClick={() => scrollToSection('contact')}>Contact Info</a></li>
              </ul>
            </div>

            <div>
              <h4 className="footer-title-small">Visit Our Boutique</h4>
              <p className="footer-desc" style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <MapPin size={16} style={{ color: 'var(--primary-gold)', flexShrink: 0, marginTop: '2px' }} />
                <span>
                  Shop No. 21, 22, Crystal Plaza,<br />
                  Anand Road, Opp. Malad Railway Station,<br />
                  Malad (West), Mumbai, Maharashtra 400064
                </span>
              </p>
            </div>
          </div>

          <div className="footer-bottom">
            <div>
              © 2026 Kusum Imitation Jewellery. All Rights Reserved. Director: Prabhuram Choudhary.
            </div>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <span style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                <Info size={12} /> Kusum Certified Heritage Boutique
              </span>
              {/* Owner Login button — visible but subtle */}
              <button
                onClick={() => setAdminOpen(true)}
                title="Owner Login"
                style={{
                  display: 'flex', alignItems: 'center', gap: '5px',
                  background: 'rgba(212,175,55,0.08)',
                  border: '1px solid rgba(212,175,55,0.35)',
                  borderRadius: '20px',
                  color: '#D4AF37',
                  fontSize: '0.7rem',
                  letterSpacing: '0.8px',
                  padding: '4px 12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontWeight: 600,
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,175,55,0.18)'; e.currentTarget.style.borderColor = '#D4AF37'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(212,175,55,0.08)'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.35)'; }}
              >
                <Lock size={11} /> Owner Login
              </button>
            </div>
          </div>
        </footer>
      </div>

      {/* ── Owner Login Page (full screen) ── */}
      {adminOpen && !ownerAuthed && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9998 }}>
          <OwnerLogin onSuccess={() => setOwnerAuthed(true)} />
          <button
            onClick={() => setAdminOpen(false)}
            style={{
              position: 'fixed', top: '18px', right: '24px', zIndex: 9999,
              background: 'rgba(255,255,255,0.06)', border: '1px solid #333',
              color: '#888', borderRadius: '6px', padding: '8px 14px',
              cursor: 'pointer', fontSize: '0.8rem',
            }}
          >
            ✕ Back to Website
          </button>
        </div>
      )}

      {/* ── Owner Dashboard (full screen, after login) ── */}
      {adminOpen && ownerAuthed && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9998, overflowY: 'auto' }}>
          <OwnerDashboard
            onLogout={() => { setOwnerAuthed(false); setAdminOpen(false); }}
            onProductsChanged={(updated) => setNewArrivals(updated)}
          />
        </div>
      )}
    </>
  );
}
