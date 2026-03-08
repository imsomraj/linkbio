// src/app/dashboard/analytics/page.tsx
import { getSession } from '@/lib/auth';
import { getDashboardAnalytics } from '@/lib/analytics';
import { AnalyticsDashboard } from '@/components/dashboard/AnalyticsDashboard';

export default async function AnalyticsPage() {
  const session = await getSession();
  if (!session) return null;

  const stats = await getDashboardAnalytics(session.sub);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white font-display">Analytics</h1>
        <p className="text-zinc-400 text-sm mt-1">Track your page performance</p>
      </div>
      <AnalyticsDashboard stats={stats} />
    </div>
  );
}
