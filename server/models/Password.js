import mongoose from 'mongoose';

const passwordSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  username: { type: String, required: true },
  encryptedPassword: { type: String, required: true },
  url: { type: String },
}, { timestamps: true });

export default mongoose.model('Password', passwordSchema); 