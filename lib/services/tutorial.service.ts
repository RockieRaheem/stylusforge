import { db } from '../firebase/config';
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';

export interface TutorialProgress {
  userId: string;
  tutorialId: number;
  completedSections: number[];
  assignmentCompleted: boolean;
  userCode?: string;
  completedAt?: Date;
  lastAccessedAt: Date;
  progressPercent: number;
}

export interface UserStats {
  totalTutorialsCompleted: number;
  totalProjectsCreated: number;
  totalDeployments: number;
  totalGasSaved: number;
  currentStreak: number;
  lastActivityDate?: Date;
}

class TutorialService {
  private readonly TUTORIALS_COLLECTION = 'tutorialProgress';
  private readonly USERS_COLLECTION = 'users';

  /**
   * Get user's progress for a specific tutorial
   */
  async getTutorialProgress(userId: string, tutorialId: number): Promise<TutorialProgress | null> {
    try {
      const progressRef = doc(db, this.TUTORIALS_COLLECTION, `${userId}_${tutorialId}`);
      const progressDoc = await getDoc(progressRef);

      if (progressDoc.exists()) {
        const data = progressDoc.data();
        return {
          userId,
          tutorialId,
          completedSections: data.completedSections || [],
          assignmentCompleted: data.assignmentCompleted || false,
          userCode: data.userCode,
          completedAt: data.completedAt?.toDate(),
          lastAccessedAt: data.lastAccessedAt?.toDate() || new Date(),
          progressPercent: data.progressPercent || 0,
        };
      }

      return null;
    } catch (error) {
      console.error('Error getting tutorial progress:', error);
      return null;
    }
  }

  /**
   * Get all tutorial progress for a user
   */
  async getAllUserProgress(userId: string): Promise<Map<number, TutorialProgress>> {
    try {
      const progressMap = new Map<number, TutorialProgress>();
      const q = query(
        collection(db, this.TUTORIALS_COLLECTION),
        where('userId', '==', userId)
      );
      
      const snapshot = await getDocs(q);
      snapshot.forEach((doc) => {
        const data = doc.data();
        const progress: TutorialProgress = {
          userId: data.userId,
          tutorialId: data.tutorialId,
          completedSections: data.completedSections || [],
          assignmentCompleted: data.assignmentCompleted || false,
          userCode: data.userCode,
          completedAt: data.completedAt?.toDate(),
          lastAccessedAt: data.lastAccessedAt?.toDate() || new Date(),
          progressPercent: data.progressPercent || 0,
        };
        progressMap.set(data.tutorialId, progress);
      });

      return progressMap;
    } catch (error) {
      console.error('Error getting all user progress:', error);
      return new Map();
    }
  }

  /**
   * Update tutorial progress
   */
  async updateTutorialProgress(
    userId: string,
    tutorialId: number,
    updates: Partial<TutorialProgress>
  ): Promise<void> {
    try {
      const progressRef = doc(db, this.TUTORIALS_COLLECTION, `${userId}_${tutorialId}`);
      const progressDoc = await getDoc(progressRef);

      const data: any = {
        userId,
        tutorialId,
        lastAccessedAt: serverTimestamp(),
        ...updates,
      };

      if (!progressDoc.exists()) {
        // Create new progress document
        data.completedSections = updates.completedSections || [];
        data.assignmentCompleted = updates.assignmentCompleted || false;
        data.progressPercent = updates.progressPercent || 0;
        await setDoc(progressRef, data);
      } else {
        // Update existing document
        await updateDoc(progressRef, data);
      }
    } catch (error) {
      console.error('Error updating tutorial progress:', error);
      throw error;
    }
  }

  /**
   * Mark a section as completed
   */
  async completeTutorialSection(
    userId: string,
    tutorialId: number,
    sectionId: number,
    totalSections: number
  ): Promise<void> {
    try {
      const currentProgress = await this.getTutorialProgress(userId, tutorialId);
      const completedSections = currentProgress?.completedSections || [];
      
      if (!completedSections.includes(sectionId)) {
        completedSections.push(sectionId);
      }

      const progressPercent = Math.round((completedSections.length / totalSections) * 100);

      await this.updateTutorialProgress(userId, tutorialId, {
        completedSections,
        progressPercent,
      });
    } catch (error) {
      console.error('Error completing tutorial section:', error);
      throw error;
    }
  }

