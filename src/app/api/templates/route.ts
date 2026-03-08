// src/app/api/templates/route.ts
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, serverErrorResponse } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const category = searchParams.get('category');
    const premium = searchParams.get('premium');

    const templates = await prisma.template.findMany({
      where: {
        isPublished: true,
        ...(category && { category }),
        ...(premium !== null && { isPremium: premium === 'true' }),
      },
      orderBy: [{ isPremium: 'asc' }, { usageCount: 'desc' }],
    });

    return successResponse(templates);
  } catch (error) {
    console.error('[TEMPLATES]', error);
    return serverErrorResponse();
  }
}
