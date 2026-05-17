import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import Universe from './components/canvas/Universe';
import Overlay from './components/ui/Overlay';
import RepoModal from './components/ui/RepoModal';
import { fetchAllGalaxyUsers, fetchGalaxyData, fetchUserCount, checkBackendStatus } from './services/api';
import { mapGitHubDataToUniverse } from './services/dataMapping';
import { demoData } from './services/demoData';

function App() {
  const { username: urlUsername } = useParams();
  const [searchParams] = useSearchParams();
  const isEmbed = searchParams.get('embed') === 'true';
  const navigate = useNavigate();

  const [universeData, setUniverseData] = useState(null);   // null = free-roam
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [galaxyUsers, setGalaxyUsers] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [viewingUser, setViewingUser] = useState(null);      // null = free-roam
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isBackendLive, setIsBackendLive] = useState(false);

  const isFreeRoam = viewingUser === null;

  // Load background users once backend is live
  useEffect(() => {
    if (!isBackendLive) return;
    const loadBg = async () => {
      try {
        const [users, count] = await Promise.all([fetchAllGalaxyUsers(), fetchUserCount()]);
        setGalaxyUsers(users);
        setUserCount(count);
      } catch (err) {
        console.warn('Background data load failed.');
      }
    };
    loadBg();
  }, [isBackendLive]);

  // Initial load — only fetch if URL has a username
  useEffect(() => {
    const loadInitial = async () => {
      try {
        const live = await checkBackendStatus();
        setIsBackendLive(live);

        if (!urlUsername) return; // stay in free-roam

        if (!live) throw new Error('Backend not live');

        const rawData = await fetchGalaxyData(urlUsername);
        const mappedData = mapGitHubDataToUniverse(rawData);
        setUniverseData(mappedData);
        setViewingUser(urlUsername);
      } catch (err) {
        console.warn('Using demo mode:', err.message);
        setIsBackendLive(false);
        if (urlUsername) {
          // Show demo solar system for the requested user
          setUniverseData(demoData);
          setViewingUser(urlUsername);
        }
      }
    };
    loadInitial();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Poll for backend recovery
  useEffect(() => {
    if (isBackendLive) return;
    const poll = setInterval(async () => {
      const live = await checkBackendStatus();
      if (live) {
        setIsBackendLive(true);
        try {
          const [users, count] = await Promise.all([fetchAllGalaxyUsers(), fetchUserCount()]);
          setGalaxyUsers(users);
          setUserCount(count);
          // If we were showing demo data for a URL user, reload live data
          if (urlUsername && viewingUser) {
            const rawData = await fetchGalaxyData(urlUsername);
            const mappedData = mapGitHubDataToUniverse(rawData);
            setUniverseData(mappedData);
          }
        } catch (err) {
          console.error('Failed to load after backend came live:', err);
        }
      }
    }, 5000);
    return () => clearInterval(poll);
  }, [isBackendLive]); // eslint-disable-line react-hooks/exhaustive-deps

  // Called when a user is loaded (from search or star click returning data)
  const handleDataLoaded = (data) => {
    if (data) {
      setUniverseData(data);
      setViewingUser(data.core.username);
      setIsSearchOpen(false);
      setIsBackendLive(true);
      const embedSuffix = isEmbed ? '?embed=true' : '';
      navigate(`/${data.core.username}${embedSuffix}`, { replace: true });
      fetchAllGalaxyUsers().then(setGalaxyUsers);
      fetchUserCount().then(setUserCount);
    }
  };

  // Go back to free-roam (no user selected)
  const handleGoFreeRoam = () => {
    setUniverseData(null);
    setViewingUser(null);
    setSelectedRepo(null);
    navigate('/', { replace: true });
  };

  // Click a background star — fly to that user's galaxy
  const handleStarClick = async (username) => {
    if (!isBackendLive) {
      // Backend is offline: show demoData for this user so they see a solar system
      setUniverseData(demoData);
      setViewingUser(username);
      setSelectedRepo(null);
      return;
    }
    try {
      const rawData = await fetchGalaxyData(username);
      const mappedData = mapGitHubDataToUniverse(rawData);
      setUniverseData(mappedData);
      setViewingUser(username);
      setSelectedRepo(null);
      navigate(`/${username}`, { replace: true });
    } catch (err) {
      console.error('Failed to jump to star:', err);
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
            isFreeRoam={isFreeRoam}
            isBackendLive={isBackendLive}
            onStarClick={handleStarClick}
            onPlanetClick={setSelectedRepo}
            isEmbed={isEmbed}
          />
        </Suspense>
      </div>

      <div className="overlay-container">
        <Overlay
          data={universeData}
          onDataLoaded={handleDataLoaded}
          onGoFreeRoam={handleGoFreeRoam}
          onCloseSearch={universeData ? () => setIsSearchOpen(false) : null}
          galaxyUsers={galaxyUsers}
          userCount={userCount}
          isBackendLive={isBackendLive}
          isEmbed={isEmbed}
          isFreeRoam={isFreeRoam}
        />

        {selectedRepo && (
          <RepoModal repo={selectedRepo} onClose={() => setSelectedRepo(null)} />
        )}
      </div>
    </>
  );
}

export default App;
