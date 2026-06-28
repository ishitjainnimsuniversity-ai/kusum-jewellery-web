import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck, Sparkles } from 'lucide-react';

const OWNER_PASSWORD = 'kusum2024';

export default function OwnerLogin({ onSuccess }) {
  const [password,  setPassword]  = useState('');
  const [visible,   setVisible]   = useState(false);
  const [error,     setError]     = useState('');
  const [shaking,   setShaking]   = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === OWNER_PASSWORD) {
      setError('');
      onSuccess();
    } else {
      setError('Incorrect password. Please try again.');
      setShaking(true);
      setTimeout(() => setShaking(false), 600);
      setPassword('');
    }
  };

  return (
    <div style={styles.page}>
      {/* Background particles */}
      <div style={styles.bgGlow1} />
      <div style={styles.bgGlow2} />

      <div style={{ ...styles.card, animation: shaking ? 'shake 0.5s ease' : 'fadeInUp 0.6s ease both' }}>
        {/* Logo */}
        <div style={styles.logoRow}>
          <Sparkles size={22} color="#D4AF37" />
          <span style={styles.logoText}>KUSUM</span>
        </div>
        <p style={styles.logoSub}>Imitation Jewellery · Malad, Mumbai</p>

        {/* Divider */}
        <div style={styles.divider}>
          <div style={styles.divLine} />
          <span style={styles.divText}>OWNER ACCESS</span>
          <div style={styles.divLine} />
        </div>

        {/* Lock icon */}
        <div style={styles.lockWrap}>
          <Lock size={32} color="#D4AF37" />
        </div>

        <h1 style={styles.title}>Welcome Back</h1>
        <p style={styles.subtitle}>Sign in to manage your boutique catalog</p>

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Owner Password</label>
          <div style={styles.inputWrap}>
            <Lock size={15} color="#D4AF37" style={styles.inputIcon} />
            <input
              type={visible ? 'text' : 'password'}
              value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
              placeholder="Enter your password"
              autoFocus
              required
              style={styles.input}
            />
            <button
              type="button"
              onClick={() => setVisible(v => !v)}
              style={styles.eyeBtn}
              tabIndex={-1}
            >
              {visible ? <EyeOff size={16} color="#888" /> : <Eye size={16} color="#888" />}
            </button>
          </div>

          {error && (
            <div style={styles.errorBox}>
              <span>⚠ {error}</span>
            </div>
          )}

          <button type="submit" style={styles.loginBtn}>
            <ShieldCheck size={16} />
            Sign In to Dashboard
          </button>
        </form>

        <p style={styles.note}>
          🔒 This page is private and only accessible to the boutique owner.
        </p>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20%     { transform: translateX(-10px); }
          40%     { transform: translateX(10px); }
          60%     { transform: translateX(-8px); }
          80%     { transform: translateX(8px); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'radial-gradient(ellipse at 50% 0%, #1a0f00 0%, #080808 60%, #000 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
  bgGlow1: {
    position: 'absolute', top: '-120px', left: '50%', transform: 'translateX(-50%)',
    width: '600px', height: '400px',
    background: 'radial-gradient(ellipse, rgba(212,175,55,0.12) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  bgGlow2: {
    position: 'absolute', bottom: '-100px', right: '-100px',
    width: '400px', height: '400px',
    background: 'radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  card: {
    background: 'linear-gradient(145deg, #111 0%, #0d0d0d 100%)',
    border: '1px solid rgba(212,175,55,0.3)',
    borderRadius: '12px',
    padding: '48px 44px',
    width: '100%',
    maxWidth: '440px',
    boxShadow: '0 0 80px rgba(212,175,55,0.08), 0 20px 60px rgba(0,0,0,0.6)',
    textAlign: 'center',
    position: 'relative',
  },
  logoRow: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
    marginBottom: '4px',
  },
  logoText: {
    fontSize: '1.6rem', fontWeight: 800, color: '#D4AF37',
    letterSpacing: '6px', fontFamily: "'Georgia', serif",
  },
  logoSub: {
    fontSize: '0.72rem', color: '#888', letterSpacing: '1.5px',
    marginBottom: '28px', textTransform: 'uppercase',
  },
  divider: {
    display: 'flex', alignItems: 'center', gap: '12px',
    marginBottom: '28px',
  },
  divLine: { flex: 1, height: '1px', background: 'rgba(212,175,55,0.2)' },
  divText: { color: '#D4AF37', fontSize: '0.65rem', letterSpacing: '3px', whiteSpace: 'nowrap' },
  lockWrap: {
    width: '72px', height: '72px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(212,175,55,0.15), rgba(212,175,55,0.03))',
    border: '1px solid rgba(212,175,55,0.25)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 20px',
  },
  title: {
    fontSize: '1.6rem', fontWeight: 700, color: '#fff',
    margin: '0 0 8px', letterSpacing: '0.5px',
  },
  subtitle: {
    fontSize: '0.83rem', color: '#888', marginBottom: '32px',
  },
  form: { textAlign: 'left' },
  label: {
    display: 'block', color: '#aaa', fontSize: '0.72rem',
    textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px',
  },
  inputWrap: {
    position: 'relative', marginBottom: '20px',
  },
  inputIcon: {
    position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
    pointerEvents: 'none',
  },
  input: {
    width: '100%', background: '#1a1a1a',
    border: '1px solid rgba(212,175,55,0.25)',
    borderRadius: '6px', color: '#fff',
    padding: '13px 44px 13px 42px',
    fontSize: '0.95rem', outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  },
  eyeBtn: {
    position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
    background: 'none', border: 'none', cursor: 'pointer',
    display: 'flex', alignItems: 'center', padding: '2px',
  },
  errorBox: {
    background: 'rgba(255,80,80,0.08)', border: '1px solid rgba(255,80,80,0.3)',
    borderRadius: '6px', padding: '10px 14px', marginBottom: '16px',
    color: '#ff7070', fontSize: '0.82rem',
  },
  loginBtn: {
    width: '100%',
    background: 'linear-gradient(135deg, #D4AF37 0%, #b8942e 100%)',
    color: '#000', border: 'none', borderRadius: '6px',
    padding: '14px', fontSize: '0.95rem', fontWeight: 700,
    cursor: 'pointer', display: 'flex', alignItems: 'center',
    justifyContent: 'center', gap: '8px', letterSpacing: '0.5px',
    boxShadow: '0 4px 20px rgba(212,175,55,0.3)',
    transition: 'all 0.2s',
  },
  note: {
    fontSize: '0.72rem', color: '#555', marginTop: '28px', lineHeight: 1.6,
  },
};
