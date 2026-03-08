// src/lib/validations.ts
import { z } from 'zod';

export const RegisterSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain uppercase letter')
    .regex(/[0-9]/, 'Must contain a number'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username cannot exceed 30 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Only letters, numbers, underscores and hyphens'),
  displayName: z.string().min(1, 'Display name is required').max(50),
});

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const ProfileUpdateSchema = z.object({
  displayName: z.string().min(1).max(50).optional(),
  bio: z.string().max(200, 'Bio cannot exceed 200 characters').optional(),
  seoTitle: z.string().max(60).optional(),
  seoDescription: z.string().max(160).optional(),
  isPublic: z.boolean().optional(),
  themeId: z.string().optional(),
  customColors: z.record(z.string()).optional(),
  socialLinks: z.record(z.string().url().or(z.string().length(0))).optional(),
});

export const LinkCreateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  url: z.string().url('Invalid URL'),
  description: z.string().max(200).optional(),
  isActive: z.boolean().default(true),
  isPinned: z.boolean().default(false),
  buttonStyle: z.enum(['FLAT', 'ROUNDED', 'PILL', 'OUTLINE', 'SHADOW', 'GLASSMORPHISM']).default('ROUNDED'),
  icon: z.string().optional(),
  publishAt: z.string().datetime().optional().nullable(),
  expireAt: z.string().datetime().optional().nullable(),
  mediaType: z.enum(['NONE', 'IMAGE', 'VIDEO', 'YOUTUBE']).default('NONE'),
  mediaUrl: z.string().url().optional().nullable(),
});

export const LinkUpdateSchema = LinkCreateSchema.partial().extend({
  position: z.number().int().min(0).optional(),
});

export const ReorderLinksSchema = z.object({
  links: z.array(z.object({ id: z.string(), position: z.number().int().min(0) })),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type ProfileUpdateInput = z.infer<typeof ProfileUpdateSchema>;
export type LinkCreateInput = z.infer<typeof LinkCreateSchema>;
export type LinkUpdateInput = z.infer<typeof LinkUpdateSchema>;
