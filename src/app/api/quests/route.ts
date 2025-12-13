import { NextRequest, NextResponse } from 'next/server';
import { claimQuestReward, getOrCreateUser, listQuestsForUser } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const userId = searchParams.get('userId') || undefined;
    const profile = getOrCreateUser(userId ? { id: userId } : undefined);
    const quests = listQuestsForUser(profile.id);

    return NextResponse.json({ success: true, data: { userId: profile.id, quests } }, { status: 200 });
  } catch (error) {
    console.error('GET /api/quests error', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch quests' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const userId = body.userId as string | undefined;
    const questId = body.questId as string | undefined;

    if (!questId) {
      return NextResponse.json({ success: false, error: 'questId is required' }, { status: 400 });
    }

    const profile = getOrCreateUser(userId ? { id: userId } : undefined);
    const claimed = claimQuestReward(profile.id, questId);

    if (!claimed) {
      return NextResponse.json({ success: false, error: 'Quest not ready to claim' }, { status: 400 });
    }

    const quests = listQuestsForUser(profile.id);
    return NextResponse.json({ success: true, data: { userId: profile.id, claimed, quests } }, { status: 200 });
  } catch (error) {
    console.error('POST /api/quests error', error);
    return NextResponse.json({ success: false, error: 'Failed to claim quest' }, { status: 500 });
  }
}
