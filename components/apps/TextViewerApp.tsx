'use client';
import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { Search, Download, Menu, FileText, X } from 'lucide-react';

interface TextViewerAppProps {
    src?: string;
    fileName?: string;
    path?: string;
    onOpenProperties?: (name: string, kind: 'file' | 'folder', path: string) => void;
}

interface OpenFile {
    id: string;
    fileName: string;
    src: string;
    path: string;
    content: string;
    loading: boolean;
}

const TextViewerApp: React.FC<TextViewerAppProps> = ({ src: initialSrc, fileName: initialFileName, path: initialPath, onOpenProperties }) => {
    const [files, setFiles] = useState<OpenFile[]>([]);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [showSearch, setShowSearch] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const hasInitialized = useRef(false);
    const contentRef = useRef<HTMLDivElement>(null);

    const loadFileContent = useCallback((fileId: string, fileSrc: string) => {
        const fetchUrl = fileSrc.startsWith('.') || fileSrc.includes('/.') ? `/api/read?path=${encodeURIComponent(fileSrc)}` : fileSrc;

        fetch(fetchUrl)
            .then(res => {
                if (!res.ok) throw new Error(`Failed to load: ${res.status}`);
                return res.text();
            })
            .then(data => {
                setFiles(prev => prev.map(f => f.id === fileId ? { ...f, content: data, loading: false } : f));
            })
            .catch(err => {
                console.error('Failed to load file:', err);
                setFiles(prev => prev.map(f => f.id === fileId ? { ...f, content: `Error: Unable to load file.\n\n${err.message}`, loading: false } : f));
            });
    }, []);

    const openNewFile = useCallback((name: string, fileSrc: string, filePath: string) => {
        const fileId = `${name}-${Date.now()}`;

        setFiles(prev => {
            const existing = prev.find(f => f.src === fileSrc);
            if (existing) {
                setActiveId(existing.id);
                return prev;
            }

            const newFile: OpenFile = {
                id: fileId,
                fileName: name,
                src: fileSrc,
                path: filePath,
                content: '',
                loading: true,
            };
            setActiveId(fileId);
            loadFileContent(fileId, fileSrc);
            return [...prev, newFile];
        });
    }, [loadFileContent]);

    // Handle initial file from props
    useEffect(() => {
        if (initialFileName && !hasInitialized.current) {
            openNewFile(initialFileName, initialSrc || '', initialPath || '');
            hasInitialized.current = true;
        }
    }, [initialFileName, initialSrc, initialPath, openNewFile]);

    // Listen for global 'editor-open-file' events
    useEffect(() => {
        const handleGlobalOpenFile = (e: any) => {
            const { src, fileName, path } = e.detail;
            if (fileName) openNewFile(fileName, src || '', path || '');
        };
        window.addEventListener('editor-open-file', handleGlobalOpenFile);
        return () => window.removeEventListener('editor-open-file', handleGlobalOpenFile);
    }, [openNewFile]);

    const activeFile = useMemo(() => files.find(f => f.id === activeId), [files, activeId]);

    const handleDownload = useCallback(() => {
        if (!activeFile?.src) return;
        const link = document.createElement('a');
        link.href = activeFile.src;
        link.download = activeFile.fileName || 'document.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setShowMenu(false);
    }, [activeFile]);

    const handleProperties = useCallback(() => {
        if (activeFile && onOpenProperties) {
            onOpenProperties(activeFile.fileName, 'file', activeFile.path);
            setShowMenu(false);
        }
    }, [activeFile, onOpenProperties]);

    const toggleSearch = () => {
        setShowSearch(prev => {
            if (prev) setSearchText('');
            return !prev;
        });
        setShowMenu(false);
    };

    const toggleMenu = () => setShowMenu(!showMenu);

    const closeTab = (fileId: string) => {
        setFiles(prev => {
            const nextFiles = prev.filter(f => f.id !== fileId);
            if (activeId === fileId) {
                setActiveId(nextFiles[nextFiles.length - 1]?.id || null);
            }
            return nextFiles;
        });
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Search Logic
    const highlightedContent = useMemo(() => {
        if (!activeFile?.content) return null;
        if (!searchText.trim() || !showSearch) return activeFile.content;

        try {
            const escapedSearch = searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`(${escapedSearch})`, 'gi');
            const parts = activeFile.content.split(regex);

            return parts.map((part, i) =>
                regex.test(part) ? <mark key={i} className="bg-[#e95420] text-white rounded-[2px]">{part}</mark> : part
            );
        } catch (e) {
            return activeFile.content;
        }
    }, [activeFile?.content, searchText, showSearch]);

    if (files.length === 0) {
        return (
            <div className="flex flex-col h-full bg-[#3d3d3d] text-white font-sans overflow-hidden select-none items-center justify-center">
                <FileText size={64} className="opacity-50 mb-4" />
                <p className="text-[#aaa]">No file open</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-[#3d3d3d] text-white font-sans overflow-hidden">
            {/* Tabs Bar */}
            <div className="flex items-center bg-[#333333] border-b border-[#2d2d2d] flex-nowrap z-[60] shadow-sm h-10">
                <div className="flex items-center overflow-x-auto custom-scrollbar-horizontal flex-1 h-full">
                    {files.map(file => (
                        <div
                            key={file.id}
                            onClick={() => setActiveId(file.id)}
                            className={`flex items-center gap-2 pl-4 pr-6 h-full cursor-pointer transition-all whitespace-nowrap flex-shrink-0 min-w-[140px] max-w-[220px] border-r border-[#2d2d2d] group relative ${activeId === file.id
                                ? 'bg-[#454545] text-white'
                                : 'bg-[#333333] text-[#aaa] hover:bg-[#3d3d3d] hover:text-[#ccc]'
                                }`}
                        >
                            <FileText size={14} className={activeId === file.id ? 'text-[#e95420]' : 'text-gray-500'} />
                            <span className="text-xs font-medium truncate flex-1">{file.fileName}</span>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    closeTab(file.id);
                                }}
                                className={`rounded p-0.5 transition-colors mr-1 ${activeId === file.id ? 'hover:bg-[#555] text-white' : 'opacity-0 group-hover:opacity-100 hover:bg-[#444] text-[#888]'}`}
                            >
                                <X size={12} />
                            </button>
                            {activeId === file.id && (
                                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#e95420]" />
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex items-center gap-3 flex-shrink-0 px-2 h-full">
                    <button
                        onClick={toggleSearch}
                        className={`p-1.5 rounded-md transition-colors cursor-pointer outline-none ${showSearch ? 'bg-[#e95420] text-white' : 'hover:bg-[#555]'}`}
                        title="Search"
                    >
                        <Search size={16} />
                    </button>

                    <button
                        onClick={handleDownload}
                        className="p-1.5 hover:bg-[#555] rounded-md transition-colors cursor-pointer outline-none"
                        title="Download"
                    >
                        <Download size={16} />
                    </button>

                    <div className="w-[1px] h-4 bg-[#555] mx-1" />

                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={toggleMenu}
                            className={`p-1.5 rounded-md transition-colors cursor-pointer outline-none ${showMenu ? 'bg-[#555]' : 'hover:bg-[#555]'}`}
                            title="Menu"
                        >
                            <Menu size={16} />
                        </button>

                        {showMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-[#4a4a4a] border border-[#333] rounded-md shadow-xl py-1 z-[100] animate-in fade-in zoom-in duration-150">
                                <button
                                    onClick={handleProperties}
                                    className="w-full text-left px-4 py-2 text-sm hover:bg-[#e95420] flex items-center gap-2 transition-colors"
                                >
                                    <FileText size={14} />
                                    Properties
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            {showSearch && (
                <div className="bg-[#4a4a4a] border-b border-[#2d2d2d] px-4 py-2 flex items-center gap-2 animate-in slide-in-from-top duration-200">
                    <div className="relative flex-1 max-w-md flex items-center">
                        <input
                            type="text"
                            placeholder="Find..."
                            className="w-full bg-[#333] border border-[#555] rounded px-3 py-1 text-sm outline-none focus:border-[#e95420] placeholder:text-[#888] text-white"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <button onClick={toggleSearch} className="p-1 hover:bg-[#555] rounded transition-colors text-[#888]">
                        <X size={16} />
                    </button>
                </div>
            )}

            {/* Content Area */}
            <div
                className="flex-1 bg-[#2d2d2d] overflow-auto custom-scrollbar relative selection:bg-[#e95420] selection:text-white"
                onMouseDown={(e) => e.stopPropagation()}
            >
                {activeFile?.loading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e95420]"></div>
                    </div>
                ) : (
                    <div
                        ref={contentRef}
                        className="p-6 text-sm leading-relaxed font-mono text-[#e0e0e0] whitespace-pre-wrap break-words caret-transparent outline-none cursor-text select-text"
                        tabIndex={0}
                        style={{ userSelect: 'text' }}
                    >
                        {highlightedContent}
                    </div>
                )}
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 10px;
                    height: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #2d2d2d;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #4a4a4a;
                    border-radius: 10px;
                    border: 2px solid #2d2d2d;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #555;
                }
                .custom-scrollbar-horizontal::-webkit-scrollbar {
                    height: 4px;
                }
                .custom-scrollbar-horizontal::-webkit-scrollbar-thumb {
                    background: rgba(255,255,255,0.1);
                    border-radius: 2px;
                }
                mark {
                    color: white;
                    background: #e95420;
                }
            `}</style>
        </div>
    );
};

export default TextViewerApp;
