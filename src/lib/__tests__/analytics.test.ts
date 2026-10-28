import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  ANALYTICS_EVENTS,
  NFC_SESSION_KEY,
   type AnalyticsEventName,
  detectAndTrackNfcScan,
  isNfcReferral,
  resetNfcMemoryFallback,
  trackEvent,
} from '../analytics';

describe('analytics — NFC detection & privacy-first telemetry (RF-009.1, RF-009.2, RF-009.3, CA-06)', () => {
  let sessionStore: Record<string, string> = {};
  let sessionStorageMock: Storage;

  beforeEach(() => {
    resetNfcMemoryFallback();
    sessionStore = {};
    sessionStorageMock = {
      getItem: vi.fn((key: string) => (key in sessionStore ? sessionStore[key] : null)),
      setItem: vi.fn((key: string, value: string) => {
        sessionStore[key] = String(value);
      }),
      removeItem: vi.fn((key: string) => {
        delete sessionStore[key];
      }),
      clear: vi.fn(() => {
        sessionStore = {};
      }),
      key: vi.fn((index: number) => Object.keys(sessionStore)[index] ?? null),
      get length() {
        return Object.keys(sessionStore).length;
      },
    };

    Object.defineProperty(window, 'sessionStorage', {
      value: sessionStorageMock,
      configurable: true,
      writable: true,
    });

    delete (window as unknown as Record<string, unknown>).umami;
    delete (window as unknown as Record<string, unknown>).plausible;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    delete (window as unknown as Record<string, unknown>).umami;
    delete (window as unknown as Record<string, unknown>).plausible;
  });

  it('identifies ?ref=nfc and ?source=nfc query parameters case-insensitively', () => {
    expect(isNfcReferral('?ref=nfc')).toBe(true);
    expect(isNfcReferral('?source=nfc')).toBe(true);
    expect(isNfcReferral('?ref=NFC&lang=es')).toBe(true);
    expect(isNfcReferral('?utm_campaign=card&source=NFC')).toBe(true);
    expect(isNfcReferral('https://card.ivanolivera.dev/?ref=nfc')).toBe(true);

    expect(isNfcReferral('')).toBe(false);
    expect(isNfcReferral('?ref=qr')).toBe(false);
    expect(isNfcReferral('?source=linkedin')).toBe(false);
    expect(isNfcReferral('?other=value')).toBe(false);
  });

  it('tracks nfc_scan exactly once per browsing session via sessionStorage (RF-012.1)', () => {
    const umamiTrack = vi.fn();
    (window as unknown as Record<string, unknown>).umami = { track: umamiTrack };

    expect(detectAndTrackNfcScan('?ref=nfc')).toBe(true);
    expect(window.sessionStorage.getItem(NFC_SESSION_KEY)).toBe('1');
    expect(umamiTrack).toHaveBeenCalledTimes(1);
    expect(umamiTrack).toHaveBeenCalledWith('nfc_scan', { entry: 'nfc' });

    // Subsequent reloads or calls within the same session must be deduplicated
    expect(detectAndTrackNfcScan('?ref=nfc')).toBe(false);
    expect(detectAndTrackNfcScan('?source=nfc')).toBe(false);
    expect(umamiTrack).toHaveBeenCalledTimes(1);
  });

  it('does not emit nfc_scan when URL does not contain NFC referral parameters', () => {
    const umamiTrack = vi.fn();
    (window as unknown as Record<string, unknown>).umami = { track: umamiTrack };

    expect(detectAndTrackNfcScan('')).toBe(false);
    expect(detectAndTrackNfcScan('?ref=github')).toBe(false);
    expect(umamiTrack).not.toHaveBeenCalled();
  });

  it('falls back to in-memory deduplication when sessionStorage throws SecurityError', () => {
    const umamiTrack = vi.fn();
    (window as unknown as Record<string, unknown>).umami = { track: umamiTrack };

    vi.spyOn(window.sessionStorage, 'getItem').mockImplementation(() => {
      throw new DOMException('Session storage disabled', 'SecurityError');
    });
    vi.spyOn(window.sessionStorage, 'setItem').mockImplementation(() => {
      throw new DOMException('Session storage disabled', 'SecurityError');
    });

    // Works with default in-memory fallback
    expect(detectAndTrackNfcScan('?source=nfc')).toBe(true);
    expect(detectAndTrackNfcScan('?source=nfc')).toBe(false);
    expect(umamiTrack).toHaveBeenCalledTimes(1);

    // Also works when an explicit memorySet is provided
    const customSet = new Set<string>();
    expect(detectAndTrackNfcScan('?ref=nfc', customSet)).toBe(true);
    expect(detectAndTrackNfcScan('?ref=nfc', customSet)).toBe(false);
    expect(umamiTrack).toHaveBeenCalledTimes(2);
  });

  it('emits all 6 authorized analytics events to Umami or Plausible (RF-012.2)', () => {
    const expectedEvents: readonly AnalyticsEventName[] = [
      'nfc_scan',
      'vcard_download',
      'social_click',
      'project_click',
      'contact_submit',
      'qr_open',
    ];
    expect(ANALYTICS_EVENTS).toEqual(expectedEvents);

    // 1. Verify Umami provider
    const umamiTrack = vi.fn();
    (window as unknown as Record<string, unknown>).umami = { track: umamiTrack };

    for (const eventName of expectedEvents) {
      trackEvent(eventName, { target: eventName });
      expect(umamiTrack).toHaveBeenCalledWith(eventName, { target: eventName });
    }
    expect(umamiTrack).toHaveBeenCalledTimes(6);

    // 2. Verify Plausible provider fallback
    delete (window as unknown as Record<string, unknown>).umami;
    const plausibleTrack = vi.fn();
    (window as unknown as Record<string, unknown>).plausible = plausibleTrack;

    for (const eventName of expectedEvents) {
      trackEvent(eventName, { source: 'test' });
      expect(plausibleTrack).toHaveBeenCalledWith(eventName, { props: { source: 'test' } });
    }
    expect(plausibleTrack).toHaveBeenCalledTimes(6);
  });

  it('degrades silently when no analytics provider exists or when provider throws (RF-012.3)', () => {
    // No provider configured
    expect(() => trackEvent('vcard_download')).not.toThrow();
    expect(() => trackEvent('qr_open', { modal: 'qr' })).not.toThrow();

    // Umami throws error (e.g. blocked by extension)
    (window as unknown as Record<string, unknown>).umami = {
      track: () => {
        throw new Error('Blocked by content blocker');
      },
    };
    expect(() => trackEvent('social_click', { network: 'linkedin' })).not.toThrow();

    // Plausible throws error
    delete (window as unknown as Record<string, unknown>).umami;
    (window as unknown as Record<string, unknown>).plausible = () => {
      throw new Error('Plausible blocked');
    };
    expect(() => trackEvent('contact_submit')).not.toThrow();
  });
});
