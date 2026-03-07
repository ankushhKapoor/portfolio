'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DOCK_APPS } from '@/lib/portfolio';
import { TerminalIcon, FolderIcon, UserIcon, FileTextIcon, BriefcaseIcon, Globe } from '@/components/Icons';

// Ubuntu-style PDF icon — GNOME Document Viewer inspired
function PdfFileIcon({ size = 27 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="pdfBodyGrad" x1="4" y1="2" x2="4" y2="30" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#ef3030" />
                    <stop offset="100%" stopColor="#b71c1c" />
                </linearGradient>
            </defs>
            {/* Document body with folded corner */}
            <path d="M4 3 C4 2.45 4.45 2 5 2 L20 2 L28 10 L28 29 C28 29.55 27.55 30 27 30 L5 30 C4.45 30 4 29.55 4 29 Z" fill="url(#pdfBodyGrad)" />
            {/* Fold flap */}
            <path d="M20 2 L20 10 L28 10 Z" fill="#7f0000" opacity="0.7" />
            {/* Left highlight */}
            <rect x="4" y="2" width="2.5" height="28" rx="1.5" fill="white" opacity="0.08" />
            {/* Document text lines */}
            <rect x="8" y="13" width="14" height="1.5" rx="0.75" fill="white" opacity="0.4" />
            <rect x="8" y="16" width="16" height="1.5" rx="0.75" fill="white" opacity="0.3" />
            <rect x="8" y="19" width="10" height="1.5" rx="0.75" fill="white" opacity="0.25" />
            {/* PDF badge */}
            <rect x="7" y="22.5" width="14.5" height="6" rx="1.5" fill="white" opacity="0.96" />
            <text x="14.25" y="27.1" textAnchor="middle" fontSize="5" fontWeight="bold" fill="#b71c1c" fontFamily="Ubuntu Mono, monospace" letterSpacing="0.8">PDF</text>
        </svg>
    );
}

// Ubuntu-style community/people icon
function CommunityIcon({ size = 27, color = '#19b6b6' }: { size?: number; color?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="10" cy="11" r="4" fill={color} opacity="0.9" />
            <circle cx="22" cy="11" r="4" fill={color} opacity="0.9" />
            <path d="M2 25c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke={color} strokeWidth="2.2" strokeLinecap="round" fill="none" />
            <path d="M14 25c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke={color} strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.7" />
        </svg>
    );
}

// Ubuntu-style briefcase/award icon for experience
function WorkIcon({ size = 27, color = '#f37222' }: { size?: number; color?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="11" width="24" height="17" rx="2.5" fill={color} opacity="0.9" />
            <path d="M11 11V8a5 5 0 0 1 10 0v3" stroke={color} strokeWidth="2.2" strokeLinecap="round" fill="none" />
            <rect x="4" y="11" width="24" height="6" rx="2" fill={color} opacity="0.5" />
            <rect x="13" y="16" width="6" height="3" rx="1" fill="white" opacity="0.85" />
        </svg>
    );
}

// Social icon SVGs
function GitHubIcon({ size = 26 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="#e0e0e0" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.54 2.87 8.38 6.84 9.74.5.09.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.57 2.34 1.12 2.91.85.09-.66.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.38 9.38 0 0 1 12 6.84c.85.004 1.71.12 2.51.34 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.07.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.81 0 .27.18.59.69.49C19.13 20.63 22 16.79 22 12.26 22 6.58 17.52 2 12 2z" />
        </svg>
    );
}
function LinkedInIcon({ size = 26 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="#61a8e0" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
        </svg>
    );
}
function TwitterXIcon({ size = 24 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="#9ba3af" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.26 5.632 5.904-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
        </svg>
    );
}
function EmailIcon({ size = 26 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#e95420" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
    );
}

