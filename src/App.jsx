import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import Universe from './components/canvas/Universe';
import Overlay from './components/ui/Overlay';
import RepoModal from './components/ui/RepoModal';
import { fetchAllGalaxyUsers, fetchGalaxyData, fetchUserCount, checkBackendStatus } from './services/api';
import { mapGitHubDataToUniverse } from './services/dataMapping';
import { demoData } from './services/demoData';

function App() {
  const { username: urlUsername } = useParams();           // /:username
  const [searchParams] = useSearchParams();
  const isEmbed = searchParams.get('embed') === 'true';   // /:username?embed=true
  const navigate = useNavigate();

  const [universeData, setUniverseData] = useState(demoData);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [galaxyUsers, setGalaxyUsers] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [viewingUser, setViewingUser] = useState('Git Galaxy');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isBackendLive, setIsBackendLive] = useState(false);

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

  // Load galaxy from URL param on mount (clean URL: /:username)
  useEffect(() => {
    const targetUser = urlUsername || 'owsam22';

    const loadInitial = async () => {
      try {
        const live = await checkBackendStatus();
        console.log(`[App] Initial backend status: ${live ? 'LIVE' : 'DOWN'}`);
        if (!live) throw new Error("Backend not live");

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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Poll for backend status if it's down
  useEffect(() => {
    if (isBackendLive) return;

    const poll = setInterval(async () => {
      const live = await checkBackendStatus();
      if (live) {
        console.log("[App] Backend detected live! Reloading data...");
        setIsBackendLive(true);
        const fallbackUser = urlUsername || 'owsam22';
        try {
          const rawData = await fetchGalaxyData(fallbackUser);
          const mappedData = mapGitHubDataToUniverse(rawData);
          setUniverseData(mappedData);
          setViewingUser(fallbackUser);

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
    }, 5000);

    return () => clearInterval(poll);
  }, [isBackendLive]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDataLoaded = (data) => {
    if (data) {
      setUniverseData(data);
      setViewingUser(data.core.username);
      setIsSearchOpen(false);
      setIsBackendLive(true);
      // Update URL to clean /:username (or /:username?embed=true)
      const embedSuffix = isEmbed ? '?embed=true' : '';
      navigate(`/${data.core.username}${embedSuffix}`, { replace: true });
      // Refresh background users list and count
      fetchAllGalaxyUsers().then(setGalaxyUsers);
      fetchUserCount().then(setUserCount);
    } else if (!isEmbed) {
      // Never open search screen in embed mode
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
      navigate(`/${username}`, { replace: true });
    } catch (err) {
      console.error("Failed to jump to star:", err);
    }
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
            isEmbed={isEmbed}
          />
        </Suspense>
      </div>

      <div className="overlay-container">
        {/* Show search screen only if not in embed mode */}
        {!isEmbed && (isSearchOpen || !universeData) && (
          <Overlay 
            data={null} 
            onDataLoaded={handleDataLoaded} 
            onCloseSearch={universeData ? () => setIsSearchOpen(false) : null}
            galaxyUsers={galaxyUsers} 
            userCount={userCount}
            isBackendLive={isBackendLive}
            isEmbed={false}
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
            isEmbed={isEmbed}
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
