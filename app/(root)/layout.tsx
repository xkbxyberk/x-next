import { Metadata } from 'next';

export const metadata: Metadata = {
    metadataBase: new URL('https://xdownloaderz.com'),
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
