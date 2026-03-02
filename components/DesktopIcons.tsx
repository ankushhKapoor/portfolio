'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DOCK_APPS } from '@/lib/portfolio';
import { TerminalIcon, FolderIcon, UserIcon, FileTextIcon, BriefcaseIcon } from '@/components/Icons';

const ICONS: Record<string, { Icon: React.ComponentType<{ size?: number; color?: string }>; color: string; bg: string }> = {
    about: { Icon: UserIcon, color: '#93c4e8', bg: 'linear-gradient(145deg,#1e2a3d,#2d3f5a)' },
    resume: { Icon: FileTextIcon, color: '#e0e0e0', bg: 'linear-gradient(145deg,#1a1e2d,#252b3d)' },
    projects: { Icon: BriefcaseIcon, color: '#a8d98c', bg: 'linear-gradient(145deg,#1d2a1a,#2b3d28)' },
    terminal: { Icon: TerminalIcon, color: '#4ec9b0', bg: 'linear-gradient(145deg,#1a1a1a,#2c2c2c)' },
    files: { Icon: FolderIcon, color: '#e95420', bg: 'linear-gradient(145deg,#3d1e10,#5a2d14)' },
};

const GRID = {
    top: 48,
    left: 16,
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

    const defaultPositions = useCallback((size: { cols: number; rows: number }) => {
        const next: Record<string, GridPos> = {};
        iconIds.forEach((id, idx) => {
            next[id] = { col: Math.floor(idx / size.rows), row: idx % size.rows };
        });
        return next;
    }, [iconIds]);

    const normalizePositions = useCallback((current: Record<string, GridPos>, size: { cols: number; rows: number }) => {
        const next: Record<string, GridPos> = {};
        const used = new Set<string>();

        const place = (id: string, preferred?: GridPos) => {
            if (preferred) {
                const col = Math.min(size.cols - 1, Math.max(0, preferred.col));
                const row = Math.min(size.rows - 1, Math.max(0, preferred.row));
                const key = `${col},${row}`;
                if (!used.has(key) && !isBlockedByDock(col, row)) {
                    used.add(key);
                    next[id] = { col, row };
                    return;
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
                    // Force re-calculation of default positions with correct size
                    const next: Record<string, GridPos> = {};
                    iconIds.forEach((id, idx) => {
                        next[id] = { col: Math.floor(idx / size.rows), row: idx % size.rows };
                    });
                    return next;
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

    const toPixels = useCallback((pos: GridPos) => ({
        x: (typeof window !== 'undefined' ? window.innerWidth : 1280) - GRID.right - ICON_W - pos.col * getStepX(gridSize.cols),
        y: GRID.top + pos.row * GRID.cellH,
    }), [getStepX, gridSize.cols]);

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
            if (col < 0 || row < 0 || col >= gridSize.cols || row >= gridSize.rows) return false;
            if (isBlockedByDock(col, row)) return false;
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
            minColDelta = Math.max(minColDelta, -p.col);
            maxColDelta = Math.min(maxColDelta, gridSize.cols - 1 - p.col);
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
                <cfg.Icon size={27} color={cfg.color} />
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
