'use client';

import { useState, useEffect } from 'react';

const AD_PROBE_URL =
  'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';

const BAIT_CLASS_SETS = [
  'pub_300x250 pub_300x250m textAd text_ad text_ads adsbox ad-banner',
  'adsbygoogle ads-banner ad-slot ad-unit carbon-ads sponsored',
  'advertisement sponsor dfp-ad ad-wrapper display-ad',
  'banner-ad widget_advertising ad-container ad-placement',
];

const DOM_CHECK_DELAY_MS = 500;
const NETWORK_TIMEOUT_MS = 5000;
const BROWSER_BLOCK_THRESHOLD_MS = 30;

type NetworkResult = 'dns-blocked' | 'browser-blocked' | 'ok';

function injectBaits(): HTMLElement[] {
  return BAIT_CLASS_SETS.map((cls) => {
    const el = document.createElement('div');
    el.className = cls;
    el.setAttribute('data-ad-slot', Math.random().toString(36).slice(2, 11));
    el.setAttribute('aria-hidden', 'true');
    el.style.cssText =
      'position:absolute;top:-9999px;left:-9999px;' +
      'width:300px;height:250px;pointer-events:none;';
    document.body.appendChild(el);
    return el;
  });
}

function areBaitsBlocked(baits: HTMLElement[]): boolean {
  return baits.some((el) => {
    if (!document.body.contains(el)) return true;
    const cs = window.getComputedStyle(el);
    return (
      el.offsetHeight === 0 ||
      el.offsetWidth === 0 ||
      cs.display === 'none' ||
      cs.visibility === 'hidden' ||
      cs.opacity === '0' ||
      cs.maxHeight === '0px' ||
      cs.maxWidth === '0px'
    );
  });
}

function removeBaits(baits: HTMLElement[]): void {
  baits.forEach((el) => {
    if (document.body.contains(el)) document.body.removeChild(el);
  });
}

async function checkConnectivity(): Promise<boolean> {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), 2000);
  try {
    const r = await fetch('/favicon.ico', {
      method: 'HEAD',
      cache: 'no-store',
      signal: ac.signal,
    });
    clearTimeout(t);
    return r.ok || r.type === 'opaque';
  } catch {
    clearTimeout(t);
    return false;
  }
}

function probeAdNetwork(): Promise<NetworkResult> {
  return new Promise((resolve) => {
    let settled = false;
    const el = document.createElement('script');
    const t0 = performance.now();

    const settle = (result: NetworkResult) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      el.onload = null;
      el.onerror = null;
      el.parentNode?.removeChild(el);
      resolve(result);
    };

    const timer = setTimeout(() => settle('dns-blocked'), NETWORK_TIMEOUT_MS);

    el.onload = () => settle('ok');
    el.onerror = () => {
      const elapsed = performance.now() - t0;
      settle(elapsed < BROWSER_BLOCK_THRESHOLD_MS ? 'browser-blocked' : 'dns-blocked');
    };

    el.src = `${AD_PROBE_URL}?_cb=${Date.now()}`;
    document.head.appendChild(el);
  });
}

export function useAdblockDetector(): boolean {
  const [isAdblockDetected, setIsAdblockDetected] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const fire = () => {
      if (!cancelled) setIsAdblockDetected(true);
    };

    const baits = injectBaits();
    const networkPromise = probeAdNetwork();
    const connectivityPromise = checkConnectivity();

    const domTimer = setTimeout(async () => {
      try {
        const domBlocked = areBaitsBlocked(baits);
        removeBaits(baits);

        if (domBlocked) {
          fire();
          return;
        }

        const [online, netResult] = await Promise.all([
          connectivityPromise,
          networkPromise,
        ]);

        if (cancelled || !online) return;
        if (netResult === 'dns-blocked') fire();
      } catch {
        removeBaits(baits);
      }
    }, DOM_CHECK_DELAY_MS);

    return () => {
      cancelled = true;
      clearTimeout(domTimer);
      removeBaits(baits);
    };
  }, []);

  return isAdblockDetected;
}