const ICONS: Record<string, { renderIcon?: () => React.ReactNode; Icon?: React.ComponentType<{ size?: number; color?: string }>; color: string; bg: string }> = {
    about: { Icon: UserIcon, color: '#93c4e8', bg: 'linear-gradient(145deg,#1e2a3d,#2d3f5a)' },
    projects: { Icon: BriefcaseIcon, color: '#a8d98c', bg: 'linear-gradient(145deg,#1d2a1a,#2b3d28)' },
    terminal: { Icon: TerminalIcon, color: '#4ec9b0', bg: 'linear-gradient(145deg,#1a1a1a,#2c2c2c)' },
    files: { Icon: FolderIcon, color: '#e95420', bg: 'linear-gradient(145deg,#3d1e10,#5a2d14)' },
    'resume-pdf': { renderIcon: () => <PdfFileIcon size={30} />, color: '#c0392b', bg: 'linear-gradient(145deg,#2a0a0a,#3d1212)' },
    'simple-mode': { Icon: Globe, color: '#f5a623', bg: 'linear-gradient(145deg,#3d2800,#5a3d10)' },
    extracurricular: { renderIcon: () => <CommunityIcon size={27} color="#19b6b6" />, color: '#19b6b6', bg: 'linear-gradient(145deg,#0a2a2a,#123d3d)' },
    experience: { renderIcon: () => <WorkIcon size={27} color="#f37222" />, color: '#f37222', bg: 'linear-gradient(145deg,#2a1a00,#3d2900)' },
    'github-link': { renderIcon: () => <GitHubIcon size={26} />, color: '#e0e0e0', bg: 'linear-gradient(145deg,#161b22,#21262d)' },
    'linkedin-link': { renderIcon: () => <LinkedInIcon size={26} />, color: '#61a8e0', bg: 'linear-gradient(145deg,#0a1628,#0d2040)' },
    'twitter-link': { renderIcon: () => <TwitterXIcon size={23} />, color: '#9ba3af', bg: 'linear-gradient(145deg,#15202b,#1c2a38)' },
    'email-link': { renderIcon: () => <EmailIcon size={24} />, color: '#e95420', bg: 'linear-gradient(145deg,#2a1208,#3d1c0a)' },
};

const GRID = {
    top: 48,
    left: 6,
    right: 6,
    bottom: 16,
    cellW: 86,
    cellH: 98,
};

const ICON_W = 70;
const ICON_H = 90;
const DOCK_BOTTOM = 12;
const DOCK_HEIGHT = 82;
const DOCK_ICON_W = 56;
const DOCK_GAP = 2;
const DOCK_PAD_X = 24;
const DOCK_SEPARATOR_W = 9;

type GridPos = { col: number; row: number };

interface Props {
    items: Array<{ id: string; icon: string; label: string }>;
    onOpen: (id: string) => void;
    selectedItems?: Set<string>;
    onSelectionChange?: (items: Set<string>) => void;
    onIconContextMenu?: (id: string, x: number, y: number) => void;
    onRegister?: (items: Array<{ id: string; rect: DOMRect }>) => void;
    layoutVersion?: number;
    dimmedItems?: Set<string>;
}

interface DragState {
    ids: string[];
    leadId: string;
    startPointerX: number;
    startPointerY: number;
    startPositions: Record<string, GridPos>;
    previewDx: number;
    previewDy: number;
}

