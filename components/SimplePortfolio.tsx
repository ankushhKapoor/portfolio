'use client';

import { useState, useEffect, useRef, FormEvent } from 'react';
import { PORTFOLIO } from '@/lib/portfolio';

interface Props { onClose: () => void; }
type Theme = 'dark' | 'light';
const SECTIONS = ['about', 'experience', 'projects', 'community', 'contact'];

const QUOTES = [
    'Expect nothing, appreciate everything.',
    'Help is love made visible.',
    'Push past your limits.',
];

// ── Inline SVGs ───────────────────────────────────────────────────────────────
const Svg = {
    email: (c: string) => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>,
    github: (c: string) => <svg width="15" height="15" viewBox="0 0 24 24" fill={c}><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>,
    linkedin: (c: string) => <svg width="15" height="15" viewBox="0 0 24 24" fill={c}><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>,
    twitter: (c: string) => <svg width="15" height="15" viewBox="0 0 24 24" fill={c}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>,
    globe: (c: string) => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /><path d="M2 12h20" /></svg>,
    arrow: (c: string) => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M17 7H7M17 7V17" /></svg>,
    chevL: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>,
    sun: (c: string) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" /></svg>,
    moon: (c: string) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>,
    send: (c: string) => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4 20-7z" /><path d="M22 2 11 13" /></svg>,
};

