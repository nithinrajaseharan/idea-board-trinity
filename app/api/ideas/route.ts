import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createIdeaSchema } from '@/lib/validators';
import { rateLimit } from '@/lib/rateLimit';

// GET /api/ideas - Fetch all ideas with optional sorting
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sort = searchParams.get('sort') || 'new';
    const limit = parseInt(searchParams.get('limit') || '50');

    const orderBy = sort === 'top' ? { votes: 'desc' as const } : { createdAt: 'desc' as const };

    const ideas = await prisma.idea.findMany({
      orderBy,
      take: limit,
    });

    return NextResponse.json({ ideas, success: true });
  } catch (error) {
    console.error('Error fetching ideas:', error);
    return NextResponse.json({ error: 'Failed to fetch ideas', success: false }, { status: 500 });
  }
}

// POST /api/ideas - Create a new idea
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    if (!rateLimit(ip, 10, 60000)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.', success: false },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validatedData = createIdeaSchema.parse(body);

    const idea = await prisma.idea.create({
      data: {
        text: validatedData.text,
      },
    });

    return NextResponse.json({ idea, success: true }, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating idea:', error);

    // Handle Zod validation errors
    if (
      typeof error === 'object' && 
      error !== null && 
      'name' in error && 
      error.name === 'ZodError' &&
      'errors' in error &&
      Array.isArray((error as { errors: unknown }).errors)
    ) {
      const zodError = error as { errors: Array<{ message?: string }> };
      return NextResponse.json(
        { error: zodError.errors[0]?.message || 'Invalid input', success: false },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: 'Failed to create idea', success: false }, { status: 500 });
  }
}

