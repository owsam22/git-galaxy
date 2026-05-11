import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Star, GitFork, Eye, Calendar, Code } from 'lucide-react';

export default function RepoModal({ repo, onClose }) {
  if (!repo) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        className="glass-panel repo-modal interactive-ui"
        style={{
          position: 'fixed',
          top: '2rem',
          right: '2rem',
          width: '380px',
          maxHeight: 'calc(100vh - 4rem)',
          zIndex: 1000,
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.2rem',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
          overflowY: 'auto'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '1.4rem', margin: 0, color: 'var(--accent)', wordBreak: 'break-all' }}>
              {repo.name}
            </h3>
            {repo.language && (
              <div style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '6px', 
                fontSize: '0.75rem', 
                background: 'rgba(255,255,255,0.05)', 
                padding: '2px 8px', 
                borderRadius: '12px',
                marginTop: '8px',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <Code size={12} />
                {repo.language}
              </div>
            )}
          </div>
          <button onClick={onClose} style={{ padding: '4px', background: 'transparent', border: 'none' }}>
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', opacity: 0.8, lineHeight: '1.6', margin: 0 }}>
          {repo.description || 'No description provided.'}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
          <div className="stat-pill">
            <Star size={14} />
            <span>{repo.stars} stars</span>
          </div>
          <div className="stat-pill">
            <GitFork size={14} />
            <span>{repo.forks} forks</span>
          </div>
          <div className="stat-pill" style={{ gridColumn: 'span 2' }}>
            <Calendar size={14} />
            <span>Last push: {new Date(repo.lastPush).toLocaleDateString()}</span>
          </div>
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', gap: '0.8rem' }}>
          <a 
            href={repo.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="action-button primary"
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <ExternalLink size={16} />
            Open GitHub
          </a>
          <button onClick={onClose} className="action-button secondary">
            Close
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
