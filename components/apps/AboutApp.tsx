'use client';
import { PORTFOLIO } from '@/lib/portfolio';

const MONO = "'Ubuntu Mono', monospace";

export default function AboutApp() {
    return (
        <div className="flex-1 overflow-y-auto p-6" style={{ background: '#2a2a2a', fontFamily: MONO }}>
            {/* Header */}
            <div className="flex gap-5 items-start mb-7">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0"
                    style={{ background: 'radial-gradient(135deg, #f37222, #e95420)', boxShadow: '0 8px 24px rgba(233,84,32,0.4)' }}>
                    🧑‍💻
                </div>
                <div>
                    <div className="text-[22px] font-bold text-white">{PORTFOLIO.name}</div>
                    <div className="text-[14px] mt-1" style={{ color: '#e95420' }}>{PORTFOLIO.title}</div>
                    <div className="text-[12px] mt-2" style={{ color: '#666' }}>{PORTFOLIO.email}</div>
                    <div className="text-[12px]" style={{ color: '#666' }}>{PORTFOLIO.github} · {PORTFOLIO.linkedin}</div>
                </div>
            </div>

            <Section title="Skills">
                <div className="flex flex-col gap-3 mt-2">
                    {[
                        { label: 'Languages', items: PORTFOLIO.skills.languages },
                        { label: 'Databases', items: PORTFOLIO.skills.databases },
                        { label: 'Tools', items: PORTFOLIO.skills.tools },
                    ].map(({ label, items }) => (
                        <div key={label} className="flex items-center gap-3">
                            <span className="text-[10px] uppercase tracking-widest" style={{ color: '#e95420', minWidth: 70, fontFamily: MONO }}>{label}</span>
                            <div className="flex flex-wrap gap-1.5">
                                {items.map(s => (
                                    <span key={s} className="text-[12px] px-2.5 py-0.5 rounded-md"
                                        style={{ background: '#333', border: '1px solid #444', color: '#ccc', fontFamily: MONO }}>
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </Section>

            <Section title="Experience">
                <div className="flex flex-col gap-4 mt-2">
                    {PORTFOLIO.experience.map((e, i) => (
                        <div key={i} className="pl-4 py-0.5" style={{ borderLeft: '2px solid #e95420' }}>
                            <div className="flex items-baseline justify-between">
                                <span className="text-[14px] font-semibold text-white">{e.role}</span>
                                <span className="text-[11px] ml-4" style={{ color: '#555' }}>{e.period}</span>
                            </div>
                            <div className="text-[12px] mt-0.5" style={{ color: '#e95420' }}>{e.company}</div>
                            <div className="text-[12px] mt-1.5 leading-relaxed" style={{ color: '#999' }}>{e.summary}</div>
                        </div>
                    ))}
                </div>
            </Section>


            <Section title="Community">
                <div className="flex flex-col gap-4 mt-2">
                    {PORTFOLIO.extracurricular.map((act, i) => (
                        <div key={i} className="pl-4 py-0.5" style={{ borderLeft: '2px solid #e95420' }}>
                            <div className="flex items-baseline justify-between">
                                <span className="text-[14px] font-semibold text-white">{act.name}</span>
                                <span className="text-[11px] ml-4" style={{ color: '#555' }}>{act.period}</span>
                            </div>
                            <div className="flex items-center justify-between mt-0.5">
                                <span className="text-[12px]" style={{ color: '#e95420' }}>{act.role}</span>
                                {act.link && (
                                    <a href={`https://${act.link}`} target="_blank" rel="noopener noreferrer"
                                        className="text-[11px]" style={{ color: '#555', textDecoration: 'none' }}
                                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#e95420'; }}
                                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#555'; }}>
                                        {act.link}
                                    </a>
                                )}
                            </div>
                            <div className="text-[12px] mt-1.5 leading-relaxed" style={{ color: '#999' }}>{act.summary}</div>
                        </div>
                    ))}
                </div>
            </Section>

            <Section title="Education">
                <div className="pl-4 mt-2" style={{ borderLeft: '2px solid #e95420' }}>
                    <div className="text-[14px] font-semibold text-white">{PORTFOLIO.education.degree}</div>
                    <div className="text-[12px] mt-0.5" style={{ color: '#e95420' }}>{PORTFOLIO.education.school} · {PORTFOLIO.education.graduation}</div>
                </div>
            </Section>
        </div>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="mb-6">
            <div className="text-[11px] font-bold uppercase tracking-widest pb-2 mb-2"
                style={{ color: '#e95420', borderBottom: '1px solid rgba(233,84,32,0.25)', letterSpacing: 3, fontFamily: "'Ubuntu Mono', monospace" }}>
                {title}
            </div>
            {children}
        </div>
    );
}
