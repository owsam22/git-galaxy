export const mockData = {
  profile: {
    login: 'RateLimitedGenius',
    avatar_url: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
    followers: 999,
    public_repos: 42
  },
  repos: Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    name: `awesome-project-${i}`,
    description: 'This is an awesome project generated because of rate limits.',
    html_url: 'https://github.com',
    stargazers_count: Math.floor(Math.random() * 500),
    forks_count: Math.floor(Math.random() * 50),
    language: ['JavaScript', 'TypeScript', 'Python', 'Rust', 'Go', 'HTML', 'CSS'][Math.floor(Math.random() * 7)],
    pushed_at: new Date(Date.now() - Math.random() * 10000000000).toISOString()
  })),
  events: Array.from({ length: 50 }).map(() => ({
    type: 'PushEvent',
    payload: { commits: [1, 2, 3] }
  }))
};
