'use client';
import { useState, useRef, useEffect } from 'react';
import {
    WifiOnIcon, WifiOffIcon, VolumeIcon, VolumeMuteIcon,
    BrightnessIcon, BatteryIcon, SettingsIcon, DoNotDisturbIcon,
    AirplaneIcon, LockIcon, RestartIcon, PowerIcon, CameraIcon
} from '@/components/Icons';

const MONO = "'Ubuntu Mono', monospace";

interface Props {
    onLock: () => void;
    onRestart: () => void;
    onPowerOff: () => void;
    onOpenSettings: () => void;
    onClose: () => void;
    wifi: boolean;
    setWifi: (v: boolean) => void;
    silent: boolean;
    setSilent: (v: boolean) => void;
    volume: number;
    setVolume: (v: number) => void;
    brightness: number;
    setBrightness: (v: number) => void;
}

function Slider({ value, onChange, icon: Icon }: { value: number; onChange: (v: number) => void; icon: React.ComponentType<{ size?: number; color?: string }> }) {
    const track = `linear-gradient(to right, #e95420 ${value}%, rgba(255,255,255,0.08) ${value}%)`;
    return (
        <div className="flex items-center gap-4 px-1 group">
            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-white/5 group-hover:bg-white/10 transition-colors">
                <Icon size={16} color="#bbb" />
            </div>
            <div className="flex-1 relative flex items-center h-8">
                <input
                    type="range" min={0} max={100} value={value}
                    onChange={e => onChange(Number(e.target.value))}
                    className="system-slider"
                    style={{
                        width: '100%',
                        height: 6,
                        borderRadius: 3,
                        outline: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        background: track,
                        WebkitAppearance: 'none',
                        appearance: 'none',
                    }}
                />
            </div>
        </div>
    );
}

export function FilledBattery({ percentage, size = 18 }: { percentage: number; size?: number }) {
    const fill = Math.min(100, Math.max(0, percentage));
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Outline */}
            <rect x="2" y="7" width="16" height="10" rx="2" stroke="white" strokeWidth="2" strokeOpacity="0.4" />
            <path d="M20 10V14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.4" />
            {/* Fill */}
            <rect x="4" y="9" width={(12 * fill) / 100} height="6" rx="1" fill="white" />
        </svg>
    );
}

function CircularButton({ onClick, Icon, title }: { onClick?: () => void; Icon: any; title?: string }) {
    return (
        <button
            onClick={(e) => { e.stopPropagation(); onClick?.(); }}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center border-0 cursor-pointer transition-colors"
            title={title}
        >
            <Icon size={16} color="#eee" />
        </button>
    );
}

function QuickTile({ active, onClick, Icon, label, subLabel }: { active: boolean; onClick: () => void; Icon: any; label: string; subLabel?: string }) {
    return (
        <button
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            className="flex-1 h-[50px] rounded-[20px] border-0 cursor-pointer transition-all flex items-center overflow-hidden"
            style={{
                background: active ? '#e95420' : 'rgba(255,255,255,0.08)',
                color: active ? '#fff' : '#eee',
                paddingLeft: '16px',
                paddingRight: '16px',
                gap: '16px'
            }}
        >
            <Icon size={18} color={active ? '#fff' : '#eee'} />
            <div className="flex flex-col min-w-0">
                <span className="text-[13px] font-semibold truncate leading-tight">{label}</span>
                {subLabel && <span className={`text-[11px] truncate leading-tight ${active ? 'text-white/80' : 'text-white/40'}`}>{subLabel}</span>}
            </div>
        </button>
    );
}

