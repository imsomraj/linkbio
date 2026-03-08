// src/components/profile/ProfilePageClient.tsx
'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import type { Profile, Theme } from '@prisma/client';
import type { ThemeConfig, PublicLink } from '@/types';
import { ProfileLink } from './ProfileLink';
import { SocialLinks } from './SocialLinks';
import { cn } from '@/lib/utils';

interface Props {
  username: string;
  profile: Profile & { theme: Theme | null };
  links: PublicLink[];
  themeConfig: ThemeConfig | null;
  customColors: Record<string, string> | null;
}

export function ProfilePageClient({ username, profile, links, themeConfig, customColors }: Props) {
  // Merge theme config with custom overrides
  const cfg: Partial<ThemeConfig> = {
    ...themeConfig,
    ...(customColors || {}),
  };

  const bg = cfg.background || '#09090b';
  const textColor = cfg.text || '#ffffff';
  const textMuted = cfg.textMuted || '#888888';
  const fontFamily = cfg.fontFamily || "'DM Sans', sans-serif";
  const surface = cfg.surface || 'rgba(255,255,255,0.05)';

  const pinnedLinks = links.filter((l) => l.isPinned);
  const regularLinks = links.filter((l) => !l.isPinned);

  return (
    <div
      className="min-h-screen"
      style={{ background: bg, fontFamily, color: textColor }}
    >
      <div className="max-w-md mx-auto px-4 py-10 pb-20">
        {/* Avatar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center text-center mb-8"
        >
          {profile.avatar ? (
            <Image
              src={profile.avatar}
              alt={profile.displayName || username}
              width={96}
              height={96}
              className="rounded-full object-cover border-4 mb-4"
              style={{ borderColor: surface }}
            />
          ) : (
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold mb-4"
              style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}
            >
              {username.charAt(0).toUpperCase()}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <h1 className="text-xl font-bold mb-1" style={{ color: textColor }}>
              {profile.displayName || `@${username}`}
            </h1>
            {profile.bio && (
              <p className="text-sm leading-relaxed max-w-xs" style={{ color: textMuted }}>
                {profile.bio}
              </p>
            )}
          </motion.div>

          {profile.socialLinks && (
            <SocialLinks
              links={profile.socialLinks as Record<string, string>}
              color={textMuted}
            />
          )}
        </motion.div>

        {/* Pinned links */}
        {pinnedLinks.length > 0 && (
          <div className="mb-3">
            {pinnedLinks.map((link, i) => (
              <ProfileLink key={link.id} link={link} cfg={cfg} delay={i * 0.05} />
            ))}
          </div>
        )}

        {/* Regular links */}
        <div className="space-y-3">
          {regularLinks.map((link, i) => (
            <ProfileLink key={link.id} link={link} cfg={cfg} delay={(pinnedLinks.length + i) * 0.05} />
          ))}
        </div>

        {links.length === 0 && (
          <div className="text-center py-16 text-sm" style={{ color: textMuted }}>
            No links yet.
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12">
          <a
            href="/"
            className="text-xs opacity-40 hover:opacity-70 transition-opacity"
            style={{ color: textColor }}
          >
            Powered by LinkBio
          </a>
        </div>
      </div>
    </div>
  );
}
