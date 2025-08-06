import express from 'express';
import Password from '../models/Password.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

// Get all passwords for user
router.get('/', auth, async (req, res) => {
  const passwords = await Password.find({ user: req.userId });
  res.json(passwords);
});

// Add password
router.post('/', auth, async (req, res) => {
  const { title, username, encryptedPassword, url } = req.body;
  const password = await Password.create({ user: req.userId, title, username, encryptedPassword, url });
  res.status(201).json(password);
});

// Edit password
router.put('/:id', auth, async (req, res) => {
  const { title, username, encryptedPassword, url } = req.body;
  const password = await Password.findOneAndUpdate(
    { _id: req.params.id, user: req.userId },
    { title, username, encryptedPassword, url },
    { new: true }
  );
  if (!password) return res.status(404).json({ message: 'Password not found' });
  res.json(password);
});

// Delete password
router.delete('/:id', auth, async (req, res) => {
  const password = await Password.findOneAndDelete({ _id: req.params.id, user: req.userId });
  if (!password) return res.status(404).json({ message: 'Password not found' });
  res.json({ message: 'Deleted' });
});

export default router; 