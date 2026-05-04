import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { fetchUserData } from '../../services/github';
import { mapGitHubDataToUniverse } from '../../services/dataMapping';
import { Search, Loader2 } from 'lucide-react';

export default function SearchScreen({ onDataLoaded }) {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    setError('');

    try {
      const rawData = await fetchUserData(username);
      const mappedData = mapGitHubDataToUniverse(rawData);
      onDataLoaded(mappedData);
    } catch (err) {
      console.error("SearchScreen caught an error:", err);
      setError(`Error: ${err.message}`);
      setLoading(false);
    }
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
        background: 'var(--bg-color)',
        zIndex: 20
      }}
      className="interactive-ui"
    >
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 300, letterSpacing: '2px', marginBottom: '1rem' }}>
          GIT<span style={{ fontWeight: 700, color: 'var(--accent)' }}>GALAXY</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
          Your GitHub identity as a living universe
        </p>
      </div>

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div style={{ position: 'relative' }}>
          <Search size={20} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            placeholder="Enter GitHub Username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ paddingLeft: '40px', width: '300px' }}
            disabled={loading}
            autoFocus
          />
        </div>
        <button type="submit" disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {loading ? <Loader2 className="animate-spin" size={20} style={{ animation: 'spin 1s linear infinite' }} /> : 'Explore'}
        </button>
      </form>

      {error && <p style={{ color: '#ef4444', marginTop: '1rem' }}>{error}</p>}
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </motion.div>
  );
}
