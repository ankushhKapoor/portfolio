'use client';
import { useState } from 'react';
import { DOCK_APPS } from '@/lib/portfolio';
import { TerminalIcon, FolderIcon, UserIcon, FileTextIcon, BriefcaseIcon, CalendarIcon, SettingsIcon } from '@/components/Icons';

const ICONS: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
    terminal: TerminalIcon,
    files: FolderIcon,
    about: UserIcon,
    resume: FileTextIcon,
    projects: BriefcaseIcon,
    calendar: CalendarIcon,
    settings: SettingsIcon,
};

interface Props { onOpen: (id: string) => void; openApps: string[]; minimizedApps: string[]; }

export default function Dock({ onOpen, openApps, minimizedApps }: Props) {
    return (
        <div
            className="fixed bottom-3 left-1/2 -translate-x-1/2 flex items-end pb-1 px-3 z-[5000] select-none"
            style={{
                background: 'rgba(24,24,24,0.88)',
                backdropFilter: 'blur(28px)',
                WebkitBackdropFilter: 'blur(28px)',
                borderRadius: 18,
                border: '1px solid rgba(255,255,255,0.10)',
                boxShadow: '0 8px 40px rgba(0,0,0,0.7), 0 1px 0 rgba(255,255,255,0.06) inset',
                gap: 2,
            }}
        >
            {DOCK_APPS.map(app => {
                const isOpen = openApps.includes(app.id);
                const isMinimized = minimizedApps.includes(app.id);
                const Icon = ICONS[app.id] ?? TerminalIcon;
                return <DockIcon key={app.id} id={app.id} label={app.label} Icon={Icon} active={isOpen && !isMinimized} onOpen={() => onOpen(app.id)} />;
            })}
        </div>
    );
}

function DockIcon({ id, label, Icon, active, onOpen }: { id: string; label: string; Icon: React.ComponentType<{ size?: number; color?: string }>; active: boolean; onOpen: () => void }) {
    const [hov, setHov] = useState(false);

    const iconColor = id === 'files' ? '#e95420' : id === 'terminal' ? '#4ec9b0' : '#e0e0e0';
    const iconBg = {
        terminal: 'linear-gradient(145deg, #1a1a1a, #2c2c2c)',
        files: 'linear-gradient(145deg, #3d1e10, #5a2d14)',
        about: 'linear-gradient(145deg, #1e2a3d, #2d3f5a)',
        resume: 'linear-gradient(145deg, #1a1e2d, #252b3d)',
        projects: 'linear-gradient(145deg, #1d2a1a, #2b3d28)',
        calendar: 'linear-gradient(145deg, #2d1a1a, #3d2828)',
        settings: 'linear-gradient(145deg, #252525, #333)',
    }[id] ?? 'linear-gradient(145deg, #2a2a2a, #383838)';

    return (
        <div className="relative flex flex-col items-center pt-2" onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
            {/* Tooltip */}
            {hov && (
                <div className="absolute bottom-[62px] text-[12px] text-white px-2.5 py-1 rounded-lg whitespace-nowrap pointer-events-none animate-fade-in-scale"
                    style={{ background: 'rgba(0,0,0,0.88)', border: '1px solid rgba(255,255,255,0.12)', fontFamily: "'Ubuntu Mono', monospace" }}>
                    {label}
                </div>
            )}
            <button
                onClick={onOpen}
                className="flex items-center justify-center rounded-[14px] border-0 cursor-pointer"
                style={{
                    width: 52, height: 52,
                    background: iconBg,
                    boxShadow: hov ? '0 6px 20px rgba(0,0,0,0.6)' : '0 2px 8px rgba(0,0,0,0.4)',
                    transform: hov ? 'scale(1.18) translateY(-5px)' : 'scale(1)',
                    transition: 'transform 0.15s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.15s ease',
                    border: active ? '1px solid rgba(233,84,32,0.4)' : '1px solid rgba(255,255,255,0.07)',
                }}
            >
                <Icon size={26} color={iconColor} />
            </button>
            {/* Active dot */}
            <div className="mt-1 mb-0.5 w-1 h-1 rounded-full transition-all duration-200"
                style={{ background: active ? '#e95420' : 'transparent', boxShadow: active ? '0 0 4px #e95420' : 'none' }} />
        </div>
    );
}
