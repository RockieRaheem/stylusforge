import { db } from '../firebase/config';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  query,
  where,
  getDocs,
  Timestamp,
  arrayUnion,
  increment
} from 'firebase/firestore';

export interface TutorialProgress {
  userId: string;
  tutorialId: number;
  completedSections: number[];
  completedChallenges: string[];
  codeSubmissions: { [challengeId: string]: string };
  startedAt: Date;
  completedAt?: Date;
  lastAccessedAt: Date;
  timeSpent: number; // in seconds
  score: number;
  maxScore: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  earnedAt: Date;
  tutorialId?: number;
}

export interface UserTutorialData {
  userId: string;
  completedTutorials: number[];
  badges: Badge[];
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: Date;
}

class TutorialProgressService {
  private readonly PROGRESS_COLLECTION = 'tutorial_progress';
  private readonly USER_DATA_COLLECTION = 'user_tutorial_data';

  /**
   * Initialize or get user tutorial data
   */
  async getUserData(userId: string): Promise<UserTutorialData> {
    try {
      const docRef = doc(db, this.USER_DATA_COLLECTION, userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          ...data,
          lastActivityDate: data.lastActivityDate?.toDate() || new Date(),
          badges: data.badges?.map((b: any) => ({
            ...b,
            earnedAt: b.earnedAt?.toDate() || new Date()
          })) || []
        } as UserTutorialData;
      }

      // Create new user data
      const newData: UserTutorialData = {
        userId,
        completedTutorials: [],
        badges: [],
        totalPoints: 0,
        currentStreak: 0,
        longestStreak: 0,
        lastActivityDate: new Date()
      };

      await setDoc(docRef, {
        ...newData,
        lastActivityDate: Timestamp.now()
      });

      return newData;
    } catch (error) {
      console.error('Error getting user tutorial data:', error);
      throw error;
    }
  }

  /**
   * Get progress for a specific tutorial
   */
  async getTutorialProgress(userId: string, tutorialId: number): Promise<TutorialProgress | null> {
    try {
      const docRef = doc(db, this.PROGRESS_COLLECTION, `${userId}_${tutorialId}`);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      const data = docSnap.data();
      return {
        ...data,
        startedAt: data.startedAt?.toDate() || new Date(),
        completedAt: data.completedAt?.toDate(),
        lastAccessedAt: data.lastAccessedAt?.toDate() || new Date()
      } as TutorialProgress;
    } catch (error) {
      console.error('Error getting tutorial progress:', error);
      return null;
    }
  }

  /**
   * Start a tutorial
   */
  async startTutorial(userId: string, tutorialId: number, maxScore: number): Promise<void> {
    try {
      const docRef = doc(db, this.PROGRESS_COLLECTION, `${userId}_${tutorialId}`);
      const existing = await getDoc(docRef);

      if (existing.exists()) {
        // Update last accessed
        await updateDoc(docRef, {
          lastAccessedAt: Timestamp.now()
        });
        return;
      }

      const progress: Omit<TutorialProgress, 'startedAt' | 'lastAccessedAt'> = {
        userId,
        tutorialId,
        completedSections: [],
        completedChallenges: [],
        codeSubmissions: {},
        timeSpent: 0,
        score: 0,
        maxScore
      };

      await setDoc(docRef, {
        ...progress,
        startedAt: Timestamp.now(),
        lastAccessedAt: Timestamp.now()
      });

      // Update user activity
      await this.updateUserActivity(userId);
    } catch (error) {
      console.error('Error starting tutorial:', error);
      throw error;
    }
  }

  /**
   * Mark a section as completed
   */
  async completeSection(userId: string, tutorialId: number, sectionId: number): Promise<void> {
    try {
      const docRef = doc(db, this.PROGRESS_COLLECTION, `${userId}_${tutorialId}`);
      
      await updateDoc(docRef, {
        completedSections: arrayUnion(sectionId),
        lastAccessedAt: Timestamp.now()
      });

      await this.updateUserActivity(userId);
    } catch (error) {
      console.error('Error completing section:', error);
      throw error;
    }
  }

  /**
   * Submit code for a challenge
   */
  async submitChallenge(
    userId: string,
    tutorialId: number,
    challengeId: string,
    code: string,
    isCorrect: boolean,
    points: number
  ): Promise<void> {
    try {
      const docRef = doc(db, this.PROGRESS_COLLECTION, `${userId}_${tutorialId}`);
      
      const updates: any = {
        [`codeSubmissions.${challengeId}`]: code,
        lastAccessedAt: Timestamp.now()
      };

      if (isCorrect) {
        updates.completedChallenges = arrayUnion(challengeId);
        updates.score = increment(points);
      }

      await updateDoc(docRef, updates);

      if (isCorrect) {
        await this.updateUserActivity(userId);
      }
    } catch (error) {
      console.error('Error submitting challenge:', error);
      throw error;
    }
  }

  /**
   * Complete a tutorial and award badge
   */
  async completeTutorial(
    userId: string,
    tutorialId: number,
    badge: Omit<Badge, 'earnedAt'>
  ): Promise<void> {
    try {
      // Mark tutorial as completed
      const progressRef = doc(db, this.PROGRESS_COLLECTION, `${userId}_${tutorialId}`);
      await updateDoc(progressRef, {
        completedAt: Timestamp.now(),
        lastAccessedAt: Timestamp.now()
      });

      // Get current progress to calculate points
      const progressSnap = await getDoc(progressRef);
      const progress = progressSnap.data();
      const points = progress?.score || 0;

      // Update user data with badge and completion
      const userDataRef = doc(db, this.USER_DATA_COLLECTION, userId);
      const userDataSnap = await getDoc(userDataRef);
      
      if (userDataSnap.exists()) {
        const userData = userDataSnap.data();
        const existingBadges = userData.badges || [];
        
        // Check if badge already exists
        const badgeExists = existingBadges.some((b: any) => b.id === badge.id);
        
        if (!badgeExists) {
          await updateDoc(userDataRef, {
            completedTutorials: arrayUnion(tutorialId),
            badges: arrayUnion({
              ...badge,
              earnedAt: Timestamp.now()
            }),
            totalPoints: increment(points),
            lastActivityDate: Timestamp.now()
          });
          console.log(`🏆 Badge "${badge.name}" awarded to ${userId}`);
        } else {
          // Just update completion status without adding badge again
          await updateDoc(userDataRef, {
            completedTutorials: arrayUnion(tutorialId),
            lastActivityDate: Timestamp.now()
          });
          console.log(`✅ Tutorial ${tutorialId} completed (badge already earned)`);
        }
      }

      // Update streak
      await this.updateStreak(userId);
      
      console.log(`✅ Tutorial ${tutorialId} completed by ${userId}`);
    } catch (error) {
      console.error('Error completing tutorial:', error);
      throw error;
    }
  }

  /**
   * Update time spent on tutorial
   */
  async updateTimeSpent(userId: string, tutorialId: number, seconds: number): Promise<void> {
    try {
      const docRef = doc(db, this.PROGRESS_COLLECTION, `${userId}_${tutorialId}`);
      await updateDoc(docRef, {
        timeSpent: increment(seconds),
        lastAccessedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating time spent:', error);
    }
  }

  /**
   * Get all user progress
   */
  async getAllUserProgress(userId: string): Promise<TutorialProgress[]> {
    try {
      const q = query(
        collection(db, this.PROGRESS_COLLECTION),
        where('userId', '==', userId)
      );

      const snapshot = await getDocs(q);
      const progressList: TutorialProgress[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        progressList.push({
          ...data,
          startedAt: data.startedAt?.toDate() || new Date(),
          completedAt: data.completedAt?.toDate(),
          lastAccessedAt: data.lastAccessedAt?.toDate() || new Date()
        } as TutorialProgress);
      });

      return progressList;
    } catch (error) {
      console.error('Error getting all user progress:', error);
      return [];
    }
  }

  /**
   * Update user activity timestamp
   */
  private async updateUserActivity(userId: string): Promise<void> {
    try {
      const docRef = doc(db, this.USER_DATA_COLLECTION, userId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        await this.getUserData(userId);
        return;
      }

      await updateDoc(docRef, {
        lastActivityDate: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating user activity:', error);
    }
  }

  /**
   * Update user streak
   */
  private async updateStreak(userId: string): Promise<void> {
    try {
      const docRef = doc(db, this.USER_DATA_COLLECTION, userId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return;
      }

      const data = docSnap.data();
      const lastActivity = data.lastActivityDate?.toDate() || new Date(0);
      const now = new Date();
      const daysDiff = Math.floor((now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));

      let currentStreak = data.currentStreak || 0;
      let longestStreak = data.longestStreak || 0;

      if (daysDiff === 0) {
        // Same day, no change
        return;
      } else if (daysDiff === 1) {
        // Consecutive day
        currentStreak += 1;
      } else {
        // Streak broken
        currentStreak = 1;
      }

      if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
      }

      await updateDoc(docRef, {
        currentStreak,
        longestStreak,
        lastActivityDate: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating streak:', error);
    }
  }

  /**
   * Check if user has earned a badge
   */
  async hasBadge(userId: string, badgeId: string): Promise<boolean> {
    try {
      const userData = await this.getUserData(userId);
      return userData.badges.some(b => b.id === badgeId);
    } catch (error) {
      console.error('Error checking badge:', error);
      return false;
    }
  }

  /**
   * Get leaderboard (top users by points)
   */
  async getLeaderboard(limit: number = 10): Promise<UserTutorialData[]> {
    try {
      const q = query(collection(db, this.USER_DATA_COLLECTION));
      const snapshot = await getDocs(q);
      const users: UserTutorialData[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        users.push({
          ...data,
          lastActivityDate: data.lastActivityDate?.toDate() || new Date(),
          badges: data.badges?.map((b: any) => ({
            ...b,
            earnedAt: b.earnedAt?.toDate() || new Date()
          })) || []
        } as UserTutorialData);
      });

      // Sort by points and return top users
      return users
        .sort((a, b) => b.totalPoints - a.totalPoints)
        .slice(0, limit);
    } catch (error) {
      console.error('Error getting leaderboard:', error);
      return [];
    }
  }
}

export const tutorialProgressService = new TutorialProgressService();
