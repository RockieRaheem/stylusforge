import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc,
  query, 
  where,
  orderBy
} from 'firebase/firestore';
import { db } from './config';

export interface TutorialProgress {
  userId: string;
  tutorialId: number;
  completedSections: number[];
  assignmentCompleted: boolean;
  userCode: string;
  completedAt?: string;
  lastAccessedAt: string;
}

const TUTORIAL_PROGRESS_COLLECTION = 'tutorialProgress';

export class TutorialService {
  // Save or update tutorial progress
  static async saveProgress(
    userId: string, 
    tutorialId: number, 
    progressData: Partial<TutorialProgress>
  ): Promise<TutorialProgress> {
    const docId = `${userId}_${tutorialId}`;
    const docRef = doc(db, TUTORIAL_PROGRESS_COLLECTION, docId);
    
    const progress: TutorialProgress = {
      userId,
      tutorialId,
      completedSections: progressData.completedSections || [],
      assignmentCompleted: progressData.assignmentCompleted || false,
      userCode: progressData.userCode || '',
      lastAccessedAt: new Date().toISOString(),
      ...(progressData.assignmentCompleted && !progressData.completedAt && {
        completedAt: new Date().toISOString()
      }),
      ...progressData,
    };

    await setDoc(docRef, progress, { merge: true });
    return progress;
  }

  // Get all progress for a user
  static async getUserProgress(userId: string): Promise<TutorialProgress[]> {
    const q = query(
      collection(db, TUTORIAL_PROGRESS_COLLECTION),
      where('userId', '==', userId),
      orderBy('lastAccessedAt', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as TutorialProgress);
  }

  // Get progress for a specific tutorial
  static async getTutorialProgress(
    userId: string, 
    tutorialId: number
  ): Promise<TutorialProgress | null> {
    const docId = `${userId}_${tutorialId}`;
    const docRef = doc(db, TUTORIAL_PROGRESS_COLLECTION, docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as TutorialProgress;
    }
    return null;
  }

  // Check if tutorial is completed
  static async isTutorialCompleted(userId: string, tutorialId: number): Promise<boolean> {
    const progress = await this.getTutorialProgress(userId, tutorialId);
    return progress?.assignmentCompleted || false;
  }

  // Get completion statistics
  static async getCompletionStats(userId: string): Promise<{
    totalCompleted: number;
    totalTutorials: number;
    completionPercentage: number;
  }> {
    const allProgress = await this.getUserProgress(userId);
    const completed = allProgress.filter(p => p.assignmentCompleted).length;
    const totalTutorials = 10; // Update based on your total tutorials

    return {
      totalCompleted: completed,
      totalTutorials,
      completionPercentage: Math.round((completed / totalTutorials) * 100),
    };
  }
}
