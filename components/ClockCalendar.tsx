'use client';
import { useState, useEffect, useRef } from 'react';

const MONO = "'Ubuntu Mono', monospace";

export default function ClockCalendar({ onClose }: { onClose: () => void }) {
    const [now, setNow] = useState(new Date());
    const [viewDate, setViewDate] = useState(new Date());
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const iv = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(iv);
    }, []);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) onClose();
        };
        setTimeout(() => document.addEventListener('mousedown', handler), 0);
        return () => document.removeEventListener('mousedown', handler);
    }, [onClose]);

    const today = now;
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const slots: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) slots.push(null);
    for (let d = 1; d <= daysInMonth; d++) slots.push(d);
    while (slots.length % 7 !== 0) slots.push(null);

    const isToday = (d: number | null) =>
        !!d && today.getFullYear() === year && today.getMonth() === month && today.getDate() === d;
    const monthName = viewDate.toLocaleString('default', { month: 'long' });

    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    const dateDisplay = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

    return (
        <div ref={ref}
            className="fixed top-9 left-1/2 -translate-x-1/2 z-[7000] rounded-2xl p-5 animate-slide-down"
            style={{
                width: 300,
                background: 'rgba(28,28,28,0.97)',
                backdropFilter: 'blur(32px)',
                WebkitBackdropFilter: 'blur(32px)',
                border: '1px solid rgba(255,255,255,0.12)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.75)',
                fontFamily: MONO,
            }}
            onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); }}
        >
            {/* Digital clock — HH:MM:SS on one line */}
            <div className="text-center mb-4" suppressHydrationWarning>
                <div className="flex items-baseline justify-center gap-0 leading-none" style={{ fontFamily: MONO }}>
                    <span className="text-[48px] font-bold text-white" style={{ letterSpacing: -2 }}>{hh}:{mm}</span>
                    <span className="text-[28px] font-bold text-gray-500 ml-0.5" style={{ letterSpacing: -1 }}>:{ss}</span>
                </div>
                <div className="text-[12px] text-gray-500 mt-2">{dateDisplay}</div>
            </div>

            <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', marginBottom: 12 }} />

            {/* Mini calendar */}
            <div className="flex items-center justify-between mb-3">
                <button onClick={() => setViewDate(new Date(year, month - 1, 1))}
                    className="w-7 h-7 flex items-center justify-center rounded-full border-0 cursor-pointer transition-colors hover:bg-white/10 text-gray-400"
                    style={{ fontFamily: MONO, background: 'transparent' }}>‹</button>
                <span className="text-[13px] font-semibold text-white">{monthName} {year}</span>
                <button onClick={() => setViewDate(new Date(year, month + 1, 1))}
                    className="w-7 h-7 flex items-center justify-center rounded-full border-0 cursor-pointer transition-colors hover:bg-white/10 text-gray-400"
                    style={{ fontFamily: MONO, background: 'transparent' }}>›</button>
            </div>

            <div className="grid grid-cols-7 gap-0.5 mb-1">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                    <div key={i} className="text-center text-[10px] py-0.5 uppercase" style={{ color: '#444' }}>{d}</div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-0.5">
                {slots.map((d, i) =>
                    d ? (
                        <div key={i}
                            className={`flex items-center justify-center text-[12px] rounded-full cursor-pointer select-none transition-colors ${isToday(d) ? 'bg-[#e95420] text-white font-bold' : 'text-gray-400 hover:bg-white/15 hover:text-white'}`}
                            style={{
                                width: 28,
                                height: 28,
                                fontFamily: MONO,
                                margin: '0 auto'
                            }}>
                            {d}
                        </div>
                    ) : <div key={i} />
                )}
            </div>
        </div>
    );
}