export default function DesktopIcons({ items, onOpen, selectedItems = new Set(), onSelectionChange, onIconContextMenu, onRegister, layoutVersion = 0, dimmedItems = new Set() }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [gridSize, setGridSize] = useState({ cols: 1, rows: 1 });
    const [positions, setPositions] = useState<Record<string, GridPos>>({});
    const [drag, setDrag] = useState<DragState | null>(null);
    const iconRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const clickRef = useRef({ id: '', ts: 0 });
    const suppressClickRef = useRef(false);

    const iconIds = useMemo(() => items.map((item) => item.id), [items]);
    const getStepX = useCallback((_cols: number) => {
        return GRID.cellW;
    }, []);

    const getGridSize = useCallback(() => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        const cols = Math.max(1, Math.floor((w - GRID.left - GRID.right - ICON_W) / GRID.cellW) + 1);
        const rows = Math.max(1, Math.floor((h - GRID.top - GRID.bottom - ICON_H) / GRID.cellH) + 1);
        return { cols, rows };
    }, []);

    const getDockRect = useCallback(() => {
        const iconCount = DOCK_APPS.length + 1;
        const dockWidth = DOCK_PAD_X + iconCount * DOCK_ICON_W + iconCount * DOCK_GAP + DOCK_SEPARATOR_W;
        const left = (window.innerWidth - dockWidth) / 2;
        const top = window.innerHeight - DOCK_BOTTOM - DOCK_HEIGHT;
        return { left, right: left + dockWidth, top, bottom: top + DOCK_HEIGHT };
    }, []);

    const isBlockedByDock = useCallback((col: number, row: number) => {
        const x = window.innerWidth - GRID.right - ICON_W - col * getStepX(gridSize.cols);
        const y = GRID.top + row * GRID.cellH;
        const iconRect = { left: x, right: x + ICON_W, top: y, bottom: y + ICON_H };
        const dock = getDockRect();
        return !(
            iconRect.right < dock.left ||
            iconRect.left > dock.right ||
            iconRect.bottom < dock.top ||
            iconRect.top > dock.bottom
        );
    }, [getDockRect, getStepX, gridSize.cols]);

    const LEFT_PINNED = ['simple-mode', 'github-link', 'linkedin-link', 'twitter-link', 'email-link'];

    const defaultPositions = useCallback((size: { cols: number; rows: number }) => {
        const next: Record<string, GridPos> = {};
        // RIGHT side icons: col=0 upward from right edge
        const rightIds = iconIds.filter(id => !LEFT_PINNED.includes(id));
        rightIds.forEach((id, idx) => {
            next[id] = { col: Math.floor(idx / size.rows), row: idx % size.rows };
        });
        // LEFT side icons: single column (col=-1)
        // Simple Mode at row 0, then social icons start at row 3 (gap between them)
        const leftIds = LEFT_PINNED.filter(id => iconIds.includes(id));
        leftIds.forEach((id, idx) => {
            if (idx === 0) {
                next[id] = { col: -1, row: 0 }; // Simple Mode
            } else {
                next[id] = { col: -1, row: idx + 2 }; // Social icons start at row 3
            }
        });
        return next;
    }, [iconIds]);

    const normalizePositions = useCallback((current: Record<string, GridPos>, size: { cols: number; rows: number }) => {
        const next: Record<string, GridPos> = {};
        const used = new Set<string>();

        const place = (id: string, preferred?: GridPos) => {
            if (preferred) {
                // Preserve negative cols as-is (left-anchored icons)
                if (preferred.col < 0) {
                    const key = `${preferred.col},${preferred.row}`;
                    if (!used.has(key)) {
                        used.add(key);
                        next[id] = { col: preferred.col, row: preferred.row };
                        return;
                    }
                } else {
                    const col = Math.min(size.cols - 1, Math.max(0, preferred.col));
                    const row = Math.min(size.rows - 1, Math.max(0, preferred.row));
                    const key = `${col},${row}`;
                    if (!used.has(key) && !isBlockedByDock(col, row)) {
                        used.add(key);
                        next[id] = { col, row };
                        return;
                    }
                }
            }

            for (let c = 0; c < size.cols; c++) {
                for (let r = 0; r < size.rows; r++) {
                    const key = `${c},${r}`;
                    if (used.has(key) || isBlockedByDock(c, r)) continue;
                    used.add(key);
                    next[id] = { col: c, row: r };
                    return;
                }
            }
        };

        iconIds.forEach((id) => place(id, current[id]));
        return next;
    }, [iconIds, isBlockedByDock]);

    useEffect(() => {
        const applySize = () => {
            const size = getGridSize();
            setGridSize(size);
            setPositions((prev) => {
                if (Object.keys(prev).length === 0) {
                    return defaultPositions(size);
                }
                return normalizePositions(prev, size);
            });
        };
        applySize();
        window.addEventListener('resize', applySize);
        return () => window.removeEventListener('resize', applySize);
    }, [defaultPositions, getGridSize, normalizePositions]);

    useEffect(() => {
        const size = getGridSize();
        setPositions(defaultPositions(size));
    }, [defaultPositions, getGridSize, layoutVersion]);

    useEffect(() => {
        setPositions((prev) => normalizePositions(prev, gridSize));
    }, [gridSize, iconIds, normalizePositions]);

    const registerRects = useCallback(() => {
        if (!onRegister) return;
        const rects = iconIds
            .map((id) => ({ id, rect: iconRefs.current[id]?.getBoundingClientRect() ?? new DOMRect() }))
            .filter((item) => item.rect.width > 0);
        onRegister(rects);
    }, [iconIds, onRegister]);

    useEffect(() => {
        registerRects();
    }, [registerRects, positions, selectedItems]);

    const toPixels = useCallback((pos: GridPos) => {
        const w = typeof window !== 'undefined' ? window.innerWidth : 1280;
        if (pos.col < 0) {
            // Left-anchored: -1 = leftmost col (col=0 from left), -2 = one step right, etc.
            const leftCol = -(pos.col + 1);
            return {
                x: GRID.left + leftCol * getStepX(gridSize.cols),
                y: GRID.top + pos.row * GRID.cellH,
            };
        }
        return {
            x: w - GRID.right - ICON_W - pos.col * getStepX(gridSize.cols),
            y: GRID.top + pos.row * GRID.cellH,
        };
    }, [getStepX, gridSize.cols]);

    const commitSelection = useCallback((next: Set<string>) => {
        onSelectionChange?.(next);
    }, [onSelectionChange]);

    const selectForMouse = useCallback((id: string, ctrlKey: boolean) => {
        if (ctrlKey) {
            const next = new Set(selectedItems);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            commitSelection(next);
            return;
        }

        if (selectedItems.size === 1 && selectedItems.has(id)) return;
        commitSelection(new Set([id]));
    }, [commitSelection, selectedItems]);

    const canMoveTo = useCallback((start: Record<string, GridPos>, ids: string[], deltaCol: number, deltaRow: number) => {
        const occupiedByOthers = new Set<string>();
        iconIds.forEach((id) => {
            if (ids.includes(id)) return;
            const p = positions[id];
            if (!p) return;
            occupiedByOthers.add(`${p.col},${p.row}`);
        });

        for (const id of ids) {
            const base = start[id];
            const col = base.col + deltaCol;
            const row = base.row + deltaRow;
            if (row < 0 || row >= gridSize.rows) return false;
            if (col >= gridSize.cols) return false;
            // col < 0 is valid (left-anchored zone) — only block dock overlap for positive cols
            if (col >= 0 && isBlockedByDock(col, row)) return false;
            if (occupiedByOthers.has(`${col},${row}`)) return false;
        }
        return true;
    }, [gridSize.cols, gridSize.rows, iconIds, isBlockedByDock, positions]);

    const clampDelta = useCallback((start: Record<string, GridPos>, ids: string[], targetCol: number, targetRow: number, leadId: string) => {
        const lead = start[leadId];
        let dCol = targetCol - lead.col;
        let dRow = targetRow - lead.row;

        let minColDelta = Number.NEGATIVE_INFINITY;
        let maxColDelta = Number.POSITIVE_INFINITY;
        let minRowDelta = Number.NEGATIVE_INFINITY;
        let maxRowDelta = Number.POSITIVE_INFINITY;

        ids.forEach((id) => {
            const p = start[id];
            // For negative-col icons allow moving right freely; for positive allow clamping normally
            if (p.col >= 0) {
                minColDelta = Math.max(minColDelta, -p.col);
            }
            maxColDelta = Math.min(maxColDelta, gridSize.cols - 1 - Math.max(0, p.col));
            minRowDelta = Math.max(minRowDelta, -p.row);
            maxRowDelta = Math.min(maxRowDelta, gridSize.rows - 1 - p.row);
        });

        dCol = Math.min(maxColDelta, Math.max(minColDelta, dCol));
        dRow = Math.min(maxRowDelta, Math.max(minRowDelta, dRow));

        if (!canMoveTo(start, ids, dCol, dRow)) return null;
        return { dCol, dRow };
    }, [canMoveTo, gridSize.cols, gridSize.rows]);

    useEffect(() => {
        if (!drag) return;

        const onMove = (e: MouseEvent) => {
            const dx = e.clientX - drag.startPointerX;
            const dy = e.clientY - drag.startPointerY;
            if (Math.abs(dx) > 2 || Math.abs(dy) > 2) suppressClickRef.current = true;
            setDrag({ ...drag, previewDx: dx, previewDy: dy });
        };

        const onUp = () => {
            const dColRaw = -Math.round(drag.previewDx / getStepX(gridSize.cols));
            const dRowRaw = Math.round(drag.previewDy / GRID.cellH);
            const lead = drag.startPositions[drag.leadId];
            const targetCol = lead.col + dColRaw;
            const targetRow = lead.row + dRowRaw;
            const snapped = clampDelta(drag.startPositions, drag.ids, targetCol, targetRow, drag.leadId);
            if (snapped) {
                setPositions((prev) => {
                    const next = { ...prev };
                    drag.ids.forEach((id) => {
                        const base = drag.startPositions[id];
                        next[id] = { col: base.col + snapped.dCol, row: base.row + snapped.dRow };
                    });
                    return next;
                });
            }
            setDrag(null);
        };

        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);

        return () => {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
        };
    }, [clampDelta, drag, getStepX, gridSize.cols]);

    const handleMouseDownIcon = useCallback((e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (e.button !== 0) return;

        const ctrl = e.ctrlKey || e.metaKey;
        if (ctrl) {
            selectForMouse(id, true);
            return;
        }

        if (!selectedItems.has(id)) {
            commitSelection(new Set([id]));
        }

        const selectedGroup = selectedItems.has(id) ? Array.from(selectedItems) : [id];
        const ids = selectedGroup.length > 0 ? selectedGroup : [id];

        const startPositions: Record<string, GridPos> = {};
        ids.forEach((itemId) => {
            const p = positions[itemId];
            if (p) startPositions[itemId] = { ...p };
        });

        if (!startPositions[id]) return;

        setDrag({
            ids: Object.keys(startPositions),
            leadId: id,
            startPointerX: e.clientX,
            startPointerY: e.clientY,
            startPositions,
            previewDx: 0,
            previewDy: 0,
        });
    }, [commitSelection, positions, selectForMouse, selectedItems]);

    const handleClickIcon = useCallback((e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (suppressClickRef.current) {
            suppressClickRef.current = false;
            return;
        }

        const now = Date.now();
        // More lenient double-click timeout (500ms) for mobile/lag
        if (clickRef.current.id === id && now - clickRef.current.ts < 500) {
            onOpen(id);
            clickRef.current = { id: '', ts: 0 }; // Reset
            return;
        }
        clickRef.current = { id, ts: now };
    }, [onOpen]);

    const handleTouchStartIcon = useCallback((id: string) => {
        const now = Date.now();
        if (clickRef.current.id === id && now - clickRef.current.ts < 500) {
            onOpen(id);
            clickRef.current = { id: '', ts: 0 };
            return;
        }
        clickRef.current = { id, ts: now };
    }, [onOpen]);

    const handleContextMenuIcon = useCallback((e: React.MouseEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();
        if (!selectedItems.has(id)) {
            commitSelection(new Set([id]));
        }
        onIconContextMenu?.(id, e.clientX, e.clientY);
    }, [commitSelection, onIconContextMenu, selectedItems]);

    return (
        <div ref={containerRef} className="fixed inset-0 z-10 pointer-events-none">
            {items.map((item) => {
                const pos = positions[item.id] ?? { col: 0, row: 0 };
                const pixel = toPixels(pos);
                const isDragged = drag?.ids.includes(item.id);
                const x = (isDragged && drag) ? pixel.x + drag.previewDx : pixel.x;
                const y = (isDragged && drag) ? pixel.y + drag.previewDy : pixel.y;
                return (
                    <DIcon
                        key={item.id}
                        item={item}
                        selected={selectedItems.has(item.id)}
                        dimmed={dimmedItems.has(item.id)}
                        x={x}
                        y={y}
                        setRef={(el) => { iconRefs.current[item.id] = el; }}
                        onMouseDown={(e) => handleMouseDownIcon(e, item.id)}
                        onClick={(e) => handleClickIcon(e, item.id)}
                        onTouchStart={() => handleTouchStartIcon(item.id)}
                        onContextMenu={(e) => handleContextMenuIcon(e, item.id)}
                    />
                );
            })}
        </div>
    );
}

