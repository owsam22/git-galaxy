import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, GitFork, ExternalLink, X } from 'lucide-react';

export default function RepoCard({ repo, onClose }) {
  if (!repo) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="interactive-ui glass-panel"
        style={{
          position: 'absolute',
          right: '2rem',
          top: '2rem',
          width: '320px',
          padding: '1.5rem',
          color: 'white',
        }}
      >
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', padding: 0 }}
        >
          <X size={20} color="var(--text-secondary)" />
        </button>
        
        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', paddingRight: '20px' }}>{repo.name}</h3>
        {repo.description && (
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: '1.4' }}>
            {repo.description}
          </p>
        )}
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#facc15' }}>
            <Star size={16} /> <span>{repo.stars}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)' }}>
            <GitFork size={16} /> <span>{repo.forks}</span>
          </div>
          {repo.language && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent)' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'currentColor' }} />
              <span>{repo.language}</span>
            </div>
          )}
        </div>
        
        <a 
          href={repo.url} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            background: 'var(--accent)', color: '#05070a', textDecoration: 'none',
            padding: '10px', borderRadius: '6px', fontWeight: 600, transition: 'opacity 0.2s'
          }}
          onMouseOver={(e) => e.target.style.opacity = 0.9}
          onMouseOut={(e) => e.target.style.opacity = 1}
        >
          <ExternalLink size={16} /> View on GitHub
        </a>
      </motion.div>
    </AnimatePresence>
  );
}
