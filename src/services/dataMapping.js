// Maps raw GitHub data to visual properties
export const mapGitHubDataToUniverse = (data) => {
  const { profile, repos, events } = data;

  // Core Star (User)
  // Approximate total commits by recent activity for the visualization
  const pushEvents = events.filter(e => e.type === 'PushEvent');
  const recentCommits = pushEvents.reduce((acc, event) => {
    const commits = event.payload?.commits || [];
    return acc + commits.length;
  }, 0);
  
  const coreBrightness = Math.min(1 + (recentCommits / 50), 3); // Scale 1 to 3
  const pulseSpeed = Math.min(0.5 + (pushEvents.length / 20), 2);

  const contributedRepoMap = new Map();
  events.forEach(event => {
    if (event.repo && event.type !== 'WatchEvent') { // Ignore just starring repos
      const repoId = event.repo.id;
      if (!repos.find(r => r.id === repoId) && !contributedRepoMap.has(repoId)) {
        contributedRepoMap.set(repoId, {
          id: repoId,
          name: event.repo.name,
          description: 'Contributed Repository (via Recent Activity)',
          url: `https://github.com/${event.repo.name}`,
          stargazers_count: 50, // Approximation for size
          forks_count: 0,
          language: 'Unknown',
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
    
    // Calculate recent commits for this specific repo from events
    const repoEvents = events.filter(e => e.repo?.id === repo.id && e.type === 'PushEvent');
    const repoCommits = repoEvents.reduce((acc, e) => acc + (e.payload?.commits?.length || 0), 0);
    
    // Size based on stars AND forks
    const baseSize = 0.25;
    const starWeight = Math.min(repo.stargazers_count * 0.04, 0.8);
    const forkWeight = Math.min(repo.forks_count * 0.08, 0.5);
    const calculatedSize = repo.isContributed ? 0.6 : baseSize + starWeight + forkWeight;

    return {
      id: repo.id,
      name: repo.name,
      description: repo.description,
      url: repo.html_url || repo.url,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language,
      size: Math.min(calculatedSize, 2.0),
      distance: 3 + index * 0.8 + (daysSincePush * 0.005),
      isActive: daysSincePush < 90,
      heat: Math.min(repoCommits / 5, 2), // Activity heat based on recent commits
      lastPush: repo.pushed_at,
      isContributed: !!repo.isContributed
    };
  });

  return {
    core: {
      username: profile.login,
      avatarUrl: profile.avatar_url,
      brightness: coreBrightness,
      pulseSpeed: pulseSpeed,
      followers: profile.followers,
      following: profile.following,
      publicRepos: profile.public_repos,
      bio: profile.bio,
      location: profile.location,
      company: profile.company,
      blog: profile.blog,
      twitter: profile.twitter_username,
      createdAt: profile.created_at
    },
    planets,
    recentCommits
  };
};
