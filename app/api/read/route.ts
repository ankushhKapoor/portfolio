import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get('path');

    if (!filePath) {
        return NextResponse.json({ error: 'Path is required' }, { status: 400 });
    }

    try {
        const strippedPath = filePath
            .replace(/^\/os\//, '');

        const osDir = path.join(process.cwd(), 'public', 'os');
        const absolutePath = path.join(osDir, strippedPath);

        // Security check: ensure final target stays inside public/os.
        if (!absolutePath.startsWith(osDir)) {
            return NextResponse.json({ error: 'Access denied' }, { status: 403 });
        }

        if (!fs.existsSync(absolutePath)) {
            return NextResponse.json({ error: 'File not found' }, { status: 404 });
        }

        const content = fs.readFileSync(absolutePath, 'utf-8');
        return new Response(content, {
            headers: { 'content-type': 'text/plain; charset=utf-8' },
        });
    } catch (error) {
        console.error('API Read Error:', error);
        return NextResponse.json({ error: 'Failed to read file' }, { status: 500 });
    }
}
