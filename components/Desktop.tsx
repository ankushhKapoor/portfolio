'use client';
import { useEffect, useState, ReactNode, useCallback, useRef, useMemo } from 'react';
import { useOS } from '@/hooks/useOS';
import { DESKTOP_ICONS, WIN_DEFAULTS, FILES } from '@/lib/portfolio';
import { TerminalIcon, FolderIcon, UserIcon, FileTextIcon, BriefcaseIcon, CalendarIcon, SettingsIcon, KapoorOSIcon } from '@/components/Icons';

import BootScreen from '@/components/BootScreen';
import LockScreen from '@/components/LockScreen';
import AppWindow from '@/components/AppWindow';
import TopBar from '@/components/TopBar';
import Dock from '@/components/Dock';
import DesktopIcons from '@/components/DesktopIcons';
import SearchOverlay from '@/components/SearchOverlay';
import PropertiesWindow, { PropertiesData } from '@/components/PropertiesWindow';

interface SelectionRect {
    x: number;
    y: number;
    w: number;
    h: number;
}

interface MenuEntry {
    label: string;
    action?: () => void;
    danger?: boolean;
    disabled?: boolean;
    separator?: boolean;
    shortcut?: string;
    checked?: boolean;
}

interface ContextMenuState {
    x: number;
    y: number;
    type: 'desktop' | 'icon' | 'fileItem' | 'filesEmpty';
    iconId?: string;
    fileData?: { name: string; kind: 'file' | 'folder'; path: string };
    folderPath?: string;
}

interface DesktopItem {
    id: string;
    icon: string;
    label: string;
    kind: 'app' | 'folder' | 'file' | 'link';
    appId?: string;
    path?: string;
    href?: string;
}

interface DesktopClipboard {
    mode: 'copy' | 'cut';
    items: DesktopItem[];
}

// Local PropertiesData interface removed in favor of import from @/components/PropertiesWindow

import TerminalApp from '@/components/apps/TerminalApp';
import AboutApp from '@/components/apps/AboutApp';
import ResumeApp from '@/components/apps/ResumeApp';
import ProjectsApp from '@/components/apps/ProjectsApp';
import ExtracurricularApp from '@/components/apps/ExtracurricularApp';
import ExperienceApp from '@/components/apps/ExperienceApp';
import CalendarApp from '@/components/apps/CalendarApp';
import FilesApp from '@/components/apps/FilesApp';
import SettingsApp from '@/components/apps/SettingsApp';
import TextViewerApp from '@/components/apps/TextViewerApp';
import PdfViewerApp from '@/components/apps/PdfViewerApp';
import SimplePortfolio from '@/components/SimplePortfolio';

const APP_ICONS: Record<string, ReactNode> = {
    terminal: <TerminalIcon size={14} color="#4ec9b0" />,
    files: <FolderIcon size={14} color="#e95420" />,
    about: <UserIcon size={14} color="#93c4e8" />,
    resume: <FileTextIcon size={14} color="#ccc" />,
    projects: <BriefcaseIcon size={14} color="#a8d98c" />,
    extracurricular: <UserIcon size={14} color="#19b6b6" />,
    experience: <BriefcaseIcon size={14} color="#f37222" />,
    calendar: <CalendarIcon size={14} color="#f37222" />,
    settings: <SettingsIcon size={14} color="#ccc" />,
    'text-viewer': <FileTextIcon size={14} color="#f2f2f2" />,
    'pdf-viewer': <FileTextIcon size={14} color="#f37222" />,
};

const FILE_TYPE_MAP: Array<{ ext: string; typeLabel: string; mime: string; openWith: string; icon: string }> = [
    // Audio
    { ext: '.mp3', typeLabel: 'MP3 Audio', mime: 'audio/mpeg', openWith: 'Music Player', icon: '🎵' },
    { ext: '.wav', typeLabel: 'WAV Audio', mime: 'audio/wav', openWith: 'Music Player', icon: '🎵' },
    { ext: '.ogg', typeLabel: 'OGG Audio', mime: 'audio/ogg', openWith: 'Music Player', icon: '🎵' },

    // Video
    { ext: '.mp4', typeLabel: 'MP4 Video', mime: 'video/mp4', openWith: 'Video Player', icon: '🎬' },
    { ext: '.webm', typeLabel: 'WebM Video', mime: 'video/webm', openWith: 'Video Player', icon: '🎬' },

    // Images
    { ext: '.png', typeLabel: 'PNG Image', mime: 'image/png', openWith: 'Image Viewer', icon: '🖼️' },
    { ext: '.jpg', typeLabel: 'JPEG Image', mime: 'image/jpeg', openWith: 'Image Viewer', icon: '🖼️' },
    { ext: '.jpeg', typeLabel: 'JPEG Image', mime: 'image/jpeg', openWith: 'Image Viewer', icon: '🖼️' },
    { ext: '.gif', typeLabel: 'GIF Image', mime: 'image/gif', openWith: 'Image Viewer', icon: '🖼️' },
    { ext: '.svg', typeLabel: 'SVG Vector Image', mime: 'image/svg+xml', openWith: 'Image Viewer', icon: '🖼️' },

    // Documents
    { ext: '.pdf', typeLabel: 'PDF Document', mime: 'application/pdf', openWith: 'Document Viewer', icon: '📋' },
    { ext: '.docx', typeLabel: 'Microsoft Word Document', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', openWith: 'LibreOffice Writer', icon: '📝' },
    { ext: '.txt', typeLabel: 'Plain Text Document', mime: 'text/plain', openWith: 'Text Viewer', icon: '📄' },
    { ext: '.md', typeLabel: 'Markdown Document', mime: 'text/markdown', openWith: 'Text Viewer', icon: '📄' },

    // Code
    { ext: '.js', typeLabel: 'JavaScript Source', mime: 'text/javascript', openWith: 'VS Code', icon: '📜' },
    { ext: '.ts', typeLabel: 'TypeScript Source', mime: 'text/typescript', openWith: 'VS Code', icon: '📜' },
    { ext: '.tsx', typeLabel: 'React TypeScript Source', mime: 'text/tsx', openWith: 'VS Code', icon: '📜' },
    { ext: '.py', typeLabel: 'Python Script', mime: 'text/x-python', openWith: 'VS Code', icon: '📜' },
    { ext: '.go', typeLabel: 'Go Source', mime: 'text/x-go', openWith: 'VS Code', icon: '📜' },
    { ext: '.json', typeLabel: 'JSON Data', mime: 'application/json', openWith: 'Text Viewer', icon: '📄' },
    { ext: '.bashrc', typeLabel: 'Shell Configuration', mime: 'text/x-shellscript', openWith: 'Text Viewer', icon: '📄' },

    // Archives
    { ext: '.zip', typeLabel: 'ZIP Archive', mime: 'application/zip', openWith: 'Archive Manager', icon: '📦' },
    { ext: '.tar.gz', typeLabel: 'Compressed Archive', mime: 'application/gzip', openWith: 'Archive Manager', icon: '📦' },

    // System
    { ext: '.iso', typeLabel: 'Disk Image', mime: 'application/x-iso9660-image', openWith: 'Disk Image Mounter', icon: '💿' },
];

function getFileTypeInfo(name: string) {
    const lower = name.toLowerCase();
    const found = FILE_TYPE_MAP.find((f) => lower.endsWith(f.ext));
    if (found) return found;

    if (name.startsWith('.')) return { typeLabel: 'Configuration File', mime: 'text/plain', openWith: 'Text Viewer', icon: '📄' };
    return { typeLabel: 'Generic File', mime: 'application/octet-stream', openWith: 'Text Viewer', icon: '📄' };
}

function formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i] + ` (${bytes.toLocaleString()} bytes)`;
}

