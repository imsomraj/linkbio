// src/app/dashboard/settings/page.tsx
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ProfileSettings } from '@/components/dashboard/ProfileSettings';

export default async function SettingsPage() {
  const session = await getSession();
  if (!session) return null;

  const profile = await prisma.profile.findUnique({ where: { userId: session.sub } });

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white font-display">Settings</h1>
        <p className="text-zinc-400 text-sm mt-1">Manage your profile and account</p>
      </div>
      <ProfileSettings
        profile={profile}
        username={session.username}
        email={session.email}
      />
    </div>
  );
}
