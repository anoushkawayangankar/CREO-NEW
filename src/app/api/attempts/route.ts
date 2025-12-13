import { NextRequest, NextResponse } from 'next/server';
import { getLessonById, getOrCreateUser, recordAttempt } from '@/lib/db';

type AttemptPayload = {
  userId?: string;
  lessonId: string;
  stepKey?: string;
  correct: boolean;
};

export async function POST(request: NextRequest) {
  try {
    const body: AttemptPayload = await request.json();
    if (!body.lessonId) {
      return NextResponse.json({ success: false, error: 'lessonId is required' }, { status: 400 });
    }

    const lesson = getLessonById(body.lessonId);
    if (!lesson) {
      return NextResponse.json({ success: false, error: 'Lesson not found' }, { status: 404 });
    }

    const profile = getOrCreateUser(body.userId ? { id: body.userId } : undefined);
    const result = recordAttempt({
      userId: profile.id,
      lessonId: body.lessonId,
      stepKey: body.stepKey,
      correct: Boolean(body.correct)
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          userId: profile.id,
          attempt: result.attempt,
          stats: result.stats,
          lesson: result.lesson
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('POST /api/attempts error', error);
    return NextResponse.json({ success: false, error: 'Failed to record attempt' }, { status: 500 });
  }
}
