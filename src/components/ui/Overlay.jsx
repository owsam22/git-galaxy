import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCcw } from 'lucide-react';
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
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                onClick={() => onDataLoaded(null)}
                className="glass-panel"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', flex: 1, justifyContent: 'center' }}
              >
                <RefreshCcw size={16} />
                Try Another user
              </button>
              
              <div style={{ flex: 1, display: 'flex' }}>
                <SnapshotTool username={data.core.username} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
