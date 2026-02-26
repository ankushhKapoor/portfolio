'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { PORTFOLIO } from '@/lib/portfolio';

type LT = 'mixed' | 'err' | 'sys' | 'prompt' | 'neo';

// A line can be plain text OR a list of colored spans
interface Span { text: string; color: string; }
interface Line { t: LT; v: string; spans?: Span[]; }

const MONO = "'Ubuntu Mono', 'Courier New', monospace";
const TEAL = '#4ec9b0';   // prompt + cursor
const ORANGE = '#e95420';
const WHITE = '#d4d4d4';
const DIM = '#4a4a5a';
const BG = '#0d1117';

// Real-terminal ls: dirs first in cyan with /, then files in white — all on one row grid
function makeLsLine(cwd: string): Line {
    if (cwd !== '~') return { t: 'mixed', v: '(empty directory)', spans: [{ text: '(empty directory)', color: '#555' }] };
    const items: Span[] = [
        { text: 'Documents/', color: TEAL },
        { text: '  ', color: WHITE },
        { text: 'Downloads/', color: TEAL },
        { text: '  ', color: WHITE },
        { text: 'Projects/', color: TEAL },
        { text: '  ', color: WHITE },
        { text: 'readme.txt', color: WHITE },
        { text: '  ', color: WHITE },
        { text: '.bashrc', color: WHITE },
        { text: '  ', color: WHITE },
        { text: 'portfolio.pdf', color: ORANGE },
    ];
    return { t: 'mixed', v: '', spans: items };
}

const INIT: Line[] = [
    { t: 'sys', v: '┌────────────────────────────────────────────────────┐' },
    { t: 'sys', v: '│  KapoorOS Terminal  bash 5.2.0                     │' },
    { t: 'sys', v: '│  Type `help` for available commands.               │' },
    { t: 'sys', v: '└────────────────────────────────────────────────────┘' },
    { t: 'sys', v: '' },
];

