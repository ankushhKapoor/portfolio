'use client';
import { useEffect, useState, useRef } from 'react';
import { PORTFOLIO } from '@/lib/portfolio';
import { UbuntuIcon } from '@/components/Icons';

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

    useEffect(() => {
        const handleAnyKey = () => onUnlock();
        window.addEventListener('keydown', handleAnyKey);
        return () => window.removeEventListener('keydown', handleAnyKey);
    }, [onUnlock]);

    return (
        <div className="fixed inset-0 flex items-center justify-center z-[9000] cursor-pointer"
            onClick={onUnlock}
            style={{ background: 'linear-gradient(135deg, #300a24 0%, #1a0014 50%, #0d0008 100%)' }}>
            <div className="flex flex-col items-center" style={{ transform: 'translateY(-6vh)' }}>
                {/* Branding Logo */}
                <div
                    className="mb-8 w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 animate-fade-in"
                    style={{
                        background: '#000',
                        border: '1px solid rgba(255,255,255,0.15)',
                        boxShadow: '0 0 20px rgba(255, 255, 255, 0.08)'
                    }}
                >
                    <div style={{ filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.4))' }}>
                        <UbuntuIcon size={40} />
                    </div>
                </div>

                {/* Clock */}
                <div className="font-bold text-white select-none" suppressHydrationWarning
                    style={{ fontSize: 96, fontWeight: 200, letterSpacing: -4, lineHeight: 1, fontFamily: "'Ubuntu', sans-serif" }}>
                    {timeStr}
                </div>
                {/* Date */}
                <div className="text-lg font-light text-gray-300 mt-2 mb-24 select-none" suppressHydrationWarning>
                    {dateStr}
                </div>

                <div className="text-gray-400 text-sm tracking-widest uppercase select-none" style={{ fontFamily: "'Ubuntu', sans-serif" }}>
                    Press any key to unlock
                </div>
            </div>
        </div>
    );
}
