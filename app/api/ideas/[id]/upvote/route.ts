import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { rateLimit } from '@/lib/rateLimit';

// POST /api/ideas/[id]/upvote - Increment vote count
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    if (!rateLimit(ip, 20, 60000)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.', success: false },
        { status: 429 }
      );
    }

    const { id } = await context.params;

    // Atomic increment to prevent race conditions
    const idea = await prisma.idea.update({
      where: { id },
      data: {
        votes: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({ idea, success: true });
  } catch (error: unknown) {
    console.error('Error upvoting idea:', error);

    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2025') {
      return NextResponse.json({ error: 'Idea not found', success: false }, { status: 404 });
    }

    return NextResponse.json({ error: 'Failed to upvote idea', success: false }, { status: 500 });
  }
}

