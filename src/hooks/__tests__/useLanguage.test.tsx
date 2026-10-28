import { renderHook, act } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  LANGUAGE_STORAGE_KEY,
  detectInitialLanguage,
  resetLanguageMemoryFallback,
  useLanguage,
} from '../useLanguage';
import { useReducedMotion } from '../useReducedMotion';

describe('detectInitialLanguage & useLanguage (RF-002.1, RF-002.2, CA-02)', () => {
  let store: Record<string, string> = {};
  let localStorageMock: Storage;

  beforeEach(() => {
    resetLanguageMemoryFallback();
    store = {};
    localStorageMock = {
      getItem: vi.fn((key: string) => (key in store ? store[key] : null)),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = String(value);
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key];
      }),
      clear: vi.fn(() => {
        store = {};
      }),
      key: vi.fn((index: number) => Object.keys(store)[index] ?? null),
      get length() {
        return Object.keys(store).length;
      },
    };
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      configurable: true,
      writable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('detects Spanish for es and regional variants (es-ES, es-MX, es-AR) and English as universal fallback (ca-ES, fr-FR, de-DE, en-US)', () => {
    expect(detectInitialLanguage(null, 'es')).toBe('es');
    expect(detectInitialLanguage(null, 'es-ES')).toBe('es');
    expect(detectInitialLanguage(null, 'es-AR')).toBe('es');
    expect(detectInitialLanguage(null, 'es-MX')).toBe('es');
    expect(detectInitialLanguage(undefined, 'ES-es')).toBe('es');

    expect(detectInitialLanguage(null, 'ca-ES')).toBe('en');
    expect(detectInitialLanguage(null, 'fr-FR')).toBe('en');
    expect(detectInitialLanguage(null, 'de-DE')).toBe('en');
    expect(detectInitialLanguage(null, 'en-US')).toBe('en');
    expect(detectInitialLanguage(null, '')).toBe('en');
    expect(detectInitialLanguage(undefined, undefined)).toBe('en');
  });

  it('prioritizes valid stored language in localStorage over navigator.language', () => {
    expect(detectInitialLanguage('es', 'en-US')).toBe('es');
    expect(detectInitialLanguage('en', 'es-ES')).toBe('en');
    expect(detectInitialLanguage('invalid', 'es-ES')).toBe('es');
  });

  it('initializes from navigator.language and persists language changes in localStorage', () => {
    vi.spyOn(window.navigator, 'language', 'get').mockReturnValue('es-ES');

    const { result } = renderHook(() => useLanguage());
    expect(result.current.language).toBe('es');
    expect(result.current.t.actions.saveContact).toBe('Guardar Contacto');

    act(() => {
      result.current.setLanguage('en');
    });

    expect(result.current.language).toBe('en');
    expect(result.current.t.actions.saveContact).toBe('Save Contact');
    expect(window.localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('en');

    act(() => {
      result.current.toggleLanguage();
    });

    expect(result.current.language).toBe('es');
    expect(window.localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('es');
  });

  it('degrades gracefully to in-memory state when localStorage throws SecurityError', () => {
    vi.spyOn(window.navigator, 'language', 'get').mockReturnValue('ca-ES');
    vi.spyOn(window.localStorage, 'getItem').mockImplementation(() => {
      throw new DOMException('Blocked by strict privacy policy', 'SecurityError');
    });
    vi.spyOn(window.localStorage, 'setItem').mockImplementation(() => {
      throw new DOMException('Blocked by strict privacy policy', 'SecurityError');
    });

    const { result, unmount } = renderHook(() => useLanguage());
    expect(result.current.language).toBe('en');

    act(() => {
      result.current.setLanguage('es');
    });

    expect(result.current.language).toBe('es');
    expect(result.current.t.actions.saveContact).toBe('Guardar Contacto');

    unmount();

    const { result: secondMount } = renderHook(() => useLanguage());
    expect(secondMount.current.language).toBe('es');
  });
});

describe('useReducedMotion (RF-001.2, RF-004.2, CA-03)', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('reflects prefers-reduced-motion media query status and reacts to changes', () => {
    let changeHandler: ((e: MediaQueryListEvent) => void) | null = null;

    vi.spyOn(window, 'matchMedia').mockImplementation((query: string) => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn((event: string, cb: EventListenerOrEventListenerObject) => {
        if (event === 'change' && typeof cb === 'function') {
          changeHandler = cb as (e: MediaQueryListEvent) => void;
        }
      }),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);

    act(() => {
      if (changeHandler) {
        changeHandler({ matches: false } as MediaQueryListEvent);
      }
    });

    expect(result.current).toBe(false);
  });
});
