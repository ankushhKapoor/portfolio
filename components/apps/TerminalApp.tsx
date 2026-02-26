'use client';
import { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react';
import { PORTFOLIO, FILES } from '@/lib/portfolio';

type LT = 'mixed' | 'err' | 'sys' | 'prompt' | 'neo';

interface Span { text: string; color: string; }
interface Line { t: LT; v: string; spans?: Span[]; }

const MONO = "'Ubuntu Mono', 'Courier New', monospace";
const TEAL = '#4ec9b0';   // prompt + cursor
const ORANGE = '#e95420';
const WHITE = '#d4d4d4';
const DIM = '#4a4a5a';
const BG = '#0d1117';

const COMMANDS = ['help', 'ls', 'cd', 'pwd', 'cat', 'echo', 'whoami', 'uname', 'date', 'clear', 'exit', 'neofetch', 'sudo', 'll'];

function makeLsLine(currentPath: string, showHidden: boolean = false): Line {
    let items = FILES[currentPath as keyof typeof FILES] || [];
    if (!showHidden) {
        items = items.filter(i => !i.n.startsWith('.'));
    }

    if (items.length === 0 && !showHidden) return { t: 'mixed', v: '', spans: [{ text: '(empty directory)', color: '#555' }] };

    const spans: Span[] = [];

    if (showHidden) {
        spans.push({ text: './', color: TEAL });
        spans.push({ text: '  ', color: WHITE });
        spans.push({ text: '../', color: TEAL });
        spans.push({ text: '  ', color: WHITE });
    }

    items.forEach((item, idx) => {
        const isDir = item.dir;
        spans.push({
            text: item.n + (isDir ? '/' : ''),
            color: isDir ? TEAL : (item.n.endsWith('.pdf') ? ORANGE : WHITE)
        });
        if (idx < items.length - 1) {
            spans.push({ text: '  ', color: WHITE });
        }
    });

    if (spans.length > 0 && spans[spans.length - 1].text === '  ') spans.pop();

    return { t: 'mixed', v: '', spans };
}

const INIT: Line[] = [
    { t: 'sys', v: '+--------------------------------------------------+' },
    { t: 'sys', v: '|  KapoorOS Terminal  bash 5.2.0                   |' },
    { t: 'sys', v: '|  Type help for available commands.               |' },
    { t: 'sys', v: '+--------------------------------------------------+' },
    { t: 'sys', v: '' },
];

export default function TerminalApp({ onClose }: { onClose?: () => void }) {
    const [lines, setLines] = useState<Line[]>(INIT);
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<string[]>([]);
    const [histIdx, setHistIdx] = useState(-1);
    const [cwd, setCwd] = useState('Home');
    const endRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const displayPath = cwd === 'Home' ? '~' : `~/${cwd}`;

    // Focus management: aggressive focus to handle window resizing/maximizing issues
    const regainFocus = useCallback(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    useLayoutEffect(() => {
        regainFocus();
    });

    useEffect(() => {
        window.addEventListener('resize', regainFocus);
        const t = setInterval(regainFocus, 1000); // safety net
        return () => {
            window.removeEventListener('resize', regainFocus);
            clearInterval(t);
        };
    }, [regainFocus]);

    useEffect(() => {
        const t = setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'auto' }), 10);
        return () => clearTimeout(t);
    }, [lines, input]);

    const addLines = useCallback((next: Line[]) => setLines(l => [...l, ...next]), []);

    const runCmd = useCallback((raw: string): Line[] => {
        const trimmed = raw.trim();
        if (!trimmed) return [];

        let finalRaw = raw;
        if (trimmed === 'll') finalRaw = 'ls -la';

        const parts = finalRaw.trim().split(/\s+/);
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
                    txt('  ls [-a]     list directory contents'),
                    txt('  cd <dir>    change directory'),
                    txt('  pwd         print working directory'),
                    txt('  cat <file>  display file'),
                    txt('  echo <txt>  print text'),
                    txt('  whoami      current user'),
                    txt('  uname [-a]  kernel info'),
                    txt('  date        current date/time'),
                    txt('  clear       clear terminal'),
                    txt('  exit        close terminal window'),
                    txt('  neofetch    system information'),
                    txt('  sudo        run as superuser'),
                ].forEach(l => out.push(l));
                break;

            case 'ls': {
                const flags = args.filter(a => a.startsWith('-'));
                const dirArg = args.find(a => !a.startsWith('-'));

                // Strict flag validation for implemented options
                const validFlags = flags.every(f => /^-(a|l|la|al)$/.test(f));
                if (!validFlags) {
                    const bad = flags.find(f => !/^-(a|l|la|al)$/.test(f)) ?? '';
                    out.push({ t: 'err', v: `ls: invalid option -- '${bad.replace('-', '')}'` });
                    out.push({ t: 'err', v: "Try 'ls --help' for more information." });
                    break;
                }

                const showAll = flags.some(f => f.includes('a'));

                if (dirArg) {
                    const d = dirArg.replace(/\/$/, '').replace(/^~\//, '').replace(/^~$/, 'Home');
                    const lookup = d === 'Home' ? 'Home' : d;
                    if (Object.keys(FILES).includes(lookup)) {
                        out.push(makeLsLine(lookup, showAll));
                    } else {
                        out.push({ t: 'err', v: `ls: cannot access '${dirArg}': No such file or directory` });
                    }
                } else {
                    out.push(makeLsLine(cwd, showAll));
                }
                break;
            }

            case 'pwd':
                out.push(txt(cwd === 'Home' ? '/home/ankush' : `/home/ankush/${cwd}`));
                break;

            case 'cd': {
                const target = args[0] || 'Home';

                if (target === '..' || target === '../') {
                    setCwd('Home');
                } else if (target.startsWith('../')) {
                    const sub = target.replace('../', '').replace(/\/$/, '');
                    if (Object.keys(FILES).includes(sub)) {
                        setCwd(sub);
                    } else {
                        out.push({ t: 'err', v: `bash: cd: ${target}: No such file or directory` });
                    }
                } else if (target === '~' || target === '/' || target === 'Home') {
                    setCwd('Home');
                } else {
                    const d = target.replace(/\/$/, '');
                    if (Object.keys(FILES).includes(d)) {
                        setCwd(d);
                    } else {
                        out.push({ t: 'err', v: `bash: cd: ${target}: No such file or directory` });
                    }
                }
                break;
            }

            case 'cat': {
                const f = args[0];
                const items = FILES[cwd as keyof typeof FILES] || [];
                const file = items.find(i => i.n === f);

                if (file && !file.dir) {
                    if (f === 'readme.txt') {
                        [txt('# KapoorOS Portfolio'), txt(`By ${PORTFOLIO.name} | ${PORTFOLIO.email}`)].forEach(l => out.push(l));
                    } else if (f === '.bashrc') {
                        ['# ~/.bashrc', 'alias ll="ls -la"', 'export PS1="\\u@\\h:\\w\\$ "'].forEach(v => out.push(txt(v)));
                    } else if (f === 'portfolio.pdf') {
                        out.push({ t: 'err', v: 'cat: portfolio.pdf: Binary file — open with a PDF viewer' });
                    } else {
                        out.push(txt(`Contents of ${f} would appear here.`));
                    }
                } else if (file && file.dir) {
                    out.push({ t: 'err', v: `cat: ${f}: Is a directory` });
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
                if (onClose) onClose();
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
    }, [cwd, onClose]);

    const handleAutocomplete = useCallback(() => {
        const trimmedInput = input.trimEnd();
        if (!trimmedInput && input.length === 0) return;

        const parts = input.split(/\s+/);
        const lastPart = parts[parts.length - 1];

        if (parts.length === 1 && input === lastPart) {
            // Command completion
            const matches = COMMANDS.filter(c => c.toLowerCase().startsWith(lastPart.toLowerCase()));
            if (matches.length === 1) {
                setInput(matches[0] + ' ');
            }
        } else {
            // File/Folder completion
            const items = FILES[cwd as keyof typeof FILES] || [];
            const matches = items.filter(i => i.n.toLowerCase().startsWith(lastPart.toLowerCase()));
            if (matches.length === 1) {
                // Correctly handle the prefix to keep spaces
                const lastIdx = input.lastIndexOf(lastPart);
                const prefix = input.substring(0, lastIdx);
                setInput(prefix + matches[0].n + (matches[0].dir ? '/' : ' '));
            }
        }
    }, [input, cwd]);

    const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            handleAutocomplete();
            return;
        }
        if (e.ctrlKey && e.key === 'c') {
            e.preventDefault();
            addLines([{
                t: 'mixed', v: '', spans: [
                    { text: `ankush@kapoorOS:${displayPath}$`, color: TEAL },
                    { text: ` ${input}`, color: WHITE },
                    { text: `^C`, color: WHITE }
                ]
            }]);
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
                addLines([
                    {
                        t: 'mixed', v: '', spans: [
                            { text: `ankush@kapoorOS:${displayPath}$`, color: TEAL },
                            { text: ` ${input}`, color: WHITE },
                        ]
                    },
                    ...result,
                ]);
            }
            if (cmd.trim()) setHistory((h: string[]) => [...h, cmd]);
            setHistIdx(-1); setInput('');
        }
    };

    const COLOR: Record<LT, string> = {
        mixed: WHITE, err: ORANGE, sys: DIM, prompt: TEAL, neo: ORANGE,
    };

    return (
        <div className="flex-1 flex flex-col overflow-hidden" style={{ background: BG, fontFamily: MONO }}
            onClick={regainFocus}>

            <div className="flex-1 overflow-y-auto cursor-text scrollbar-ubuntu" style={{ background: BG }}>
                <div className="p-3">
                    {lines.map((l: Line, i: number) =>
                        l.spans ? (
                            <div key={i} style={{ fontSize: 13, lineHeight: 1.7, fontFamily: MONO, minHeight: 12, whiteSpace: 'pre-wrap' }}>
                                {l.spans.map((s: Span, si: number) => <span key={si} style={{ color: s.color }}>{s.text}</span>)}
                            </div>
                        ) : (
                            <div key={i} style={{ color: COLOR[l.t as LT], fontSize: 13, lineHeight: 1.7, fontFamily: MONO, minHeight: 12, whiteSpace: l.t === 'sys' ? 'pre' : 'pre-wrap' }}>
                                {l.v}
                            </div>
                        )
                    )}

                    <div className="flex items-baseline" style={{ fontSize: 13, lineHeight: 1.7, fontFamily: MONO }}>
                        <span style={{ color: TEAL, whiteSpace: 'nowrap' }}>ankush@kapoorOS:{displayPath}$&nbsp;</span>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'baseline', flex: 1 }}>
                            <span style={{ color: WHITE, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{input}</span>
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

                    <div ref={endRef} className="h-4" />
                </div>
            </div>

            <style>{`
        @keyframes blink-cursor {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        .scrollbar-ubuntu::-webkit-scrollbar { width: 10px; }
        .scrollbar-ubuntu::-webkit-scrollbar-track { background: #0d1117; }
        .scrollbar-ubuntu::-webkit-scrollbar-thumb { background: #333; border: 2px solid #0d1117; border-radius: 5px; }
        .scrollbar-ubuntu::-webkit-scrollbar-thumb:hover { background: #444; }
      `}</style>
        </div>
    );
}
