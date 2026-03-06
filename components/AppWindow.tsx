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
    const [preMaxRect, setPreMaxRect] = useState({ x: startX ?? 100, y: startY ?? 100, w: defaultW, h: defaultH });
    const [originalRect, setOriginalRect] = useState({ x: startX ?? 100, y: startY ?? 100, w: defaultW, h: defaultH });
    const [hasBeenMaximized, setHasBeenMaximized] = useState(false);
    const [maxPreview, setMaxPreview] = useState(false);
    const [zIndex, setZIndex] = useState(() => zCounter++);
    const [isEntering, setIsEntering] = useState(true);
    const [isClosing, setIsClosing] = useState(false);
    const [isMinimizing, setIsMinimizing] = useState(false);
    const [isRestoringFromMaxDrag, setIsRestoringFromMaxDrag] = useState(false);
    const [isSmoothToggleResize, setIsSmoothToggleResize] = useState(false);

    useEffect(() => {
        // Handle small screen initial sizing/positioning
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        if (vw < 950 || vh < 550) {
            const topH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--topbar-height') || '28');
            setSize(prev => ({
                w: Math.min(prev.w, vw - 20),
                h: Math.min(prev.h, vh - topH - 20)
            }));
            setPos(prev => ({
                x: Math.min(prev.x, vw - (Math.min(defaultW, vw - 20)) - 10),
                y: Math.max(topH + 4, Math.min(prev.y, vh - 60))
            }));
        }
    }, []);

    const dragging = useRef(false);
    const offset = useRef({ x: 0, y: 0 });
    const startPos = useRef({ x: 0, y: 0 });
    const isMounted = useRef(false);
    const enterTimer = useRef<number | null>(null);
    const closeTimer = useRef<number | null>(null);
    const minimizeTimer = useRef<number | null>(null);
    const restoreTimer = useRef<number | null>(null);
    const toggleResizeTimer = useRef<number | null>(null);
    const clampRectToViewport = (rect: { x: number; y: number; w: number; h: number }) => {
        const topH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--topbar-height') || '28');
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        const w = Math.min(rect.w, Math.max(320, vw - 12));
        const h = Math.min(rect.h, Math.max(220, vh - topH - 12));
        const maxX = Math.max(6, vw - w - 6);
        const maxY = Math.max(topH + 4, vh - h - 6);

        return {
            x: Math.min(maxX, Math.max(6, rect.x)),
            y: Math.min(maxY, Math.max(topH + 4, rect.y)),
            w,
            h,
        };
    };

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

        const topBarH = typeof window !== 'undefined' ?
            parseInt(getComputedStyle(document.documentElement).getPropertyValue('--topbar-height') || '28') : 28;

        if (!maximized) {
            // Store current position/size before maximizing
            setPreMaxRect({ x: pos.x, y: pos.y, w: size.w, h: size.h });
            if (!hasBeenMaximized) {
                // Store original size on first maximization
                setOriginalRect({ x: pos.x, y: pos.y, w: size.w, h: size.h });
                setHasBeenMaximized(true);
            }
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            setPos({ x: 0, y: topBarH });
            setSize({ w: vw, h: vh - topBarH });
            setMaximized(true);
        } else {
            // Restore to original window size
            const restored = clampRectToViewport(originalRect);
            setPos({ x: restored.x, y: restored.y });
            setSize({ w: restored.w, h: restored.h });
            setMaximized(false);
        }
    };

    const restoreFromMaxByDoubleClick = (clickX: number) => {
        if (!maximized) {
            toggleMaximize();
            return;
        }
        startSmoothToggleResize();

        const restored = clampRectToViewport(originalRect);
        const viewportW = window.innerWidth;
        const anchorRatio = Math.min(1, Math.max(0, clickX / viewportW));
        const anchorX = clickX - restored.w * anchorRatio;
        const anchored = clampRectToViewport({ ...restored, x: anchorX });
        setPos({ x: anchored.x, y: anchored.y });
        setSize({ w: anchored.w, h: anchored.h });
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
        const onResize = () => {
            if (maximized) {
                const topH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--topbar-height') || '28');
                setPos({ x: 0, y: topH });
                setSize({ w: window.innerWidth, h: window.innerHeight - topH });
                return;
            }

            setPos((prev) => {
                const clamped = clampRectToViewport({ x: prev.x, y: prev.y, w: size.w, h: size.h });
                return { x: clamped.x, y: clamped.y };
            });
            setSize((prev) => {
                const clamped = clampRectToViewport({ x: pos.x, y: pos.y, w: prev.w, h: prev.h });
                return { w: clamped.w, h: clamped.h };
            });
        };

        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, [maximized, pos.x, pos.y, size.h, size.w]);

    const onRectChangeRef = useRef(onRectChange);
    useEffect(() => {
        onRectChangeRef.current = onRectChange;
    }, [onRectChange]);

    useEffect(() => {
        onRectChangeRef.current({ x: pos.x, y: pos.y, w: size.w, h: size.h, maximized });
    }, [pos, size, maximized]);

    useEffect(() => {
        const mm = (e: MouseEvent) => {
            if (dragging.current) {
                if (maximized) {
                    // Threshold to start dragging out of maximized state
                    const dist = Math.sqrt(Math.pow(e.clientX - startPos.current.x, 2) + Math.pow(e.clientY - startPos.current.y, 2));
                    if (dist > 15) {
                        const topH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--topbar-height') || '28');
                        const ratio = e.clientX / window.innerWidth;
                        const newW = preMaxRect.w;
                        const newX = e.clientX - (newW * ratio);
                        const newY = topH + 20; // Clear snap zone
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
                const topH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--topbar-height') || '28');
                const newY = Math.max(topH, e.clientY - offset.current.y);
                setPos({ x: newX, y: newY });

                // Snap-to-top preview based on window position (near top bar)
                if (newY <= topH + 4) {
                    setMaxPreview(true);
                } else {
                    setMaxPreview(false);
                }
            }
        };
        const mu = (e: MouseEvent) => {
            if (dragging.current) {
                const topH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--topbar-height') || '28');
                const finalY = Math.max(topH, e.clientY - offset.current.y);
                if (e.clientY < topH + 4 || finalY <= topH + 4) {
                    // Perform snap maximize
                    const finalX = e.clientX - offset.current.x;
                    setPreMaxRect({ x: finalX, y: finalY, w: size.w, h: size.h });
                    const vw = window.innerWidth;
                    const vh = window.innerHeight;
                    setPos({ x: 0, y: topH });
                    setSize({ w: vw, h: vh - topH });
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
