// src/components/dashboard/QRGenerator.tsx
'use client';
import { useState, useRef } from 'react';
import { Download, RefreshCw } from 'lucide-react';
import { getProfileUrl } from '@/lib/utils';

interface Props { username: string }

export function QRGenerator({ username }: Props) {
  const [color, setColor] = useState('#6366f1');
  const [bg, setBg] = useState('#ffffff');
  const [size, setSize] = useState(300);
  const [loading, setLoading] = useState(false);
  const svgRef = useRef<HTMLDivElement>(null);

  const qrUrl = `/api/qr?color=${encodeURIComponent(color)}&bg=${encodeURIComponent(bg)}&size=${size}`;
  const profileUrl = getProfileUrl(username);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const res = await fetch(qrUrl);
      const svg = await res.text();
      const blob = new Blob([svg], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${username}-qr.svg`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setLoading(false);
    }
  };

  const downloadPNG = async () => {
    if (!svgRef.current) return;
    const svgEl = svgRef.current.querySelector('img');
    if (!svgEl) return;

    setLoading(true);
    try {
      const res = await fetch(qrUrl);
      const svgText = await res.text();
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, size, size);
        const url = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = url;
        a.download = `${username}-qr.png`;
        a.click();
        setLoading(false);
      };
      const blob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
      img.src = URL.createObjectURL(blob);
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="card text-center">
        <div ref={svgRef} className="flex items-center justify-center mb-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrUrl}
            alt="QR Code"
            width={size}
            height={size}
            key={qrUrl}
            className="rounded-xl max-w-full"
            style={{ maxWidth: '240px' }}
          />
        </div>
        <p className="text-xs text-zinc-500 mb-6">Points to: {profileUrl}</p>

        <div className="flex gap-3">
          <button onClick={handleDownload} disabled={loading} className="btn-secondary flex-1 flex items-center justify-center gap-2 text-sm">
            <Download size={14} /> SVG
          </button>
          <button onClick={downloadPNG} disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2 text-sm">
            {loading ? <RefreshCw size={14} className="animate-spin" /> : <Download size={14} />}
            PNG
          </button>
        </div>
      </div>

      <div className="card space-y-4">
        <h3 className="font-semibold text-white">Customize</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-2">QR Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-10 h-10 rounded-lg border border-zinc-700 cursor-pointer bg-transparent"
              />
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="input-field flex-1 text-sm font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">Background</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={bg}
                onChange={(e) => setBg(e.target.value)}
                className="w-10 h-10 rounded-lg border border-zinc-700 cursor-pointer bg-transparent"
              />
              <input
                type="text"
                value={bg}
                onChange={(e) => setBg(e.target.value)}
                className="input-field flex-1 text-sm font-mono"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-2">Size: {size}px</label>
          <input
            type="range"
            min={200}
            max={600}
            step={50}
            value={size}
            onChange={(e) => setSize(parseInt(e.target.value))}
            className="w-full accent-brand-500"
          />
        </div>
      </div>
    </div>
  );
}
