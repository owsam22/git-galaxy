import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, ChevronUp, MapPin, Users, Search, ExternalLink, Loader2, Telescope, Volume2, VolumeX } from 'lucide-react';
import ShareModal from './ShareModal';
import Footer from './Footer';
import { fetchGalaxyData } from '../../services/api';
import { mapGitHubDataToUniverse } from '../../services/dataMapping';
import backgroundMusic from '../../assets/music/snowfall.mp3';

export default function Overlay({
  data,
  onDataLoaded,
  onGoFreeRoam,
  onCloseSearch,
  userCount = 0,
  galaxyUsers = [],
  isBackendLive = true,
  isEmbed = false,
  isFreeRoam = true,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [topSearch, setTopSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const searchRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const hasInteractedRef = useRef(false);

  useEffect(() => {
    const audio = new Audio(backgroundMusic);
    audio.loop = true;
    audio.volume = 0.3;
    audioRef.current = audio;

    const tryPlay = () => {
      if (hasInteractedRef.current) return;

      const playAttempt = audio.play();
      if (playAttempt !== undefined) {
        playAttempt.then(() => {
          setIsPlaying(true);
          hasInteractedRef.current = true;
          document.removeEventListener('click', tryPlay);
          document.removeEventListener('keydown', tryPlay);
        }).catch(() => {
          setIsPlaying(false);
        });
      }
    };

    tryPlay();
    document.addEventListener('click', tryPlay);
    document.addEventListener('keydown', tryPlay);

    return () => {
      document.removeEventListener('click', tryPlay);
      document.removeEventListener('keydown', tryPlay);
      audio.pause();
      audio.src = '';
    };
  }, []);

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
    setSearchError(null);
    setSearchFocused(false);
    try {
      const rawData = await fetchGalaxyData(topSearch, true);
      const mappedData = mapGitHubDataToUniverse(rawData);
      onDataLoaded(mappedData);
      setTopSearch('');
    } catch (err) {
      setSearchError(err.message?.includes('timeout') ? 'Timeout: GitHub is slow today' : 'User not found');
      setTimeout(() => setSearchError(null), 3000);
    } finally {
      setIsSearching(false);
    }
  };

  const handleQuickSearch = async (username) => {
    setTopSearch(username);
    setSearchError(null);
    setSearchFocused(false);
    setIsSearching(true);
    try {
      const rawData = await fetchGalaxyData(username, true);
      const mappedData = mapGitHubDataToUniverse(rawData);
      onDataLoaded(mappedData);
      setTopSearch('');
    } catch (err) {
      setSearchError('Search failed');
      setTimeout(() => setSearchError(null), 3000);
    } finally {
      setIsSearching(false);
    }
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      hasInteractedRef.current = true;
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(console.error);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const recentUsers = galaxyUsers.slice(0, 3);

  return (
    <div style={{ width: '100%', height: '100%', pointerEvents: 'none' }}>

      {/* ── Top Navigation — always visible (hidden in embed) ── */}
      {!isEmbed && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="top-nav"
        >
          {/* Logo */}
          <div
            className="logo-text interactive-ui"
            onClick={onGoFreeRoam}
            style={{ cursor: 'pointer' }}
            title="Back to galaxy view"
          >
            GIT<b>GALAXY</b>
          </div>

          {/* Search bar */}
          <div ref={searchRef} className="top-nav-center interactive-ui" style={{ position: 'relative' }}>
            <AnimatePresence>
              {searchFocused && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSearchFocused(false)}
                  style={{
                    position: 'fixed', inset: 0,
                    background: 'rgba(5,7,10,0.5)',
                    backdropFilter: 'blur(8px)',
                    zIndex: 90, pointerEvents: 'auto',
                  }}
                />
              )}
            </AnimatePresence>

            <form onSubmit={handleTopSearch} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', position: 'relative', zIndex: 92 }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', opacity: 0.7, pointerEvents: 'none' }} />
                <input
                  type="text"
                  placeholder={isBackendLive ? 'Search any GitHub user…' : 'Backend waking up — explore the galaxy'}
                  className="search-input-top"
                  value={topSearch}
                  onChange={(e) => setTopSearch(e.target.value)}
                  onFocus={() => isBackendLive && setSearchFocused(true)}
                  disabled={isSearching || !isBackendLive}
                  style={{
                    width: '100%',
                    opacity: isBackendLive ? 1 : 0.5,
                    border: searchError ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)',
                  }}
                />
                {searchError && (
                  <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: '12px', color: '#ef4444', fontSize: '0.7rem', fontWeight: 500, pointerEvents: 'none' }}>
                    {searchError}
                  </div>
                )}
              </div>
              {isSearching && (
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} style={{ flexShrink: 0 }}>
                  <Loader2 size={18} className="animate-spin" style={{ color: 'var(--accent)' }} />
                </motion.div>
              )}
              {/* ── Music Controls (Mobile) ── */}
              <button
                type="button"
                onClick={toggleMusic}
                className={`glass-panel neon-music-btn music-mobile ${isPlaying ? 'playing' : ''}`}
                title={isPlaying ? "Mute Music" : "Play Music"}
                style={{ flexShrink: 0, padding: '10px' }}
              >
                {isPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </button>
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
                  style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0, borderRadius: '16px', overflow: 'hidden', zIndex: 93, pointerEvents: 'auto', padding: '0.5rem' }}
                >
                  <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', padding: '4px 8px 6px', margin: 0 }}>
                    Recently searched
                  </p>
                  {recentUsers.map((user) => (
                    <button
                      key={user.username}
                      onClick={() => handleQuickSearch(user.username)}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '8px 10px', background: 'transparent', border: 'none', borderRadius: '10px', cursor: 'pointer', color: 'var(--text-primary)', fontSize: '0.9rem', transition: 'background 0.15s' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <img src={user.profile?.avatar_url} alt={user.username} style={{ width: '28px', height: '28px', borderRadius: '50%' }} />
                      <span>{user.username}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Explorer count */}
          <div className="interactive-ui">
            <div className="glass-panel explorer-count" style={{ padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '100px' }}>
              <Users size={14} style={{ color: 'var(--accent)' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{userCount.toLocaleString()}</span>
              <span className="explorer-label" style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Explorers</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Free-Roam welcome hint (only shown when no user selected and not in embed) ── */}
      <AnimatePresence>
        {isFreeRoam && !isEmbed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="interactive-ui"
            style={{
              position: 'absolute',
              bottom: '2.4rem',
              right: '2rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: '10px',
              pointerEvents: 'none',
            }}
          >
            <div className="glass-panel" style={{
              marginRight: '50px',
              padding: '10px 25px',
              borderRadius: '100px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '0.78rem',
              color: 'var(--text-secondary)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}>
              <Telescope size={14} style={{ color: 'var(--accent)', flexShrink: 0 }} />
              <span>Drag to rotate · Scroll to zoom · <strong style={{ color: 'var(--text-primary)' }}>Click a star</strong> to explore their galaxy</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Demo mode badge (when backend is offline) ── */}
      <AnimatePresence>
        {!isBackendLive && !isEmbed && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="interactive-ui"
            style={{ position: 'absolute', top: '80px', left: '16px' }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              padding: '6px 12px',
              background: 'rgba(251, 191, 36, 0.08)',
              border: '1px solid rgba(251, 191, 36, 0.25)',
              borderRadius: '100px',
              fontSize: '0.7rem',
              color: '#fbbf24',
              backdropFilter: 'blur(8px)',
            }}>
              <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#fbbf24', animation: 'pulse 2s infinite' }} />
              Backend awakening…
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Profile card (focused mode) ── */}
      <AnimatePresence>
        {data && !isFreeRoam && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="interactive-ui profile-card-wrapper"
          >
            <motion.div layout className="glass-panel profile-card-inner" transition={{ layout: { type: 'spring', stiffness: 300, damping: 30 } }}>
              {/* Compact header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <img src={data.core.avatarUrl} alt="Avatar" style={{ width: '38px', height: '38px', borderRadius: '50%', flexShrink: 0 }} crossOrigin="anonymous" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {data.core.username}
                  </div>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '2px' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>🔥 {data.core.stats?.contributionStreak || 0} streak</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>👥 {data.core.followers?.toLocaleString()} followers</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  style={{ padding: '5px 11px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', color: 'var(--accent)', fontSize: '0.72rem', gap: '4px', flexShrink: 0 }}
                >
                  {isExpanded ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
                  {isExpanded ? 'Less' : 'More'}
                </button>
              </div>

              {/* Expanded section */}
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
                        <div className="stat-pill"><span>📦</span><span>{data.core.publicRepos} repos</span></div>
                        <div className="stat-pill"><span>⭐</span><span>{(data.core.stats?.totalCommitsThisYear || 0).toLocaleString()} commits</span></div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: isEmbed ? '1fr' : '1fr 1fr', gap: '0.5rem' }}>
                          {!isEmbed && (
                            <button
                              onClick={onGoFreeRoam}
                              className="action-button secondary"
                              style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center', fontSize: '0.82rem' }}
                            >
                              <Telescope size={14} />
                              Explore Galaxy
                            </button>
                          )}
                          {!isEmbed && (
                            <button
                              onClick={() => setShareModalOpen(true)}
                              className="action-button primary"
                              style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center', fontSize: '0.82rem' }}
                            >
                              Share
                            </button>
                          )}
                          {isEmbed && (
                            <a
                              href={`${window.location.origin}/${data.core.username}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="action-button primary"
                              style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center', fontSize: '0.82rem', textDecoration: 'none' }}
                            >
                              <ExternalLink size={14} />
                              Open GitGalaxy
                            </a>
                          )}
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

      {/* ── Music Controls (Desktop) ── */}
      <div
        className="interactive-ui music-desktop"
        style={{
          position: 'absolute',
          bottom: '2.4rem',
          right: '2rem',
          pointerEvents: 'auto',
          zIndex: 100,
        }}
      >
        <button
          onClick={toggleMusic}
          className={`glass-panel neon-music-btn ${isPlaying ? 'playing' : ''}`}
          title={isPlaying ? "Mute Music" : "Play Music"}
          style={{ padding: '10px' }}
        >
          {isPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>
      </div>

      {/* ── Share Modal ── */}
      <AnimatePresence>
        {shareModalOpen && data && (
          <ShareModal username={data.core.username} onClose={() => setShareModalOpen(false)} />
        )}
      </AnimatePresence>

      {/* ── Footer ── */}
      <Footer isEmbed={isEmbed} data={data} />
    </div>
  );
}
