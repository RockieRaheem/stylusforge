import { NextRequest, NextResponse } from 'next/server';

const users = new Map();

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, ...updateData } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    // Find user by ID
    let userEntry = null;
    for (const [address, user] of users.entries()) {
      if (user.id === userId) {
        userEntry = { address, user };
        break;
      }
    }

    if (!userEntry) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update user
    const updatedUser = { ...userEntry.user, ...updateData };
    users.set(userEntry.address, updatedUser);

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Update failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    for (const user of users.values()) {
      if (user.id === userId) {
        return NextResponse.json(user);
      }
    }

    return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: 'Fetch failed' },
      { status: 500 }
    );
  }
}
