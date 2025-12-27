import { ImageResponse } from 'next/og';
import { languages } from '@/lib/constants';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const alt = 'XDownloaderz - X (Twitter) Video Downloader';
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

// Font
// Local font yüklemek edge runtime'da zor olabilir, bu yüzden varsayılan fontları kullanacağız
// veya Google Fonts'tan fetch edebiliriz. Şimdilik basit tutalım.

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const languageName = languages[lang] || 'English';

    return new ImageResponse(
        (
            // ImageResponse JSX element
            <div
                style={{
                    fontSize: 60,
                    background: 'linear-gradient(to bottom right, #000000, #1a1a1a)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontFamily: 'sans-serif',
                    position: 'relative',
                }}
            >
                {/* Background Patterns */}
                <div style={{
                    position: 'absolute',
                    top: '-100px',
                    right: '-100px',
                    width: '400px',
                    height: '400px',
                    background: 'radial-gradient(circle, rgba(29,155,240,0.2) 0%, rgba(0,0,0,0) 70%)',
                    borderRadius: '50%',
                }}></div>

                <div style={{
                    position: 'absolute',
                    bottom: '-50px',
                    left: '-50px',
                    width: '300px',
                    height: '300px',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0) 70%)',
                    borderRadius: '50%',
                }}></div>

                {/* Logo / Icon Area */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 40,
                        padding: '20px',
                        borderRadius: '20px',
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                    }}
                >
                    {/* Basit bir X logosu simülasyonu veya SVG */}
                    <svg
                        width="80"
                        height="80"
                        viewBox="0 0 24 24"
                        fill="white"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                </div>

                {/* Title */}
                <div style={{
                    fontSize: 72,
                    fontWeight: 800,
                    letterSpacing: '-2px',
                    marginBottom: 20,
                    background: 'linear-gradient(to right, #fff, #888)',
                    backgroundClip: 'text',
                    color: 'transparent',
                }}>
                    XDownloaderz
                </div>

                {/* Subtitle / Language */}
                <div style={{
                    fontSize: 32,
                    color: '#1d9bf0', // Twitter Blue
                    fontWeight: 600,
                    marginTop: 10,
                    padding: '10px 30px',
                    background: 'rgba(29,155,240,0.1)',
                    borderRadius: '50px',
                    border: '1px solid rgba(29,155,240,0.3)',
                }}>
                    X (Twitter) Video Downloader - {languageName}
                </div>
            </div>
        ),
        // ImageResponse options
        {
            ...size,
        }
    );
}
