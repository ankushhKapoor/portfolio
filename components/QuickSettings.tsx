'use client';
import { useState, useRef, useEffect } from 'react';
import {
    WifiOnIcon, WifiOffIcon, VolumeIcon, VolumeMuteIcon,
    BrightnessIcon, BatteryIcon, SettingsIcon, DoNotDisturbIcon,
    AirplaneIcon, LockIcon, RestartIcon, PowerIcon,
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
    const track = `linear-gradient(to right, #e95420 ${value}%, rgba(255,255,255,0.15) ${value}%)`;
    return (
        <div className="flex items-center gap-3 px-1">
            <button className="border-0 bg-transparent cursor-pointer flex-shrink-0 flex" onClick={() => onChange(value > 0 ? 0 : 60)}>
                <Icon size={16} color="#bbb" />
            </button>
            <input
                type="range" min={0} max={100} value={value}
                onChange={e => onChange(Number(e.target.value))}
                style={{
                    flex: 1,
                    height: 4,
                    borderRadius: 2,
                    outline: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    background: track,
                    WebkitAppearance: 'none',
                    appearance: 'none',
                }}
            />
            <span className="text-[11px] w-6 text-right flex-shrink-0" style={{ color: '#666', fontFamily: MONO }}>{value}</span>
        </div>
    );
}

export default function QuickSettings({
    onLock, onRestart, onPowerOff, onOpenSettings, onClose,
    wifi, setWifi, silent, setSilent, volume, setVolume, brightness, setBrightness
}: Props) {
    const [airplane, setAirplane] = useState(false);
    const [showPower, setShowPower] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) onClose();
        };
        setTimeout(() => document.addEventListener('mousedown', handler), 0);
        return () => document.removeEventListener('mousedown', handler);
    }, [onClose]);

    // Update global brightness whenever it changes
    useEffect(() => {
        document.documentElement.style.setProperty('--system-brightness', (brightness / 100).toString());
    }, [brightness]);

    const ToggleTile = ({ active, onClick, Icon, label }: { active: boolean; onClick: () => void; Icon: React.ComponentType<{ size?: number; color?: string }>; label: string }) => (
        <button onClick={onClick}
            className="flex flex-col items-center justify-center gap-1.5 rounded-xl border-0 cursor-pointer transition-all flex-1"
            style={{
                paddingTop: 7,
                paddingBottom: 7,
                background: active ? 'rgba(233,84,32,0.22)' : 'rgba(255,255,255,0.07)',
                outline: active ? '1px solid rgba(233,84,32,0.45)' : 'none'
            }}
        >
            <Icon size={18} color={active ? '#e95420' : '#bbb'} />
            <span className="text-[10px]" style={{ color: active ? '#e95420' : '#888', fontFamily: MONO }}>{label}</span>
        </button>
    );

    return (
        <div ref={ref}
            className="fixed top-9 right-2 z-[7000] animate-slide-down flex flex-col gap-4"
            style={{
                width: 340,
                padding: '20px',
                borderRadius: '24px',
                background: 'rgba(28,28,28,0.98)',
                backdropFilter: 'blur(32px)',
                WebkitBackdropFilter: 'blur(32px)',
                border: '1px solid rgba(255,255,255,0.12)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.75)',
                fontFamily: MONO,
                overflow: 'hidden'
            }}
            onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); }}
            onMouseDown={(e) => e.stopPropagation()} // Prevent closing when interacting with sliders/buttons
        >
            {showPower ? (
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 mb-2">
                        <button onClick={() => setShowPower(false)} className="text-gray-400 hover:text-white border-0 bg-transparent cursor-pointer text-lg px-1">‹</button>
                        <span className="text-[12px] text-gray-400">Power Options</span>
                    </div>
                    <PowerRow Icon={LockIcon} label="Lock Screen" sub="Lock and show lock screen" onClick={onLock} />
                    <PowerRow Icon={RestartIcon} label="Restart…" sub="Restart the computer" onClick={onRestart} />
                    <PowerRow Icon={PowerIcon} label="Power Off…" sub="Power off the computer" onClick={onPowerOff} color="#e74c3c" />
                </div>
            ) : (
                <>
                    <div className="flex gap-2">
                        <ToggleTile active={wifi} onClick={() => setWifi(!wifi)} Icon={wifi ? WifiOnIcon : WifiOffIcon} label="Wi-Fi" />
                        <ToggleTile active={silent} onClick={() => setSilent(!silent)} Icon={silent ? VolumeMuteIcon : VolumeIcon} label="Silent" />
                        <ToggleTile active={false} onClick={onOpenSettings} Icon={SettingsIcon} label="Settings" />
                    </div>

                    <div className="flex flex-col gap-2 my-1">
                        <Slider value={silent ? 0 : volume} onChange={(v) => { setVolume(v); if (v > 0) setSilent(false); }} icon={(volume === 0 || silent) ? VolumeMuteIcon : VolumeIcon} />
                        <Slider value={brightness} onChange={setBrightness} icon={BrightnessIcon} />
                    </div>

                    <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '4px 0' }} />

                    {wifi && (
                        <div className="flex justify-between items-center px-0.5">
                            <div className="flex items-center gap-2">
                                <WifiOnIcon size={14} color="#e95420" />
                                <span className="text-[12px] text-gray-200">Wi-Fight Club</span>
                            </div>
                            <span className="text-[11px]" style={{ color: '#666' }}>Connected</span>
                        </div>
                    )}

                    <div className="flex items-center justify-between px-0.5">
                        <div className="flex items-center gap-2">
                            <BatteryIcon size={16} color="#bbb" />
                            <span className="text-[12px] text-gray-400">77%</span>
                        </div>
                        <button onClick={() => setShowPower(true)}
                            className="flex items-center gap-2 border-0 bg-transparent cursor-pointer px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors">
                            <PowerIcon size={14} color="#e95420" />
                            <span className="text-[12px]" style={{ color: '#e95420', fontFamily: MONO }}>Power</span>
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

function PowerRow({ Icon, label, sub, onClick, color = '#ddd' }: { Icon: React.ComponentType<{ size?: number; color?: string }>; label: string; sub: string; onClick: () => void; color?: string }) {
    const [hov, setHov] = useState(false);
    return (
        <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
            className="flex items-center gap-3 w-full border-0 cursor-pointer rounded-xl px-3 py-2.5 text-left transition-colors"
            style={{ background: hov ? 'rgba(255,255,255,0.08)' : 'transparent', fontFamily: MONO }}>
            <Icon size={18} color={color} />
            <div>
                <div className="text-[13px]" style={{ color }}>{label}</div>
                <div className="text-[11px]" style={{ color: '#666' }}>{sub}</div>
            </div>
        </button>
    );
}
