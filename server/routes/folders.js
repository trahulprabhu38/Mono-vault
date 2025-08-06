import express from 'express';
import Folder from '../models/Folder.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

// Get all folders for user
router.get('/', auth, async (req, res) => {
  const folders = await Folder.find({ user: req.userId });
  res.json(folders);
});

// Add folder
router.post('/', auth, async (req, res) => {
  const { name, color } = req.body;
  const folder = await Folder.create({ user: req.userId, name, color });
  res.status(201).json(folder);
});

export default router; 