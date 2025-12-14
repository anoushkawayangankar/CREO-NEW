import { NextRequest, NextResponse } from 'next/server';
import { buildQuizFromSnapshot, ensureSnapshot } from '@/app/lib/moduleEngine';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const moduleId = body?.moduleId as string | undefined;
    if (!moduleId || typeof moduleId !== 'string') {
      return NextResponse.json({ success: false, error: 'moduleId is required' }, { status: 400 });
    }

    const { snapshot, source } = await ensureSnapshot({
      moduleId,
      course: body.course,
      difficulty: body.difficulty,
      title: body.title,
      depth: body.depth
    });

    const payload = await buildQuizFromSnapshot(snapshot);

    return NextResponse.json(
      {
        success: true,
        data: payload,
        meta: {
          snapshotSource: source,
          generatedBy: snapshot.generatedBy
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('POST /api/practice error', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load practice content' },
      { status: 500 }
    );
  }
}
