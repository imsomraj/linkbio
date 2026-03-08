// src/app/dashboard/qr/page.tsx
import { getSession } from '@/lib/auth';
import { QRGenerator } from '@/components/dashboard/QRGenerator';

export default async function QRPage() {
  const session = await getSession();
  if (!session) return null;

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white font-display">QR Code</h1>
        <p className="text-zinc-400 text-sm mt-1">Generate and download your QR code</p>
      </div>
      <QRGenerator username={session.username} />
    </div>
  );
}
