// src/app/api/links/route.ts
import { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { LinkCreateSchema, ReorderLinksSchema } from '@/lib/validations';
import {
  successResponse, errorResponse, unauthorizedResponse,
  validationErrorResponse, serverErrorResponse,
} from '@/lib/api-response';

export async function GET() {
  const session = await getSession();
  if (!session) return unauthorizedResponse();

  const links = await prisma.link.findMany({
    where: { userId: session.sub },
    orderBy: [{ isPinned: 'desc' }, { position: 'asc' }],
  });

  return successResponse(links);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return unauthorizedResponse();

  try {
    const body = await request.json();
    const result = LinkCreateSchema.safeParse(body);
    if (!result.success) return validationErrorResponse(result.error.flatten());

    const lastLink = await prisma.link.findFirst({
      where: { userId: session.sub },
      orderBy: { position: 'desc' },
    });

    const link = await prisma.link.create({
      data: {
        ...result.data,
        userId: session.sub,
        position: (lastLink?.position ?? -1) + 1,
        publishAt: result.data.publishAt ? new Date(result.data.publishAt) : null,
        expireAt: result.data.expireAt ? new Date(result.data.expireAt) : null,
      },
    });

    return successResponse(link, 201);
  } catch (error) {
    console.error('[LINKS POST]', error);
    return serverErrorResponse();
  }
}

export async function PATCH(request: NextRequest) {
  const session = await getSession();
  if (!session) return unauthorizedResponse();

  try {
    const body = await request.json();

    // Reorder
    if (body.links) {
      const result = ReorderLinksSchema.safeParse(body);
      if (!result.success) return validationErrorResponse(result.error.flatten());

      await prisma.$transaction(
        result.data.links.map(({ id, position }) =>
          prisma.link.update({
            where: { id, userId: session.sub },
            data: { position },
          })
        )
      );
      return successResponse({ reordered: true });
    }

    return errorResponse('Invalid request');
  } catch (error) {
    console.error('[LINKS PATCH]', error);
    return serverErrorResponse();
  }
}