export default function QuickSettings({
    onLock, onRestart, onPowerOff, onOpenSettings, onClose,
    wifi, setWifi, silent, setSilent, volume, setVolume, brightness, setBrightness
}: Props) {
    const [showPower, setShowPower] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) onClose();
        };
        setTimeout(() => document.addEventListener('mousedown', handler), 0);
        return () => document.removeEventListener('mousedown', handler);
    }, [onClose]);

    useEffect(() => {
        document.documentElement.style.setProperty('--system-brightness', (brightness / 100).toString());
    }, [brightness]);

    return (
        <div ref={ref}
            className="fixed top-10 right-2 z-[7000] animate-slide-down flex flex-col gap-2.5"
            style={{
                width: 360,
                padding: '18px',
                borderRadius: '24px',
                background: 'rgba(28,28,28,0.96)',
                backdropFilter: 'blur(40px)',
                WebkitBackdropFilter: 'blur(40px)',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 30px 100px rgba(0,0,0,0.85)',
                fontFamily: "'Ubuntu', sans-serif",
                color: '#eee',
                userSelect: 'none'
            }}
            onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); }}
            onMouseDown={(e) => e.stopPropagation()}
        >
            {showPower ? (
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 mb-2">
                        <button onClick={() => setShowPower(false)} className="text-gray-400 hover:text-white border-0 bg-transparent cursor-pointer text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">‹</button>
                        <span className="text-[14px] font-medium">Power Options</span>
                    </div>
                    <div className="flex flex-col gap-1 px-1">
                        <PowerRow Icon={LockIcon} label="Lock Screen" sub="Return to lock screen" onClick={onLock} />
                        <PowerRow Icon={RestartIcon} label="Restart…" sub="Reboot the system" onClick={onRestart} />
                        <PowerRow Icon={PowerIcon} label="Power Off…" sub="Shut down the system" onClick={onPowerOff} color="#f87171" />
                    </div>
                </div>
            ) : (
                <>
                    {/* Header Row */}
                    <div className="flex items-center justify-between mb-0.5">
                        <div className="flex justify-center items-center gap-2 bg-white/5 hover:bg-white/10 w-[80px] h-[32px] rounded-full cursor-default transition-colors">
                            <FilledBattery percentage={77} />
                            <span className="text-[13px] font-medium">77%</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CircularButton Icon={SettingsIcon} onClick={onOpenSettings} title="Settings" />
                            <CircularButton Icon={PowerIcon} onClick={() => setShowPower(true)} title="Power" />
                        </div>
                    </div>

                    {/* Sliders */}
                    <div className="flex flex-col gap-2 mb-1 px-1">
                        <Slider value={silent ? 0 : volume} onChange={(v) => { setVolume(v); if (v > 0) setSilent(false); }} icon={(volume === 0 || silent) ? VolumeMuteIcon : VolumeIcon} />
                        <Slider value={brightness} onChange={setBrightness} icon={BrightnessIcon} />
                    </div>

                    {/* Quick Tiles */}
                    <div className="flex gap-2 px-1">
                        <QuickTile
                            active={wifi}
                            onClick={() => setWifi(!wifi)}
                            Icon={wifi ? WifiOnIcon : WifiOffIcon}
                            label="Wi-Fi"
                            subLabel={wifi ? "Wi-Fight Club" : undefined}
                        />
                        <QuickTile
                            active={silent}
                            onClick={() => setSilent(!silent)}
                            Icon={silent ? VolumeMuteIcon : VolumeIcon}
                            label="Silent"
                        />
                    </div>
                </>
            )}
        </div>
    );
}

function PowerRow({ Icon, label, sub, onClick, color = '#eee' }: { Icon: any; label: string; sub: string; onClick: () => void; color?: string }) {
    const [hov, setHov] = useState(false);
    return (
        <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
            className="flex items-center gap-4 w-full border-0 cursor-pointer rounded-2xl px-4 py-3 text-left transition-all"
            style={{ background: hov ? 'rgba(255,255,255,0.08)' : 'transparent' }}>
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                <Icon size={20} color={color} />
            </div>
            <div className="flex flex-col">
                <div className="text-[14px] font-medium" style={{ color }}>{label}</div>
                <div className="text-[11px] text-white/40">{sub}</div>
            </div>
        </button>
    );
}
