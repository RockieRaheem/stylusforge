import { NextRequest, NextResponse } from 'next/server';

// In production, this would connect to a database
const users = new Map();

export async function POST(request: NextRequest) {
  try {
    const { address } = await request.json();

    if (!address) {
      return NextResponse.json(
        { error: 'Wallet address required' },
        { status: 400 }
      );
    }

    // Check if user exists
    let user = users.get(address);

    if (!user) {
      // Create new user
      user = {
        id: crypto.randomUUID(),
        address,
        username: `user_${address.slice(0, 6)}`,
        createdAt: new Date().toISOString(),
      };
      users.set(address, user);
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}
