# ⚠️ SETUP REQUIRED - READ THIS FIRST

## Current Status

### ✅ What's Already Done (Code Written):
1. **Tutorial Content** - Tutorials 4-10 are complete
2. **Firebase Integration Code** - Service files created but NOT configured
3. **cargo-stylus Integration Code** - Compiler service created but NOT installed
4. **Mock Compilation Fallback** - Now works without cargo-stylus for development

### ❌ What YOU Need to Do:

## Option 1: Quick Start (Mock Mode - No Setup Needed)

**The IDE now works with mock compilation!** Just use it as-is for development.

- ✅ IDE will work
- ✅ Code editor works
- ✅ "Compile" button works (returns mock bytecode)
- ⚠️ Not real compilation (for testing only)

**No action required** - just refresh your browser!

---

## Option 2: Full Setup (Real Compilation + Database)

### Step 1: Install cargo-stylus (Optional - for real compilation)

**Windows PowerShell:**
```powershell
# 1. Install Rust (if not installed)
winget install Rustlang.Rustup

# Close and reopen PowerShell, then:

# 2. Add WASM target
rustup target add wasm32-unknown-unknown

# 3. Install cargo-stylus
cargo install --force cargo-stylus

# 4. Verify
cargo stylus --version
```

**If you skip this:** IDE uses mock compilation (still works!)

---

### Step 2: Firebase Setup (Optional - for persistent storage)

**If you skip this:** Projects/users are stored in memory (lost on restart)

#### 2.1 Create Firebase Project

1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Name it "stylus-studio" (or any name)
4. Disable Google Analytics (not needed)
5. Click "Create project"

#### 2.2 Enable Firestore Database

1. In Firebase Console, click "Firestore Database"
2. Click "Create database"
3. Select "Start in test mode" (for now)
4. Choose location (e.g., us-central1)
5. Click "Enable"

#### 2.3 Get Firebase Config

1. In Firebase Console, go to Project Settings (gear icon)
2. Scroll to "Your apps" section
3. Click the web icon (</>)
4. Register app name: "Stylus Studio Web"
5. Copy the `firebaseConfig` object

#### 2.4 Create Service Account

1. In Firebase Console → Project Settings
2. Go to "Service accounts" tab
3. Click "Generate new private key"
4. Save the JSON file (keep it secret!)

#### 2.5 Configure Environment Variables

Create `.env.local` in the project root:

```env
# Firebase Client Config (from step 2.3)
NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="123456789"
NEXT_PUBLIC_FIREBASE_APP_ID="1:123456789:web:abcdef"

# Firebase Admin SDK (from service account JSON)
FIREBASE_PROJECT_ID="your-project-id"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----"
```

**Important:** Replace all values with YOUR actual Firebase config!

#### 2.6 Restart Dev Server

```powershell
# Stop the server (Ctrl+C), then:
npm run dev
```

---

## Current Working State

### ✅ Works Right Now (No Setup):
- Full VS Code-style IDE
- File explorer
- Code editor with syntax highlighting
- Mock compilation (fake bytecode)
- All tutorial content
- In-memory project storage

### ⚠️ Requires Setup:
- **Real Rust → WASM compilation** → Install cargo-stylus
- **Persistent database** → Configure Firebase
- **User authentication** → Configure Firebase
- **Deployment to Arbitrum** → Install cargo-stylus

---

## Quick Decision Guide

### "I just want to see the IDE work NOW"
→ **Do nothing** - it already works with mock mode!

### "I want to test real Rust compilation"
→ **Install cargo-stylus** (Step 1 above)

### "I want projects to persist after restart"
→ **Set up Firebase** (Step 2 above)

### "I want everything production-ready"
→ **Do both Step 1 and Step 2**

---

## Verification

### Check if cargo-stylus is installed:
```powershell
cargo stylus --version
```

If you see a version number → ✅ Real compilation will work  
If you see an error → ⚠️ Mock compilation will be used

### Check if Firebase is configured:
```powershell
# Check if .env.local exists
Test-Path .env.local
```

If True → Check the file has your Firebase config  
If False → Projects stored in memory only

---

## What Happens If You Don't Set Up Anything?

The app **STILL WORKS** with these limitations:

1. **Compilation:** Mock bytecode (not real WASM)
2. **Storage:** In-memory (data lost on restart)
3. **Auth:** Mock wallet authentication
4. **Deployment:** Won't work (needs real compilation)

**For learning/testing the IDE:** This is perfectly fine!

---

## Need Help?

1. **cargo-stylus issues:** See `CARGO_STYLUS_SETUP.md`
2. **Firebase issues:** See `FIREBASE_SETUP.md`
3. **General setup:** This file!

## Summary

- **Mock mode is now enabled** - IDE works without any setup
- **Real compilation** requires cargo-stylus installation
- **Persistent storage** requires Firebase configuration
- **You choose** what features you want based on your needs

The code is written, now you decide which features to activate! 🚀
