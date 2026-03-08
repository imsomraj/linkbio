// src/components/dashboard/LinkModal.tsx
'use client';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { Link } from '@prisma/client';
import { LinkCreateSchema, type LinkCreateInput } from '@/lib/validations';

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: Partial<Link>) => Promise<void>;
  link: Link | null;
}

export function LinkModal({ open, onClose, onSave, link }: Props) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<LinkCreateInput>({
    resolver: zodResolver(LinkCreateSchema),
  });

  useEffect(() => {
    if (open) {
      reset(link ? {
        title: link.title,
        url: link.url,
        description: link.description || '',
        isActive: link.isActive,
        isPinned: link.isPinned,
        buttonStyle: link.buttonStyle,
        icon: link.icon || '',
        publishAt: link.publishAt?.toISOString() || undefined,
        expireAt: link.expireAt?.toISOString() || undefined,
        mediaType: link.mediaType,
        mediaUrl: link.mediaUrl || '',
      } : {
        title: '',
        url: '',
        isActive: true,
        isPinned: false,
        buttonStyle: 'ROUNDED',
        mediaType: 'NONE',
      });
    }
  }, [open, link, reset]);

  const onSubmit = async (data: LinkCreateInput) => {
    await onSave(data as unknown as Partial<Link>);
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">{link ? 'Edit Link' : 'Add New Link'}</h2>
              <button onClick={onClose} className="text-zinc-500 hover:text-white"><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Title *</label>
                <input {...register('title')} className="input-field" placeholder="My Website" />
                {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">URL *</label>
                <input {...register('url')} className="input-field" placeholder="https://example.com" />
                {errors.url && <p className="text-red-400 text-xs mt-1">{errors.url.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Description</label>
                <textarea {...register('description')} className="input-field resize-none" rows={2} placeholder="Optional description..." />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Button Style</label>
                <select {...register('buttonStyle')} className="input-field">
                  <option value="FLAT">Flat</option>
                  <option value="ROUNDED">Rounded</option>
                  <option value="PILL">Pill</option>
                  <option value="OUTLINE">Outline</option>
                  <option value="SHADOW">Shadow</option>
                  <option value="GLASSMORPHISM">Glassmorphism</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5">Publish At</label>
                  <input {...register('publishAt')} type="datetime-local" className="input-field text-xs" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5">Expire At</label>
                  <input {...register('expireAt')} type="datetime-local" className="input-field text-xs" />
                </div>
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input {...register('isActive')} type="checkbox" className="w-4 h-4 accent-brand-500" />
                  <span className="text-sm text-zinc-300">Active</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input {...register('isPinned')} type="checkbox" className="w-4 h-4 accent-brand-500" />
                  <span className="text-sm text-zinc-300">Pin to top</span>
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="btn-primary flex-1">
                  {isSubmitting ? 'Saving...' : link ? 'Save Changes' : 'Add Link'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
