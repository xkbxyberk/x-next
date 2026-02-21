'use client';

import { useCookieConsent } from '@/lib/hooks/use-cookie-consent';

interface CookieConsentProps {
  lang: string;
}

export default function CookieConsent({ lang }: CookieConsentProps) {
  const { consentResolved, handleAccept, handleDecline } = useCookieConsent();

  if (consentResolved) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[200] border-t border-(--border) bg-(--background)/95 backdrop-blur-md">
      <div className="mx-auto max-w-325 flex flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
        <p className="text-sm leading-5 text-(--text-secondary)">
          We use analytics cookies to improve your experience. See our{' '}
          <a
            href={`/${lang}/privacy`}
            className="font-medium text-(--accent) hover:underline"
          >
            Privacy Policy
          </a>
          .
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={handleDecline}
            className="flex-1 rounded-full border border-(--border) px-5 py-2 text-sm font-semibold text-(--text-primary) transition-colors hover:bg-(--background-secondary) md:flex-none"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="flex-1 rounded-full bg-(--accent) px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-(--accent-hover) md:flex-none"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
