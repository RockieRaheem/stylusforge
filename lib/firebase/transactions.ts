import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc,
  query, 
  where,
  orderBy,
  limit as firestoreLimit
} from 'firebase/firestore';
import { db } from './config';

export interface Transaction {
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

const TRANSACTIONS_COLLECTION = 'transactions';

export class TransactionService {
  // Create a new transaction record
  static async createTransaction(
    transactionData: Omit<Transaction, 'id' | 'timestamp'>
  ): Promise<Transaction> {
    const txRef = doc(collection(db, TRANSACTIONS_COLLECTION));
    
    const transaction: Transaction = {
      ...transactionData,
      id: txRef.id,
      timestamp: new Date().toISOString(),
    };

    await setDoc(txRef, transaction);
    return transaction;
  }

  // Get all transactions for a user
  static async getUserTransactions(
    userId: string, 
    limitCount: number = 50
  ): Promise<Transaction[]> {
    const q = query(
      collection(db, TRANSACTIONS_COLLECTION),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      firestoreLimit(limitCount)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as Transaction);
  }

  // Get transactions for a specific project
  static async getProjectTransactions(
    projectId: string, 
    limitCount: number = 50
  ): Promise<Transaction[]> {
    const q = query(
      collection(db, TRANSACTIONS_COLLECTION),
      where('projectId', '==', projectId),
      orderBy('timestamp', 'desc'),
      firestoreLimit(limitCount)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as Transaction);
  }

  // Get a single transaction
  static async getTransaction(transactionId: string): Promise<Transaction | null> {
    const docRef = doc(db, TRANSACTIONS_COLLECTION, transactionId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as Transaction;
    }
    return null;
  }

  // Update transaction status
  static async updateTransactionStatus(
    transactionId: string,
    status: Transaction['status'],
    updates?: Partial<Transaction>
  ): Promise<void> {
    const docRef = doc(db, TRANSACTIONS_COLLECTION, transactionId);
    await updateDoc(docRef, {
      status,
      ...updates,
    });
  }

  // Get gas statistics for a user
  static async getGasStats(userId: string): Promise<{
    totalTransactions: number;
    totalGasUsed: string;
    averageGasPrice: string;
    totalCost: string;
  }> {
    const transactions = await this.getUserTransactions(userId, 1000);
    const confirmed = transactions.filter(tx => tx.status === 'confirmed' && tx.gasUsed);

    const totalGasUsed = confirmed.reduce((sum, tx) => {
      return sum + BigInt(tx.gasUsed || '0');
    }, BigInt(0));

    const totalCost = confirmed.reduce((sum, tx) => {
      const gas = BigInt(tx.gasUsed || '0');
      const price = BigInt(tx.gasPrice || '0');
      return sum + (gas * price);
    }, BigInt(0));

    const avgGasPrice = confirmed.length > 0
      ? totalCost / BigInt(confirmed.length)
      : BigInt(0);

    return {
      totalTransactions: transactions.length,
      totalGasUsed: totalGasUsed.toString(),
      averageGasPrice: avgGasPrice.toString(),
      totalCost: totalCost.toString(),
    };
  }

  // Get recent transactions (for dashboard)
  static async getRecentTransactions(
    userId: string, 
    limitCount: number = 5
  ): Promise<Transaction[]> {
    return this.getUserTransactions(userId, limitCount);
  }
}
