import React, { useState, useMemo } from 'react';
import { Eye, MessageCircle, X, Search, ShieldAlert, Sparkles, Award } from 'lucide-react';
import BespokeCustomizer from './BespokeCustomizer';
import VirtualTryOn from './VirtualTryOn';

export const resolveAsset = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${import.meta.env.BASE_URL || '/'}${cleanPath}`;
};

// ── 50 UNIQUE jewelry images — no two are identical ──
// Sources: 13 local shop assets + 37 curated Unsplash jewelry photo IDs
const RAW_UNIQUE_50 = [
  // ── 13 Local shop assets (confirmed jewelry photos) ──
  '/assets/dno_195.jpg',
  '/assets/dno_1130.jpg',
  '/assets/dno_1140.jpg',
  '/assets/dno_1175.png',
  '/assets/dno_1210.jpg',
  '/assets/emerald_kada.png',
  '/assets/gen_emerald_jhumka.png',
  '/assets/gen_kundan_kada.png',
  '/assets/gen_ruby_choker.png',
  '/assets/gen_sapphire_bracelet.png',
  '/assets/pearl_rani_haar.png',
  '/assets/ruby_choker.png',
  '/assets/sapphire_earrings.png',
  // ── 37 Curated Unsplash jewelry photo IDs ──
  // Necklaces & Sets
  'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1599743477877-537eb83428a6?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1553361419-a644ae969a46?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1544441893-675173e53d0e?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1617210397168-c1c46af00d35?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1631213613-1097b9c48bd9?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1627221218701-6e879e0040d5?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1580522154071-c6ca47a859ad?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1583947952606-fa7fc4fe1d9c?auto=format&fit=crop&w=600&q=80',
  // Earrings & Jhumkas
  'https://images.unsplash.com/photo-1635767790038-36447fee5209?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1629224316810-9d8805b95e76?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1569397240109-c9a37b6b47c5?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1612726694261-8b0d7bcb8d4b?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1610970684895-8b065e3ec77c?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1619119069152-a2b331eb392a?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1636459503718-6dc7c96a3d78?auto=format&fit=crop&w=600&q=80',
  // Bangles & Kadas
  'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1590548784293-85f540b07a16?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1623605931891-d5b95ee98459?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=600&q=80',
  // Bracelets & Chains
  'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1551698618-1dfc6d84b890?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1624549636888-b6ca05cd7c0f?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1610971049700-25cb7fc14e83?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80',
  // Rings & Pendants
  'https://images.unsplash.com/photo-1678478596553-3e43d3640b06?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1624548638222-d6ae4cbc7e04?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1631211760049-bc83b04f7cd1?auto=format&fit=crop&w=600&q=80',
];
const UNIQUE_50 = RAW_UNIQUE_50.map(resolveAsset);
// Sanity-check: UNIQUE_50 must have exactly 50 entries
// (13 local + 37 Unsplash = 50)

// Local jewelry showcase clips (safe and reliable, stored in repo assets)
const VIDEOS = [
  resolveAsset('/assets/Graff.mp4'),   // Index 0: Luxury diamond showcase
  resolveAsset('/assets/ARTryOn.mp4'),  // Index 1: Virtual try-on demo
  resolveAsset('/assets/ARTryOn.mp4'),  // Index 2: Virtual try-on demo
  resolveAsset('/assets/Graff.mp4'),   // Index 3: Luxury diamond showcase
  resolveAsset('/assets/Graff.mp4'),   // Index 4: Luxury diamond showcase
  resolveAsset('/assets/ARTryOn.mp4'),  // Index 5: Virtual try-on demo
];



// ── Manual / Hero Products (real shop catalog items) ──
const MANUAL_PRODUCTS = [
  {
    id: 'dno_1130',
    code: 'D.no-1130',
    name: 'Royal Gold Watch-Style Bracelet',
    description: 'A masterpiece watch-bracelet featuring intricately hand-sculpted gold leaves, set with teardrop rubies and emeralds. Blends classical Indian jewelry craftsmanship with modern utility.',
    image: '/assets/dno_1130.jpg',
    video: VIDEOS[0],
    category: 'Bracelets',
    weightGrams: 28,
    baseMetal: 'Silver (92.5%)',
    goldPlatingGrams: 0.8,
    makingCharges: 3200,
    stoneCharges: 1800,
    baseMetalType: 'silver',
    purityCertification: '925 Hallmark Silver & 24K Gold Plated',
  },
  {
    id: 'dno_195',
    code: 'D.no-195',
    name: 'Traditional Golden Jhumka Earrings',
    description: 'Elegant temple-style jhumka earrings featuring floral motifs, studded with green emeralds, rubies, and finished with delicate rows of hanging white pearls.',
    image: '/assets/dno_195.jpg',
    video: VIDEOS[1],
    category: 'Earrings',
    weightGrams: 16,
    baseMetal: 'Imitation Alloy',
    goldPlatingGrams: 0.4,
    makingCharges: 1500,
    stoneCharges: 950,
    baseMetalType: 'baseAlloy',
    purityCertification: 'Micron Gold-Plated Luxury Finish',
  },
  {
    id: 'dno_1175',
    code: 'D.no-1175',
    name: 'Exquisite Kundan Elephant Necklace Set',
    description: 'A royal bridal necklace set featuring gold-carved elephant figures holding a teardrop emerald pendant, surrounded by rubies, pearls, and matching chandelier earrings.',
    image: '/assets/dno_1175.png',
    video: VIDEOS[2],
    category: 'Necklace Sets',
    weightGrams: 52,
    baseMetal: 'Silver (92.5%)',
    goldPlatingGrams: 1.5,
    makingCharges: 6500,
    stoneCharges: 4200,
    baseMetalType: 'silver',
    purityCertification: 'Handcrafted Kundan, 925 Silver Base',
  },
  {
    id: 'dno_1210',
    code: 'D.no-1210',
    name: 'Floral Relief Traditional Bangles',
    description: 'Set of 4 slender bangles carved with traditional relief patterns of floral deities, accented with red rubies and green emeralds in an alternating pattern.',
    image: '/assets/dno_1210.jpg',
    video: VIDEOS[3],
    category: 'Bangles',
    weightGrams: 34,
    baseMetal: 'Imitation Alloy',
    goldPlatingGrams: 0.8,
    makingCharges: 2800,
    stoneCharges: 1200,
    baseMetalType: 'baseAlloy',
    purityCertification: 'High-Resist Gold Plated Finish',
  },
  {
    id: 'dno_1140',
    code: 'D.no-1140',
    name: 'Textured Gold Oval Stone Bangles',
    description: 'Set of 4 thick, heavily textured gold bangles featuring oval-cut emeralds and rubies embedded in high-relief golden lattices.',
    image: '/assets/dno_1140.jpg',
    video: VIDEOS[4],
    category: 'Bangles',
    weightGrams: 42,
    baseMetal: 'Imitation Alloy',
    goldPlatingGrams: 1.1,
    makingCharges: 3500,
    stoneCharges: 1500,
    baseMetalType: 'baseAlloy',
    purityCertification: 'Heavy Duty 24K Plated Finish',
  },
  {
    id: 'dno_2240',
    code: 'D.no-2240',
    name: 'Royal Gold Sapphire Chandelier Earrings',
    description: 'Luxurious gold-plated chandelier earrings set with deep royal blue teardrop sapphires, brilliant-cut diamonds, and hanging freshwater pearls.',
    image: '/assets/sapphire_earrings.png',
    video: VIDEOS[4],
    category: 'Earrings',
    weightGrams: 18,
    baseMetal: 'Silver (92.5%)',
    goldPlatingGrams: 0.5,
    makingCharges: 2200,
    stoneCharges: 3500,
    baseMetalType: 'silver',
    purityCertification: '925 Hallmark Silver & Royal Blue Sapphires',
  },
  {
    id: 'dno_2241',
    code: 'D.no-2241',
    name: 'Emerald & Polki Diamond Royal Kada',
    description: 'An antique gold kada bangle featuring traditional leaf-pattern carvings, studded with rich green emeralds and uncut Polki diamonds.',
    image: '/assets/emerald_kada.png',
    video: VIDEOS[5],
    category: 'Bangles',
    weightGrams: 46,
    baseMetal: 'Imitation Alloy',
    goldPlatingGrams: 1.2,
    makingCharges: 3800,
    stoneCharges: 2800,
    baseMetalType: 'baseAlloy',
    purityCertification: 'High-Finish 24K Plated & Polki Stones',
  },
  {
    id: 'dno_2242',
    code: 'D.no-2242',
    name: 'Ruby & Sapphire Bridal Choker Set',
    description: 'A stunning multi-gemstone bridal choker necklace combining rich rubies, blue sapphires, and kundan stones on a gold-plated silver lattice.',
    image: '/assets/ruby_choker.png',
    video: VIDEOS[3],
    category: 'Necklace Sets',
    weightGrams: 58,
    baseMetal: 'Silver (92.5%)',
    goldPlatingGrams: 1.8,
    makingCharges: 7200,
    stoneCharges: 5900,
    baseMetalType: 'silver',
    purityCertification: '925 Silver Base, Certified Rubies & Sapphires',
  },
  {
    id: 'dno_2243',
    code: 'D.no-2243',
    name: 'Classic Gold-Plated Pearl Rani Haar',
    description: 'An elegant long rani haar necklace composed of five layers of premium round pearls connected to a royal gold-carved center pendant set with teardrop rubies.',
    image: '/assets/pearl_rani_haar.png',
    video: VIDEOS[5],
    category: 'Necklace Sets',
    weightGrams: 64,
    baseMetal: 'Imitation Alloy',
    goldPlatingGrams: 1.4,
    makingCharges: 5600,
    stoneCharges: 3200,
    baseMetalType: 'baseAlloy',
    purityCertification: 'Micron Gold Plated & Premium Pearls',
  },
  {
    id: 'dno_2244',
    code: 'D.no-2244',
    name: 'Vaikuntha Temple Kundan Haar Set',
    description: 'A heavy heritage temple necklace set featuring deity-carved medallions, encrusted with flat-set Kundan glass, rubies, emerald beads, and a double row of pearls.',
    image: '/assets/gen_ruby_choker.png',
    video: VIDEOS[2],
    category: 'Necklace Sets',
    weightGrams: 82,
    baseMetal: 'Silver (92.5%)',
    goldPlatingGrams: 2.5,
    makingCharges: 9800,
    stoneCharges: 7800,
    baseMetalType: 'silver',
    purityCertification: '925 Silver Base, 24K Heavy Gold Vermeil',
  },
  {
    id: 'dno_2245',
    code: 'D.no-2245',
    name: 'Devi Peacock Heritage Kada Pair',
    description: 'Set of two heavy gold-plated kadas featuring high-relief peacock engravings, studded with emerald cabochons and flat-cut diamonds.',
    image: '/assets/gen_kundan_kada.png',
    video: VIDEOS[5],
    category: 'Bangles',
    weightGrams: 54,
    baseMetal: 'Imitation Alloy',
    goldPlatingGrams: 1.5,
    makingCharges: 4200,
    stoneCharges: 3100,
    baseMetalType: 'baseAlloy',
    purityCertification: 'Micron Gold Plated & Premium CZ Stones',
  },
  {
    id: 'dno_2246',
    code: 'D.no-2246',
    name: 'Nizam Sapphire Jhumka Drops',
    description: 'Mughal-inspired long jhumka earrings featuring geometric sapphire inlays and rows of dangling seed pearls.',
    image: '/assets/gen_emerald_jhumka.png',
    video: VIDEOS[4],
    category: 'Earrings',
    weightGrams: 22,
    baseMetal: 'Silver (92.5%)',
    goldPlatingGrams: 0.8,
    makingCharges: 3100,
    stoneCharges: 4600,
    baseMetalType: 'silver',
    purityCertification: '925 Hallmark Silver & Royal Blue Sapphires',
  },
  {
    id: 'dno_2247',
    code: 'D.no-2247',
    name: 'Mughal Emerald Polki Bracelet',
    description: 'An elegant segmented bracelet composed of leaf-shaped emerald structures connected by floral polki-cut kundan frames.',
    image: '/assets/gen_sapphire_bracelet.png',
    video: VIDEOS[0],
    category: 'Bracelets',
    weightGrams: 31,
    baseMetal: 'Silver (92.5%)',
    goldPlatingGrams: 1.0,
    makingCharges: 3900,
    stoneCharges: 4100,
    baseMetalType: 'silver',
    purityCertification: '925 Silver Base & Flat Glass Polki',
  },
  {
    id: 'dno_2248',
    code: 'D.no-2248',
    name: 'Thanjavur Guttapusalu Choker',
    description: 'A traditional southern collar choker loaded with dense clusters of tiny clean rice pearls and ruby floral details.',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80',
    video: VIDEOS[3],
    category: 'Necklace Sets',
    weightGrams: 68,
    baseMetal: 'Imitation Alloy',
    goldPlatingGrams: 1.6,
    makingCharges: 6100,
    stoneCharges: 4800,
    baseMetalType: 'baseAlloy',
    purityCertification: 'Handcrafted Kundan, 24K Electroplated',
  },
  {
    id: 'dno_2249',
    code: 'D.no-2249',
    name: 'Vakratunda Kundan Statement Ear Studs',
    description: 'Oversized statement ear studs featuring complex floral kundan rings and a central deep red cabochon ruby surrounded by seed pearl drops.',
    image: 'https://images.unsplash.com/photo-1635767790038-36447fee5209?auto=format&fit=crop&w=600&q=80',
    video: VIDEOS[1],
    category: 'Earrings',
    weightGrams: 14,
    baseMetal: 'Imitation Alloy',
    goldPlatingGrams: 0.3,
    makingCharges: 1400,
    stoneCharges: 2100,
    baseMetalType: 'baseAlloy',
    purityCertification: 'Micron Gold Plated & Kundan Glass Stones',
  },
];

// Only the handcrafted manual catalog items
const ALL_PRODUCTS = MANUAL_PRODUCTS.map(prod => ({
  ...prod,
  image: resolveAsset(prod.image)
}));

const CATEGORIES = ['All', 'Necklace Sets', 'Earrings', 'Bangles', 'Bracelets'];

function getWhatsAppLink(product) {
  const phone = '919876543210'; // replace with actual number
  const text = encodeURIComponent(
    `Hi! I'm interested in *${product.name}* (${product.code}) from Kusum Imitation Jewellery. Please share pricing details.`
  );
  return `https://wa.me/${phone}?text=${text}`;
}

