// src/app/api/links/[id]/route.ts
import { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { LinkUpdateSchema } from '@/lib/validations';
import {
  successResponse, unauthorizedResponse, notFoundResponse,
  validationErrorResponse, serverErrorResponse,
} from '@/lib/api-response';

interface Params { params: { id: string } }

export async function GET(_: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return unauthorizedResponse();

  const link = await prisma.link.findUnique({ where: { id: params.id, userId: session.sub } });
  if (!link) return notFoundResponse();
  return successResponse(link);
}

export async function PUT(request: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return unauthorizedResponse();

  try {
    const body = await request.json();
    const result = LinkUpdateSchema.safeParse(body);
    if (!result.success) return validationErrorResponse(result.error.flatten());

    const link = await prisma.link.update({
      where: { id: params.id, userId: session.sub },
      data: {
        ...result.data,
        publishAt: result.data.publishAt ? new Date(result.data.publishAt) : undefined,
        expireAt: result.data.expireAt ? new Date(result.data.expireAt) : undefined,
      },
    });

    return successResponse(link);
  } catch (error) {
    console.error('[LINK PUT]', error);
    return serverErrorResponse();
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return unauthorizedResponse();

  try {
    await prisma.link.delete({ where: { id: params.id, userId: session.sub } });
    return successResponse({ deleted: true });
  } catch {
    return serverErrorResponse();
  }
}
