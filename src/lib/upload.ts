// src/lib/upload.ts
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const UPLOAD_BASE = process.env.UPLOAD_DIR || './public/uploads';
const MAX_SIZE = parseInt(process.env.MAX_FILE_SIZE || '5242880', 10);

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm'];

export type UploadCategory = 'avatars' | 'covers' | 'links' | 'og-images';

interface UploadResult {
  url: string;
  filename: string;
  size: number;
  type: string;
}

export async function uploadFile(
  file: File,
  category: UploadCategory,
  allowVideo = false
): Promise<UploadResult> {
  const allowed = allowVideo
    ? [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES]
    : ALLOWED_IMAGE_TYPES;

  if (!allowed.includes(file.type)) {
    throw new Error(`Invalid file type: ${file.type}`);
  }

  if (file.size > MAX_SIZE) {
    throw new Error(`File too large. Max size: ${MAX_SIZE / 1024 / 1024}MB`);
  }

  const ext = file.name.split('.').pop() || 'bin';
  const filename = `${uuidv4()}.${ext}`;
  const dir = path.join(UPLOAD_BASE, category);

  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, filename), buffer);

  return {
    url: `/uploads/${category}/${filename}`,
    filename,
    size: file.size,
    type: file.type,
  };
}

export async function ensureUploadDirs(): Promise<void> {
  const categories: UploadCategory[] = ['avatars', 'covers', 'links', 'og-images'];
  for (const cat of categories) {
    const dir = path.join(UPLOAD_BASE, cat);
    if (!existsSync(dir)) {
      await mkdir(dir, { recursive: true });
    }
  }
}