function pseudoSizeFromName(name: string): string {
    const lower = name.toLowerCase();
    let baseBytes = 0;
    if (lower.endsWith('.iso')) baseBytes = 4200000000;
    else if (lower.endsWith('.tar.gz') || lower.endsWith('.zip')) baseBytes = 18400000;
    else if (lower.endsWith('.pdf') || lower.endsWith('.docx')) baseBytes = 2100000;
    else if (lower.endsWith('.mp3')) baseBytes = 9700000;
    else if (lower.endsWith('.png') || lower.endsWith('.jpg')) baseBytes = 842000;
    else {
        let hash = 0;
        for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) % 1000000;
        baseBytes = 5000 + hash;
    }

    if (baseBytes > 1024 * 1024 * 1024) return `${(baseBytes / (1024 * 1024 * 1024)).toFixed(1)} GB (${baseBytes.toLocaleString()} bytes)`;
    if (baseBytes > 1024 * 1024) return `${(baseBytes / (1024 * 1024)).toFixed(1)} MB (${baseBytes.toLocaleString()} bytes)`;
    if (baseBytes > 1024) return `${(baseBytes / 1024).toFixed(1)} KB (${baseBytes.toLocaleString()} bytes)`;
    return `${baseBytes} bytes`;
}

// PropertiesDialog removed in favor of standalone PropertiesWindow component

// Helper row components removed

