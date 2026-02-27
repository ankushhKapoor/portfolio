'use client';

import { useState } from 'react';
import { CloseIcon } from '@/components/Icons';

export interface PropertiesData {
    title: string;
    name: string;
    kind: 'desktop' | 'app' | 'folder' | 'file' | 'multi';
    typeLabel: string;
    mime: string;
    sizeLabel: string;
    parent: string;
    accessed: string;
    modified: string;
    created?: string;
    permissions: string;
    owner: string;
    group: string;
    openWith: string;
    icon?: string | React.ReactNode;
    freeSpace?: string;
}

interface Props {
    data: PropertiesData;
    onClose: () => void;
}

export default function PropertiesWindow({ data, onClose }: Props) {
    const [activeTab, setActiveTab] = useState<'basic' | 'permissions' | 'openWith'>('basic');

    const tabs = [
        { id: 'basic', label: 'Basic' },
        { id: 'permissions', label: 'Permissions' },
        { id: 'openWith', label: 'Open With' },
    ] as const;

    return (
        <div
            className="fixed inset-0 z-[9500] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[1px] animate-fade-in-scale"
            onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); }}
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-[480px] overflow-hidden shadow-2xl transition-all flex flex-col"
                style={{
                    background: '#383838',
                    border: '1px solid rgba(0, 0, 0, 0.4)',
                    borderRadius: '8px',
                    boxShadow: '0 15px 40px rgba(0,0,0,0.6)',
                    fontFamily: "'Ubuntu', sans-serif",
                    color: '#eeeeee'
                }}
            >
                {/* Header / Title Bar */}
                <div
                    className="flex items-center justify-between px-3 h-10 border-b border-black/20"
                    style={{ background: '#2d2d2d' }}
                >
                    <div className="flex-1" />
                    <h2 className="text-[14px] font-bold text-white/90 truncate max-w-[300px]">
                        {data.name} Properties
                    </h2>
                    <div className="flex-1 flex justify-end">
                        <button
                            onClick={onClose}
                            className="w-6 h-6 flex items-center justify-center rounded-full bg-[#c7162b] hover:bg-[#e01b31] transition-colors text-white shadow-sm"
                        >
                            <CloseIcon size={10} />
                        </button>
                    </div>
                </div>

                {/* Tab Bar */}
                <div className="flex border-b border-black/20" style={{ background: '#353535' }}>
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 py-2.5 text-[13px] font-medium transition-all relative ${activeTab === tab.id
                                ? 'bg-[#383838] text-white'
                                : 'text-white/40 hover:text-white/60 hover:bg-white/5'
                                }`}
                            style={{
                                borderRight: '1px solid rgba(0,0,0,0.1)',
                                borderTop: activeTab === tab.id ? '2px solid #e95420' : '2px solid transparent'
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="p-6 min-h-[320px]">
                    {activeTab === 'basic' && (
                        <div className="space-y-6">
                            {/* Top info section: Icon on left, fields on right */}
                            <div className="flex gap-6">
                                <div
                                    className="w-24 h-24 rounded-lg flex items-center justify-center text-6xl flex-shrink-0"
                                    style={{
                                        background: '#f6f6f6',
                                        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)',
                                        border: '1px solid rgba(0,0,0,0.1)'
                                    }}
                                >
                                    {typeof data.icon === 'string' ? (
                                        <span className="filter drop-shadow-md">{data.icon}</span>
                                    ) : (
                                        data.icon || (data.kind === 'folder' ? '📁' : '📄')
                                    )}
                                </div>

                                <div className="flex-1 space-y-3">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[13px] text-white/40">Name:</label>
                                        <div className="bg-[#2d2d2d] border border-black/30 rounded px-2 py-1 text-[13px] text-white/90 focus-within:border-[#e95420] outline-none">
                                            {data.name}
                                        </div>
                                    </div>
                                    <div className="flex items-baseline gap-4">
                                        <label className="text-[13px] text-white/40 w-12">Type:</label>
                                        <span className="text-[13px] text-[#e95420]">{data.typeLabel} ({data.mime})</span>
                                    </div>
                                    <div className="flex items-baseline gap-4">
                                        <label className="text-[13px] text-white/40 w-12">Size:</label>
                                        <span className="text-[13px] text-white/80">{data.sizeLabel}</span>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-white/5" />

                            {/* Middle section: Location */}
                            <div className="space-y-4">
                                <div className="flex items-baseline gap-4">
                                    <label className="text-[13px] text-white/40 w-24">Parent Folder:</label>
                                    <span className="text-[13px] text-white/80 font-mono">{data.parent}</span>
                                </div>
                            </div>

                            <hr className="border-white/5" />

                            {/* Bottom section: Times */}
                            <div className="space-y-3">
                                <div className="flex items-baseline gap-4">
                                    <label className="text-[13px] text-white/40 w-24">Accessed:</label>
                                    <span className="text-[13px] text-white/80">{data.accessed}</span>
                                </div>
                                <div className="flex items-baseline gap-4">
                                    <label className="text-[13px] text-white/40 w-24">Modified:</label>
                                    <span className="text-[13px] text-white/80">{data.modified}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'permissions' && (
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <h3 className="text-[11px] font-bold text-[#e95420] uppercase tracking-wider">Ownership</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-[13px]">
                                        <span className="text-white/40">Owner:</span>
                                        <span className="text-white/80">{data.owner}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-[13px]">
                                        <span className="text-white/40">Group:</span>
                                        <span className="text-white/80">{data.group}</span>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-white/5" />

                            <div className="space-y-4">
                                <h3 className="text-[11px] font-bold text-[#e95420] uppercase tracking-wider">Access Rights</h3>
                                <div className="bg-[#2d2d2d] rounded-lg border border-black/20 overflow-hidden">
                                    <div className="px-4 py-3 flex items-center justify-between text-[13px] border-b border-white/5">
                                        <span className="text-white/80">Permissions</span>
                                        <span className="text-[#e95420]">{data.permissions}</span>
                                    </div>
                                    <div className="px-4 py-3 flex items-center justify-between text-[13px]">
                                        <span className="text-white/40 italic">Allow executing file as program</span>
                                        <div className={`w-5 h-5 rounded border border-white/10 flex items-center justify-center ${data.kind === 'app' ? 'bg-[#e95420] border-none' : ''}`}>
                                            {data.kind === 'app' && <span className="text-[10px] text-white">✓</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'openWith' && (
                        <div className="space-y-4">
                            <h3 className="text-[13px] text-white/60">Select an application to open <span className="text-white/90 font-bold">{data.name}</span>:</h3>
                            <div className="bg-[#2d2d2d] rounded-lg border border-black/20 max-h-48 overflow-y-auto">
                                <div className="px-4 py-3 flex items-center gap-3 bg-[#e95420]/10 border-l-2 border-[#e95420]">
                                    <span className="text-lg">⚙️</span>
                                    <div className="flex flex-col">
                                        <span className="text-[13px] text-white font-medium">{data.openWith} (default)</span>
                                        <span className="text-[11px] text-white/40 italic">System recommended</span>
                                    </div>
                                </div>
                                <div className="px-4 py-3 flex items-center gap-3 hover:bg-white/5 cursor-pointer opacity-50">
                                    <span className="text-lg">📄</span>
                                    <span className="text-[13px] text-white/80">Text Editor</span>
                                </div>
                            </div>
                            <div className="flex justify-end pt-4">
                                <button className="px-4 py-1.5 rounded bg-white/5 border border-white/10 text-[13px] hover:bg-white/10 transition-colors">
                                    Reset
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-[#2d2d2d] border-t border-black/20 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-8 py-1.5 rounded text-[13px] font-medium bg-[#f0f0f0] text-[#333] hover:bg-white transition-all shadow-sm active:scale-95"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
