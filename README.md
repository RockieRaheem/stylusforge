# Stylus Studio

**A modern web-based IDE for building, compiling, and deploying Arbitrum Stylus smart contracts in Rust.**

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open browser
# Navigate to http://localhost:3000
```

**That's it!** The IDE works immediately with mock compilation.

---

## ✨ Features

### 🎨 Full-Featured IDE
- **VS Code-style interface** with familiar keyboard shortcuts
- **Monaco Editor** with Rust syntax highlighting
- **File explorer** with create/delete/rename operations
- **Integrated terminal** for command execution
- **Problems panel** showing compilation errors
- **Split view** and resizable panels

### 📚 Interactive Tutorials
- **10 comprehensive tutorials** from basics to advanced
- **Built-in code editor** with starter code
- **Step-by-step sections** with detailed explanations
- **Practice assignments** with solutions
- **Test cases** to verify your code

### 🔧 Browser-Based Compilation
- ✅ **No installation required** - compiles entirely in browser
- ✅ **Rust Playground API** for syntax validation
- ✅ **Real-time error feedback** in Problems panel
- ✅ **WASM bytecode generation** ready for deployment
- ✅ **Works on any device** - Windows, Mac, Linux, even tablets!

### 💾 Storage (Two Modes)

#### In-Memory (Default - No Setup)
- ✅ Works immediately
- ✅ Store projects, users, progress
- ⚠️ Data lost on server restart

#### Firebase (Requires Setup)
- ✅ Persistent database
- ✅ User authentication
- ✅ Cloud storage
- 📋 Requires: Firebase project configuration

---

## 📖 Documentation

| File | Purpose |
|------|---------|
| **CURRENT_STATUS.md** | What works now vs what needs setup |
| **SETUP_REQUIRED.md** | Step-by-step setup instructions |
| **CARGO_STYLUS_SETUP.md** | Install cargo-stylus for real compilation |
| **FIREBASE_SETUP.md** | Configure Firebase for persistence |
| **COMPILER_INTEGRATION.md** | How the compilation system works |

**Start with:** `CURRENT_STATUS.md`

---

## 🎯 Current Status

| Feature | Status | Notes |
|---------|--------|-------|
| IDE | ✅ Working | Full VS Code clone |
| Tutorials | ✅ Working | 10 complete tutorials |
| Browser Compilation | ✅ Working | No installation required! |
| In-Memory Storage | ✅ Working | Resets on restart |
| Firebase Storage | ⚠️ Optional | For persistence across restarts |

**Everything works out of the box - no cargo-stylus installation needed!**

---

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript 5
- **UI:** React 19, Tailwind CSS
- **Editor:** Monaco Editor
- **Terminal:** xterm.js
- **Icons:** Lucide React
- **Blockchain:** ethers.js v6
- **Database (Optional):** Firebase Firestore
- **Auth (Optional):** Firebase Auth
- **Compilation (Optional):** cargo-stylus

---

## 📋 Setup Options

### Option 1: Quick Start (Default - Recommended)
```bash
npm install
npm run dev
```
**That's it!** Browser-based compilation works instantly. No cargo-stylus needed!

### Option 2: Add Firebase (Optional - For Persistence)
```bash
# 1. Create Firebase project
# Visit https://console.firebase.google.com

# 2. Configure environment variables
# Create .env.local with Firebase credentials

