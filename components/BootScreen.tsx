'use client';
import { useEffect, useState, useRef } from 'react';
import { BOOT_LINES } from '@/lib/portfolio';
import { KapoorOSIcon } from '@/components/Icons';

interface Props { onDone: () => void; }

export default function BootScreen({ onDone }: Props) {
    const [lineCount, setLineCount] = useState(0);
    const [progress, setProgress] = useState(0);
    const [phase, setPhase] = useState<'logs' | 'logo'>('logs');
    const called = useRef(false);

    useEffect(() => {
        let active = true;
        let count = 0;
        const iv = setInterval(() => {
            if (!active) return;
            if (count < BOOT_LINES.length) {
                count++;
                setLineCount(count);
                setProgress(Math.round((count / BOOT_LINES.length) * 100));
            } else {
                clearInterval(iv);
                setTimeout(() => { if (active) setPhase('logo'); }, 100);
                setTimeout(() => {
                    if (active && !called.current) {
                        called.current = true;
                        onDone();
                    }
                }, 800);
            }
        }, 90);
        return () => { active = false; clearInterval(iv); };
    }, [onDone]);

    const visibleLines = BOOT_LINES.slice(0, lineCount);

    return (
        <div
            className="fixed inset-0 flex flex-col items-center justify-center gap-8 z-[9999]"
            style={{ background: 'linear-gradient(160deg, #300a24 0%, #1a0a1e 60%, #000 100%)' }}
        >
            {phase === 'logo' ? (
                <div className="flex flex-col items-center gap-4 animate-fade-in-scale">
                    <div
                        className="w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500"
                        style={{
                            background: '#000',
                            border: '1px solid rgba(255,255,255,0.15)',
                            boxShadow: '0 0 20px rgba(255, 255, 255, 0.08)'
                        }}
                    >
                        <div style={{ filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.4))' }}>
                            <KapoorOSIcon size={40} />
                        </div>
                    </div>
                    <div className="text-4xl font-bold tracking-widest" style={{ color: '#e95420', fontFamily: "'Ubuntu', sans-serif" }}>
                        KapoorOS 24.04 LTS
                    </div>
                    <p className="text-sm tracking-wider" style={{ color: '#888', fontFamily: "'Ubuntu Mono', monospace" }}>
                        Starting desktop environment...
                    </p>
                    <div className="w-8 h-8 rounded-full border-[3px] border-gray-700 border-t-[#e95420] animate-spin-orange mt-2" />
                </div>
            ) : (
                <>
                    {/* Logo header */}
                    <div className="flex flex-col items-center gap-3">
                        <div
                            className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300"
                            style={{
                                background: '#000',
                                border: '1px solid rgba(255,255,255,0.12)',
                                boxShadow: '0 0 10px rgba(255, 255, 255, 0.05)'
                            }}
                        >
                            <div style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.3))' }}>
                                <KapoorOSIcon size={28} />
                            </div>
                        </div>
                        <div className="text-3xl font-bold tracking-widest" style={{ color: '#e95420', fontFamily: "'Ubuntu', sans-serif" }}>
                            KapoorOS 24.04 LTS
                        </div>
                    </div>

                    {/* Boot log box */}
                    <div
                        className="w-[640px] max-w-[90vw] rounded border border-gray-800 overflow-hidden"
                        style={{ background: '#000', height: 200, padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 2, fontFamily: "'Ubuntu Mono', monospace", fontSize: 12 }}
                    >
                        {visibleLines.map((line, i) => (
                            <div
                                key={i}
                                className="animate-boot-fade"
                                style={{
                                    color: line.type === 'welcome' ? '#e95420' : line.type === 'ok' ? '#2ecc71' : '#aaaaaa',
                                    whiteSpace: 'pre',
                                    lineHeight: 1.6,
                                }}
                            >
                                {line.text}
                            </div>
                        ))}
                    </div>

                    {/* Progress bar */}
                    <div className="w-[640px] max-w-[90vw] h-1 rounded-full" style={{ background: '#2a2a2a' }}>
                        <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{ width: `${progress}%`, background: '#e95420' }}
                        />
                    </div>
                </>
            )}
        </div>
    );
}
