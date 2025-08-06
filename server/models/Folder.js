import mongoose from 'mongoose';

const folderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  color: { type: String, default: '#6B46C1' },
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bookmark' }],
}, { timestamps: true });

export default mongoose.model('Folder', folderSchema); 