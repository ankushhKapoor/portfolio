'use client';

import { useCallback, useEffect, useState } from 'react';
import { FILES } from '@/lib/portfolio';

export interface FsEntry {
    n: string;
    icon: string;
    dir?: boolean;
    src?: string;
    desktopId?: string;
    size?: number;
    mtime?: string;
}

export interface DesktopFsItem {
    id: string;
    icon: string;
    label: string;
    kind: 'app' | 'folder' | 'file' | 'link';
    appId?: string;
    path?: string;
    href?: string;
}

function desktopItemToFsEntry(item: DesktopFsItem): FsEntry {
    if (item.kind === 'folder') return { n: item.label, icon: item.icon, dir: true, desktopId: item.id };
    if (item.kind === 'link' && item.href) return { n: item.label, icon: item.icon, src: item.href, desktopId: item.id };
    if (item.kind === 'app' && item.appId) return { n: item.label, icon: item.icon, src: `app://${item.appId}`, desktopId: item.id };
    if (item.kind === 'file' && item.path) return { n: item.label, icon: item.icon, src: item.path.startsWith('http') ? item.path : `/os/${item.path}`, desktopId: item.id };
    return { n: item.label, icon: item.icon, desktopId: item.id };
}

interface UseFileManagerOptions {
    desktopItems: DesktopFsItem[];
    windows: Array<{ id: string }>;
    openApp: (id: string, props?: Record<string, unknown>) => void;
    focusApp: (id: string) => void;
    openExternalLink: (href: string) => boolean;
    setSimpleModeOpen: (open: boolean) => void;
}

