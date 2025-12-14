import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/app/api/auth/helpers';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { user, response } = await requireAuth(req);
  if (!user) return response!;

  const p = await params;
  const activity = await prisma.activity.findUnique({ where: { id: p.id } });
  if (!activity) {
    return NextResponse.json({ success: false, error: 'Activity not found' }, { status: 404 });
  }

  await prisma.activity.update({
    where: { id: p.id },
    data: {
      metadata: JSON.stringify({
        ...(activity.metadata ? JSON.parse(activity.metadata) : {}),
        celebratedBy: [
          ...((activity.metadata ? JSON.parse(activity.metadata) : {})?.celebratedBy ?? []),
          user.id
        ]
      })
    }
  });

  return NextResponse.json({ success: true });
} 
