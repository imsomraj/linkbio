// src/app/dashboard/links/page.tsx
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { LinksManager } from '@/components/dashboard/LinksManager';

export default async function LinksPage() {
  const session = await getSession();
  if (!session) return null;

  const links = await prisma.link.findMany({
    where: { userId: session.sub },
    orderBy: [{ isPinned: 'desc' }, { position: 'asc' }],
  });

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white font-display">Links</h1>
        <p className="text-zinc-400 text-sm mt-1">Manage and reorder your links</p>
      </div>
      <LinksManager initialLinks={links} />
    </div>
  );
}
