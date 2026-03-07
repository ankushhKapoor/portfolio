export const PORTFOLIO = {
  name: 'Ankush Kapoor',
  title: 'Computer Engineering Student',
  email: 'work.ankushkapoor1626@gmail.com',
  github: 'github.com/ankushhKapoor',
  linkedin: 'linkedin.com/in/ankushhKapoor',
  twitter: 'x.com/ankushhKapoor',
  website: 'ankushhkapoor.vercel.app',
  education: {
    degree: 'Bachelor of Technology in Computer Engineering',
    school: 'Vidyalankar Institute of Technology',
    location: 'Mumbai, India',
    period: 'Sept 2024 – Present',
    cgpa: '10.0 (First Year)',
    sgpa: '10.0 (Sem 3)',
    graduation: '2028',
    courses: ['Object-Oriented Programming', 'Data Structures & Algorithms', 'Database Management Systems'],
  },
  skills: {
    languages: ['C', 'Python', 'Assembly', 'Java'],
    databases: ['MySQL'],
    tools: ['Git', 'GitHub'],
  },
  experience: [
    {
      role: 'Open Source Contributor & Paid Contributor',
      company: 'Open World Holidays Framework',
      period: 'Jan 2025 – June 2025',
      location: 'Remote',
      link: 'github.com/commenthol/date-holidays',
      summary: 'Climbed to rank 7 of 2300+ during Google Winter of Code, good enough to earn a paid sponsorship to extend the library. Added lunar calendar support for Mongolia, holiday logic for India and Nepal, and l10n translations (Hindi, Mongolian) across a library with 20M+ monthly PyPI downloads.',
      bullets: [
        'Ranked #7 out of 2300+ contributors in GWoC, leading to a paid sponsored task building Mongolian holiday logic from scratch.',
        'Implemented a full lunar-calendar engine for Mongolia and extended date-system logic to cover 249 countries without breaking existing functionality.',
        'Shipped Hindi and Mongolian l10n translations, making the library natively accessible to millions of regional users.',
      ],
    },
  ],
  projects: [
    {
      name: 'Transformer From Scratch',
      subtitle: 'Neural Machine Translation',
      tech: 'Python, PyTorch',
      date: 'Dec 2025',
      githubUrl: 'https://github.com/ankushhKapoor/transformer-from-scratch',
      summary: 'Full implementation of the "Attention Is All You Need" Transformer architecture, built without wrapper libraries, with every layer hand-coded. Trains a bilingual sequence-to-sequence model with beam search and proper NLP metrics.',
      bullets: [
        'Built every component from scratch: scaled dot-product attention, multi-head attention, positional encoding, encoder-decoder stacks, and label smoothing.',
        'Trained on the OPUS Books dataset (en to it), with learning-rate warmup, beam search decoding, and TensorBoard experiment tracking.',
        'Evaluated with SacreBLEU, WER, and CER (standard MT benchmarks) and released pretrained checkpoints with an inference notebook.',
      ],
    },
    {
      name: 'BaseKernel',
      subtitle: 'Custom 32-bit OS Kernel',
      tech: 'C, NASM, QEMU',
      date: 'Sep 2025',
      githubUrl: 'https://github.com/ankushhKapoor/BaseKernel',
      summary: 'A real 32-bit x86 protected-mode kernel, built without any OS, standard library, or runtime. Boots from a hand-written bootloader and implements core OS primitives from first principles.',
      bullets: [
        'Wrote a 16-bit bootloader that enables the A20 line, sets up the GDT, and jumps to 32-bit protected mode with no GRUB and no shortcuts.',
        'Implemented full GDT and IDT with CPU exception handlers, hardware IRQ routing, and a VGA text-mode console for output.',
        'Built a preemptive round-robin scheduler, basic virtual memory paging, and an ATA disk driver with a simple filesystem.',
      ],
    },
    {
      name: 'Alloc',
      subtitle: 'Custom Memory Allocator in C',
      tech: 'C, NASM',
      date: 'Jun 2025',
      githubUrl: 'https://github.com/ankushhKapoor/Alloc',
      summary: 'A malloc/free replacement written from scratch over a 1 GB virtual heap. Built to deeply understand how allocators track, coalesce, and reclaim memory at the byte level.',
      bullets: [
        'Designed a word-aligned heap with packed headers that encode block size and allocation state in a single 32-bit int.',
        'Implemented alloc(), destroy() (with memory-zeroing for security), and a show() debugger for heap inspection.',
        'Added KB/MB/GB convenience macros and ensured destroy() zeroes freed memory to prevent data-leakage between allocations.',
      ],
    },
  ],
  extracurricular: [
    {
      name: 'Our Tech Community (OTC)',
      link: 'ourtech.community',
      role: 'Co-Organiser',
      period: 'Jul 2025 – Present',
      summary: 'Helping grow and run a 600+ member open tech community in Mumbai focused on weekly learning sessions, technical talks, and building a space where anyone (hobbyist or professional) is welcome.',
      bullets: [
        'Plan and execute flagship programs including weekly catchups, technical talks, and community events.',
        'Handle technical setup and infra for events, documentation, and community tooling.',
      ],
    },
    {
      name: 'Rotary Divyang Center',
      link: '',
      role: 'Social Service Intern',
      period: 'Feb 2026 – Present',
      summary: 'Volunteering at a rehabilitation center that provides artificial limbs to people with physical disabilities. Supporting patients through the process and handling administrative work alongside building a website for the center.',
      bullets: [
        'Assist patients with administrative procedures, paperwork, and day-to-day coordination at the center.',
        'Engage directly with patients who come in for artificial limb attachment, offering support and guidance.',
        'Building a website for the center (in progress) to improve outreach and information accessibility.',
      ],
    },
  ],
};

