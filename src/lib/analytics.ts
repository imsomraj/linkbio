// src/lib/analytics.ts
import { prisma } from './prisma';
import { NextRequest } from 'next/server';

export function getDeviceType(userAgent: string): string {
  if (/mobile/i.test(userAgent)) return 'mobile';
  if (/tablet|ipad/i.test(userAgent)) return 'tablet';
  return 'desktop';
}

export function getBrowser(userAgent: string): string {
  if (/chrome/i.test(userAgent) && !/edg/i.test(userAgent)) return 'Chrome';
  if (/firefox/i.test(userAgent)) return 'Firefox';
  if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) return 'Safari';
  if (/edg/i.test(userAgent)) return 'Edge';
  if (/op/i.test(userAgent)) return 'Opera';
  return 'Other';
}

export function getClientIP(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    '0.0.0.0'
  );
}

export async function trackEvent({
  userId,
  linkId,
  event,
  request,
}: {
  userId: string;
  linkId?: string;
  event: 'PAGE_VIEW' | 'LINK_CLICK' | 'PROFILE_VIEW';
  request: NextRequest;
}) {
  const ua = request.headers.get('user-agent') || '';
  const ip = getClientIP(request);
  const referrer = request.headers.get('referer') || '';

  await prisma.analytics.create({
    data: {
      userId,
      linkId,
      event,
      ipAddress: ip,
      userAgent: ua,
      referrer,
      deviceType: getDeviceType(ua),
      browser: getBrowser(ua),
    },
  });

  if (linkId && event === 'LINK_CLICK') {
    await prisma.link.update({
      where: { id: linkId },
      data: { clickCount: { increment: 1 } },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await prisma.clickDaily.upsert({
      where: { userId_linkId_date: { userId, linkId, date: today } },
      create: { userId, linkId, date: today, count: 1 },
      update: { count: { increment: 1 } },
    });
  }
}

export async function getDashboardAnalytics(userId: string) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [totalClicks, totalViews, clicksByLink, dailyClicks] = await Promise.all([
    prisma.analytics.count({ where: { userId, event: 'LINK_CLICK' } }),
    prisma.analytics.count({ where: { userId, event: 'PAGE_VIEW' } }),
    prisma.link.findMany({
      where: { userId },
      select: { id: true, title: true, url: true, clickCount: true },
      orderBy: { clickCount: 'desc' },
      take: 10,
    }),
    prisma.clickDaily.findMany({
      where: { userId, date: { gte: thirtyDaysAgo } },
      orderBy: { date: 'asc' },
    }),
  ]);

  return { totalClicks, totalViews, clicksByLink, dailyClicks };
}
