import { NextRequest, NextResponse } from 'next/server';
import { TransactionService } from '@/lib/firebase/transactions';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const txId = searchParams.get('id');
    const projectId = searchParams.get('projectId');

    if (txId) {
      const tx = await TransactionService.getTransaction(txId);
      if (!tx) {
        return NextResponse.json(
          { error: 'Transaction not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(tx);
    }

    if (projectId) {
      const txs = await TransactionService.getProjectTransactions(projectId);
      return NextResponse.json(txs);
    }

    if (userId) {
      const userTransactions = await TransactionService.getUserTransactions(userId);
      return NextResponse.json(userTransactions);
    }

    return NextResponse.json(
      { error: 'User ID, project ID or transaction ID required' },
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
      projectId,
      type,
      hash,
      from,
      to,
      value,
      gasUsed,
      gasPrice,
      network,
      status,
    } = body;

    if (!userId || !projectId || !type || !hash || !from || !network) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const transaction = await TransactionService.createTransaction({
      userId,
      projectId,
      type,
      hash,
      from,
      to,
      value,
      gasUsed,
      gasPrice,
      status: status || 'pending',
      network,
    });

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
    const { id, status, gasUsed, gasPrice, blockNumber, error } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: 'Transaction ID and status required' },
        { status: 400 }
      );
    }

    await TransactionService.updateTransactionStatus(id, status, {
      gasUsed,
      gasPrice,
      blockNumber,
      error,
    });

    const updated = await TransactionService.getTransaction(id);
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Transaction update error:', error);
    return NextResponse.json(
      { error: 'Failed to update transaction' },
      { status: 500 }
    );
  }
}
