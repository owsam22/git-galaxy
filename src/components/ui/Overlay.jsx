import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCcw, Share2 } from 'lucide-react';
import SearchScreen from './SearchScreen';
import SnapshotTool from './SnapshotTool';

export default function Overlay({ data, onDataLoaded }) {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <AnimatePresence>
        {!data && (
          <SearchScreen onDataLoaded={onDataLoaded} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {data && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="interactive-ui"
            style={{ position: 'absolute', bottom: '2rem', left: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            {/* Profile Banner */}
            <div className="glass-panel" style={{ padding: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <img src={data.core.avatarUrl} alt="Avatar" style={{ width: '48px', height: '48px', borderRadius: '50%' }} crossOrigin="anonymous" />
                <div>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>{data.core.username}</h2>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Total Repos: {data.core.publicRepos} | Followers: {data.core.followers}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link copied to clipboard!');
                }}
                className="glass-panel share-btn"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', justifyContent: 'center' }}
              >
                <Share2 size={16} />
                Share my galaxy
              </button>

              <button 
                onClick={() => onDataLoaded(null)}
                className="glass-panel"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', justifyContent: 'center' }}
              >
                <RefreshCcw size={16} />
                Try Another user
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {data && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 2.2, duration: 1 }}
            style={{ position: 'absolute', bottom: '2rem', right: '2rem' }}
            className="interactive-ui"
          >
            <SnapshotTool username={data.core.username} />
          </motion.div>
        )}
      </AnimatePresence>

      <div 
        style={{ 
          position: 'absolute', 
          bottom: '1rem', 
          left: '50%', 
          transform: 'translateX(-50%)',
          color: 'var(--text-secondary)',
          fontSize: '0.8rem',
          pointerEvents: 'auto',
          zIndex: 20
        }}
      >
        developed by <a href="https://github.com/owsam22" target="_blank" rel="noopener noreferrer" className="footer-link">@owsam22</a>
      </div>
    </div>
  );
}
