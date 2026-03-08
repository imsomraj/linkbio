// src/app/api/click/[linkId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { trackEvent } from '@/lib/analytics';
import { isLinkActive } from '@/lib/utils';

export async function GET(request: NextRequest, { params }: { params: { linkId: string } }) {
  const link = await prisma.link.findUnique({
    where: { id: params.linkId },
    include: { user: { select: { id: true } } },
  });

  if (!link || !isLinkActive(link)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Track async
  trackEvent({
    userId: link.userId,
    linkId: link.id,
    event: 'LINK_CLICK',
    request,
  }).catch(console.error);

  return NextResponse.redirect(link.url);
}
