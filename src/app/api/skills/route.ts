import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateUser, listLessonsForSkill, listSkillsWithProgress } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const userId = searchParams.get('userId') || undefined;
    const profile = getOrCreateUser(userId ? { id: userId } : undefined);
    const skills = listSkillsWithProgress(profile.id);

    const lessons = skills.reduce<Record<string, unknown>>((acc, skill) => {
      acc[skill.id] = listLessonsForSkill(skill.id);
      return acc;
    }, {});

    return NextResponse.json({ success: true, data: { userId: profile.id, skills, lessons } }, { status: 200 });
  } catch (error) {
    console.error('GET /api/skills error', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch skills' }, { status: 500 });
  }
}