# 3. Restart dev server
npm run dev
```
Adds data persistence across restarts.

See **FIREBASE_SETUP.md** for detailed Firebase instructions (optional).

---

## 📚 Project Structure

```
stylus_studio/
├── app/                      # Next.js app directory
│   ├── api/                 # API routes
│   │   ├── compile/        # Compilation endpoint
│   │   ├── projects/       # Project management
│   │   ├── tutorials/      # Tutorial progress
│   │   └── transactions/   # Transaction history
│   ├── dashboard/          # User dashboard
│   ├── ide/                # Main IDE interface
│   ├── tutorial/           # Tutorial system
│   └── deploy/             # Deployment interface
├── lib/                     # Shared libraries
│   ├── compiler/           # Compilation services
│   │   ├── stylus.ts       # cargo-stylus wrapper
│   │   └── error-parser.ts # Error parsing
│   └── firebase/           # Firebase services
│       ├── config.ts       # Client config
│       ├── admin.ts        # Admin SDK
│       ├── users.ts        # User service
│       ├── projects.ts     # Project service
│       ├── tutorials.ts    # Tutorial service
│       └── transactions.ts # Transaction service
└── public/                 # Static assets
```

---

## 🎓 Tutorials

1. **Getting Started** - Your first Stylus contract
2. **Storage & State** - Managing contract state
3. **Functions & Calls** - External and internal functions
4. **Events & Logging** - Emitting and indexing events
5. **Error Handling** - Result types and custom errors
6. **Testing Contracts** - Unit and integration tests
7. **Gas Optimization** - Writing efficient contracts
8. **Advanced Patterns** - Upgradeable contracts, RBAC
9. **DeFi Token** - ERC-20 implementation
10. **NFT Marketplace** - ERC-721 with marketplace features

Each tutorial includes:
- 📖 Detailed explanations
- 💻 Interactive code editor
- ✏️ Practice assignments
- ✅ Test cases
- 💡 Best practices

---

## 🔐 Security Notes

### Current Implementation
- ⚠️ Compilation runs on server without sandboxing
- ⚠️ No rate limiting on API routes
- ⚠️ Test mode Firestore rules (if Firebase configured)

### Production Recommendations
- Use Docker containers for compilation isolation
- Implement rate limiting (e.g., with Vercel limits)
- Configure proper Firestore security rules
- Add authentication middleware
- Scan uploaded code for malicious patterns
- Set resource limits (CPU, memory, disk)

See **FIREBASE_SETUP.md** for production security rules.

---

## 🚢 Deployment

### Vercel (Recommended)
```bash
# 1. Push to GitHub
git push

# 2. Import to Vercel
# Visit https://vercel.com/new

# 3. Add environment variables (if using Firebase)
# Add all NEXT_PUBLIC_* and FIREBASE_* vars

# 4. Deploy
```

### Docker
```bash
# Build image
docker build -t stylus-studio .

# Run container
docker run -p 3000:3000 stylus-studio
```

### Notes
- cargo-stylus must be installed in deployment environment
- Firebase credentials must be set as environment variables
- Consider using serverless functions for compilation

---

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

## 📝 License

MIT License - see LICENSE file for details.

---

## 🙏 Acknowledgments

- [Arbitrum Stylus](https://docs.arbitrum.io/stylus) - Rust smart contracts on Arbitrum
- [cargo-stylus](https://github.com/OffchainLabs/cargo-stylus) - Stylus compilation toolchain
- [Next.js](https://nextjs.org) - React framework
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - VS Code editor
- [Firebase](https://firebase.google.com) - Backend services

---

## 📞 Support

- **Documentation:** See docs in project root
- **Issues:** Open GitHub issue
- **Arbitrum Discord:** https://discord.gg/arbitrum
- **Stylus Docs:** https://docs.arbitrum.io/stylus

---

## 🎯 Roadmap

- [x] Full IDE with Monaco editor
- [x] 10 comprehensive tutorials
- [x] Mock compilation for development
- [x] Firebase integration (optional)
- [x] Real cargo-stylus compilation (optional)
- [ ] WebSocket for real-time collaboration
- [ ] One-click deployment to Arbitrum
- [ ] Contract templates library
- [ ] Gas profiling and optimization suggestions
- [ ] Debug support for WASM
- [ ] AI-powered code suggestions
- [ ] Community contract sharing

---

**Built with ❤️ for the Arbitrum Stylus community**
