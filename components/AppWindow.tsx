'use client';
import { useEffect, useRef, useState, ReactNode } from 'react';
import { CloseIcon, MinimizeIcon, MaximizeIcon } from '@/components/Icons';

let zCounter = 200;

interface Props {
    id: string; title: string; icon: ReactNode;
    children: ReactNode;
    onClose: () => void; onMinimize: () => void;
    onRectChange: (rect: { x: number; y: number; w: number; h: number; maximized: boolean }) => void;
    onFocus?: () => void;
    focused?: boolean;
    defaultW: number; defaultH: number;
    startX?: number; startY?: number;
}

function WinBtn({ color, Icon, onClick }: { color: string; Icon: React.ComponentType<{ size?: number; color?: string }>; onClick: () => void }) {
    const [hov, setHov] = useState(false);
    return (
        <button
            onClick={e => { e.stopPropagation(); onClick(); }}
            onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
            className="w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 border-0 cursor-pointer transition-transform hover:scale-110"
            style={{ background: color }}
        >
            {hov && <Icon size={8} color="rgba(0,0,0,0.55)" />}
        </button>
    );
}

export default function AppWindow({ id, title, icon, children, onClose, onMinimize, onRectChange, onFocus, focused, defaultW, defaultH, startX, startY }: Props) {
    const [pos, setPos] = useState({ x: startX ?? Math.round((1280 - defaultW) / 2), y: startY ?? Math.round((800 - defaultH) / 2) });
    const [maximized, setMaximized] = useState(false);
    const [zIndex, setZIndex] = useState(() => zCounter++);
    const dragging = useRef(false);
    const offset = useRef({ x: 0, y: 0 });

    useEffect(() => {
        if (focused) {
            setZIndex(zCounter++);
        }
    }, [focused]);

    useEffect(() => {
        onRectChange({ x: pos.x, y: pos.y, w: defaultW, h: defaultH, maximized });
    }, [pos, maximized, defaultW, defaultH, onRectChange]);

    useEffect(() => {
        const mm = (e: MouseEvent) => {
            if (dragging.current) {
                const newX = e.clientX - offset.current.x;
                const newY = Math.max(28, e.clientY - offset.current.y);
                setPos({ x: newX, y: newY });
            }
        };
        const mu = () => { dragging.current = false; };
        window.addEventListener('mousemove', mm);
        window.addEventListener('mouseup', mu);
        return () => { window.removeEventListener('mousemove', mm); window.removeEventListener('mouseup', mu); };
    }, []);

    const onBarDown = (e: React.MouseEvent) => {
        if (maximized) return;
        dragging.current = true;
        offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
        setZIndex(zCounter++);
    };

    const winStyle = maximized
        ? { position: 'fixed' as const, top: 28, left: 0, right: 0, bottom: 0, borderRadius: 0, zIndex }
        : { position: 'fixed' as const, top: pos.y, left: pos.x, width: defaultW, height: defaultH, borderRadius: 10, zIndex };

    return (
        <div
            style={{ ...winStyle, background: '#2d2d2d', display: 'flex', flexDirection: 'column', border: '1px solid rgba(255,255,255,0.10)', overflow: 'hidden', boxShadow: '0 24px 80px rgba(0,0,0,0.85)' }}
            className="animate-window-open"
            onMouseDown={() => setZIndex(zCounter++)}
        >
            {/* Title Bar */}
            <div
                style={{ height: 38, background: '#3a3a3a', display: 'flex', alignItems: 'center', padding: '0 12px', gap: 8, userSelect: 'none', cursor: 'default', flexShrink: 0, borderBottom: '1px solid rgba(0,0,0,0.3)' }}
                onMouseDown={onBarDown}
                onDoubleClick={() => setMaximized((m: boolean) => !m)}
            >
                <div className="flex items-center gap-1.5">
                    <WinBtn color="#e74c3c" Icon={CloseIcon} onClick={onClose} />
                    <WinBtn color="#f1c40f" Icon={MinimizeIcon} onClick={onMinimize} />
                    <WinBtn color="#2ecc71" Icon={MaximizeIcon} onClick={() => setMaximized((m: boolean) => !m)} />
                </div>
                <div className="flex items-center gap-2 flex-1 justify-center">
                    <span className="opacity-60 flex-shrink-0">{icon}</span>
                    <span style={{ fontSize: 13, color: '#ccc', fontFamily: "'Ubuntu Mono', monospace" }}>{title}</span>
                </div>
            </div>
            <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>{children}</div>
        </div>
    );
}
