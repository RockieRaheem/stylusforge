import { NextRequest, NextResponse } from 'next/server';

interface TutorialProgress {
  userId: string;
  tutorialId: number;
  completedSections: number[];
  assignmentCompleted: boolean;
  userCode: string;
  completedAt?: string;
}

const tutorialProgress = new Map<string, TutorialProgress[]>();

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

    const progress = tutorialProgress.get(userId) || [];
    return NextResponse.json(progress);
  } catch (error) {
    console.error('Progress fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, tutorialId, completedSections, assignmentCompleted, userCode } = body;

    if (!userId || tutorialId === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const userProgress = tutorialProgress.get(userId) || [];
    const existingIndex = userProgress.findIndex(p => p.tutorialId === tutorialId);

    const progress: TutorialProgress = {
      userId,
      tutorialId,
      completedSections: completedSections || [],
      assignmentCompleted: assignmentCompleted || false,
      userCode: userCode || '',
      ...(assignmentCompleted && { completedAt: new Date().toISOString() }),
    };

    if (existingIndex >= 0) {
      userProgress[existingIndex] = progress;
    } else {
      userProgress.push(progress);
    }

    tutorialProgress.set(userId, userProgress);

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Progress save error:', error);
    return NextResponse.json(
      { error: 'Failed to save progress' },
      { status: 500 }
    );
  }
}
