import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { name, email, message } = await req.json();

        if (!name || !email || !message) {
            return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
        }

        // Use Resend to send the email
        const RESEND_API_KEY = process.env.RESEND_API_KEY;
        if (!RESEND_API_KEY) {
            // If no API key configured, log to console (dev mode)
            console.log(`[Contact Form] From: ${name} <${email}>\nMessage: ${message}`);
            return NextResponse.json({ success: true });
        }

        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: 'Portfolio Contact <onboarding@resend.dev>',
                to: 'work.ankushkapoor1626@gmail.com',
                reply_to: email,
                subject: `Portfolio message from ${name}`,
                html: `
          <div style="font-family: 'Courier New', monospace; background: #0c0c0c; color: #ededed; padding: 32px; border-radius: 8px; max-width: 600px;">
            <div style="border-bottom: 1px solid rgba(233,84,32,0.3); padding-bottom: 16px; margin-bottom: 24px;">
              <h2 style="color: #e95420; margin: 0; font-size: 20px;">New message from your portfolio</h2>
            </div>
            <p style="color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 4px;">From</p>
            <p style="color: #ededed; font-size: 16px; margin: 0 0 8px;">${name}</p>
            <p style="color: #888; font-size: 12px; margin: 0 0 24px;">${email}</p>
            <p style="color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 8px;">Message</p>
            <p style="color: #ccc; font-size: 15px; line-height: 1.7; margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
        `,
            }),
        });

        if (!res.ok) {
            const err = await res.text();
            console.error('Resend error:', err);
            return NextResponse.json({ error: 'Failed to send email. Please try again.' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('Contact API error:', err);
        return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
    }
}
