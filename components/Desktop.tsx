'use client';
import { useEffect, useState, ReactNode, useCallback, useRef } from 'react';
import { useOS } from '@/hooks/useOS';
import { WIN_DEFAULTS, DOCK_APPS } from '@/lib/portfolio';
import { TerminalIcon, FolderIcon, UserIcon, FileTextIcon, BriefcaseIcon, CalendarIcon, SettingsIcon, UbuntuIcon } from '@/components/Icons';

import BootScreen from '@/components/BootScreen';
import LockScreen from '@/components/LockScreen';
import AppWindow from '@/components/AppWindow';
import TopBar from '@/components/TopBar';
import Dock from '@/components/Dock';
import DesktopIcons from '@/components/DesktopIcons';
import SearchOverlay from '@/components/SearchOverlay';

interface SelectionRect {
    x: number;
    y: number;
    w: number;
    h: number;
}

import TerminalApp from '@/components/apps/TerminalApp';
import AboutApp from '@/components/apps/AboutApp';
import ResumeApp from '@/components/apps/ResumeApp';
import ProjectsApp from '@/components/apps/ProjectsApp';
import CalendarApp from '@/components/apps/CalendarApp';
import FilesApp from '@/components/apps/FilesApp';
import SettingsApp from '@/components/apps/SettingsApp';

const APP_ICONS: Record<string, ReactNode> = {
    terminal: <TerminalIcon size={14} color="#4ec9b0" />,
    files: <FolderIcon size={14} color="#e95420" />,
    about: <UserIcon size={14} color="#93c4e8" />,
    resume: <FileTextIcon size={14} color="#ccc" />,
    projects: <BriefcaseIcon size={14} color="#a8d98c" />,
    calendar: <CalendarIcon size={14} color="#f37222" />,
    settings: <SettingsIcon size={14} color="#ccc" />,
};

