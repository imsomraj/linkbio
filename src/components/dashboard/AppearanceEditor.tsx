// src/components/dashboard/AppearanceEditor.tsx
'use client';
import { useState } from 'react';
import type { Profile, Theme } from '@prisma/client';
import { motion } from 'framer-motion';
import { Check, Lock, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ThemeConfig } from '@/types';

interface Props {
  profile: (Profile & { theme: Theme | null }) | null;
  themes: Theme[];
  username: string;
}

export function AppearanceEditor({ profile, themes, username }: Props) {
  const [selectedThemeId, setSelectedThemeId] = useState(profile?.themeId || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleThemeSelect = async (themeId: string) => {
    setSelectedThemeId(themeId);
  };

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ themeId: selectedThemeId || null }),
    });
    setSaving(false);
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const selectedTheme = themes.find((t) => t.id === selectedThemeId);
  const themeConfig = selectedTheme?.config as ThemeConfig | undefined;

  const groupedThemes = themes.reduce<Record<string, Theme[]>>((acc, t) => {
    const cat = t.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(t);
    return acc;
  }, {});

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Theme picker */}
      <div className="lg:col-span-2 space-y-6">
        {Object.entries(groupedThemes).map(([category, themeList]) => (
          <div key={category}>
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">{category}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {themeList.map((theme) => {
                const cfg = theme.config as ThemeConfig;
                const active = selectedThemeId === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => handleThemeSelect(theme.id)}
                    className={cn(
                      'relative rounded-xl border-2 overflow-hidden text-left transition-all',
                      active ? 'border-brand-500 shadow-lg shadow-brand-500/20' : 'border-zinc-800 hover:border-zinc-600'
                    )}
                  >
                    <div
                      className="h-20 w-full"
                      style={{ background: cfg.background }}
                    >
                      <div className="p-2 space-y-1.5">
                        <div className="h-3 rounded-full w-3/4" style={{ background: cfg.surface }} />
                        <div className="h-2 rounded-full w-1/2" style={{ background: cfg.surface, opacity: 0.7 }} />
                        <div className="h-5 rounded-lg w-full mt-1" style={{ background: cfg.buttonBg }} />
                      </div>
                    </div>
                    <div className="p-2 bg-zinc-900">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-white">{theme.name}</span>
                        <div className="flex items-center gap-1">
                          {theme.isPremium && <Lock size={10} className="text-amber-400" />}
                          {active && <Check size={12} className="text-brand-400" />}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <button onClick={handleSave} disabled={saving} className="btn-primary w-full">
          {saved ? '✓ Saved!' : saving ? 'Saving...' : 'Save Theme'}
        </button>
      </div>

      {/* Preview */}
      <div className="lg:col-span-1">
        <div className="sticky top-24">
          <h3 className="text-sm font-semibold text-zinc-300 mb-3 flex items-center gap-2">
            <Eye size={14} /> Preview
          </h3>
          <div
            className="rounded-2xl overflow-hidden border border-zinc-800 aspect-[9/16] flex flex-col items-center pt-8 px-4"
            style={{
              background: themeConfig?.background || '#09090b',
              fontFamily: themeConfig?.fontFamily || 'DM Sans',
            }}
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-400 to-purple-500 mb-3" />
            <p className="font-semibold text-sm mb-1" style={{ color: themeConfig?.text || '#fff' }}>@{username}</p>
            <p className="text-xs mb-6" style={{ color: themeConfig?.textMuted || '#888' }}>Your bio goes here</p>
            {['My Website', 'Instagram', 'YouTube'].map((t) => (
              <div
                key={t}
                className="w-full py-2.5 px-4 mb-2 text-center text-xs font-medium"
                style={{
                  background: themeConfig?.buttonBg || '#6366f1',
                  color: themeConfig?.buttonText || '#fff',
                  borderRadius: themeConfig?.buttonRadius || '12px',
                }}
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
