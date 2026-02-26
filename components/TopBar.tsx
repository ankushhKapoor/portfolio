'use client';
import { useEffect, useState } from 'react';
import { WifiOnIcon, VolumeIcon, BatteryIcon } from '@/components/Icons';
import QuickSettings from '@/components/QuickSettings';
import ClockCalendar from '@/components/ClockCalendar';

interface Props {
    onLock: () => void;
    onRestart: () => void;
    onPowerOff: () => void;
}

const MONO = "'Ubuntu Mono', monospace";

export default function TopBar({ onLock, onRestart, onPowerOff }: Props) {
    const [timeStr, setTimeStr] = useState('--:--');
    const [dateStr, setDateStr] = useState('');
    const [showQS, setShowQS] = useState(false);   // Quick settings (tray icons)
    const [showCal, setShowCal] = useState(false);    // Clock → calendar popup

    useEffect(() => {
        const update = () => {
            const d = new Date();
            setTimeStr(`${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`);
            setDateStr(d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }));
        };
        update();
        const iv = setInterval(update, 1000);
        return () => clearInterval(iv);
    }, []);

    return (
        <>
            <div
                className="fixed top-0 left-0 right-0 flex items-center justify-between z-[5000] select-none"
                style={{ height: 28, background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', fontFamily: MONO }}
            >
                {/* Left — Activities + app name */}
                <div className="flex items-center gap-1 px-2">
                    <TBtn>Activities</TBtn>
                    <span className="text-[13px] px-2" style={{ color: '#e95420' }}>KapoorOS</span>
                </div>

                {/* Center — Clock → opens calendar (absolute to stay truly centered) */}
                <button
                    onClick={() => { setShowCal(s => !s); setShowQS(false); }}
                    className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5 border-0 bg-transparent cursor-pointer rounded px-3 py-0.5 hover:bg-white/10 transition-colors"
                >
                    <span className="text-[13px] text-gray-300" suppressHydrationWarning style={{ fontFamily: MONO }}>{dateStr}</span>
                    <span className="text-[13px] font-semibold text-white" suppressHydrationWarning style={{ fontFamily: MONO }}>{timeStr}</span>
                </button>

                {/* Right — system tray → opens quick settings */}
                <div className="flex items-center px-2">
                    <button
                        onClick={() => { setShowQS(s => !s); setShowCal(false); }}
                        className="flex items-center gap-1.5 border-0 bg-transparent cursor-pointer rounded px-2 py-0.5 hover:bg-white/10 transition-colors"
                    >
                        <WifiOnIcon size={14} color="#ccc" />
                        <VolumeIcon size={14} color="#ccc" />
                        <BatteryIcon size={14} color="#ccc" />
                    </button>
                </div>
            </div>

            {showCal && <ClockCalendar onClose={() => setShowCal(false)} />}
            {showQS && (
                <QuickSettings
                    onLock={() => { setShowQS(false); onLock(); }}
                    onRestart={() => { setShowQS(false); onRestart(); }}
                    onPowerOff={() => { setShowQS(false); onPowerOff(); }}
                    onClose={() => setShowQS(false)}
                />
            )}
        </>
    );
}

function TBtn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
    return (
        <button onClick={onClick}
            className="text-[13px] text-gray-300 px-2 py-0.5 rounded border-0 cursor-pointer hover:bg-white/10 transition-colors"
            style={{ fontFamily: MONO, background: 'transparent' }}>
            {children}
        </button>
    );
}
