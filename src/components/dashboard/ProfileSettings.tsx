// src/components/dashboard/ProfileSettings.tsx
'use client';
import { useState, useRef } from 'react';
import type { Profile } from '@prisma/client';
import { Upload, Loader2, Globe, Lock } from 'lucide-react';
import Image from 'next/image';

interface Props {
  profile: Profile | null;
  username: string;
  email: string;
}

export function ProfileSettings({ profile, username, email }: Props) {
  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [seoTitle, setSeoTitle] = useState(profile?.seoTitle || '');
  const [seoDesc, setSeoDesc] = useState(profile?.seoDescription || '');
  const [isPublic, setIsPublic] = useState(profile?.isPublic ?? true);
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('category', 'avatars');
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const json = await res.json();
      if (json.success) {
        setAvatarUrl(json.data.url);
        await fetch('/api/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ avatar: json.data.url }),
        });
      }
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ displayName, bio, seoTitle, seoDescription: seoDesc, isPublic }),
    });
    setSaving(false);
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile info */}
      <div className="card space-y-5">
        <h3 className="font-semibold text-white">Profile Info</h3>

        <div className="flex items-center gap-5">
          <div className="relative">
            {avatarUrl ? (
              <Image src={avatarUrl} alt="Avatar" width={72} height={72} className="rounded-full object-cover" />
            ) : (
              <div className="w-18 h-18 w-[72px] h-[72px] rounded-full bg-gradient-to-br from-brand-400 to-purple-500 flex items-center justify-center text-2xl font-bold text-white">
                {username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <button
              onClick={() => fileRef.current?.click()}
              className="btn-secondary text-sm flex items-center gap-2"
              disabled={uploading}
            >
              {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
              {uploading ? 'Uploading...' : 'Upload Photo'}
            </button>
            <p className="text-xs text-zinc-600 mt-1">JPG, PNG, WebP · Max 5MB</p>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">Display Name</label>
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="input-field"
            placeholder="Your Name"
            maxLength={50}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="input-field resize-none"
            rows={3}
            placeholder="Tell your audience about yourself..."
            maxLength={200}
          />
          <p className="text-xs text-zinc-600 text-right mt-1">{bio.length}/200</p>
        </div>

        <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-xl">
          <div className="flex items-center gap-3">
            {isPublic ? <Globe size={18} className="text-green-400" /> : <Lock size={18} className="text-zinc-400" />}
            <div>
              <p className="text-sm font-medium text-white">{isPublic ? 'Public page' : 'Private page'}</p>
              <p className="text-xs text-zinc-500">{isPublic ? 'Anyone can view' : 'Only you can view'}</p>
            </div>
          </div>
          <button
            onClick={() => setIsPublic(!isPublic)}
            className={`relative w-12 h-6 rounded-full transition-colors ${isPublic ? 'bg-green-500' : 'bg-zinc-600'}`}
          >
            <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${isPublic ? 'translate-x-7' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>

      {/* SEO */}
      <div className="card space-y-4">
        <h3 className="font-semibold text-white">SEO Settings</h3>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">Page Title</label>
          <input
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            className="input-field"
            placeholder={`${username} | LinkBio`}
            maxLength={60}
          />
          <p className="text-xs text-zinc-600 mt-1">{seoTitle.length}/60 chars · Shown in search results</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">Meta Description</label>
          <textarea
            value={seoDesc}
            onChange={(e) => setSeoDesc(e.target.value)}
            className="input-field resize-none"
            rows={2}
            placeholder="Short description for search engines..."
            maxLength={160}
          />
          <p className="text-xs text-zinc-600 mt-1">{seoDesc.length}/160 chars</p>
        </div>
      </div>

      {/* Account info */}
      <div className="card space-y-3">
        <h3 className="font-semibold text-white">Account</h3>
        <div className="flex items-center justify-between py-2 border-b border-zinc-800">
          <span className="text-sm text-zinc-400">Username</span>
          <span className="text-sm font-mono text-white">@{username}</span>
        </div>
        <div className="flex items-center justify-between py-2">
          <span className="text-sm text-zinc-400">Email</span>
          <span className="text-sm text-zinc-300">{email}</span>
        </div>
      </div>

      <button onClick={handleSave} disabled={saving} className="btn-primary w-full flex items-center justify-center gap-2">
        {saving && <Loader2 size={16} className="animate-spin" />}
        {saved ? '✓ Saved!' : saving ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );
}
