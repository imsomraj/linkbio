// src/components/profile/ProfileLink.tsx
'use client';
import { motion } from 'framer-motion';
import type { PublicLink, ThemeConfig } from '@/types';
import { ExternalLink, Play } from 'lucide-react';

interface Props {
  link: PublicLink;
  cfg: Partial<ThemeConfig>;
  delay: number;
}

function getButtonStyles(style: string, cfg: Partial<ThemeConfig>) {
  const base = {
    background: cfg.buttonBg || '#6366f1',
    color: cfg.buttonText || '#ffffff',
    borderRadius: cfg.buttonRadius || '12px',
  };

  switch (style) {
    case 'FLAT':
      return { ...base, borderRadius: '4px' };
    case 'ROUNDED':
      return { ...base, borderRadius: '12px' };
    case 'PILL':
      return { ...base, borderRadius: '50px' };
    case 'OUTLINE':
      return {
        background: 'transparent',
        color: cfg.text || '#ffffff',
        borderRadius: cfg.buttonRadius || '12px',
        border: `2px solid ${cfg.buttonBg || '#6366f1'}`,
      };
    case 'SHADOW':
      return { ...base, boxShadow: `0 8px 24px rgba(0,0,0,0.3)` };
    case 'GLASSMORPHISM':
      return {
        background: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(20px)',
        color: cfg.text || '#ffffff',
        borderRadius: cfg.buttonRadius || '12px',
        border: '1px solid rgba(255,255,255,0.2)',
      };
    default:
      return base;
  }
}

export function ProfileLink({ link, cfg, delay }: Props) {
  const buttonStyle = getButtonStyles(link.buttonStyle, cfg);
  const trackUrl = `/api/click/${link.id}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
      className="mb-3"
    >
      <motion.a
        href={trackUrl}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="block w-full"
        style={buttonStyle}
      >
        <div className="flex items-center px-5 py-3.5 gap-3">
          {link.thumbnail && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={link.thumbnail} alt="" className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
          )}
          {link.mediaType === 'VIDEO' || link.mediaType === 'YOUTUBE' ? (
            <Play size={16} className="flex-shrink-0" />
          ) : null}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-center">{link.title}</p>
            {link.description && (
              <p className="text-xs opacity-75 text-center mt-0.5 truncate">{link.description}</p>
            )}
          </div>
          <ExternalLink size={14} className="opacity-50 flex-shrink-0" />
        </div>
      </motion.a>

      {/* Media preview */}
      {link.mediaType === 'YOUTUBE' && link.mediaUrl && (
        <div className="mt-2 rounded-xl overflow-hidden aspect-video">
          <iframe
            src={link.mediaUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
            className="w-full h-full"
            allowFullScreen
            title={link.title}
          />
        </div>
      )}
    </motion.a>
  </motion.div>
  );
}