// ── SVG Illustrations (bigger viewbox) ───────────────────────────────────────
function TransformerArt({ dim, accent }: { dim: string; accent: string }) {
    return (
        <svg width="100%" height="100%" viewBox="0 0 260 140" fill="none" xmlns="http://www.w3.org/2000/svg">
            {[0, 1, 2, 3].map(i => <rect key={i} x={14 + i * 58} y={42} width={38} height={44} rx="5" stroke={dim} strokeWidth="1.3" fill="none" />)}
            {[0, 1, 2].map(i => <line key={i} x1={52 + i * 58} y1={64} x2={72 + i * 58} y2={64} stroke={dim} strokeWidth="0.9" />)}
            <rect x="14" y="42" width="38" height="44" rx="5" stroke={accent} strokeWidth="2" fill={`${accent}08`} opacity="0.95" />
            <rect x="188" y="42" width="38" height="44" rx="5" stroke={accent} strokeWidth="2" fill={`${accent}08`} opacity="0.95" />
            {[0, 1, 2].map(i => <circle key={i} cx={33} cy={52 + i * 9} r="2.5" fill={accent} opacity={0.45 + i * 0.28} />)}
            {[0, 1, 2].map(i => <circle key={i} cx={207} cy={52 + i * 9} r="2.5" fill={accent} opacity={0.45 + i * 0.28} />)}
            <text x="130" y="118" textAnchor="middle" fill={dim} fontSize="9.5" fontFamily="monospace">Encoder  Decoder</text>
            <path d="M62 28 C96 12, 164 12, 198 28" stroke={accent} strokeWidth="1" strokeDasharray="4 2.5" fill="none" opacity="0.45" />
            <path d="M62 28 L58 22 M62 28 L68 22" stroke={accent} strokeWidth="0.8" opacity="0.4" />
        </svg>
    );
}
function KernelArt({ dim, accent }: { dim: string; accent: string }) {
    const layers = ['User Space', 'Kernel', 'Hardware'];
    return (
        <svg width="100%" height="100%" viewBox="0 0 260 140" fill="none" xmlns="http://www.w3.org/2000/svg">
            {layers.map((l, i) => (
                <g key={l}>
                    <rect x={22} y={10 + i * 38} width={216} height={28} rx="4" stroke={i === 1 ? accent : dim} strokeWidth={i === 1 ? 2 : 1} fill={i === 1 ? `${accent}12` : 'none'} opacity={i === 1 ? 1 : 0.6} />
                    <text x="130" y={28 + i * 38} textAnchor="middle" fill={i === 1 ? accent : dim} fontSize="10" fontFamily="monospace" opacity={i === 1 ? 1 : 0.7}>{l}</text>
                </g>
            ))}
            {[70, 130, 190].map(x => <line key={x} x1={x} y1={38} x2={x} y2={48} stroke={accent} strokeWidth="1" opacity="0.4" />)}
            <text x="130" y="128" textAnchor="middle" fill={dim} fontSize="9" fontFamily="monospace">32-bit protected mode</text>
        </svg>
    );
}
function AllocArt({ dim, accent }: { dim: string; accent: string }) {
    const blocks: { w: number, used: boolean, label: string }[] = [
        { w: 52, used: true, label: 'alloc' },
        { w: 38, used: false, label: 'free' },
        { w: 44, used: true, label: 'alloc' },
        { w: 28, used: false, label: 'free' },
        { w: 52, used: true, label: 'alloc' },
    ];
    let x = 14;
    return (
        <svg width="100%" height="100%" viewBox="0 0 260 140" fill="none" xmlns="http://www.w3.org/2000/svg">
            {blocks.map((b, i) => {
                const rx = x; x += b.w + 5;
                return (
                    <g key={i}>
                        <rect x={rx} y={42} width={b.w} height={44} rx="3" stroke={b.used ? accent : dim} strokeWidth={b.used ? 1.8 : 1} fill={b.used ? `${accent}14` : 'none'} />
                        <text x={rx + b.w / 2} y={68} textAnchor="middle" fill={b.used ? accent : dim} fontSize="7.5" fontFamily="monospace" opacity={b.used ? 0.9 : 0.5}>{b.label}</text>
                    </g>
                );
            })}
            <text x="130" y="112" textAnchor="middle" fill={dim} fontSize="9" fontFamily="monospace">1 GB Virtual Heap</text>
            <line x1="14" y1="36" x2="246" y2="36" stroke={dim} strokeWidth="0.8" strokeDasharray="3 2" />
            <text x="14" y="130" fill={dim} fontSize="8" fontFamily="monospace">0x0000</text>
            <text x="218" y="130" fill={dim} fontSize="8" fontFamily="monospace">0x3FFF…</text>
        </svg>
    );
}
function OTCArt({ dim, accent }: { dim: string; accent: string }) {
    const r = 40;
    const nodes = Array.from({ length: 8 }, (_, i) => ({
        x: 130 + r * Math.cos((i / 8) * Math.PI * 2 - Math.PI / 2),
        y: 64 + r * Math.sin((i / 8) * Math.PI * 2 - Math.PI / 2),
    }));
    return (
        <svg width="100%" height="100%" viewBox="0 0 260 140" fill="none" xmlns="http://www.w3.org/2000/svg">
            {nodes.map((n, i) => nodes.slice(i + 1).map((m, j) => (
                <line key={`${i}-${j}`} x1={n.x} y1={n.y} x2={m.x} y2={m.y} stroke={dim} strokeWidth="0.6" opacity="0.25" />
            )))}
            {nodes.map((n, i) => <circle key={i} cx={n.x} cy={n.y} r="6" fill={i === 0 ? accent : dim} opacity={i === 0 ? 0.9 : 0.35} />)}
            {nodes.map((n, i) => i === 0 && <circle key="pulse" cx={n.x} cy={n.y} r="11" stroke={accent} strokeWidth="0.8" fill="none" opacity="0.3" />)}
            <circle cx="130" cy="64" r="10" fill={accent} opacity="0.1" />
            <circle cx="130" cy="64" r="5" fill={accent} opacity="0.85" />
            <text x="130" y="124" textAnchor="middle" fill={dim} fontSize="9" fontFamily="monospace">600+ members · OTC</text>
        </svg>
    );
}
function OWHArt({ dim, accent }: { dim: string; accent: string }) {
    return (
        <svg width="100%" height="100%" viewBox="0 0 260 140" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="130" cy="62" r="46" stroke={dim} strokeWidth="1.1" />
            <path d="M130 16 Q144 38, 144 62 Q144 86, 130 108 Q116 86, 116 62 Q116 38, 130 16" stroke={accent} strokeWidth="1.8" fill="none" opacity="0.85" />
            <line x1="84" y1="62" x2="176" y2="62" stroke={dim} strokeWidth="1" />
            <line x1="88" y1="38" x2="172" y2="38" stroke={dim} strokeWidth="0.6" opacity="0.5" />
            <line x1="88" y1="86" x2="172" y2="86" stroke={dim} strokeWidth="0.6" opacity="0.5" />
            {[0, 1, 2, 3].map(i => <circle key={i} cx={84 + i * 30} cy={62} r="2" fill={accent} opacity="0.4" />)}
            <text x="130" y="128" textAnchor="middle" fill={dim} fontSize="9" fontFamily="monospace">date-holidays · 249 countries</text>
        </svg>
    );
}

