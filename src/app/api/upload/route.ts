// src/app/api/upload/route.ts
import { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';
import { uploadFile } from '@/lib/upload';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/api-response';
import type { UploadCategory } from '@/lib/upload';

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return unauthorizedResponse();

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const category = (formData.get('category') as UploadCategory) || 'links';

    if (!file) return errorResponse('No file provided');

    const validCategories: UploadCategory[] = ['avatars', 'covers', 'links', 'og-images'];
    if (!validCategories.includes(category)) return errorResponse('Invalid category');

    const result = await uploadFile(file, category, category === 'links');
    return successResponse(result);
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Upload failed';
    return errorResponse(msg, 422);
  }
}
