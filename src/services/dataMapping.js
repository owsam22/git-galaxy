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

  // Planets (Repositories)
  const planets = repos.map((repo, index) => {
    const daysSincePush = (new Date() - new Date(repo.pushed_at)) / (1000 * 60 * 60 * 24);
    
    return {
      id: repo.id,
      name: repo.name,
      description: repo.description,
      url: repo.html_url,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language,
      size: Math.max(0.2, Math.min(0.2 + repo.stargazers_count * 0.05, 1.5)), // Scale 0.2 to 1.5
      distance: 3 + index * 0.8 + (daysSincePush * 0.005), // More recent = closer
      isActive: daysSincePush < 90, // Active in last 90 days
      lastPush: repo.pushed_at
    };
  });

  return {
    core: {
      username: profile.login,
      avatarUrl: profile.avatar_url,
      brightness: coreBrightness,
      pulseSpeed: pulseSpeed,
      followers: profile.followers,
      publicRepos: profile.public_repos
    },
    planets,
    recentCommits
  };
};
