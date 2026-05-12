const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const galaxyRoutes = require('./routes/galaxy');

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  'http://localhost:3000',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({ 
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gitgalaxy')
  .then(() => console.log('✅ MongoDB connected → gitgalaxy'))
  .catch((err) => console.error('❌ MongoDB connection error:', err.message));

app.use('/api', galaxyRoutes);

app.get('/api/health', (_req, res) =>
  res.json({ status: 'ok', timestamp: new Date(), db: mongoose.connection.readyState })
);

app.listen(PORT, () => {
  console.log(`🚀 Git Galaxy server → http://localhost:${PORT}`);
});
