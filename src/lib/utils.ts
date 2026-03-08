// src/lib/utils.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function isLinkActive(link: {
  isActive: boolean;
  publishAt?: Date | null;
  expireAt?: Date | null;
}): boolean {
  if (!link.isActive) return false;
  const now = new Date();
  if (link.publishAt && link.publishAt > now) return false;
  if (link.expireAt && link.expireAt < now) return false;
  return true;
}

export function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
}

export function getProfileUrl(username: string): string {
  return `${getAppUrl()}/${username}`;
}
