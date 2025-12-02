import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy,
  limit,
  Timestamp,
  DocumentData
} from 'firebase/firestore';
import { db } from './config';

export interface Project {
  id: string;
  userId: string;
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

const PROJECTS_COLLECTION = 'projects';

export class ProjectService {
  // Create a new project
  static async createProject(projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    const projectRef = doc(collection(db, PROJECTS_COLLECTION));
    const timestamp = new Date().toISOString();
    
    const project: Project = {
      ...projectData,
      id: projectRef.id,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    await setDoc(projectRef, project);
    return project;
  }

  // Get all projects for a user
  static async getUserProjects(userId: string): Promise<Project[]> {
    const q = query(
      collection(db, PROJECTS_COLLECTION),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as Project);
  }

  // Get a single project by ID
  static async getProject(projectId: string): Promise<Project | null> {
    const docRef = doc(db, PROJECTS_COLLECTION, projectId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as Project;
    }
    return null;
  }

  // Update a project
  static async updateProject(projectId: string, updates: Partial<Project>): Promise<void> {
    const docRef = doc(db, PROJECTS_COLLECTION, projectId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  }

  // Delete a project
  static async deleteProject(projectId: string): Promise<void> {
    const docRef = doc(db, PROJECTS_COLLECTION, projectId);
    await deleteDoc(docRef);
  }

  // Mark project as deployed
  static async markAsDeployed(
    projectId: string, 
    deployedAddress: string, 
    network: string
  ): Promise<void> {
    await this.updateProject(projectId, {
      isDeployed: true,
      deployedAddress,
      network,
    });
  }
}
