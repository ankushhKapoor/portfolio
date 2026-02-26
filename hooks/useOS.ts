'use client';
import { useState, useCallback } from 'react';

export type OSScreen = 'boot' | 'lock' | 'desktop' | 'shutdown' | 'restart';

export interface WindowState {
    id: string;
    minimized: boolean;
}

export function useOS() {
    const [screen, setScreen] = useState<OSScreen>('boot');
    const [windows, setWindows] = useState<WindowState[]>([]);
    const [showPower, setShowPower] = useState(false);

    const openApp = useCallback((id: string) => {
        setWindows(w => {
            const existing = w.find(x => x.id === id);
            if (existing) {
                return w.map(x => x.id === id ? { ...x, minimized: false } : x);
            }
            return [...w, { id, minimized: false }];
        });
    }, []);

    const closeApp = useCallback((id: string) => {
        setWindows(w => w.filter(x => x.id !== id));
    }, []);

    const minimizeApp = useCallback((id: string) => {
        setWindows(w => w.map(x => x.id === id ? { ...x, minimized: true } : x));
    }, []);

    const doUnlock = useCallback(() => setScreen('desktop'), []);
    const doLock = useCallback(() => { setShowPower(false); setScreen('lock'); }, []);
    const doPowerOff = useCallback(() => {
        setShowPower(false);
        setScreen('shutdown');
    }, []);
    const doRestart = useCallback(() => {
        setShowPower(false);
        setScreen('restart');
        setTimeout(() => {
            setWindows([]);
            setScreen('boot');
        }, 2400);
    }, []);

    return {
        screen, setScreen,
        windows, openApp, closeApp, minimizeApp,
        showPower, setShowPower,
        doUnlock, doLock, doPowerOff, doRestart,
    };
}