export const BOOT_LINES = [
  { text: '[    0.000000] Booting KapoorOS Linux 6.5.0-kapoor-generic...', type: 'default' },
  { text: '[    0.183421] ACPI: BIOS IRQ0 pin2 override ignored', type: 'default' },
  { text: '[  OK  ] Started udev Kernel Device Manager.', type: 'ok' },
  { text: '[  OK  ] Mounted /proc filesystem.', type: 'ok' },
  { text: '[  OK  ] Reached target Network.', type: 'ok' },
  { text: '[  OK  ] Started NetworkManager.', type: 'ok' },
  { text: '[  OK  ] Started GNOME Display Manager.', type: 'ok' },
  { text: "         Welcome to KapoorOS 24.04 LTS (Kapoor's Realm) 🎉", type: 'welcome' },
];

export const DOCK_APPS = [
  { id: 'terminal', icon: '🖥️', label: 'Terminal' },
  { id: 'files', icon: '📁', label: 'Files' },
  { id: 'about', icon: '👤', label: 'About Me' },
  { id: 'resume', icon: '📄', label: 'Resume' },
  { id: 'projects', icon: '💼', label: 'Projects' },
  { id: 'calendar', icon: '📅', label: 'Calendar' },
  { id: 'settings', icon: '⚙️', label: 'Settings' },
];

export const DESKTOP_ICONS = [
  { id: 'about', icon: '👤', label: 'About Me' },
  { id: 'resume', icon: '📄', label: 'Resume' },
  { id: 'projects', icon: '💼', label: 'Projects' },
  { id: 'terminal', icon: '🖥️', label: 'Terminal' },
  { id: 'files', icon: '📁', label: 'Files' },
  { id: 'resume-pdf', icon: '📋', label: 'resume.pdf', kind: 'file', path: 'resume.pdf' },
  { id: 'simple-mode', icon: '🌐', label: 'Simple Mode' },
];

export const WIN_DEFAULTS: Record<string, { w: number; h: number; title: string }> = {
  terminal: { w: 700, h: 480, title: 'Terminal — ankush@kapoorOS' },
  about: { w: 700, h: 520, title: 'About Me — Ankush Kapoor' },
  resume: { w: 680, h: 600, title: 'Resume — Ankush Kapoor' },
  projects: { w: 640, h: 500, title: 'Projects — Ankush Kapoor' },
  calendar: { w: 420, h: 460, title: 'Calendar' },
  files: { w: 720, h: 500, title: 'Files' },
  settings: { w: 680, h: 480, title: 'Settings' },
  'text-viewer': { w: 750, h: 550, title: 'Text Viewer' },
  'pdf-viewer': { w: 800, h: 650, title: 'Document Viewer' },
};

export const FILES: Record<string, { n: string; icon: string; dir?: boolean; src?: string }[]> = {
  Home: [
    { n: 'Documents', icon: '📁', dir: true },
    { n: 'Downloads', icon: '📁', dir: true },
    { n: 'Projects', icon: '📁', dir: true },
    { n: 'resume.pdf', icon: '📋', src: '/assets/os/resume.pdf' }
  ],
  Documents: [
    { n: 'notes.txt', icon: '📄', src: '/assets/os/Documents/notes.txt' }
  ],
  Downloads: [
    { n: 'test.txt', icon: '📄', src: '/assets/os/Downloads/test.txt' },
    { n: 'trial.txt', icon: '📄', src: '/assets/os/Downloads/trial.txt' }
  ],
  Projects: []
};

export const SETTINGS_PANELS: Record<string, [string, string][]> = {
  'About KapoorOS': [
    ['OS Name', 'KapoorOS 24.04 LTS'],
    ['Kernel', 'Linux 6.5.0-kapoor-generic'],
    ['GNOME Version', '45.2'],
    ['Windowing', 'Wayland'],
    ['CPU', 'Intel Core i9-13900K × 24'],
    ['RAM', '32.0 GiB'],
    ['Graphics', 'NVIDIA GeForce RTX 4090'],
    ['Disk', '2.0 TB'],
    ['Build Date', 'Feb 26, 2026'],
  ],
  Appearance: [
    ['Theme', 'Dark (KapoorOS)'],
    ['Icon Theme', 'Yaru-Dark'],
    ['Cursor', 'DMZ-Black'],
    ['Font', 'Ubuntu 11'],
  ],
  Background: [
    ['Wallpaper', 'KapoorOS Aubergine'],
    ['Lock Screen', 'Same as desktop'],
    ['Style', 'Zoom'],
  ],
  Notifications: [
    ['Do Not Disturb', 'Off'],
    ['Lock Screen Notifications', 'On'],
    ['Sound', 'On'],
  ],
  Privacy: [
    ['Location Services', 'Off'],
    ['Diagnostics', 'Off'],
    ['File History', 'On'],
  ],
};
