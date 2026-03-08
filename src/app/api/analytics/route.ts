// src/app/api/analytics/route.ts
import { getSession } from '@/lib/auth';
import { getDashboardAnalytics } from '@/lib/analytics';
import { successResponse, unauthorizedResponse, serverErrorResponse } from '@/lib/api-response';

export async function GET() {
  const session = await getSession();
  if (!session) return unauthorizedResponse();

  try {
    const data = await getDashboardAnalytics(session.sub);
    return successResponse(data);
  } catch (error) {
    console.error('[ANALYTICS]', error);
    return serverErrorResponse();
  }
}
