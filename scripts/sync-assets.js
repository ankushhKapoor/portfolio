const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(process.cwd(), 'public', 'assets', 'os');
const OUTPUT_FILE = path.join(process.cwd(), 'lib', 'fs-initial.json');

function getIcon(filename, isDir) {
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

function scanDir(dirPath, virtualPath = 'Home') {
    const result = {};
    const items = fs.readdirSync(dirPath, { withFileTypes: true });

    const entries = items.map(item => {
        const isDir = item.isDirectory();
        const itemPath = path.join(dirPath, item.name);

        // Normalize paths for comparison
        const normalizedItemPath = itemPath.split(path.sep).join('/');
        const normalizedAssetsDir = ASSETS_DIR.split(path.sep).join('/');
        const relativeSrc = '/assets/os' + normalizedItemPath.replace(normalizedAssetsDir, '');

        const entry = {
            n: item.name,
            icon: getIcon(item.name, isDir),
        };

        if (isDir) {
            entry.dir = true;
            console.log(`Scanning dir: ${itemPath}`);
            const subResult = scanDir(itemPath, item.name);
            Object.assign(result, subResult);
        } else {
            entry.src = relativeSrc;
        }

        return entry;
    });

    console.log(`Virtual Path ${virtualPath}: found ${entries.length} items`);
    result[virtualPath] = entries;
    return result;
}

try {
    if (!fs.existsSync(ASSETS_DIR)) {
        fs.mkdirSync(ASSETS_DIR, { recursive: true });
    }

    const fsData = scanDir(ASSETS_DIR);
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(fsData, null, 2));
    console.log('Successfully synced assets to', OUTPUT_FILE);
} catch (err) {
    console.error('Error syncing assets:', err);
    process.exit(1);
}