function ShutdownScreen({ mode, onPowerOn }: { mode: 'shutdown' | 'restart'; onPowerOn: () => void }) {
    const [phase, setPhase] = useState<'spinning' | 'off'>('spinning');

    useEffect(() => {
        const t = setTimeout(() => {
            if (mode === 'restart') {
                onPowerOn();
            } else {
                setPhase('off');
            }
        }, 3000);
        return () => clearTimeout(t);
    }, [mode, onPowerOn]);

    if (phase === 'off') {
        return (
            <div className="fixed inset-0 flex flex-col items-center justify-center gap-6 z-[9999]" style={{ background: '#000' }}>
                <div className="w-20 h-20 rounded-full flex items-center justify-center"
                    style={{
                        background: '#000',
                        border: '1px solid rgba(255,255,255,0.15)',
                        boxShadow: '0 0 20px rgba(255, 255, 255, 0.08)'
                    }}>
                    <div style={{ filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.4))' }}>
                        <KapoorOSIcon size={40} />
                    </div>
                </div>
                <div style={{ color: '#444', fontFamily: "'Ubuntu Mono', monospace", fontSize: 13 }}>KapoorOS is powered off</div>
                <button
                    onClick={onPowerOn}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full border-0 cursor-pointer transition-all hover:scale-105"
                    style={{ background: 'rgba(233,84,32,0.15)', border: '1px solid rgba(233,84,32,0.4)', color: '#e95420', fontFamily: "'Ubuntu Mono', monospace", fontSize: 13 }}
                >
                    <span>⏻</span> Power On
                </button>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center gap-5 z-[9999]" style={{ background: '#000' }}>
            <div className="w-10 h-10 rounded-full border-[3px] border-gray-800 border-t-[#e95420] animate-spin-orange" />
            <div style={{ color: '#666', fontFamily: "'Ubuntu Mono', monospace", fontSize: 14 }}>
                {mode === 'shutdown' ? 'Shutting down…' : 'Restarting…'}
            </div>
        </div>
    );
}


import { WindowRect, WindowState } from '@/hooks/useOS';

function SelectionRectangle({ rect }: { rect: SelectionRect | null }) {
    if (!rect || rect.w === 0 || rect.h === 0) return null;
    return (
        <div
            className="fixed pointer-events-none z-[100] overflow-hidden"
            style={{
                left: '0',
                top: '0',
                right: '0',
                bottom: '0',
            }}
        >
            <div
                style={{
                    position: 'fixed',
                    left: `${rect.x}px`,
                    top: `${rect.y}px`,
                    width: `${rect.w}px`,
                    height: `${rect.h}px`,
                    background: 'rgba(233, 84, 32, 0.15)',
                    border: '2px solid #e95420',
                    boxSizing: 'border-box',
                }}
            />
        </div>
    );
}

function KapoorContextMenu({ x, y, items }: { x: number; y: number; items: MenuEntry[] }) {
    const estimatedHeight = items.reduce((h, item) => h + (item.separator ? 8 : 30), 14);
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1280;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
    const clampedX = Math.max(8, Math.min(x, vw - 248));
    const clampedY = Math.max(8, Math.min(y, vh - estimatedHeight - 8));

    return (
        <div
            data-kapoor-context-menu="true"
            className="fixed z-[9100] min-w-[280px] py-1 animate-fade-in-scale"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            onContextMenu={(e) => e.preventDefault()}
            style={{
                left: `${clampedX}px`,
                top: `${clampedY}px`,
                background: '#2e2e2e',
                border: '1px solid rgba(255,255,255,0.14)',
                borderRadius: 0,
                boxShadow: '0 10px 26px rgba(0,0,0,0.55)',
                fontFamily: "'Ubuntu', sans-serif",
            }}
        >
            {items.map((item, idx) => {
                if (item.separator) {
                    return <div key={`sep-${idx}`} className="my-1 h-px bg-white/15" />;
                }

                return (
                    <button
                        key={`${item.label}-${idx}`}
                        disabled={item.disabled}
                        onClick={item.action}
                        className="w-full flex items-center justify-between text-left px-3 py-1.5 text-[13px] border-0 bg-transparent transition-colors"
                        style={{
                            color: item.disabled ? '#7a7a7a' : item.danger ? '#ff8c8c' : '#ebebeb',
                            cursor: item.disabled ? 'default' : 'pointer',
                        }}
                        onMouseEnter={(e) => {
                            if (item.disabled) return;
                            e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                        }}
                    >
                        <span className="flex items-center gap-2">
                            {item.checked ? <span style={{ width: 11, color: '#d9d9d9' }}>✓</span> : <span style={{ width: 11 }} />}
                            <span>{item.label}</span>
                        </span>
                        <span style={{ color: item.disabled ? '#6f6f6f' : '#9f9f9f' }}>{item.shortcut ?? ''}</span>
                    </button>
                );
            })}
        </div>
    );
}

export default function Desktop() {
    const { screen, setScreen, windows, openApp, closeApp, minimizeApp, focusApp, focusedAppId, showSearch, toggleSearch, closeSearch, searchMode, windowRects, updateWindowRect, doUnlock, doLock, doPowerOff, doRestart } = useOS();
    const [selectionRect, setSelectionRect] = useState<SelectionRect | null>(null);
    const [isSelecting, setIsSelecting] = useState(false);
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
    const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
    const [desktopItems, setDesktopItems] = useState<DesktopItem[]>(() =>
        DESKTOP_ICONS.map((item) => ({
            ...item,
            kind: item.id === 'files' ? 'folder' : (item as { kind?: string }).kind === 'file' ? 'file' : (item as { kind?: string }).kind === 'link' ? 'link' : 'app',
            appId: item.id,
            href: (item as { href?: string }).href,
        }))
    );
    const [layoutVersion, setLayoutVersion] = useState(0);
    const [keepAligned] = useState(true);
    const [simpleModeOpen, setSimpleModeOpen] = useState(false);
    const [propertiesData, setPropertiesData] = useState<PropertiesData | null>(null);
    const [clipboard, setClipboard] = useState<DesktopClipboard | null>(null);
    const [cutItemIds, setCutItemIds] = useState<Set<string>>(new Set());
    const [fsData, setFsData] = useState<Record<string, { n: string; icon: string; dir?: boolean; src?: string; size?: number; mtime?: string }[]>>(FILES);
    const [fsClipboard, setFsClipboard] = useState<{ mode: 'copy' | 'cut', item: { n: string; icon: string; dir?: boolean; src?: string }, sourcePath: string } | null>(null);
    const [fsPath, setFsPath] = useState<string>('Home');
    const [fsSelectedName, setFsSelectedName] = useState<string | null>(null);
    const startPos = useRef<{ x: number; y: number } | null>(null);
    const desktopItemsRef = useRef<Map<string, DOMRect>>(new Map());
    const [initialLoadDone, setInitialLoadDone] = useState(false);

    useEffect(() => {
        if (initialLoadDone) return;
        fetch('/api/fs')
            .then(res => res.json())
            .then(data => {
                if (data && !data.error) {
                    setFsData(() => {
                        // Merge with any existing hardcoded files that aren't in assets
                        const next = { ...data };
                        if (!next['Home']) next['Home'] = [];
                        if (!next['Home'].some((f: { n: string }) => f.n === '.bashrc')) {
                            next['Home'].push({ n: '.bashrc', icon: '📄' });
                        }
                        return next;
                    });
                }
                setInitialLoadDone(true);
            })
            .catch(err => {
                console.error('FS Fetch Error:', err);
                setInitialLoadDone(true);
            });
    }, [initialLoadDone]);

    const closeContextMenu = useCallback(() => setContextMenu(null), []);

    const openContextMenu = useCallback((menu: ContextMenuState) => {
        setContextMenu(menu);
    }, []);

    const openDesktopItem = useCallback((id: string) => {
        const item = desktopItems.find((it) => it.id === id);
        if (!item) { openApp(id); return; }
        if (id === 'simple-mode') { setSimpleModeOpen(true); return; }
        if (item.kind === 'link') {
            if (id === 'email-link') {
                window.location.href = 'mailto:work.ankushkapoor1626@gmail.com';
            } else if (item.href) {
                window.open(item.href, '_blank', 'noopener,noreferrer');
            }
            return;
        }
        if (item.kind === 'folder') { openApp('files'); return; }
        if (item.kind === 'file') {
            // Handle file opening
            if (item.path) {
                const fileName = item.path.split('/').pop() || '';
                const fileExt = fileName.split('.').pop()?.toLowerCase();
                if (fileExt === 'pdf') {
                    openApp('pdf-viewer', { src: `/assets/os/${item.path}`, fileName });
                } else if (['txt', 'md'].includes(fileExt || '')) {
                    openApp('text-viewer', { src: `/assets/os/${item.path}`, fileName });
                }
            }
            return;
        }
        if (item.appId) { openApp(item.appId); }
    }, [desktopItems, openApp]);

    const makeUniqueLabel = useCallback((base: string, items: DesktopItem[]) => {
        const names = new Set(items.map((i) => i.label));
        if (!names.has(base)) return base;
        let idx = 2;
        while (names.has(`${base} ${idx}`)) idx += 1;
        return `${base} ${idx}`;
    }, []);

    const openDesktopProperties = useCallback(() => {
        const now = new Date().toLocaleString();
        setPropertiesData({
            title: 'Desktop Properties',
            name: 'Desktop',
            kind: 'desktop',
            typeLabel: 'System Folder',
            mime: 'inode/directory',
            sizeLabel: `${desktopItems.length} items`,
            parent: '/home/kapoor',
            accessed: now,
            modified: now,
            created: 'Oct 24, 2023',
            permissions: 'View and modify content',
            owner: 'kapoor',
            group: 'kapoor',
            openWith: 'Files',
            icon: '🖥️',
            freeSpace: '142.0 GB Free'
        });
    }, [desktopItems.length]);

    const openItemProperties = useCallback((item: DesktopItem | null, selectedCount: number) => {
        const now = new Date().toLocaleString();
        if (!item || selectedCount > 1) {
            setPropertiesData({
                title: `${selectedCount} Items Properties`,
                name: `${selectedCount} selected items`,
                kind: 'multi',
                typeLabel: 'Multiple items',
                mime: 'mixed',
                sizeLabel: `${selectedCount} items`,
                parent: '/home/kapoor/Desktop',
                accessed: now,
                modified: now,
                created: now,
                permissions: 'Mixed permissions',
                owner: 'kapoor',
                group: 'kapoor',
                openWith: 'Multiple applications',
                icon: '📚',
                freeSpace: '142.0 GB Free'
            });
            return;
        }

        if (item.kind === 'folder') {
            setPropertiesData({
                title: `${item.label} Properties`,
                name: item.label,
                kind: 'folder',
                typeLabel: 'Folder',
                mime: 'inode/directory',
                sizeLabel: 'Calculating...',
                parent: '/home/kapoor/Desktop',
                accessed: now,
                modified: now,
                created: 'Nov 12, 2023',
                permissions: 'Read and write',
                owner: 'kapoor',
                group: 'kapoor',
                openWith: 'Files',
                icon: '📁',
                freeSpace: '142.0 GB Free'
            });
            return;
        }

        if (item.kind === 'app') {
            const isKapoorApp = ['about', 'resume', 'projects', 'terminal', 'files', 'settings'].includes(item.id);
            setPropertiesData({
                title: `${item.label} Properties`,
                name: item.label,
                kind: 'app',
                typeLabel: isKapoorApp ? 'System Application' : 'Application',
                mime: 'application/x-desktop',
                sizeLabel: 'Executable',
                parent: '/usr/bin',
                accessed: now,
                modified: now,
                created: 'Feb 15, 2024',
                permissions: 'Read and execute',
                owner: 'root',
                group: 'root',
                openWith: 'Kapoor Shell',
                icon: '⚙️'
            });
            return;
        }

        const info = getFileTypeInfo(item.label);
        setPropertiesData({
            title: `${item.label} Properties`,
            name: item.label,
            kind: 'file',
            typeLabel: info.typeLabel,
            mime: info.mime,
            sizeLabel: pseudoSizeFromName(item.label),
            parent: '/home/kapoor/Desktop',
            accessed: now,
            modified: now,
            created: 'Dec 05, 2023',
            permissions: 'Read and write',
            owner: 'kapoor',
            group: 'kapoor',
            openWith: info.openWith,
            icon: info.icon || '📄'
        });
    }, []);

    const handleFileItemContextMenu = useCallback((name: string, kind: 'file' | 'folder', path: string, x: number, y: number) => {
        openContextMenu({ type: 'fileItem', fileData: { name, kind, path }, x, y });
    }, [openContextMenu]);

    const handleFilesAppProperties = useCallback((name: string, kind: 'file' | 'folder', path: string) => {
        const info = getFileTypeInfo(name);

        // Lookup real metadata from fsData if available
        let sizeLabel = kind === 'folder' ? 'Calculating...' : pseudoSizeFromName(name);
        let modified = new Date().toLocaleString();
        let sourceSrc: string | undefined;

        if (fsData) {
            const dirKey = path.split('/').pop() || 'Home';
            const item = fsData[dirKey]?.find(i => i.n === name);
            if (item) {
                if (item.size !== undefined) {
                    sizeLabel = formatBytes(item.size);
                }
                if (item.mtime) {
                    modified = new Date(item.mtime).toLocaleString();
                }
                sourceSrc = item.src;
            }
        }

        setPropertiesData({
            title: `${name} Properties`,
            name: name,
            kind: kind === 'folder' ? 'folder' : 'file',
            typeLabel: kind === 'folder' ? 'Folder' : info.typeLabel,
            mime: kind === 'folder' ? 'inode/directory' : info.mime,
            sizeLabel: sizeLabel,
            parent: path,
            accessed: modified, // Use same for simplicity
            modified: modified,
            created: modified, // Use same for simplicity
            permissions: kind === 'folder' ? 'Read and write' : 'Read only',
            owner: 'kapoor',
            group: 'kapoor',
            openWith: kind === 'folder' ? 'Files' : info.openWith,
            icon: kind === 'folder' ? '📁' : (info.icon || '📄')
        });

        // Fetch actual file size if not already in fsData
        if (kind === 'file' && sizeLabel === pseudoSizeFromName(name)) {
            // Try to use sourceSrc from fsData, or construct from path
            let fileUrl = sourceSrc;
            if (!fileUrl && path.includes('Documents')) {
                // Construct URL for files in Documents folder (assets)
                fileUrl = `/assets/os/Documents/${name}`;
            }

            if (fileUrl) {
                fetch(fileUrl, { method: 'HEAD' })
                    .then((res) => {
                        const contentLength = res.headers.get('content-length');
                        if (!contentLength) return;
                        const bytes = Number(contentLength);
                        if (!Number.isFinite(bytes)) return;
                        setPropertiesData((prev) => {
                            if (!prev || prev.name !== name || prev.parent !== path) return prev;
                            return { ...prev, sizeLabel: formatBytes(bytes) };
                        });
                    })
                    .catch(() => {
                        // keep current label if HEAD fails
                    });
            }
        }
    }, [fsData]);

    const requestToggleSearch = useCallback((mode: 'activities' | 'apps') => {
        if (showSearch) {
            window.dispatchEvent(new CustomEvent('request-search-close'));
        } else {
            toggleSearch(mode);
        }
    }, [showSearch, toggleSearch]);

    const isDockOverlapped = (Object.values(windowRects) as WindowRect[]).some((rect: WindowRect) => {
        const isMinimized = windows.find((w: WindowState) => w.id === rect.id)?.minimized;
        if (isMinimized) return false;
        if (rect.maximized) return true;

        const screenW = typeof window !== 'undefined' ? window.innerWidth : 1280;
        const screenH = typeof window !== 'undefined' ? window.innerHeight : 800;

        const dockHeight = 84;
        const dockWidth = Math.min(screenW * 0.8, (windows.length + 2) * 64);
        const dockLeft = (screenW - dockWidth) / 2;
        const dockRight = (screenW + dockWidth) / 2;
        const dockTop = screenH - dockHeight;

        const winBottom = rect.y + rect.h;
        const winRight = rect.x + rect.w;

        const overlapsVertically = winBottom > dockTop;
        const overlapsHorizontally = rect.x < dockRight && winRight > dockLeft;

        return overlapsVertically && overlapsHorizontally;
    });

    const handleRegistrationRequest = useCallback((items: Array<{ id: string; rect: DOMRect }>) => {
        const map = new Map(items.map(item => [item.id, item.rect]));
        desktopItemsRef.current = map;
    }, []);

    const checkIntersection = useCallback((selRect: SelectionRect): Set<string> => {
        const selected = new Set<string>();
        desktopItemsRef.current.forEach((itemRect, id) => {
            const intersects = !(
                selRect.x + selRect.w < itemRect.left ||
                selRect.x > itemRect.right ||
                selRect.y + selRect.h < itemRect.top ||
                selRect.y > itemRect.bottom
            );
            if (intersects) selected.add(id);
        });
        return selected;
    }, []);

    const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        closeContextMenu();
        if ((e.target as HTMLElement).closest('[data-kapoor-context-menu="true"]')) return;
        if ((e.target as HTMLElement).closest('[data-no-select]')) return;
        if (e.button !== 0) return;

        setIsSelecting(true);
        startPos.current = { x: e.clientX, y: e.clientY };
        setSelectionRect(null);
        setSelectedItems(new Set());
    }, [closeContextMenu]);

    const handleMouseUp = useCallback(() => {
        setIsSelecting(false);
        startPos.current = null;
        setSelectionRect(null);
    }, []);

    const handleDesktopContextMenu = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        if ((e.target as HTMLElement).closest('[data-no-select]')) return;
        openContextMenu({ type: 'desktop', x: e.clientX, y: e.clientY });
    }, [openContextMenu]);

    const handleIconContextMenu = useCallback((id: string, x: number, y: number) => {
        openContextMenu({ type: 'icon', iconId: id, x, y });
    }, [openContextMenu]);

    useEffect(() => {
        if (!contextMenu) return;

        const handleDocumentDown = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.closest('[data-kapoor-context-menu="true"]')) return;
            closeContextMenu();
        };

        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeContextMenu();
        };

        const handleWindowChange = () => closeContextMenu();

        document.addEventListener('mousedown', handleDocumentDown);
        window.addEventListener('resize', handleWindowChange);
        window.addEventListener('blur', handleWindowChange);
        document.addEventListener('keydown', handleEsc);

        return () => {
            document.removeEventListener('mousedown', handleDocumentDown);
            window.removeEventListener('resize', handleWindowChange);
            window.removeEventListener('blur', handleWindowChange);
            document.removeEventListener('keydown', handleEsc);
        };
    }, [closeContextMenu, contextMenu]);

    const pasteFromClipboard = useCallback(() => {
        if (!clipboard || clipboard.items.length === 0) return;

        if (clipboard.mode === 'copy') {
            setDesktopItems((prev) => {
                const next = [...prev];
                clipboard.items.forEach((item) => {
                    const label = makeUniqueLabel(`${item.label} (Copy)`, next);
                    next.push({ ...item, id: `${item.id}-copy-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`, label });
                });
                return next;
            });
            setLayoutVersion((v) => v + 1);
            closeContextMenu();
            return;
        }

        const moving = new Set(clipboard.items.map((i) => i.id));
        setDesktopItems((prev) => {
            const kept = prev.filter((it) => !moving.has(it.id));
            const moved = prev.filter((it) => moving.has(it.id));
            return [...kept, ...moved];
        });
        setSelectedItems(new Set(Array.from(moving)));
        setCutItemIds(new Set());
        setClipboard(null);
        setLayoutVersion((v) => v + 1);
        closeContextMenu();
    }, [clipboard, closeContextMenu, makeUniqueLabel]);

    const handleFilesEmptyContextMenu = (path: string, x: number, y: number) => {
        setContextMenu({ type: 'filesEmpty', folderPath: path, x, y });
    };

    const handleFsRename = useCallback((oldName: string, kind: 'file' | 'folder', path: string) => {
        const next = window.prompt(`Rename ${kind}`, oldName);
        if (!next || !next.trim() || next === oldName) return;
        const newName = next.trim();
        const pathParts = path.split('/');
        const dirKey = pathParts[pathParts.length - 1];

        setFsData((prev) => {
            const currentItems = prev[dirKey] || [];
            if (currentItems.some(i => i.n === newName)) {
                alert("Name already exists");
                return prev;
            }
            const updatedItems = currentItems.map(i => i.n === oldName ? { ...i, n: newName } : i);
            return { ...prev, [dirKey]: updatedItems };
        });
    }, []);

    const handleFsDelete = useCallback((name: string, path: string) => {
        const pathParts = path.split('/');
        const dirKey = pathParts[pathParts.length - 1];
        setFsData((prev) => {
            const currentItems = prev[dirKey] || [];
            return { ...prev, [dirKey]: currentItems.filter(i => i.n !== name) };
        });
    }, []);

    const handleFsNewFolder = useCallback((path: string) => {
        const pathParts = path.split('/');
        const dirKey = pathParts[pathParts.length - 1];
        setFsData((prev) => {
            const currentItems = prev[dirKey] || [];
            const existing = currentItems.filter(i => i.dir && i.n.startsWith('New Folder')).length;
            const name = existing === 0 ? 'New Folder' : `New Folder ${existing + 1}`;
            return { ...prev, [dirKey]: [...currentItems, { n: name, icon: '📁', dir: true }], [name]: [] };
        });
    }, []);

    const handleFsPaste = useCallback((targetPath: string) => {
        if (!fsClipboard) return;
        const pathParts = targetPath.split('/');
        const targetDirKey = pathParts[pathParts.length - 1];

        setFsData((prev) => {
            const targetItems = prev[targetDirKey] || [];
            if (targetItems.some(i => i.n === fsClipboard.item.n)) {
                alert("Item already exists in target folder");
                return prev;
            }
            const nextItems = [...targetItems, fsClipboard.item];
            const nextData = { ...prev, [targetDirKey]: nextItems };

            if (fsClipboard.mode === 'cut') {
                const sourceDirKey = fsClipboard.sourcePath.split('/').pop() || "";
                if (nextData[sourceDirKey]) {
                    nextData[sourceDirKey] = nextData[sourceDirKey].filter(i => i.n !== fsClipboard.item.n);
                }
            }
            return nextData;
        });
        if (fsClipboard.mode === 'cut') setFsClipboard(null);
    }, [fsClipboard]);

    const handleFsOpen = useCallback((name: string, kind: 'file' | 'folder', path: string) => {
        if (kind === 'file') {
            const dirKey = path.split('/').pop() || "";
            const item = fsData[dirKey]?.find(i => i.n === name);

            if (name.endsWith('.txt') || name.endsWith('.md') || name.startsWith('.') || name.endsWith('.bashrc')) {
                const viewerWindow = windows.find(w => w.id === 'text-viewer');
                if (viewerWindow) {
                    window.dispatchEvent(new CustomEvent('editor-open-file', {
                        detail: { src: item?.src, fileName: name, path }
                    }));
                } else {
                    openApp('text-viewer', { src: item?.src, fileName: name, path });
                }
                setTimeout(() => focusApp('text-viewer'), 0);
            } else if (name.endsWith('.pdf')) {
                const viewerWindow = windows.find(w => w.id === 'pdf-viewer');
                if (viewerWindow) {
                    window.dispatchEvent(new CustomEvent('pdf-open-file', {
                        detail: { src: item?.src, fileName: name, path }
                    }));
                } else {
                    openApp('pdf-viewer', { src: item?.src, fileName: name, path });
                }
                setTimeout(() => focusApp('pdf-viewer'), 0);
            } else if (item?.src) {
                window.open(item.src, '_blank');
            }
        }
    }, [fsData, openApp, windows, focusApp]);

    const desktopMenuItems: MenuEntry[] = [
        {
            label: 'New Folder', shortcut: 'Shift+Ctrl+N', action: () => {
                const existing = desktopItems.filter((i) => i.kind === 'folder' && i.label.startsWith('New Folder')).length;
                const name = existing === 0 ? 'New Folder' : `New Folder ${existing + 1}`;
                const id = `folder-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`;
                setDesktopItems((prev) => [...prev, { id, icon: '📁', label: name, kind: 'folder' }]);
                setSelectedItems(new Set([id]));
                if (keepAligned) setLayoutVersion((v) => v + 1);
                closeContextMenu();
            }
        },
        { label: 'Paste', shortcut: 'Ctrl+V', disabled: !clipboard || clipboard.items.length === 0, action: pasteFromClipboard },
        { label: 'Select All', shortcut: 'Ctrl+A', action: () => { setSelectedItems(new Set(desktopItems.map((i) => i.id))); closeContextMenu(); } },
        { label: 'Properties', shortcut: 'Ctrl+I', action: () => { openDesktopProperties(); closeContextMenu(); } },
        { separator: true, label: 'sep-2' },
        {
            label: 'Organize Desktop by Name', action: () => {
                setDesktopItems((prev) => [...prev].sort((a, b) => a.label.localeCompare(b.label)));
                setLayoutVersion((v) => v + 1);
                closeContextMenu();
            }
        },
        { separator: true, label: 'sep-3' },
        { label: 'Open Terminal', shortcut: 'Ctrl+Alt+T', action: () => { openApp('terminal'); closeContextMenu(); } },
    ];

    const filesEmptyMenuItems = useMemo((): MenuEntry[] => {
        if (contextMenu?.type !== 'filesEmpty') return [];
        const path = contextMenu.folderPath || "";
        return [
            { label: 'New Folder', action: () => { handleFsNewFolder(path); closeContextMenu(); } },
            { label: 'New Document', action: () => closeContextMenu() },
            { separator: true, label: 'sep-1' },
            { label: 'Paste', disabled: !fsClipboard, action: () => { handleFsPaste(path); closeContextMenu(); } },
            { separator: true, label: 'sep-2' },
            { label: 'Select All', action: () => closeContextMenu() },
            { separator: true, label: 'sep-3' },
            {
                label: 'Properties', action: () => {
                    closeContextMenu();
                }
            },
        ];
    }, [contextMenu?.type, contextMenu?.folderPath, closeContextMenu, fsClipboard, handleFsNewFolder, handleFsPaste]);

    const iconMenuItems = useCallback((iconId: string): MenuEntry[] => {
        const item = desktopItems.find((it) => it.id === iconId);
        const selected = selectedItems.has(iconId) ? Array.from(selectedItems) : [iconId];
        const selectedCount = selected.length;
        const canRename = selectedCount === 1 && !!item;
        const targets = new Set(selected);
        const selectedItemsData = desktopItems.filter((it) => targets.has(it.id));
        return [
            { label: selectedCount > 1 ? `Open (${selectedCount} Items)` : 'Open', action: () => { selected.forEach((id) => openDesktopItem(id)); closeContextMenu(); } },
            ...(item && (item.kind === 'file' || item.kind === 'folder') ? [{ label: 'Open File Location', action: () => { openApp('files'); closeContextMenu(); } }] : []),
            { separator: true, label: 'sep-2' },
            {
                label: 'Cut', action: () => {
                    setClipboard({ mode: 'cut', items: selectedItemsData });
                    setCutItemIds(new Set(selected));
                    closeContextMenu();
                }
            },
            {
                label: 'Copy', action: () => {
                    setClipboard({ mode: 'copy', items: selectedItemsData });
                    setCutItemIds(new Set());
                    closeContextMenu();
                }
            },
            {
                label: 'Rename...', disabled: !canRename, action: () => {
                    if (!item) return;
                    const next = window.prompt('Rename item', item.label);
                    if (!next || !next.trim()) return;
                    setDesktopItems((prev) => prev.map((it) => it.id === item.id ? { ...it, label: next.trim() } : it));
                    if (keepAligned) setLayoutVersion((v) => v + 1);
                    closeContextMenu();
                }
            },
            {
                label: 'Move to Trash', danger: true, action: () => {
                    const targets = new Set(selected);
                    setDesktopItems((prev) => prev.filter((it) => !targets.has(it.id)));
                    setSelectedItems(new Set());
                    setCutItemIds((prev) => {
                        const next = new Set(prev);
                        targets.forEach((id) => next.delete(id));
                        return next;
                    });
                    setClipboard((prev) => {
                        if (!prev) return null;
                        const remaining = prev.items.filter((it) => !targets.has(it.id));
                        return remaining.length ? { ...prev, items: remaining } : null;
                    });
                    if (keepAligned) setLayoutVersion((v) => v + 1);
                    closeContextMenu();
                }
            },
            { separator: true, label: 'sep-3' },
            {
                label: 'Properties', action: () => {
                    openItemProperties(item ?? null, selectedCount);
                    closeContextMenu();
                }
            },
        ];
    }, [closeContextMenu, desktopItems, keepAligned, openApp, openDesktopItem, openItemProperties, selectedItems]);

    const fileItemMenuItems = useCallback((fileData: { name: string; kind: 'file' | 'folder'; path: string }): MenuEntry[] => {
        return [
            {
                label: 'Open',
                action: () => {
                    handleFsOpen(fileData.name, fileData.kind, fileData.path);
                    closeContextMenu();
                }
            },
            { label: 'Rename...', action: () => { handleFsRename(fileData.name, fileData.kind, fileData.path); closeContextMenu(); } },
            { separator: true, label: 'sep-1' },
            {
                label: 'Copy',
                action: () => {
                    const dirKey = fileData.path.split('/').pop() || "";
                    const item = fsData[dirKey]?.find(i => i.n === fileData.name);
                    if (item) setFsClipboard({ mode: 'copy', item, sourcePath: fileData.path });
                    closeContextMenu();
                }
            },
            {
                label: 'Cut',
                action: () => {
                    const dirKey = fileData.path.split('/').pop() || "";
                    const item = fsData[dirKey]?.find(i => i.n === fileData.name);
                    if (item) setFsClipboard({ mode: 'cut', item, sourcePath: fileData.path });
                    closeContextMenu();
                }
            },
            {
                label: 'Move to Trash',
                danger: true,
                action: () => {
                    handleFsDelete(fileData.name, fileData.path);
                    closeContextMenu();
                }
            },
            { separator: true, label: 'sep-2' },
            {
                label: 'Properties',
                action: () => {
                    handleFilesAppProperties(fileData.name, fileData.kind, fileData.path);
                    closeContextMenu();
                }
            },
        ];
    }, [closeContextMenu, handleFsOpen, handleFsRename, handleFsDelete, fsData, handleFilesAppProperties]);

    useEffect(() => {
        const handleGlobalContextMenu = (e: MouseEvent) => {
            e.preventDefault();
        };
        window.addEventListener('contextmenu', handleGlobalContextMenu);
        return () => window.removeEventListener('contextmenu', handleGlobalContextMenu);
    }, []);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            const key = e.key.toLowerCase();

            // Terminal Shortcut: Ctrl+Alt+T or Ctrl+Alt+C
            if (e.ctrlKey && e.altKey && (key === 't' || key === 'c')) {
                e.preventDefault();
                openApp('terminal');
                return;
            }

            // Search/Activities: Meta/OS key
            if (key === 'meta' || key === 'os') {
                e.preventDefault();
                requestToggleSearch('apps');
                return;
            }

            // Selection: Select All (Ctrl+A)
            if (e.ctrlKey && key === 'a') {
                if (!focusedAppId) {
                    e.preventDefault();
                    setSelectedItems(new Set(desktopItems.map(i => i.id)));
                } else if (focusedAppId === 'files') {
                    // Logic for select all in files could be added if needed
                    // For now, let's keep it simple
                }
                return;
            }

            // Copy/Cut/Paste
            if (e.ctrlKey) {
                if (key === 'c') {
                    if (!focusedAppId) {
                        const selected = Array.from(selectedItems);
                        const selectedData = desktopItems.filter(it => selected.includes(it.id));
                        if (selectedData.length > 0) {
                            setClipboard({ mode: 'copy', items: selectedData });
                            setCutItemIds(new Set());
                        }
                    } else if (focusedAppId === 'files' && fsSelectedName) {
                        const item = fsData[fsPath]?.find(i => i.n === fsSelectedName);
                        if (item) setFsClipboard({ mode: 'copy', item, sourcePath: `/home/kapoor/${fsPath}` });
                    }
                } else if (key === 'x') {
                    if (!focusedAppId) {
                        const selected = Array.from(selectedItems);
                        const selectedData = desktopItems.filter(it => selected.includes(it.id));
                        if (selectedData.length > 0) {
                            setClipboard({ mode: 'cut', items: selectedData });
                            setCutItemIds(new Set(selected));
                        }
                    } else if (focusedAppId === 'files' && fsSelectedName) {
                        const item = fsData[fsPath]?.find(i => i.n === fsSelectedName);
                        if (item) setFsClipboard({ mode: 'cut', item, sourcePath: `/home/kapoor/${fsPath}` });
                    }
                } else if (key === 'v') {
                    if (!focusedAppId && clipboard && clipboard.items.length > 0) {
                        e.preventDefault();
                        pasteFromClipboard();
                    } else if (focusedAppId === 'files' && fsClipboard) {
                        e.preventDefault();
                        handleFsPaste(`/home/kapoor/${fsPath}`);
                    }
                }
            }

            // New Folder: Ctrl+Shift+N
            if (e.ctrlKey && e.shiftKey && key === 'n') {
                if (!focusedAppId) {
                    e.preventDefault();
                    const existing = desktopItems.filter((i) => i.kind === 'folder' && i.label.startsWith('New Folder')).length;
                    const name = existing === 0 ? 'New Folder' : `New Folder ${existing + 1}`;
                    const id = `folder-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`;
                    setDesktopItems((prev) => [...prev, { id, icon: '📁', label: name, kind: 'folder' }]);
                    setSelectedItems(new Set([id]));
                } else if (focusedAppId === 'files') {
                    e.preventDefault();
                    handleFsNewFolder(`/home/kapoor/${fsPath}`);
                }
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [openApp, requestToggleSearch, focusedAppId, selectedItems, desktopItems, clipboard, pasteFromClipboard, fsSelectedName, fsData, fsPath, fsClipboard, handleFsPaste, handleFsNewFolder]);

    useEffect(() => {
        if (!isSelecting) return;

        const handleDocumentMouseMove = (e: MouseEvent) => {
            if (!startPos.current) return;

            const currentX = e.clientX;
            const currentY = e.clientY;
            const x = Math.min(startPos.current.x, currentX);
            const y = Math.min(startPos.current.y, currentY);
            const w = Math.abs(currentX - startPos.current.x);
            const h = Math.abs(currentY - startPos.current.y);

            const rect: SelectionRect = { x, y, w, h };
            setSelectionRect(rect);
            setSelectedItems(checkIntersection(rect));
        };

        const handleDocumentMouseUp = () => {
            setIsSelecting(false);
            startPos.current = null;
            setSelectionRect(null);
        };

        document.addEventListener('mousemove', handleDocumentMouseMove);
        document.addEventListener('mouseup', handleDocumentMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleDocumentMouseMove);
            document.removeEventListener('mouseup', handleDocumentMouseUp);
        };
    }, [isSelecting, checkIntersection]);

    const renderAppContent = (id: string, winProps: Record<string, unknown> | undefined, closeApp: (id: string) => void, onOpenProperties?: (name: string, kind: 'file' | 'folder', path: string) => void) => {
        switch (id) {
            case 'terminal': return <TerminalApp onClose={() => closeApp('terminal')} />;
            case 'about': return <AboutApp />;
            case 'resume': return <ResumeApp />;
            case 'projects': return <ProjectsApp />;
            case 'extracurricular': return <ExtracurricularApp />;
            case 'experience': return <ExperienceApp />;
            case 'calendar': return <CalendarApp />;
            case 'files': return (
                <FilesApp
                    files={fsData}
                    path={fsPath}
                    onPathChange={setFsPath}
                    selectedName={fsSelectedName}
                    onSelectionChange={setFsSelectedName}
                    onContextMenu={(name, kind, path, x, y) => {
                        handleFileItemContextMenu(name, kind, path, x, y);
                    }}
                    onEmptyContextMenu={(path, x, y) => {
                        handleFilesEmptyContextMenu(path, x, y);
                    }}
                    onOpenItem={handleFsOpen}
                />
            );
            case 'settings': return <SettingsApp />;
            case 'text-viewer': return (
                <TextViewerApp
                    src={winProps?.src as string | undefined}
                    fileName={winProps?.fileName as string | undefined}
                    path={winProps?.path as string | undefined}
                    onOpenProperties={onOpenProperties}
                />
            );
            case 'pdf-viewer': return (
                <PdfViewerApp
                    src={winProps?.src as string | undefined}
                    fileName={winProps?.fileName as string | undefined}
                    path={winProps?.path as string | undefined}
                    onOpenProperties={onOpenProperties}
                />
            );
            default: return null;
        }
    };

    if (screen === 'shutdown') return <ShutdownScreen mode="shutdown" onPowerOn={() => setScreen('boot')} />;
    if (screen === 'restart') return <ShutdownScreen mode="restart" onPowerOn={() => setScreen('boot')} />;
    if (screen === 'boot') return <BootScreen onDone={() => setScreen('desktop')} />;
    if (screen === 'lock') return <LockScreen onUnlock={doUnlock} />;

    const openIds = windows.map((w: { id: string; minimized: boolean }) => w.id);
    const minIds = windows.filter((w: { id: string; minimized: boolean }) => w.minimized).map((w: { id: string; minimized: boolean }) => w.id);

    return (
        <div
            className="fixed inset-0 overflow-hidden"
            style={{ background: 'radial-gradient(ellipse at 20% 50%, #4a1020 0%, #2d0a1e 45%, #1a0510 100%)' }}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onContextMenu={handleDesktopContextMenu}
        >
            <div className="absolute pointer-events-none" style={{ width: 500, height: 500, borderRadius: '50%', top: '25%', left: '55%', background: 'radial-gradient(circle, rgba(233,84,32,0.10), transparent)' }} />

            {/* Global Brightness Overlay — Floor at 0.8 to keep screen readable */}
            <div
                className="fixed inset-0 z-[8000] pointer-events-none bg-black"
                style={{ opacity: 'calc((1 - var(--system-brightness, 1)) * 0.8)' }}
            />

            <TopBar
                onLock={doLock}
                onRestart={doRestart}
                onPowerOff={doPowerOff}
                onOpenSettings={() => openApp('settings')}
                onToggleSearch={() => requestToggleSearch('activities')}
                isSelecting={isSelecting}
            />
            <DesktopIcons
                items={desktopItems}
                onOpen={openDesktopItem}
                selectedItems={selectedItems}
                onSelectionChange={setSelectedItems}
                onIconContextMenu={handleIconContextMenu}
                onRegister={handleRegistrationRequest}
                layoutVersion={layoutVersion}
                dimmedItems={cutItemIds}
            />

            <SelectionRectangle rect={selectionRect} />

            {windows.map((winState: WindowState, idx: number) => {
                const def = WIN_DEFAULTS[winState.id] ?? { w: 640, h: 480, title: winState.id };
                const stagger = idx * 24;
                return (
                    <AppWindow
                        key={winState.id} id={winState.id} title={def.title}
                        icon={APP_ICONS[winState.id] ?? null}
                        onClose={() => closeApp(winState.id)}
                        onMinimize={() => minimizeApp(winState.id)}
                        onRectChange={(r) => updateWindowRect(winState.id, r)}
                        onFocus={() => focusApp(winState.id)}
                        focused={focusedAppId === winState.id}
                        minimized={winState.minimized}
                        defaultW={def.w} defaultH={def.h}
                        startX={80 + stagger} startY={52 + stagger}
                    >
                        {renderAppContent(winState.id, winState.props, closeApp, handleFilesAppProperties)}
                    </AppWindow>
                );
            })}

            <Dock onOpen={openApp} onToggleSearch={() => requestToggleSearch('apps')} openApps={openIds} minimizedApps={minIds} shouldHide={isDockOverlapped} isSelecting={isSelecting} />

            {showSearch && (
                <SearchOverlay
                    onClose={closeSearch}
                    onOpenApp={openDesktopItem}
                    onFocusApp={focusApp}
                    windows={windows}
                    windowRects={windowRects}
                    mode={searchMode}
                />
            )}

            {contextMenu && (
                <KapoorContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    items={
                        contextMenu.type === 'desktop' ? desktopMenuItems :
                            contextMenu.type === 'icon' ? iconMenuItems(contextMenu.iconId ?? 'files') :
                                contextMenu.type === 'filesEmpty' ? filesEmptyMenuItems :
                                    contextMenu.fileData ? fileItemMenuItems(contextMenu.fileData) : []
                    }
                />
            )}

            {propertiesData && <div className="z-[9999] relative"><PropertiesWindow data={propertiesData} onClose={() => setPropertiesData(null)} /></div>}

            {simpleModeOpen && (
                <SimplePortfolio onClose={() => setSimpleModeOpen(false)} />
            )}
        </div>
    );
}
