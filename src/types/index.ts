// src/types/index.ts
import type { User, Profile, Link, Theme, Analytics, Plan, ButtonStyle, MediaType } from '@prisma/client';

export type { Plan, ButtonStyle, MediaType };

export interface SafeUser {
  id: string;
  email: string;
  username: string;
  plan: Plan;
  createdAt: Date;
}

export interface PublicProfile {
  username: string;
  displayName: string | null;
  bio: string | null;
  avatar: string | null;
  coverImage: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  ogImage: string | null;
  customColors: Record<string, string> | null;
  socialLinks: Record<string, string> | null;
  theme: Theme | null;
  links: PublicLink[];
}

export interface PublicLink {
  id: string;
  title: string;
  url: string;
  description: string | null;
  thumbnail: string | null;
  mediaType: MediaType;
  mediaUrl: string | null;
  buttonStyle: ButtonStyle;
  icon: string | null;
  clickCount: number;
  isPinned: boolean;
  position: number;
}

export interface ThemeConfig {
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  accent: string;
  buttonBg: string;
  buttonText: string;
  buttonRadius: string;
  buttonBorder?: string;
  fontFamily: string;
  backgroundType: 'solid' | 'gradient' | 'image';
}

export interface DashboardStats {
  totalClicks: number;
  totalViews: number;
  clicksByLink: Array<{ id: string; title: string; url: string; clickCount: number }>;
  dailyClicks: Array<{ date: Date; count: number; linkId: string | null }>;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: unknown;
}
