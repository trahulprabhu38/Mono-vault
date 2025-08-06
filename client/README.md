# 🔒 Mono Vault - Secure Bookmark & Password Manager

Mono Vault is a modern, secure bookmark and password manager with browser extension support. Built with React, Chakra UI, and advanced encryption for maximum security and user experience.

## ✨ Features

### 🔐 Security First
- **End-to-end encryption** using WebCrypto API (AES-GCM + PBKDF2)
- **Zero-knowledge architecture** - only you can decrypt your data
- **Secure password generation** with customizable complexity
- **JWT-based authentication** with bcrypt password hashing

### 📚 Bookmark Management
- **Organize bookmarks** into custom folders with color coding
- **Smart search and filtering** across all your bookmarks
- **Automatic favicon detection** and caching
- **Import/export functionality** for easy migration
- **Click tracking** and usage analytics

### 🔑 Password Vault
- **Secure password storage** with client-side encryption
- **Auto-fill capabilities** via browser extension
- **Password strength analysis** and security recommendations
- **Secure sharing** with encrypted links (coming soon)

### 🌐 Browser Extension
- **Chrome and Firefox support** with Manifest v3
- **One-click bookmark saving** from any webpage
- **Auto-fill detection** for login forms
- **Context menu integration** for quick access
- **Offline functionality** with local storage sync

### 🎨 Beautiful Design
- **Modern glass morphism UI** with smooth animations
- **Dark/light mode support** with system preference detection
- **Responsive design** optimized for all devices
- **Framer Motion animations** for fluid interactions
- **AOS scroll animations** for engaging experience

## 🚀 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Chakra UI** for consistent design system
- **Framer Motion** for smooth animations
- **React Router** for navigation
- **React Hook Form + Zod** for form validation
- **AOS** for scroll-triggered animations

### Backend (Future Implementation)
- **Node.js + Express** for REST API
- **MongoDB + Mongoose** for data persistence
- **JWT + bcrypt** for secure authentication
- **Helmet + CORS** for production security
- **Rate limiting** for API protection

### Browser Extension
- **Manifest v3** for modern browser compatibility
- **Chrome Extension APIs** for deep browser integration
- **Content scripts** for auto-fill functionality
- **Background service worker** for sync operations
- **Local storage** for offline capabilities

### Security & Encryption
- **WebCrypto API** for client-side encryption
- **PBKDF2** for key derivation
- **AES-GCM** for authenticated encryption
- **Secure random generation** for passwords and salts

## 🛠️ Installation

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/mono vault.git
   cd mono vault
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

### Browser Extension Setup

1. **Open Chrome Extensions**
   - Go to `chrome://extensions/`
   - Enable "Developer mode"

2. **Load Extension**
   - Click "Load unpacked"
   - Select the `extension` folder from this project

3. **Pin Extension**
   - Click the puzzle icon in Chrome toolbar
   - Pin Mono Vault for easy access

## 🎯 Quick Start

### Web Application

1. **Create Account**
   - Visit the web application
   - Sign up with your email and password
   - Your data is immediately encrypted and secured

2. **Add Bookmarks**
   - Click "Add Bookmark" on the dashboard
   - Create custom folders for organization
   - Use the search feature to find bookmarks quickly

3. **Manage Passwords**
   - Navigate to the Passwords section
   - Add new passwords with automatic encryption
   - Use the password generator for strong passwords

### Browser Extension

1. **Sign In**
   - Click the Mono Vault extension icon
   - Sign in with your web app credentials
   - Your data automatically syncs

2. **Save Bookmarks**
   - Visit any webpage
   - Click the extension icon
   - Fill in details and save to your vault

3. **Auto-fill Passwords**
   - Visit a login page with saved credentials
   - Extension detects password fields
   - Click the Mono Vault indicator to auto-fill

## 🔒 Security Architecture

### Client-Side Encryption

```typescript
// Password encryption process
1. User enters master password
2. PBKDF2 derives encryption key (100,000 iterations)
3. AES-GCM encrypts data with random IV
4. Encrypted blob stored on server
5. Only client can decrypt with master password
```

### Zero-Knowledge Design

- Server never sees unencrypted data
- All encryption/decryption happens client-side
- Even if server is compromised, data remains secure
- Master password never leaves your device

### Secure Communication

- HTTPS-only API endpoints
- JWT tokens for authentication
- CORS and CSP headers for XSS protection
- Rate limiting for brute force protection

## 🎨 Design System

### Color Palette
- **Primary**: Purple gradient (#6B46C1 → #553C9A)
- **Secondary**: Blue gradient (#3B82F6 → #2563EB)
- **Accent**: Teal gradient (#14B8A6 → #0F766E)
- **Success**: Green (#10B981)
- **Warning**: Orange (#F59E0B)
- **Error**: Red (#EF4444)

### Typography
- **Font Family**: Inter (web), SF Pro (system)
- **Headings**: 600-700 weight, 120% line height
- **Body**: 400-500 weight, 150% line height
- **Code**: SF Mono, Consolas, monospace

### Spacing System
- **Base unit**: 8px
- **Scale**: 8, 16, 24, 32, 48, 64, 96px
- **Components**: Consistent padding and margins
- **Grid**: 12-column responsive layout

## 🧪 Testing

### Frontend Testing
```bash
# Run unit tests
npm run test

# Run E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

### Extension Testing
```bash
# Load extension in development
npm run build:extension

# Test in different browsers
npm run test:extension
```

## 📦 Building for Production

### Web Application
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Browser Extension
```bash
# Build extension
npm run build:extension

# Create distribution package
npm run package:extension
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

### Code Standards

- **TypeScript** for type safety
- **ESLint + Prettier** for code formatting
- **Conventional Commits** for git messages
- **Component-driven development**
- **Comprehensive testing** for all features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

- **Documentation**: [docs.mono vault.app](https://docs.mono vault.app)
- **Issues**: [GitHub Issues](https://github.com/yourusername/mono vault/issues)
- **Email**: support@mono vault.app
- **Discord**: [Mono Vault Community](https://discord.gg/mono vault)

## 🗺️ Roadmap

### Version 1.1
- [ ] Backend API implementation
- [ ] Real-time sync across devices
- [ ] Password sharing with encryption
- [ ] Mobile companion app

### Version 1.2
- [ ] Two-factor authentication
- [ ] Biometric unlock support
- [ ] Advanced search with filters
- [ ] Import from other password managers

### Version 1.3
- [ ] Team collaboration features
- [ ] Audit logs and security reports
- [ ] API for third-party integrations
- [ ] White-label solutions

---

**Built with ❤️ by the Mono Vault team**

*Secure your digital life with confidence*

Backend is being added in /backend (Node.js + Express + MongoDB). See /backend/README.md for backend setup.