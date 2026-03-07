'use client';
import { PORTFOLIO } from '@/lib/portfolio';

const MONO = "'Ubuntu Mono', monospace";
const SANS = "'Ubuntu', sans-serif";

// Social link configs
const SOCIALS = [
    {
        label: 'GitHub',
        href: `https://${PORTFOLIO.github}`,
        color: '#e0e0e0',
        bg: 'rgba(255,255,255,0.06)',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.54 2.87 8.38 6.84 9.74.5.09.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.57 2.34 1.12 2.91.85.09-.66.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.38 9.38 0 0 1 12 6.84c.85.004 1.71.12 2.51.34 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.07.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.81 0 .27.18.59.69.49C19.13 20.63 22 16.79 22 12.26 22 6.58 17.52 2 12 2z" />
            </svg>
        ),
    },
    {
        label: 'LinkedIn',
        href: `https://${PORTFOLIO.linkedin}`,
        color: '#61a8e0',
        bg: 'rgba(97,168,224,0.08)',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
            </svg>
        ),
    },
    {
        label: 'Twitter / X',
        href: `https://${PORTFOLIO.twitter}`,
        color: '#9ba3af',
        bg: 'rgba(156,163,175,0.06)',
        icon: (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.26 5.632 5.904-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
            </svg>
        ),
    },
    {
        label: 'Email',
        href: `mailto:${PORTFOLIO.email}`,
        color: '#e95420',
        bg: 'rgba(233,84,32,0.08)',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
        ),
    },
];

export default function AboutApp() {
    return (
        <div className="flex-1 overflow-y-auto px-6 py-6" style={{ background: '#1e1e1e', fontFamily: SANS }}>

            {/* ── Header ── */}
            <div className="flex gap-5 items-start mb-8">
                <div className="w-[72px] h-[72px] rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                    style={{ background: 'radial-gradient(135deg, #f37222, #e95420)', boxShadow: '0 8px 24px rgba(233,84,32,0.35)' }}>
                    🧑‍💻
                </div>
                <div>
                    <div className="text-[21px] font-bold text-white" style={{ fontFamily: MONO }}>{PORTFOLIO.name}</div>
                    <div className="text-[13px] mt-1" style={{ color: '#e95420' }}>{PORTFOLIO.title}</div>

                    {/* Social links */}
                    <div className="flex flex-wrap gap-2 mt-3">
                        {SOCIALS.map(s => (
                            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                                title={s.label}
                                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] transition-all select-none"
                                style={{ background: s.bg, border: `1px solid ${s.color}22`, color: s.color, textDecoration: 'none' }}
                                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = s.color + '22'; el.style.borderColor = s.color + '66'; el.style.transform = 'translateY(-1px)'; }}
                                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = s.bg; el.style.borderColor = s.color + '22'; el.style.transform = 'none'; }}>
                                <span style={{ color: s.color, display: 'flex' }}>{s.icon}</span>
                                <span style={{ fontFamily: MONO }}>{s.label}</span>
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Divider ── */}
            <Divider />

            {/* ── Bio ── */}
            <div className="mb-8">
                <div className="text-[15px] font-semibold text-white mb-4" style={{ fontFamily: MONO }}>
                    Decoding Complexity, One Line at a Time
                </div>
                <div className="flex flex-col gap-3.5">
                    <p className="text-[13px] leading-[1.7]" style={{ color: '#bbb' }}>
                        I am Ankush Kapoor, a Second Year Computer Engineering student who enjoys exploring how software and systems work at a deeper level. My interests lie in low level programming, system design, and understanding the logic that powers modern computing. I like breaking complex problems into smaller parts and building solutions step by step.
                    </p>
                    <p className="text-[13px] leading-[1.7]" style={{ color: '#bbb' }}>
                        I spend a lot of time working with technologies such as C, Python, Linux environments, and modern tools. For me, programming is not only about writing code but about thinking critically, experimenting with ideas, and continuously learning how systems operate behind the scenes.
                    </p>
                    <p className="text-[13px] leading-[1.7]" style={{ color: '#bbb' }}>
                        Beyond technology, I value curiosity, consistency, and a mindset focused on growth. I believe in pushing beyond comfort zones, appreciating the learning process, and helping others whenever possible. I try to approach both technology and life with patience, discipline, and a desire to keep improving.
                    </p>
                </div>

                {/* Quotes */}
                <div className="flex flex-col gap-2.5 mt-6">
                    {[
                        'Expect nothing, appreciate everything.',
                        'Help is love made visible.',
                        'Push past your limits.',
                    ].map((q, i) => (
                        <div key={i} className="px-4 py-2.5 rounded-lg"
                            style={{ background: 'rgba(233,84,32,0.07)', borderLeft: '2px solid rgba(233,84,32,0.45)' }}>
                            <p className="text-[13px] leading-snug" style={{ color: '#ccc', fontStyle: 'italic' }}>
                                &ldquo;{q}&rdquo;
                            </p>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}

function Divider() {
    return <div className="mb-6" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="mb-7">
            <div className="text-[10px] font-bold uppercase tracking-[3px] pb-2 mb-4"
                style={{ color: '#e95420', borderBottom: '1px solid rgba(233,84,32,0.2)', fontFamily: MONO }}>
                {title}
            </div>
            {children}
        </div>
    );
}
