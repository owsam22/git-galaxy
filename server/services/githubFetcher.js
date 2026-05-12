const axios = require('axios');

const GITHUB_REST_BASE = 'https://api.github.com';
const GITHUB_GRAPHQL_BASE = 'https://api.github.com/graphql';

const getHeaders = () => {
  const headers = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'Git-Galaxy-Server'
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `token ${process.env.GITHUB_TOKEN}`;
  } else {
    console.warn('[Backend] ⚠️ No GITHUB_TOKEN provided. Rate limits will be restricted (60 req/hr).');
  }
  return headers;
};

const fetchGraphQL = async (query, variables) => {
  if (!process.env.GITHUB_TOKEN) return null;
  try {
    const response = await axios.post(
      GITHUB_GRAPHQL_BASE,
      { query, variables },
      { headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` } }
    );
    return response.data.data;
  } catch (error) {
    console.error('GraphQL Fetch Error:', error.response?.data || error.message);
    return null;
  }
};

const fetchUserDataFromGitHub = async (username) => {
  const headers = getHeaders();
  console.log(`[Backend] Fetching data for user: ${username}`);

  try {
    const [profileRes, reposRes, eventsRes] = await Promise.all([
      axios.get(`${GITHUB_REST_BASE}/users/${username}`, { headers }),
      axios.get(`${GITHUB_REST_BASE}/users/${username}/repos?per_page=100&sort=pushed`, { headers }),
      axios.get(`${GITHUB_REST_BASE}/users/${username}/events/public?per_page=100`, { headers })
    ]);

    const profile = profileRes.data;
    const repos = reposRes.data;
    const events = eventsRes.data;

    console.log(`[Backend] Successfully fetched profile and ${repos.length} repos for ${username}`);

    // Compute basic stats from REST data
    const totalStars = repos.reduce((acc, repo) => acc + (repo.stargazers_count || 0), 0);
    const totalForks = repos.reduce((acc, repo) => acc + (repo.forks_count || 0), 0);

    // Today's commits (last 24 hours)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const todayCommits = events
      .filter(event => event.type === 'PushEvent' && new Date(event.created_at) > twentyFourHoursAgo)
      .reduce((acc, event) => acc + (event.payload?.commits?.length || 0), 0);

    // Estimate streak from public events if no token
    let contributionStreak = 0;
    if (!process.env.GITHUB_TOKEN) {
      const dailyActivity = {};
      events.forEach(event => {
        const day = event.created_at.split('T')[0];
        dailyActivity[day] = (dailyActivity[day] || 0) + 1;
      });
      
      const sortedDays = Object.keys(dailyActivity).sort().reverse();
      for (const day of sortedDays) {
        if (dailyActivity[day] > 0) contributionStreak++;
        else break;
      }
    }

    // Top Languages
    const langMap = {};
    repos.forEach(repo => {
      if (repo.language) {
        langMap[repo.language] = (langMap[repo.language] || 0) + 1;
      }
    });
    const totalReposWithLang = Object.values(langMap).reduce((a, b) => a + b, 0);
    const topLanguages = Object.entries(langMap)
      .map(([name, count]) => ({ name, percentage: Math.round((count / totalReposWithLang) * 100) }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 5);

    let contributionStats = {
      totalCommitsThisYear: 0,
      contributionStreak: 0,
      todayCommits: 0
    };

    // Enhanced Streak/Contribution fetching (No-token fallback)
    if (!process.env.GITHUB_TOKEN) {
      console.log(`[Backend] Fetching contribution calendar from profile for ${username}...`);
      try {
        const calendarRes = await axios.get(`https://github.com/users/${username}/contributions`, {
          headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        const html = calendarRes.data;
        
        // Match both old (data-count) and new (data-level/tooltips) GitHub calendar formats
        // GitHub recently changed their calendar, so we look for both patterns
        const dateCountRegex = /data-date="(\d{4}-\d{2}-\d{2})".*?data-count="(\d+)"/g;
        const toolTipRegex = /"(\d+) contributions on (.*?)"/g;
        
        const dailyContributions = [];
        let match;
        
        // Try standard data-count first (older/standard format)
        while ((match = dateCountRegex.exec(html)) !== null) {
          dailyContributions.push({ date: match[1], count: parseInt(match[2]) });
        }
        
        // If that fails, try parsing from the tooltips/new format
        if (dailyContributions.length === 0) {
          const newFormatRegex = /<td.*?data-date="([\d-]+)".*?>(?:.*?<\/td>)/gs;
          const countRegex = /data-count="(\d+)"/;
          
          let tdMatch;
          while ((tdMatch = newFormatRegex.exec(html)) !== null) {
            const countMatch = tdMatch[0].match(countRegex);
            if (countMatch) {
              dailyContributions.push({ date: tdMatch[1], count: parseInt(countMatch[1]) });
            }
          }
        }

        if (dailyContributions.length > 0) {
          dailyContributions.sort((a, b) => new Date(a.date) - new Date(b.date));
          
          // Calculate total this year
          const currentYear = new Date().getFullYear();
          contributionStats.totalCommitsThisYear = dailyContributions
            .filter(d => d.date.startsWith(currentYear))
            .reduce((acc, d) => acc + d.count, 0);

          // Calculate current streak
          let streak = 0;
          const reversed = [...dailyContributions].reverse();
          const today = new Date().toISOString().split('T')[0];
          const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

          for (const day of reversed) {
            if (day.count > 0) {
              streak++;
            } else {
              // Allow gap only for today if user hasn't committed yet
              if (day.date === today || (streak === 0 && day.date === yesterday)) continue;
              break;
            }
          }
          contributionStats.contributionStreak = streak;
          
          // Update today's commits if found in calendar
          const todayData = dailyContributions.find(d => d.date === today);
          if (todayData && todayData.count > 0) {
            contributionStats.todayCommits = todayData.count;
          }
        }
      } catch (err) {
        console.error(`[Backend] Failed to fetch profile contributions: ${err.message}`);
      }
    }

    // Optional: Fetch richer data if GITHUB_TOKEN is present via GraphQL (overrides profile scrape if successful)
    if (process.env.GITHUB_TOKEN) {
      console.log(`[Backend] Fetching GraphQL contributions for ${username}`);
      try {
        const gqlData = await fetchGraphQL(`
          query($username: String!) {
            user(login: $username) {
              contributionsCollection {
                contributionCalendar {
                  totalContributions
                  weeks {
                    contributionDays {
                      contributionCount
                      date
                    }
                  }
                }
              }
            }
          }
        `, { username });

        if (gqlData?.user) {
          const calendar = gqlData.user.contributionsCollection.contributionCalendar;
          contributionStats.totalCommitsThisYear = calendar.totalContributions;

          let streak = 0;
          const allDays = calendar.weeks.flatMap(w => w.contributionDays).reverse();
          for (const day of allDays) {
            if (day.contributionCount > 0) {
              streak++;
            } else {
              if (streak > 0) break;
              const dayDate = new Date(day.date);
              const now = new Date();
              const diffDays = Math.floor((now - dayDate) / (1000 * 60 * 60 * 24));
              if (diffDays > 1) break; 
            }
          }
          contributionStats.contributionStreak = streak;
        }
      } catch (gqlErr) {
        console.warn(`[Backend] GraphQL fetch failed, using profile fallback: ${gqlErr.message}`);
      }
    }

    return {
      profile,
      repos,
      events,
      stats: {
        totalStars,
        totalForks,
        totalCommitsThisYear: contributionStats.totalCommitsThisYear || todayCommits,
        topLanguages,
        contributionStreak: contributionStats.contributionStreak,
        todayCommits: contributionStats.todayCommits || todayCommits
      }
    };
  } catch (error) {
    const status = error.response?.status;
    const message = error.message;
    console.error(`[Backend] ❌ GitHub Fetch Error for ${username}:`, status || 'No Status', message);
    
    if (status === 403 || status === 429) {
      const rateLimitReset = error.response.headers?.['x-ratelimit-reset'];
      if (rateLimitReset) {
        const resetDate = new Date(rateLimitReset * 1000);
        console.warn(`[Backend] Rate limit resets at: ${resetDate.toLocaleString()}`);
      }
    }
    throw error;
  }
};

module.exports = { fetchUserDataFromGitHub };
