import { describe, expect, it } from 'vitest';
import { containsEmoji } from '../../lib/utils';
import {
  AUTHORIZED_PROFILE,
  CORE_TECHNOLOGIES,
  DEFAULT_LANGUAGE,
  LANGUAGES_BADGE,
  getTranslations,
  translations,
} from '../profile';

function collectAllStrings(value: unknown, bucket: string[] = []): string[] {
  if (typeof value === 'string') {
    bucket.push(value);
  } else if (Array.isArray(value)) {
    for (const item of value) {
      collectAllStrings(item, bucket);
    }
  } else if (value !== null && typeof value === 'object') {
    for (const key of Object.keys(value)) {
      collectAllStrings((value as Record<string, unknown>)[key], bucket);
    }
  }
  return bucket;
}

function getStructureKeys(value: unknown, prefix = ''): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((item, index) =>
      getStructureKeys(item, `${prefix}[${index}]`)
    );
  }
  if (value !== null && typeof value === 'object') {
    return Object.keys(value)
      .sort()
      .flatMap((key) => {
        const nextPrefix = prefix ? `${prefix}.${key}` : key;
        return [
          nextPrefix,
          ...getStructureKeys((value as Record<string, unknown>)[key], nextPrefix),
        ];
      });
  }
  return [prefix];
}

describe('profile data & translations (RF-002, RF-003, RF-005, RF-006, RF-008, RF-010.2)', () => {
  it('exposes the exact authorized profile data with Software Engineer & Systems Specialist role, Yuvod focus, and no phone or private street address (RF-003.1, RF-005.2, CA-01)', () => {
    expect(AUTHORIZED_PROFILE.fullName).toBe('Iván Olivera González');
    expect(AUTHORIZED_PROFILE.firstName).toBe('Iván');
    expect(AUTHORIZED_PROFILE.lastName).toBe('Olivera González');
    expect(AUTHORIZED_PROFILE.role).toBe('Software Engineer & Systems Specialist');
    expect(AUTHORIZED_PROFILE.company).toBe('Yuvod');
    expect(AUTHORIZED_PROFILE.companyRole).toBe('Software Engineer @ Yuvod');
    expect(AUTHORIZED_PROFILE.email).toBe('ivanoliveradev@gmail.com');
    expect(AUTHORIZED_PROFILE.mailtoUrl).toBe('mailto:ivanoliveradev@gmail.com');
    expect(AUTHORIZED_PROFILE.portfolioUrl).toBe('https://ivanolivera.dev');
    expect(AUTHORIZED_PROFILE.cardUrl).toBe('https://card.ivanolivera.dev');
    expect(AUTHORIZED_PROFILE.nfcUrl).toBe('https://card.ivanolivera.dev/?ref=nfc');
    expect(AUTHORIZED_PROFILE.linkedinUrl).toBe(
      'https://www.linkedin.com/in/ivan-olivera-gonzalez/'
    );
    expect(AUTHORIZED_PROFILE.githubUrl).toBe('https://github.com/Ivan-olivera-dev');
    expect(AUTHORIZED_PROFILE.city).toBe('Valencia');
    expect(AUTHORIZED_PROFILE.country).toBe('España');
    expect(AUTHORIZED_PROFILE.locationLabel).toBe('Valencia, España');
    expect(AUTHORIZED_PROFILE.languagesBadge).toBe('ES · EN · VAL (Fluent)');
    expect(AUTHORIZED_PROFILE.stack).toEqual([
      'Node.js',
      'Python',
      'Docker',
      'Linux',
      'Bash',
      'Java',
    ]);

    const profileKeys = Object.keys(AUTHORIZED_PROFILE).map((k) => k.toLowerCase());
    expect(profileKeys).not.toContain('phone');
    expect(profileKeys).not.toContain('tel');
    expect(profileKeys).not.toContain('mobile');
    expect(profileKeys).not.toContain('street');
    expect(profileKeys).not.toContain('postalcode');
  });

  it('maintains 100% structural key parity between Spanish (es) and English (en) dictionaries (RF-002, CA-02)', () => {
    expect(DEFAULT_LANGUAGE).toBe('en');
    const esKeys = getStructureKeys(translations.es);
    const enKeys = getStructureKeys(translations.en);
    expect(esKeys).toEqual(enKeys);
    expect(getTranslations('es')).toBe(translations.es);
    expect(getTranslations('en')).toBe(translations.en);
  });

  it('exposes the 6 core technologies and the compact languages badge ES · EN · VAL (Fluent) (RF-003.1, CA-05)', () => {
    expect(CORE_TECHNOLOGIES).toEqual([
      'Node.js',
      'Python',
      'Docker',
      'Linux',
      'Bash',
      'Java',
    ]);
    expect(LANGUAGES_BADGE).toBe('ES · EN · VAL (Fluent)');

    for (const lang of ['es', 'en'] as const) {
      const dict = translations[lang];
      expect(dict.hero.role).toBe('Software Engineer & Systems Specialist');
      expect(dict.hero.languagesBadge).toBe('ES · EN · VAL (Fluent)');
      expect(dict.actions.email).toBeTruthy();
      expect(dict.actions.emailAria).toBeTruthy();
      expect(dict.qrModal.shareTitle).toBe(
        'Iván Olivera González — Software Engineer & Systems Specialist'
      );
    }
  });

  it('defines the Yuvod executive snapshot block and portfolio CTA in ES and EN without pictographic arrows (RF-008.1, RF-010.2, CA-05)', () => {
    expect(translations.es.snapshot.company).toBe('Yuvod');
    expect(translations.en.snapshot.company).toBe('Yuvod');
    expect(translations.es.snapshot.roleBadge).toBe('Software Engineer @ Yuvod');
    expect(translations.en.snapshot.roleBadge).toBe('Software Engineer @ Yuvod');

    expect(translations.es.snapshot.pillars.map((p) => p.id)).toEqual([
      'integrations',
      'automation',
      'infrastructure',
    ]);
    expect(translations.en.snapshot.pillars.map((p) => p.id)).toEqual([
      'integrations',
      'automation',
      'infrastructure',
    ]);

    expect(translations.es.snapshot.portfolioCtaLabel).toBe(
      'Explorar Portfolio Completo (ivanolivera.dev)'
    );
    expect(translations.en.snapshot.portfolioCtaLabel).toBe(
      'Explore Full Portfolio (ivanolivera.dev)'
    );
    expect(translations.es.snapshot.portfolioCtaLabel).not.toContain('↗');
    expect(translations.en.snapshot.portfolioCtaLabel).not.toContain('↗');
  });

  it('contains zero emojis across AUTHORIZED_PROFILE and all es/en translations (RF-010.2, CA-04)', () => {
    const allStrings = [
      ...collectAllStrings(AUTHORIZED_PROFILE),
      ...collectAllStrings(translations),
    ];

    expect(allStrings.length).toBeGreaterThan(40);
    for (const str of allStrings) {
      expect(containsEmoji(str), `Unexpected emoji found in: "${str}"`).toBe(false);
    }
  });
});
