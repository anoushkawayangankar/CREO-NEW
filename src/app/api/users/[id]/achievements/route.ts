import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/app/api/auth/helpers';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { user, response } = await requireAuth(req);
  if (!user) return response!;

  const p = await params;
  const achievements = await prisma.userAchievement.findMany({
    where: { userId: p.id },
    include: { achievement: true }
  });

  return NextResponse.json({
    success: true,
    data: achievements.map((ua) => ({
      id: ua.achievementId,
      progress: ua.progress,
      completed: ua.completed,
      achievement: ua.achievement
    }))
  });
}
