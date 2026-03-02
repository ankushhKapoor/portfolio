'use client';
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, Download, Menu, FileText } from 'lucide-react';

interface PdfViewerAppProps {
    src?: string;
    fileName?: string;
    path?: string;
    onOpenProperties?: (name: string, kind: 'file' | 'folder', path: string) => void;
}

const PdfViewerApp: React.FC<PdfViewerAppProps> = ({ src: initialSrc, fileName: initialFileName, path: initialPath, onOpenProperties }) => {
    const [src, setSrc] = useState(initialSrc);
    const [fileName, setFileName] = useState(initialFileName);
    const [path, setPath] = useState(initialPath);
    const [zoom, setZoom] = useState(100);
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const handleZoomIn = useCallback(() => setZoom(prev => Math.min(prev + 25, 400)), []);
    const handleZoomOut = useCallback(() => setZoom(prev => Math.max(prev - 25, 25)), []);

    const handleDownload = useCallback(() => {
        if (!src) return;
        const link = document.createElement('a');
        link.href = src;
        link.download = fileName || 'document.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setShowMenu(false);
    }, [src, fileName]);

    const handleProperties = useCallback(() => {
        if (onOpenProperties && fileName && path) {
            onOpenProperties(fileName, 'file', path);
            setShowMenu(false);
        }
    }, [onOpenProperties, fileName, path]);

    const toggleMenu = () => setShowMenu(!showMenu);

    useEffect(() => {
        setSrc(initialSrc);
        setFileName(initialFileName);
        setPath(initialPath);
    }, [initialSrc, initialFileName, initialPath]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };
        const handleOpenFile = (event: any) => {
            const { src: newSrc, fileName: newFileName, path: newPath } = event.detail;
            if (newSrc) {
                setSrc(newSrc);
                setFileName(newFileName);
                setPath(newPath);
            }
        };

        window.addEventListener('pdf-open-file', handleOpenFile);
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            window.removeEventListener('pdf-open-file', handleOpenFile);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // PDF URL with zoom parameter
    const pdfUrl = src ? `${src}#page=1&zoom=${zoom}&toolbar=0&navpanes=0&scrollbar=0` : '';

    return (
        <div className="flex flex-col h-full bg-[#3d3d3d] text-white font-sans overflow-hidden select-none">
            {/* Header Bar - Ubuntu Evince Style */}
            <div className="flex items-center justify-between px-3 py-1.5 bg-[#454545] border-b border-[#2d2d2d] shadow-md z-20">
                <div className="flex items-center gap-3">
                    <div className="p-1 px-2 hover:bg-[#555] rounded-md transition-colors cursor-pointer border border-[#555] flex items-center gap-2">
                        <FileText size={16} />
                        <span className="text-sm font-medium truncate max-w-[150px]">{fileName || 'Document'}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex items-center bg-[#555] rounded-md overflow-hidden border border-[#555]">
                        <button
                            onClick={handleZoomOut}
                            className="p-1.5 hover:bg-[#666] transition-colors cursor-pointer border-r border-[#454545] outline-none"
                            title="Zoom Out"
                        >
                            <ZoomOut size={16} />
                        </button>
                        <div className="px-3 text-sm py-1 font-medium bg-[#555] min-w-[60px] text-center font-mono">
                            {zoom}%
                        </div>
                        <button
                            onClick={handleZoomIn}
                            className="p-1.5 hover:bg-[#666] transition-colors cursor-pointer border-l border-[#454545] outline-none"
                            title="Zoom In"
                        >
                            <ZoomIn size={16} />
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    <button
                        onClick={handleDownload}
                        className="p-1.5 hover:bg-[#555] rounded-md transition-colors cursor-pointer outline-none"
                        title="Download"
                    >
                        <Download size={16} />
                    </button>

                    <div className="w-[1px] h-6 bg-[#555] mx-1" />

                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={toggleMenu}
                            className={`p-1.5 rounded-md transition-colors cursor-pointer outline-none ${showMenu ? 'bg-[#555]' : 'hover:bg-[#555]'}`}
                            title="Menu"
                        >
                            <Menu size={16} />
                        </button>

                        {showMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-[#4a4a4a] border border-[#333] rounded-md shadow-xl py-1 z-30 animate-in fade-in zoom-in duration-150">
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

            {/* Document Area - Fixed Container with Scrollbars */}
            <div
                ref={scrollContainerRef}
                className="flex-1 bg-[#2d2d2d] overflow-auto custom-scrollbar relative"
            >
                {src ? (
                    <iframe
                        key={`${src}-${zoom}`}
                        ref={iframeRef}
                        src={pdfUrl}
                        className="w-full border-none pointer-events-auto"
                        style={{ backgroundColor: 'transparent', minHeight: '100%' }}
                        title={fileName || 'PDF Document'}
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center opacity-50 h-full text-center w-full">
                        <FileText size={64} className="mb-4" />
                        <p className="text-lg font-medium">No document selected</p>
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
            `}</style>
        </div>
    );
};

export default PdfViewerApp;