function ShutdownScreen({ mode, onPowerOn }: { mode: 'shutdown' | 'restart'; onPowerOn: () => void }) {
    const [phase, setPhase] = useState<'spinning' | 'off'>('spinning');

    useEffect(() => {
        const t = setTimeout(() => {
            if (mode === 'restart') {
                onPowerOn();
            } else {
                setPhase('off');
            }
        }, 3000);
        return () => clearTimeout(t);
    }, [mode, onPowerOn]);

    if (phase === 'off') {
        return (
            <div className="fixed inset-0 flex flex-col items-center justify-center gap-6 z-[9999]" style={{ background: '#000' }}>
                <div className="w-20 h-20 rounded-full flex items-center justify-center"
                    style={{
                        background: '#000',
                        border: '1px solid rgba(255,255,255,0.15)',
                        boxShadow: '0 0 20px rgba(255, 255, 255, 0.08)'
                    }}>
                    <div style={{ filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.4))' }}>
                        <UbuntuIcon size={40} />
                    </div>
                </div>
                <div style={{ color: '#444', fontFamily: "'Ubuntu Mono', monospace", fontSize: 13 }}>KapoorOS is powered off</div>
                <button
                    onClick={onPowerOn}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full border-0 cursor-pointer transition-all hover:scale-105"
                    style={{ background: 'rgba(233,84,32,0.15)', border: '1px solid rgba(233,84,32,0.4)', color: '#e95420', fontFamily: "'Ubuntu Mono', monospace", fontSize: 13 }}
                >
                    <span>⏻</span> Power On
                </button>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center gap-5 z-[9999]" style={{ background: '#000' }}>
            <div className="w-10 h-10 rounded-full border-[3px] border-gray-800 border-t-[#e95420] animate-spin-orange" />
            <div style={{ color: '#666', fontFamily: "'Ubuntu Mono', monospace", fontSize: 14 }}>
                {mode === 'shutdown' ? 'Shutting down…' : 'Restarting…'}
            </div>
        </div>
    );
}

function renderAppContent(id: string, closeApp: (id: string) => void) {
    switch (id) {
        case 'terminal': return <TerminalApp onClose={() => closeApp('terminal')} />;
        case 'about': return <AboutApp />;
        case 'resume': return <ResumeApp />;
        case 'projects': return <ProjectsApp />;
        case 'calendar': return <CalendarApp />;
        case 'files': return <FilesApp />;
        case 'settings': return <SettingsApp />;
        default: return null;
    }
}

import { WindowRect, WindowState } from '@/hooks/useOS';

function SelectionRectangle({ rect }: { rect: SelectionRect | null }) {
    if (!rect || rect.w === 0 || rect.h === 0) return null;
    return (
        <div
            className="fixed pointer-events-none z-[100] overflow-hidden"
            style={{
                left: '0',
                top: '0',
                right: '0',
                bottom: '0',
            }}
        >
            <div
                style={{
                    position: 'fixed',
                    left: `${rect.x}px`,
                    top: `${rect.y}px`,
                    width: `${rect.w}px`,
                    height: `${rect.h}px`,
                    background: 'rgba(233, 84, 32, 0.15)',
                    border: '2px solid #e95420',
                    boxSizing: 'border-box',
                }}
            />
        </div>
    );
}

export default function Desktop() {
    const { screen, setScreen, windows, openApp, closeApp, minimizeApp, focusApp, focusedAppId, showSearch, toggleSearch, searchMode, windowRects, updateWindowRect, doUnlock, doLock, doPowerOff, doRestart } = useOS();
    const [selectionRect, setSelectionRect] = useState<SelectionRect | null>(null);
    const [isSelecting, setIsSelecting] = useState(false);
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
    const startPos = useRef<{ x: number; y: number } | null>(null);
    const desktopItemsRef = useRef<Map<string, DOMRect>>(new Map());

    const requestToggleSearch = useCallback((mode: 'activities' | 'apps') => {
        if (showSearch) {
            window.dispatchEvent(new CustomEvent('request-search-close'));
        } else {
            toggleSearch(mode);
        }
    }, [showSearch, toggleSearch]);

    const isDockOverlapped = (Object.values(windowRects) as WindowRect[]).some((rect: WindowRect) => {
        const isMinimized = windows.find((w: WindowState) => w.id === rect.id)?.minimized;
        if (isMinimized) return false;
        if (rect.maximized) return true;

        const screenW = typeof window !== 'undefined' ? window.innerWidth : 1280;
        const screenH = typeof window !== 'undefined' ? window.innerHeight : 800;

        const dockHeight = 84;
        const dockWidth = Math.min(screenW * 0.8, (windows.length + 2) * 64);
        const dockLeft = (screenW - dockWidth) / 2;
        const dockRight = (screenW + dockWidth) / 2;
        const dockTop = screenH - dockHeight;

        const winBottom = rect.y + rect.h;
        const winRight = rect.x + rect.w;

        const overlapsVertically = winBottom > dockTop;
        const overlapsHorizontally = rect.x < dockRight && winRight > dockLeft;

        return overlapsVertically && overlapsHorizontally;
    });

    const handleRegistrationRequest = useCallback((items: Array<{ id: string; rect: DOMRect }>) => {
        const map = new Map(items.map(item => [item.id, item.rect]));
        desktopItemsRef.current = map;
    }, []);

    const checkIntersection = useCallback((selRect: SelectionRect): Set<string> => {
        const selected = new Set<string>();
        desktopItemsRef.current.forEach((itemRect, id) => {
            const intersects = !(
                selRect.x + selRect.w < itemRect.left ||
                selRect.x > itemRect.right ||
                selRect.y + selRect.h < itemRect.top ||
                selRect.y > itemRect.bottom
            );
            if (intersects) selected.add(id);
        });
        return selected;
    }, []);

    const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if ((e.target as HTMLElement).closest('[data-no-select]')) return;
        if (e.button !== 0) return;

        setIsSelecting(true);
        startPos.current = { x: e.clientX, y: e.clientY };
        setSelectionRect(null);
        setSelectedItems(new Set());
    }, []);

    const handleMouseUp = useCallback(() => {
        setIsSelecting(false);
        startPos.current = null;
        setSelectionRect(null);
    }, []);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.altKey && e.key === 't') { e.preventDefault(); openApp('terminal'); }
            if (e.key === 'Meta' || e.key === 'OS') {
                e.preventDefault();
                requestToggleSearch('apps');
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [openApp, requestToggleSearch]);

    useEffect(() => {
        if (!isSelecting) return;

        const handleDocumentMouseMove = (e: MouseEvent) => {
            if (!startPos.current) return;

            const currentX = e.clientX;
            const currentY = e.clientY;
            const x = Math.min(startPos.current.x, currentX);
            const y = Math.min(startPos.current.y, currentY);
            const w = Math.abs(currentX - startPos.current.x);
            const h = Math.abs(currentY - startPos.current.y);

            const rect: SelectionRect = { x, y, w, h };
            setSelectionRect(rect);
            setSelectedItems(checkIntersection(rect));
        };

        const handleDocumentMouseUp = () => {
            setIsSelecting(false);
            startPos.current = null;
            setSelectionRect(null);
        };

        document.addEventListener('mousemove', handleDocumentMouseMove);
        document.addEventListener('mouseup', handleDocumentMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleDocumentMouseMove);
            document.removeEventListener('mouseup', handleDocumentMouseUp);
        };
    }, [isSelecting, checkIntersection]);

    if (screen === 'shutdown') return <ShutdownScreen mode="shutdown" onPowerOn={() => setScreen('boot')} />;
    if (screen === 'restart') return <ShutdownScreen mode="restart" onPowerOn={() => setScreen('boot')} />;
    if (screen === 'boot') return <BootScreen onDone={() => setScreen('desktop')} />;
    if (screen === 'lock') return <LockScreen onUnlock={doUnlock} />;

    const openIds = windows.map((w: { id: string; minimized: boolean }) => w.id);
    const minIds = windows.filter((w: { id: string; minimized: boolean }) => w.minimized).map((w: { id: string; minimized: boolean }) => w.id);

    return (
        <div
            className="fixed inset-0 overflow-hidden"
            style={{ background: 'radial-gradient(ellipse at 20% 50%, #4a1020 0%, #2d0a1e 45%, #1a0510 100%)' }}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
        >
            <div className="absolute pointer-events-none" style={{ width: 500, height: 500, borderRadius: '50%', top: '25%', left: '55%', background: 'radial-gradient(circle, rgba(233,84,32,0.10), transparent)' }} />

            {/* Global Brightness Overlay — Floor at 0.8 to keep screen readable */}
            <div
                className="fixed inset-0 z-[8000] pointer-events-none bg-black"
                style={{ opacity: 'calc((1 - var(--system-brightness, 1)) * 0.8)' }}
            />

            <TopBar
                onLock={doLock}
                onRestart={doRestart}
                onPowerOff={doPowerOff}
                onOpenSettings={() => openApp('settings')}
                onToggleSearch={() => requestToggleSearch('activities')}
                isSelecting={isSelecting}
            />
            <DesktopIcons onOpen={openApp} selectedItems={selectedItems} onRegister={handleRegistrationRequest} />

            <SelectionRectangle rect={selectionRect} />

            {windows.map((winState: WindowState, idx: number) => {
                if (winState.minimized) return null;
                const def = WIN_DEFAULTS[winState.id] ?? { w: 640, h: 480, title: winState.id };
                const stagger = idx * 24;
                return (
                    <AppWindow
                        key={winState.id} id={winState.id} title={def.title}
                        icon={APP_ICONS[winState.id] ?? null}
                        onClose={() => closeApp(winState.id)}
                        onMinimize={() => minimizeApp(winState.id)}
                        onRectChange={(r) => updateWindowRect(winState.id, r)}
                        onFocus={() => focusApp(winState.id)}
                        focused={focusedAppId === winState.id}
                        defaultW={def.w} defaultH={def.h}
                        startX={80 + stagger} startY={52 + stagger}
                    >
                        {renderAppContent(winState.id, closeApp)}
                    </AppWindow>
                );
            })}

            <Dock onOpen={openApp} onToggleSearch={() => requestToggleSearch('apps')} openApps={openIds} minimizedApps={minIds} shouldHide={isDockOverlapped} isSelecting={isSelecting} />

            {showSearch && (
                <SearchOverlay
                    onClose={toggleSearch}
                    onOpenApp={openApp}
                    onFocusApp={focusApp}
                    windows={windows}
                    windowRects={windowRects}
                    mode={searchMode}
                />
            )}
        </div>
    );
}
