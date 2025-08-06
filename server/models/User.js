import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  folders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Folder' }],
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bookmark' }],
  passwords: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Password' }],
}, { timestamps: true });

export default mongoose.model('User', userSchema); 