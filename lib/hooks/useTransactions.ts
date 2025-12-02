import { useState, useEffect } from 'react';

interface Transaction {
  id: string;
  userId: string;
  type: 'deployment' | 'funding' | 'withdrawal' | 'refund';
  hash: string;
  from: string;
  to?: string;
  value: string;
  gasUsed?: string;
  status: 'pending' | 'confirmed' | 'failed';
  network: string;
  timestamp: string;
  projectId?: string;
  contractAddress?: string;
}

export function useTransactions(userId: string | null) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/transactions?userId=${userId}`);
      if (!response.ok) throw new Error('Failed to fetch transactions');
      
      const data = await response.json();
      setTransactions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (txData: Omit<Transaction, 'id' | 'timestamp' | 'status'>) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(txData),
      });
      
      if (!response.ok) throw new Error('Failed to add transaction');
      
      const newTx = await response.json();
      setTransactions(prev => [newTx, ...prev]);
      return newTx;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTransactionStatus = async (
    hash: string,
    status: 'pending' | 'confirmed' | 'failed',
    gasUsed?: string
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/transactions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hash, status, gasUsed }),
      });
      
      if (!response.ok) throw new Error('Failed to update transaction');
      
      const updatedTx = await response.json();
      setTransactions(prev =>
        prev.map(tx => (tx.hash === hash ? updatedTx : tx))
      );
      return updatedTx;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getGasStats = () => {
    const confirmedTxs = transactions.filter(tx => tx.status === 'confirmed' && tx.gasUsed);
    
    if (confirmedTxs.length === 0) {
      return { totalGas: '0', avgGas: '0', count: 0 };
    }

    const totalGas = confirmedTxs.reduce((sum, tx) => sum + Number(tx.gasUsed || 0), 0);
    const avgGas = Math.floor(totalGas / confirmedTxs.length);

    return {
      totalGas: totalGas.toString(),
      avgGas: avgGas.toString(),
      count: confirmedTxs.length,
    };
  };

  useEffect(() => {
    fetchTransactions();
  }, [userId]);

  return {
    transactions,
    loading,
    error,
    fetchTransactions,
    addTransaction,
    updateTransactionStatus,
    getGasStats,
  };
}
