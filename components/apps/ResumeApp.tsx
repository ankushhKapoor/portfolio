'use client';
import { PORTFOLIO } from '@/lib/portfolio';

const MONO = "'Ubuntu Mono', monospace";

export default function ResumeApp() {
    return (
        <div className="flex-1 overflow-y-auto" style={{ background: '#f0f0f0' }}>
            <div className="max-w-xl mx-auto bg-white min-h-full px-10 py-10 text-[#1a1a1a]" style={{ fontFamily: MONO }}>
                <div className="mb-7">
                    <div className="text-[28px] font-bold">{PORTFOLIO.name}</div>
                    <div className="text-[13px] mt-1" style={{ color: '#e95420' }}>{PORTFOLIO.title}</div>
                    <div className="text-[12px] mt-2 text-gray-500">{PORTFOLIO.email} · {PORTFOLIO.github} · {PORTFOLIO.linkedin}</div>
                </div>
                <RSection title="Experience">
                    {PORTFOLIO.experience.map((e, i) => (
                        <div key={i} className="mb-4 pl-3" style={{ borderLeft: '2px solid #e95420' }}>
                            <div className="flex items-baseline justify-between">
                                <span className="text-[13px] font-bold">{e.role} — {e.company}</span>
                                <span className="text-[11px] text-gray-400 ml-4">{e.period}</span>
                            </div>
                            <div className="text-[12px] text-gray-500 mt-1 leading-relaxed">{e.summary}</div>
                        </div>
                    ))}
                </RSection>
                <RSection title="Projects">
                    {PORTFOLIO.projects.map((p, i) => (
                        <div key={i} className="mb-3">
                            <span className="text-[13px] font-bold">{p.name}</span>
                            <span className="text-[12px] text-gray-400"> — {p.tech}</span>
                            <div className="text-[12px] text-gray-500 mt-0.5">{p.summary}</div>
                        </div>
                    ))}
                </RSection>
                <RSection title="Skills">
                    <div className="text-[12px] text-gray-500 leading-loose">{Object.values(PORTFOLIO.skills).flat().join('  ·  ')}</div>
                </RSection>
                <RSection title="Education">
                    <div className="text-[13px] font-bold">{PORTFOLIO.education.degree}</div>
                    <div className="text-[12px] text-gray-500">{PORTFOLIO.education.school} · {PORTFOLIO.education.graduation}</div>
                </RSection>
            </div>
        </div>
    );
}

function RSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="mb-6">
            <div className="text-[11px] font-bold uppercase tracking-[3px] border-b border-gray-200 pb-1 mb-3"
                style={{ color: '#e95420', fontFamily: "'Ubuntu Mono', monospace" }}>
                {title}
            </div>
            {children}
        </div>
    );
}
