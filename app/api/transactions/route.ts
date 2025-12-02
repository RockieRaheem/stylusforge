import { NextRequest, NextResponse } from 'next/server';

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

const transactions = new Map<string, Transaction[]>();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const txHash = searchParams.get('hash');

    if (txHash) {
      // Find transaction by hash
      for (const userTxs of transactions.values()) {
        const tx = userTxs.find(t => t.hash === txHash);
        if (tx) {
          return NextResponse.json(tx);
        }
      }
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    if (userId) {
      const userTransactions = transactions.get(userId) || [];
      return NextResponse.json(userTransactions);
    }

    return NextResponse.json(
      { error: 'User ID or transaction hash required' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Transaction fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      type,
      hash,
      from,
      to,
      value,
      gasUsed,
      network,
      projectId,
      contractAddress,
    } = body;

    if (!userId || !type || !hash || !from || !value || !network) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const transaction: Transaction = {
      id: crypto.randomUUID(),
      userId,
      type,
      hash,
      from,
      to,
      value,
      gasUsed,
      status: 'pending',
      network,
      timestamp: new Date().toISOString(),
      projectId,
      contractAddress,
    };

    const userTransactions = transactions.get(userId) || [];
    userTransactions.push(transaction);
    transactions.set(userId, userTransactions);

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error('Transaction save error:', error);
    return NextResponse.json(
      { error: 'Failed to save transaction' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { hash, status, gasUsed } = body;

    if (!hash || !status) {
      return NextResponse.json(
        { error: 'Transaction hash and status required' },
        { status: 400 }
      );
    }

    // Find and update transaction
    for (const [userId, userTxs] of transactions.entries()) {
      const txIndex = userTxs.findIndex(t => t.hash === hash);
      if (txIndex >= 0) {
        userTxs[txIndex] = {
          ...userTxs[txIndex],
          status,
          ...(gasUsed && { gasUsed }),
        };
        transactions.set(userId, userTxs);
        return NextResponse.json(userTxs[txIndex]);
      }
    }

    return NextResponse.json(
      { error: 'Transaction not found' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Transaction update error:', error);
    return NextResponse.json(
      { error: 'Failed to update transaction' },
      { status: 500 }
    );
  }
}
