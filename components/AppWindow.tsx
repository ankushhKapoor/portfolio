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
    minimized?: boolean;
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

export default function AppWindow({ id, title, icon, children, onClose, onMinimize, onRectChange, onFocus, focused, minimized = false, defaultW, defaultH, startX, startY }: Props) {
    const [pos, setPos] = useState({ x: startX ?? 100, y: startY ?? 100 });
    const [size, setSize] = useState({ w: defaultW, h: defaultH });
    const [maximized, setMaximized] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [preMaxRect, setPreMaxRect] = useState({ x: 100, y: 100, w: defaultW, h: defaultH });
    const [maxPreview, setMaxPreview] = useState(false);
    const [zIndex, setZIndex] = useState(() => zCounter++);
    const [isEntering, setIsEntering] = useState(true);
    const [isClosing, setIsClosing] = useState(false);
    const [isMinimizing, setIsMinimizing] = useState(false);
    const [isRestoringFromMaxDrag, setIsRestoringFromMaxDrag] = useState(false);
    const [isSmoothToggleResize, setIsSmoothToggleResize] = useState(false);

    const dragging = useRef(false);
    const offset = useRef({ x: 0, y: 0 });
    const startPos = useRef({ x: 0, y: 0 });
    const isMounted = useRef(false);
    const enterTimer = useRef<number | null>(null);
    const closeTimer = useRef<number | null>(null);
    const minimizeTimer = useRef<number | null>(null);
    const restoreTimer = useRef<number | null>(null);
    const toggleResizeTimer = useRef<number | null>(null);

    const clearTimers = () => {
        if (enterTimer.current) window.clearTimeout(enterTimer.current);
        if (closeTimer.current) window.clearTimeout(closeTimer.current);
        if (minimizeTimer.current) window.clearTimeout(minimizeTimer.current);
        if (restoreTimer.current) window.clearTimeout(restoreTimer.current);
        if (toggleResizeTimer.current) window.clearTimeout(toggleResizeTimer.current);
        enterTimer.current = null;
        closeTimer.current = null;
        minimizeTimer.current = null;
        restoreTimer.current = null;
        toggleResizeTimer.current = null;
    };

    const startSmoothToggleResize = () => {
        setIsSmoothToggleResize(true);
        toggleResizeTimer.current = window.setTimeout(() => {
            setIsSmoothToggleResize(false);
        }, 460);
    };

    const toggleMaximize = () => {
        if (isClosing || isMinimizing || isRestoringFromMaxDrag || isSmoothToggleResize) return;
        startSmoothToggleResize();
        if (!maximized) {
            setPreMaxRect({ x: pos.x, y: pos.y, w: size.w, h: size.h });
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            setPos({ x: 0, y: 28 });
            setSize({ w: vw, h: vh - 28 });
            setMaximized(true);
        } else {
            const normalX = startX ?? 100;
            const normalY = startY ?? 100;
            setPos({ x: normalX, y: normalY });
            setSize({ w: defaultW, h: defaultH });
            setMaximized(false);
        }
    };

     const restoreFromMaxByDoubleClick = (clickX: number) => {
        if (!maximized) {
            toggleMaximize();
            return;
        }
        startSmoothToggleResize();

        const normalY = startY ?? 100;
        const viewportW = window.innerWidth;
        const leftRestoreX = startX ?? 100;
        const rightRestoreX = Math.min(
            viewportW - defaultW - 24,
            Math.max(leftRestoreX + 140, Math.floor(viewportW / 2) - Math.floor(defaultW * 0.32))
        );
        const useRightRestore = clickX > viewportW / 2;

        setPos({ x: useRightRestore ? rightRestoreX : leftRestoreX, y: normalY });
        setSize({ w: defaultW, h: defaultH });
        setMaximized(false);
    };

    useEffect(() => {
        if (focused) setZIndex(zCounter++);
    }, [focused]);

    useEffect(() => {
        if (!minimized) {
            setIsMinimizing(false);
        }
    }, [minimized]);

    useEffect(() => {
        onRectChange({ x: pos.x, y: pos.y, w: size.w, h: size.h, maximized });
    }, [pos, size, maximized, onRectChange]);

    useEffect(() => {
        const mm = (e: MouseEvent) => {
            if (dragging.current) {
                if (maximized) {
                    // Threshold to start dragging out of maximized state
                    const dist = Math.sqrt(Math.pow(e.clientX - startPos.current.x, 2) + Math.pow(e.clientY - startPos.current.y, 2));
                    if (dist > 15) {
                        const ratio = e.clientX / window.innerWidth;
                        const newW = preMaxRect.w;
                        const newX = e.clientX - (newW * ratio);
                        const newY = 48; // Clear snap zone
                        setPos({ x: newX, y: newY });
                        setSize({ w: newW, h: preMaxRect.h });
                        setMaximized(false);
                        setIsRestoringFromMaxDrag(true);
                        restoreTimer.current = window.setTimeout(() => {
                            setIsRestoringFromMaxDrag(false);
                        }, 460);
                        // End current drag gesture so the restore animation is not overridden by live dragging.
                        dragging.current = false;
                        setIsDragging(false);
                        setMaxPreview(false);
                    }
                    return;
                }

                const newX = e.clientX - offset.current.x;
                const newY = Math.max(28, e.clientY - offset.current.y);
                setPos({ x: newX, y: newY });

                // Snap-to-top preview based on window position (near top bar)
                if (newY <= 32) {
                    setMaxPreview(true);
                } else {
                    setMaxPreview(false);
                }
            }
        };
        const mu = (e: MouseEvent) => {
            if (dragging.current) {
                const finalY = Math.max(28, e.clientY - offset.current.y);
                if (e.clientY < 5 || finalY <= 32) {
                    // Perform snap maximize
                    const finalX = e.clientX - offset.current.x;
                    setPreMaxRect({ x: finalX, y: finalY, w: size.w, h: size.h });
                    const vw = window.innerWidth;
                    const vh = window.innerHeight;
                    setPos({ x: 0, y: 28 });
                    setSize({ w: vw, h: vh - 28 });
                    setMaximized(true);
                }
            }
            dragging.current = false;
            setIsDragging(false);
            setMaxPreview(false);
        };
        window.addEventListener('mousemove', mm);
        window.addEventListener('mouseup', mu);
        return () => { window.removeEventListener('mousemove', mm); window.removeEventListener('mouseup', mu); };
    }, [size.w, size.h, maximized, preMaxRect.w, preMaxRect.h]);

    const onBarDown = (e: React.MouseEvent) => {
        if (e.button !== 0) return;
        if (isClosing || isMinimizing || isRestoringFromMaxDrag || isSmoothToggleResize) return;

        // Native click detail gives reliable double-click behavior, including maximized windows.
        if (e.detail === 2) {
            dragging.current = false;
            setIsDragging(false);
            setMaxPreview(false);
            restoreFromMaxByDoubleClick(e.clientX);
            return;
        }

        dragging.current = true;
        startPos.current = { x: e.clientX, y: e.clientY };

        if (!maximized) {
            setIsDragging(true);
            offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
        }
        setZIndex(zCounter++);
    };

    const handleClose = () => {
        if (isClosing || isMinimizing || isRestoringFromMaxDrag || isSmoothToggleResize) return;
        setIsClosing(true);
        closeTimer.current = window.setTimeout(() => {
            onClose();
        }, 220);
    };

    const handleMinimize = () => {
        if (isClosing || isMinimizing || isRestoringFromMaxDrag || isSmoothToggleResize) return;
        setIsMinimizing(true);
        minimizeTimer.current = window.setTimeout(() => {
            onMinimize();
        }, 220);
    };

    const winStyle = {
        position: 'fixed' as const,
        top: pos.y,
        left: pos.x,
        width: size.w,
        height: size.h,
        borderRadius: maximized ? 0 : 10,
        zIndex,
        boxShadow: maximized ? 'none' : '0 24px 80px rgba(0,0,0,0.85)',
    };

    return (
        <>
            {maxPreview && <div className="maximize-preview" />}
            <div
                data-window-id={id}
                style={{ ...winStyle, background: '#2d2d2d', display: 'flex', flexDirection: 'column', border: maximized ? 'none' : '1px solid rgba(255,255,255,0.10)', overflow: 'hidden', pointerEvents: minimized ? 'none' : 'auto' }}
                className={`app-window ${maximized ? 'is-maximized' : ''} ${minimized ? 'is-minimized' : ''} ${isDragging ? 'is-dragging' : ''} ${isEntering ? 'is-entering' : ''} ${isClosing ? 'is-closing' : ''} ${isMinimizing ? 'is-minimizing' : ''} ${(isRestoringFromMaxDrag || isSmoothToggleResize) ? 'is-restoring-from-max-drag' : ''}`}
                onMouseDown={(e) => { if (minimized) return; e.stopPropagation(); onFocus?.(); setZIndex(zCounter++); }}
                onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); }}
            >
                {/* Title Bar */}
                <div
                    style={{ height: 38, background: maximized ? '#2d2d2d' : '#3a3a3a', display: 'flex', alignItems: 'center', padding: '0 12px', gap: 8, userSelect: 'none', cursor: 'default', flexShrink: 0, borderBottom: '1px solid rgba(0,0,0,0.3)' }}
                    onMouseDown={onBarDown}
                >
                    <div className="flex items-center gap-1.5">
                        <WinBtn color="#e74c3c" Icon={CloseIcon} onClick={handleClose} />
                        <WinBtn color="#f1c40f" Icon={MinimizeIcon} onClick={handleMinimize} />
                        <WinBtn color="#2ecc71" Icon={MaximizeIcon} onClick={toggleMaximize} />
                    </div>
                    <div className="flex items-center gap-2 flex-1 justify-center pointer-events-none">
                        <span className="opacity-60 flex-shrink-0">{icon}</span>
                        <span
                            style={{
                                fontSize: maximized ? 14 : 13,
                                color: '#ccc',
                                fontFamily: "'Ubuntu Mono', monospace",
                                fontWeight: maximized ? 600 : 400,
                                transition: 'all 0.22s cubic-bezier(0.4, 0, 1, 1)',
                            }}
                        >
                            {title}
                        </span>
                    </div>
                </div>
                <div className="flex-1 overflow-hidden flex flex-col app-window-content">
                    {children}
                </div>
            </div>
        </>
    );
}
