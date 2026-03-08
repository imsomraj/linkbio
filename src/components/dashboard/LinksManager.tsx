// src/components/dashboard/LinksManager.tsx
'use client';
import { useState, useCallback } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import type { Link } from '@prisma/client';
import { Plus, GripVertical, Pencil, Trash2, Power, Pin, ExternalLink } from 'lucide-react';
import { LinkModal } from './LinkModal';
import { cn } from '@/lib/utils';

interface Props { initialLinks: Link[] }

export function LinksManager({ initialLinks }: Props) {
  const [links, setLinks] = useState<Link[]>(initialLinks);
  const [modalOpen, setModalOpen] = useState(false);
  const [editLink, setEditLink] = useState<Link | null>(null);
  const [saving, setSaving] = useState(false);

  const openCreate = () => { setEditLink(null); setModalOpen(true); };
  const openEdit = (link: Link) => { setEditLink(link); setModalOpen(true); };

  const handleSave = async (data: Partial<Link>) => {
    if (editLink) {
      const res = await fetch(`/api/links/${editLink.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success) setLinks((prev) => prev.map((l) => (l.id === editLink.id ? json.data : l)));
    } else {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success) setLinks((prev) => [...prev, json.data]);
    }
    setModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this link?')) return;
    const res = await fetch(`/api/links/${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (json.success) setLinks((prev) => prev.filter((l) => l.id !== id));
  };

  const handleToggle = async (link: Link) => {
    const res = await fetch(`/api/links/${link.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !link.isActive }),
    });
    const json = await res.json();
    if (json.success) setLinks((prev) => prev.map((l) => (l.id === link.id ? json.data : l)));
  };

  const handleReorder = useCallback(async (newOrder: Link[]) => {
    setLinks(newOrder);
    const payload = newOrder.map((l, i) => ({ id: l.id, position: i }));
    await fetch('/api/links', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ links: payload }),
    });
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-zinc-400 text-sm">{links.length} links</p>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} /> Add Link
        </button>
      </div>

      {links.length === 0 ? (
        <div className="card text-center py-16">
          <div className="w-14 h-14 rounded-2xl bg-brand-500/10 flex items-center justify-center mx-auto mb-4">
            <Plus size={24} className="text-brand-400" />
          </div>
          <h3 className="font-semibold text-white mb-2">No links yet</h3>
          <p className="text-zinc-500 text-sm mb-6">Add your first link to get started</p>
          <button onClick={openCreate} className="btn-primary">Add Your First Link</button>
        </div>
      ) : (
        <Reorder.Group axis="y" values={links} onReorder={handleReorder} className="space-y-3">
          <AnimatePresence initial={false}>
            {links.map((link) => (
              <Reorder.Item key={link.id} value={link}>
                <motion.div
                  layout
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className={cn(
                    'card flex items-center gap-3 cursor-default hover:border-zinc-700 transition-colors',
                    !link.isActive && 'opacity-50'
                  )}
                >
                  <div className="text-zinc-600 hover:text-zinc-400 cursor-grab active:cursor-grabbing touch-none">
                    <GripVertical size={18} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {link.isPinned && <Pin size={12} className="text-brand-400 flex-shrink-0" />}
                      <p className="font-medium text-white text-sm truncate">{link.title}</p>
                    </div>
                    <p className="text-zinc-500 text-xs truncate mt-0.5">{link.url}</p>
                    <p className="text-zinc-600 text-xs mt-0.5">{link.clickCount} clicks</p>
                  </div>

                  <div className="flex items-center gap-1">
                    <a href={link.url} target="_blank" rel="noopener" className="btn-ghost p-2">
                      <ExternalLink size={14} />
                    </a>
                    <button onClick={() => handleToggle(link)} className="btn-ghost p-2" title={link.isActive ? 'Disable' : 'Enable'}>
                      <Power size={14} className={link.isActive ? 'text-green-400' : 'text-zinc-600'} />
                    </button>
                    <button onClick={() => openEdit(link)} className="btn-ghost p-2">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => handleDelete(link.id)} className="btn-ghost p-2 hover:text-red-400">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              </Reorder.Item>
            ))}
          </AnimatePresence>
        </Reorder.Group>
      )}

      <LinkModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        link={editLink}
      />
    </div>
  );
}
