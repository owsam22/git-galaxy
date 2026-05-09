import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCcw, Share2, Download, X, ChevronDown, ChevronUp, MapPin, Briefcase, Link, MessageCircle, Users, Calendar } from 'lucide-react';
import SearchScreen from './SearchScreen';
import SnapshotTool from './SnapshotTool';

export default function Overlay({ data, onDataLoaded }) {
  const [snapshotPreview, setSnapshotPreview] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

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
            <motion.div 
              layout
              className="glass-panel" 
              style={{ 
                padding: '1.2rem',
                width: isExpanded ? '350px' : '260px',
                borderRadius: '12px',
                overflow: 'hidden'
              }}
              transition={{
                layout: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: isExpanded ? '1rem' : '0' }}>
                <img src={data.core.avatarUrl} alt="Avatar" style={{ width: '48px', height: '48px', borderRadius: '50%' }} crossOrigin="anonymous" />
                <div style={{ flex: 1 }}>
                  <motion.h2 layout="position" style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>{data.core.username}</motion.h2>
                  {!isExpanded && (
                    <motion.p 
                      layout="position"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}
                    >
                      {data.core.publicRepos} repos
                    </motion.p>
                  )}
                </div>
                <button 
                  onClick={() => setIsExpanded(!isExpanded)}
                  style={{ 
                    padding: '6px 10px', 
                    background: 'rgba(255,255,255,0.05)', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    borderRadius: '6px',
                    display: 'flex', 
                    alignItems: 'center', 
                    color: 'var(--accent)',
                    fontSize: '0.75rem',
                    gap: '4px',
                    cursor: 'pointer'
                  }}
                >
                  {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  {isExpanded ? 'Less' : 'More'}
                </button>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    key="expanded-content"
                    layout
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5, transition: { duration: 0.1 } }}
                    transition={{ 
                      opacity: { duration: 0.2 },
                      layout: { type: "spring", stiffness: 300, damping: 30 }
                    }}
                  >
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem', marginTop: '0.5rem' }}>
                      {data.core.bio && (
                        <p style={{ fontSize: '0.9rem', marginBottom: '1.2rem', color: 'var(--text-primary)', lineHeight: '1.5', opacity: 0.9 }}>
                          {data.core.bio}
                        </p>
                      )}
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          <Users size={14} />
                          <span>{data.core.followers} followers</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          <Users size={14} />
                          <span>{data.core.following} following</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          <div style={{ width: 14, height: 14, borderRadius: '50%', background: 'var(--accent)', opacity: 0.8 }} />
                          <span>{data.core.publicRepos} repos</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          <Calendar size={14} />
                          <span>Joined {new Date(data.core.createdAt).getFullYear()}</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                        {data.core.location && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            <MapPin size={14} />
                            <span>{data.core.location}</span>
                          </div>
                        )}
                        {data.core.company && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            <Briefcase size={14} />
                            <span>{data.core.company}</span>
                          </div>
                        )}
                        {data.core.blog && (
                          <a href={data.core.blog.startsWith('http') ? data.core.blog : `https://${data.core.blog}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--accent)', textDecoration: 'none' }}>
                            <Link size={14} />
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{data.core.blog}</span>
                          </a>
                        )}
                        {data.core.twitter && (
                          <a href={`https://twitter.com/${data.core.twitter}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--accent)', textDecoration: 'none' }}>
                            <MessageCircle size={14} />
                            <span>@{data.core.twitter}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <button 
                onClick={async () => {
                  const shareUrl = `${window.location.origin}${window.location.pathname}?user=${data.core.username}`;
                  const shareData = {
                    title: 'Git Galaxy',
                    text: `Explore this Git Galaxy!`,
                    url: shareUrl,
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
                    navigator.clipboard.writeText(shareUrl);
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
                Find Another user
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
