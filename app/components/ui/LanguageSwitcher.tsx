'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Check } from 'lucide-react';

// Dil - Bayrak Eşleşmesi (40 Dil)
const FLAGS: Record<string, string> = {
    ar: '🇸🇦', bg: '🇧🇬', bn: '🇧🇩', br: '🇧🇷', cs: '🇨🇿', da: '🇩🇰', de: '🇩🇪', el: '🇬🇷',
    en: '🇬🇧', es: '🇪🇸', fa: '🇮🇷', fi: '🇫🇮', fr: '🇫🇷', he: '🇮🇱', hi: '🇮🇳', hr: '🇭🇷',
    hu: '🇭🇺', id: '🇮🇩', it: '🇮🇹', ja: '🇯🇵', km: '🇰🇭', ko: '🇰🇷', ms: '🇲🇾', ne: '🇳🇵',
    nl: '🇳🇱', no: '🇳🇴', pl: '🇵🇱', pt: '🇵🇹', ro: '🇷🇴', ru: '🇷🇺', sr: '🇷🇸', sv: '🇸🇪',
    sw: '🇰🇪', th: '🇹🇭', tl: '🇵🇭', tr: '🇹🇷', uk: '🇺🇦', ur: '🇵🇰', vi: '🇻🇳', zh: '🇨🇳'
};

const LANGUAGE_NAMES: Record<string, string> = {
    ar: 'العربية', bg: 'Български', bn: 'বাংলা', br: 'Português (BR)', cs: 'Čeština',
    da: 'Dansk', de: 'Deutsch', el: 'Ελληνικά', en: 'English', es: 'Español',
    fa: 'فارسی', fi: 'Suomi', fr: 'Français', he: 'עברית', hi: 'हिन्दी',
    hr: 'Hrvatski', hu: 'Magyar', id: 'Bahasa Indonesia', it: 'Italiano', ja: '日本語',
    km: 'ខ្មែរ', ko: '한국어', ms: 'Bahasa Melayu', ne: 'नेपाली', nl: 'Nederlands',
    no: 'Norsk', pl: 'Polski', pt: 'Português', ro: 'Română', ru: 'Русский',
    sr: 'Српски', sv: 'Svenska', sw: 'Kiswahili', th: 'ไทย', tl: 'Filipino',
    tr: 'Türkçe', uk: 'Українська', ur: 'اردو', vi: 'Tiếng Việt', zh: '中文'
};

export default function LanguageSwitcher() {
    const pathname = usePathname();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Mevcut dili URL'den anla
    const currentLang = pathname.split('/')[1] || 'en';
    const currentFlag = FLAGS[currentLang] || '🌐';

    const handleLanguageChange = (locale: string) => {
        if (locale === currentLang) {
            setIsOpen(false);
            return;
        }

        // Debugging
        console.log(`Switching Language -> Current: ${pathname}, Target: ${locale}`);

        let newPath = "/";

        if (!pathname) {
            newPath = `/${locale}`;
        } else {
            const segments = pathname.split("/");
            // segments[1] is the locale because path usually starts with / (e.g., /en/about -> ["", "en", "about"])
            // If we are at root "/", segments is ["", ""]

            if (segments.length > 1 && FLAGS[segments[1]]) {
                // If the second segment is a known language code, replace it
                segments[1] = locale;
                newPath = segments.join("/");
            } else {
                // If no language code present (e.g. root or unknown), prepend logic
                // Avoid double slashes: if path is "/", result should be "/locale"
                if (pathname === "/") {
                    newPath = `/${locale}`;
                } else {
                    newPath = `/${locale}${pathname}`;
                }
            }
        }

        // Ensure path starts with / and clean potential double slashes
        if (!newPath.startsWith("/")) newPath = `/${newPath}`;

        console.log(`Generated Path: ${newPath}`);

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

    // Alfabetik sıralama (Opsiyonel, şu an listeye göre)
    const sortedLangs = Object.keys(FLAGS).sort();

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-center w-10 h-10 rounded-full transition-all cursor-pointer ${isOpen ? 'bg-(--accent)/20 scale-110' : 'hover:bg-(--accent)/10'}`}
                title="Dil Seçin / Select Language"
            >
                <span className="text-2xl leading-none pt-1">{currentFlag}</span>
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-(--background) border border-(--border) rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-3 py-2 text-xs font-bold text-(--text-secondary) uppercase tracking-wider mb-1 border-b border-(--border)">
                        Select Language ({Object.keys(FLAGS).length})
                    </div>

                    <div className="max-h-80 overflow-y-auto pr-1 custom-scrollbar">
                        {sortedLangs.map((lang) => (
                            <button
                                key={lang}
                                onClick={() => handleLanguageChange(lang)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer group ${currentLang === lang
                                    ? 'bg-(--accent)/10'
                                    : 'hover:bg-(--background-secondary)'
                                    }`}
                            >
                                <span className="text-xl shrink-0">{FLAGS[lang]}</span>
                                <span className={`text-sm truncate ${currentLang === lang ? 'font-bold text-(--accent)' : 'font-medium text-(--text-primary)'}`}>
                                    {LANGUAGE_NAMES[lang]}
                                </span>
                                {currentLang === lang && <Check className="ml-auto text-(--accent)" size={16} />}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
