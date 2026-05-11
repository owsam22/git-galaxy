// Maps raw backend data to visual properties
export const mapGitHubDataToUniverse = (data) => {
  const { profile, repos, events, stats } = data;

  // Core Star (User)
  const coreBrightness = Math.min(1 + (stats.todayCommits / 10), 3); // Scale based on today's activity
  const pulseSpeed = Math.min(0.5 + (stats.todayCommits / 5), 2.5);

  const contributedRepoMap = new Map();
  events.forEach(event => {
    if (event.repo && event.type !== 'WatchEvent') {
      const repoId = event.repo.id;
      if (!repos.find(r => r.id === repoId) && !contributedRepoMap.has(repoId)) {
        contributedRepoMap.set(repoId, {
          id: repoId,
          name: event.repo.name,
          description: 'Contributed Repository',
          url: `https://github.com/${event.repo.name}`,
          stargazers_count: 50,
          forks_count: 0,
          language: 'Text',
          pushed_at: event.created_at,
          isContributed: true
        });
      }
    }
  });

  const allRepos = [...repos, ...Array.from(contributedRepoMap.values())];

  // Planets (Repositories)
  const planets = allRepos.map((repo, index) => {
    const daysSincePush = (new Date() - new Date(repo.pushed_at)) / (1000 * 60 * 60 * 24);
    
    const repoEvents = events.filter(e => e.repo?.id === repo.id && e.type === 'PushEvent');
    const repoCommits = repoEvents.reduce((acc, e) => acc + (e.payload?.commits?.length || 0), 0);
    
    const baseSize = 0.25;
    const starWeight = Math.min((repo.stargazers_count || 0) * 0.04, 0.8);
    const forkWeight = Math.min((repo.forks_count || 0) * 0.08, 0.5);
    const calculatedSize = repo.isContributed ? 0.6 : baseSize + starWeight + forkWeight;

    return {
      id: repo.id,
      name: repo.name,
      description: repo.description,
      url: repo.html_url || repo.url,
      stars: repo.stargazers_count || 0,
      forks: repo.forks_count || 0,
      language: repo.language,
      size: Math.min(calculatedSize, 2.0),
      distance: 5 + index * 1.2 + (daysSincePush * 0.005), // Increased distance for clarity
      isActive: daysSincePush < 90,
      heat: Math.min(repoCommits / 5, 2),
      lastPush: repo.pushed_at,
      isContributed: !!repo.isContributed,
      inclination: (Math.random() - 0.5) * 0.4, // Tilt orbits slightly
      orbitRotation: Math.random() * Math.PI * 2 // Randomize starting orientation
    };
  });

  return {
    core: {
      username: profile.login,
      avatarUrl: profile.avatar_url,
      stats: {
        ...stats,
        totalStars: stats.totalStars,
        contributionStreak: stats.contributionStreak
      },
      brightness: Math.min(1 + (stats.todayCommits / 5) + (stats.totalStars / 1000), 4),
      pulseSpeed: pulseSpeed,
      followers: profile.followers,
      following: profile.following,
      publicRepos: profile.public_repos,
      bio: profile.bio,
      location: profile.location,
      company: profile.company,
      blog: profile.blog,
      twitter: profile.twitter_username,
      createdAt: profile.created_at,
      stats // Pass through enriched stats
    },
    planets,
    todayCommits: stats.todayCommits
  };
};

// Maps other users to background stars
export const mapUserToBackgroundStar = (user) => {
  const { username, profile, stats } = user;
  
  // Deterministic position based on username hash
  const hash = Array.from(username).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const phi = (hash % 100) / 100 * Math.PI * 2;
  const theta = ((hash * 7) % 100) / 100 * Math.PI;
  const radius = 60 + (hash % 40); // Between 60 and 100 units away
  
  const x = radius * Math.sin(theta) * Math.cos(phi);
  const y = radius * Math.sin(theta) * Math.sin(phi);
  const z = radius * Math.cos(theta);

  // Shininess based on stars, commits, followers
  const totalWeight = (stats.totalStars || 0) + (stats.totalCommitsThisYear || 0) + (user.profile?.followers || 0);
  const shininess = Math.min(Math.log10(totalWeight + 1) / 5, 1); // 0 to 1

  return {
    username,
    avatarUrl: profile?.avatar_url,
    position: [x, y, z],
    size: 0.4 + shininess * 1.5,
    shininess,
    stats
  };
};
