# Firebase Setup Guide for StylusForge

## Overview
This guide will walk you through setting up Firebase for StylusForge's database and authentication needs.

## Prerequisites
- Node.js installed
- A Google account
- Firebase CLI (optional but recommended)

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter project name: `stylusforge` (or your preferred name)
4. Disable Google Analytics (optional)
5. Click "Create Project"

## Step 2: Register Web App

1. In your Firebase project, click the web icon (`</>`) to add a web app
2. Register app with nickname: "StylusForge Web"
3. Check "Also set up Firebase Hosting" (optional)
4. Click "Register app"
5. Copy the Firebase configuration object - you'll need this for `.env.local`

## Step 3: Enable Firestore Database

1. In Firebase Console, go to "Build" → "Firestore Database"
2. Click "Create database"
3. Choose "Start in production mode" (we'll set rules later)
4. Select your preferred location (e.g., `us-central1`)
5. Click "Enable"

## Step 4: Set Up Firestore Security Rules

Go to "Firestore Database" → "Rules" and paste:

\`\`\`javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Projects collection
    match /projects/{projectId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    
    // Tutorial progress collection
    match /tutorialProgress/{progressId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow write: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }
    
    // Transactions collection
    match /transactions/{transactionId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
\`\`\`

Click "Publish" to save the rules.

## Step 5: Create Service Account (for Server-Side)

1. Go to Project Settings (gear icon) → "Service accounts"
2. Click "Generate new private key"
3. Download the JSON file
4. **IMPORTANT**: Keep this file secure and never commit it to version control

## Step 6: Configure Environment Variables

Create `.env.local` in your project root:

\`\`\`env
# Firebase Client Config (Public)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin SDK (Server-side, PRIVATE)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
\`\`\`

**Getting the values:**

- Client config values: Copy from Firebase Console → Project Settings → General → "Your apps" → Web app config
- Admin SDK values: From the service account JSON file you downloaded

**Important Notes:**
- Add `.env.local` to `.gitignore`
- In production (Vercel, etc.), add these as environment variables in your hosting platform settings
- The `FIREBASE_PRIVATE_KEY` must include `\n` characters for newlines

## Step 7: Initialize Firestore Indexes (Optional but Recommended)

Some queries require indexes. Firebase will prompt you to create them when needed, or you can pre-create them:

1. Go to "Firestore Database" → "Indexes"
2. Create composite indexes if needed:

**Projects Index:**
- Collection: `projects`
- Fields: `userId` (Ascending), `updatedAt` (Descending)

**Transactions Index:**
- Collection: `transactions`
- Fields: `userId` (Ascending), `timestamp` (Descending)

**Tutorial Progress Index:**
- Collection: `tutorialProgress`
- Fields: `userId` (Ascending), `lastAccessedAt` (Descending)

## Step 8: Test the Setup

Run your Next.js development server:

\`\`\`bash
npm run dev
\`\`\`

Test Firebase connection:
1. Try logging in with a wallet
2. Create a project
3. Save tutorial progress
4. Check Firestore Console to see if data is being saved

## Firestore Data Structure

### Users Collection (\`users\`)
\`\`\`typescript
{
  id: string;              // User's wallet address (lowercase)
  address: string;         // Original wallet address
  username?: string;
  email?: string;
  avatar?: string;
  createdAt: string;
  lastLoginAt: string;
  preferences?: {
    theme?: 'dark' | 'light';
    defaultNetwork?: string;
    notifications?: boolean;
  };
}
\`\`\`

### Projects Collection (\`projects\`)
\`\`\`typescript
{
  id: string;                    // Auto-generated
  userId: string;                // Owner's wallet address
  name: string;
  description: string;
  language: 'rust' | 'solidity';
  code: string;
  createdAt: string;
  updatedAt: string;
  deployedAddress?: string;
  network?: string;
  isDeployed: boolean;
}
\`\`\`

### Tutorial Progress Collection (\`tutorialProgress\`)
\`\`\`typescript
{
  userId: string;
  tutorialId: number;
  completedSections: number[];
  assignmentCompleted: boolean;
  userCode: string;
  completedAt?: string;
  lastAccessedAt: string;
}
\`\`\`

Document ID format: \`{userId}_{tutorialId}\`

### Transactions Collection (\`transactions\`)
\`\`\`typescript
{
  id: string;
  userId: string;
  projectId: string;
  type: 'deploy' | 'call' | 'send';
  hash: string;
  status: 'pending' | 'confirmed' | 'failed';
  network: string;
  gasUsed?: string;
  gasPrice?: string;
  value?: string;
  from: string;
  to?: string;
  timestamp: string;
  blockNumber?: number;
  error?: string;
}
\`\`\`

## Troubleshooting

### "Permission Denied" Errors
- Check Firestore security rules
- Ensure user is authenticated
- Verify userId matches authenticated user

### "Failed to Initialize" Errors
- Check environment variables are set correctly
- Verify API key is correct
- Check Firebase project is enabled

### Private Key Issues
- Ensure `FIREBASE_PRIVATE_KEY` includes `\n` characters
- Try wrapping the entire key in double quotes
- Format: `"-----BEGIN PRIVATE KEY-----\nkey_content\n-----END PRIVATE KEY-----\n"`

### CORS Errors
- Add your domain to Firebase authorized domains
- Go to: Authentication → Settings → Authorized domains

## Production Deployment

### Vercel/Netlify:
1. Add all environment variables in project settings
2. Redeploy

### Docker:
1. Use environment variables or secrets
2. Never bake credentials into the image

### Security Best Practices:
- Never expose `FIREBASE_PRIVATE_KEY` in client-side code
- Use Firebase Authentication for user management
- Implement proper Firestore security rules
- Enable Firebase App Check in production
- Monitor usage in Firebase Console

## Firebase CLI Setup (Optional)

Install Firebase CLI globally:
\`\`\`bash
npm install -g firebase-tools
\`\`\`

Login:
\`\`\`bash
firebase login
\`\`\`

Deploy Firestore rules:
\`\`\`bash
firebase deploy --only firestore:rules
\`\`\`

## Useful Firebase Console Links

- **Console**: https://console.firebase.google.com
- **Firestore Data**: Console → Firestore Database
- **Usage & Billing**: Console → Usage and billing
- **Rules**: Console → Firestore Database → Rules
- **Indexes**: Console → Firestore Database → Indexes

## Cost Estimates

Firebase free tier (Spark Plan):
- 50K reads/day
- 20K writes/day
- 20K deletes/day
- 1GB storage

For most development and small-scale production use, the free tier is sufficient.

## Next Steps

1. ✅ Firebase is now set up and integrated
2. Run the app and test database operations
3. Consider adding Firebase Authentication for enhanced security
4. Set up Firebase Analytics (optional)
5. Enable Firebase Performance Monitoring (optional)
