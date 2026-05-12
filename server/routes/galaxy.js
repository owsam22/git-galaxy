const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { fetchUserDataFromGitHub } = require('../services/githubFetcher');

// GET /api/galaxy/:username
router.get('/galaxy/:username', async (req, res) => {
  const { username } = req.params;
  const { refresh } = req.query;
  const lowercaseUsername = username.toLowerCase();

  try {
    let user = await User.findOne({ username: { $regex: new RegExp(`^${lowercaseUsername}$`, 'i') } });
    
    // Only fetch fresh if:
    // 1. User doesn't exist in our DB at all
    // 2. OR the 'refresh=true' flag was sent (manual search)
    const shouldFetchFresh = !user || refresh === 'true';

    if (shouldFetchFresh) {
      const reason = !user ? 'New User' : 'Manual Refresh';
      console.log(`[Backend] Fetching fresh data for ${username}... (Reason: ${reason})`);
      const githubData = await fetchUserDataFromGitHub(username);
      
      if (user) {
        // Update existing
        user.profile = githubData.profile;
        user.repos = githubData.repos;
        user.events = githubData.events;
        user.stats = githubData.stats;
        user.lastFetched = new Date();
        await user.save();
        console.log(`[Backend] Updated cache for ${username}`);
      } else {
        // Create new
        user = new User({
          username: githubData.profile.login,
          profile: githubData.profile,
          repos: githubData.repos,
          events: githubData.events,
          stats: githubData.stats
        });
        await user.save();
        console.log(`[Backend] Created new entry for ${username}`);
      }
    } else {
      console.log(`[Backend] Serving cached data for ${username}`);
    }

    res.json(user);
  } catch (error) {
    console.error(`[Backend] ❌ Error processing galaxy request for ${username}:`);
    console.error(`  - Message: ${error.message}`);
    
    if (error.response) {
      console.error(`  - GitHub API Status: ${error.response.status}`);
      console.error(`  - GitHub API Data:`, JSON.stringify(error.response.data));
      
      if (error.response.status === 404) {
        return res.status(404).json({ error: 'GitHub user not found' });
      }
      if (error.response.status === 403 || error.response.status === 429) {
        return res.status(429).json({ 
          error: 'GitHub API rate limit exceeded. Please try again later or add a GITHUB_TOKEN.',
          details: error.response.data?.message 
        });
      }
    }

    if (error.name === 'MongoError' || error.name === 'MongooseError' || error.message.includes('buffering timed out')) {
      return res.status(503).json({ error: 'Database connection issue. Please check your MONGODB_URI.' });
    }
    
    res.status(500).json({ 
      error: 'Internal server error while fetching galaxy data',
      message: error.message 
    });
  }
});

// GET /api/users/all
router.get('/users/all', async (req, res) => {
  try {
    // Return lightweight list for background stars
    const users = await User.find({}, 'username profile.avatar_url stats').lean();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/stats
router.get('/stats', async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    res.json({ userCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
