import { db } from '../firebase/config';
import { 
  collection, 
  doc, 
  setDoc, 
  query,
  where,
  getDocs,
  orderBy,
  limit as firestoreLimit,
  Timestamp
} from 'firebase/firestore';

export interface Deployment {
  id: string;
  userId: string;
  projectId?: string;
  contractName: string;
  contractAddress: string;
  transactionHash: string;
  network: 'arbitrum-sepolia' | 'arbitrum-mainnet';
  gasUsed: string;
  blockNumber?: number;
  deployedAt: Date;
  status: 'success' | 'failed';
  error?: string;
}

class DeploymentHistoryService {
  private readonly DEPLOYMENTS_COLLECTION = 'deployments';

  /**
   * Record a new deployment
   */
  async recordDeployment(
    userId: string,
    deploymentData: Omit<Deployment, 'id' | 'userId' | 'deployedAt'>
  ): Promise<string> {
    try {
      const deploymentRef = doc(collection(db, this.DEPLOYMENTS_COLLECTION));
      const deploymentId = deploymentRef.id;

      const data = {
        id: deploymentId,
        userId,
        ...deploymentData,
        deployedAt: Timestamp.now(),
      };

      await setDoc(deploymentRef, data);
      console.log('✅ Deployment recorded:', deploymentId);
      
      return deploymentId;
    } catch (error) {
      console.error('Error recording deployment:', error);
      throw error;
    }
  }

  /**
   * Get all deployments for a user
   */
  async getUserDeployments(
    userId: string,
    limit: number = 50
  ): Promise<Deployment[]> {
    try {
      const q = query(
        collection(db, this.DEPLOYMENTS_COLLECTION),
        where('userId', '==', userId),
        orderBy('deployedAt', 'desc'),
        firestoreLimit(limit)
      );

      const snapshot = await getDocs(q);
      const deployments: Deployment[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        deployments.push({
          ...data,
          deployedAt: data.deployedAt?.toDate() || new Date(),
        } as Deployment);
      });

      return deployments;
    } catch (error) {
      console.error('Error getting deployments:', error);
      return [];
    }
  }

  /**
   * Get deployments for a specific project
   */
  async getProjectDeployments(projectId: string): Promise<Deployment[]> {
    try {
      const q = query(
        collection(db, this.DEPLOYMENTS_COLLECTION),
        where('projectId', '==', projectId),
        orderBy('deployedAt', 'desc')
      );

      const snapshot = await getDocs(q);
      const deployments: Deployment[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        deployments.push({
          ...data,
          deployedAt: data.deployedAt?.toDate() || new Date(),
        } as Deployment);
      });

      return deployments;
    } catch (error) {
      console.error('Error getting project deployments:', error);
      return [];
    }
  }

  /**
   * Get recent deployments across all users (for admin/stats)
   */
  async getRecentDeployments(limit: number = 10): Promise<Deployment[]> {
    try {
      const q = query(
        collection(db, this.DEPLOYMENTS_COLLECTION),
        where('status', '==', 'success'),
        orderBy('deployedAt', 'desc'),
        firestoreLimit(limit)
      );

      const snapshot = await getDocs(q);
      const deployments: Deployment[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        deployments.push({
          ...data,
          deployedAt: data.deployedAt?.toDate() || new Date(),
        } as Deployment);
      });

      return deployments;
    } catch (error) {
      console.error('Error getting recent deployments:', error);
      return [];
    }
  }

  /**
   * Get deployment count for user
   */
  async getDeploymentCount(userId: string): Promise<number> {
    try {
      const q = query(
        collection(db, this.DEPLOYMENTS_COLLECTION),
        where('userId', '==', userId),
        where('status', '==', 'success')
      );

      const snapshot = await getDocs(q);
      return snapshot.size;
    } catch (error) {
      console.error('Error getting deployment count:', error);
      return 0;
    }
  }

  /**
   * Get deployment statistics for user
   */
  async getDeploymentStats(userId: string): Promise<{
    total: number;
    successful: number;
    failed: number;
    networks: Record<string, number>;
  }> {
    try {
      const q = query(
        collection(db, this.DEPLOYMENTS_COLLECTION),
        where('userId', '==', userId)
      );

      const snapshot = await getDocs(q);
      
      let successful = 0;
      let failed = 0;
      const networks: Record<string, number> = {};

      snapshot.forEach((doc) => {
        const data = doc.data();
        
        if (data.status === 'success') {
          successful++;
        } else {
          failed++;
        }

        const network = data.network || 'unknown';
        networks[network] = (networks[network] || 0) + 1;
      });

      return {
        total: snapshot.size,
        successful,
        failed,
        networks,
      };
    } catch (error) {
      console.error('Error getting deployment stats:', error);
      return {
        total: 0,
        successful: 0,
        failed: 0,
        networks: {},
      };
    }
  }
}

export const deploymentHistoryService = new DeploymentHistoryService();
