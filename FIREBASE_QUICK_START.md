# 🔥 Firebase Setup - Quick Start Guide

## Step 1: Create Firebase Project (5 minutes)

### 1.1 Go to Firebase Console
**Link:** https://console.firebase.google.com/

### 1.2 Create New Project
1. Click **"Add project"** or **"Create a project"**
2. **Project name:** `stylusforge` (or any name you prefer)
3. Click **Continue**
4. **Disable Google Analytics** (you can enable later)
5. Click **Create project**
6. Wait for project creation (takes ~30 seconds)
7. Click **Continue**

---

## Step 2: Register Web App (2 minutes)

### 2.1 Add Web App
1. In the Firebase Console home, click the **Web icon** `</>`
2. **App nickname:** `StylusForge Web`
3. **Do NOT check** "Set up Firebase Hosting" (not needed)
4. Click **Register app**

### 2.2 Copy Configuration
You'll see a config object like this:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

**COPY THIS!** You'll need it in Step 5.

Click **Continue to console**

---

## Step 3: Enable Firestore Database (3 minutes)

### 3.1 Create Database
1. In left sidebar, click **Build → Firestore Database**
2. Click **Create database**
3. Select **Start in production mode**
4. Click **Next**
5. Choose location: **us-central1** (or closest to you)
6. Click **Enable**
7. Wait for database creation (~1 minute)

### 3.2 Set Security Rules
1. Click **Rules** tab at top
2. **Replace all text** with this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /projects/{projectId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    match /tutorialProgress/{progressId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    match /transactions/{transactionId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Marketplace - public read, authenticated write
    match /marketplace/{itemId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
  }
}
```

3. Click **Publish**

---

## Step 4: Enable Authentication (2 minutes)

### 4.1 Enable Auth Methods
1. In left sidebar, click **Build → Authentication**
2. Click **Get started**
3. Click **Email/Password** tab
4. **Enable** the toggle
5. Click **Save**

### 4.2 Enable Google Sign-In (Optional)
1. Click **Google** provider
2. **Enable** the toggle
3. Select **Project support email** (your email)
4. Click **Save**

---

## Step 5: Get Service Account Key (3 minutes)

### 5.1 Generate Private Key
1. Click **⚙️ Settings icon** (top left, next to "Project Overview")
2. Click **Project settings**
3. Click **Service accounts** tab
4. Click **Generate new private key**
5. Click **Generate key**
6. A JSON file will download - **KEEP THIS SECRET!**

### 5.2 Extract Private Key
Open the downloaded JSON file. You'll need these values:
- `project_id`
- `client_email`
- `private_key`

---

## Step 6: Configure Your App (5 minutes)

### 6.1 Create Environment File
1. In your project root, create file: `.env.local`
2. Copy content from `.env.local.example`
3. Fill in the values:

```env
# From Step 2 (Web App Config)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# From Step 5 (Service Account JSON)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_ACTUAL_KEY\n-----END PRIVATE KEY-----\n"
```

**Important:** 
- Keep the `"quotes"` around `FIREBASE_PRIVATE_KEY`
- Keep the `\n` newline characters in the private key
- Don't commit `.env.local` to Git (already in .gitignore)

---

## Step 7: Test Your Setup (2 minutes)

### 7.1 Restart Dev Server
```bash
# Stop current server (Ctrl+C)
npm run dev
```

### 7.2 Test Authentication
1. Go to http://localhost:3000
2. Click **Sign Up** or **Login**
3. Create an account with email/password
4. Check Firebase Console → Authentication → Users
5. You should see your new user!

### 7.3 Check Firestore
1. Go to Firebase Console → Firestore Database
2. You should see `users` collection with your user data

---

## ✅ Setup Complete!

Your app is now connected to Firebase with:
- ✅ Real-time database (Firestore)
- ✅ User authentication
- ✅ Tutorial progress tracking
- ✅ Project storage
- ✅ Marketplace integration

---

## 🔗 Important Links

| Resource | Link |
|----------|------|
| Firebase Console | https://console.firebase.google.com |
| Your Firestore Data | https://console.firebase.google.com/project/YOUR_PROJECT/firestore |
| Authentication Users | https://console.firebase.google.com/project/YOUR_PROJECT/authentication |
| Project Settings | https://console.firebase.google.com/project/YOUR_PROJECT/settings/general |
| Usage & Billing | https://console.firebase.google.com/project/YOUR_PROJECT/usage |

Replace `YOUR_PROJECT` with your actual project ID.

---

## 🆘 Troubleshooting

### "Permission Denied" Error
- Check Firestore rules are published
- Ensure user is logged in
- Verify `.env.local` has correct values

### "Firebase not initialized" Error
- Restart dev server after creating `.env.local`
- Check all env variables are set
- Verify no typos in variable names

### Private Key Issues
- Ensure `FIREBASE_PRIVATE_KEY` is wrapped in `"quotes"`
- Keep the `\n` characters (they represent newlines)
- Copy entire key including `-----BEGIN` and `-----END` lines

### Can't see data in Firestore
- Check user is authenticated (login first)
- Verify security rules allow the operation
- Check browser console for errors

---

## 📊 Free Tier Limits

Firebase Spark Plan (Free):
- 50,000 reads/day
- 20,000 writes/day
- 1GB storage
- 10GB/month bandwidth

**This is plenty for development and small production apps!**

---

## 🎉 Next Steps

1. ✅ Firebase is set up
2. ✅ Authentication is working
3. ✅ Database is connected
4. Now: Start building your features!
5. Deploy to production when ready

**Need help?** Check `FIREBASE_SETUP.md` for detailed documentation.
