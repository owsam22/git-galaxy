import React, { useState, useEffect, Suspense } from 'react';
import Universe from './components/canvas/Universe';
import Overlay from './components/ui/Overlay';
import RepoModal from './components/ui/RepoModal';
import { fetchAllGalaxyUsers, fetchGalaxyData, fetchUserCount, checkBackendStatus } from './services/api';
import { mapGitHubDataToUniverse } from './services/dataMapping';
import { demoData } from './services/demoData';

function App() {
  const [universeData, setUniverseData] = useState(demoData);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [galaxyUsers, setGalaxyUsers] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [viewingUser, setViewingUser] = useState('Git Galaxy');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isBackendLive, setIsBackendLive] = useState(false); // Start as false to show Demo Mode immediately

  // Load background data only when backend is live
  useEffect(() => {
    if (!isBackendLive) return;

    const loadData = async () => {
      try {
        const [users, count] = await Promise.all([
          fetchAllGalaxyUsers(),
          fetchUserCount()
        ]);
        setGalaxyUsers(users);
        setUserCount(count);
      } catch (err) {
        console.warn("Background data load failed.");
      }
    };
    loadData();
  }, [isBackendLive]);

  // Load default background galaxy or user from URL
  useEffect(() => {
    const loadInitial = async () => {
      // Small delay to allow demo to be seen
      const params = new URLSearchParams(window.location.search);
      const userParam = params.get('user');
      const targetUser = userParam || 'owsam22';

      try {
        const live = await checkBackendStatus();
        console.log(`[App] Initial backend status: ${live ? 'LIVE' : 'DOWN'}`);
        if (!live) {
          throw new Error("Backend not live");
        }

        const rawData = await fetchGalaxyData(targetUser);
        const mappedData = mapGitHubDataToUniverse(rawData);
        setUniverseData(mappedData);
        setViewingUser(targetUser);
        setIsBackendLive(true);
      } catch (err) {
        console.warn("Using demo mode:", err.message);
        setIsBackendLive(false);
      }
    };
    loadInitial();
  }, []);

  // Poll for backend status if it's down
  useEffect(() => {
    if (isBackendLive) return;

    const poll = setInterval(async () => {
      const live = await checkBackendStatus();
      if (live) {
        console.log("[App] Backend detected live! Reloading data...");
        setIsBackendLive(true);
        // Refresh data
        try {
          const rawData = await fetchGalaxyData('owsam22');
          const mappedData = mapGitHubDataToUniverse(rawData);
          setUniverseData(mappedData);
          setViewingUser('owsam22');
          
          // Also refresh users and count
          const [users, count] = await Promise.all([
            fetchAllGalaxyUsers(),
            fetchUserCount()
          ]);
          setGalaxyUsers(users);
          setUserCount(count);
        } catch (err) {
          console.error("Failed to load data after backend came live:", err);
        }
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(poll);
  }, [isBackendLive]);

  const handleDataLoaded = (data) => {
    if (data) {
      setUniverseData(data);
      setViewingUser(data.core.username);
      setIsSearchOpen(false);
      setIsBackendLive(true);
      // Refresh background users list and count
      fetchAllGalaxyUsers().then(setGalaxyUsers);
      fetchUserCount().then(setUserCount);
    } else {
      // If data is null (failed search), only open search if we are NOT in demo mode
      // or if the user explicitly closed the current view
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
        <Suspense fallback={<div style={{ color: 'white', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>Loading Galaxy...</div>}>
          <Universe 
            data={universeData} 
            galaxyUsers={galaxyUsers}
            viewingUser={viewingUser}
            onStarClick={handleStarClick}
            onPlanetClick={setSelectedRepo} 
          />
        </Suspense>
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
            isBackendLive={isBackendLive}
          />
        )}

        {/* Show profile card only if we have data AND search is closed */}
        {universeData && !isSearchOpen && (
          <Overlay 
            data={universeData} 
            onDataLoaded={handleDataLoaded} 
            userCount={userCount}
            galaxyUsers={galaxyUsers}
            isBackendLive={isBackendLive}
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
