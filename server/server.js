import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.js';
import bookmarkRoutes from './routes/bookmarks.js';
import folderRoutes from './routes/folders.js';
import passwordRoutes from './routes/passwords.js';

dotenv.config();

const app = express();

// Security
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:5173', // allow your frontend origin
  credentials: true, // if you use cookies or authentication headers
}));
app.use(express.json());
app.use(cookieParser());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/folders', folderRoutes);
app.use('/api/passwords', passwordRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    const port = process.env.PORT || 5001;
    app.listen(port, () => console.log(`Mono Vault backend running on port ${port}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

export default app; 