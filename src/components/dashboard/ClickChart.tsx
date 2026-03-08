// src/components/dashboard/ClickChart.tsx
'use client';
import { format } from 'date-fns';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DailyClick { date: Date | string; count: number; linkId: string | null }
interface Props { dailyClicks: DailyClick[] }

export function ClickChart({ dailyClicks }: Props) {
  // Aggregate by date
  const aggregated = dailyClicks.reduce<Record<string, number>>((acc, { date, count }) => {
    const d = format(new Date(date), 'MMM d');
    acc[d] = (acc[d] || 0) + count;
    return acc;
  }, {});

  const data = Object.entries(aggregated).map(([date, clicks]) => ({ date, clicks }));

  return (
    <div className="card">
      <h3 className="font-semibold text-white mb-1">Clicks Over Time</h3>
      <p className="text-zinc-500 text-xs mb-6">Last 30 days</p>

      {data.length === 0 ? (
        <div className="h-48 flex items-center justify-center text-zinc-600 text-sm">
          No click data yet. Share your link to get started!
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="clicks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="date" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: '#a1a1aa' }}
              itemStyle={{ color: '#818cf8' }}
            />
            <Area type="monotone" dataKey="clicks" stroke="#6366f1" strokeWidth={2} fill="url(#clicks)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
