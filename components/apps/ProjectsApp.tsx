'use client';
import { useState } from 'react';
import { PORTFOLIO } from '@/lib/portfolio';

const MONO = "'Ubuntu Mono', monospace";

export default function ProjectsApp() {
    return (
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4" style={{ background: '#2a2a2a', fontFamily: MONO }}>
            <div className="text-[15px] font-semibold text-white">Projects</div>
            {PORTFOLIO.projects.map((p, i) => <ProjectCard key={i} p={p} index={i} />)}
        </div>
    );
}

function ProjectCard({ p, index }: { p: { name: string; tech: string; summary: string }; index: number }) {
    const [hov, setHov] = useState(false);
    const DOTS = ['#e74c3c', '#f1c40f', '#2ecc71'];
    return (
        <div
            className="rounded-xl overflow-hidden transition-all duration-200"
            style={{
                background: '#1e1e1e',
                border: `1px solid ${hov ? '#e95420' : 'rgba(255,255,255,0.08)'}`,
                boxShadow: hov ? '0 4px 24px rgba(233,84,32,0.15)' : '0 2px 8px rgba(0,0,0,0.3)',
            }}
            onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        >
            {/* Fake window bar */}
            <div className="flex items-center gap-1.5 px-3 py-2.5" style={{ background: '#2a2a2a', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {DOTS.map((c, i) => <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />)}
                <span className="text-[11px] ml-2" style={{ color: '#555' }}>{p.name.toLowerCase().replace(/\s+/g, '-')}.sh</span>
            </div>
            <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-[14px] font-semibold text-white">{p.name}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                    {p.tech.split(',').map(t => (
                        <span key={t.trim()} className="text-[11px] px-2 py-0.5 rounded"
                            style={{ background: 'rgba(233,84,32,0.15)', color: '#e95420', border: '1px solid rgba(233,84,32,0.25)' }}>
                            {t.trim()}
                        </span>
                    ))}
                </div>
                <p className="text-[12px] leading-relaxed" style={{ color: '#888' }}>{p.summary}</p>
            </div>
        </div>
    );
}
