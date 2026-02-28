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
        // Construct the absolute path
        // filePath is expected to be like '/assets/os/.bashrc'
        const normalizedPath = filePath.startsWith('/assets/os/')
            ? filePath.replace('/assets/os/', '')
            : filePath;

        const absolutePath = path.join(process.cwd(), 'public', 'assets', 'os', normalizedPath);

        // Security check: Ensure the path is within the assets directory
        const assetsDir = path.join(process.cwd(), 'public', 'assets', 'os');
        if (!absolutePath.startsWith(assetsDir)) {
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
