// src/app/api/themes/route.ts
import { prisma } from '@/lib/prisma';
import { successResponse, serverErrorResponse } from '@/lib/api-response';

export async function GET() {
  try {
    const themes = await prisma.theme.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
    return successResponse(themes);
  } catch (error) {
    console.error('[THEMES]', error);
    return serverErrorResponse();
  }
}
