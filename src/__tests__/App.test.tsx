import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, within, act } from '@testing-library/react';
import { App } from '../App';
import {
  AUTHORIZED_PROFILE,
  CORE_TECHNOLOGIES,
  getTranslations,
} from '../data/profile';
import {
  LANGUAGE_STORAGE_KEY,
  resetLanguageMemoryFallback,
} from '../hooks/useLanguage';
import {
  LOADER_DURATION_MS,
  LOADER_SESSION_KEY,
  markLoaderSessionComplete,
  resetLoaderMemoryFallback,
} from '../components/sections/Loader';
import {
  NFC_SESSION_KEY,
  resetNfcMemoryFallback,
} from '../lib/analytics';
import * as analyticsModule from '../lib/analytics';
import { VCARD_FILENAME, generateVCardString } from '../lib/vcard';
import { containsEmoji } from '../lib/utils';

import headersRaw from '../../public/_headers?raw';
import manifestRaw from '../../public/manifest.webmanifest?raw';
import dockerfileRaw from '../../Dockerfile?raw';
import nginxConfRaw from '../../nginx.conf?raw';
import dockerComposeRaw from '../../docker-compose.yml?raw';

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

/**
 * Recursively inspects an Element and all its descendants for any Unicode emoji
 * in text nodes and visible/accessible attributes (aria-label, placeholder, title, alt).
 */
function collectAllDomStrings(root: HTMLElement): string[] {
  const collected: string[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);

  let currentNode: Node | null = walker.currentNode;
  while (currentNode) {
    if (currentNode.nodeType === Node.TEXT_NODE) {
      const text = currentNode.nodeValue?.trim();
      if (text) collected.push(text);
    } else if (currentNode.nodeType === Node.ELEMENT_NODE) {
      const el = currentNode as HTMLElement;
      for (const attr of ['aria-label', 'placeholder', 'title', 'alt']) {
        const val = el.getAttribute(attr);
        if (val) collected.push(val);
      }
    }
    currentNode = walker.nextNode();
  }
  return collected;
}

