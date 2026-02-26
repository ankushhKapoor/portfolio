// Re-export lucide-react icons with Ubuntu-system-icon naming
// lucide-react's design language matches Ubuntu's Yaru symbolic icons

export {
    Terminal as TerminalIcon,
    Folder as FolderIcon,
    User as UserIcon,
    FileText as FileTextIcon,
    Briefcase as BriefcaseIcon,
    Calendar as CalendarIcon,
    Settings as SettingsIcon,
    Wifi as WifiOnIcon,
    WifiOff as WifiOffIcon,
    Volume2 as VolumeIcon,
    VolumeX as VolumeMuteIcon,
    Sun as BrightnessIcon,
    Battery as BatteryIcon,
    Power as PowerIcon,
    Lock as LockIcon,
    RotateCcw as RestartIcon,
    Home as HomeIcon,
    File as FileIcon,
    Download as DownloadIcon,
    X as CloseIcon,
    Minus as MinimizeIcon,
    Square as MaximizeIcon,
    Bluetooth as BluetoothIcon,
    BellOff as DoNotDisturbIcon,
    PlaneTakeoff as AirplaneIcon,
    ChevronRight,
    ChevronLeft,
    ChevronUp,
    ChevronDown,
    Globe,
    Moon,
    Laptop,
    Clock,
    Search as SearchIcon,
    LayoutGrid as GridIcon,
} from 'lucide-react';

export function UbuntuIcon({ size = 24 }: { size?: number; color?: string }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M16 2L4 28H10L16 14L22 28H28L16 2Z"
                fill="white"
            />
            <rect x="11.5" y="19" width="9" height="3.5" fill="white" />
        </svg>
    );
}