export default function ProductCatalog({
  rates,
  selectedProduct,
  setSelectedProduct,
  tryOnProduct,
  setTryOnProduct,
  customizingProduct,
  setCustomizingProduct,
  newArrivals = [],
}) {
  const [searchQuery, setSearchQuery]     = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [modalViewMode, setModalViewMode] = useState('photo');

  // Merge owner-added new arrivals at the top of the catalog
  const allProducts = useMemo(() => [...newArrivals, ...ALL_PRODUCTS], [newArrivals]);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return allProducts.filter((p) => {
      const matchCat  = activeCategory === 'All' || p.category === activeCategory;
      const matchText = !q || p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q);
      return matchCat && matchText;
    });
  }, [searchQuery, activeCategory, allProducts]);

  return (
    <div className="catalog-section" id="catalog">
      {/* Header */}
      <div className="section-header" style={{ textAlign: 'center', paddingBottom: '24px' }}>
        <span className="section-subtitle">Exquisite Artistry</span>
        <h2 className="section-title">The Bridal &amp; Festive Collection</h2>
        <div className="luxury-divider">
          <div className="divider-line" />
          <Sparkles className="divider-icon" />
          <div className="divider-line" />
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="catalog-filter-bar">
        <div className="filter-buttons-group">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`btn-filter ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="search-input-wrapper">
          <Search size={16} className="search-icon-inside" />
          <input
            type="text"
            placeholder="Search by code or name…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-bar-input"
          />
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)' }}>
          <ShieldAlert size={48} style={{ color: 'var(--primary-gold)', marginBottom: '16px' }} />
          <p>No products found matching your search.</p>
        </div>
      ) : (
        <div className="catalog-grid">
          {filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image-container">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="product-image" 
                    onError={(e) => {
                      e.target.src = resolveAsset('/assets/dno_195.jpg');
                      e.target.onerror = null;
                    }}
                  />
                  <span className="product-badge">{product.category}</span>
                  {/* New Arrival badge for owner-added products */}
                  {product.isNewArrival && (
                    <span style={{
                      position: 'absolute', top: '8px', left: '8px',
                      background: 'linear-gradient(135deg,#D4AF37,#b8942e)',
                      color: '#000', fontSize: '0.62rem', fontWeight: 800,
                      padding: '3px 8px', borderRadius: '2px',
                      letterSpacing: '1.5px', textTransform: 'uppercase',
                      zIndex: 10, boxShadow: '0 2px 8px rgba(212,175,55,0.5)',
                    }}>
                      ✦ New Arrival
                    </span>
                  )}
                <div className="product-cert-seal">
                  <Award size={12} style={{ color: 'var(--primary-gold)' }} />
                  <span>Certified Quality</span>
                </div>
              </div>

              <div className="product-info">
                <span className="product-code">{product.code}</span>
                <h3 className="product-name">{product.name}</h3>

                <div className="product-spec">
                  <span>Gross Weight:</span>
                  <span>{product.weightGrams}g</span>
                </div>
                <div className="product-spec">
                  <span>Base Metal:</span>
                  <span>{product.baseMetal}</span>
                </div>
                <div className="product-spec">
                  <span>Gold Plating:</span>
                  <span>{product.goldPlatingGrams}g (24K)</span>
                </div>

                <div style={{ margin: '12px 0 6px', fontSize: '0.85rem', color: 'var(--primary-gold)', fontWeight: 500, letterSpacing: '0.5px' }}>
                  Price Available on Request
                </div>

                <div className="product-actions" style={{ gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button
                    className="btn-card-secondary"
                    onClick={() => { setModalViewMode('photo'); setSelectedProduct(product); }}
                    style={{ fontSize: '0.75rem', padding: '8px 10px' }}
                  >
                    <Eye size={12} /> Details
                  </button>
                  <button
                    className="btn-card-secondary"
                    onClick={() => setTryOnProduct(product)}
                    style={{ fontSize: '0.75rem', padding: '8px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Sparkles size={12} style={{ color: 'var(--primary-gold)' }} /> Fitting
                  </button>
                  <button
                    className="btn-card-secondary"
                    onClick={() => setCustomizingProduct(product)}
                    style={{ fontSize: '0.75rem', padding: '8px 10px', gridColumn: 'span 2' }}
                  >
                    🛠️ Customize Bespoke
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Details Modal ── */}
      {selectedProduct && (() => {
        return (
          <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close-btn" onClick={() => setSelectedProduct(null)}>
                <X size={18} />
              </button>

              <div className="modal-body">
                {/* Image / Video panel */}
                <div
                  className="modal-image-panel"
                  style={{ position: 'relative', height: '380px', overflow: 'hidden', borderRadius: '2px', border: '1px solid var(--border-gold)' }}
                >
                  {modalViewMode === 'photo' ? (
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      onError={(e) => { e.target.src = resolveAsset('/assets/dno_195.jpg'); e.target.onerror = null; }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <video
                      src={selectedProduct.video}
                      autoPlay
                      loop
                      muted
                      playsInline
                      controls
                      style={{ width: '100%', height: '100%', objectFit: 'cover', background: '#000' }}
                    />
                  )}

                  {/* Photo / Video switcher */}
                  {selectedProduct.video && (
                    <div style={{ position: 'absolute', top: '15px', left: '15px', display: 'flex', gap: '8px', zIndex: 20 }}>
                      <button
                        onClick={() => setModalViewMode('photo')}
                        className={`btn-filter ${modalViewMode === 'photo' ? 'active' : ''}`}
                        style={{ padding: '6px 12px', fontSize: '0.65rem' }}
                      >
                        Photo
                      </button>
                      <button
                        onClick={() => setModalViewMode('video')}
                        className={`btn-filter ${modalViewMode === 'video' ? 'active' : ''}`}
                        style={{ padding: '6px 12px', fontSize: '0.65rem' }}
                      >
                        🎥 Video
                      </button>
                    </div>
                  )}

                  {/* Code badge */}
                  <div style={{
                    position: 'absolute', bottom: '15px', left: '15px',
                    background: 'rgba(0,0,0,0.7)', padding: '4px 8px', borderRadius: '4px',
                    fontSize: '0.75rem', border: '1px solid var(--border-gold)',
                    color: 'var(--primary-gold)', zIndex: 20,
                  }}>
                    {selectedProduct.code}
                  </div>
                </div>

                {/* Details panel */}
                <div className="modal-details">
                  <span style={{ color: 'var(--primary-gold)', fontSize: '0.8rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>
                    {selectedProduct.category}
                  </span>
                  <h3 className="modal-title">{selectedProduct.name}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '20px', fontWeight: 300 }}>
                    {selectedProduct.description}
                  </p>

                  {/* Purity badge */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    fontSize: '0.75rem', color: 'var(--light-gold)',
                    border: '1px solid rgba(212, 175, 55, 0.25)', padding: '8px 12px',
                    background: 'rgba(212, 175, 55, 0.03)', borderRadius: '2px', marginBottom: '20px',
                  }}>
                    <Award size={14} style={{ color: 'var(--primary-gold)' }} />
                    <span><strong>Purity Status:</strong> {selectedProduct.purityCertification}</span>
                  </div>

                  {/* Specs */}
                  <div style={{ marginBottom: '16px' }}>
                    <div className="product-spec"><span>Gross Weight:</span><span>{selectedProduct.weightGrams}g</span></div>
                    <div className="product-spec"><span>Base Metal:</span><span>{selectedProduct.baseMetal}</span></div>
                    <div className="product-spec"><span>Gold Plating:</span><span>{selectedProduct.goldPlatingGrams}g (24K)</span></div>
                  </div>

                  {/* Price note */}
                  <div className="modal-price-breakdown" style={{
                    background: 'rgba(212, 175, 55, 0.02)', border: '1px solid rgba(212, 175, 55, 0.25)',
                    padding: '20px', borderRadius: '2px', textAlign: 'center', marginBottom: '24px',
                  }}>
                    <div className="breakdown-title" style={{ color: 'var(--primary-gold)', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.85rem', marginBottom: '10px' }}>
                      Pricing &amp; Customization
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#ffffff', lineHeight: '1.6', fontWeight: 300 }}>
                      Pricing for our premium imitation pieces varies by design complexity and size. Tap below to get an instant customized quote on WhatsApp.
                    </p>
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: 'flex', gap: '12px', marginTop: 'auto', flexWrap: 'wrap' }}>
                    <button
                      className="btn-secondary"
                      style={{ flexGrow: 1, padding: '10px 16px', fontSize: '0.8rem', justifyContent: 'center' }}
                      onClick={() => setTryOnProduct(selectedProduct)}
                    >
                      <Sparkles size={14} style={{ color: 'var(--primary-gold)' }} /> Virtual Fitting
                    </button>
                    <button
                      className="btn-secondary"
                      style={{ flexGrow: 1, padding: '10px 16px', fontSize: '0.8rem', justifyContent: 'center' }}
                      onClick={() => setCustomizingProduct(selectedProduct)}
                    >
                      🛠️ Customize Design
                    </button>
                    <a
                      className="btn-primary"
                      style={{ flexGrow: 1, textDecoration: 'none', justifyContent: 'center', width: '100%' }}
                      href={getWhatsAppLink(selectedProduct)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <MessageCircle size={18} /> Send WhatsApp Inquiry
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Virtual Try-On overlay */}
      {tryOnProduct && (
        <VirtualTryOn
          product={tryOnProduct}
          onClose={() => setTryOnProduct(null)}
        />
      )}

      {/* Bespoke Customizer overlay */}
      {customizingProduct && (
        <BespokeCustomizer
          product={customizingProduct}
          onClose={() => setCustomizingProduct(null)}
        />
      )}
    </div>
  );
}
