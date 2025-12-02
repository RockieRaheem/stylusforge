import { NextRequest, NextResponse } from 'next/server';
import { TutorialService } from '@/lib/firebase/tutorials';

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

    const progress = await TutorialService.getUserProgress(userId);
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

    const progress = await TutorialService.saveProgress(userId, tutorialId, {
      completedSections,
      assignmentCompleted,
      userCode,
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Progress save error:', error);
    return NextResponse.json(
      { error: 'Failed to save progress' },
      { status: 500 }
    );
  }
}
