import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Star } from 'lucide-react';

export default function GalaxyNav({ currentUsername, isViewingSelf, onBackToOwnGalaxy, onOpenSearch }) {
  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="interactive-ui"
      style={{
        position: 'absolute',
        top: '1.5rem',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        zIndex: 50
      }}
    >
      {!isViewingSelf && (
        <button 
          onClick={onBackToOwnGalaxy}
          className="glass-panel"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            fontSize: '0.9rem',
            color: 'var(--accent)'
          }}
        >
          <ArrowLeft size={16} />
          Back to my Galaxy
        </button>
      )}

      <div className="glass-panel" style={{
        padding: '8px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        border: '1px solid var(--accent)'
      }}>
        <Star size={16} className="animate-pulse" style={{ color: 'var(--accent)' }} />
        <span style={{ fontWeight: 600, letterSpacing: '1px' }}>{currentUsername.toUpperCase()}</span>
      </div>

      <button 
        onClick={onOpenSearch}
        className="glass-panel"
        style={{
          padding: '8px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: 'var(--text-secondary)'
        }}
      >
        <Search size={16} />
        <span style={{ fontSize: '0.85rem' }}>Search Another</span>
      </button>
    </motion.div>
  );
}
