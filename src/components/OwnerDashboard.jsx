import React, { useState, useRef } from 'react';
import {
  Plus, Trash2, Upload, Link2, ImageIcon,
  LogOut, Sparkles, Package, CheckCircle2, X, Eye,
} from 'lucide-react';
import { resolveAsset } from './ProductCatalog';

const STORAGE_KEY = 'kusum_new_arrivals';

export function loadNewArrivals() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  catch { return []; }
}
function saveNewArrivals(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

const CATEGORIES = ['Necklace Sets', 'Earrings', 'Bangles', 'Bracelets'];
const EMPTY = {
  name: '', code: '', category: 'Necklace Sets', description: '',
  imageMode: 'upload', imageUrl: '', imageData: '',
  weightGrams: '', baseMetal: 'Imitation Alloy',
};

export default function OwnerDashboard({ onLogout, onProductsChanged }) {
  const [arrivals, setArrivals]   = useState(loadNewArrivals);
  const [form,     setForm]       = useState(EMPTY);
  const [preview,  setPreview]    = useState('');
  const [toast,    setToast]      = useState('');
  const [deleting, setDeleting]   = useState(null);
  const [previewModal, setPreviewModal] = useState(null);
  const fileRef = useRef(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  /* File → base64 */
  const handleFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      setForm(f => ({ ...f, imageData: ev.target.result, imageUrl: '' }));
      setPreview(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  /* Drag & drop */
  const onDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  /* Submit */
  const handleAdd = (e) => {
    e.preventDefault();
    const image = form.imageMode === 'upload' ? form.imageData : form.imageUrl;
    if (!image) return showToast('⚠ Please add a product image first.');
    const item = {
      id:          `admin_${Date.now()}`,
      code:        form.code.trim(),
      name:        form.name.trim(),
      description: form.description.trim() || `Premium handcrafted ${form.category.toLowerCase()} piece.`,
      image,
      category:    form.category,
      weightGrams: parseFloat(form.weightGrams) || 20,
      baseMetal:   form.baseMetal,
      goldPlatingGrams: 0.5,
      makingCharges: 2000,
      stoneCharges:  1500,
      baseMetalType: form.baseMetal === 'Silver (92.5%)' ? 'silver' : 'baseAlloy',
      purityCertification: `${form.baseMetal} Base`,
      isNewArrival: true,
      addedAt: new Date().toISOString(),
    };
    const updated = [item, ...arrivals];
    setArrivals(updated);
    saveNewArrivals(updated);
    onProductsChanged(updated);
    setForm(EMPTY);
    setPreview('');
    showToast('✓ Product added to catalog!');
  };

  /* Delete */
  const handleDelete = (id) => {
    const updated = arrivals.filter(a => a.id !== id);
    setArrivals(updated);
    saveNewArrivals(updated);
    onProductsChanged(updated);
    setDeleting(null);
    showToast('Product removed from catalog.');
  };

  return (
    <div style={s.page}>
      {/* ── HEADER ── */}
      <header style={s.header}>
        <div style={s.headerLogo}>
          <Sparkles size={18} color="#D4AF37" />
          <span style={s.headerBrand}>KUSUM</span>
          <span style={s.headerTag}>Owner Dashboard</span>
        </div>
        <button style={s.logoutBtn} onClick={onLogout}>
          <LogOut size={14} /> Sign Out
        </button>
      </header>

      {/* ── BODY ── */}
      <div style={s.body}>

        {/* ── LEFT: ADD FORM ── */}
        <div style={s.panel}>
          <div style={s.panelTitle}>
            <Plus size={16} color="#D4AF37" />
            Add New Arrival
          </div>

          <form onSubmit={handleAdd} style={s.form}>

            {/* Name + Code */}
            <div style={s.row2}>
              <div>
                <label style={s.lbl}>Product Name *</label>
                <input required style={s.inp} placeholder="e.g. Royal Kundan Choker"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <label style={s.lbl}>Product Code *</label>
                <input required style={s.inp} placeholder="e.g. D.no-3500"
                  value={form.code}
                  onChange={e => setForm(f => ({ ...f, code: e.target.value }))} />
              </div>
            </div>

            {/* Category + Base Metal */}
            <div style={s.row2}>
              <div>
                <label style={s.lbl}>Category</label>
                <select style={s.sel} value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={s.lbl}>Base Metal</label>
                <select style={s.sel} value={form.baseMetal}
                  onChange={e => setForm(f => ({ ...f, baseMetal: e.target.value }))}>
                  <option>Imitation Alloy</option>
                  <option>Silver (92.5%)</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label style={s.lbl}>Description</label>
              <textarea style={{ ...s.inp, height: '80px', resize: 'vertical' }}
                placeholder="Describe this jewelry piece..."
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>

            {/* Weight */}
            <div>
              <label style={s.lbl}>Gross Weight (grams)</label>
              <input style={{ ...s.inp, maxWidth: '160px' }} type="number" min="1" max="500"
                placeholder="e.g. 25"
                value={form.weightGrams}
                onChange={e => setForm(f => ({ ...f, weightGrams: e.target.value }))} />
            </div>

            {/* IMAGE */}
            <div>
              <label style={s.lbl}>Product Image *</label>

              {/* Toggle */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                {[
                  { mode: 'upload', icon: <Upload size={13} />, label: 'Upload from device' },
                  { mode: 'url',    icon: <Link2  size={13} />, label: 'Paste image URL' },
                ].map(({ mode, icon, label }) => (
                  <button key={mode} type="button"
                    onClick={() => { setForm(f => ({ ...f, imageMode: mode })); setPreview(''); }}
                    style={{
                      ...s.toggle,
                      ...(form.imageMode === mode ? s.toggleActive : {}),
                    }}>
                    {icon} {label}
                  </button>
                ))}
              </div>

              {form.imageMode === 'upload' ? (
                <div
                  style={s.dropZone}
                  onClick={() => fileRef.current?.click()}
                  onDragOver={e => e.preventDefault()}
                  onDrop={onDrop}
                >
                  <ImageIcon size={36} color="#D4AF37" style={{ marginBottom: '10px' }} />
                  <p style={s.dropText}>Click to browse or drag & drop your photo here</p>
                  <p style={s.dropSub}>JPG · PNG · WEBP · up to 10 MB</p>
                  <input ref={fileRef} type="file" accept="image/*"
                    style={{ display: 'none' }}
                    onChange={e => handleFile(e.target.files[0])} />
                </div>
              ) : (
                <div>
                  <input style={s.inp} type="url"
                    placeholder="https://example.com/jewellery-photo.jpg"
                    value={form.imageUrl}
                    onChange={e => { setForm(f => ({ ...f, imageUrl: e.target.value, imageData: '' })); setPreview(e.target.value); }} />
                </div>
              )}

              {/* Preview */}
              {preview && (
                <div style={s.previewBox}>
                  <span style={s.lbl}>Preview</span>
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <img src={preview} alt="preview" style={s.previewImg}
                      onError={() => setPreview('')} />
                    <button type="button" onClick={() => { setPreview(''); setForm(f => ({ ...f, imageData: '', imageUrl: '' })); }}
                      style={s.clearImg}>
                      <X size={12} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Submit */}
            <button type="submit" style={s.addBtn}>
              <Plus size={16} /> Add to New Arrivals
            </button>
          </form>
        </div>

        {/* ── RIGHT: LIST ── */}
        <div style={s.panel}>
          <div style={s.panelTitle}>
            <Package size={16} color="#D4AF37" />
            New Arrivals in Catalog
            <span style={s.badge}>{arrivals.length}</span>
          </div>

          {arrivals.length === 0 ? (
            <div style={s.empty}>
              <ImageIcon size={48} color="#2a2a2a" />
              <p style={{ color: '#555', marginTop: '12px', fontSize: '0.85rem' }}>
                No new arrivals yet.<br />Add your first product using the form.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {arrivals.map(item => (
                <div key={item.id} style={s.arrRow}>
                  {/* Thumb */}
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <img src={resolveAsset(item.image)} alt={item.name}
                      style={s.thumb}
                      onError={e => { e.target.src = resolveAsset('/assets/dno_195.jpg'); e.target.onerror = null; }} />
                    <button style={s.eyeOverlay} title="Preview"
                      onClick={() => setPreviewModal(item)}>
                      <Eye size={13} />
                    </button>
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={s.arrName}>{item.name}</div>
                    <div style={s.arrMeta}>{item.code} · {item.category}</div>
                    <div style={s.arrDate}>
                      Added {new Date(item.addedAt).toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric',
                      })}
                    </div>
                  </div>

                  {/* Delete */}
                  {deleting === item.id ? (
                    <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                      <button style={s.confirmBtn} onClick={() => handleDelete(item.id)}>Yes, Remove</button>
                      <button style={s.cancelBtn}  onClick={() => setDeleting(null)}>Cancel</button>
                    </div>
                  ) : (
                    <button style={s.delBtn} onClick={() => setDeleting(item.id)} title="Remove">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── TOAST ── */}
      {toast && (
        <div style={s.toast}>
          <CheckCircle2 size={16} color="#D4AF37" />
          {toast}
        </div>
      )}

      {/* ── IMAGE PREVIEW MODAL ── */}
      {previewModal && (
        <div style={s.modalBg} onClick={() => setPreviewModal(null)}>
          <div style={s.modalBox} onClick={e => e.stopPropagation()}>
            <button style={s.modalClose} onClick={() => setPreviewModal(null)}><X size={18} /></button>
            <img src={resolveAsset(previewModal.image)} alt={previewModal.name}
              style={{ width: '100%', maxHeight: '70vh', objectFit: 'contain', borderRadius: '6px' }}
              onError={e => { e.target.src = resolveAsset('/assets/dno_195.jpg'); e.target.onerror = null; }} />
            <p style={{ color: '#D4AF37', fontWeight: 700, marginTop: '12px', textAlign: 'center' }}>
              {previewModal.name}
            </p>
            <p style={{ color: '#888', fontSize: '0.8rem', textAlign: 'center' }}>
              {previewModal.code} · {previewModal.category}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Styles ── */
const s = {
  page: {
    minHeight: '100vh', background: '#080808',
    fontFamily: "'Inter','Segoe UI',sans-serif", color: '#fff',
  },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '16px 32px',
    background: 'linear-gradient(90deg,#0d0d0d,#111)',
    borderBottom: '1px solid rgba(212,175,55,0.2)',
    position: 'sticky', top: 0, zIndex: 100,
  },
  headerLogo: { display: 'flex', alignItems: 'center', gap: '10px' },
  headerBrand: { fontSize: '1.2rem', fontWeight: 800, color: '#D4AF37', letterSpacing: '4px' },
  headerTag: {
    fontSize: '0.7rem', color: '#888', letterSpacing: '1px',
    background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)',
    borderRadius: '20px', padding: '3px 10px',
  },
  logoutBtn: {
    display: 'flex', alignItems: 'center', gap: '6px',
    background: 'rgba(255,255,255,0.05)', border: '1px solid #2a2a2a',
    color: '#aaa', borderRadius: '6px', padding: '8px 16px',
    fontSize: '0.8rem', cursor: 'pointer',
  },
  body: {
    display: 'grid', gridTemplateColumns: '1fr 1fr',
    gap: '24px', padding: '28px 32px', maxWidth: '1280px', margin: '0 auto',
  },
  panel: {
    background: '#0f0f0f', border: '1px solid #1e1e1e',
    borderRadius: '10px', padding: '24px',
  },
  panelTitle: {
    display: 'flex', alignItems: 'center', gap: '8px',
    color: '#fff', fontSize: '1rem', fontWeight: 700,
    marginBottom: '22px', paddingBottom: '14px',
    borderBottom: '1px solid #1e1e1e',
  },
  badge: {
    background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)',
    color: '#D4AF37', borderRadius: '20px', padding: '1px 10px', fontSize: '0.75rem',
    marginLeft: 'auto',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '18px' },
  row2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' },
  lbl: {
    display: 'block', color: '#888', fontSize: '0.7rem',
    textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px',
  },
  inp: {
    width: '100%', background: '#1a1a1a',
    border: '1px solid #2a2a2a', borderRadius: '6px',
    color: '#fff', padding: '11px 14px', fontSize: '0.88rem',
    outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  },
  sel: {
    width: '100%', background: '#1a1a1a',
    border: '1px solid #2a2a2a', borderRadius: '6px',
    color: '#fff', padding: '11px 14px', fontSize: '0.88rem',
    outline: 'none', boxSizing: 'border-box',
  },
  toggle: {
    display: 'flex', alignItems: 'center', gap: '6px',
    padding: '7px 14px', fontSize: '0.78rem',
    border: '1px solid #2a2a2a', borderRadius: '6px',
    cursor: 'pointer', background: '#1a1a1a', color: '#888',
  },
  toggleActive: {
    borderColor: '#D4AF37', color: '#D4AF37',
    background: 'rgba(212,175,55,0.08)',
  },
  dropZone: {
    border: '2px dashed #2a2a2a', borderRadius: '8px',
    padding: '36px 20px', textAlign: 'center', cursor: 'pointer',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    transition: 'border-color 0.2s',
    background: 'rgba(212,175,55,0.02)',
  },
  dropText: { color: '#aaa', fontSize: '0.88rem', margin: 0 },
  dropSub: { color: '#555', fontSize: '0.75rem', marginTop: '6px' },
  previewBox: { marginTop: '14px' },
  previewImg: {
    width: '120px', height: '120px', objectFit: 'cover',
    borderRadius: '6px', border: '2px solid #D4AF37',
    display: 'block',
  },
  clearImg: {
    position: 'absolute', top: '-8px', right: '-8px',
    background: '#ff4444', border: 'none', borderRadius: '50%',
    width: '22px', height: '22px', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#fff',
  },
  addBtn: {
    background: 'linear-gradient(135deg,#D4AF37,#b8942e)',
    color: '#000', border: 'none', borderRadius: '6px',
    padding: '14px', fontSize: '0.92rem', fontWeight: 700,
    cursor: 'pointer', display: 'flex', alignItems: 'center',
    justifyContent: 'center', gap: '8px',
    boxShadow: '0 4px 20px rgba(212,175,55,0.25)',
  },
  empty: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', padding: '60px 20px', textAlign: 'center',
  },
  arrRow: {
    display: 'flex', alignItems: 'center', gap: '14px',
    padding: '12px', background: '#0a0a0a',
    border: '1px solid #1a1a1a', borderRadius: '8px',
  },
  thumb: {
    width: '64px', height: '64px', objectFit: 'cover',
    borderRadius: '6px', border: '1px solid #2a2a2a',
  },
  eyeOverlay: {
    position: 'absolute', inset: 0,
    background: 'rgba(0,0,0,0.5)', borderRadius: '6px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    opacity: 0, border: 'none', cursor: 'pointer', color: '#fff',
    transition: 'opacity 0.2s',
  },
  arrName: {
    color: '#fff', fontWeight: 600, fontSize: '0.9rem',
    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
  },
  arrMeta: { color: '#D4AF37', fontSize: '0.75rem', marginTop: '2px' },
  arrDate: { color: '#555', fontSize: '0.7rem', marginTop: '2px' },
  delBtn: {
    background: 'rgba(255,80,80,0.08)', border: '1px solid rgba(255,80,80,0.25)',
    color: '#ff6b6b', borderRadius: '6px', padding: '8px 10px',
    cursor: 'pointer', display: 'flex', alignItems: 'center', flexShrink: 0,
  },
  confirmBtn: {
    background: '#ff4444', border: 'none', color: '#fff',
    borderRadius: '4px', padding: '6px 10px', fontSize: '0.75rem',
    cursor: 'pointer', fontWeight: 600,
  },
  cancelBtn: {
    background: '#2a2a2a', border: 'none', color: '#aaa',
    borderRadius: '4px', padding: '6px 10px', fontSize: '0.75rem',
    cursor: 'pointer',
  },
  toast: {
    position: 'fixed', bottom: '28px', left: '50%', transform: 'translateX(-50%)',
    background: '#111', border: '1px solid rgba(212,175,55,0.4)',
    color: '#fff', borderRadius: '8px', padding: '12px 22px',
    display: 'flex', alignItems: 'center', gap: '10px',
    fontSize: '0.88rem', zIndex: 9999,
    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
  },
  modalBg: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
    zIndex: 9999, display: 'flex', alignItems: 'center',
    justifyContent: 'center', padding: '24px',
    backdropFilter: 'blur(6px)',
  },
  modalBox: {
    background: '#111', border: '1px solid rgba(212,175,55,0.3)',
    borderRadius: '10px', padding: '24px', maxWidth: '500px',
    width: '100%', position: 'relative',
  },
  modalClose: {
    position: 'absolute', top: '14px', right: '14px',
    background: '#1a1a1a', border: '1px solid #2a2a2a',
    color: '#888', borderRadius: '50%', width: '30px', height: '30px',
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
};
