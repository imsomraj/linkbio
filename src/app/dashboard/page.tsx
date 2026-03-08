// src/app/dashboard/page.tsx
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getDashboardAnalytics } from '@/lib/analytics';
import { getProfileUrl } from '@/lib/utils';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { RecentLinks } from '@/components/dashboard/RecentLinks';
import { ClickChart } from '@/components/dashboard/ClickChart';
import { QuickActions } from '@/components/dashboard/QuickActions';

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) return null;

  const [stats, recentLinks] = await Promise.all([
    getDashboardAnalytics(session.sub),
    prisma.link.findMany({
      where: { userId: session.sub },
      orderBy: { clickCount: 'desc' },
      take: 5,
    }),
  ]);

  const profileUrl = getProfileUrl(session.username);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-display">Dashboard</h1>
          <p className="text-zinc-400 text-sm mt-1">
            Your page:{' '}
            <a href={profileUrl} target="_blank" rel="noopener" className="text-brand-400 hover:underline">
              {profileUrl.replace('http://', '').replace('https://', '')}
            </a>
          </p>
        </div>
      </div>

      <StatsCards
        totalClicks={stats.totalClicks}
        totalViews={stats.totalViews}
        totalLinks={recentLinks.length}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ClickChart dailyClicks={stats.dailyClicks} />
        </div>
        <div>
          <QuickActions username={session.username} />
        </div>
      </div>

      <RecentLinks links={stats.clicksByLink} />
    </div>
  );
}
