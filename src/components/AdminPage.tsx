import React, { useState } from 'react';
import { Toaster, toast } from 'sonner';
import { Link2, Copy, MessageCircle, Heart } from 'lucide-react';
import { COUPLE_NAMES } from '../config/wedding';
import {
  PREFIXES,
  type Prefix,
  buildDisplayName,
  buildGreeting,
  buildInviteLink,
  buildInviteMessage,
} from '../lib/guest';

export const AdminPage: React.FC = () => {
  const [prefix, setPrefix] = useState<Prefix>('Mr.');
  const [guestName, setGuestName] = useState('');
  const [result, setResult] = useState<{ displayName: string; link: string; message: string } | null>(null);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const displayName = buildDisplayName(prefix, guestName);
    if (!displayName) {
      toast.error('Please enter a guest name.');
      return;
    }
    const link = buildInviteLink(window.location.origin, displayName);
    setResult({ displayName, link, message: buildInviteMessage(displayName, link) });
  };

  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback for older browsers / non-secure contexts
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    toast.success(label);
  };

  const field =
    'w-full bg-white px-5 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-mocha/40 outline-none transition text-brand-mocha';
  const btn =
    'flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-sans text-xs uppercase tracking-[0.15em] font-bold transition disabled:opacity-40 disabled:cursor-not-allowed';

  return (
    <div className="min-h-screen bg-brand-champagne font-sans text-brand-mocha px-4 py-10 sm:py-16">
      <Toaster position="top-center" />
      <div className="max-w-2xl mx-auto">
        <header className="text-center mb-10">
          <Heart className="w-6 h-6 mx-auto mb-3 text-brand-gold fill-brand-gold/20" />
          <h1 className="font-display text-4xl sm:text-5xl">{COUPLE_NAMES}</h1>
          <p className="text-[11px] uppercase tracking-[0.3em] text-brand-sand font-semibold mt-3">
            Invitation Link Generator
          </p>
        </header>

        <form
          onSubmit={handleGenerate}
          className="bg-white/80 rounded-3xl p-6 sm:p-8 border border-brand-gold/20 shadow-[0_20px_40px_rgba(197,160,89,0.12)] space-y-5"
        >
          <div className="grid sm:grid-cols-[180px_1fr] gap-4">
            <div>
              <label htmlFor="prefix" className="block text-[10px] uppercase tracking-[0.2em] font-bold text-brand-sand mb-2">
                Select Prefix
              </label>
              <select id="prefix" className={field} value={prefix} onChange={(e) => setPrefix(e.target.value as Prefix)}>
                {PREFIXES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="guestName" className="block text-[10px] uppercase tracking-[0.2em] font-bold text-brand-sand mb-2">
                Guest Name
              </label>
              <input
                id="guestName"
                type="text"
                placeholder="e.g. Sanjaya"
                className={field}
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className={`${btn} w-full bg-brand-mocha text-brand-champagne hover:bg-brand-mocha/90 shadow-md`}
          >
            <Link2 className="w-4 h-4" /> Generate Link
          </button>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              disabled={!result}
              onClick={() => result && copy(result.link, 'Link copied!')}
              className={`${btn} border border-brand-gold/40 bg-white hover:bg-brand-gold/10`}
            >
              <Copy className="w-4 h-4" /> Copy Link Only
            </button>
            <button
              type="button"
              disabled={!result}
              onClick={() => result && copy(result.message, 'Message copied!')}
              className={`${btn} border border-brand-gold/40 bg-white hover:bg-brand-gold/10`}
            >
              <MessageCircle className="w-4 h-4" /> Copy Full Message
            </button>
          </div>
        </form>

        {result && (
          <section className="mt-8 space-y-5">
            <div className="bg-white/80 rounded-2xl p-5 border border-brand-gold/20">
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-sand mb-2">Generated Link</p>
              <a
                href={result.link}
                target="_blank"
                rel="noopener noreferrer"
                className="break-all text-brand-mocha underline decoration-brand-gold/50 underline-offset-4"
              >
                {result.link}
              </a>
            </div>

            <div className="bg-white/80 rounded-2xl p-5 border border-brand-gold/20">
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-sand mb-2">Greeting</p>
              <p className="font-serif text-xl">{buildGreeting(result.displayName)}</p>
              <p className="font-serif italic text-brand-sand mt-2">
                Website shows: “We cordially invite <strong className="not-italic text-brand-mocha">{result.displayName}</strong> to celebrate our special day with us.”
              </p>
            </div>

            <div className="bg-white/80 rounded-2xl p-5 border border-brand-gold/20">
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-sand mb-2">Message Preview</p>
              <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-relaxed">{result.message}</pre>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