function DIcon({
    item,
    selected,
    dimmed,
    x,
    y,
    setRef,
    onMouseDown,
    onClick,
    onTouchStart,
    onContextMenu,
}: {
    item: { id: string; icon: string; label: string };
    selected: boolean;
    dimmed: boolean;
    x: number;
    y: number;
    setRef: (el: HTMLDivElement | null) => void;
    onMouseDown: (e: React.MouseEvent) => void;
    onClick: (e: React.MouseEvent) => void;
    onTouchStart: () => void;
    onContextMenu: (e: React.MouseEvent) => void;
}) {
    const [hov, setHov] = useState(false);
    const cfg = ICONS[item.id] ?? { Icon: FolderIcon, color: '#fff', bg: '#333' };

    return (
        <div
            ref={setRef}
            data-icon-id={item.id}
            data-no-select="true"
            onMouseDown={onMouseDown}
            onClick={onClick}
            onTouchStart={onTouchStart}
            onContextMenu={onContextMenu}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            className="absolute flex flex-col items-center gap-1.5 px-2 py-2 cursor-default select-none pointer-events-auto"
            style={{
                left: `${x}px`,
                top: `${y}px`,
                width: 70,
                background: selected ? 'rgba(233, 84, 32, 0.2)' : hov ? 'rgba(255,255,255,0.10)' : 'transparent',
                outline: selected ? '1px solid #e95420' : 'none',
                borderRadius: 0,
                opacity: dimmed ? 0.45 : 1,
            }}
        >
            <div
                className="w-[52px] h-[52px] rounded-2xl flex items-center justify-center"
                style={{
                    background: cfg.bg,
                    boxShadow: hov ? '0 6px 18px rgba(0,0,0,0.6)' : '0 2px 8px rgba(0,0,0,0.4)',
                    transition: 'box-shadow 0.15s',
                    border: '1px solid rgba(255,255,255,0.07)',
                }}
            >
                {cfg.renderIcon ? cfg.renderIcon() : cfg.Icon ? <cfg.Icon size={27} color={cfg.color} /> : null}
            </div>
            <span
                className="text-[11px] text-white text-center leading-tight"
                style={{ textShadow: '0 1px 6px rgba(0,0,0,0.95)', fontFamily: "'Ubuntu Mono', monospace" }}
            >
                {item.label}
            </span>
        </div>
    );
}
