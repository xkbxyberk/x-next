'use client';

import { useState, useEffect } from 'react';

const NETWORK_HONEYPOT_URL =
  'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';

export function useAdblockDetector(): boolean {
  const [isAdblockDetected, setIsAdblockDetected] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const abortController = new AbortController();

    const triggerDetected = () => {
      if (!cancelled) setIsAdblockDetected(true);
    };

    const bait = document.createElement('div');
    bait.className = 'ad-banner pub_300x250 text-ad adsbox ad-unit sponsor adsbygoogle';
    bait.setAttribute('data-ad', 'true');
    bait.style.cssText =
      'position:absolute;top:-9999px;left:-9999px;width:1px;height:1px;pointer-events:none;';

    document.body.appendChild(bait);

    const domTimer = setTimeout(() => {
      const style = window.getComputedStyle(bait);
      const domDetected =
        bait.offsetHeight === 0 ||
        bait.offsetWidth === 0 ||
        style.display === 'none' ||
        style.visibility === 'hidden' ||
        style.opacity === '0' ||
        !document.body.contains(bait);

      if (domDetected) triggerDetected();

      if (document.body.contains(bait)) {
        document.body.removeChild(bait);
      }
    }, 300);

    fetch(NETWORK_HONEYPOT_URL, {
      method: 'HEAD',
      mode: 'no-cors',
      cache: 'no-store',
      signal: abortController.signal,
    }).catch(() => triggerDetected());

    return () => {
      cancelled = true;
      abortController.abort();
      clearTimeout(domTimer);
      if (document.body.contains(bait)) {
        document.body.removeChild(bait);
      }
    };
  }, []);

  return isAdblockDetected;
}