  /**
   * Mark entire tutorial as completed
   */
  async completeTutorial(userId: string, tutorialId: number): Promise<void> {
    try {
      await this.updateTutorialProgress(userId, tutorialId, {
        assignmentCompleted: true,
        completedAt: new Date(),
        progressPercent: 100,
      });

      // Update user stats
      await this.updateUserStats(userId);
    } catch (error) {
      console.error('Error completing tutorial:', error);
      throw error;
    }
  }

  /**
   * Save user's code for a tutorial
   */
  async saveUserCode(userId: string, tutorialId: number, code: string): Promise<void> {
    try {
      await this.updateTutorialProgress(userId, tutorialId, {
        userCode: code,
      });
    } catch (error) {
      console.error('Error saving user code:', error);
      throw error;
    }
  }

  /**
   * Get user statistics
   */
  async getUserStats(userId: string): Promise<UserStats> {
    try {
      // Get actual deployment count from deployments collection
      const { deploymentHistoryService } = await import('./deployment-history.service');
      const actualDeploymentCount = await deploymentHistoryService.getDeploymentCount(userId);
      
      const userRef = doc(db, this.USERS_COLLECTION, userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const data = userDoc.data();
        return {
          totalTutorialsCompleted: data.stats?.tutorialsCompleted || 0,
          totalProjectsCreated: data.stats?.projectsCreated || 0,
          totalDeployments: actualDeploymentCount, // Use actual count from deployments
          totalGasSaved: data.stats?.totalGasSaved || 0,
          currentStreak: data.stats?.currentStreak || 0,
          lastActivityDate: data.stats?.lastActivityDate?.toDate(),
        };
      }

      return {
        totalTutorialsCompleted: 0,
        totalProjectsCreated: 0,
        totalDeployments: actualDeploymentCount, // Use actual count
        totalGasSaved: 0,
        currentStreak: 0,
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      return {
        totalTutorialsCompleted: 0,
        totalProjectsCreated: 0,
        totalDeployments: 0,
        totalGasSaved: 0,
        currentStreak: 0,
      };
    }
  }

  /**
   * Update user statistics
   */
  private async updateUserStats(userId: string): Promise<void> {
    try {
      const userRef = doc(db, this.USERS_COLLECTION, userId);
      const allProgress = await this.getAllUserProgress(userId);
      
      const completedTutorials = Array.from(allProgress.values()).filter(
        (progress) => progress.assignmentCompleted
      ).length;

      // Calculate streak
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();
      const lastActivity = userData?.stats?.lastActivityDate?.toDate();
      
      let currentStreak = userData?.stats?.currentStreak || 0;
      
      if (lastActivity) {
        const lastActivityDate = new Date(lastActivity);
        lastActivityDate.setHours(0, 0, 0, 0);
        
        const daysDiff = Math.floor((today.getTime() - lastActivityDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === 0) {
          // Same day, don't increment
        } else if (daysDiff === 1) {
          // Consecutive day, increment streak
          currentStreak += 1;
        } else {
          // Streak broken, reset to 1
          currentStreak = 1;
        }
      } else {
        currentStreak = 1;
      }

      await updateDoc(userRef, {
        'stats.tutorialsCompleted': completedTutorials,
        'stats.lastActivityDate': serverTimestamp(),
        'stats.currentStreak': currentStreak,
      });
    } catch (error) {
      console.error('Error updating user stats:', error);
    }
  }

  /**
   * Get completed tutorial count
   */
  async getCompletedTutorialCount(userId: string): Promise<number> {
    try {
      const allProgress = await this.getAllUserProgress(userId);
      return Array.from(allProgress.values()).filter(
        (progress) => progress.assignmentCompleted
      ).length;
    } catch (error) {
      console.error('Error getting completed tutorial count:', error);
      return 0;
    }
  }
}

export const tutorialService = new TutorialService();
