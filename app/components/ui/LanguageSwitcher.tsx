'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Globe, Check } from 'lucide-react';

export default function LanguageSwitcher() {
    const pathname = usePathname();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Mevcut dili URL'den anla (örn: /tr/about -> tr)
    const currentLang = pathname.split('/')[1] as 'tr' | 'en' | string;
    const isTr = currentLang === 'tr';

    const handleLanguageChange = (newLang: 'tr' | 'en') => {
        if (newLang === currentLang) {
            setIsOpen(false);
            return;
        }

        // URL'deki dil segmentini değiştir
        const segments = pathname.split('/');
        segments[1] = newLang; // /tr/... -> /en/...
        const newPath = segments.join('/');

        router.push(newPath);
        setIsOpen(false);
    };

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 rounded-full transition-colors cursor-pointer ${isOpen ? 'bg-(--accent)/20 text-(--accent)' : 'hover:bg-(--accent)/10 text-(--accent)'}`}
                title="Dil Seçin / Select Language"
            >
                <Globe size={20} />
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-(--background) border border-(--border) rounded-xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-3 py-2 text-xs font-bold text-(--text-secondary) uppercase tracking-wider mb-1">
                        Language
                    </div>

                    <button
                        onClick={() => handleLanguageChange('tr')}
                        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-(--background-secondary) rounded-lg transition-colors text-(--text-primary) cursor-pointer group"
                    >
                        <span className="text-lg">🇹🇷</span>
                        <span className={`text-sm ${isTr ? 'font-bold' : 'font-medium'}`}>Türkçe</span>
                        {isTr && <Check className="ml-auto text-blue-500" size={16} />}
                    </button>

                    <button
                        onClick={() => handleLanguageChange('en')}
                        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-(--background-secondary) rounded-lg transition-colors text-(--text-primary) cursor-pointer group"
                    >
                        <span className="text-lg">🇬🇧</span>
                        <span className={`text-sm ${!isTr ? 'font-bold' : 'font-medium'}`}>English</span>
                        {!isTr && <Check className="ml-auto text-blue-500" size={16} />}
                    </button>
                </div>
            )}
        </div>
    );
}
