import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import {
  Loader,
  LOADER_DURATION_MS,
  LOADER_MESSAGES,
  LOADER_SESSION_KEY,
  resetLoaderMemoryFallback,
  shouldSkipLoader,
  shouldShowLoader,
} from '../Loader';
import { EncryptedText } from '../../ui/encrypted-text';
import { containsEmoji } from '../../../lib/utils';

function mockReducedMotion(matches: boolean): void {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: query.includes('prefers-reduced-motion') ? matches : false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

describe('Loader & EncryptedText (RF-001.1, RF-001.2, RF-013.1, RF-013.2, CA-03)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    window.sessionStorage.clear();
    resetLoaderMemoryFallback();
    mockReducedMotion(false);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('has LOADER_DURATION_MS set to 1400ms and zero emojis in all loader messages (RF-001.1, RF-013.2)', () => {
    expect(LOADER_DURATION_MS).toBe(1400);
    expect(LOADER_SESSION_KEY).toBe('io_card_loaded_session');
    expect(LOADER_MESSAGES).toEqual([
      'Initializing System...',
      'Decrypting modules...',
      'Access Granted.',
    ]);

    for (const msg of LOADER_MESSAGES) {
      expect(containsEmoji(msg)).toBe(false);
    }
  });

  it('progresses through the 3 states over ~1.4s on first visit and marks sessionStorage (RF-001.1, RF-013.1, CA-03)', () => {
    const onComplete = vi.fn();
    const setLoading = vi.fn();

    expect(shouldSkipLoader(false)).toBe(false);
    expect(shouldShowLoader(false)).toBe(true);

    const { container } = render(<Loader onComplete={onComplete} setLoading={setLoading} />);

    // Step 1 at 0ms: "Initializing System..."
    const loaderEl = screen.getByTestId('system-loader');
    expect(loaderEl).toBeInTheDocument();
    expect(loaderEl.className).toContain('bg-black');
    expect(screen.getByText('Initializing System...')).toBeInTheDocument();

    // Progress bar has emerald-500 and luminescence shadow
    const progressBar = screen.getByTestId('loader-progress-bar');
    expect(progressBar.className).toContain('bg-emerald-500');
    expect(progressBar.className).toContain('shadow-[0_0_15px_rgba(16,185,129,0.5)]');

    // Zero emojis in rendered DOM
    expect(containsEmoji(container.textContent ?? '')).toBe(false);
    expect(onComplete).not.toHaveBeenCalled();

    // Step 2 at 500ms: "Decrypting modules..."
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(screen.getByText('Decrypting modules...')).toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();

    // Step 3 at 1000ms: "Access Granted."
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(screen.getByText('Access Granted.')).toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();

    // Completion at 1400ms total
    act(() => {
      vi.advanceTimersByTime(400);
    });
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(setLoading).toHaveBeenCalledWith(false);
    expect(window.sessionStorage.getItem(LOADER_SESSION_KEY)).toBe('1');
    expect(screen.queryByTestId('system-loader')).not.toBeInTheDocument();
  });

  it('skips the loader immediately (0 ms) on subsequent visits in the same session (RF-001.2, CA-03)', () => {
    window.sessionStorage.setItem(LOADER_SESSION_KEY, '1');

    expect(shouldSkipLoader(false)).toBe(true);
    expect(shouldShowLoader(false)).toBe(false);

    const onComplete = vi.fn();
    render(<Loader onComplete={onComplete} />);

    // Omitted immediately at 0ms without advancing timers
    expect(screen.queryByTestId('system-loader')).not.toBeInTheDocument();
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('skips the loader immediately (0 ms) when prefers-reduced-motion: reduce is active (RF-001.2, CA-03)', () => {
    mockReducedMotion(true);

    expect(shouldSkipLoader(true)).toBe(true);
    expect(shouldShowLoader(true)).toBe(false);

    const onComplete = vi.fn();
    render(<Loader onComplete={onComplete} />);

    // Omitted immediately at 0ms on first visit because reduced motion is active
    expect(screen.queryByTestId('system-loader')).not.toBeInTheDocument();
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('degrades gracefully with in-memory fallback when sessionStorage throws SecurityError (Spec 4.1)', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('Blocked', 'SecurityError');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Blocked', 'SecurityError');
    });

    const firstComplete = vi.fn();
    const { unmount } = render(<Loader onComplete={firstComplete} />);

    // First visit in memory still renders loader without throwing
    expect(screen.getByTestId('system-loader')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(LOADER_DURATION_MS);
    });
    expect(firstComplete).toHaveBeenCalledTimes(1);
    unmount();

    // Second visit in same session uses memory fallback and skips in 0ms
    const secondComplete = vi.fn();
    render(<Loader onComplete={secondComplete} />);
    expect(screen.queryByTestId('system-loader')).not.toBeInTheDocument();
    expect(secondComplete).toHaveBeenCalledTimes(1);
  });

  it('renders EncryptedText cleanly and respects prefers-reduced-motion: reduce', () => {
    mockReducedMotion(true);
    render(<EncryptedText text="Access Granted." duration={400} interval={30} />);

    const element = screen.getByText('Access Granted.');
    expect(element).toBeInTheDocument();
    expect(element).toHaveAttribute('data-scrambling', 'false');
    expect(containsEmoji(element.textContent ?? '')).toBe(false);
  });

  it('scrambles EncryptedText progressively when reduced motion is false and resolves to exact text', () => {
    mockReducedMotion(false);
    render(<EncryptedText text="Decrypting modules..." duration={300} interval={30} />);

    // Accessible text is always queryable
    expect(screen.getByText('Decrypting modules...')).toBeInTheDocument();

    // Advance partway through scramble
    act(() => {
      vi.advanceTimersByTime(60);
    });
    expect(screen.getByText('Decrypting modules...')).toBeInTheDocument();

    // Advance past full duration to complete scramble
    act(() => {
      vi.advanceTimersByTime(400);
    });
    const finalEl = screen.getByText('Decrypting modules...');
    expect(finalEl).toBeInTheDocument();
    expect(finalEl).toHaveAttribute('data-scrambling', 'false');
  });
});
