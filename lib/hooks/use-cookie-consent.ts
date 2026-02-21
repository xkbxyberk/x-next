'use client';

import { useState, useEffect } from 'react';

type ConsentValue = 'granted' | 'denied';

type ConsentWindow = Window & typeof globalThis & {
  dataLayer: unknown[];
  gtag: (...args: unknown[]) => void;
};

const CONSENT_STORAGE_KEY = 'xdz_consent';

function pushConsentUpdate(value: ConsentValue): void {
  const w = window as ConsentWindow;
  if (typeof w.gtag !== 'function') return;
  w.gtag('consent', 'update', {
    analytics_storage: value,
    ad_storage: value,
    ad_user_data: value,
    ad_personalization: value,
  });
}

function readStoredConsent(): ConsentValue | null {
  try {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (stored === 'granted' || stored === 'denied') return stored;
    return null;
  } catch {
    return null;
  }
}

function writeStoredConsent(value: ConsentValue): void {
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, value);
  } catch {
  }
}

type CookieConsentResult = {
  consentResolved: boolean;
  handleAccept: () => void;
  handleDecline: () => void;
};

export function useCookieConsent(): CookieConsentResult {
  const [consentResolved, setConsentResolved] = useState(true);

  useEffect(() => {
    const stored = readStoredConsent();
    if (stored !== null) {
      pushConsentUpdate(stored);
    } else {
      setConsentResolved(false);
    }
  }, []);

  function resolve(value: ConsentValue): void {
    writeStoredConsent(value);
    pushConsentUpdate(value);
    setConsentResolved(true);
  }

  return {
    consentResolved,
    handleAccept: () => resolve('granted'),
    handleDecline: () => resolve('denied'),
  };
}
