import React, { useState, useRef } from 'react';
import { X, Lock, Plus, Trash2, Upload, Link, Eye, EyeOff, ShieldCheck, LogOut, Image as ImageIcon } from 'lucide-react';

// ── Owner password (change this to your own secret) ──
const OWNER_PASSWORD = 'kusum2024';
const STORAGE_KEY    = 'kusum_new_arrivals';

export function loadNewArrivals() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveNewArrivals(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

const CATEGORIES = ['Necklace Sets', 'Earrings', 'Bangles', 'Bracelets'];

const EMPTY_FORM = {
  name:        '',
  code:        '',
  category:    'Necklace Sets',
  description: '',
  imageMode:   'upload', // 'upload' | 'url'
  imageUrl:    '',
  imageData:   '',       // base64 for uploaded file
  weightGrams: '',
  baseMetal:   'Imitation Alloy',
};

export default function AdminPanel({ onClose, onProductsChanged }) {
  // ── Auth state ──
  const [authed,       setAuthed]      = useState(false);
  const [pwInput,      setPwInput]     = useState('');
  const [pwVisible,    setPwVisible]   = useState(false);
  const [pwError,      setPwError]     = useState('');

  // ── Arrivals state ──
  const [arrivals, setArrivals] = useState(loadNewArrivals);
  const [form,     setForm]     = useState(EMPTY_FORM);
  const [preview,  setPreview]  = useState('');
  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState(false);

  const fileRef = useRef(null);

  // ── Login ──
  const handleLogin = (e) => {
    e.preventDefault();
    if (pwInput === OWNER_PASSWORD) {
      setAuthed(true);
      setPwError('');
    } else {
      setPwError('Incorrect password. Please try again.');
    }
  };

  // ── File upload → base64 ──
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setForm(f => ({ ...f, imageData: ev.target.result, imageUrl: '' }));
      setPreview(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUrlChange = (e) => {
    setForm(f => ({ ...f, imageUrl: e.target.value, imageData: '' }));
    setPreview(e.target.value);
  };

  // ── Add product ──
  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.code.trim()) return;
    const image = form.imageMode === 'upload' ? form.imageData : form.imageUrl;
    if (!image) return alert('Please add an image (upload or paste URL).');

    setSaving(true);
    const newItem = {
      id:          `admin_${Date.now()}`,
      code:        form.code.trim(),
      name:        form.name.trim(),
      description: form.description.trim() || `Premium handcrafted ${form.category.toLowerCase()} piece.`,
      image,
      category:    form.category,
      weightGrams: parseFloat(form.weightGrams) || 20,
      baseMetal:   form.baseMetal,
      goldPlatingGrams: 0.5,
      makingCharges:    2000,
      stoneCharges:     1500,
      baseMetalType:    form.baseMetal === 'Silver (92.5%)' ? 'silver' : 'baseAlloy',
      purityCertification: `${form.baseMetal} Base`,
      isNewArrival: true,
      addedAt:      new Date().toISOString(),
    };

    const updated = [newItem, ...arrivals];
    setArrivals(updated);
    saveNewArrivals(updated);
    onProductsChanged(updated);
    setForm(EMPTY_FORM);
    setPreview('');
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  // ── Delete product ──
  const handleDelete = (id) => {
    const updated = arrivals.filter(a => a.id !== id);
    setArrivals(updated);
    saveNewArrivals(updated);
    onProductsChanged(updated);
  };

  // ─────────────────────────────────────────────
  // LOGIN SCREEN
  // ─────────────────────────────────────────────
  if (!authed) return (
    <div style={overlay}>
      <div style={loginBox}>
        <button style={closeBtn} onClick={onClose}><X size={18} /></button>

        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={lockIcon}><Lock size={28} color="#D4AF37" /></div>
          <h2 style={loginTitle}>Owner Access</h2>
          <p style={loginSub}>This panel is for Kusum Jewellery management only</p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <input
              type={pwVisible ? 'text' : 'password'}
              placeholder="Enter owner password"
              value={pwInput}
              onChange={e => { setPwInput(e.target.value); setPwError(''); }}
              style={inputStyle}
              autoFocus
            />
            <button
              type="button"
              onClick={() => setPwVisible(v => !v)}
              style={pwToggle}
            >
              {pwVisible ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {pwError && <p style={{ color: '#ff6b6b', fontSize: '0.8rem', marginBottom: '12px', textAlign: 'center' }}>{pwError}</p>}

          <button type="submit" style={loginBtn}>
            <ShieldCheck size={16} /> Enter Admin Panel
          </button>
        </form>
      </div>
    </div>
  );

  // ─────────────────────────────────────────────
  // ADMIN DASHBOARD
  // ─────────────────────────────────────────────
  return (
    <div style={overlay}>
      <div style={dashBox}>
        {/* Header */}
        <div style={dashHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck size={20} color="#D4AF37" />
            <span style={{ color: '#D4AF37', fontWeight: 700, letterSpacing: '1px', fontSize: '1rem' }}>
              OWNER DASHBOARD
            </span>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button style={logoutBtn} onClick={() => setAuthed(false)}>
              <LogOut size={14} /> Logout
            </button>
            <button style={closeBtn2} onClick={onClose}><X size={18} /></button>
          </div>
        </div>

        <div style={dashBody}>
          {/* ── ADD NEW ARRIVAL FORM ── */}
          <div style={card}>
            <h3 style={cardTitle}><Plus size={16} color="#D4AF37" /> Add New Arrival</h3>

            <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Row 1: Name + Code */}
              <div style={row2}>
                <div style={fieldWrap}>
                  <label style={label}>Product Name *</label>
                  <input required style={inputStyle} placeholder="e.g. Royal Kundan Choker"
                    value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div style={fieldWrap}>
                  <label style={label}>Product Code *</label>
                  <input required style={inputStyle} placeholder="e.g. D.no-3500"
                    value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} />
                </div>
              </div>

              {/* Row 2: Category + Base Metal */}
              <div style={row2}>
                <div style={fieldWrap}>
                  <label style={label}>Category</label>
                  <select style={selectStyle} value={form.category}
                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div style={fieldWrap}>
                  <label style={label}>Base Metal</label>
                  <select style={selectStyle} value={form.baseMetal}
                    onChange={e => setForm(f => ({ ...f, baseMetal: e.target.value }))}>
                    <option>Imitation Alloy</option>
                    <option>Silver (92.5%)</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label style={label}>Description</label>
                <textarea style={{ ...inputStyle, height: '72px', resize: 'vertical' }}
                  placeholder="Brief description of this jewelry piece..."
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>

              {/* Weight */}
              <div>
                <label style={label}>Gross Weight (grams)</label>
                <input style={{ ...inputStyle, width: '140px' }} type="number" min="1" max="500"
                  placeholder="e.g. 25"
                  value={form.weightGrams}
                  onChange={e => setForm(f => ({ ...f, weightGrams: e.target.value }))} />
              </div>

              {/* Image section */}
              <div>
                <label style={label}>Product Image *</label>
                {/* Toggle upload / URL */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                  <button type="button"
                    style={{ ...toggleBtn, ...(form.imageMode === 'upload' ? toggleBtnActive : {}) }}
                    onClick={() => setForm(f => ({ ...f, imageMode: 'upload' }))}>
                    <Upload size={13} /> Upload from device
                  </button>
                  <button type="button"
                    style={{ ...toggleBtn, ...(form.imageMode === 'url' ? toggleBtnActive : {}) }}
                    onClick={() => setForm(f => ({ ...f, imageMode: 'url' }))}>
                    <Link size={13} /> Paste image URL
                  </button>
                </div>

                {form.imageMode === 'upload' ? (
                  <div
                    style={uploadZone}
                    onClick={() => fileRef.current?.click()}
                    onDragOver={e => e.preventDefault()}
                    onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) { const ev = { target: { files: [f] } }; handleFile(ev); } }}
                  >
                    <ImageIcon size={28} color="#D4AF37" style={{ marginBottom: '8px' }} />
                    <p style={{ color: '#aaa', fontSize: '0.85rem', margin: 0 }}>Click or drag &amp; drop a photo here</p>
                    <p style={{ color: '#666', fontSize: '0.75rem', margin: '4px 0 0' }}>JPG, PNG, WEBP supported</p>
                    <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
                  </div>
                ) : (
                  <input style={inputStyle} type="url" placeholder="https://example.com/jewellery.jpg"
                    value={form.imageUrl} onChange={handleUrlChange} />
                )}

                {/* Preview */}
                {preview && (
                  <div style={{ marginTop: '12px' }}>
                    <p style={{ ...label, marginBottom: '6px' }}>Preview:</p>
                    <img src={preview} alt="preview"
                      style={{ width: '140px', height: '140px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #D4AF37' }}
                      onError={() => setPreview('')} />
                  </div>
                )}
              </div>

              {/* Submit */}
              <button type="submit" style={addBtn} disabled={saving}>
                {saving ? 'Adding…' : saved ? '✓ Added to Catalog!' : <><Plus size={16} /> Add to New Arrivals</>}
              </button>
            </form>
          </div>

          {/* ── EXISTING NEW ARRIVALS ── */}
          <div style={card}>
            <h3 style={cardTitle}>
              <ImageIcon size={16} color="#D4AF37" />
              New Arrivals in Catalog ({arrivals.length})
            </h3>

            {arrivals.length === 0 ? (
              <p style={{ color: '#666', fontSize: '0.85rem', textAlign: 'center', padding: '20px 0' }}>
                No new arrivals added yet. Use the form above to add your first product.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {arrivals.map(item => (
                  <div key={item.id} style={arrivalRow}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #333', flexShrink: 0 }}
                      onError={e => { e.target.src = '/assets/dno_195.jpg'; e.target.onerror = null; }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.name}
                      </div>
                      <div style={{ color: '#D4AF37', fontSize: '0.75rem' }}>{item.code} · {item.category}</div>
                      <div style={{ color: '#666', fontSize: '0.72rem' }}>
                        Added: {new Date(item.addedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(item.id)}
                      style={deleteBtn}
                      title="Remove from catalog"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────
const overlay = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)',
  zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
  backdropFilter: 'blur(8px)', padding: '20px',
};

const loginBox = {
  background: '#0f0f0f', border: '1px solid #D4AF37',
  borderRadius: '8px', padding: '40px 36px', width: '100%', maxWidth: '400px',
  position: 'relative', boxShadow: '0 0 60px rgba(212,175,55,0.15)',
};

const dashBox = {
  background: '#0a0a0a', border: '1px solid #2a2a2a',
  borderRadius: '8px', width: '100%', maxWidth: '800px',
  maxHeight: '90vh', display: 'flex', flexDirection: 'column',
  boxShadow: '0 0 80px rgba(212,175,55,0.12)',
};

const dashHeader = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  padding: '18px 24px', borderBottom: '1px solid #1e1e1e',
  background: 'linear-gradient(90deg, #0f0f0f, #141414)',
};

const dashBody = {
  overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px',
};

const card = {
  background: '#111', border: '1px solid #1e1e1e',
  borderRadius: '6px', padding: '20px',
};

const cardTitle = {
  color: '#fff', fontSize: '0.95rem', fontWeight: 700,
  marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px',
};

const inputStyle = {
  width: '100%', background: '#1a1a1a', border: '1px solid #2a2a2a',
  borderRadius: '4px', color: '#fff', padding: '10px 12px', fontSize: '0.85rem',
  outline: 'none', boxSizing: 'border-box',
};

const selectStyle = {
  ...inputStyle,
  appearance: 'auto',
};

const label = {
  display: 'block', color: '#aaa', fontSize: '0.75rem',
  textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px',
};

const row2 = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' };
const fieldWrap = { display: 'flex', flexDirection: 'column' };

const uploadZone = {
  border: '2px dashed #2a2a2a', borderRadius: '6px', padding: '24px',
  textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.2s',
  display: 'flex', flexDirection: 'column', alignItems: 'center',
};

const toggleBtn = {
  display: 'flex', alignItems: 'center', gap: '6px',
  padding: '6px 14px', fontSize: '0.78rem', border: '1px solid #2a2a2a',
  borderRadius: '4px', cursor: 'pointer', background: '#1a1a1a', color: '#aaa',
};

const toggleBtnActive = {
  borderColor: '#D4AF37', color: '#D4AF37', background: 'rgba(212,175,55,0.08)',
};

const addBtn = {
  background: 'linear-gradient(135deg, #D4AF37, #b8942e)',
  color: '#000', border: 'none', borderRadius: '4px',
  padding: '12px 20px', fontSize: '0.88rem', fontWeight: 700,
  cursor: 'pointer', display: 'flex', alignItems: 'center',
  justifyContent: 'center', gap: '8px', letterSpacing: '0.5px',
};

const deleteBtn = {
  background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.3)',
  color: '#ff6b6b', borderRadius: '4px', padding: '8px', cursor: 'pointer',
  display: 'flex', alignItems: 'center',
};

const arrivalRow = {
  display: 'flex', alignItems: 'center', gap: '14px',
  padding: '10px', background: '#0f0f0f', borderRadius: '4px',
  border: '1px solid #1a1a1a',
};

const closeBtn = {
  position: 'absolute', top: '16px', right: '16px',
  background: 'none', border: 'none', color: '#888', cursor: 'pointer',
  display: 'flex', alignItems: 'center',
};

const closeBtn2 = {
  background: 'none', border: 'none', color: '#888', cursor: 'pointer',
  display: 'flex', alignItems: 'center', padding: '4px',
};

const logoutBtn = {
  background: 'rgba(255,255,255,0.05)', border: '1px solid #2a2a2a',
  color: '#888', borderRadius: '4px', padding: '6px 12px',
  fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px',
};

const lockIcon = {
  width: '60px', height: '60px', borderRadius: '50%',
  background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
};

const loginTitle = {
  color: '#fff', fontSize: '1.3rem', fontWeight: 700, marginBottom: '6px',
};

const loginSub = {
  color: '#888', fontSize: '0.82rem', margin: 0,
};

const pwToggle = {
  position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
  background: 'none', border: 'none', color: '#888', cursor: 'pointer',
  display: 'flex', alignItems: 'center',
};

const loginBtn = {
  width: '100%', background: 'linear-gradient(135deg, #D4AF37, #b8942e)',
  color: '#000', border: 'none', borderRadius: '4px',
  padding: '12px', fontSize: '0.9rem', fontWeight: 700,
  cursor: 'pointer', display: 'flex', alignItems: 'center',
  justifyContent: 'center', gap: '8px',
};
