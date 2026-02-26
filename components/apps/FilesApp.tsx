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

const FILE_ICONS: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
    '📁': FolderIcon, '📄': FileIcon, '📋': FileIcon, '💿': FileIcon, '📦': FileIcon, '💼': FolderIcon,
};

const MONO = "'Ubuntu Mono', monospace";

export default function FilesApp() {
    const [path, setPath] = useState<PathKey>('Home');
    const items = FILES[path] ?? [];

    return (
        <div className="flex-1 flex overflow-hidden" style={{ fontFamily: MONO }}>
            {/* Sidebar */}
            <div className="flex-shrink-0 overflow-y-auto py-3 flex flex-col gap-0.5"
                style={{ width: 176, background: '#1e1e1e', borderRight: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="px-4 pb-2 text-[11px] font-bold uppercase tracking-widest" style={{ color: '#555' }}>Places</div>
                {SIDEBAR.map(({ key, label, Icon }) => (
                    <button key={key} onClick={() => setPath(key)}
                        className="flex items-center gap-2.5 px-4 py-2 w-full border-0 cursor-pointer text-left text-[13px] transition-colors"
                        style={{
                            background: path === key ? 'rgba(233,84,32,0.18)' : 'transparent',
                            color: path === key ? '#fff' : '#999',
                            borderLeft: path === key ? '2px solid #e95420' : '2px solid transparent',
                            fontFamily: MONO,
                        }}>
                        <Icon size={16} color={path === key ? '#e95420' : '#666'} />
                        {label}
                    </button>
                ))}
            </div>

            {/* Main */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Toolbar */}
                <div className="flex items-center gap-2 px-4 flex-shrink-0"
                    style={{ height: 40, background: '#2a2a2a', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    {path !== 'Home' && (
                        <button onClick={() => setPath('Home')}
                            className="text-[13px] px-2 py-0.5 rounded border-0 cursor-pointer transition-colors hover:bg-white/10"
                            style={{ color: '#e95420', fontFamily: MONO }}>← Back</button>
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
                        return (
                            <FileItem key={i} name={f.n} IconComp={IconComp} iconColor={iconColor}
                                onOpen={() => { if (f.dir && FILES[f.n as PathKey]) setPath(f.n as PathKey); }} />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

function FileItem({ name, IconComp, iconColor, onOpen }: { name: string; IconComp: React.ComponentType<{ size?: number; color?: string }>; iconColor: string; onOpen: () => void }) {
    const [hov, setHov] = useState(false);
    return (
        <div onDoubleClick={onOpen} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
            className="flex flex-col items-center gap-1.5 px-2 py-3 rounded-xl cursor-default select-none transition-colors"
            style={{ width: 86, background: hov ? 'rgba(255,255,255,0.07)' : 'transparent' }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: hov ? 'rgba(255,255,255,0.05)' : 'transparent' }}>
                <IconComp size={32} color={iconColor} />
            </div>
            <span className="text-[11px] text-center break-all leading-tight" style={{ color: '#ccc', fontFamily: "'Ubuntu Mono', monospace" }}>{name}</span>
        </div>
    );
}
