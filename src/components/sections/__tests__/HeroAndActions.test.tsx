import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '../Header';
import { HeroCard3D } from '../HeroCard3D';
import { QuickActions } from '../QuickActions';
import { calculateTiltFromPoint } from '../../../hooks/useTilt3D';
import {
  AUTHORIZED_PROFILE,
  CORE_TECHNOLOGIES,
  LANGUAGES_BADGE,
  getTranslations,
} from '../../../data/profile';
import { LANGUAGE_STORAGE_KEY, resetLanguageMemoryFallback } from '../../../hooks/useLanguage';
import * as vcardModule from '../../../lib/vcard';
import * as analyticsModule from '../../../lib/analytics';
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

describe('Header, HeroCard3D & QuickActions (T5 — RF-002.2, RF-003.1, RF-004, RF-005.1, RF-006.1, RF-012.2, RF-013)', () => {
  let store: Record<string, string> = {};

  beforeEach(() => {
    store = {};
    const localStorageMock: Storage = {
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
    window.sessionStorage?.clear?.();
    resetLanguageMemoryFallback();
    mockReducedMotion(false);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Header (RF-002.2, RF-013.3, CA-02, CA-07)', () => {
    it('renders monogram I. O., active status badge, and ES/EN buttons with >=44x44px touch targets and translated aria-labels', () => {
      const onLanguageChange = vi.fn();
      const { container, rerender } = render(
        <Header language="es" onLanguageChange={onLanguageChange} />
      );

      expect(screen.getByText('I. O.')).toBeInTheDocument();
      expect(screen.getByText('Disponible · NFC Activo')).toBeInTheDocument();

      const esBtn = screen.getByRole('button', { name: 'Cambiar idioma a Español' });
      const enBtn = screen.getByRole('button', { name: 'Cambiar idioma a Inglés' });

      expect(esBtn).toBeInTheDocument();
      expect(enBtn).toBeInTheDocument();
      expect(esBtn).toHaveAttribute('aria-pressed', 'true');
      expect(enBtn).toHaveAttribute('aria-pressed', 'false');

      expect(esBtn.className).toContain('min-h-[44px]');
      expect(esBtn.className).toContain('min-w-[44px]');
      expect(enBtn.className).toContain('min-h-[44px]');
      expect(enBtn.className).toContain('min-w-[44px]');

      fireEvent.click(enBtn);
      expect(onLanguageChange).toHaveBeenCalledWith('en');
      expect(window.localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('en');

      rerender(<Header language="en" onLanguageChange={onLanguageChange} />);
      expect(screen.getByText('Available · NFC Active')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Switch language to Spanish' })).toHaveAttribute(
        'aria-pressed',
        'false'
      );
      expect(screen.getByRole('button', { name: 'Switch language to English' })).toHaveAttribute(
        'aria-pressed',
        'true'
      );

      expect(containsEmoji(container.textContent ?? '')).toBe(false);
    });
  });

  describe('HeroCard3D & useTilt3D (RF-003.1, RF-003.2, RF-004.1, RF-004.2, RF-010.2, CA-03, CA-04, CA-05)', () => {
    it('renders full identity, role Software Engineer & Systems Specialist, Yuvod & Valencia location, the 6 core technologies, compact badge ES · EN · VAL (Fluent), NFC vector chip, and omits the long biography paragraph with zero emojis', () => {
      const { container, rerender } = render(<HeroCard3D language="es" />);
      const esDict = getTranslations('es');
      const enDict = getTranslations('en');

      expect(screen.getByRole('heading', { name: 'Iván Olivera González' })).toBeInTheDocument();
      expect(screen.getByText('Software Engineer & Systems Specialist')).toBeInTheDocument();
      expect(screen.getByText(/Software Engineer @ Yuvod/i)).toBeInTheDocument();
      expect(screen.getByText(/Valencia, España/i)).toBeInTheDocument();

      // Long 3-line biography paragraph must be omitted (RF-003.2)
      expect(screen.queryByText(esDict.hero.bio)).not.toBeInTheDocument();
      expect(screen.queryByText(enDict.hero.bio)).not.toBeInTheDocument();

      // 6 Core Technologies from CORE_TECHNOLOGIES with vector icons (RF-003.1, CA-05)
      expect(CORE_TECHNOLOGIES).toHaveLength(6);
      for (const tech of CORE_TECHNOLOGIES) {
        const chip = screen.getByTestId(`hero-tech-${tech}`);
        expect(chip).toBeInTheDocument();
        expect(chip).toHaveTextContent(tech);
        expect(chip.querySelector('svg')).not.toBeNull();
      }

      // Compact languages badge ES · EN · VAL (Fluent) (RF-003.1, CA-05)
      expect(screen.getByText(LANGUAGES_BADGE)).toBeInTheDocument();

      // Vector NFC chip/wave icon present
      expect(screen.getByTestId('nfc-vector-chip')).toBeInTheDocument();
      expect(containsEmoji(container.textContent ?? '')).toBe(false);

      // Switch to EN and verify localized labels update immediately while bio stays omitted
      rerender(<HeroCard3D language="en" />);
      expect(screen.getByText(enDict.hero.badge)).toBeInTheDocument();
      expect(screen.getByText(enDict.hero.stackLabel)).toBeInTheDocument();
      expect(screen.getByText(LANGUAGES_BADGE)).toBeInTheDocument();
      expect(screen.queryByText(enDict.hero.bio)).not.toBeInTheDocument();
      expect(containsEmoji(container.textContent ?? '')).toBe(false);
    });

    it('calculates 3D tilt and specular glare on pointer/touch move and resets on leave when reduced motion is false (RF-004.1)', () => {
      const calc = calculateTiltFromPoint(
        300,
        40,
        { left: 0, top: 0, width: 360, height: 220 },
        12
      );
      expect(calc.rotateY).toBeGreaterThan(0);
      expect(calc.rotateX).toBeGreaterThan(0);
      expect(calc.glareX).toBeGreaterThan(50);
      expect(calc.glareY).toBeLessThan(50);

      render(<HeroCard3D language="es" />);
      const card3d = screen.getByTestId('card-3d-interactive');

      vi.spyOn(card3d, 'getBoundingClientRect').mockReturnValue({
        left: 0,
        top: 0,
        width: 360,
        height: 220,
        right: 360,
        bottom: 220,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      });

      expect(card3d).toHaveAttribute('data-reduced-motion', 'false');
      expect(card3d).toHaveAttribute('data-tilt-active', 'false');

      fireEvent.pointerMove(card3d, { clientX: 320, clientY: 30 });
      expect(card3d).toHaveAttribute('data-tilt-active', 'true');
      const rotateYAfterMove = Number(card3d.getAttribute('data-rotate-y'));
      const rotateXAfterMove = Number(card3d.getAttribute('data-rotate-x'));
      expect(rotateYAfterMove).not.toBe(0);
      expect(rotateXAfterMove).not.toBe(0);

      // Glare overlay is active
      const glare = screen.getByTestId('card-3d-glare');
      expect(glare).toBeInTheDocument();

      // Pointer leave resets smoothly to rest position (0, 0)
      fireEvent.pointerLeave(card3d);
      expect(card3d).toHaveAttribute('data-tilt-active', 'false');
      expect(Number(card3d.getAttribute('data-rotate-x'))).toBe(0);
      expect(Number(card3d.getAttribute('data-rotate-y'))).toBe(0);
    });

    it('flips the 3D smartcard to reveal the reverse with embedded QR code and flips back', () => {
      render(<HeroCard3D language="es" />);

      const flipper = screen.getByTestId('hero-card-flipper');
      expect(flipper).toHaveAttribute('data-is-flipped', 'false');

      const flipBtn = screen.getByTestId('flip-card-button');
      fireEvent.click(flipBtn);

      expect(flipper).toHaveAttribute('data-is-flipped', 'true');
      expect(screen.getByTestId('hero-card-back')).toBeInTheDocument();
      expect(screen.getByText('card.ivanolivera.dev/?ref=nfc')).toBeInTheDocument();

      const backBtn = screen.getByTestId('flip-card-back-button');
      fireEvent.click(backBtn);

      expect(flipper).toHaveAttribute('data-is-flipped', 'false');
    });

    it('supports touch gestures (onTouchMove / onTouchEnd) for mobile NFC users (RF-004.1)', () => {
      render(<HeroCard3D language="es" />);
      const card3d = screen.getByTestId('card-3d-interactive');

      vi.spyOn(card3d, 'getBoundingClientRect').mockReturnValue({
        left: 0,
        top: 0,
        width: 360,
        height: 220,
        right: 360,
        bottom: 220,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      });

      fireEvent.touchMove(card3d, {
        touches: [{ clientX: 50, clientY: 190 }],
      });
      expect(card3d).toHaveAttribute('data-tilt-active', 'true');
      expect(Number(card3d.getAttribute('data-rotate-y'))).toBeLessThan(0);

      fireEvent.touchEnd(card3d);
      expect(card3d).toHaveAttribute('data-tilt-active', 'false');
      expect(Number(card3d.getAttribute('data-rotate-x'))).toBe(0);
      expect(Number(card3d.getAttribute('data-rotate-y'))).toBe(0);
    });

    it('disables 3D tilt rotations immediately when prefers-reduced-motion: reduce is active (RF-004.2, CA-03)', () => {
      mockReducedMotion(true);
      render(<HeroCard3D language="es" />);

      const card3d = screen.getByTestId('card-3d-interactive');
      expect(card3d).toHaveAttribute('data-reduced-motion', 'true');

      fireEvent.pointerMove(card3d, { clientX: 320, clientY: 20 });
      fireEvent.touchMove(card3d, {
        touches: [{ clientX: 320, clientY: 20 }],
      });

      expect(card3d).toHaveAttribute('data-tilt-active', 'false');
      expect(Number(card3d.getAttribute('data-rotate-x'))).toBe(0);
      expect(Number(card3d.getAttribute('data-rotate-y'))).toBe(0);
    });
  });

  describe('QuickActions (RF-005.1, RF-006.1, RF-006.2, RF-009.2, RF-010.3, CA-01, CA-05, CA-07)', () => {
    it('triggers downloadVCard and emits vcard_download when clicking the primary button in ES and EN', () => {
      const downloadSpy = vi.spyOn(vcardModule, 'downloadVCard').mockImplementation(() => {});
      const trackSpy = vi.spyOn(analyticsModule, 'trackEvent').mockImplementation(() => {});

      const { rerender } = render(<QuickActions language="es" />);

      const saveBtnEs = screen.getByRole('button', {
        name: getTranslations('es').actions.saveContactAria,
      });
      expect(saveBtnEs).toHaveTextContent('Guardar Contacto');
      expect(saveBtnEs.className).toContain('min-h-[44px]');
      expect(saveBtnEs.className).toContain('min-w-[44px]');

      fireEvent.click(saveBtnEs);
      expect(downloadSpy).toHaveBeenCalledTimes(1);
      expect(downloadSpy).toHaveBeenCalledWith(AUTHORIZED_PROFILE);
      expect(trackSpy).toHaveBeenCalledWith(
        'vcard_download',
        expect.objectContaining({ source: 'hero_cta' })
      );

      rerender(<QuickActions language="en" />);
      const saveBtnEn = screen.getByRole('button', {
        name: getTranslations('en').actions.saveContactAria,
      });
      expect(saveBtnEn).toHaveTextContent('Save Contact');
      fireEvent.click(saveBtnEn);
      expect(downloadSpy).toHaveBeenCalledTimes(2);
    });

    it('renders exactly 4 secondary quick actions (LinkedIn, GitHub, direct Email mailto:, and QR Code) with >=44x44px targets, omits the contact form modal button, and emits analytics events', () => {
      const trackSpy = vi.spyOn(analyticsModule, 'trackEvent').mockImplementation(() => {});
      const onOpenQr = vi.fn();

      const { container, rerender } = render(
        <QuickActions
          language="es"
          onOpenQr={onOpenQr}
        />
      );

      const t = getTranslations('es');

      // Contact form modal trigger must NOT exist in QuickActions (RF-006.2, CA-05)
      expect(
        screen.queryByRole('button', { name: t.actions.directContactAria })
      ).not.toBeInTheDocument();

      // Secondary grid contains exactly 4 actions: 3 links (LinkedIn, GitHub, Email mailto:) + 1 QR button
      const secondaryGrid = screen.getByTestId('quick-actions-secondary');
      const secondaryLinks = secondaryGrid.querySelectorAll('a');
      const secondaryButtons = secondaryGrid.querySelectorAll('button');
      expect(secondaryLinks).toHaveLength(3);
      expect(secondaryButtons).toHaveLength(1);

      // 1. LinkedIn link
      const linkedinLink = screen.getByRole('link', { name: t.actions.linkedinAria });
      expect(linkedinLink).toHaveAttribute(
        'href',
        'https://www.linkedin.com/in/ivan-olivera-gonzalez/'
      );
      expect(linkedinLink).toHaveAttribute('target', '_blank');
      expect(linkedinLink).toHaveAttribute('rel', 'noopener noreferrer');
      expect(linkedinLink.className).toContain('min-h-[44px]');
      expect(linkedinLink.className).toContain('min-w-[44px]');
      fireEvent.click(linkedinLink);
      expect(trackSpy).toHaveBeenCalledWith(
        'social_click',
        expect.objectContaining({ network: 'linkedin', target: 'linkedin' })
      );

      // 2. GitHub link
      const githubLink = screen.getByRole('link', { name: t.actions.githubAria });
      expect(githubLink).toHaveAttribute('href', 'https://github.com/Ivan-olivera-dev');
      expect(githubLink).toHaveAttribute('target', '_blank');
      expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
      expect(githubLink.className).toContain('min-h-[44px]');
      expect(githubLink.className).toContain('min-w-[44px]');
      fireEvent.click(githubLink);
      expect(trackSpy).toHaveBeenCalledWith(
        'social_click',
        expect.objectContaining({ network: 'github', target: 'github' })
      );

      // 3. Direct Email link (mailto:ivanoliveradev@gmail.com)
      const emailLink = screen.getByRole('link', { name: t.actions.emailAria });
      expect(emailLink).toHaveAttribute('href', 'mailto:ivanoliveradev@gmail.com');
      expect(emailLink.className).toContain('min-h-[44px]');
      expect(emailLink.className).toContain('min-w-[44px]');
      emailLink.addEventListener('click', (e) => e.preventDefault());
      fireEvent.click(emailLink);
      expect(trackSpy).toHaveBeenCalledWith(
        'social_click',
        expect.objectContaining({ network: 'email', target: 'email' })
      );

      // 4. QR Code button
      const qrBtn = screen.getByRole('button', { name: t.actions.qrCodeAria });
      expect(qrBtn.className).toContain('min-h-[44px]');
      expect(qrBtn.className).toContain('min-w-[44px]');
      fireEvent.click(qrBtn);
      expect(onOpenQr).toHaveBeenCalledTimes(1);
      expect(trackSpy).toHaveBeenCalledWith(
        'qr_open',
        expect.objectContaining({ source: 'quick_actions' })
      );

      expect(containsEmoji(container.textContent ?? '')).toBe(false);

      // Switch to EN and verify translated aria-labels and labels
      rerender(<QuickActions language="en" onOpenQr={onOpenQr} />);
      const enT = getTranslations('en');
      expect(screen.getByRole('link', { name: enT.actions.linkedinAria })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: enT.actions.githubAria })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: enT.actions.emailAria })).toHaveAttribute(
        'href',
        'mailto:ivanoliveradev@gmail.com'
      );
      expect(screen.getByRole('button', { name: enT.actions.qrCodeAria })).toBeInTheDocument();
      expect(containsEmoji(container.textContent ?? '')).toBe(false);
    });
  });
});
