'use client';
import { useState } from 'react';
import { DOCK_APPS } from '@/lib/portfolio';
import { TerminalIcon, FolderIcon, UserIcon, FileTextIcon, BriefcaseIcon, CalendarIcon, SettingsIcon, GridIcon, UbuntuIcon } from '@/components/Icons';

const ICONS: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
    terminal: TerminalIcon,
    files: FolderIcon,
    about: UserIcon,
    resume: FileTextIcon,
    projects: BriefcaseIcon,
    calendar: CalendarIcon,
    settings: SettingsIcon,
    all: UbuntuIcon,
};

interface Props {
    onOpen: (id: string) => void;
    onToggleSearch: () => void;
    openApps: string[];
    minimizedApps: string[];
    shouldHide?: boolean;
    isSelecting?: boolean;
}

export default function Dock({ onOpen, onToggleSearch, openApps, minimizedApps, shouldHide, isSelecting }: Props) {
    const [isDockHovered, setIsDockHovered] = useState(false);
    const [isBottomHovered, setIsBottomHovered] = useState(false);

    // Dock is visible if:
    // 1. It's not supposed to hide (no windows overlap) OR
    // 2. The user is hovering over the dock or the bottom trigger area
    const visible = !shouldHide || isDockHovered || isBottomHovered;

    return (
        <>
            {/* Hover Trigger Area (Thin strip at bottom) */}
            <div
                className="fixed bottom-0 left-0 right-0 h-5 z-[4999]"
                onMouseEnter={() => !isSelecting && setIsBottomHovered(true)}
                onMouseLeave={() => setIsBottomHovered(false)}
            />

            <div
                className="fixed bottom-3 left-1/2 flex items-end pb-1 px-3 z-[5000] select-none transition-all duration-300 ease-in-out"
                onMouseEnter={() => !isSelecting && setIsDockHovered(true)}
                onMouseLeave={() => setIsDockHovered(false)}
                onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); }}
                style={{
                    background: 'rgba(24,24,24,0.88)',
                    backdropFilter: 'blur(28px)',
                    WebkitBackdropFilter: 'blur(28px)',
                    borderRadius: 18,
                    border: '1px solid rgba(255,255,255,0.10)',
                    boxShadow: '0 8px 40px rgba(0,0,0,0.7), 0 1px 0 rgba(255,255,255,0.06) inset',
                    gap: 2,
                    transform: `translateX(-50%) translateY(${visible ? '0' : '150%'})`,
                    opacity: visible ? 1 : 0,
                }}
            >
                {/* Show Applications at the start */}
                <DockIcon
                    id="all"
                    label="Show Applications"
                    Icon={UbuntuIcon}
                    active={false}
                    onOpen={onToggleSearch}
                    isSelecting={isSelecting}
                />

                {/* Separator */}
                <div className="mx-1 h-8 w-[1px] bg-white/10 self-center" />

                {DOCK_APPS.map(app => {
                    const isOpen = openApps.includes(app.id);
                    const isMinimized = minimizedApps.includes(app.id);
                    const Icon = ICONS[app.id] ?? TerminalIcon;
                    return <DockIcon key={app.id} id={app.id} label={app.label} Icon={Icon} active={isOpen && !isMinimized} onOpen={() => onOpen(app.id)} isSelecting={isSelecting} />;
                })}
            </div>
        </>
    );
}

function DockIcon({ id, label, Icon, active, onOpen, isSelecting }: { id: string; label: string; Icon: React.ComponentType<{ size?: number; color?: string }>; active: boolean; onOpen: () => void; isSelecting?: boolean }) {
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
        all: 'transparent',
    }[id] ?? 'linear-gradient(145deg, #2a2a2a, #383838)';

    return (
        <div className="relative flex flex-col items-center pt-2" onMouseEnter={() => !isSelecting && setHov(true)} onMouseLeave={() => setHov(false)}>
            {/* Tooltip */}
            {hov && !isSelecting && (
                <div className="absolute bottom-[62px] text-[12px] text-white px-2.5 py-1 rounded-lg whitespace-nowrap pointer-events-none animate-fade-in-scale"
                    style={{ background: 'rgba(0,0,0,0.88)', border: '1px solid rgba(255,255,255,0.12)', fontFamily: "'Ubuntu Mono', monospace" }}>
                    {label}
                </div>
            )}
            <button
                onClick={onOpen}
                className={`flex items-center justify-center border-0 cursor-pointer transition-all duration-300 ${id === 'all' ? 'rounded-full scale-105' : 'rounded-[14px]'}`}
                style={{
                    width: 52, height: 52,
                    background: iconBg,
                    boxShadow: hov && !isSelecting ? '0 6px 20px rgba(0,0,0,0.6)' : '0 2px 8px rgba(0,0,0,0.4)',
                    transform: hov && !isSelecting ? 'scale(1.18) translateY(-5px)' : 'scale(1)',
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
