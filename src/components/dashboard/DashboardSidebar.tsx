// src/components/dashboard/DashboardSidebar.tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Link2, Palette, BarChart2, QrCode, Settings, LogOut, ExternalLink, LayoutTemplate } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/links', icon: Link2, label: 'Links' },
  { href: '/dashboard/appearance', icon: Palette, label: 'Appearance' },
  { href: '/dashboard/analytics', icon: BarChart2, label: 'Analytics' },
  { href: '/dashboard/qr', icon: QrCode, label: 'QR Code' },
  { href: '/dashboard/templates', icon: LayoutTemplate, label: 'Templates' },
  { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

interface Props { username: string }

export function DashboardSidebar({ username }: Props) {
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  return (
    <aside className="hidden md:flex flex-col w-64 min-h-screen bg-zinc-950 border-r border-zinc-800 p-4">
      <div className="mb-8 px-2 pt-2">
        <span className="font-display font-bold text-xl gradient-text">LinkBio</span>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                active
                  ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}

        <a
          href={`/${username}`}
          target="_blank"
          rel="noopener"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
        >
          <ExternalLink size={18} />
          View My Page
        </a>
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-500 hover:text-red-400 hover:bg-red-500/5 transition-all w-full"
      >
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
}
