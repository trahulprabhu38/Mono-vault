import mongoose from 'mongoose';

const bookmarkSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  folder: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder' },
  title: { type: String, required: true },
  url: { type: String, required: true },
  favicon: { type: String },
  clickCount: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Bookmark', bookmarkSchema); 