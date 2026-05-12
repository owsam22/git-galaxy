import React, { useState, useEffect } from 'react';
import Universe from './components/canvas/Universe';
import Overlay from './components/ui/Overlay';
import RepoModal from './components/ui/RepoModal';
import { fetchAllGalaxyUsers, fetchGalaxyData, fetchUserCount } from './services/api';
import { mapGitHubDataToUniverse } from './services/dataMapping';

function App() {
  const [universeData, setUniverseData] = useState(null);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [galaxyUsers, setGalaxyUsers] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [viewingUser, setViewingUser] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Load all users on mount for background stars
  useEffect(() => {
    const loadData = async () => {
      const [users, count] = await Promise.all([
        fetchAllGalaxyUsers(),
        fetchUserCount()
      ]);
      setGalaxyUsers(users);
      setUserCount(count);
    };
    loadData();
  }, []);

  // Load default background galaxy
  useEffect(() => {
    const loadDefault = async () => {
      try {
        const rawData = await fetchGalaxyData('owsam22');
        const mappedData = mapGitHubDataToUniverse(rawData);
        setUniverseData(mappedData);
        setViewingUser('owsam22');
        setIsSearchOpen(false); // Show galaxy immediately
      } catch (err) {
        console.error("Failed to load default galaxy:", err);
        setIsSearchOpen(true); // Open search if default fails
      }
    };
    loadDefault();
  }, []);

  const handleDataLoaded = (data) => {
    if (data) {
      setUniverseData(data);
      setViewingUser(data.core.username);
      setIsSearchOpen(false);
      // Refresh background users list and count
      fetchAllGalaxyUsers().then(setGalaxyUsers);
      fetchUserCount().then(setUserCount);
    } else {
      setIsSearchOpen(true);
    }
  };

  const handleStarClick = async (username) => {
    try {
      setViewingUser(username);
      const rawData = await fetchGalaxyData(username);
      const mappedData = mapGitHubDataToUniverse(rawData);
      setUniverseData(mappedData);
      setSelectedRepo(null);
    } catch (err) {
      console.error("Failed to jump to star:", err);
    }
  };

  const handleBackToOwn = () => {
    // For now "Own" is the last searched user that wasn't jumped to via star click
    // But since we don't have auth yet, let's just keep the current viewingUser
  };

  return (
    <>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0 }}>
        <Universe 
          data={universeData} 
          galaxyUsers={galaxyUsers}
          viewingUser={viewingUser}
          onStarClick={handleStarClick}
          onPlanetClick={setSelectedRepo} 
        />
      </div>

      <div className="overlay-container">
        {/* Show search screen if no data OR if user explicitly wants to search again */}
        {(isSearchOpen || !universeData) && (
          <Overlay 
            data={null} 
            onDataLoaded={handleDataLoaded} 
            onCloseSearch={universeData ? () => setIsSearchOpen(false) : null}
            galaxyUsers={galaxyUsers} 
            userCount={userCount}
          />
        )}

        {/* Show profile card only if we have data AND search is closed */}
        {universeData && !isSearchOpen && (
          <Overlay 
            data={universeData} 
            onDataLoaded={handleDataLoaded} 
            userCount={userCount}
            galaxyUsers={galaxyUsers}
          />
        )}

        {selectedRepo && (
          <RepoModal repo={selectedRepo} onClose={() => setSelectedRepo(null)} />
        )}
      </div>
    </>
  );
}

export default App;
