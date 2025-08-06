# Mono Vault Backend

A secure backend for Mono Vault (Bookmark & Password Manager).

## Tech Stack
- Node.js + Express
- MongoDB + Mongoose
- JWT + Bcrypt for authentication
- AES (WebCrypto/crypto) for encryption
- Helmet, CORS, express-rate-limit for security

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file (see `.env.example`).
3. Start the server:
   ```bash
   npm run dev
   ```

## Environment Variables
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT signing
- `ENCRYPTION_KEY` - 32-byte base64 for AES encryption
- `PORT` - Server port (default: 5000)

## API Overview
- `POST   /api/auth/register`   Register user
- `POST   /api/auth/login`      Login user
- `GET    /api/bookmarks`       List bookmarks
- `POST   /api/bookmarks`       Add bookmark
- `PUT    /api/bookmarks/:id`   Edit bookmark
- `DELETE /api/bookmarks/:id`   Delete bookmark
- `GET    /api/folders`         List folders
- `POST   /api/folders`         Add folder
- `GET    /api/passwords`       List passwords (encrypted)
- `POST   /api/passwords`       Add password (encrypted)
- `PUT    /api/passwords/:id`   Edit password
- `DELETE /api/passwords/:id`   Delete password

All password data is encrypted before storage. JWT required for all routes except auth.

---
See main README for fullstack/extension details. 