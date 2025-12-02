import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  Timestamp
} from 'firebase/firestore';
import { db } from './config';

export interface User {
  id: string;
  address: string;
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

const USERS_COLLECTION = 'users';

export class UserService {
  // Create or update user (used during wallet login)
  static async upsertUser(address: string, userData?: Partial<User>): Promise<User> {
    const userId = address.toLowerCase();
    const docRef = doc(db, USERS_COLLECTION, userId);
    const docSnap = await getDoc(docRef);

    const timestamp = new Date().toISOString();

    if (docSnap.exists()) {
      // Update existing user
      const updates = {
        ...userData,
        lastLoginAt: timestamp,
      };
      await updateDoc(docRef, updates);
      
      return {
        ...docSnap.data() as User,
        ...updates,
      };
    } else {
      // Create new user
      const newUser: User = {
        id: userId,
        address,
        createdAt: timestamp,
        lastLoginAt: timestamp,
        ...userData,
      };
      
      await setDoc(docRef, newUser);
      return newUser;
    }
  }

  // Get user by address
  static async getUser(address: string): Promise<User | null> {
    const userId = address.toLowerCase();
    const docRef = doc(db, USERS_COLLECTION, userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as User;
    }
    return null;
  }

  // Update user profile
  static async updateProfile(
    address: string, 
    updates: Partial<User>
  ): Promise<void> {
    const userId = address.toLowerCase();
    const docRef = doc(db, USERS_COLLECTION, userId);
    await updateDoc(docRef, updates);
  }

  // Update user preferences
  static async updatePreferences(
    address: string,
    preferences: User['preferences']
  ): Promise<void> {
    const userId = address.toLowerCase();
    const docRef = doc(db, USERS_COLLECTION, userId);
    await updateDoc(docRef, { preferences });
  }
}
