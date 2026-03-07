'use client';
import { useState } from 'react';
import { PORTFOLIO } from '@/lib/portfolio';

const MONO = "'Ubuntu Mono', monospace";
const SANS = "'Ubuntu', sans-serif";

type Project = typeof PORTFOLIO.projects[number];

export default function ProjectsApp() {
    return (
        <div className="flex-1 overflow-y-auto" style={{ background: '#1e1e1e', fontFamily: SANS }}>
            <div className="px-5 py-4 flex flex-col gap-5">
                {/* Header */}
                <div className="flex items-baseline gap-2 pb-3" style={{ borderBottom: '1px solid rgba(233,84,32,0.2)' }}>
                    <span className="text-[13px]" style={{ color: '#e95420', fontFamily: MONO }}>~/</span>
                    <span className="text-[15px] font-semibold text-white" style={{ fontFamily: MONO }}>projects</span>
                </div>
                {PORTFOLIO.projects.map((p, i) => <ProjectCard key={i} p={p} />)}
            </div>
        </div>
    );
}

function ProjectCard({ p }: { p: Project }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="rounded-xl overflow-hidden"
            style={{ background: '#252525', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 2px 12px rgba(0,0,0,0.35)' }}>

            {/* Project image — contained, not cropped */}
            {p.image && (
                <div className="w-full flex items-center justify-center overflow-hidden"
                    style={{ height: 150, background: '#1a1a1a', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <img
                        src={p.image}
                        alt={p.name}
                        style={{ maxHeight: 130, maxWidth: '90%', objectFit: 'contain', borderRadius: 4 }}
                        onError={(e) => { (e.currentTarget as HTMLImageElement).parentElement!.style.display = 'none'; }}
                    />
                </div>
            )}

            {/* Content */}
            <div className="px-5 py-4">
                {/* Title + GitHub */}
                <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                        <div className="text-[15px] font-semibold text-white leading-snug">{p.name}</div>
                        {p.subtitle && <div className="text-[11px] mt-0.5" style={{ color: '#666', fontFamily: MONO }}>{p.subtitle}</div>}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        {p.date && <span className="text-[11px]" style={{ color: '#555', fontFamily: MONO }}>{p.date}</span>}
                        {p.githubUrl && (
                            <a href={p.githubUrl} target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] transition-all"
                                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#bbb', textDecoration: 'none' }}
                                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(233,84,32,0.15)'; el.style.borderColor = 'rgba(233,84,32,0.4)'; el.style.color = '#e95420'; }}
                                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(255,255,255,0.06)'; el.style.borderColor = 'rgba(255,255,255,0.1)'; el.style.color = '#bbb'; }}>
                                ↗ GitHub
                            </a>
                        )}
                    </div>
                </div>

                {/* Tech tags */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                    {p.tech.split(',').map(t => (
                        <span key={t.trim()} className="text-[11px] px-2 py-0.5 rounded"
                            style={{ background: 'rgba(233,84,32,0.12)', color: '#e95420', border: '1px solid rgba(233,84,32,0.2)' }}>
                            {t.trim()}
                        </span>
                    ))}
                </div>

                {/* Summary */}
                <p className="text-[13px] leading-[1.65]" style={{ color: '#aaa' }}>{p.summary}</p>

                {/* Bullets */}
                {p.bullets && p.bullets.length > 0 && (
                    <div className="mt-3">
                        <button
                            onClick={() => setExpanded(!expanded)}
                            className="flex items-center gap-1.5 text-[11px] border-0 bg-transparent cursor-pointer px-0 py-0 mb-1 transition-colors"
                            style={{ color: '#555', fontFamily: MONO }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#e95420'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#555'; }}>
                            <span style={{ display: 'inline-block', transition: 'transform 0.15s', transform: expanded ? 'rotate(90deg)' : 'none', fontSize: 9 }}>▶</span>
                            {expanded ? 'hide details' : 'show details'}
                        </button>
                        {expanded && (
                            <ul className="flex flex-col gap-2 mt-1 pl-1">
                                {p.bullets.map((b, i) => (
                                    <li key={i} className="flex gap-2.5 text-[12px] leading-relaxed" style={{ color: '#999' }}>
                                        <span style={{ color: '#e95420', flexShrink: 0, marginTop: 2 }}>›</span>
                                        <span>{b}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
