import { NextRequest, NextResponse } from 'next/server';
import {
  getGameState,
  getOrCreateUser,
  listLessonsForSkill,
  listSkillsWithProgress,
  listQuestsForUser
} from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const userId = searchParams.get('userId') || undefined;

    const profile = getOrCreateUser(userId ? { id: userId } : undefined);
    const state = getGameState(profile.id);
    if (!state) {
      return NextResponse.json({ success: false, error: 'Unable to load state' }, { status: 500 });
    }

    const skills = listSkillsWithProgress(profile.id);
    const lessons = skills.reduce<Record<string, unknown>>((acc, skill) => {
      acc[skill.id] = listLessonsForSkill(skill.id);
      return acc;
    }, {});
    const quests = listQuestsForUser(profile.id);

    return NextResponse.json(
      {
        success: true,
        data: {
          profile,
          stats: state.stats,
          skills,
          lessons,
          quests
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET /api/game error', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch game state' }, { status: 500 });
  }
}
