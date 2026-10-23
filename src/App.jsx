import { useState, useEffect, Suspense } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import Universe from './components/canvas/Universe';
import Overlay from './components/ui/Overlay';
import RepoModal from './components/ui/RepoModal';
import SEO from './components/SEO';
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
  const [, setIsSearchOpen] = useState(false);
  const [isBackendLive, setIsBackendLive] = useState(false);
  const [userStatus, setUserStatus] = useState('idle');      // 'idle' | 'loaded' | 'offline' | 'not_found'

  const isFreeRoam = viewingUser === null;

  // SEO metadata calculation
  let seoTitle = 'Git Galaxy – Interactive 3D GitHub Profile Visualizer';
  let seoDescription = 'Explore GitHub repositories as planets in an interactive 3D universe. Discover developer profiles and visualize open-source projects with Git Galaxy by owsam22.';
  let seoPath = '/';
  let seoNoindex = isEmbed; // embed routes are always noindex

  if (urlUsername) {
    seoPath = `/${encodeURIComponent(urlUsername)}`;
    if (userStatus === 'not_found') {
      seoTitle = `Git Galaxy – User @${urlUsername} Not Found`;
      seoDescription = `The requested GitHub profile @${urlUsername} could not be found on Git Galaxy.`;
      seoNoindex = true;
    } else if (userStatus === 'offline') {
      seoTitle = `Git Galaxy – @${urlUsername}'s Galaxy (Offline Mode)`;
      seoDescription = `Exploring 3D galaxy visualization on Git Galaxy.`;
      seoNoindex = true; // demo fallback should not be indexed as the user's real profile
    } else {
      const displayName = viewingUser || urlUsername;
      seoTitle = `Git Galaxy – @${displayName}'s GitHub Repository Galaxy`;
      seoDescription = `Explore @${displayName}'s GitHub repositories in an interactive 3D galaxy with Git Galaxy.`;
      seoNoindex = isEmbed;
    }
  }

  // Load background users once backend is live
  useEffect(() => {
    if (!isBackendLive) return;
    const loadBg = async () => {
      try {
        const [users, count] = await Promise.all([fetchAllGalaxyUsers(), fetchUserCount()]);
        setGalaxyUsers(users);
        setUserCount(count);
      } catch (err) {
        console.warn('Background data load failed.', err);
      }
    };
    loadBg();
  }, [isBackendLive]);

  // Initial and route-change load — only fetch if URL has a username
  useEffect(() => {
    let isCancelled = false;

    const loadInitial = async () => {
      if (!urlUsername) {
        setUniverseData(null);
        setViewingUser(null);
        setUserStatus('idle');
        return;
      }

      // If already viewing this exact user, don't refetch
      if (viewingUser && viewingUser.toLowerCase() === urlUsername.toLowerCase() && universeData) {
        return;
      }

      try {
        const live = await checkBackendStatus();
        if (isCancelled) return;
        setIsBackendLive(live);

        if (!live) throw new Error('Backend not live');

        const rawData = await fetchGalaxyData(urlUsername);
        if (isCancelled) return;
        const mappedData = mapGitHubDataToUniverse(rawData);
        setUniverseData(mappedData);
        setViewingUser(urlUsername);
        setUserStatus('loaded');
      } catch (err) {
        if (isCancelled) return;
        console.warn('Galaxy load note:', err.message);

        const isNotFound = err.response?.status === 404 || err.message?.toLowerCase().includes('not found');
        if (isNotFound) {
          setUserStatus('not_found');
          setUniverseData(null);
          setViewingUser(null);
        } else {
          // Backend is waking up or offline: show demo solar system
          setIsBackendLive(false);
          setUserStatus('offline');
          setUniverseData(demoData);
          setViewingUser(urlUsername);
        }
      }
    };

    loadInitial();

    return () => {
      isCancelled = true;
    };
  }, [urlUsername]); // eslint-disable-line react-hooks/exhaustive-deps

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
            setUserStatus('loaded');
          }
        } catch (err) {
          console.error('Failed to load after backend came live:', err);
        }
      }
    }, 5000);
    return () => clearInterval(poll);
  }, [isBackendLive, urlUsername, viewingUser]);

  // Called when a user is loaded (from search or star click returning data)
  const handleDataLoaded = (data) => {
    if (data) {
      setUniverseData(data);
      setViewingUser(data.core.username);
      setUserStatus('loaded');
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
    setUserStatus('idle');
    navigate('/', { replace: true });
  };

  // Click a background star — fly to that user's galaxy
  const handleStarClick = async (username) => {
    if (!isBackendLive) {
      // Backend is offline: show demoData for this user so they see a solar system
      setUniverseData(demoData);
      setViewingUser(username);
      setUserStatus('offline');
      setSelectedRepo(null);
      return;
    }
    try {
      const rawData = await fetchGalaxyData(username);
      const mappedData = mapGitHubDataToUniverse(rawData);
      setUniverseData(mappedData);
      setViewingUser(username);
      setUserStatus('loaded');
      setSelectedRepo(null);
      navigate(`/${username}`, { replace: true });
    } catch (err) {
      console.error('Failed to jump to star:', err);
    }
  };

  return (
    <>
      <SEO
        title={seoTitle}
        description={seoDescription}
        path={seoPath}
        noindex={seoNoindex}
      />

      {userStatus === 'not_found' && !isEmbed && (
        <div style={{
          position: 'absolute',
          top: '76px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 95,
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.35)',
          borderRadius: '100px',
          padding: '8px 18px',
          color: '#fca5a5',
          fontSize: '0.82rem',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
        }}>
          <span>GitHub user <strong>@{urlUsername}</strong> could not be found.</span>
          <button
            onClick={handleGoFreeRoam}
            style={{
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '50px',
              color: '#fff',
              padding: '4px 12px',
              fontSize: '0.75rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            Explore Galaxy
          </button>
        </div>
      )}

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
