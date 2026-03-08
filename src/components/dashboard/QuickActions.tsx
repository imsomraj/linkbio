// src/components/dashboard/QuickActions.tsx
import Link from 'next/link';
import { Plus, Palette, QrCode, ExternalLink } from 'lucide-react';

interface Props { username: string }

export function QuickActions({ username }: Props) {
  const actions = [
    { href: '/dashboard/links', icon: Plus, label: 'Add Link', desc: 'Add a new link to your page' },
    { href: '/dashboard/appearance', icon: Palette, label: 'Change Theme', desc: 'Customize your look' },
    { href: '/dashboard/qr', icon: QrCode, label: 'Get QR Code', desc: 'Download your QR code' },
    { href: `/${username}`, icon: ExternalLink, label: 'View Page', desc: 'See your public page', external: true },
  ];

  return (
    <div className="card">
      <h3 className="font-semibold text-white mb-4">Quick Actions</h3>
      <div className="space-y-2">
        {actions.map(({ href, icon: Icon, label, desc, external }) => (
          <Link
            key={href}
            href={href}
            target={external ? '_blank' : undefined}
            rel={external ? 'noopener' : undefined}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group"
          >
            <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center group-hover:bg-brand-500/20 transition-colors">
              <Icon size={16} className="text-brand-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">{label}</p>
              <p className="text-xs text-zinc-500">{desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
