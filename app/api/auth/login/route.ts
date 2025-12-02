import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@/lib/firebase/users';

export async function POST(request: NextRequest) {
  try {
    const { address } = await request.json();

    if (!address) {
      return NextResponse.json(
        { error: 'Wallet address required' },
        { status: 400 }
      );
    }

    // Create or update user in Firebase
    const user = await UserService.upsertUser(address, {
      username: `user_${address.slice(0, 6)}`,
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}
