// One place every call to action reports through. When Google Analytics is
// configured (NEXT_PUBLIC_GA_ID) events go to gtag; otherwise they are queued
// on dataLayer so any tag manager added later picks them up. Names follow
// GA4's snake_case convention so they can be marked as key events directly.

type Params = Record<string, string | number | boolean>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function track(event: string, params: Params = {}) {
  if (typeof window === "undefined") return;
  if (typeof window.gtag === "function") {
    window.gtag("event", event, params);
    return;
  }
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...params });
}
