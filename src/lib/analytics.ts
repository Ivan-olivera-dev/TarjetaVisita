export const ANALYTICS_EVENTS = [
  'nfc_scan',
  'vcard_download',
  'social_click',
  'project_click',
  'contact_submit',
  'qr_open',
] as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENTS)[number];

export type AnalyticsPayload = Record<string, string | number | boolean | undefined>;

export const NFC_SESSION_KEY = 'io_card_nfc_tracked';

const defaultMemorySet = new Set<string>();

export function resetNfcMemoryFallback(): void {
  defaultMemorySet.clear();
}

export function isNfcReferral(search: string): boolean {
  if (!search) return false;
  const queryString = search.includes('?') ? search.slice(search.indexOf('?')) : search;
  const params = new URLSearchParams(queryString);
  const ref = params.get('ref')?.toLowerCase();
  const source = params.get('source')?.toLowerCase();
  return ref === 'nfc' || source === 'nfc';
}

export function trackEvent(name: AnalyticsEventName, payload?: AnalyticsPayload): void {
  try {
    const win =
      typeof window !== 'undefined'
        ? (window as unknown as Record<string, unknown>)
        : undefined;

    if (win && typeof win.umami === 'object' && win.umami !== null && 'track' in win.umami) {
      const umami = win.umami as { track?: unknown };
      if (typeof umami.track === 'function') {
        (umami.track as (e: string, p?: AnalyticsPayload) => void)(name, payload);
      }
    } else if (win && typeof win.plausible === 'function') {
      (win.plausible as (e: string, o?: { props?: AnalyticsPayload }) => void)(name, {
        props: payload,
      });
    }
  } catch {
    // Degradación silenciosa obligatoria (RF-009.3)
  }
}

export function detectAndTrackNfcScan(
  search: string = typeof window !== 'undefined' ? window.location.search : '',
  memorySet: Set<string> = defaultMemorySet
): boolean {
  if (!isNfcReferral(search)) return false;

  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      if (window.sessionStorage.getItem(NFC_SESSION_KEY) === '1') {
        return false;
      }
      window.sessionStorage.setItem(NFC_SESSION_KEY, '1');
    } else if (memorySet) {
      if (memorySet.has(NFC_SESSION_KEY)) return false;
      memorySet.add(NFC_SESSION_KEY);
    }
  } catch {
    if (memorySet) {
      if (memorySet.has(NFC_SESSION_KEY)) return false;
      memorySet.add(NFC_SESSION_KEY);
    }
  }

  trackEvent('nfc_scan', { entry: 'nfc' });
  return true;
}
