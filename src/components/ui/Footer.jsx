import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer({ isEmbed, data }) {
  return isEmbed ? (
    <a
      href={`${window.location.origin}/${data?.core?.username || ''}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{ position: 'absolute', bottom: '10px', right: '12px', zIndex: 50, display: 'flex', alignItems: 'center', gap: '5px', padding: '4px 10px', background: 'rgba(5,7,10,0.7)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '100px', color: 'var(--text-secondary)', fontSize: '0.62rem', textDecoration: 'none', letterSpacing: '0.5px', transition: 'all 0.2s', pointerEvents: 'auto' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(56,189,248,0.4)'; e.currentTarget.style.color = 'var(--accent)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
    >
      <span style={{ opacity: 0.7 }}>⚡</span>
      <span>GitGalaxy</span>
      <ExternalLink size={9} />
    </a>
  ) : (
    <div className="no-capture site-footer" style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.78rem', pointerEvents: 'auto', zIndex: 20, padding: '0.6rem' }}>
      developed by <a href="https://github.com/owsam22" target="_blank" rel="noopener noreferrer" className="footer-link">@owsam22</a>
      <span style={{ margin: '0 8px', opacity: 0.5 }}>•</span>
      <Link to="/about" className="footer-link" style={{ textDecoration: 'none' }}>About</Link>
    </div>
  );
}
