'use client';
import { useState } from 'react';

const MONO = "'Ubuntu Mono', monospace";

export default function CalendarApp() {
    const [viewDate, setViewDate] = useState(new Date());
    const today = new Date();
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

    return (
        <div className="flex-1 overflow-y-auto flex flex-col" style={{ background: '#2a2a2a', fontFamily: MONO }}>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4" style={{ background: '#1e1e1e', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <button onClick={() => setViewDate(new Date(year, month - 1, 1))}
                    className="w-8 h-8 flex items-center justify-center border-0 cursor-pointer rounded-full text-white transition-colors hover:bg-white/10"
                    style={{ fontFamily: MONO, background: 'rgba(255,255,255,0.06)' }}>‹</button>
                <div className="text-center">
                    <div className="text-[15px] font-semibold text-white">{monthName}</div>
                    <div className="text-[12px]" style={{ color: '#666' }}>{year}</div>
                </div>
                <button onClick={() => setViewDate(new Date(year, month + 1, 1))}
                    className="w-8 h-8 flex items-center justify-center border-0 cursor-pointer rounded-full text-white transition-colors hover:bg-white/10"
                    style={{ fontFamily: MONO, background: 'rgba(255,255,255,0.06)' }}>›</button>
            </div>

            <div className="p-4 flex-1">
                {/* Day names */}
                <div className="grid grid-cols-7 gap-1 mb-1">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                        <div key={d} className="text-center text-[11px] py-1 uppercase tracking-wide" style={{ color: '#555' }}>{d}</div>
                    ))}
                </div>
                {/* Days */}
                <div className="grid grid-cols-7 gap-1">
                    {slots.map((d, i) =>
                        d ? <CalDay key={i} d={d} today={isToday(d)} /> : <div key={i} />
                    )}
                </div>
            </div>
        </div>
    );
}

function CalDay({ d, today }: { d: number; today: boolean }) {
    const [hov, setHov] = useState(false);
    return (
        <div
            className="flex items-center justify-center text-[13px] cursor-pointer select-none transition-all"
            style={{
                height: 36,
                borderRadius: 8,
                background: today ? '#e95420' : hov ? 'rgba(255,255,255,0.08)' : 'transparent',
                color: today ? '#fff' : hov ? '#fff' : '#bbb',
                fontFamily: "'Ubuntu Mono', monospace",
                fontWeight: today ? 600 : 400,
                boxShadow: today ? '0 2px 8px rgba(233,84,32,0.4)' : 'none',
            }}
            onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        >
            {d}
        </div>
    );
}
