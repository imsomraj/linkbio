// src/app/api/profile/route.ts
import { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ProfileUpdateSchema } from '@/lib/validations';
import {
  successResponse, unauthorizedResponse, validationErrorResponse, serverErrorResponse,
} from '@/lib/api-response';

export async function GET() {
  const session = await getSession();
  if (!session) return unauthorizedResponse();

  const profile = await prisma.profile.findUnique({
    where: { userId: session.sub },
    include: { theme: true },
  });

  return successResponse(profile);
}

export async function PUT(request: NextRequest) {
  const session = await getSession();
  if (!session) return unauthorizedResponse();

  try {
    const body = await request.json();
    const result = ProfileUpdateSchema.safeParse(body);
    if (!result.success) return validationErrorResponse(result.error.flatten());

    const profile = await prisma.profile.update({
      where: { userId: session.sub },
      data: result.data,
      include: { theme: true },
    });

    return successResponse(profile);
  } catch (error) {
    console.error('[PROFILE PUT]', error);
    return serverErrorResponse();
  }
}
