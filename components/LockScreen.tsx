'use client';
import { useEffect, useState, useRef } from 'react';
import { PORTFOLIO } from '@/lib/portfolio';

interface Props { onUnlock: () => void; }

export default function LockScreen({ onUnlock }: Props) {
    const [timeStr, setTimeStr] = useState('--:--');
    const [dateStr, setDateStr] = useState('');
    const [pw, setPw] = useState('');
    const [shake, setShake] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const update = () => {
            const d = new Date();
            setTimeStr(`${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`);
            setDateStr(d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }));
        };
        update();
        const iv = setInterval(update, 1000);
        return () => clearInterval(iv);
    }, []);

    useEffect(() => { inputRef.current?.focus(); }, []);

    const handleKey = (e: React.KeyboardEvent) => {
        if (e.key !== 'Enter') return;
        if (pw === '' || pw === 'kapoor') { onUnlock(); return; }
        setShake(true); setPw(''); setErrMsg('Incorrect password');
        setTimeout(() => { setShake(false); setErrMsg(''); }, 700);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-[9000]"
            style={{ background: 'linear-gradient(135deg, #300a24 0%, #1a0014 50%, #0d0008 100%)' }}>
            <div className="flex flex-col items-center">
                {/* Clock */}
                <div className="font-bold text-white select-none" suppressHydrationWarning
                    style={{ fontSize: 96, fontWeight: 200, letterSpacing: -4, lineHeight: 1, fontFamily: "'Ubuntu', sans-serif" }}>
                    {timeStr}
                </div>
                {/* Date */}
                <div className="text-lg font-light text-gray-300 mt-2 mb-8 select-none" suppressHydrationWarning>
                    {dateStr}
                </div>

                {/* Avatar */}
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-3"
                    style={{ background: 'radial-gradient(circle, #f37222, #e95420)', boxShadow: '0 4px 24px rgba(233,84,32,0.4)' }}>
                    🧑‍💻
                </div>
                <div className="text-base text-white mb-5 select-none">{PORTFOLIO.name}</div>

                {/* Password input */}
                <input
                    ref={inputRef}
                    type="password"
                    placeholder="Password"
                    value={pw}
                    onChange={e => setPw(e.target.value)}
                    onKeyDown={handleKey}
                    className={`w-60 text-center text-sm text-white rounded-full px-5 py-2.5 outline-none transition-all ${shake ? 'animate-shake' : ''}`}
                    style={{
                        background: 'rgba(255,255,255,0.10)',
                        border: '1px solid rgba(255,255,255,0.30)',
                        backdropFilter: 'blur(10px)',
                        fontFamily: "'Ubuntu', sans-serif",
                    }}
                />
                <div className="mt-2 h-4 text-xs" style={{ color: errMsg ? '#e95420' : '#888' }}>
                    {errMsg || 'Press Enter to unlock (or leave empty)'}
                </div>
            </div>
        </div>
    );
}
