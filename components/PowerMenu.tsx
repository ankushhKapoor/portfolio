'use client';
import { useState } from 'react';

interface Props {
    onClose: () => void;
    onLock: () => void;
    onRestart: () => void;
    onPowerOff: () => void;
}

export default function PowerMenu({ onClose, onLock, onRestart, onPowerOff }: Props) {
    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-[8000]"
            style={{ background: 'rgba(0,0,0,0.50)' }}
            onClick={onClose}
        >
            <div
                className="rounded-xl p-2 min-w-[200px] animate-fade-in-scale"
                style={{ background: '#3c3c3c', border: '1px solid #555', boxShadow: '0 24px 80px rgba(0,0,0,0.8)' }}
                onClick={e => e.stopPropagation()}
            >
                <PRow icon="🔒" label="Lock Screen" onClick={onLock} />
                <PRow icon="🔁" label="Restart" onClick={onRestart} />
                <PRow icon="⏻" label="Power Off" onClick={onPowerOff} />
            </div>
        </div>
    );
}

function PRow({ icon, label, onClick }: { icon: string; label: string; onClick: () => void }) {
    const [hov, setHov] = useState(false);
    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-white border-0 cursor-pointer transition-colors"
            style={{ background: hov ? 'rgba(255,255,255,0.10)' : 'transparent', fontFamily: "'Ubuntu', sans-serif" }}
        >
            <span>{icon}</span><span>{label}</span>
        </button>
    );
}
