'use client';

import { useState } from 'react';
import type { MenuEntry } from '@/components/context/types';

export default function KapoorContextMenu({ x, y, items }: { x: number; y: number; items: MenuEntry[] }) {
    const estimatedHeight = items.reduce((h, item) => h + (item.separator ? 8 : 30), 14);
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1280;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
    const clampedX = Math.max(8, Math.min(x, vw - 248));
    const clampedY = Math.max(8, Math.min(y, vh - estimatedHeight - 8));
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const hoveredItem = hoveredIndex !== null ? items[hoveredIndex] : null;
    const submenuItems = hoveredItem?.submenu ?? null;
    const submenuHeight = submenuItems ? submenuItems.length * 30 + 8 : 0;
    const submenuTop = hoveredIndex !== null ? Math.max(8, 8 + hoveredIndex * 30 - submenuHeight) : 8;

    return (
        <div
            data-kapoor-context-menu="true"
            className="fixed z-[9100] min-w-[280px] py-1 animate-fade-in-scale"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            onContextMenu={(e) => e.preventDefault()}
            style={{
                left: `${clampedX}px`,
                top: `${clampedY}px`,
                background: '#2e2e2e',
                border: '1px solid rgba(255,255,255,0.14)',
                borderRadius: 0,
                boxShadow: '0 10px 26px rgba(0,0,0,0.55)',
                fontFamily: "'Ubuntu', sans-serif",
            }}
        >
            {items.map((item, idx) => {
                if (item.separator) return <div key={`sep-${idx}`} className="my-1 h-px bg-white/15" />;

                return (
                    <button
                        key={`${item.label}-${idx}`}
                        disabled={item.disabled}
                        onClick={item.submenu ? undefined : item.action}
                        className="w-full flex items-center justify-between text-left px-3 py-1.5 text-[13px] border-0 bg-transparent transition-colors"
                        style={{
                            color: item.disabled ? '#7a7a7a' : item.danger ? '#ff8c8c' : '#ebebeb',
                            cursor: item.disabled ? 'default' : 'pointer',
                        }}
                        onMouseEnter={(e) => {
                            setHoveredIndex(idx);
                            if (item.disabled) return;
                            e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                        }}
                    >
                        <span className="flex items-center gap-2">
                            {item.checked ? <span style={{ width: 11, color: '#d9d9d9' }}>✓</span> : <span style={{ width: 11 }} />}
                            <span>{item.label}</span>
                        </span>
                        <span style={{ color: item.disabled ? '#6f6f6f' : '#9f9f9f' }}>{item.submenu ? '▸' : (item.shortcut ?? '')}</span>
                    </button>
                );
            })}
            {submenuItems && submenuItems.length > 0 && hoveredIndex !== null && (
                <div
                    data-kapoor-context-menu="true"
                    className="absolute min-w-[190px] py-1 animate-fade-in-scale"
                    style={{
                        left: 'calc(100% - 2px)',
                        top: `${submenuTop}px`,
                        background: '#2e2e2e',
                        border: '1px solid rgba(255,255,255,0.14)',
                        borderRadius: 0,
                        boxShadow: '0 10px 26px rgba(0,0,0,0.55)',
                        fontFamily: "'Ubuntu', sans-serif",
                    }}
                >
                    {submenuItems.map((sub, subIdx) => (
                        <button
                            key={`${sub.label}-${subIdx}`}
                            disabled={sub.disabled}
                            onClick={sub.action}
                            className="w-full flex items-center justify-between text-left px-3 py-1.5 text-[13px] border-0 bg-transparent transition-colors"
                            style={{
                                color: sub.disabled ? '#7a7a7a' : sub.danger ? '#ff8c8c' : '#ebebeb',
                                cursor: sub.disabled ? 'default' : 'pointer',
                            }}
                            onMouseEnter={(e) => {
                                if (sub.disabled) return;
                                e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent';
                            }}
                        >
                            <span>{sub.label}</span>
                            <span style={{ color: sub.disabled ? '#6f6f6f' : '#9f9f9f' }}>{sub.shortcut ?? ''}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