export default function SimplePortfolio({ onClose }: Props) {
    const [theme, setTheme] = useState<Theme>('dark');
    const [active, setActive] = useState('about');
    const [mounted, setMounted] = useState(false);
    const [closing, setClosing] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);
    const [form, setForm] = useState({ name: '', email: '', message: '' });
    const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle');
    const [formError, setFormError] = useState('');

    useEffect(() => {
        const s = localStorage.getItem('sp-theme') as Theme | null;
        if (s === 'dark' || s === 'light') setTheme(s);
        const id = requestAnimationFrame(() => setMounted(true));
        return () => cancelAnimationFrame(id);
    }, []);

    useEffect(() => { localStorage.setItem('sp-theme', theme); }, [theme]);

    useEffect(() => {
        const el = contentRef.current;
        if (!el) return;
        const onScroll = () => {
            let cur = 'about';
            SECTIONS.forEach(id => {
                const s = el.querySelector(`#sp-${id}`) as HTMLElement | null;
                if (s && s.offsetTop - el.scrollTop < 180) cur = id;
            });
            setActive(cur);
        };
        el.addEventListener('scroll', onScroll, { passive: true });
        return () => el.removeEventListener('scroll', onScroll);
    }, []);

    const scrollTo = (id: string) =>
        contentRef.current?.querySelector(`#sp-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

    const handleClose = () => { setClosing(true); setTimeout(onClose, 420); };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setFormStatus('sending'); setFormError('');
        try {
            const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
            const data = await res.json();
            if (res.ok && data.success) { setFormStatus('ok'); setForm({ name: '', email: '', message: '' }); }
            else { setFormStatus('err'); setFormError(data.error || 'Something went wrong.'); }
        } catch { setFormStatus('err'); setFormError('Network error. Please try again.'); }
    };

    const isDark = theme === 'dark';
    const C = {
        bg: isDark ? '#0c0c0c' : '#faf9f7',
        text: isDark ? '#ededed' : '#111',
        muted: isDark ? '#7a7a7a' : '#666',
        dim: isDark ? '#3a3a3a' : '#c0c0c0',
        accent: '#e95420',
        acA: isDark ? 'rgba(233,84,32,0.12)' : 'rgba(233,84,32,0.08)',
        border: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)',
        borderAc: isDark ? 'rgba(233,84,32,0.35)' : 'rgba(233,84,32,0.25)',
        navBg: isDark ? 'rgba(12,12,12,0.9)' : 'rgba(250,249,247,0.92)',
        artBg: isDark ? 'rgba(255,255,255,0.028)' : 'rgba(0,0,0,0.028)',
        artDim: isDark ? '#2e2e2e' : '#c0c0c0',
        // Holographic sweep: exact -45deg diagonal gradient, orange-toned
        holoSweep: isDark
            ? 'linear-gradient(0deg, transparent, transparent 30%, rgba(233,84,32,0.32))'
            : 'linear-gradient(0deg, transparent, transparent 30%, rgba(233,84,32,0.22))',
        holoShadow: isDark
            ? '0 0 24px rgba(233,84,32,0.5), 0 4px 40px rgba(0,0,0,0.4)'
            : '0 0 24px rgba(233,84,32,0.35), 0 4px 20px rgba(0,0,0,0.08)',
    };

    const inputStyle: React.CSSProperties = {
        width: '100%', background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
        border: `1px solid ${C.border}`, borderRadius: 10, padding: '12px 14px',
        fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: C.text,
        outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s',
        resize: 'none' as const, boxSizing: 'border-box',
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 8000,
            background: C.bg, display: 'flex', flexDirection: 'column',
            fontFamily: "'DM Sans', sans-serif",
            animation: closing ? 'spOut 0.42s ease forwards' : mounted ? 'spIn 0.46s cubic-bezier(0.16,1,0.3,1) forwards' : 'none',
            opacity: mounted ? undefined : 0,
            transition: 'background 0.3s',
            willChange: 'transform,opacity',
        }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap');
        @keyframes spIn  { from{opacity:0;transform:translateY(28px) scale(.97)} to{opacity:1;transform:none} }
        @keyframes spOut { from{opacity:1;transform:none} to{opacity:0;transform:translateY(20px) scale(.97)} }
        @keyframes spDot { 0%,100%{opacity:1} 50%{opacity:.35} }

        /* ── Nav links ── */
        .sp-nl {
          position: relative; overflow: hidden;
          transition: color .18s, background .2s;
          border-radius: 6px; padding: 5px 13px;
          cursor: pointer; font-size: 13px;
          background: none; border: none;
          font-family: 'DM Sans', sans-serif;
        }
        .sp-nl::before {
          content: '';
          position: absolute;
          top: -50%; left: -50%;
          width: 200%; height: 200%;
          background: ${C.holoSweep};
          transform: rotate(-45deg);
          transition: all 0.5s ease;
          opacity: 0;
          pointer-events: none;
        }
        .sp-nl:hover { background: ${isDark ? 'rgba(233,84,32,0.06)' : 'rgba(233,84,32,0.05)'}; }
        .sp-nl:hover::before { opacity: 1; transform: rotate(-45deg) translateY(80%); }

        /* ── Holographic card rows — exact reference pattern ── */
        .sp-holo {
          position: relative;
          overflow: hidden;
          border-bottom: 1px solid ${C.border};
          padding: 32px 20px;
          border-radius: 14px;
          transition: transform 0.5s ease, box-shadow 0.5s ease, border-color 0.4s ease, background 0.4s ease;
        }
        .sp-holo::before {
          content: '';
          position: absolute;
          top: -50%; left: -50%;
          width: 200%; height: 200%;
          background: ${C.holoSweep};
          transform: rotate(-45deg);
          transition: all 0.5s ease;
          opacity: 0;
          pointer-events: none;
        }
        .sp-holo:hover {
          transform: scale(1.018) translateY(-2px);
          box-shadow: ${C.holoShadow};
          border-color: ${C.borderAc} !important;
          background: ${isDark ? 'rgba(233,84,32,0.035)' : 'rgba(233,84,32,0.025)'};
        }
        .sp-holo:hover::before {
          opacity: 1;
          transform: rotate(-45deg) translateY(100%);
        }

        /* ── Contact quick links ── */
        .sp-cl {
          display: flex; align-items: center; gap: 8px;
          text-decoration: none; cursor: pointer;
          position: relative; overflow: hidden;
          border-radius: 10px;
          transition: transform 0.5s ease, box-shadow 0.5s ease, border-color 0.4s ease;
        }
        .sp-cl::before {
          content: '';
          position: absolute;
          top: -50%; left: -50%;
          width: 200%; height: 200%;
          background: ${C.holoSweep};
          transform: rotate(-45deg);
          transition: all 0.5s ease;
          opacity: 0;
          pointer-events: none;
        }
        .sp-cl:hover { transform: translateY(-1px); box-shadow: ${C.holoShadow}; border-color: ${C.borderAc} !important; }
        .sp-cl:hover::before { opacity: 1; transform: rotate(-45deg) translateY(100%); }

        /* ── Tags ── */
        .sp-tag {
          display: inline-block; font-family: 'DM Sans', sans-serif;
          font-size: 12px; font-weight: 500; letter-spacing: .02em;
          padding: 3px 10px; border-radius: 20px;
          transition: transform .15s, box-shadow .18s;
        }
        .sp-tag:hover { transform: translateY(-1px); box-shadow: 0 3px 10px rgba(233,84,32,0.22); }

        /* ── Scroll ── */
        .sp-scroll::-webkit-scrollbar { width: 3px; }
        .sp-scroll::-webkit-scrollbar-track { background: transparent; }
        .sp-scroll::-webkit-scrollbar-thumb { background: ${C.borderAc}; border-radius: 2px; }

        /* ── Submit button ── */
        .sp-sub { transition: transform .18s, box-shadow .18s; }
        .sp-sub:hover { transform: translateY(-1px); box-shadow: 0 4px 18px rgba(233,84,32,0.38); }
        .sp-sub:active { transform: none; }

        /* ── Back/theme buttons ── */
        .sp-btn-sm { transition: background .2s, border-color .2s, transform .2s; }
        .sp-btn-sm:hover { background: ${C.acA} !important; border-color: ${C.borderAc} !important; transform: translateY(-1px); }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .sp-nav-wrap { padding: 0 16px !important; }
          .sp-nl-wrap { display: none !important; }
          .sp-body-wrap { padding: 0 16px 80px !important; }
          .sp-card-content { flex-direction: column !important; gap: 20px !important; align-items: stretch !important; }
          .sp-card-art { width: 100% !important; max-width: 180px !important; height: auto !important; aspect-ratio: 220/130; margin: 0 auto; }
          .sp-grid-2 { grid-template-columns: 1fr !important; }
          .sp-holo { padding: 24px 16px !important; }
          .sp-hero-title { font-size: 42px !important; }
        }
      `}</style>

            {/* ── NAV ── */}
            <nav className="sp-nav-wrap" style={{
                position: 'sticky', top: 0, zIndex: 10,
                background: C.navBg, backdropFilter: 'blur(20px)',
                borderBottom: `1px solid ${C.border}`,
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 36px', height: 54, gap: 8,
                transition: 'background .3s, border-color .3s',
            }}>
                <button onClick={handleClose} className="sp-btn-sm" style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    background: 'none', border: 'none', cursor: 'pointer',
                    padding: '5px 10px 5px 6px', borderRadius: 8,
                    color: C.accent, fontFamily: "'Ubuntu Mono',monospace",
                    fontSize: 13, fontWeight: 600, letterSpacing: '.02em',
                }}>
                    <div style={{ width: 26, height: 26, borderRadius: 7, background: 'linear-gradient(135deg,#e95420,#f37222)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(233,84,32,.35)' }}>
                        {Svg.chevL()}
                    </div>
                    KapoorOS
                </button>

                <div className="sp-nl-wrap" style={{ display: 'flex', alignItems: 'center' }}>
                    {SECTIONS.map(s => (
                        <button key={s} className="sp-nl" onClick={() => scrollTo(s)}
                            style={{ fontWeight: active === s ? 600 : 400, color: active === s ? C.accent : C.muted, position: 'relative', textTransform: 'capitalize' }}>
                            {s}
                            {active === s && <span style={{ position: 'absolute', bottom: 1, left: '50%', transform: 'translateX(-50%)', width: 4, height: 4, borderRadius: '50%', background: C.accent, animation: 'spDot 2s infinite', display: 'block' }} />}
                        </button>
                    ))}
                </div>

                <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} className="sp-btn-sm" style={{
                    display: 'flex', alignItems: 'center', gap: 7,
                    background: 'none', border: `1px solid ${C.border}`,
                    borderRadius: 8, padding: '5px 12px',
                    color: C.muted, cursor: 'pointer', fontSize: 13,
                    fontFamily: "'DM Sans',sans-serif",
                }}>
                    {isDark ? Svg.moon(C.accent) : Svg.sun(C.accent)}
                    {isDark ? 'Dark' : 'Light'}
                </button>
            </nav>

            {/* ── CONTENT ── */}
            <div ref={contentRef} className="sp-scroll" style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
                <div className="sp-body-wrap" style={{ maxWidth: 820, margin: '0 auto', padding: '0 36px 100px' }}>

                    {/* ABOUT / HERO */}
                    <section id="sp-about" style={{ padding: '80px 0 52px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 22 }}>
                            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 8px #22c55e' }} />
                            <span style={{ fontFamily: "'Ubuntu Mono',monospace", fontSize: 11, color: C.muted, letterSpacing: '.1em', textTransform: 'uppercase' }}>available for opportunities</span>
                        </div>
                        <h1 className="sp-hero-title" style={{ fontFamily: "'DM Serif Display',serif", fontSize: 'clamp(48px,7vw,74px)', fontWeight: 400, color: C.text, lineHeight: 1.04, letterSpacing: '-.025em', marginBottom: 14, transition: 'color .3s' }}>
                            {PORTFOLIO.name}
                        </h1>
                        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 18, color: C.muted, fontWeight: 400, lineHeight: 1.65, maxWidth: 520, marginBottom: 28, transition: 'color .3s' }}>
                            {PORTFOLIO.title}
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, alignItems: 'center' }}>
                            {[
                                { icon: Svg.email, text: PORTFOLIO.email, href: `mailto:${PORTFOLIO.email}` },
                                { icon: Svg.github, text: 'ankushhKapoor', href: `https://${PORTFOLIO.github}` },
                                { icon: Svg.linkedin, text: 'in/ankushhkapoor', href: `https://${PORTFOLIO.linkedin}` },
                                { icon: Svg.twitter, text: '@ankushhKapoor', href: `https://${PORTFOLIO.twitter}` },
                            ].map(({ icon, text: t, href }) => (
                                <a key={t} href={href} target="_blank" rel="noopener noreferrer"
                                    style={{ display: 'flex', alignItems: 'center', gap: 7, color: C.muted, textDecoration: 'none', fontSize: 14, fontFamily: "'DM Sans',sans-serif", transition: 'color .18s' }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = C.accent; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = C.muted; }}>
                                    {icon(C.muted)}{t}
                                </a>
                            ))}
                        </div>

                        {/* Education */}
                        <div style={{ marginTop: 44, paddingTop: 32, borderTop: `1px solid ${C.border}` }}>
                            <Label text="Education" color={C.muted} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
                                <div>
                                    <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: 21, color: C.text }}>{PORTFOLIO.education.school}</div>
                                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: C.muted, marginTop: 5 }}>{PORTFOLIO.education.degree}</div>
                                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: C.muted, marginTop: 10 }}>
                                        SGPA <span style={{ color: C.accent, fontWeight: 600 }}>{PORTFOLIO.education.sgpa}</span>
                                        <span style={{ color: C.dim, margin: '0 10px' }}>·</span>
                                        Graduating <span style={{ color: C.text }}>{PORTFOLIO.education.graduation}</span>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: C.accent }}>{PORTFOLIO.education.location}</div>
                                    <div style={{ fontFamily: "'Ubuntu Mono',monospace", fontSize: 13, color: C.muted, marginTop: 4 }}>{PORTFOLIO.education.period}</div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <Divider color={C.border} />

                    {/* EXPERIENCE */}
                    <section id="sp-experience" style={{ padding: '56px 0' }}>
                        <SH label="Experience" text={C.text} accent={C.accent} />
                        {PORTFOLIO.experience.map(exp => (
                            <div key={exp.company} className="sp-holo">
                                <div className="sp-card-content" style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
                                    <div className="sp-card-art" style={{ width: 220, height: 130, borderRadius: 12, background: C.artBg, border: `1px solid ${C.border}`, flexShrink: 0, overflow: 'hidden' }}>
                                        <OWHArt dim={C.artDim} accent={C.accent} />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                                            <div>
                                                <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: 21, color: C.text }}>{exp.company}</div>
                                                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: C.accent, marginTop: 4, fontWeight: 500 }}>{exp.role}</div>
                                            </div>
                                            <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                                <div style={{ fontFamily: "'Ubuntu Mono',monospace", fontSize: 13, color: C.muted }}>{exp.period}</div>
                                                {'location' in exp && <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.muted, marginTop: 3 }}>{(exp as { location?: string }).location}</div>}
                                            </div>
                                        </div>
                                        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14.5, color: C.muted, marginTop: 14, lineHeight: 1.78, marginBottom: 12 }}>{exp.summary}</p>
                                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 9 }}>
                                            {exp.bullets.map((b, i) => (
                                                <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                                                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: C.accent, flexShrink: 0, marginTop: 9 }} />
                                                    <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: C.muted, lineHeight: 1.72 }}>{b}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </section>

                    <Divider color={C.border} />

                    {/* PROJECTS */}
                    <section id="sp-projects" style={{ padding: '56px 0' }}>
                        <SH label="Projects" text={C.text} accent={C.accent} />
                        {PORTFOLIO.projects.map((proj, idx) => {
                            const ArtComp = idx === 0 ? TransformerArt : idx === 1 ? KernelArt : AllocArt;
                            return (
                                <div key={proj.name} className="sp-holo">
                                    <div className="sp-card-content" style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
                                        <div className="sp-card-art" style={{ width: 220, height: 130, borderRadius: 12, background: C.artBg, border: `1px solid ${C.border}`, flexShrink: 0, overflow: 'hidden' }}>
                                            <ArtComp dim={C.artDim} accent={C.accent} />
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
                                                <div>
                                                    <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: 21, color: C.text }}>{proj.name}</div>
                                                    {'subtitle' in proj && <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.muted, marginTop: 2 }}>{(proj as { subtitle?: string }).subtitle}</div>}
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 9 }}>
                                                        {proj.tech.split(', ').map(t => (
                                                            <span key={t} className="sp-tag" style={{ background: C.acA, color: C.accent, border: `1px solid ${C.borderAc}` }}>{t}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 7, flexShrink: 0 }}>
                                                    <span style={{ fontFamily: "'Ubuntu Mono',monospace", fontSize: 13, color: C.muted }}>{proj.date}</span>
                                                    {'githubUrl' in proj && (
                                                        <a href={(proj as { githubUrl?: string }).githubUrl} target="_blank" rel="noopener noreferrer"
                                                            style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: C.accent, textDecoration: 'none', fontWeight: 500, transition: 'opacity .15s' }}
                                                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '.55'; }}
                                                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}>
                                                            {Svg.github(C.accent)} GitHub {Svg.arrow(C.accent)}
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                            {'summary' in proj && <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14.5, color: C.muted, marginTop: 13, lineHeight: 1.78, marginBottom: 10 }}>{(proj as { summary?: string }).summary}</p>}
                                            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 9 }}>
                                                {proj.bullets.map((b, i) => (
                                                    <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                                                        <span style={{ width: 4, height: 4, borderRadius: '50%', background: C.accent, flexShrink: 0, marginTop: 9 }} />
                                                        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: C.muted, lineHeight: 1.72 }}>{b}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </section>

                    <Divider color={C.border} />

                    {/* COMMUNITY */}
                    <section id="sp-community" style={{ padding: '56px 0' }}>
                        <SH label="Community" text={C.text} accent={C.accent} />
                        {PORTFOLIO.extracurricular.map(act => (
                            <div key={act.name} className="sp-holo">
                                <div className="sp-card-content" style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
                                    <div className="sp-card-art" style={{ width: 220, height: 130, borderRadius: 12, background: C.artBg, border: `1px solid ${C.border}`, flexShrink: 0, overflow: 'hidden' }}>
                                        <OTCArt dim={C.artDim} accent={C.accent} />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 8 }}>
                                            <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: 21, color: C.text }}>{act.name}</div>
                                            <div style={{ fontFamily: "'Ubuntu Mono',monospace", fontSize: 13, color: C.muted, flexShrink: 0 }}>{act.period}</div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
                                            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: C.accent, fontWeight: 500 }}>{act.role}</span>
                                            {act.link && (
                                                <a href={`https://${act.link}`} target="_blank" rel="noopener noreferrer"
                                                    style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.muted, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, transition: 'color .18s' }}
                                                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = C.accent; }}
                                                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = C.muted; }}>
                                                    {Svg.globe(C.muted)} {act.link}
                                                </a>
                                            )}
                                        </div>
                                        {'summary' in act && <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14.5, color: C.muted, marginTop: 14, lineHeight: 1.78, marginBottom: 10 }}>{(act as { summary?: string }).summary}</p>}
                                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 9 }}>
                                            {act.bullets.map((b, i) => (
                                                <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                                                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: C.accent, flexShrink: 0, marginTop: 9 }} />
                                                    <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: C.muted, lineHeight: 1.72 }}>{b}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </section>

                    <Divider color={C.border} />

                    {/* CONTACT */}
                    <section id="sp-contact" style={{ padding: '56px 0 20px' }}>
                        <SH label="Say Hello" text={C.text} accent={C.accent} />
                        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, color: C.muted, marginTop: 14, maxWidth: 500, lineHeight: 1.78 }}>
                            Open to collaborations, conversations, and opportunities. Drop me a message and I&apos;ll get back to you.
                        </p>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 24, marginBottom: 44 }}>
                            {[
                                { icon: Svg.email, label: "Email", href: `mailto:${PORTFOLIO.email}` },
                                { icon: Svg.github, label: 'GitHub', href: `https://${PORTFOLIO.github}` },
                                { icon: Svg.twitter, label: 'Twitter / X', href: `https://${PORTFOLIO.twitter}` },
                                { icon: Svg.linkedin, label: 'LinkedIn', href: `https://${PORTFOLIO.linkedin}` },
                            ].map(({ icon, label, href }) => (
                                <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="sp-cl"
                                    style={{ color: C.text, padding: '9px 15px', border: `1px solid ${C.border}`, background: 'transparent' }}>
                                    {icon(C.accent)}
                                    <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13 }}>{label}</span>
                                    {Svg.arrow(C.muted)}
                                </a>
                            ))}
                        </div>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <div className="sp-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                <div>
                                    <Label text="Your Name" color={C.muted} />
                                    <input placeholder="Your Name" value={form.name} required
                                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                        style={{ ...inputStyle, marginTop: 6 }}
                                        onFocus={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.boxShadow = `0 0 0 3px ${C.acA}`; }}
                                        onBlur={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = 'none'; }}
                                    />
                                </div>
                                <div>
                                    <Label text="Your Email" color={C.muted} />
                                    <input type="email" placeholder="hello@example.com" value={form.email} required
                                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                        style={{ ...inputStyle, marginTop: 6 }}
                                        onFocus={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.boxShadow = `0 0 0 3px ${C.acA}`; }}
                                        onBlur={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = 'none'; }}
                                    />
                                </div>
                            </div>
                            <div>
                                <Label text="Message" color={C.muted} />
                                <textarea placeholder="Hey Ankush, I would love to chat about..." value={form.message} required rows={5}
                                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                                    style={{ ...inputStyle, marginTop: 6 }}
                                    onFocus={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.boxShadow = `0 0 0 3px ${C.acA}`; }}
                                    onBlur={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = 'none'; }}
                                />
                            </div>
                            {formStatus === 'err' && <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: '#f87171', margin: 0 }}>{formError}</p>}
                            {formStatus === 'ok' && <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: '#4ade80', margin: 0 }}>Message sent! I&apos;ll get back to you soon.</p>}
                            <button type="submit" disabled={formStatus === 'sending'} className="sp-sub"
                                style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 8, padding: '10px 24px', borderRadius: 10, border: 'none', background: C.accent, color: '#fff', fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600, cursor: formStatus === 'sending' ? 'default' : 'pointer', opacity: formStatus === 'sending' ? 0.7 : 1 }}>
                                {Svg.send('#fff')}
                                {formStatus === 'sending' ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    </section>

                    {/* ── QUOTES ── */}
                    <div style={{ marginTop: 72, paddingTop: 48, borderTop: `1px solid ${C.border}` }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center' }}>
                            {QUOTES.map((q, i) => (
                                <p key={i} style={{
                                    fontFamily: "'DM Serif Display',serif",
                                    fontStyle: 'italic',
                                    fontSize: 'clamp(16px,2.2vw,20px)',
                                    color: isDark ? `rgba(237,237,237,${0.28 + i * 0.06})` : `rgba(0,0,0,${0.25 + i * 0.06})`,
                                    margin: 0,
                                    textAlign: 'center',
                                    letterSpacing: '-.01em',
                                    lineHeight: 1.5,
                                    transition: 'color .3s',
                                }}>
                                    &ldquo;{q}&rdquo;
                                </p>
                            ))}
                        </div>
                    </div>

                    {/* Footer */}
                    <div style={{ marginTop: 52, paddingTop: 24, borderTop: `1px solid ${C.border}`, textAlign: 'center' }}>
                        <button onClick={handleClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Ubuntu Mono',monospace", fontSize: 12, color: C.muted, padding: '4px 8px', borderRadius: 6, transition: 'color .18s' }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = C.accent; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = C.muted; }}>
                            back to KapoorOS
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Divider({ color }: { color: string }) {
    return <div style={{ height: 1, background: color, transition: 'background .3s' }} />;
}
function SH({ label, text, accent }: { label: string; text: string; accent: string }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}>
            <div style={{ width: 3, height: 26, borderRadius: 2, background: accent, flexShrink: 0 }} />
            <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 30, fontWeight: 400, color: text, letterSpacing: '-.01em', transition: 'color .3s', margin: 0 }}>{label}</h2>
        </div>
    );
}
function Label({ text, color }: { text: string; color: string }) {
    return <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color, textTransform: 'uppercase', letterSpacing: '.08em', fontWeight: 600 }}>{text}</div>;
}
