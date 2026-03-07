'use client';
import { useState, useEffect, useRef, useMemo } from 'react';
import { DESKTOP_ICONS, WIN_DEFAULTS } from '@/lib/portfolio';
import { TerminalIcon, FolderIcon, UserIcon, BriefcaseIcon, CalendarIcon, SettingsIcon, SearchIcon, Globe } from '@/components/Icons';
import { WindowRect, WindowState } from '@/hooks/useOS';

// ── Lucide icon map for regular apps ──────────────────────────────────────────
const LUCIDE_ICONS: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
    terminal: TerminalIcon,
    files: FolderIcon,
    about: UserIcon,
    projects: BriefcaseIcon,
    calendar: CalendarIcon,
    settings: SettingsIcon,
    'simple-mode': Globe,
};

// ── Icon colors for regular apps ──────────────────────────────────────────────
const ICON_COLORS: Record<string, string> = {
    terminal: '#4ec9b0', files: '#e95420', about: '#93c4e8',
    projects: '#a8d98c', calendar: '#f37222', settings: '#ccc',
    'simple-mode': '#f5a623',
};

// ── Icon backgrounds ──────────────────────────────────────────────────────────
const ICON_BG: Record<string, string> = {
    terminal: 'linear-gradient(145deg,#1a1a1a,#2c2c2c)',
    files: 'linear-gradient(145deg,#3d1e10,#5a2d14)',
    about: 'linear-gradient(145deg,#1e2a3d,#2d3f5a)',
    projects: 'linear-gradient(145deg,#1d2a1a,#2b3d28)',
    calendar: 'linear-gradient(145deg,#2d1a1a,#3d2828)',
    settings: 'linear-gradient(145deg,#252525,#333)',
    'simple-mode': 'linear-gradient(145deg,#3d2800,#5a3d10)',
    'resume-pdf': 'linear-gradient(145deg,#2a0a0a,#3d1212)',
    'pdf-viewer': 'linear-gradient(145deg,#2a0a0a,#3d1212)',
    extracurricular: 'linear-gradient(145deg,#0a2a2a,#123d3d)',
    experience: 'linear-gradient(145deg,#2a1a00,#3d2900)',
    'github-link': 'linear-gradient(145deg,#161b22,#21262d)',
    'linkedin-link': 'linear-gradient(145deg,#0a1628,#0d2040)',
    'twitter-link': 'linear-gradient(145deg,#15202b,#1c2a38)',
    'email-link': 'linear-gradient(145deg,#2a1208,#3d1c0a)',
};

// ── Custom SVG renderers for special icons ────────────────────────────────────
function renderCustomIcon(id: string) {
    switch (id) {
        case 'resume-pdf':
        case 'pdf-viewer': return (
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <defs><linearGradient id="spdfg" x1="4" y1="2" x2="4" y2="30" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#ef3030" /><stop offset="100%" stopColor="#b71c1c" /></linearGradient></defs>
                <path d="M4 3 C4 2.45 4.45 2 5 2 L20 2 L28 10 L28 29 C28 29.55 27.55 30 27 30 L5 30 C4.45 30 4 29.55 4 29 Z" fill="url(#spdfg)" />
                <path d="M20 2 L20 10 L28 10 Z" fill="#7f0000" opacity="0.7" />
                <rect x="8" y="13" width="14" height="1.5" rx="0.75" fill="white" opacity="0.4" />
                <rect x="8" y="16" width="16" height="1.5" rx="0.75" fill="white" opacity="0.3" />
                <rect x="8" y="19" width="10" height="1.5" rx="0.75" fill="white" opacity="0.25" />
                <rect x="6.5" y="22.5" width="15" height="6" rx="1.5" fill="white" opacity="0.96" />
                <text x="14" y="27.2" textAnchor="middle" fontSize="5" fontWeight="bold" fill="#b71c1c" fontFamily="Ubuntu Mono,monospace" letterSpacing="0.5">PDF</text>
            </svg>
        );
        case 'extracurricular': return (
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="10" cy="11" r="4" fill="#19b6b6" opacity="0.9" />
                <circle cx="22" cy="11" r="4" fill="#19b6b6" opacity="0.9" />
                <path d="M2 25c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="#19b6b6" strokeWidth="2.2" strokeLinecap="round" fill="none" />
                <path d="M14 25c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="#19b6b6" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.7" />
            </svg>
        );
        case 'experience': return (
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect x="4" y="11" width="24" height="17" rx="2.5" fill="#f37222" opacity="0.9" />
                <path d="M11 11V8a5 5 0 0 1 10 0v3" stroke="#f37222" strokeWidth="2.2" strokeLinecap="round" fill="none" />
                <rect x="4" y="11" width="24" height="6" rx="2" fill="#f37222" opacity="0.5" />
                <rect x="13" y="16" width="6" height="3" rx="1" fill="white" opacity="0.85" />
            </svg>
        );
        case 'github-link': return (
            <svg width="30" height="30" viewBox="0 0 24 24" fill="#e0e0e0">
                <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.54 2.87 8.38 6.84 9.74.5.09.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.57 2.34 1.12 2.91.85.09-.66.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.38 9.38 0 0 1 12 6.84c.85.004 1.71.12 2.51.34 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.07.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.81 0 .27.18.59.69.49C19.13 20.63 22 16.79 22 12.26 22 6.58 17.52 2 12 2z" />
            </svg>
        );
        case 'linkedin-link': return (
            <svg width="30" height="30" viewBox="0 0 24 24" fill="#61a8e0">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
            </svg>
        );
        case 'twitter-link': return (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#9ba3af">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.26 5.632 5.904-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
            </svg>
        );
        case 'email-link': return (
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#e95420" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
        );
        default: return null;
    }
}

