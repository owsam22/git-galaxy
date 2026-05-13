import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, ExternalLink } from 'lucide-react';

export default function ShareModal({ username, onClose }) {
  const [tab, setTab] = useState('link');
  const [copied, setCopied] = useState(null);

  const origin = window.location.origin;
  const shareUrl = `${origin}/${username}`;
  const embedUrl = `${origin}/${username}?embed=true`;

  const htmlCode = `<iframe
  src="${embedUrl}"
  width="100%"
  height="520"
  style="border:none;border-radius:16px;overflow:hidden;"
  allow="accelerometer; gyroscope"
  title="${username}'s Git Galaxy">
</iframe>`;

  const reactCode = `<iframe
  src="${embedUrl}"
  width="100%"
  height={520}
  style={{ border: 'none', borderRadius: '16px', overflow: 'hidden' }}
  allow="accelerometer; gyroscope"
  title="${username}'s Git Galaxy"
/>`;

  const copy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const tabs = [
    { key: 'link', label: '🔗 Link' },
    { key: 'html', label: '</> HTML' },
    { key: 'react', label: '⚛ React' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(5,7,10,0.85)',
        backdropFilter: 'blur(14px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 9998,
        pointerEvents: 'auto',
        padding: '1rem',
      }}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 24 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: '540px',
          background: 'rgba(10,14,20,0.95)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '22px',
          padding: '1.5rem',
          boxShadow: '0 30px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(56,189,248,0.06)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '3px' }}>
              Share <span style={{ color: 'var(--accent)' }}>@{username}</span>'s Galaxy
            </h2>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
              Share a link or embed the interactive 3D galaxy in any website
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              padding: '6px', borderRadius: '8px', display: 'flex', flexShrink: 0,
            }}
          >
            <X size={15} />
          </button>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', gap: '4px', marginBottom: '1.1rem',
          background: 'rgba(255,255,255,0.03)', padding: '4px',
          borderRadius: '11px', border: '1px solid rgba(255,255,255,0.07)',
        }}>
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                flex: 1, padding: '7px 10px', fontSize: '0.78rem',
                fontWeight: tab === t.key ? 600 : 400,
                background: tab === t.key ? 'rgba(56,189,248,0.14)' : 'transparent',
                border: tab === t.key ? '1px solid rgba(56,189,248,0.3)' : '1px solid transparent',
                borderRadius: '8px',
                color: tab === t.key ? 'var(--accent)' : 'var(--text-secondary)',
                transition: 'all 0.18s', cursor: 'pointer',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {tab === 'link' && (
            <motion.div key="link" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
              <div style={{
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px', padding: '1rem', marginBottom: '0.75rem',
              }}>
                <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                  Direct link
                </p>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <code style={{
                    flex: 1, fontSize: '0.75rem', color: 'var(--text-primary)',
                    background: 'rgba(0,0,0,0.35)', padding: '8px 12px', borderRadius: '8px',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}>
                    {shareUrl}
                  </code>
                  <button
                    onClick={() => copy(shareUrl, 'link')}
                    style={{
                      padding: '8px 14px', flexShrink: 0, fontSize: '0.78rem',
                      display: 'flex', alignItems: 'center', gap: '5px',
                      background: copied === 'link' ? 'rgba(34,197,94,0.18)' : 'rgba(56,189,248,0.14)',
                      border: `1px solid ${copied === 'link' ? 'rgba(34,197,94,0.4)' : 'rgba(56,189,248,0.3)'}`,
                      borderRadius: '8px',
                      color: copied === 'link' ? '#22c55e' : 'var(--accent)',
                      transition: 'all 0.2s',
                    }}
                  >
                    {copied === 'link' ? <><Check size={13} /> Copied!</> : <><Copy size={13} /> Copy</>}
                  </button>
                </div>
              </div>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', opacity: 0.55, textAlign: 'center' }}>
                Opens the full Git Galaxy experience for <b>@{username}</b>
              </p>
            </motion.div>
          )}

          {(tab === 'html' || tab === 'react') && (
            <motion.div key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
              {/* Info banner */}
              <div style={{
                background: 'rgba(56,189,248,0.06)', border: '1px solid rgba(56,189,248,0.15)',
                borderRadius: '10px', padding: '10px 14px', marginBottom: '0.85rem',
                display: 'flex', gap: '10px', alignItems: 'flex-start',
              }}>
                <span style={{ fontSize: '1rem', flexShrink: 0 }}>🌌</span>
                <div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-primary)', fontWeight: 600, marginBottom: '2px' }}>
                    Interactive 3D embed
                  </p>
                  <p style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    Visitors can orbit, zoom &amp; explore the galaxy. Search, snapshot &amp; sharing are <b>disabled</b> in embed mode.
                  </p>
                </div>
              </div>

              {/* Code block */}
              <div style={{
                background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px', overflow: 'hidden',
              }}>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '7px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)',
                  background: 'rgba(255,255,255,0.02)',
                }}>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                    {tab === 'html' ? 'index.html' : 'Portfolio.jsx'}
                  </span>
                  <button
                    onClick={() => copy(tab === 'html' ? htmlCode : reactCode, tab)}
                    style={{
                      padding: '4px 10px', fontSize: '0.7rem',
                      display: 'flex', alignItems: 'center', gap: '4px',
                      background: copied === tab ? 'rgba(34,197,94,0.18)' : 'rgba(56,189,248,0.12)',
                      border: `1px solid ${copied === tab ? 'rgba(34,197,94,0.4)' : 'rgba(56,189,248,0.25)'}`,
                      borderRadius: '6px',
                      color: copied === tab ? '#22c55e' : 'var(--accent)',
                      transition: 'all 0.2s',
                    }}
                  >
                    {copied === tab ? <><Check size={11} /> Copied!</> : <><Copy size={11} /> Copy</>}
                  </button>
                </div>
                <pre style={{
                  padding: '1rem', fontSize: '0.7rem', lineHeight: 1.65,
                  color: '#94a3b8', overflowX: 'auto', margin: 0,
                  fontFamily: "'Fira Code', 'JetBrains Mono', 'Cascadia Code', monospace",
                  whiteSpace: 'pre',
                }}>
                  <code>{tab === 'html' ? htmlCode : reactCode}</code>
                </pre>
              </div>

              <p style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', opacity: 0.5, textAlign: 'center', marginTop: '0.75rem' }}>
                Paste into your portfolio to showcase <b>@{username}</b>'s galaxy ✨
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
