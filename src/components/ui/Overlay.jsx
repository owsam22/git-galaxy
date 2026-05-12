import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCcw, Share2, Download, X, ChevronDown, ChevronUp, MapPin, Link, Users, Search } from 'lucide-react';
import SearchScreen from './SearchScreen';
import SnapshotTool from './SnapshotTool';
import { fetchGalaxyData } from '../../services/api';
import { mapGitHubDataToUniverse } from '../../services/dataMapping';

export default function Overlay({ data, onDataLoaded, onCloseSearch, userCount = 0, galaxyUsers = [] }) {
  const [snapshotPreview, setSnapshotPreview] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [topSearch, setTopSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTopSearch = async (e) => {
    e.preventDefault();
    if (!topSearch.trim() || isSearching) return;
    setIsSearching(true);
    setSearchFocused(false);
    try {
      const rawData = await fetchGalaxyData(topSearch, true);
      const mappedData = mapGitHubDataToUniverse(rawData);
      onDataLoaded(mappedData);
      setTopSearch('');
    } catch (err) {
      console.error('Top search error:', err);
      onDataLoaded(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleQuickSearch = async (username) => {
    setTopSearch(username);
    setSearchFocused(false);
    setIsSearching(true);
    try {
      const rawData = await fetchGalaxyData(username, true);
      const mappedData = mapGitHubDataToUniverse(rawData);
      onDataLoaded(mappedData);
      setTopSearch('');
    } catch (err) {
      onDataLoaded(null);
    } finally {
      setIsSearching(false);
    }
  };

  const recentUsers = galaxyUsers.slice(0, 3);

  return (
    <div style={{ width: '100%', height: '100%', pointerEvents: 'none' }}>

      {/* ── Top Navigation ── */}
      <AnimatePresence>
        {data && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="top-nav"
          >
            {/* Logo */}
            <div className="logo-text interactive-ui">GIT<b>GALAXY</b></div>

            {/* Centred search with dropdown */}
            <div ref={searchRef} className="top-nav-center interactive-ui" style={{ position: 'relative' }}>
              {/* Blur overlay behind dropdown */}
              <AnimatePresence>
                {searchFocused && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSearchFocused(false)}
                    style={{
                      position: 'fixed',
                      inset: 0,
                      background: 'rgba(5,7,10,0.5)',
                      backdropFilter: 'blur(8px)',
                      zIndex: 90,
                      pointerEvents: 'auto',
                    }}
                  />
                )}
              </AnimatePresence>

              <form onSubmit={handleTopSearch} style={{ width: '100%', position: 'relative', zIndex: 92 }}>
                <div style={{ position: 'relative', width: '100%' }}>
                  <Search
                    size={16}
                    style={{
                      position: 'absolute', left: '14px', top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-secondary)', opacity: 0.7, pointerEvents: 'none',
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Search users…"
                    className="search-input-top"
                    value={topSearch}
                    onChange={(e) => setTopSearch(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    disabled={isSearching}
                    style={{ width: '100%' }}
                  />
                </div>
              </form>

              {/* Recent users dropdown */}
              <AnimatePresence>
                {searchFocused && recentUsers.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="glass-panel"
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      left: 0, right: 0,
                      borderRadius: '16px',
                      overflow: 'hidden',
                      zIndex: 93,
                      pointerEvents: 'auto',
                      padding: '0.5rem',
                    }}
                  >
                    <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', padding: '4px 8px 6px', margin: 0 }}>
                      Recently searched
                    </p>
                    {recentUsers.map((user) => (
                      <button
                        key={user.username}
                        onClick={() => handleQuickSearch(user.username)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '10px',
                          width: '100%', padding: '8px 10px',
                          background: 'transparent', border: 'none',
                          borderRadius: '10px', cursor: 'pointer',
                          color: 'var(--text-primary)', fontSize: '0.9rem',
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <img
                          src={user.profile?.avatar_url}
                          alt={user.username}
                          style={{ width: '28px', height: '28px', borderRadius: '50%' }}
                        />
                        <span>{user.username}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Explorer count */}
            <div className="interactive-ui">
              <div
                className="glass-panel explorer-count"
                style={{
                  padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '8px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '100px',
                }}
              >
                <Users size={14} style={{ color: 'var(--accent)' }} />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {userCount.toLocaleString()}
                </span>
                <span className="explorer-label" style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Explorers
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Full-screen search (no data) ── */}
      <AnimatePresence>
        {!data && (
          <SearchScreen
            onDataLoaded={onDataLoaded}
            onClose={onCloseSearch}
            galaxyUsers={galaxyUsers}
          />
        )}
      </AnimatePresence>

      {/* ── Profile card (above footer) ── */}
      <AnimatePresence>
        {data && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="interactive-ui profile-card-wrapper"
          >
            <motion.div
              layout
              className="glass-panel profile-card-inner"
              transition={{ layout: { type: 'spring', stiffness: 300, damping: 30 } }}
            >
              {/* ── Compact header row ── */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <img
                  src={data.core.avatarUrl} alt="Avatar"
                  style={{ width: '38px', height: '38px', borderRadius: '50%', flexShrink: 0 }}
                  crossOrigin="anonymous"
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {data.core.username}
                  </div>
                  {/* streak + followers always visible */}
                  <div style={{ display: 'flex', gap: '10px', marginTop: '2px' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                      🔥 {data.core.stats?.contributionStreak || 0} streak
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                      👥 {data.core.followers?.toLocaleString()} followers
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  style={{
                    padding: '5px 11px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    display: 'flex', alignItems: 'center',
                    color: 'var(--accent)', fontSize: '0.72rem', gap: '4px', flexShrink: 0,
                  }}
                >
                  {isExpanded ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
                  {isExpanded ? 'Less' : 'More'}
                </button>
              </div>

              {/* ── Expanded section ── */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.9rem', marginTop: '0.9rem' }}>
                      {data.core.bio && (
                        <p style={{ fontSize: '0.82rem', marginBottom: '0.9rem', color: 'var(--text-primary)', lineHeight: '1.45', opacity: 0.82 }}>
                          {data.core.bio}
                        </p>
                      )}

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginBottom: '1rem' }}>
                        <div className="stat-pill">
                          <span>📦</span>
                          <span>{data.core.publicRepos} repos</span>
                        </div>
                        <div className="stat-pill">
                          <span>⭐</span>
                          <span>{(data.core.stats?.totalCommitsThisYear || 0).toLocaleString()} commits</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                          <button
                            onClick={() => onDataLoaded(null)}
                            className="action-button secondary"
                            style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center', fontSize: '0.82rem' }}
                          >
                            <RefreshCcw size={14} />
                            Find Another
                          </button>
                          <button
                            onClick={async () => {
                              const shareUrl = `${window.location.origin}${window.location.pathname}?user=${data.core.username}`;
                              if (navigator.share) {
                                try { await navigator.share({ title: 'Git Galaxy', url: shareUrl }); } catch (e) {}
                              } else {
                                navigator.clipboard.writeText(shareUrl);
                                alert('Link copied!');
                              }
                            }}
                            className="action-button primary"
                            style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center', fontSize: '0.82rem' }}
                          >
                            <Share2 size={14} />
                            Share
                          </button>
                        </div>
                      </div>

                      {data.core.location && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.8rem', opacity: 0.6 }}>
                          <MapPin size={11} />
                          <span>{data.core.location}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Snapshot button – desktop bottom-right ── */}
      <AnimatePresence>
        {data && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="interactive-ui snapshot-desktop"
          >
            <SnapshotTool username={data.core.username} onSnapshot={setSnapshotPreview} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Snapshot preview modal ── */}
      <AnimatePresence>
        {snapshotPreview && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="no-capture"
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(10px)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              zIndex: 9999, padding: '2rem', pointerEvents: 'auto',
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="glass-panel preview-container"
              style={{ maxWidth: '90%', maxHeight: '75%', overflow: 'hidden', padding: '4px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              <img src={snapshotPreview} alt="Snapshot Preview" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '4px' }} />
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
                className="action-button primary"
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Download size={18} /> Save Image
              </button>
              <button onClick={() => setSnapshotPreview(null)} className="action-button secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <X size={18} /> Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Footer ── */}
      <div
        className="no-capture site-footer"
        style={{
          position: 'absolute',
          bottom: 0, left: 0, width: '100%',
          textAlign: 'center',
          color: 'var(--text-secondary)',
          fontSize: '0.78rem',
          pointerEvents: 'auto',
          zIndex: 20,
          padding: '0.6rem',
        }}
      >
        developed by <a href="https://github.com/owsam22" target="_blank" rel="noopener noreferrer" className="footer-link">@owsam22</a>
      </div>
    </div>
  );
}
