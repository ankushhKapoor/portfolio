import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const ASSETS_DIR = path.join(process.cwd(), 'public', 'assets', 'os');

function getIcon(filename: string, isDir: boolean): string {
    if (isDir) return '📁';
    const ext = path.extname(filename).toLowerCase();
    switch (ext) {
        case '.pdf': return '📋';
        case '.txt':
        case '.md': return '📄';
        case '.iso':
        case '.img': return '💿';
        case '.zip':
        case '.gz':
        case '.tar':
        case '.rar': return '📦';
        case '.doc':
        case '.docx': return '📝';
        default: return '📄';
    }
}

function scanDir(dirPath: string, virtualPath: string = 'Home'): Record<string, any[]> {
    const result: Record<string, any[]> = {};
    const items = fs.readdirSync(dirPath, { withFileTypes: true });

    const entries = items.map(item => {
        const isDir = item.isDirectory();
        const itemPath = path.join(dirPath, item.name);

        // Normalize paths for comparison
        const normalizedItemPath = itemPath.split(path.sep).join('/');
        const normalizedAssetsDir = ASSETS_DIR.split(path.sep).join('/');
        const relativeSrc = '/assets/os' + normalizedItemPath.replace(normalizedAssetsDir, '');

        const stats = fs.statSync(itemPath);
        const entry: { n: string; icon: string; dir?: boolean; src?: string; size?: number; mtime?: string } = {
            n: item.name,
            icon: getIcon(item.name, isDir),
            size: stats.size,
            mtime: stats.mtime.toISOString(),
        };

        if (isDir) {
            entry.dir = true;
            const subResult = scanDir(itemPath, item.name);
            Object.assign(result, subResult);
        } else {
            entry.src = relativeSrc;
        }

        return entry;
    });

    result[virtualPath] = entries;
    return result;
}

export async function GET() {
    try {
        if (!fs.existsSync(ASSETS_DIR)) {
            return NextResponse.json({ Home: [] });
        }
        const data = scanDir(ASSETS_DIR);
        return NextResponse.json(data);
    } catch (error) {
        console.error('API FS Error:', error);
        return NextResponse.json({ error: 'Failed to read filesystem' }, { status: 500 });
    }
}
