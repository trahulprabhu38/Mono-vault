import express from 'express';
import Bookmark from '../models/Bookmark.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

// Get all bookmarks for user
router.get('/', auth, async (req, res) => {
  const bookmarks = await Bookmark.find({ user: req.userId });
  res.json(bookmarks);
});

// Add bookmark
router.post('/', auth, async (req, res) => {
  const { title, url, folder, favicon } = req.body;
  const bookmark = await Bookmark.create({ user: req.userId, title, url, folder, favicon });
  res.status(201).json(bookmark);
});

// Edit bookmark
router.put('/:id', auth, async (req, res) => {
  const { title, url, folder, favicon } = req.body;
  const bookmark = await Bookmark.findOneAndUpdate(
    { _id: req.params.id, user: req.userId },
    { title, url, folder, favicon },
    { new: true }
  );
  if (!bookmark) return res.status(404).json({ message: 'Bookmark not found' });
  res.json(bookmark);
});

// Delete bookmark
router.delete('/:id', auth, async (req, res) => {
  const bookmark = await Bookmark.findOneAndDelete({ _id: req.params.id, user: req.userId });
  if (!bookmark) return res.status(404).json({ message: 'Bookmark not found' });
  res.json({ message: 'Deleted' });
});

export default router; 