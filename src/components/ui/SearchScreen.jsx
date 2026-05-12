import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchGalaxyData } from '../../services/api';
import { mapGitHubDataToUniverse } from '../../services/dataMapping';
import { Search, Loader2, History, ArrowLeft } from 'lucide-react';

export default function SearchScreen({ onDataLoaded, onClose, galaxyUsers = [], isBackendLive = true }) {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const performSearch = async (targetUsername) => {
    if (!targetUsername.trim()) return;

    setLoading(true);
    setError('');

    try {
      const rawData = await fetchGalaxyData(targetUsername, true);
      const mappedData = mapGitHubDataToUniverse(rawData);
      onDataLoaded(mappedData);
    } catch (err) {
      console.error("SearchScreen caught an error:", err);
      setError(`Error: ${err.message || 'User not found or API limit reached'}`);
      setLoading(false);
    }
  };


  const handleSearch = async (e) => {
    e.preventDefault();
    performSearch(username);
  };

  return (
    <motion.div 
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(5, 7, 10, 0.4)',
        backdropFilter: 'blur(12px)',
        zIndex: 20
      }}
      className="interactive-ui"
    >
      {onClose && (
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '2rem',
            left: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            padding: '8px 16px',
            borderRadius: '100px',
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
            cursor: 'pointer'
          }}
          whileHover={{ background: 'rgba(255,255,255,0.1)', color: 'var(--text-primary)' }}
        >
          <ArrowLeft size={16} />
          Back
        </motion.button>
      )}

      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 300, letterSpacing: '4px', marginBottom: '1rem', textShadow: '0 0 30px rgba(56, 189, 248, 0.3)' }}>
          GIT<span style={{ fontWeight: 700, color: 'var(--accent)' }}>GALAXY</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', letterSpacing: '1px' }}>
          Your GitHub identity as a living universe
        </p>
      </div>

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div style={{ position: 'relative' }}>
          <Search size={20} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            placeholder={isBackendLive ? "Enter GitHub Username" : "Backend Offline"} 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ paddingLeft: '40px', width: '300px', opacity: isBackendLive ? 1 : 0.6 }}
            disabled={loading || !isBackendLive}
            autoFocus
          />
        </div>
        <button type="submit" disabled={loading || !isBackendLive} style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: isBackendLive ? 1 : 0.5 }}>
          {loading ? <Loader2 className="animate-spin" size={20} style={{ animation: 'spin 1s linear infinite' }} /> : (isBackendLive ? 'Explore' : 'Offline')}
        </button>
      </form>

      {galaxyUsers.length > 0 && (
        <div style={{ marginTop: '3rem', width: '100%', maxWidth: '600px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '1rem', justifyContent: 'center' }}>
            <History size={14} />
            <span>RECENTLY SEARCHED</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
            {galaxyUsers.slice(0, 8).map(user => (
              <button
                key={user.username}
                onClick={() => {
                  setUsername(user.username);
                  performSearch(user.username);
                }}
                className="glass-panel"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 12px',
                  fontSize: '0.85rem',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}
              >
                <img src={user.profile.avatar_url} alt="" style={{ width: '20px', height: '20px', borderRadius: '50%' }} />
                {user.username}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ 
            color: '#ef4444', 
            marginTop: '1.5rem', 
            background: 'rgba(239, 68, 68, 0.1)', 
            padding: '10px 20px', 
            borderRadius: '8px',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            fontSize: '0.9rem'
          }}
        >
          {error.includes('404') ? 'User not found. Please check the spelling.' : error}
        </motion.div>
      )}
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </motion.div>
  );
}
