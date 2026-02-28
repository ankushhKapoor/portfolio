'use client';
import { useState } from 'react';
import { SETTINGS_PANELS } from '@/lib/portfolio';
import { UserIcon, BrightnessIcon, WifiOnIcon, DoNotDisturbIcon, LockIcon, SettingsIcon } from '@/components/Icons';

type Panel = keyof typeof SETTINGS_PANELS;
const MONO = "'Ubuntu Mono', monospace";

const PANEL_ICONS: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
    'About KapoorOS': SettingsIcon,
    Appearance: BrightnessIcon,
    Background: BrightnessIcon,
    Notifications: DoNotDisturbIcon,
    Privacy: LockIcon,
};

export default function SettingsApp() {
    const [panel, setPanel] = useState<Panel>('About KapoorOS');
    const rows = SETTINGS_PANELS[panel] ?? [];

    return (
        <div className="flex-1 flex overflow-hidden" style={{ fontFamily: MONO }}>
            {/* Sidebar */}
            <div className="flex-shrink-0 overflow-y-auto py-3 flex flex-col gap-0.5"
                style={{ width: 180, background: '#1e1e1e', borderRight: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="px-4 pb-2 text-[11px] uppercase tracking-widest font-bold" style={{ color: '#555' }}>Settings</div>
                {(Object.keys(SETTINGS_PANELS) as Panel[]).map(p => {
                    const PIcon = PANEL_ICONS[p] ?? SettingsIcon;
                    return (
                        <button key={p} onClick={() => setPanel(p)}
                            className="flex items-center gap-2.5 px-4 py-2.5 w-full border-0 cursor-pointer text-left text-[13px] transition-colors"
                            style={{
                                background: panel === p ? 'rgba(233,84,32,0.18)' : 'transparent',
                                color: panel === p ? '#fff' : '#888',
                                borderLeft: panel === p ? '2px solid #e95420' : '2px solid transparent',
                                fontFamily: MONO,
                            }}>
                            <PIcon size={15} color={panel === p ? '#e95420' : '#555'} />
                            {p}
                        </button>
                    );
                })}
            </div>

            {/* Panel content */}
            <div className="flex-1 overflow-y-auto pl-8 pr-14 py-6" style={{ background: '#2a2a2a' }}>
                <div className="text-[18px] font-semibold text-white mb-5">{panel}</div>
                {rows.map(([k, v], i) => (
                    <div key={i} className="flex items-center justify-between py-3"
                        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        <span className="text-[13px]" style={{ color: '#888' }}>{k}</span>
                        <span className="text-[13px] text-white">{v}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
