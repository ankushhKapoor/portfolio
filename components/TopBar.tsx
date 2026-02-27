'use client';
import { useEffect, useState } from 'react';
import { WifiOnIcon, WifiOffIcon, VolumeIcon, BatteryIcon } from '@/components/Icons';
import QuickSettings from '@/components/QuickSettings';
import ClockCalendar from '@/components/ClockCalendar';

interface Props {
    onLock: () => void;
    onRestart: () => void;
    onPowerOff: () => void;
    onOpenSettings: () => void;
    onToggleSearch: () => void;
    isSelecting?: boolean;
}

const MONO = "'Ubuntu Mono', monospace";

export default function TopBar({ onLock, onRestart, onPowerOff, onOpenSettings, onToggleSearch, isSelecting }: Props) {
    const [timeStr, setTimeStr] = useState('--:--');
    const [dateStr, setDateStr] = useState('');
    const [showQS, setShowQS] = useState(false);   // Quick settings (tray icons)
    const [showCal, setShowCal] = useState(false);    // Clock → calendar popup

    // Persistent Quick Settings States
    const [wifi, setWifi] = useState(true);
    const [silent, setSilent] = useState(false);
    const [volume, setVolume] = useState(72);
    const [brightness, setBrightness] = useState(88);

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
                className="fixed top-0 left-0 right-0 grid grid-cols-3 items-center z-[5000] select-none"
                onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); }}
                style={{
                    height: 28,
                    background: 'rgba(0,0,0,0.82)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    fontFamily: MONO,
                    paddingLeft: 16,
                    paddingRight: 16
                }}
            >
                {/* Left — Activities */}
                <div className={`flex items-center justify-center bg-transparent cursor-pointer rounded-md pl-[10px] w-[80px] h-[17px] transition-colors ${!isSelecting ? 'hover:bg-white/7' : ''}`}>
                    <TBtn onClick={() => { onToggleSearch(); setShowCal(false); setShowQS(false); }}>Activities</TBtn>
                </div>

                {/* Center — Branding & Clock */}
                <div className="flex items-center justify-center">
                    <button
                        onClick={() => { setShowCal(s => !s); setShowQS(false); }}
                        className={`flex items-center gap-3 border-0 bg-transparent cursor-pointer rounded-md justify-center w-[200px] h-[17px] transition-colors ${!isSelecting ? 'hover:bg-white/7' : ''}`}
                    >
                        <span className="text-[13px] font-semibold" style={{ color: '#e95420', fontFamily: MONO }}>KapoorOS</span>
                        <span className="text-[13px] text-gray-300" suppressHydrationWarning style={{ fontFamily: MONO }}>{dateStr}</span>
                        <span className="text-[13px] font-semibold text-white" suppressHydrationWarning style={{ fontFamily: MONO }}>{timeStr}</span>
                    </button>
                </div>

                {/* Right — System Tray */}
                <div className="flex items-center justify-end">
                    <button
                        onClick={() => { setShowQS(s => !s); setShowCal(false); }}
                        className={`flex items-center gap-2.5 border-0 bg-transparent cursor-pointer rounded-md justify-center w-[80px] h-[17px] transition-colors ${!isSelecting ? 'hover:bg-white/7' : ''}`}
                    >
                        {wifi ? (
                            <WifiOnIcon size={14} color="#ccc" />
                        ) : (
                            <WifiOffIcon size={14} color="#ccc" />
                        )}
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
                    onOpenSettings={() => { setShowQS(false); onOpenSettings(); }}
                    onClose={() => setShowQS(false)}
                    wifi={wifi} setWifi={setWifi}
                    silent={silent} setSilent={setSilent}
                    volume={volume} setVolume={setVolume}
                    brightness={brightness} setBrightness={setBrightness}
                />
            )}
        </>
    );
}

function TBtn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
    return (
        <button onClick={onClick}
            className="text-[13px] text-gray-300 px-2 py-0.5 rounded border-0 cursor-pointer hover:bg-white/7 transition-colors"
            style={{ fontFamily: MONO, background: 'transparent' }}>
            {children}
        </button>
    );
}