export function useFileManager({
    desktopItems,
    windows,
    openApp,
    focusApp,
    openExternalLink,
    setSimpleModeOpen,
}: UseFileManagerOptions) {
    const [fsData, setFsData] = useState<Record<string, FsEntry[]>>(FILES);
    const [fsClipboard, setFsClipboard] = useState<{ mode: 'copy' | 'cut'; item: FsEntry; sourcePath: string } | null>(null);
    const [fsPath, setFsPath] = useState<string>('Home');
    const [fsSelectedName, setFsSelectedName] = useState<string | null>(null);
    const [initialLoadDone, setInitialLoadDone] = useState(false);

    useEffect(() => {
        if (initialLoadDone) return;
        fetch('/api/fs')
            .then(res => res.json())
            .then(data => {
                if (data && !data.error) {
                    setFsData(() => ({
                        ...data,
                        Desktop: desktopItems.map(desktopItemToFsEntry),
                    }));
                }
                setInitialLoadDone(true);
            })
            .catch(() => {
                setInitialLoadDone(true);
            });
    }, [desktopItems, initialLoadDone]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFsData((prev) => ({
            ...prev,
            Desktop: desktopItems.map(desktopItemToFsEntry),
        }));
    }, [desktopItems]);

    const handleFsRename = useCallback((oldName: string, kind: 'file' | 'folder', path: string) => {
        const next = window.prompt(`Rename ${kind}`, oldName);
        if (!next || !next.trim() || next === oldName) return;
        const newName = next.trim();
        const dirKey = path.split('/').pop() || 'Home';

        setFsData((prev) => {
            const currentItems = prev[dirKey] || [];
            if (currentItems.some(i => i.n === newName)) {
                alert('Name already exists');
                return prev;
            }
            const updatedItems = currentItems.map(i => i.n === oldName ? { ...i, n: newName } : i);
            return { ...prev, [dirKey]: updatedItems };
        });
    }, []);

    const handleFsDelete = useCallback((name: string, path: string) => {
        const dirKey = path.split('/').pop() || 'Home';
        setFsData((prev) => {
            const currentItems = prev[dirKey] || [];
            return { ...prev, [dirKey]: currentItems.filter(i => i.n !== name) };
        });
    }, []);

    const handleFsNewFolder = useCallback((path: string) => {
        const dirKey = path.split('/').pop() || 'Home';
        setFsData((prev) => {
            const currentItems = prev[dirKey] || [];
            const existing = currentItems.filter(i => i.dir && i.n.startsWith('New Folder')).length;
            const name = existing === 0 ? 'New Folder' : `New Folder ${existing + 1}`;
            return { ...prev, [dirKey]: [...currentItems, { n: name, icon: '📁', dir: true }], [name]: [] };
        });
    }, []);

    const handleFsPaste = useCallback((targetPath: string) => {
        if (!fsClipboard) return;
        const targetDirKey = targetPath.split('/').pop() || 'Home';

        setFsData((prev) => {
            const targetItems = prev[targetDirKey] || [];
            if (targetItems.some(i => i.n === fsClipboard.item.n)) {
                alert('Item already exists in target folder');
                return prev;
            }
            const nextItems = [...targetItems, fsClipboard.item];
            const nextData = { ...prev, [targetDirKey]: nextItems };

            if (fsClipboard.mode === 'cut') {
                const sourceDirKey = fsClipboard.sourcePath.split('/').pop() || '';
                if (nextData[sourceDirKey]) {
                    nextData[sourceDirKey] = nextData[sourceDirKey].filter(i => i.n !== fsClipboard.item.n);
                }
            }
            return nextData;
        });
        if (fsClipboard.mode === 'cut') setFsClipboard(null);
    }, [fsClipboard]);

    const handleFsSortByName = useCallback((folderPath: string, direction: 'asc' | 'desc' = 'asc') => {
        const dirKey = folderPath.split('/').pop() || 'Home';
        setFsData((prev) => {
            const currentItems = prev[dirKey] || [];
            const sortedItems = [...currentItems].sort((a, b) => {
                if (dirKey !== 'Desktop' && !!a.dir !== !!b.dir) return a.dir ? -1 : 1;
                const cmp = a.n.localeCompare(b.n, undefined, { sensitivity: 'base', numeric: true });
                return direction === 'asc' ? cmp : -cmp;
            });
            return { ...prev, [dirKey]: sortedItems };
        });
    }, []);

    const handleFsOpen = useCallback((name: string, kind: 'file' | 'folder', path: string) => {
        if (kind !== 'file') return;
        const dirKey = path.split('/').pop() || '';
        const item = fsData[dirKey]?.find(i => i.n === name);

        if (item?.src?.startsWith('app://')) {
            const appId = item.src.replace('app://', '');
            if (appId === 'simple-mode') setSimpleModeOpen(true);
            else openApp(appId);
            return;
        }

        if (name.endsWith('.txt') || name.endsWith('.md') || name.startsWith('.') || name.endsWith('.bashrc')) {
            const viewerWindow = windows.find(w => w.id === 'text-viewer');
            if (viewerWindow) {
                window.dispatchEvent(new CustomEvent('editor-open-file', { detail: { src: item?.src, fileName: name, path } }));
            } else {
                openApp('text-viewer', { src: item?.src, fileName: name, path });
            }
            setTimeout(() => focusApp('text-viewer'), 0);
        } else if (name.endsWith('.pdf')) {
            const viewerWindow = windows.find(w => w.id === 'pdf-viewer');
            if (viewerWindow) {
                window.dispatchEvent(new CustomEvent('pdf-open-file', { detail: { src: item?.src, fileName: name, path } }));
            } else {
                openApp('pdf-viewer', { src: item?.src, fileName: name, path });
            }
            setTimeout(() => focusApp('pdf-viewer'), 0);
        } else if (item?.src) {
            openExternalLink(item.src);
        }
    }, [focusApp, fsData, openApp, openExternalLink, setSimpleModeOpen, windows]);

    return {
        fsData,
        setFsData,
        fsClipboard,
        setFsClipboard,
        fsPath,
        setFsPath,
        fsSelectedName,
        setFsSelectedName,
        handleFsRename,
        handleFsDelete,
        handleFsNewFolder,
        handleFsPaste,
        handleFsSortByName,
        handleFsOpen,
    };
}