describe('App End-to-End Integration Suite (CA-01 to CA-07, RF-001 to RF-014)', () => {
  let localStore: Record<string, string> = {};
  let sessionStore: Record<string, string> = {};
  const originalLocation = window.location;

  beforeEach(() => {
    localStore = {};
    sessionStore = {};

    const localStorageMock: Storage = {
      getItem: vi.fn((key: string) => (key in localStore ? localStore[key] : null)),
      setItem: vi.fn((key: string, value: string) => {
        localStore[key] = String(value);
      }),
      removeItem: vi.fn((key: string) => {
        delete localStore[key];
      }),
      clear: vi.fn(() => {
        localStore = {};
      }),
      key: vi.fn((index: number) => Object.keys(localStore)[index] ?? null),
      get length() {
        return Object.keys(localStore).length;
      },
    };

    const sessionStorageMock: Storage = {
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

    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      configurable: true,
      writable: true,
    });
    Object.defineProperty(window, 'sessionStorage', {
      value: sessionStorageMock,
      configurable: true,
      writable: true,
    });

    Object.defineProperty(window, 'location', {
      value: {
        ...originalLocation,
        pathname: '/',
        search: '',
        reload: vi.fn(),
      },
      configurable: true,
      writable: true,
    });

    Object.defineProperty(navigator, 'language', {
      value: 'es-ES',
      configurable: true,
    });

    resetLanguageMemoryFallback();
    resetLoaderMemoryFallback();
    resetNfcMemoryFallback();
    markLoaderSessionComplete();
    mockReducedMotion(false);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('CA-01: displays authorized professional identity above the fold and downloads ivan-olivera.vcf with zero TEL or private address fields (RF-003, RF-005)', async () => {
    const trackSpy = vi.spyOn(analyticsModule, 'trackEvent');
    render(<App />);

    const esDict = getTranslations('es');

    expect(screen.getByRole('heading', { name: AUTHORIZED_PROFILE.name })).toBeInTheDocument();
    expect(screen.getByText(AUTHORIZED_PROFILE.role)).toBeInTheDocument();
    expect(screen.getAllByText(AUTHORIZED_PROFILE.companyRole).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(esDict.hero.location)).toBeInTheDocument();
    expect(screen.getByTestId('languages-badge')).toHaveTextContent(AUTHORIZED_PROFILE.languagesBadge);

    const saveBtn = screen.getByRole('button', { name: esDict.actions.saveContactAria });
    expect(saveBtn).toBeInTheDocument();

    const createObjectUrlMock = vi.fn(() => 'blob:mock-vcard-url');
    const revokeObjectUrlMock = vi.fn();
    Object.defineProperty(window.URL, 'createObjectURL', { value: createObjectUrlMock, writable: true });
    Object.defineProperty(window.URL, 'revokeObjectURL', { value: revokeObjectUrlMock, writable: true });

    fireEvent.click(saveBtn);

    expect(trackSpy).toHaveBeenCalledWith('vcard_download', {
      source: 'hero_cta',
      filename: VCARD_FILENAME,
    });

    const vcfString = generateVCardString(AUTHORIZED_PROFILE);
    expect(vcfString).toContain('BEGIN:VCARD');
    expect(vcfString).toContain('VERSION:3.0');
    expect(vcfString).toContain(`FN:${AUTHORIZED_PROFILE.name}`);
    expect(vcfString).toContain(`TITLE:${AUTHORIZED_PROFILE.role}`);
    expect(vcfString).toContain(`EMAIL;TYPE=INTERNET,WORK:${AUTHORIZED_PROFILE.email}`);
    expect(vcfString).toContain(`ADR;TYPE=WORK:;;;${AUTHORIZED_PROFILE.city};;${AUTHORIZED_PROFILE.country}`);
    expect(vcfString).not.toContain('TEL');
    expect(vcfString).toContain('END:VCARD');
  });

  it('CA-02: switches between ES and EN instantaneously across Header, Hero, Actions and ExecutiveSnapshot and persists preference (RF-002)', async () => {
    render(<App />);

    const esDict = getTranslations('es');
    const enDict = getTranslations('en');

    expect(screen.getByText(esDict.header.statusLabel)).toBeInTheDocument();
    expect(screen.getByText('Software Engineer & Systems Administrator')).toBeInTheDocument();
    expect(screen.getByText(/HP CodeWars/i)).toBeInTheDocument();

    const header = screen.getByTestId('card-header');
    const enBtn = within(header).getByRole('button', { name: esDict.header.switchToEnAria });
    fireEvent.click(enBtn);

    expect(window.localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('en');

    expect(screen.getByText(enDict.header.statusLabel)).toBeInTheDocument();
    expect(screen.getByText('Software Engineer & Systems Administrator')).toBeInTheDocument();
    expect(screen.getByText(/HP CodeWars/i)).toBeInTheDocument();

    const quickActions = screen.getByTestId('quick-actions');
    fireEvent.click(
      within(quickActions).getByRole('button', { name: enDict.actions.qrAria })
    );
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByRole('heading', { name: enDict.qrModal.title })).toBeInTheDocument();

    const esBtn = within(header).getByRole('button', { name: enDict.header.switchToEsAria });
    fireEvent.click(esBtn);
    expect(window.localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('es');
    expect(within(dialog).getByRole('heading', { name: esDict.qrModal.title })).toBeInTheDocument();
  });

  it('CA-03: runs the ~1.4s Loader sequence on first session visit and omits it in 0ms on subsequent visit or with prefers-reduced-motion: reduce, disabling 3D tilt (RF-001, RF-004)', () => {
    vi.useFakeTimers();
    window.sessionStorage.clear();
    resetLoaderMemoryFallback();
    mockReducedMotion(false);

    const { unmount } = render(<App />);

    expect(screen.getByTestId('system-loader')).toBeInTheDocument();
    expect(screen.getByText('Initializing System...')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(screen.getByText('Decrypting modules...')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(screen.getByText('Access Granted.')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(LOADER_DURATION_MS - 1000);
    });
    expect(screen.queryByTestId('system-loader')).not.toBeInTheDocument();
    expect(window.sessionStorage.getItem(LOADER_SESSION_KEY)).toBe('1');

    unmount();

    const secondRender = render(<App />);
    expect(screen.queryByTestId('system-loader')).not.toBeInTheDocument();
    secondRender.unmount();

    window.sessionStorage.clear();
    resetLoaderMemoryFallback();
    mockReducedMotion(true);

    render(<App />);
    expect(screen.queryByTestId('system-loader')).not.toBeInTheDocument();

    const card3d = screen.getByTestId('card-3d-interactive');
    expect(card3d).toHaveAttribute('data-reduced-motion', 'true');
    fireEvent.pointerMove(card3d, { clientX: 300, clientY: 40 });
    expect(card3d).toHaveAttribute('data-tilt-active', 'false');
    expect(Number(card3d.getAttribute('data-rotate-x'))).toBe(0);
    expect(Number(card3d.getAttribute('data-rotate-y'))).toBe(0);
  });

  it('CA-04: recursive DOM inspection across ES, EN, QrSheet, and vCard confirms 0 Unicode emojis (RF-013.2)', () => {
    const { container } = render(<App />);
    const esDict = getTranslations('es');

    for (const text of collectAllDomStrings(container)) {
      expect(containsEmoji(text)).toBe(false);
    }

    const quickActions = screen.getByTestId('quick-actions');
    fireEvent.click(within(quickActions).getByRole('button', { name: esDict.actions.qrAria }));
    for (const text of collectAllDomStrings(document.body)) {
      expect(containsEmoji(text)).toBe(false);
    }

    const header = screen.getByTestId('card-header');
    fireEvent.click(
      within(header).getByRole('button', { name: esDict.header.switchToEnAria })
    );
    for (const text of collectAllDomStrings(document.body)) {
      expect(containsEmoji(text)).toBe(false);
    }

    expect(containsEmoji(generateVCardString(AUTHORIZED_PROFILE))).toBe(false);
  });

  it('CA-05: renders the 6 core technologies, languages badge, Yuvod identity, and PerspectiveDeck milestones', () => {
    render(<App />);

    for (const tech of CORE_TECHNOLOGIES) {
      expect(screen.getByTestId(`hero-tech-${tech}`)).toBeInTheDocument();
    }

    expect(screen.getByTestId('languages-badge')).toHaveTextContent(AUTHORIZED_PROFILE.languagesBadge);
    expect(screen.getAllByText(AUTHORIZED_PROFILE.companyRole).length).toBeGreaterThanOrEqual(1);

    expect(screen.getByText('Software Engineer & Systems Administrator')).toBeInTheDocument();
    expect(screen.getByText(/HP CodeWars/i)).toBeInTheDocument();
    expect(screen.getByText(/DAW \(CEEDCV\) & SMR \(IES El Grao\)/i)).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /ivanolivera\.dev/i }).length).toBeGreaterThanOrEqual(1);
  });

  it('CA-06: detects ?ref=nfc once per session and opens QrSheet with mailto direct action (RF-006, RF-012)', async () => {
    Object.defineProperty(window, 'location', {
      value: { ...originalLocation, pathname: '/', search: '?ref=nfc', reload: vi.fn() },
      configurable: true,
      writable: true,
    });

    const umamiTrack = vi.fn();
    (window as unknown as Record<string, unknown>).umami = { track: umamiTrack };

    const { unmount } = render(<App />);
    expect(window.sessionStorage.getItem(NFC_SESSION_KEY)).toBe('1');
    expect(umamiTrack).toHaveBeenCalledWith('nfc_scan', { entry: 'nfc' });

    unmount();
    render(<App />);
    expect(umamiTrack).toHaveBeenCalledTimes(1);

    const esDict = getTranslations('es');
    const quickActions = screen.getByTestId('quick-actions');

    const emailLink = within(quickActions).getByRole('link', { name: esDict.actions.emailAria });
    expect(emailLink).toHaveAttribute('href', AUTHORIZED_PROFILE.mailtoUrl);

    fireEvent.click(within(quickActions).getByRole('button', { name: esDict.actions.qrAria }));
    expect(screen.getByTestId('qr-code-svg')).toBeInTheDocument();
    expect(screen.getAllByRole('dialog')).toHaveLength(1);
  });

  it('CA-07: renders Cyberpunk ErrorPage when navigating to an unknown path (404)', () => {
    Object.defineProperty(window, 'location', {
      value: { ...originalLocation, pathname: '/404', search: '', reload: vi.fn() },
      configurable: true,
      writable: true,
    });

    render(<App />);

    expect(screen.getByText(/Connection Severed/i)).toBeInTheDocument();
    expect(screen.getByText(/Critical routing failure/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Initialize Reboot/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Retry Uplink/i })).toBeInTheDocument();
  });

  it('validates hybrid deployment artifacts for Cloudflare Pages and Docker container', () => {
    expect(headersRaw).toContain('/*.vcf');
    expect(headersRaw).toContain('Content-Type: text/vcard; charset=utf-8');

    expect(manifestRaw).toContain('"name": "Iván Olivera — Business Card"');
    expect(manifestRaw).toContain('"background_color": "#000000"');
    expect(manifestRaw).toContain('"theme_color": "#10b981"');

    expect(dockerfileRaw).toContain('FROM node:20-alpine');
    expect(dockerfileRaw).toContain('FROM nginx:alpine');

    expect(nginxConfRaw).toContain('text/vcard');
    expect(nginxConfRaw).toContain('gzip on;');

    expect(dockerComposeRaw).toContain('container_name: io_card');
    expect(dockerComposeRaw).toContain('8081:80');
  });
});
