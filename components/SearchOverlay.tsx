'use client';
import { useState, useEffect, useRef, useMemo } from 'react';
import { DOCK_APPS } from '@/lib/portfolio';
import { TerminalIcon, FolderIcon, UserIcon, FileTextIcon, BriefcaseIcon, CalendarIcon, SettingsIcon, SearchIcon } from '@/components/Icons';

const ICONS: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
    terminal: TerminalIcon,
    files: FolderIcon,
    about: UserIcon,
    resume: FileTextIcon,
    projects: BriefcaseIcon,
    calendar: CalendarIcon,
    settings: SettingsIcon,
};

import { WindowRect, WindowState } from '@/hooks/useOS';

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

    const handleWindowClick = (id: string) => {
        onFocusApp(id);
        handleClose();
    };

    const handleAppLaunch = (id: string) => {
        onOpenApp(id);
        handleClose();
    };

    useEffect(() => {
        if (mode === 'apps') {
            inputRef.current?.focus();
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClose();
        };

        const handleRequestClose = () => handleClose();

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('request-search-close', handleRequestClose);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('request-search-close', handleRequestClose);
        };
    }, [onClose, mode]);

    const filteredApps = useMemo(() => {
        if (!query.trim()) return DOCK_APPS;
        return DOCK_APPS.filter(app =>
            app.label.toLowerCase().includes(query.toLowerCase()) ||
            app.id.toLowerCase().includes(query.toLowerCase())
        );
    }, [query]);

    const activeWindows = useMemo(() => windows, [windows]);

    return (
        <div
            className={`fixed inset-0 z-[6000] flex flex-col items-center pb-[5vh] SearchOverlay_container ${isClosing ? 'animate-fade-out-scale' : 'animate-fade-in-scale'}`}
            style={{
                background: 'rgba(0,0,0,0.5)',
                backdropFilter: 'blur(45px)',
                WebkitBackdropFilter: 'blur(45px)',
                paddingTop: mode === 'apps' ? '10vh' : '15vh'
            }}
            onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); }}
            onClick={handleClose}
        >
            {/* Search Bar Container - Only for Apps Mode */}
            {mode === 'apps' && (
                <div className="w-full flex justify-center flex-shrink-0" onClick={e => e.stopPropagation()}>
                    <div
                        className="w-full max-w-[600px] flex items-center gap-3 px-4 py-3 rounded-xl SearchOverlay_input_container"
                        style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}
                    >
                        <SearchIcon size={20} color="rgba(255,255,255,0.6)" />
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Type to search..."
                            className="flex-1 bg-transparent border-0 outline-none text-white text-lg placeholder:text-white/40"
                            style={{ fontFamily: "'Ubuntu Mono', monospace" }}
                        />
                    </div>
                </div>
            )}

            {/* Mode-Specific Content */}
            <div
                className="w-full max-w-[1000px] flex-1 overflow-y-auto px-10 scrollbar-hide flex flex-col items-center SearchOverlay_grid_container"
                onClick={(e) => e.stopPropagation()}
            >
                {mode === 'activities' ? (
                    /* Activities Mode - focus on running apps */
                    <>
                        <h1 className="text-white/40 text-lg font-bold uppercase tracking-[0.2em] mt-8 SearchOverlay_header" style={{ fontFamily: "'Ubuntu Mono', monospace" }}>
                            Running Applications
                        </h1>

                        {/* 10vh Gap matching Show Applications */}
                        <div style={{ height: '10vh' }} className="flex-shrink-0" />

                        {/* Dynamic container width to center fewer than 6 apps but align new rows to left */}
                        {(() => {
                            const count = activeWindows.length;
                            const cols = Math.min(count, 6);
                            const containerWidth = cols > 0 ? (cols * 126 + (cols - 1) * 32) : 0;
                            return (
                                <div
                                    className="flex flex-wrap justify-start gap-x-8 gap-y-12 px-4 pb-10"
                                    style={{ width: containerWidth > 0 ? containerWidth : 'auto', maxWidth: '100%' }}
                                >
                                    {activeWindows.length > 0 ? (
                                        activeWindows.map((win: WindowState) => {
                                            const Icon = ICONS[win.id] ?? FileTextIcon;
                                            const label = DOCK_APPS.find(a => a.id === win.id)?.label ?? win.id;
                                            return (
                                                <div key={win.id} className="w-[126px] flex justify-center">
                                                    <button
                                                        onClick={() => handleWindowClick(win.id)}
                                                        className="flex flex-col items-center gap-2 group transition-all duration-200 hover:scale-110 active:scale-95"
                                                    >
                                                        <div
                                                            className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all bg-white/5 group-hover:bg-white/10"
                                                            style={{
                                                                border: '1px solid rgba(255,255,255,0.08)',
                                                                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                                                                opacity: win.minimized ? 0.65 : 1
                                                            }}
                                                        >
                                                            <Icon size={32} color={win.id === 'terminal' ? '#4ec9b0' : win.id === 'files' ? '#e95420' : '#fff'} />
                                                        </div>
                                                        <div className="flex flex-col items-center leading-tight">
                                                            <span className="text-white text-sm font-medium opacity-60 group-hover:opacity-100 text-center transition-opacity" style={{ fontFamily: "'Ubuntu Mono', monospace" }}>
                                                                {label}
                                                            </span>
                                                            {win.minimized && (
                                                                <span className="text-[10px] text-white/45" style={{ fontFamily: "'Ubuntu Mono', monospace" }}>
                                                                    minimized
                                                                </span>
                                                            )}
                                                        </div>
                                                    </button>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="text-white/20 text-xl font-medium mt-20 text-center w-full" style={{ fontFamily: "'Ubuntu Mono', monospace" }}>
                                            No applications running
                                        </div>
                                    )}
                                </div>
                            );
                        })()}
                    </>
                ) : (
                    /* Apps Mode */
                    <>
                        {/* 10vh Gap for Apps mode */}
                        <div style={{ height: '10vh' }} className="flex-shrink-0" />

                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-x-8 gap-y-12 w-full SearchOverlay_grid">
                            {filteredApps.map(app => {
                                const Icon = ICONS[app.id] ?? TerminalIcon;
                                return (
                                    <button
                                        key={app.id}
                                        onClick={() => handleAppLaunch(app.id)}
                                        className="flex flex-col items-center gap-2 group transition-all duration-200 hover:scale-110 active:scale-95"
                                    >
                                        <div
                                            className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all bg-white/5 group-hover:bg-white/10"
                                            style={{ border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
                                        >
                                            <Icon size={32} color={app.id === 'terminal' ? '#4ec9b0' : app.id === 'files' ? '#e95420' : '#fff'} />
                                        </div>
                                        <span className="text-white text-sm font-medium opacity-60 group-hover:opacity-100 text-center transition-opacity" style={{ fontFamily: "'Ubuntu Mono', monospace" }}>
                                            {app.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {filteredApps.length === 0 && (
                            <div className="text-white/40 text-lg mt-10 text-center w-full" style={{ fontFamily: "'Ubuntu Mono', monospace" }}>
                                No results found for &quot;{query}&quot;
                            </div>
                        )}
                    </>
                )}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
                @keyframes fade-out-scale {
                    from { opacity: 1; transform: scale(1); }
                    to { opacity: 0; transform: scale(0.95); }
                }
                .animate-fade-out-scale { animation: fade-out-scale 0.2s ease-out forwards; }
                .animate-fade-in { animation: fade-in 0.4s ease-out; }
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}} />
        </div>
    );
}