export default function TerminalApp() {
    const [lines, setLines] = useState<Line[]>(INIT);
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<string[]>([]);
    const [histIdx, setHistIdx] = useState(-1);
    const [cwd, setCwd] = useState('~');
    const endRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'auto' }); }, [lines, input]);

    const addLines = useCallback((next: Line[]) => setLines(l => [...l, ...next]), []);

    const runCmd = useCallback((raw: string): Line[] => {
        const trimmed = raw.trim();
        if (!trimmed) return [];
        const parts = trimmed.split(/\s+/);
        const cmd = parts[0];
        const args = parts.slice(1);
        const out: Line[] = [];
        const txt = (v: string, t: LT = 'mixed'): Line => ({ t, v });

        switch (cmd) {
            case 'help':
                [
                    txt('Available commands:', 'sys'),
                    txt(''),
                    txt('  help        show this help'),
                    txt('  ls          list directory contents'),
                    txt('  cd <dir>    change directory'),
                    txt('  pwd         print working directory'),
                    txt('  cat <file>  display file'),
                    txt('  echo <txt>  print text'),
                    txt('  whoami      current user'),
                    txt('  uname [-a]  kernel info'),
                    txt('  date        current date/time'),
                    txt('  clear       clear terminal'),
                    txt('  exit        close terminal session'),
                    txt('  neofetch    system information'),
                    txt('  sudo        run as superuser'),
                ].forEach(l => out.push(l));
                break;

            case 'ls':
                out.push(makeLsLine(cwd));
                break;

            case 'pwd':
                out.push(txt(cwd === '~' ? '/home/ankush' : `/home/ankush/${cwd}`));
                break;

            case 'cd': {
                // Strip trailing slash from argument
                const raw_d = args[0] || '~';
                const d = raw_d.replace(/\/$/, ''); // remove trailing /
                if (d === '~' || d === '..' || d === '') {
                    setCwd('~');
                } else if (['Documents', 'Downloads', 'Projects'].includes(d)) {
                    setCwd(d);
                } else {
                    out.push({ t: 'err', v: `bash: cd: ${raw_d}: No such file or directory` });
                }
                break;
            }

            case 'cat': {
                const f = args[0];
                if (f === 'readme.txt') {
                    [txt('# KapoorOS Portfolio'), txt(`By ${PORTFOLIO.name} | ${PORTFOLIO.email}`)].forEach(l => out.push(l));
                } else if (f === '.bashrc') {
                    ['# ~/.bashrc', 'export PS1="\\[\\e[36m\\]ankush@kapoorOS:\\w$ \\[\\e[0m\\]"', 'alias ll="ls -la"', 'alias gs="git status"'].forEach(v => out.push(txt(v)));
                } else if (f === 'portfolio.pdf') {
                    out.push({ t: 'err', v: 'cat: portfolio.pdf: Binary file — open with a PDF viewer' });
                } else {
                    out.push({ t: 'err', v: `cat: ${f ?? '(no file)'}: No such file or directory` });
                }
                break;
            }

            case 'echo': out.push(txt(args.join(' '))); break;
            case 'whoami': out.push(txt('ankush')); break;

            case 'uname':
                out.push(txt(args.includes('-a')
                    ? 'Linux kapoorOS 6.5.0-kapoor-generic #1 SMP PREEMPT_DYNAMIC Thu Feb 26 09:00:00 UTC 2026 x86_64 GNU/Linux'
                    : 'Linux'));
                break;

            case 'date': out.push(txt(new Date().toString())); break;
            case 'clear': setLines([]); return [];

            case 'exit':
                out.push({ t: 'sys', v: 'Session ended. Close this window to exit.' });
                break;

            case 'sudo':
                out.push({ t: 'err', v: '[sudo] password for ankush:' });
                out.push({ t: 'err', v: 'sudo: Permission denied 😏' });
                break;

            case 'neofetch':
                [
                    { t: 'neo' as LT, v: '         .´ - ´.        ankush@kapoorOS' },
                    { t: 'neo' as LT, v: "       /  ( ● )  \\       ──────────────────────" },
                    { t: 'neo' as LT, v: '      |   \\___/   |      OS:      KapoorOS 24.04 LTS' },
                    { t: 'neo' as LT, v: '    __\\           /__     Kernel:  6.5.0-kapoor-generic' },
                    { t: 'neo' as LT, v: '   /   \\/ /  \\/ /   \\    Shell:   bash 5.2.0' },
                    { t: 'neo' as LT, v: '  /    /        \\    \\   DE:      GNOME 45.2' },
                    { t: 'neo' as LT, v: ' /    /   /\\   \\  \\   \\  CPU:     Intel i9-13900K × 24' },
                    { t: 'neo' as LT, v: '/____/   /  \\   \\____\\  RAM:     32 GiB / 32 GiB' },
                    { t: 'neo' as LT, v: '          ubuntu        User:    Ankush Kapoor' },
                ].forEach(l => out.push(l));
                break;

            default:
                out.push({ t: 'err', v: `bash: ${cmd}: command not found` });
        }
        return out;
    }, [cwd]);

    const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.ctrlKey && e.key === 'c') {
            e.preventDefault();
            addLines([{ t: 'prompt', v: `ankush@kapoorOS:${cwd}$ ^C` } as unknown as Line]);
            setInput(''); return;
        }
        if (e.ctrlKey && e.key === 'l') { e.preventDefault(); setLines([]); setInput(''); return; }
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            const i = Math.min(histIdx + 1, history.length - 1);
            setHistIdx(i); setInput(history[history.length - 1 - i] ?? ''); return;
        }
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            const i = Math.max(histIdx - 1, -1);
            setHistIdx(i); setInput(i < 0 ? '' : history[history.length - 1 - i] ?? ''); return;
        }
        if (e.key === 'Enter') {
            const cmd = input;
            const result = runCmd(cmd);
            if (cmd.trim() !== 'clear') {
                // prompt line rendered as mixed with spans
                addLines([
                    {
                        t: 'mixed', v: '', spans: [
                            { text: `ankush@kapoorOS:${cwd}$`, color: TEAL },
                            { text: ` ${cmd}`, color: WHITE },
                        ]
                    },
                    ...result,
                ]);
            }
            if (cmd.trim()) setHistory(h => [...h, cmd]);
            setHistIdx(-1); setInput('');
        }
    };

    const COLOR: Record<LT, string> = {
        mixed: WHITE, err: ORANGE, sys: DIM, prompt: TEAL, neo: ORANGE,
    };

    return (
        <div className="flex-1 flex flex-col overflow-hidden" style={{ background: BG, fontFamily: MONO }}
            onClick={() => inputRef.current?.focus()}>

            {/* Scrollable output */}
            <div className="flex-1 overflow-y-auto cursor-text" style={{ background: BG }}>
                <div className="p-3 pb-0">
                    {lines.map((l, i) =>
                        l.spans ? (
                            /* Colored spans line */
                            <div key={i} style={{ fontSize: 13, lineHeight: 1.7, fontFamily: MONO, minHeight: l.spans.length ? undefined : 12, whiteSpace: 'pre-wrap' }}>
                                {l.spans.map((s, si) => <span key={si} style={{ color: s.color }}>{s.text}</span>)}
                            </div>
                        ) : (
                            <div key={i} style={{ color: COLOR[l.t], fontSize: 13, lineHeight: 1.7, fontFamily: MONO, minHeight: l.v ? undefined : 12, whiteSpace: 'pre-wrap' }}>
                                {l.v}
                            </div>
                        )
                    )}

                    {/* Input line */}
                    <div className="flex items-baseline pb-3" style={{ fontSize: 13, lineHeight: 1.7, fontFamily: MONO }}>
                        <span style={{ color: TEAL, whiteSpace: 'nowrap' }}>ankush@kapoorOS:{cwd}$&nbsp;</span>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'baseline' }}>
                            <span style={{ color: WHITE }}>{input}</span>
                            {/* Always-teal blinking block cursor */}
                            <span style={{
                                display: 'inline-block',
                                width: '0.55em',
                                height: '1.1em',
                                background: TEAL,
                                verticalAlign: 'text-bottom',
                                marginLeft: 1,
                                animation: 'blink-cursor 1s step-end infinite',
                            }} />
                        </div>
                        <input
                            ref={inputRef}
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleKey}
                            style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 0, height: 0 }}
                            autoFocus spellCheck={false} autoComplete="off" autoCorrect="off"
                        />
                    </div>

                    <div ref={endRef} />
                </div>
            </div>

            <style>{`
        @keyframes blink-cursor {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
      `}</style>
        </div>
    );
}
