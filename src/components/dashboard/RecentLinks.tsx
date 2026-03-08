// src/components/dashboard/RecentLinks.tsx
import { MousePointerClick, ExternalLink } from 'lucide-react';
import { formatNumber } from '@/lib/utils';

interface Link { id: string; title: string; url: string; clickCount: number }
interface Props { links: Link[] }

export function RecentLinks({ links }: Props) {
  if (links.length === 0) return null;

  const maxClicks = Math.max(...links.map((l) => l.clickCount), 1);

  return (
    <div className="card">
      <h3 className="font-semibold text-white mb-4">Top Links by Clicks</h3>
      <div className="space-y-3">
        {links.map((link) => (
          <div key={link.id} className="flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-medium text-white truncate">{link.title}</p>
                <a href={link.url} target="_blank" rel="noopener" className="text-zinc-600 hover:text-zinc-400 flex-shrink-0">
                  <ExternalLink size={12} />
                </a>
              </div>
              <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-500 to-purple-500 rounded-full transition-all"
                  style={{ width: `${(link.clickCount / maxClicks) * 100}%` }}
                />
              </div>
            </div>
            <div className="flex items-center gap-1 text-zinc-400 flex-shrink-0">
              <MousePointerClick size={14} />
              <span className="text-sm font-medium">{formatNumber(link.clickCount)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
