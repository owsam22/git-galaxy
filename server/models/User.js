const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, index: true },
  profile: { type: Object, required: true },
  repos: { type: Array, required: true },
  events: { type: Array, required: true },
  stats: {
    totalStars: { type: Number, default: 0 },
    totalForks: { type: Number, default: 0 },
    totalCommitsThisYear: { type: Number, default: 0 },
    topLanguages: [{ name: String, percentage: Number }],
    contributionStreak: { type: Number, default: 0 },
    todayCommits: { type: Number, default: 0 },
  },
  lastFetched: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
