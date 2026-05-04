import React, { useState } from 'react';
import Universe from './components/canvas/Universe';
import Overlay from './components/ui/Overlay';
import RepoCard from './components/ui/RepoCard';

function App() {
  const [universeData, setUniverseData] = useState(null);
  const [selectedRepo, setSelectedRepo] = useState(null);

  const handleDataLoaded = (data) => {
    setUniverseData(data);
    setSelectedRepo(null);
  };

  const handlePlanetClick = (repoData) => {
    setSelectedRepo(repoData);
  };

  return (
    <>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0 }}>
        <Universe data={universeData} onPlanetClick={handlePlanetClick} />
      </div>
      <div className="overlay-container">
        <Overlay data={universeData} onDataLoaded={handleDataLoaded} />
        {selectedRepo && (
          <RepoCard repo={selectedRepo} onClose={() => setSelectedRepo(null)} />
        )}
      </div>
    </>
  );
}

export default App;
