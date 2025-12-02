import * as admin from 'firebase-admin';

let adminApp: admin.app.App;

// Initialize Firebase Admin SDK (server-side only)
if (!admin.apps.length) {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
    : {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      };

  adminApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
  });
} else {
  adminApp = admin.apps[0]!;
}

const adminDb = admin.firestore();
const adminAuth = admin.auth();

export { adminApp, adminDb, adminAuth };
