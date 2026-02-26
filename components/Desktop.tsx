'use client';
import { useEffect, ReactNode } from 'react';
import { useOS } from '@/hooks/useOS';
import { WIN_DEFAULTS, DOCK_APPS } from '@/lib/portfolio';
import { TerminalIcon, FolderIcon, UserIcon, FileTextIcon, BriefcaseIcon, CalendarIcon, SettingsIcon } from '@/components/Icons';

import BootScreen from '@/components/BootScreen';
import LockScreen from '@/components/LockScreen';
import AppWindow from '@/components/AppWindow';
import TopBar from '@/components/TopBar';
import Dock from '@/components/Dock';
import DesktopIcons from '@/components/DesktopIcons';

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

function ShutdownScreen({ mode }: { mode: 'shutdown' | 'restart' }) {
    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center gap-5 z-[9999]" style={{ background: '#000' }}>
            <div className="w-10 h-10 rounded-full border-[3px] border-gray-800 border-t-[#e95420] animate-spin-orange" />
            <div style={{ color: '#999', fontFamily: "'Ubuntu Mono', monospace", fontSize: 15 }}>
                {mode === 'shutdown' ? 'Shutting down…' : 'Restarting…'}
            </div>
        </div>
    );
}

function renderAppContent(id: string) {
    switch (id) {
        case 'terminal': return <TerminalApp />;
        case 'about': return <AboutApp />;
        case 'resume': return <ResumeApp />;
        case 'projects': return <ProjectsApp />;
        case 'calendar': return <CalendarApp />;
        case 'files': return <FilesApp />;
        case 'settings': return <SettingsApp />;
        default: return null;
    }
}

export default function Desktop() {
    const { screen, setScreen, windows, openApp, closeApp, minimizeApp, doUnlock, doLock, doPowerOff, doRestart } = useOS();

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.altKey && e.key === 't') { e.preventDefault(); openApp('terminal'); }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [openApp]);

    if (screen === 'shutdown') return <ShutdownScreen mode="shutdown" />;
    if (screen === 'restart') return <ShutdownScreen mode="restart" />;
    if (screen === 'boot') return <BootScreen onDone={() => setScreen('lock')} />;
    if (screen === 'lock') return <LockScreen onUnlock={doUnlock} />;

    const openIds = windows.map(w => w.id);
    const minIds = windows.filter(w => w.minimized).map(w => w.id);

    return (
        <div
            className="fixed inset-0 overflow-hidden"
            style={{ background: 'radial-gradient(ellipse at 20% 50%, #4a1020 0%, #2d0a1e 45%, #1a0510 100%)' }}
        >
            <div className="absolute pointer-events-none" style={{ width: 500, height: 500, borderRadius: '50%', top: '25%', left: '55%', background: 'radial-gradient(circle, rgba(233,84,32,0.10), transparent)' }} />

            <TopBar onLock={doLock} onRestart={doRestart} onPowerOff={doPowerOff} />
            <DesktopIcons onOpen={openApp} />

            {windows.map((win, idx) => {
                if (win.minimized) return null;
                const def = WIN_DEFAULTS[win.id] ?? { w: 640, h: 480, title: win.id };
                const stagger = idx * 24;
                return (
                    <AppWindow
                        key={win.id} id={win.id} title={def.title}
                        icon={APP_ICONS[win.id] ?? null}
                        onClose={() => closeApp(win.id)}
                        onMinimize={() => minimizeApp(win.id)}
                        defaultW={def.w} defaultH={def.h}
                        startX={80 + stagger} startY={52 + stagger}
                    >
                        {renderAppContent(win.id)}
                    </AppWindow>
                );
            })}

            <Dock onOpen={openApp} openApps={openIds} minimizedApps={minIds} />
        </div>
    );
}
