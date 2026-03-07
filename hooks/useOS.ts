'use client';
import { useState, useCallback } from 'react';

export type OSScreen = 'boot' | 'lock' | 'desktop' | 'shutdown' | 'restart';

export interface WindowRect {
    id: string;
    x: number;
    y: number;
    w: number;
    h: number;
    maximized: boolean;
}

export interface WindowState {
    id: string;
    minimized: boolean;
    props?: any;
}

export function useOS() {
    const [screen, setScreen] = useState<OSScreen>('boot');
    const [windows, setWindows] = useState<WindowState[]>([]);
    const [windowRects, setWindowRects] = useState<Record<string, WindowRect>>({});
    const [focusedAppId, setFocusedAppId] = useState<string | null>(null);
    const [showPower, setShowPower] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [searchMode, setSearchMode] = useState<'activities' | 'apps'>('apps');

    const updateWindowRect = useCallback((id: string, rect: Partial<WindowRect>) => {
        setWindowRects(prev => ({
            ...prev,
            [id]: { ...(prev[id] || { id, x: 0, y: 0, w: 0, h: 0, maximized: false }), ...rect, id }
        }));
    }, []);

    const focusApp = useCallback((id: string) => {
        setFocusedAppId(id);
        setWindows((w: WindowState[]) => w.map(x => x.id === id ? { ...x, minimized: false } : x));
    }, []);

    const openApp = useCallback((id: string, props?: any) => {
        setShowSearch(false);
        setWindows((w: WindowState[]) => {
            const existing = w.find(x => x.id === id);
            if (existing) {
                return w.map(x => x.id === id ? { ...x, minimized: false, props: props || x.props } : x);
            }
            return [...w, { id, minimized: false, props }];
        });
        setFocusedAppId(id);
    }, []);

    const toggleSearch = useCallback((mode: 'activities' | 'apps' = 'apps') => {
        setSearchMode(mode);
        setShowSearch((s: boolean) => !s);
        setShowPower(false);
    }, []);

    const closeSearch = useCallback(() => {
        setShowSearch(false);
    }, []);

    const closeApp = useCallback((id: string) => {
        setWindows((w: WindowState[]) => w.filter(x => x.id !== id));
        if (focusedAppId === id) setFocusedAppId(null);
        setWindowRects((prev: Record<string, WindowRect>) => {
            const next = { ...prev };
            delete next[id];
            return next;
        });
    }, [focusedAppId]);

    const minimizeApp = useCallback((id: string) => {
        setWindows((w: WindowState[]) => w.map(x => x.id === id ? { ...x, minimized: true } : x));
        if (focusedAppId === id) setFocusedAppId(null);
    }, [focusedAppId]);

    const doUnlock = useCallback(() => setScreen('desktop'), []);
    const doLock = useCallback(() => { setShowPower(false); setShowSearch(false); setScreen('lock'); }, []);
    const doPowerOff = useCallback(() => {
        setShowPower(false);
        setShowSearch(false);
        setScreen('shutdown');
    }, []);
    const doRestart = useCallback(() => {
        setShowPower(false);
        setShowSearch(false);
        setScreen('restart');
        setTimeout(() => {
            setWindows([]);
            setWindowRects({});
            setScreen('boot');
        }, 2400);
    }, []);

    return {
        screen, setScreen,
        windows, openApp, closeApp, minimizeApp, focusApp, focusedAppId,
        showPower, setShowPower,
        showSearch, toggleSearch, closeSearch, searchMode,
        windowRects, updateWindowRect,
        doUnlock, doLock, doPowerOff, doRestart,
    };
}
