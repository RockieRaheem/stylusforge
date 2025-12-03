# 🔥 Firebase Setup - Complete Guide

## ✅ What You Now Have

1. ✅ Professional Login/Signup Pages (`/auth/login` & `/auth/signup`)
2. ✅ Firebase Authentication Integration
3. ✅ User Context Management (AuthProvider)
4. ✅ User Menu with Profile Dropdown
5. ✅ Firestore Database Configuration
6. ✅ Tutorial Progress Tracking System
7. ✅ User Projects Storage
8. ✅ Marketplace Integration

---

## 🔗 Essential Links

### Firebase Console
| Purpose | Link |
|---------|------|
| **Main Console** | https://console.firebase.google.com |
| **Create New Project** | https://console.firebase.google.com/u/0/ |
| **Authentication Setup** | https://console.firebase.google.com/project/_/authentication |
| **Firestore Database** | https://console.firebase.google.com/project/_/firestore |
| **Project Settings** | https://console.firebase.google.com/project/_/settings/general |
| **Usage & Billing** | https://console.firebase.google.com/project/_/usage |

*(Replace `_` in URLs with your project ID after creation)*

---

## 📋 Setup Checklist

### Step 1: Create Firebase Project (5 minutes)
- [ ] Go to https://console.firebase.google.com
- [ ] Click "Add project" or "Create a project"
- [ ] Name your project: `stylusforge`
- [ ] Disable Google Analytics (optional)
- [ ] Click "Create project"

