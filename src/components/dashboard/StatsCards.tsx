// src/components/dashboard/StatsCards.tsx
import { MousePointerClick, Eye, Link2, TrendingUp } from 'lucide-react';
import { formatNumber } from '@/lib/utils';

interface Props {
  totalClicks: number;
  totalViews: number;
  totalLinks: number;
}

export function StatsCards({ totalClicks, totalViews, totalLinks }: Props) {
  const cards = [
    { label: 'Total Clicks', value: totalClicks, icon: MousePointerClick, color: 'from-brand-500 to-purple-500' },
    { label: 'Page Views', value: totalViews, icon: Eye, color: 'from-pink-500 to-rose-500' },
    { label: 'Active Links', value: totalLinks, icon: Link2, color: 'from-emerald-500 to-teal-500' },
    {
      label: 'Avg CTR',
      value: totalViews > 0 ? `${((totalClicks / totalViews) * 100).toFixed(1)}%` : '0%',
      icon: TrendingUp,
      color: 'from-orange-500 to-amber-500',
      raw: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ label, value, icon: Icon, color, raw }) => (
        <div key={label} className="card flex items-start gap-4">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0`}>
            <Icon size={18} className="text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white font-display">
              {raw ? value : formatNumber(value as number)}
            </p>
            <p className="text-xs text-zinc-500 mt-0.5">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
