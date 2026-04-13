'use client';
import { useState } from 'react';
import { PORTFOLIO } from '@/lib/portfolio';

const MONO = "'Ubuntu Mono', monospace";
const SANS = "'Ubuntu', sans-serif";

type Experience = typeof PORTFOLIO.experience[number];

export default function ExperienceApp({ onOpenExternalLink }: { onOpenExternalLink?: (href: string) => boolean }) {
    return (
        <div className="flex-1 overflow-y-auto" style={{ background: '#1e1e1e', fontFamily: SANS }}>
            <div className="px-7 py-6 flex flex-col gap-6">
                {/* Header */}
                <div className="flex items-baseline gap-2 pb-3" style={{ borderBottom: '1px solid rgba(233,84,32,0.2)' }}>
                    <span className="text-[13px]" style={{ color: '#e95420', fontFamily: MONO }}>~/</span>
                    <span className="text-[15px] font-semibold text-white" style={{ fontFamily: MONO }}>experience</span>
                </div>
                {PORTFOLIO.experience.map((exp, i) => (
                    <ExperienceCard key={i} exp={exp} onOpenExternalLink={onOpenExternalLink} />
                ))}
            </div>
        </div>
    );
}

function ExperienceCard({ exp, onOpenExternalLink }: { exp: Experience; onOpenExternalLink?: (href: string) => boolean }) {
    const [expanded, setExpanded] = useState(false);
    const hasImage = Boolean(exp.image);

    return (
        <div className="rounded-xl overflow-hidden"
            style={{ background: '#252525', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 2px 12px rgba(0,0,0,0.35)' }}>

            {/* Logo / Image — contained in a neutral bg box */}
            {hasImage && (
                <div className="w-full flex items-center justify-center overflow-hidden"
                    style={{ height: 110, background: '#1a1a1a', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <img
                        src={exp.image}
                        alt={exp.company}
                        style={{ maxHeight: 80, maxWidth: '70%', objectFit: 'contain' }}
                        onError={(e) => { (e.currentTarget as HTMLImageElement).parentElement!.style.display = 'none'; }}
                    />
                </div>
            )}

            {/* Content */}
            <div className="px-6 py-6">
                {/* Title row */}
                <div className="flex items-start justify-between gap-4 mb-2.5">
                    <div className="text-[15px] font-semibold text-white leading-snug">{exp.role}</div>
                    <div className="text-[11px] shrink-0 pt-0.5" style={{ color: '#666', fontFamily: MONO }}>{exp.period}</div>
                </div>

                {/* Company + location + link */}
                <div className="flex items-center gap-3 flex-wrap mb-4">
                    <span className="text-[13px] font-medium" style={{ color: '#e95420' }}>{exp.company}</span>
                    <span style={{ color: '#444', fontSize: 11 }}>·</span>
                    <span className="text-[12px]" style={{ color: '#666' }}>{exp.location}</span>
                    {exp.link && (
                        <a href={`https://${exp.link}`} target="_blank" rel="noopener noreferrer"
                            className="text-[11.5px] leading-[1.2] transition-colors ml-auto"
                            style={{ color: '#555', textDecoration: 'none' }}
                            onClick={(e) => {
                                if (!onOpenExternalLink) return;
                                e.preventDefault();
                                onOpenExternalLink(`https://${exp.link}`);
                            }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#e95420'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#555'; }}>
                            ↗ {exp.link}
                        </a>
                    )}
                </div>

                {/* Summary */}
                <p className="text-[13px] leading-[1.85]" style={{ color: '#aaa' }}>{exp.summary}</p>

                {/* Bullets */}
                {exp.bullets && exp.bullets.length > 0 && (
                    <div className="mt-4">
                        <button
                            onClick={() => setExpanded(!expanded)}
                            className="flex items-center gap-1.5 text-[11px] border-0 bg-transparent cursor-pointer px-0 py-0 mb-1.5 transition-colors"
                            style={{ color: '#555', fontFamily: MONO }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#e95420'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#555'; }}>
                            <span style={{ display: 'inline-block', transition: 'transform 0.15s', transform: expanded ? 'rotate(90deg)' : 'none', fontSize: 9 }}>▶</span>
                            {expanded ? 'hide details' : 'show details'}
                        </button>
                        {expanded && (
                            <ul className="flex flex-col gap-2.5 mt-1.5 pl-1">
                                {exp.bullets.map((b, i) => (
                                    <li key={i} className="flex gap-2.5 text-[12px] leading-[1.75]" style={{ color: '#999' }}>
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