### Step 2: Register Web App (2 minutes)
- [ ] In Firebase Console, click the web icon `</>`
- [ ] App nickname: `StylusForge Web`
- [ ] Click "Register app"
- [ ] Copy the config object (you'll need this!)
- [ ] Click "Continue to console"

### Step 3: Enable Firestore (3 minutes)
- [ ] Go to Build → Firestore Database
- [ ] Click "Create database"
- [ ] Select "Start in production mode"
- [ ] Choose location (us-central1 recommended)
- [ ] Click "Enable"
- [ ] Update security rules (see FIREBASE_QUICK_START.md)

### Step 4: Enable Authentication (2 minutes)
- [ ] Go to Build → Authentication
- [ ] Click "Get started"
- [ ] Enable "Email/Password"
- [ ] (Optional) Enable "Google" sign-in
- [ ] Click "Save"

### Step 5: Get Service Account Key (3 minutes)
- [ ] Go to Project Settings → Service accounts
- [ ] Click "Generate new private key"
- [ ] Download JSON file
- [ ] Keep this file SECURE!

### Step 6: Configure Environment Variables (5 minutes)
- [ ] Create `.env.local` file in project root
- [ ] Copy template from `.env.local.example`
- [ ] Fill in values from Firebase Console
- [ ] Restart dev server

---

## 🎯 Quick Start Commands

```bash
# 1. Copy environment template
cp .env.local.example .env.local

# 2. Edit .env.local with your Firebase credentials
# (Use your favorite editor)

# 3. Restart the development server
npm run dev

# 4. Visit the auth pages
# http://localhost:3000/auth/signup
# http://localhost:3000/auth/login
```

---

## 🗂️ Database Schema

Your app will automatically create these Firestore collections:

### 1. **users** Collection
Stores user profiles and preferences.
```typescript
{
  uid: string;                    // Firebase Auth UID
  email: string;                  // User email
  displayName: string;            // Display name
  photoURL?: string;              // Profile picture URL
  createdAt: string;              // Account creation date
  lastLoginAt: string;            // Last login timestamp
  preferences: {
    theme: 'dark' | 'light';
    defaultNetwork: string;
    notifications: boolean;
  }
}
```

### 2. **projects** Collection
Stores user's smart contracts and projects.
```typescript
{
  id: string;                     // Auto-generated ID
  userId: string;                 // Owner's UID
  name: string;                   // Project name
  description: string;            // Project description
  language: 'rust' | 'solidity';  // Contract language
  code: string;                   // Contract source code
  createdAt: string;              // Creation timestamp
  updatedAt: string;              // Last update timestamp
  deployedAddress?: string;       // Deployed contract address
  network?: string;               // Deployment network
  isDeployed: boolean;            // Deployment status
}
```

### 3. **tutorialProgress** Collection
Tracks tutorial completion for each user.
```typescript
{
  userId: string;                 // User's UID
  tutorialId: number;             // Tutorial identifier
  completedSections: number[];    // Completed section IDs
  assignmentCompleted: boolean;   // Assignment status
  userCode: string;               // User's code submission
  completedAt?: string;           // Completion timestamp
  lastAccessedAt: string;         // Last access time
}
```

### 4. **transactions** Collection
Records all blockchain transactions.
```typescript
{
  id: string;                     // Transaction ID
  userId: string;                 // User's UID
  projectId: string;              // Associated project
  type: 'deploy' | 'call' | 'send';
  hash: string;                   // Transaction hash
  status: 'pending' | 'confirmed' | 'failed';
  network: string;                // Blockchain network
  gasUsed?: string;               // Gas consumed
  gasPrice?: string;              // Gas price
  value?: string;                 // ETH value
  from: string;                   // Sender address
  to?: string;                    // Recipient address
  timestamp: string;              // Transaction time
  blockNumber?: number;           // Block number
  error?: string;                 // Error message if failed
}
```

### 5. **marketplace** Collection
Stores marketplace listings (contracts for sale/share).
```typescript
{
  id: string;                     // Listing ID
  userId: string;                 // Creator's UID
  projectId: string;              // Associated project
  title: string;                  // Listing title
  description: string;            // Description
  price: number;                  // Price in ETH
  category: string;               // Contract category
  tags: string[];                 // Search tags
  downloads: number;              // Download count
  rating: number;                 // Average rating
  createdAt: string;              // Creation timestamp
  updatedAt: string;              // Last update
  featured: boolean;              // Featured status
}
```

---

## 🔐 Security Rules

Your Firestore is configured with these security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Projects: Owner-only access
    match /projects/{projectId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Tutorial progress: Owner-only access
    match /tutorialProgress/{progressId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Transactions: Owner-only access
    match /transactions/{transactionId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Marketplace: Public read, authenticated write
    match /marketplace/{itemId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
  }
}
```

---

## 🎨 Authentication Flow

### Login Flow:
1. User visits `/auth/login`
2. Enters email/password OR clicks "Google"
3. Firebase authenticates user
4. AuthContext updates with user data
5. User document fetched from Firestore
6. Redirect to `/dashboard`

### Signup Flow:
1. User visits `/auth/signup`
2. Fills form OR clicks "Google"
3. Firebase creates new user account
4. User document created in Firestore
5. AuthContext updates with user data
6. Redirect to `/dashboard`

### Session Management:
- Firebase handles session persistence automatically
- User stays logged in across browser restarts
- Session stored in secure HttpOnly cookies
- Automatic token refresh before expiry

---

## 🧪 Testing Your Setup

### 1. Test Authentication
```bash
# Start dev server
npm run dev

# Navigate to signup
# http://localhost:3000/auth/signup

# Create test account
# Email: test@example.com
# Password: test123456
```

### 2. Check Firebase Console
- Go to Authentication → Users
- You should see your new user!
- Go to Firestore → Data
- You should see `users` collection with your user document

### 3. Test Login
- Sign out from user menu
- Go to `/auth/login`
- Login with test credentials
- Should redirect to dashboard

### 4. Test User Menu
- Check top-right corner
- Click your avatar/name
- Dropdown should show:
  - Dashboard
  - IDE
  - Tutorials
  - Marketplace
  - Settings
  - Sign Out

---

## 🚀 Deployment to Production

### Vercel Deployment:
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Add environment variables in Vercel dashboard:
# Settings → Environment Variables
# Copy all values from .env.local
```

### Environment Variables for Production:
```bash
# In Vercel/Netlify dashboard, add:
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY=...
```

---

## 📊 Free Tier Limits

Firebase Spark Plan (Free Forever):
- **Authentication:** Unlimited users
- **Firestore Reads:** 50,000/day
- **Firestore Writes:** 20,000/day
- **Firestore Deletes:** 20,000/day
- **Storage:** 1 GB
- **Bandwidth:** 10 GB/month

**Perfect for development and small production apps!**

---

## 🔧 Common Issues & Solutions

### Issue: "Firebase not initialized"
**Solution:** Check `.env.local` exists and has all variables

### Issue: "Permission denied" errors
**Solution:** Check Firestore security rules are published

### Issue: "Auth domain not authorized"
**Solution:** Add your domain to Firebase authorized domains
- Firebase Console → Authentication → Settings → Authorized domains

### Issue: Private key format error
**Solution:** Ensure private key includes `\n` characters and is wrapped in quotes

### Issue: "User data not saving"
**Solution:** Check browser console for errors, verify Firestore rules

---

## 📚 Additional Resources

- **Firebase Docs:** https://firebase.google.com/docs
- **Firestore Guide:** https://firebase.google.com/docs/firestore
- **Auth Guide:** https://firebase.google.com/docs/auth
- **Security Rules:** https://firebase.google.com/docs/firestore/security/get-started
- **React Firebase Hooks:** https://github.com/CSFrequency/react-firebase-hooks

---

## ✅ What's Configured

- ✅ Firebase Authentication (Email & Google)
- ✅ Firestore Database with security rules
- ✅ User profile management
- ✅ Tutorial progress tracking
- ✅ Project storage and retrieval
- ✅ Transaction logging
- ✅ Marketplace integration
- ✅ Session persistence
- ✅ Auto user document creation
- ✅ Professional UI/UX for auth

---

## 🎯 Next Steps

1. **Setup Firebase** (Follow FIREBASE_QUICK_START.md)
2. **Test Auth** (Create account, login, logout)
3. **Integrate with IDE** (Save projects to Firestore)
4. **Track Tutorial Progress** (Already configured!)
5. **Deploy to Production** (Vercel/Netlify)

---

**Need help?** Read `FIREBASE_SETUP.md` for detailed documentation.

**Ready to go!** Start with `FIREBASE_QUICK_START.md` and follow the 20-minute setup guide.
