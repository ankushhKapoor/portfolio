'use client';
import { useState, useRef, useEffect } from 'react';
import { DESKTOP_ICONS } from '@/lib/portfolio';
import { TerminalIcon, FolderIcon, UserIcon, FileTextIcon, BriefcaseIcon } from '@/components/Icons';

const ICONS: Record<string, { Icon: React.ComponentType<{ size?: number; color?: string }>; color: string; bg: string }> = {
    about: { Icon: UserIcon, color: '#93c4e8', bg: 'linear-gradient(145deg,#1e2a3d,#2d3f5a)' },
    resume: { Icon: FileTextIcon, color: '#e0e0e0', bg: 'linear-gradient(145deg,#1a1e2d,#252b3d)' },
    projects: { Icon: BriefcaseIcon, color: '#a8d98c', bg: 'linear-gradient(145deg,#1d2a1a,#2b3d28)' },
    terminal: { Icon: TerminalIcon, color: '#4ec9b0', bg: 'linear-gradient(145deg,#1a1a1a,#2c2c2c)' },
    files: { Icon: FolderIcon, color: '#e95420', bg: 'linear-gradient(145deg,#3d1e10,#5a2d14)' },
};

interface Props {
    onOpen: (id: string) => void;
    selectedItems?: Set<string>;
    onRegister?: (items: Array<{ id: string; rect: DOMRect }>) => void;
}

export default function DesktopIcons({ onOpen, selectedItems = new Set(), onRegister }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!onRegister) return;
        const rects = DESKTOP_ICONS.map(item => {
            const el = containerRef.current?.querySelector(`[data-icon-id="${item.id}"]`);
            return { id: item.id, rect: el?.getBoundingClientRect() ?? new DOMRect() };
        }).filter(item => item.rect.width > 0);
        onRegister(rects);
    }, [onRegister]);

    return (
        <div ref={containerRef} className="fixed top-10 right-4 flex flex-col gap-1 z-10" onClick={() => { }}>
            {DESKTOP_ICONS.map(item => (
                <DIcon key={item.id} item={item} selected={selectedItems.has(item.id)}
                    onOpen={() => onOpen(item.id)} />
            ))}
        </div>
    );
}

function DIcon({ item, selected, onOpen }: { item: { id: string; icon: string; label: string }; selected: boolean; onOpen: () => void }) {
    const [hov, setHov] = useState(false);
    const last = useRef(0);
    const cfg = ICONS[item.id] ?? { Icon: FolderIcon, color: '#fff', bg: '#333' };

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        const now = Date.now();
        if (now - last.current < 400) onOpen();
        last.current = now;
    };

    return (
        <div
            data-icon-id={item.id}
            data-no-select="true"
            onClick={handleClick}
            onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
            className={`flex flex-col items-center gap-1.5 px-2 py-2 cursor-default select-none ${selected ? 'transition-none' : 'rounded-xl transition-all'}`}
            style={{
                width: 76,
                background: selected ? 'rgba(233, 84, 32, 0.2)' : hov ? 'rgba(255,255,255,0.10)' : 'transparent',
                outline: selected ? '1px solid #e95420' : 'none',
            }}
        >
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: cfg.bg, boxShadow: hov ? '0 6px 18px rgba(0,0,0,0.6)' : '0 2px 8px rgba(0,0,0,0.4)', transition: 'box-shadow 0.15s', border: '1px solid rgba(255,255,255,0.07)' }}>
                <cfg.Icon size={30} color={cfg.color} />
            </div>
            <span className="text-[11px] text-white text-center leading-tight"
                style={{ textShadow: '0 1px 6px rgba(0,0,0,0.95)', fontFamily: "'Ubuntu Mono', monospace" }}>
                {item.label}
            </span>
        </div>
    );
}
