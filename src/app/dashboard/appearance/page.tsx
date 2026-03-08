// src/app/dashboard/appearance/page.tsx
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { AppearanceEditor } from '@/components/dashboard/AppearanceEditor';

export default async function AppearancePage() {
  const session = await getSession();
  if (!session) return null;

  const [profile, themes] = await Promise.all([
    prisma.profile.findUnique({
      where: { userId: session.sub },
      include: { theme: true },
    }),
    prisma.theme.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
  ]);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white font-display">Appearance</h1>
        <p className="text-zinc-400 text-sm mt-1">Customize your page look and feel</p>
      </div>
      <AppearanceEditor profile={profile} themes={themes} username={session.username} />
    </div>
  );
}
