// src/components/dashboard/AnalyticsDashboard.tsx
'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { format } from 'date-fns';
import type { DashboardStats } from '@/types';
import { formatNumber } from '@/lib/utils';
import { MousePointerClick, Eye, TrendingUp } from 'lucide-react';

interface Props { stats: DashboardStats }

const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f97316', '#10b981', '#3b82f6'];

export function AnalyticsDashboard({ stats }: Props) {
  const { totalClicks, totalViews, clicksByLink, dailyClicks } = stats;

  const dailyData = dailyClicks.reduce<Record<string, number>>((acc, { date, count }) => {
    const d = format(new Date(date), 'MMM d');
    acc[d] = (acc[d] || 0) + count;
    return acc;
  }, {});

  const chartData = Object.entries(dailyData).map(([date, clicks]) => ({ date, clicks }));

  const topLinks = clicksByLink.slice(0, 6).map((l, i) => ({
    name: l.title.slice(0, 20) + (l.title.length > 20 ? '...' : ''),
    clicks: l.clickCount,
    color: COLORS[i % COLORS.length],
  }));

  return (
    <div className="space-y-6">
      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Clicks', value: totalClicks, icon: MousePointerClick, color: 'text-brand-400' },
          { label: 'Page Views', value: totalViews, icon: Eye, color: 'text-pink-400' },
          { label: 'CTR', value: totalViews > 0 ? `${((totalClicks / totalViews) * 100).toFixed(1)}%` : '0%', icon: TrendingUp, color: 'text-emerald-400', raw: true },
        ].map(({ label, value, icon: Icon, color, raw }) => (
          <div key={label} className="card flex items-center gap-4">
            <Icon size={24} className={color} />
            <div>
              <p className="text-2xl font-bold text-white font-display">
                {raw ? value : formatNumber(value as number)}
              </p>
              <p className="text-xs text-zinc-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Daily clicks bar chart */}
      <div className="card">
        <h3 className="font-semibold text-white mb-6">Daily Clicks (Last 30 Days)</h3>
        {chartData.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-zinc-600 text-sm">No data yet</div>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="date" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: '#a1a1aa' }}
                itemStyle={{ color: '#818cf8' }}
              />
              <Bar dataKey="clicks" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top links bar */}
        <div className="card">
          <h3 className="font-semibold text-white mb-4">Top Links</h3>
          <div className="space-y-3">
            {topLinks.length === 0 ? (
              <p className="text-zinc-600 text-sm">No link clicks recorded yet</p>
            ) : topLinks.map((link) => (
              <div key={link.name} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: link.color }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-zinc-300 truncate">{link.name}</span>
                    <span className="text-sm font-medium text-white ml-2">{link.clicks}</span>
                  </div>
                  <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        background: link.color,
                        width: `${Math.max((link.clicks / (topLinks[0]?.clicks || 1)) * 100, 2)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pie chart */}
        {topLinks.length > 0 && (
          <div className="card">
            <h3 className="font-semibold text-white mb-4">Click Distribution</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={topLinks}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  dataKey="clicks"
                  paddingAngle={2}
                >
                  {topLinks.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
