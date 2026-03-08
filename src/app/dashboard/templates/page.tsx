// src/app/dashboard/templates/page.tsx
import { Lock, Star } from 'lucide-react';

// This is the architecture/UI for templates marketplace
// Templates are seeded in DB and previewed here

const mockTemplates = [
  { id: '1', name: 'Creator Hub', category: 'Creator', isPremium: false, preview: '🎨', tags: ['youtube', 'instagram'] },
  { id: '2', name: 'Business Pro', category: 'Business', isPremium: false, preview: '💼', tags: ['professional', 'clean'] },
  { id: '3', name: 'Musician', category: 'Music', isPremium: false, preview: '🎵', tags: ['spotify', 'soundcloud'] },
  { id: '4', name: 'Influencer Elite', category: 'Creator', isPremium: true, preview: '⭐', tags: ['fashion', 'lifestyle'] },
  { id: '5', name: 'Restaurant', category: 'Business', isPremium: false, preview: '🍽️', tags: ['menu', 'zomato'] },
  { id: '6', name: 'Podcast Host', category: 'Media', isPremium: true, preview: '🎙️', tags: ['spotify', 'apple'] },
];

export default function TemplatesPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-display">Templates</h1>
          <p className="text-zinc-400 text-sm mt-1">Start with a pre-built template</p>
        </div>
        <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full px-3 py-1 text-xs font-medium">
          Coming Soon
        </span>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['All', 'Creator', 'Business', 'Music', 'Media'].map((cat) => (
          <button
            key={cat}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              cat === 'All'
                ? 'bg-brand-500 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {mockTemplates.map((tpl) => (
          <div key={tpl.id} className="card relative group cursor-pointer hover:border-brand-500/50 transition-all">
            {tpl.isPremium && (
              <div className="absolute top-3 right-3 flex items-center gap-1 bg-amber-500/20 border border-amber-500/30 text-amber-400 rounded-full px-2 py-0.5 text-xs">
                <Lock size={10} /> Pro
              </div>
            )}
            <div className="h-28 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center text-4xl mb-3">
              {tpl.preview}
            </div>
            <p className="font-semibold text-white text-sm">{tpl.name}</p>
            <p className="text-xs text-zinc-500 mt-0.5">{tpl.category}</p>
            <div className="flex gap-1 mt-2 flex-wrap">
              {tpl.tags.map((tag) => (
                <span key={tag} className="text-xs bg-zinc-800 text-zinc-400 rounded px-1.5 py-0.5">
                  #{tag}
                </span>
              ))}
            </div>
            <button
              disabled
              className="mt-3 w-full btn-secondary text-xs py-1.5 opacity-60 cursor-not-allowed"
            >
              {tpl.isPremium ? 'Upgrade to Use' : 'Use Template'}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-12 card border-brand-500/20 bg-brand-500/5 text-center">
        <Star size={32} className="text-brand-400 mx-auto mb-3" />
        <h3 className="font-bold text-white mb-2">Template Marketplace Coming Soon</h3>
        <p className="text-zinc-400 text-sm max-w-md mx-auto">
          We&apos;re building a full template marketplace where creators can share and sell their
          page designs. Stay tuned!
        </p>
      </div>
    </div>
  );
}
