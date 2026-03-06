export const PORTFOLIO = {
  name: 'Ankush Kapoor',
  title: 'Full-Stack Developer & UI Engineer',
  email: 'ankush.kapoor@gmail.com',
  github: 'github.com/ankushkapoor',
  linkedin: 'linkedin.com/in/ankushkapoor',
  education: { degree: 'B.Tech Computer Science', school: 'IIT Delhi', year: '2018' },
  skills: ['React', 'TypeScript', 'Node.js', 'Python', 'Go', 'GraphQL', 'PostgreSQL', 'Redis', 'Docker', 'Kubernetes'],
  experience: [
    {
      role: 'Senior Software Engineer', company: 'Google', period: '2022–Present',
      desc: 'Led development of large-scale distributed systems, improving reliability by 40%. Mentored a team of 8 engineers across two continents.',
    },
    {
      role: 'Software Engineer II', company: 'Flipkart', period: '2020–2022',
      desc: 'Built high-performance React micro-frontends serving 200M+ users. Reduced initial load time by 60% via code-splitting and advanced caching.',
    },
    {
      role: 'Frontend Engineer', company: 'Razorpay', period: '2018–2020',
      desc: 'Designed and implemented the payment dashboard UI from scratch using React and TypeScript. Shipped 12 major product features.',
    },
  ],
  projects: [
    {
      name: 'DistroWatch Clone', tech: 'React, TypeScript, Node.js',
      desc: 'A full-stack Linux distribution tracker with real-time updates, community reviews, and package comparison tools.',
    },
    {
      name: 'PayFlow Dashboard', tech: 'React, D3.js, Python',
      desc: 'Analytics dashboard for payment processing with real-time charts, anomaly detection, and automated alerting.',
    },
    {
      name: 'OpenGrid', tech: 'Go, Kubernetes, gRPC',
      desc: 'Distributed task scheduler with fault tolerance and automatic failover, handling 10K+ jobs/minute at peak load.',
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
  { id: 'resume-pdf', icon: '📋', label: 'resume.pdf', kind: 'file', path: 'resume.pdf' }
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
