# 🔥 Firebase Security Rules Update Required

## The Issue

Dashboard is not updating after deployments because Firebase security rules are blocking writes to the `deployments` collection.

**Error:** `Missing or insufficient permissions`

---

## ✅ Solution: Update Firebase Rules

### Method 1: Firebase Console (Quick - 2 minutes)

1. **Go to:** [Firebase Console](https://console.firebase.google.com)
2. **Select your project:** `stylus-studio` (or whatever your project is named)
3. **Click:** Firestore Database (in left sidebar)
4. **Click:** Rules tab (at the top)
5. **Find this section:**
   ```
   match /tutorialProgress/{progressId} {
     allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
     allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
   }
   ```

6. **Add this RIGHT AFTER it:**
   ```
   // Deployments - users can access their own deployments
   match /deployments/{deploymentId} {
     allow read: if request.auth != null && resource.data.userId == request.auth.uid;
     allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
     allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
   }
   ```

7. **Click "Publish"**
8. **Done!** Try deploying a contract again

---

### Method 2: Using Firebase CLI (If installed)

```bash
# Install Firebase CLI (if not installed)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy the rules
cd stylus_studio
firebase deploy --only firestore:rules
```

---

### Method 3: Temporary Open Access (TESTING ONLY - NOT SECURE)

**⚠️ WARNING: Only use this for testing! Anyone can read/write your data!**

If you just want to test quickly, temporarily change the rules to:

```
match /deployments/{deploymentId} {
  allow read, write: if true; // TEMPORARY - REMOVE AFTER TESTING
}
```

**Remember to add proper security after testing!**

---

## 📋 Complete Updated Rules File

Your `firestore.rules` should look like this:

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection - users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Projects collection - users can only access their own projects
    match /projects/{projectId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }
    
    // Tutorial progress - users can only access their own progress
    match /tutorialProgress/{progressId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }
    
    // Deployments - users can access their own deployments
    match /deployments/{deploymentId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    
    // Transactions - users can only access their own transactions
    match /transactions/{transactionId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }
    
    // Marketplace - public read, authenticated write, owner can update/delete
    match /marketplace/{itemId} {
      allow read: if true;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

---

## 🧪 Test After Updating

1. **Go to:** http://localhost:3000/deploy
2. **Deploy a contract**
3. **Check the console** - should see "✅ Deployment recorded"
4. **Go to Dashboard** - should see updated deployment count
5. **No more "Missing permissions" errors!**

---

## ✨ What This Fixes

After updating the rules:
- ✅ Deployments save to Firebase successfully
- ✅ Dashboard shows real deployment count
- ✅ Dashboard auto-refreshes after deployment
- ✅ Deployment history displays correctly
- ✅ No more permission errors

---

**Note:** The local `firestore.rules` file has been updated. You just need to publish it to Firebase using one of the methods above.
