// src/components/dashboard/DashboardHeader.tsx
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, LayoutDashboard, Link2, Palette, BarChart2, QrCode, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/links', icon: Link2, label: 'Links' },
  { href: '/dashboard/appearance', icon: Palette, label: 'Appearance' },
  { href: '/dashboard/analytics', icon: BarChart2, label: 'Analytics' },
  { href: '/dashboard/qr', icon: QrCode, label: 'QR Code' },
  { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

interface Props { username: string; email: string }

export function DashboardHeader({ username, email }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="bg-zinc-950/80 backdrop-blur border-b border-zinc-800 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <button onClick={() => setOpen(!open)} className="md:hidden text-zinc-400 hover:text-white">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
        <span className="font-display font-bold text-lg gradient-text md:hidden">LinkBio</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-white">@{username}</p>
          <p className="text-xs text-zinc-500">{email}</p>
        </div>
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-400 to-purple-500 flex items-center justify-center text-sm font-bold text-white">
          {username.charAt(0).toUpperCase()}
        </div>
      </div>

      {/* Mobile nav */}
      {open && (
        <div className="absolute top-full left-0 right-0 bg-zinc-950 border-b border-zinc-800 p-4 md:hidden z-50">
          <nav className="space-y-1">
            {navItems.map(({ href, icon: Icon, label }) => {
              const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium',
                    active ? 'bg-brand-500/10 text-brand-400' : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  )}
                >
                  <Icon size={18} /> {label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
