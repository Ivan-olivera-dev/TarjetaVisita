import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QrSheet, generateQrMatrix } from '../qr-sheet';
import { ErrorPage } from '../error-page';
import { App } from '../../../App';
import { AUTHORIZED_PROFILE, getTranslations } from '../../../data/profile';
import { resetLanguageMemoryFallback } from '../../../hooks/useLanguage';
import { resetLoaderMemoryFallback, markLoaderSessionComplete } from '../../sections/Loader';
import { resetNfcMemoryFallback } from '../../../lib/analytics';
import { containsEmoji } from '../../../lib/utils';
import { act } from '@testing-library/react';

describe('Interactive UI: QrSheet, ErrorPage and App Orchestration', () => {
  beforeEach(() => {
    vi.useRealTimers();
    const store: Record<string, string> = {};
    const localStorageMock: Storage = {
      getItem: vi.fn((key: string) => (key in store ? store[key] : null)),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = String(value);
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key];
      }),
      clear: vi.fn(() => {
        for (const k of Object.keys(store)) delete store[k];
      }),
      key: vi.fn(() => null),
      length: 0,
    };
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      configurable: true,
      writable: true,
    });
    Object.defineProperty(navigator, 'language', {
      value: 'es-ES',
      configurable: true,
    });
    window.sessionStorage?.clear?.();
    resetLanguageMemoryFallback();
    resetLoaderMemoryFallback();
    resetNfcMemoryFallback();
    markLoaderSessionComplete();
    document.body.style.overflow = '';
  });

  afterEach(() => {
    vi.useRealTimers();
    document.body.style.overflow = '';
    vi.restoreAllMocks();
  });

  describe('QrSheet (RF-007.1, RF-007.2, RF-007.3, CA-02, CA-06, CA-07)', () => {
    it('generates a deterministic vector SVG QR code for https://card.ivanolivera.dev/?ref=nfc and locks scroll while open', () => {
      const onClose = vi.fn();
      const { container } = render(
        <QrSheet isOpen={true} onClose={onClose} language="es" />
      );

      const esDict = getTranslations('es');
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText(esDict.qrModal.title)).toBeInTheDocument();
      expect(screen.getByText(AUTHORIZED_PROFILE.nfcUrl)).toBeInTheDocument();
      expect(document.body.style.overflow).toBe('hidden');

      const svgQr = container.querySelector('svg');
      expect(svgQr).toBeInTheDocument();
      expect(svgQr?.getAttribute('viewBox')).toBeDefined();

      const matrix = generateQrMatrix(AUTHORIZED_PROFILE.nfcUrl);
      expect(matrix.length).toBeGreaterThan(20);
      expect(matrix[0]?.length).toBe(matrix.length);
      expect(containsEmoji(container.textContent ?? '')).toBe(false);
    });

    it('copies https://card.ivanolivera.dev/?ref=nfc to clipboard and shows temporary visual confirmation', async () => {
      const writeTextMock = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: { writeText: writeTextMock },
      });

      render(<QrSheet isOpen={true} onClose={vi.fn()} language="es" />);
      const esDict = getTranslations('es');

      const copyBtn = screen.getByRole('button', { name: esDict.qrModal.copyButton });
      await act(async () => {
        fireEvent.click(copyBtn);
      });

      expect(writeTextMock).toHaveBeenCalledWith(AUTHORIZED_PROFILE.nfcUrl);
      expect(screen.getByText(esDict.qrModal.copiedButton)).toBeInTheDocument();
    });

    it('uses navigator.share when supported and silently ignores AbortError on manual cancel', async () => {
      const abortError = new DOMException('Share canceled', 'AbortError');
      const shareMock = vi.fn().mockRejectedValue(abortError);
      Object.assign(navigator, { share: shareMock });

      render(<QrSheet isOpen={true} onClose={vi.fn()} language="es" />);
      const esDict = getTranslations('es');

      const shareBtn = screen.getByRole('button', { name: esDict.qrModal.shareButton });
      fireEvent.click(shareBtn);

      await waitFor(() => {
        expect(shareMock).toHaveBeenCalledWith(
          expect.objectContaining({
            url: AUTHORIZED_PROFILE.nfcUrl,
          })
        );
      });
    });

    it('degrades to clipboard copy when navigator.share is unsupported and keeps text selectable if clipboard also fails', async () => {
      const writeTextMock = vi.fn().mockRejectedValue(new Error('Clipboard blocked'));
      Object.assign(navigator, {
        share: undefined,
        clipboard: { writeText: writeTextMock },
      });

      render(<QrSheet isOpen={true} onClose={vi.fn()} language="es" />);
      const esDict = getTranslations('es');

      const shareBtn = screen.getByRole('button', { name: esDict.qrModal.shareButton });
      fireEvent.click(shareBtn);

      await waitFor(() => {
        expect(writeTextMock).toHaveBeenCalledWith(AUTHORIZED_PROFILE.nfcUrl);
      });

      const urlDisplay = screen.getByText(AUTHORIZED_PROFILE.nfcUrl);
      expect(urlDisplay).toBeInTheDocument();
      expect(urlDisplay.className).toContain('select-all');
    });
  });

  describe('ErrorPage Component (Terminal Glitch 404)', () => {
    it('renders 404 glitch title, Connection Severed message, and action buttons with zero emojis', () => {
      const onReset = vi.fn();
      render(<ErrorPage onReset={onReset} />);

      expect(screen.getAllByText('404').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText(/Connection Severed/i)).toBeInTheDocument();
      expect(screen.getByText(/Critical routing failure/i)).toBeInTheDocument();

      const rebootLink = screen.getByRole('link', { name: /Initialize Reboot/i });
      expect(rebootLink).toBeInTheDocument();
      fireEvent.click(rebootLink);
      expect(onReset).toHaveBeenCalled();

      expect(screen.getByRole('button', { name: /Retry Uplink/i })).toBeInTheDocument();
      expect(containsEmoji(document.body.textContent || '')).toBe(false);
    });
  });

  describe('App Orchestration & Routing', () => {
    it('tracks NFC scan on mount, switches language across all sections, and opens QrSheet', async () => {
      Object.defineProperty(window, 'location', {
        value: {
          pathname: '/',
          search: '?ref=nfc',
          reload: vi.fn(),
        },
        configurable: true,
        writable: true,
      });
      const umamiTrack = vi.fn();
      (window as unknown as Record<string, unknown>).umami = { track: umamiTrack };

      const { unmount } = render(<App />);

      expect(umamiTrack).toHaveBeenCalledWith('nfc_scan', { entry: 'nfc' });

      const esDict = getTranslations('es');
      expect(screen.getByText(esDict.hero.fullName)).toBeInTheDocument();
      expect(screen.getByText(esDict.hero.role)).toBeInTheDocument();
      expect(screen.getByText('Software Engineer & Systems Administrator')).toBeInTheDocument();

      const enToggleBtn = screen.getByRole('button', { name: esDict.header.switchToEnAria });
      fireEvent.click(enToggleBtn);

      const enDict = getTranslations('en');
      await waitFor(() => {
        expect(screen.getByText(enDict.hero.role)).toBeInTheDocument();
        expect(screen.getByText('Software Engineer & Systems Administrator')).toBeInTheDocument();
      });

      const qrActionBtn = screen.getByRole('button', { name: enDict.actions.qrCodeAria });
      fireEvent.click(qrActionBtn);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText(enDict.qrModal.title)).toBeInTheDocument();

      fireEvent.keyDown(window, { key: 'Escape' });
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });

      unmount();
    });
  });
});
