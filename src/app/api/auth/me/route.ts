// src/app/api/auth/me/route.ts
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { successResponse, unauthorizedResponse } from '@/lib/api-response';

export async function GET() {
  const session = await getSession();
  if (!session) return unauthorizedResponse();

  const user = await prisma.user.findUnique({
    where: { id: session.sub },
    include: { profile: { include: { theme: true } } },
  });

  if (!user) return unauthorizedResponse();

  return successResponse({
    id: user.id,
    email: user.email,
    username: user.username,
    plan: user.plan,
    profile: user.profile,
  });
}
