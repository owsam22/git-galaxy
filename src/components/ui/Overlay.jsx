import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCcw, Share2, Download, X } from 'lucide-react';
import SearchScreen from './SearchScreen';
import SnapshotTool from './SnapshotTool';

export default function Overlay({ data, onDataLoaded }) {
  const [snapshotPreview, setSnapshotPreview] = useState(null);

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
                onClick={async () => {
                  const shareData = {
                    title: 'Git Galaxy',
                    text: `Explore this Git Galaxy!`,
                    url: window.location.href,
                  };
                  
                  if (navigator.share && navigator.canShare(shareData)) {
                    try {
                      await navigator.share(shareData);
                    } catch (err) {
                      if (err.name !== 'AbortError') {
                        console.error('Error sharing:', err);
                      }
                    }
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copied to clipboard!');
                  }
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
            <SnapshotTool username={data.core.username} onSnapshot={setSnapshotPreview} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Snapshot Preview Modal - Moved here to avoid parent transform issues */}
      <AnimatePresence>
        {snapshotPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="no-capture"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(0, 0, 0, 0.9)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: '2rem',
              pointerEvents: 'auto'
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass-panel preview-container"
              style={{
                maxWidth: '90%',
                maxHeight: '75%',
                overflow: 'hidden',
                position: 'relative',
                padding: '4px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <img 
                src={snapshotPreview} 
                alt="Snapshot Preview" 
                style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '4px' }} 
              />
            </motion.div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button 
                onClick={() => {
                  const link = document.createElement('a');
                  link.download = `${data.core.username}-galaxy.png`;
                  link.href = snapshotPreview;
                  link.click();
                  setSnapshotPreview(null);
                }}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  background: 'var(--accent)', 
                  color: 'black',
                  fontWeight: 600,
                  padding: '12px 24px'
                }}
              >
                <Download size={20} />
                Save to download
              </button>
              
              <button 
                onClick={() => setSnapshotPreview(null)}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                <X size={20} />
                Cancel
              </button>
            </div>
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
