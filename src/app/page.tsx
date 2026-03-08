// src/app/page.tsx
import Link from 'next/link';
import { ArrowRight, Zap, BarChart2, Palette, QrCode, Globe, Shield } from 'lucide-react';

const features = [
  { icon: Zap, title: 'Lightning Fast', desc: 'Optimized performance with Next.js 14 and edge delivery.' },
  { icon: Palette, title: '10+ Themes', desc: 'Beautiful pre-built themes including Indian festive designs.' },
  { icon: BarChart2, title: 'Deep Analytics', desc: 'Track clicks, views, devices and more in real-time.' },
  { icon: QrCode, title: 'QR Generator', desc: 'Generate styled QR codes for offline promotion.' },
  { icon: Globe, title: 'SEO Ready', desc: 'Custom meta, OpenGraph and sitemap out of the box.' },
  { icon: Shield, title: 'Secure & Private', desc: 'JWT auth, bcrypt passwords, and granular privacy controls.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white overflow-hidden">
      {/* Gradient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-brand-600/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[100px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <span className="font-display font-bold text-xl gradient-text">LinkBio</span>
        <div className="flex items-center gap-3">
          <Link href="/login" className="btn-ghost text-sm">Login</Link>
          <Link href="/register" className="btn-primary text-sm">Get Started Free</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 text-center px-6 pt-24 pb-32 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-zinc-400 mb-8">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Trusted by creators across India
        </div>
        <h1 className="font-display font-bold text-5xl md:text-7xl leading-tight mb-6">
          One link.<br />
          <span className="gradient-text">Infinite possibilities.</span>
        </h1>
        <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-10">
          Create your stunning link-in-bio page in minutes. Share your content, links, and social
          profiles — all from one beautiful, customizable page.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/register" className="btn-primary flex items-center gap-2 text-base px-6 py-3">
            Create your page <ArrowRight size={18} />
          </Link>
          <Link href="/demo" className="btn-secondary text-base px-6 py-3">View demo</Link>
        </div>
        <p className="mt-4 text-xs text-zinc-600">Free forever · No credit card required</p>
      </section>

      {/* Mock phone preview */}
      <section className="relative z-10 flex justify-center mb-24">
        <div className="relative w-[260px] h-[520px] bg-zinc-900 rounded-[40px] border border-zinc-700 shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-900/50 to-zinc-900" />
          <div className="relative z-10 flex flex-col items-center pt-12 px-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-400 to-purple-500 mb-3" />
            <p className="font-semibold text-white">@yourname</p>
            <p className="text-xs text-zinc-400 mb-6">Creator · India 🇮🇳</p>
            {['My YouTube Channel', 'Instagram Profile', 'Shop Now', 'WhatsApp Me'].map((t) => (
              <div key={t} className="w-full bg-white/10 rounded-xl py-3 px-4 mb-2 text-center text-sm text-white">
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-6 py-20 max-w-6xl mx-auto">
        <h2 className="font-display font-bold text-3xl md:text-4xl text-center mb-4">
          Everything you need
        </h2>
        <p className="text-zinc-400 text-center mb-16 max-w-xl mx-auto">
          Built for Indian creators, influencers, and businesses who want more control.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card hover:border-brand-500/50 transition-colors group">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center mb-4 group-hover:bg-brand-500/20 transition-colors">
                <Icon size={20} className="text-brand-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">{title}</h3>
              <p className="text-sm text-zinc-400">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 py-20 text-center">
        <div className="max-w-2xl mx-auto card border-brand-500/30">
          <h2 className="font-display font-bold text-3xl mb-4">Ready to grow your audience?</h2>
          <p className="text-zinc-400 mb-8">Join thousands of creators already using LinkBio.</p>
          <Link href="/register" className="btn-primary inline-flex items-center gap-2 text-base px-8 py-3">
            Start for free <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-800 px-6 py-8 text-center text-zinc-600 text-sm">
        © {new Date().getFullYear()} LinkBio. Made with ❤️ in India.
      </footer>
    </div>
  );
}
