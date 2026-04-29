'use client';

const RESUME_PROXY = '/api/resume';
const RESUME_DOWNLOAD_URL = 'https://raw.githubusercontent.com/ankushhKapoor/resume/main/Ankush_Kapoor_Resume.pdf';

export default function ResumeApp() {
    return (
        <div className="flex flex-col" style={{ height: '100%', background: '#1a1a1a' }}>
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-2 shrink-0" style={{ background: '#252525', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <span className="text-[12px] text-white/50" style={{ fontFamily: "'Ubuntu Mono', monospace" }}>
                    Ankush_Kapoor_Resume.pdf
                </span>
                <a
                    href={RESUME_DOWNLOAD_URL}
                    download="Ankush_Kapoor_Resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-[12px] px-3 py-1 rounded-md transition-all duration-150"
                    style={{
                        background: '#e95420',
                        color: '#fff',
                        fontFamily: "'Ubuntu Mono', monospace",
                        textDecoration: 'none',
                    }}
                >
                    ↓ Download
                </a>
            </div>

            {/* PDF via local proxy — native browser viewer, no Google Docs */}
            <iframe
                src={`${RESUME_PROXY}#toolbar=0&navpanes=0`}
                className="flex-1 w-full border-0"
                title="Resume — Ankush Kapoor"
            />
        </div>
    );
}