// All desktop apps (apps + links + files) for the Show Applications grid
const ALL_OVERLAY_APPS = DESKTOP_ICONS.filter(app => app.id !== 'simple-mode').concat(
    DESKTOP_ICONS.filter(app => app.id === 'simple-mode')
);

interface Props {
    onClose: () => void;
    onOpenApp: (id: string) => void;
    onFocusApp: (id: string) => void;
    windows: WindowState[];
    windowRects: Record<string, WindowRect>;
    mode: 'activities' | 'apps';
}

export default function SearchOverlay({ onClose, onOpenApp, onFocusApp, windows, windowRects, mode }: Props) {
    const [query, setQuery] = useState('');
    const [isClosing, setIsClosing] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(onClose, 200);
    };

    const handleWindowClick = (id: string) => { onFocusApp(id); handleClose(); };
    const handleAppLaunch = (id: string) => {
        if (id === 'email-link') {
            window.location.href = 'mailto:work.ankushkapoor1626@gmail.com';
            handleClose();
            return;
        }
        onOpenApp(id); handleClose();
    };

    useEffect(() => {
        if (mode === 'apps') inputRef.current?.focus();
        const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
        const handleRequestClose = () => handleClose();
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('request-search-close', handleRequestClose);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('request-search-close', handleRequestClose);
        };
    }, [onClose, mode]);

    const filteredApps = useMemo(() => {
        const base = ALL_OVERLAY_APPS;
        if (!query.trim()) return base;
        const q = query.toLowerCase();
        return base.filter(app => app.label.toLowerCase().includes(q) || app.id.toLowerCase().includes(q));
    }, [query]);

    return (
        <div
            className={`fixed inset-0 z-[6000] flex flex-col items-center pb-[5vh] ${isClosing ? 'animate-fade-out-scale' : 'animate-fade-in-scale'}`}
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(45px)', WebkitBackdropFilter: 'blur(45px)', paddingTop: mode === 'apps' ? '10vh' : '15vh' }}
            onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); }}
            onClick={handleClose}
        >
            {/* Search bar — apps mode only */}
            {mode === 'apps' && (
                <div className="w-full flex justify-center flex-shrink-0" onClick={e => e.stopPropagation()}>
                    <div className="w-full max-w-[600px] flex items-center gap-3 px-4 py-3 rounded-xl"
                        style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
                        <SearchIcon size={20} color="rgba(255,255,255,0.6)" />
                        <input
                            ref={inputRef} type="text" value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder="Type to search..."
                            className="flex-1 bg-transparent border-0 outline-none text-white text-lg placeholder:text-white/40"
                            style={{ fontFamily: "'Ubuntu Mono', monospace" }}
                        />
                    </div>
                </div>
            )}

            <div className="w-full max-w-[1000px] flex-1 overflow-y-auto px-10 scrollbar-hide flex flex-col items-center" onClick={e => e.stopPropagation()}>
                {mode === 'activities' ? (
                    /* ── Activities: running windows ── */
                    <>
                        <h1 className="text-white/40 text-lg font-bold uppercase tracking-[0.2em] mt-8" style={{ fontFamily: "'Ubuntu Mono', monospace" }}>
                            Running Applications
                        </h1>
                        <div style={{ height: '8vh' }} />
                        {windows.length > 0 ? (
                            <div className="flex flex-wrap justify-start gap-x-8 gap-y-12 px-4 pb-10">
                                {windows.map((win: WindowState) => {
                                    const app = DESKTOP_ICONS.find(a => a.id === win.id);
                                    const custom = renderCustomIcon(win.id);
                                    const Icon = LUCIDE_ICONS[win.id];
                                    return (
                                        <div key={win.id} className="w-[110px] flex justify-center">
                                            <button onClick={() => handleWindowClick(win.id)}
                                                className="flex flex-col items-center gap-2 group transition-all duration-200 hover:scale-110 active:scale-95">
                                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all"
                                                    style={{ background: ICON_BG[win.id] ?? 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 4px 12px rgba(0,0,0,0.4)', opacity: win.minimized ? 0.6 : 1 }}>
                                                    {custom ?? (Icon ? <Icon size={30} color={ICON_COLORS[win.id] ?? '#fff'} /> : <span style={{ fontSize: 28 }}>{app?.icon}</span>)}
                                                </div>
                                                <span className="text-white text-xs text-center opacity-60 group-hover:opacity-100 transition-opacity leading-tight"
                                                    style={{ fontFamily: "'Ubuntu Mono', monospace", maxWidth: 90 }}>
                                                    {app?.label ?? WIN_DEFAULTS[win.id]?.title ?? win.id}
                                                    {win.minimized && <span className="block text-[10px] text-white/40">minimized</span>}
                                                </span>
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-white/20 text-xl font-medium mt-20 text-center w-full" style={{ fontFamily: "'Ubuntu Mono', monospace" }}>
                                No applications running
                            </div>
                        )}
                    </>
                ) : (
                    /* ── Apps: full grid of all desktop icons ── */
                    <>
                        <div style={{ height: '8vh' }} />
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-x-8 gap-y-10 w-full pb-10">
                            {filteredApps.map(app => {
                                const custom = renderCustomIcon(app.id);
                                const Icon = LUCIDE_ICONS[app.id];
                                return (
                                    <button key={app.id} onClick={() => handleAppLaunch(app.id)}
                                        className="flex flex-col items-center gap-2 group transition-all duration-200 hover:scale-110 active:scale-95">
                                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all group-hover:brightness-110"
                                            style={{ background: ICON_BG[app.id] ?? 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)', boxShadow: '0 4px 14px rgba(0,0,0,0.4)' }}>
                                            {custom ?? (Icon ? <Icon size={30} color={ICON_COLORS[app.id] ?? '#fff'} /> : <span style={{ fontSize: 26 }}>{app.icon}</span>)}
                                        </div>
                                        <span className="text-white text-xs text-center opacity-60 group-hover:opacity-100 transition-opacity leading-snug"
                                            style={{ fontFamily: "'Ubuntu Mono', monospace", maxWidth: 90 }}>
                                            {app.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                        {filteredApps.length === 0 && (
                            <div className="text-white/40 text-lg mt-10 text-center w-full" style={{ fontFamily: "'Ubuntu Mono', monospace" }}>
                                No results for &quot;{query}&quot;
                            </div>
                        )}
                    </>
                )}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
                @keyframes fade-out-scale { from { opacity: 1; transform: scale(1); } to { opacity: 0; transform: scale(0.95); } }
                .animate-fade-out-scale { animation: fade-out-scale 0.2s ease-out forwards; }
                @keyframes fade-in-scale { from { opacity: 0; transform: scale(1.02); } to { opacity: 1; transform: scale(1); } }
                .animate-fade-in-scale { animation: fade-in-scale 0.18s ease-out forwards; }
            `}} />
        </div>
    );
}
