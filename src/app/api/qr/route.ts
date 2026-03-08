// src/app/api/qr/route.ts
import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';
import { getSession } from '@/lib/auth';
import { getProfileUrl } from '@/lib/utils';
import { unauthorizedResponse, errorResponse } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) return unauthorizedResponse();

  const { searchParams } = request.nextUrl;
  const color = searchParams.get('color') || '#000000';
  const bg = searchParams.get('bg') || '#ffffff';
  const size = parseInt(searchParams.get('size') || '300', 10);

  try {
    const url = getProfileUrl(session.username);
    const svg = await QRCode.toString(url, {
      type: 'svg',
      color: { dark: color, light: bg },
      width: Math.min(size, 600),
      margin: 2,
    });

    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('[QR]', error);
    return errorResponse('QR generation failed');
  }
}
