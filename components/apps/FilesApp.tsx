'use client';

import { useState } from 'react';
import { FILES } from '@/lib/portfolio';
import { HomeIcon, FileTextIcon, DownloadIcon, BriefcaseIcon, FolderIcon, FileIcon } from '@/components/Icons';

type PathKey = keyof typeof FILES;
const SIDEBAR: { key: PathKey; label: string; Icon: React.ComponentType<{ size?: number; color?: string }> }[] = [
    { key: 'Home', label: 'Home', Icon: HomeIcon },
    { key: 'Documents', label: 'Documents', Icon: FileTextIcon },
    { key: 'Downloads', label: 'Downloads', Icon: DownloadIcon },
    { key: 'Projects', label: 'Projects', Icon: BriefcaseIcon },
];

const MONO = "'Ubuntu Mono', monospace";

interface FilesAppProps {
    files: Record<string, { n: string; icon: string; dir?: boolean }[]>;
    path: string;
    onPathChange: (path: string) => void;
    selectedName: string | null;
    onSelectionChange: (name: string | null) => void;
    onContextMenu?: (name: string, kind: 'file' | 'folder', path: string, x: number, y: number) => void;
    onEmptyContextMenu?: (path: string, x: number, y: number) => void;
    onOpenItem?: (name: string, kind: 'file' | 'folder', path: string) => void;
}

export default function FilesApp({ files, path, onPathChange, selectedName, onSelectionChange, onContextMenu, onEmptyContextMenu, onOpenItem }: FilesAppProps) {
    const items = files[path] ?? [];

    const handleItemClick = (e: React.MouseEvent, name: string) => {
        e.stopPropagation();
        onSelectionChange(selectedName === name ? null : name);
    };

    const handleGridClick = () => {
        onSelectionChange(null);
    };

    const handleGridContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onSelectionChange(null);
        if (onEmptyContextMenu) {
            onEmptyContextMenu(`/home/kapoor/${path}`, e.clientX, e.clientY);
        }
    };

    const handleItemContextMenu = (e: React.MouseEvent, name: string, kind: 'file' | 'folder') => {
        e.preventDefault();
        e.stopPropagation();
        onSelectionChange(name);
        if (onContextMenu) {
            onContextMenu(name, kind, `/home/kapoor/${path}`, e.clientX, e.clientY);
        }
    };

    return (
        <div className="flex-1 flex overflow-hidden" style={{ fontFamily: MONO }} onClick={handleGridClick} onContextMenu={handleGridContextMenu}>
            {/* Sidebar */}
            <div className="flex-shrink-0 overflow-y-auto py-3 flex flex-col gap-0.5"
                style={{ width: 176, background: '#1e1e1e', borderRight: '1px solid rgba(255,255,255,0.07)' }}
                onClick={(e) => e.stopPropagation()}
                onContextMenu={(e) => e.preventDefault()}
            >
                <div className="px-4 pb-2 text-[11px] font-bold uppercase tracking-widest" style={{ color: '#555' }}>Places</div>
                {SIDEBAR.map(({ key, label, Icon }) => (
                    <button
                        key={key}
                        onClick={() => { onPathChange(key); onSelectionChange(null); }}
                        className={`flex items-center gap-2.5 w-full px-3 py-1.5 rounded-lg border-0 cursor-pointer text-left transition-colors ${path === key ? 'bg-[#e954201a] text-[#e95420]' : 'hover:bg-[#ffffff0d] text-[#ffffffbf]'}`}
                        style={{ fontFamily: MONO, fontSize: 13 }}
                    >
                        <Icon size={16} color={path === key ? '#e95420' : '#666'} />
                        {label}
                    </button>
                ))}
            </div>

            {/* Main */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Toolbar */}
                <div className="flex items-center gap-2 px-4 flex-shrink-0"
                    style={{ height: 40, background: '#2a2a2a', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
                    onContextMenu={(e) => e.preventDefault()}
                >
                    {path !== 'Home' && (
                        <button className="p-1.5 rounded-full hover:bg-[#ffffff0d] transition-colors" onClick={() => { onPathChange('Home'); onSelectionChange(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff' }}>
                            <FolderIcon size={16} />
                        </button>
                    )}
                    <div className="flex items-center gap-1.5 text-[13px]" style={{ color: '#666' }}>
                        <span style={{ color: path !== 'Home' ? '#888' : '#e95420' }}>Home</span>
                        {path !== 'Home' && <><span>›</span><span style={{ color: '#e95420' }}>{path}</span></>}
                    </div>
                </div>

                {/* File grid */}
                <div className="flex-1 overflow-y-auto p-4 flex flex-wrap gap-1 content-start">
                    {items.map((f, i) => {
                        const IconComp = f.dir ? FolderIcon : FileIcon;
                        const iconColor = f.dir ? '#e95420' : '#888';
                        const isSelected = selectedName === f.n;
                        return (
                            <FileItem
                                key={i}
                                name={f.n}
                                IconComp={IconComp}
                                iconColor={iconColor}
                                isSelected={isSelected}
                                onClick={(e) => handleItemClick(e, f.n)}
                                onContextMenu={(e) => handleItemContextMenu(e, f.n, f.dir ? 'folder' : 'file')}
                                onOpen={() => {
                                    if (f.dir && files[f.n]) {
                                        onPathChange(f.n);
                                        onSelectionChange(null);
                                    } else if (onOpenItem) {
                                        onOpenItem(f.n, f.dir ? 'folder' : 'file', `/home/kapoor/${path}`);
                                    }
                                }}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

interface FileItemProps {
    name: string;
    IconComp: React.ComponentType<{ size?: number; color?: string }>;
    iconColor: string;
    isSelected: boolean;
    onOpen: () => void;
    onClick: (e: React.MouseEvent) => void;
    onContextMenu: (e: React.MouseEvent) => void;
}

function FileItem({ name, IconComp, iconColor, isSelected, onOpen, onClick, onContextMenu }: FileItemProps) {
    const [hov, setHov] = useState(false);

    return (
        <div
            onDoubleClick={onOpen}
            onClick={onClick}
            onContextMenu={onContextMenu}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            className="flex flex-col items-center gap-1.5 px-2 py-3 rounded cursor-default select-none transition-all"
            style={{
                width: 90,
                background: isSelected ? 'rgba(233, 84, 32, 0.3)' : hov ? 'rgba(255,255,255,0.07)' : 'transparent',
                outline: isSelected ? '1px solid rgba(233, 84, 32, 0.5)' : 'none',
            }}
        >
            <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
                <IconComp size={38} color={iconColor} />
            </div>
            <span
                className="text-[11px] text-center w-full break-all leading-tight line-clamp-2 px-1 rounded"
                style={{
                    color: isSelected ? '#fff' : '#ccc',
                    fontFamily: "'Ubuntu', sans-serif",
                }}
            >
                {name}
            </span>
        </div>
    );
}
