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
  orderBy,
  limit,
  deleteDoc,
  serverTimestamp 
} from 'firebase/firestore';

export interface Project {
  id: string;
  userId: string;
  name: string;
  description?: string;
  language: 'rust' | 'c' | 'cpp';
  code: string;
  createdAt: Date;
  updatedAt: Date;
  deployedAddress?: string;
  network?: 'arbitrum-sepolia' | 'arbitrum-mainnet';
  isDeployed: boolean;
}

class ProjectService {
  private readonly PROJECTS_COLLECTION = 'projects';
  private readonly USERS_COLLECTION = 'users';

  /**
   * Create a new project
   */
  async createProject(
    userId: string,
    name: string,
    code: string,
    language: 'rust' | 'c' | 'cpp' = 'rust',
    description?: string
  ): Promise<string> {
    try {
      const projectRef = doc(collection(db, this.PROJECTS_COLLECTION));
      const projectId = projectRef.id;

      const projectData: any = {
        id: projectId,
        userId,
        name,
        description: description || '',
        language,
        code,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isDeployed: false,
      };

      await setDoc(projectRef, projectData);

      // Update user stats
      await this.incrementProjectCount(userId);

      return projectId;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }

  /**
   * Get a project by ID
   */
  async getProject(projectId: string): Promise<Project | null> {
    try {
      const projectRef = doc(db, this.PROJECTS_COLLECTION, projectId);
      const projectDoc = await getDoc(projectRef);

      if (projectDoc.exists()) {
        const data = projectDoc.data();
        return {
          id: data.id,
          userId: data.userId,
          name: data.name,
          description: data.description,
          language: data.language,
          code: data.code,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          deployedAddress: data.deployedAddress,
          network: data.network,
          isDeployed: data.isDeployed || false,
        };
      }

      return null;
    } catch (error) {
      console.error('Error getting project:', error);
      return null;
    }
  }

  /**
   * Get all projects for a user
   */
  async getUserProjects(userId: string, limitCount: number = 100): Promise<Project[]> {
    try {
      // Query without orderBy to avoid composite index requirement
      const q = query(
        collection(db, this.PROJECTS_COLLECTION),
        where('userId', '==', userId),
        limit(limitCount)
      );

      const snapshot = await getDocs(q);
      const projects: Project[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        projects.push({
          id: data.id,
          userId: data.userId,
          name: data.name,
          description: data.description,
          language: data.language,
          code: data.code,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          deployedAddress: data.deployedAddress,
          network: data.network,
          isDeployed: data.isDeployed || false,
        });
      });

      // Sort in memory by updatedAt descending
      return projects.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    } catch (error) {
      console.error('Error getting user projects:', error);
      return [];
    }
  }

  /**
   * Update a project
   */
  async updateProject(
    projectId: string,
    updates: Partial<Omit<Project, 'id' | 'userId' | 'createdAt'>>
  ): Promise<void> {
    try {
      const projectRef = doc(db, this.PROJECTS_COLLECTION, projectId);
      
      const updateData: any = {
        ...updates,
        updatedAt: serverTimestamp(),
      };

      await updateDoc(projectRef, updateData);
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  }

  /**
   * Mark project as deployed
   */
  async markAsDeployed(
    projectId: string,
    contractAddress: string,
    network: 'arbitrum-sepolia' | 'arbitrum-mainnet'
  ): Promise<void> {
    try {
      await this.updateProject(projectId, {
        deployedAddress: contractAddress,
        network,
        isDeployed: true,
      });
    } catch (error) {
      console.error('Error marking project as deployed:', error);
      throw error;
    }
  }

  /**
   * Delete a project
   */
  async deleteProject(projectId: string): Promise<void> {
    try {
      const projectRef = doc(db, this.PROJECTS_COLLECTION, projectId);
      await deleteDoc(projectRef);
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  }

  /**
   * Get project count for user
   */
  async getProjectCount(userId: string): Promise<number> {
    try {
      const q = query(
        collection(db, this.PROJECTS_COLLECTION),
        where('userId', '==', userId)
      );

      const snapshot = await getDocs(q);
      return snapshot.size;
    } catch (error) {
      console.error('Error getting project count:', error);
      return 0;
    }
  }

  /**
   * Get deployed project count for user
   */
  async getDeployedProjectCount(userId: string): Promise<number> {
    try {
      const q = query(
        collection(db, this.PROJECTS_COLLECTION),
        where('userId', '==', userId),
        where('isDeployed', '==', true)
      );

      const snapshot = await getDocs(q);
      return snapshot.size;
    } catch (error) {
      console.error('Error getting deployed project count:', error);
      return 0;
    }
  }

  /**
   * Increment user's project count
   */
  private async incrementProjectCount(userId: string): Promise<void> {
    try {
      const userRef = doc(db, this.USERS_COLLECTION, userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const currentCount = userDoc.data()?.stats?.projectsCreated || 0;
        await updateDoc(userRef, {
          'stats.projectsCreated': currentCount + 1,
        });
      }
    } catch (error) {
      console.error('Error incrementing project count:', error);
    }
  }
}

export const projectService = new ProjectService();
