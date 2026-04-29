import { NextResponse } from 'next/server';

const RESUME_URL = 'https://raw.githubusercontent.com/ankushhKapoor/resume/main/Ankush_Kapoor_Resume.pdf';

export async function GET() {
    try {
        const res = await fetch(RESUME_URL, { next: { revalidate: 3600 } });
        if (!res.ok) {
            return new NextResponse('Failed to fetch resume', { status: 502 });
        }
        const buffer = await res.arrayBuffer();
        return new NextResponse(buffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'inline; filename="Ankush_Kapoor_Resume.pdf"',
                'Cache-Control': 'public, max-age=3600',
            },
        });
    } catch {
        return new NextResponse('Error fetching resume', { status: 500 });
    }
}
