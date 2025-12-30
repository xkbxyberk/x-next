import { ImageResponse } from 'next/og';
import { readFileSync } from 'fs';
import { join } from 'path';

export const runtime = 'nodejs';

// Image metadata
export const alt = 'XDownloaderz - X (Twitter) Video Downloader';
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
    // Default to English or Generic for the root domain
    const langName = 'English';

    // Load the logo using fs
    const iconPath = join(process.cwd(), 'app/icon-w.png');
    const iconBuffer = readFileSync(iconPath);
    const iconDataUrl = `data:image/png;base64,${iconBuffer.toString('base64')}`;

    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#000000',
                    backgroundImage: 'radial-gradient(circle at 100% 0%, #2a4354ff 0%, #0d151aff 50%)',
                    fontFamily: 'sans-serif',
                }}
            >
                {/* Abstract Background Shapes */}
                <div style={{
                    position: 'absolute',
                    top: '-20%',
                    right: '-10%',
                    width: '600px',
                    height: '600px',
                    background: 'radial-gradient(circle, rgba(29, 156, 240, 0.3) 0%, rgba(0,0,0,0) 70%)',
                    borderRadius: '50%',
                    filter: 'blur(40px)',
                }} />

                <div style={{
                    position: 'absolute',
                    bottom: '-20%',
                    left: '-10%',
                    width: '500px',
                    height: '500px',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0) 70%)',
                    borderRadius: '50%',
                    filter: 'blur(40px)',
                }} />

                {/* Glassmorphic Card Container */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '60px 80px',
                    borderRadius: '40px',
                    background: '#1d9cf028',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                    position: 'relative',
                    zIndex: 10,
                }}>
                    {/* Logo Area */}
                    <div style={{
                        display: 'flex',
                        background: '#1d9bf0',
                        padding: '6px',
                        borderRadius: '30px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                        marginBottom: '20px',
                    }}>
                        {/* @ts-ignore */}
                        <img width="128" height="128" src={iconDataUrl} alt="XDownloaderz Logo" />
                    </div>

                    {/* Title */}
                    <h1 style={{
                        fontSize: 80,
                        fontWeight: 900,
                        background: 'linear-gradient(to bottom, #ffffff, #a5a5a5)',
                        backgroundClip: 'text',
                        color: 'transparent',
                        margin: 0,
                        lineHeight: 1.1,
                        letterSpacing: '-0.03em',
                    }}>
                        XDownloaderz
                    </h1>

                    {/* Subtitle / Description */}
                    <p style={{
                        fontSize: 32,
                        color: '#8899a6',
                        margin: '20px 0 40px 0',
                        fontWeight: 500,
                    }}>
                        X (Twitter) Video Downloader & Converter
                    </p>

                    {/* Language Badge */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '12px 32px',
                        background: 'rgba(29, 155, 240, 0.15)',
                        border: '1px solid rgba(29, 155, 240, 0.3)',
                        borderRadius: '100px',
                        color: '#1d9bf0',
                        fontSize: 24,
                        fontWeight: 600,
                        letterSpacing: '0.02em',
                    }}>
                        {langName}
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
