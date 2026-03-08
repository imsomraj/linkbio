// src/app/[username]/page.tsx
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { isLinkActive, getAppUrl } from '@/lib/utils';
import { ProfilePageClient } from '@/components/profile/ProfilePageClient';
import type { ThemeConfig } from '@/types';

interface Props { params: { username: string } }

async function getProfile(username: string) {
  const user = await prisma.user.findUnique({
    where: { username: username.toLowerCase() },
    include: {
      profile: { include: { theme: true } },
      links: {
        where: { isActive: true },
        orderBy: [{ isPinned: 'desc' }, { position: 'asc' }],
      },
    },
  });

  if (!user || !user.profile || !user.profile.isPublic) return null;

  const activeLinks = user.links.filter(isLinkActive);

  return { user, profile: user.profile, links: activeLinks };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await getProfile(params.username);
  if (!data) return { title: 'User not found' };

  const { profile, user } = data;
  const title = profile.seoTitle || profile.displayName || user.username;
  const description = profile.seoDescription || profile.bio || `Check out ${user.username}'s links`;
  const ogImage = profile.ogImage || profile.avatar;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${getAppUrl()}/${user.username}`,
      images: ogImage ? [{ url: ogImage }] : [],
      type: 'profile',
    },
    twitter: { card: 'summary', title, description },
    alternates: { canonical: `${getAppUrl()}/${user.username}` },
  };
}

export default async function PublicProfilePage({ params }: Props) {
  const data = await getProfile(params.username);
  if (!data) notFound();

  const { user, profile, links } = data;
  const themeConfig = profile.theme?.config as ThemeConfig | null;

  return (
    <ProfilePageClient
      username={user.username}
      profile={profile}
      links={links}
      themeConfig={themeConfig}
      customColors={(profile.customColors as Record<string, string>) || null}
    />
  );
}
