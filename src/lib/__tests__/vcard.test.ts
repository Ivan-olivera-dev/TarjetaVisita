import { afterEach, describe, expect, it, vi } from 'vitest';
import { AUTHORIZED_PROFILE } from '../../data/profile';
import { containsEmoji } from '../utils';
import { VCARD_FILENAME, downloadVCard, generateVCardString } from '../vcard';

describe('vcard — generateVCardString & downloadVCard (RF-005.1, RF-005.2, RF-010.2, CA-01, CA-04)', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('exports the canonical vCard filename ivan-olivera.vcf', () => {
    expect(VCARD_FILENAME).toBe('ivan-olivera.vcf');
  });

  it('generates a valid vCard 3.0 UTF-8 string using strict CRLF (\\r\\n) line endings', () => {
    const vcf = generateVCardString(AUTHORIZED_PROFILE);

    expect(vcf.startsWith('BEGIN:VCARD\r\nVERSION:3.0\r\n')).toBe(true);
    expect(vcf.endsWith('\r\nEND:VCARD\r\n')).toBe(true);

    // Every line break must be CRLF (\r\n), with no bare \n without preceding \r
    const lines = vcf.trimEnd().split('\r\n');
    expect(lines[0]).toBe('BEGIN:VCARD');
    expect(lines[1]).toBe('VERSION:3.0');
    expect(lines[lines.length - 1]).toBe('END:VCARD');
    for (const line of lines) {
      expect(line.includes('\n')).toBe(false);
      expect(line.includes('\r')).toBe(false);
    }
  });

  it('includes all authorized professional identity fields with Software Engineer & Systems Specialist title, UTF-8 accents and ñ', () => {
    const vcf = generateVCardString();

    expect(vcf).toContain('FN:Iván Olivera González\r\n');
    expect(vcf).toContain('N:Olivera González;Iván;;;\r\n');
    expect(vcf).toContain('TITLE:Software Engineer & Systems Specialist\r\n');
    expect(vcf).toContain('EMAIL;TYPE=INTERNET,WORK:ivanoliveradev@gmail.com\r\n');
    expect(vcf).toContain('ADR;TYPE=WORK:;;;Valencia;;España\r\n');

    // Authorized URLs (Portfolio, Card, LinkedIn, GitHub)
    expect(vcf).toContain('https://ivanolivera.dev');
    expect(vcf).toContain('https://card.ivanolivera.dev');
    expect(vcf).toContain('https://www.linkedin.com/in/ivan-olivera-gonzalez/');
    expect(vcf).toContain('https://github.com/Ivan-olivera-dev');
  });

  it('strictly omits any TEL field, phone numbers, street addresses, or postal codes (RF-005.2)', () => {
    const vcf = generateVCardString(AUTHORIZED_PROFILE);
    const lines = vcf.trimEnd().split('\r\n');

    for (const line of lines) {
      expect(line.toUpperCase().startsWith('TEL')).toBe(false);
    }
    expect(vcf).not.toMatch(/\bTEL\b/i);

    const adrLine = lines.find((line) => line.startsWith('ADR'));
    expect(adrLine).toBe('ADR;TYPE=WORK:;;;Valencia;;España');
    const adrValue = adrLine?.split(':')[1] ?? '';
    const adrParts = adrValue.split(';');
    expect(adrParts).toEqual(['', '', '', 'Valencia', '', 'España']);
  });

  it('contains zero emojis in the generated .vcf content (RF-013.2, CA-04)', () => {
    const vcf = generateVCardString(AUTHORIZED_PROFILE);
    expect(containsEmoji(vcf)).toBe(false);
  });

  it('triggers a browser download of ivan-olivera.vcf with text/vcard;charset=utf-8 Blob', () => {
    const createObjectURLMock = vi.fn(() => 'blob:https://card.ivanolivera.dev/mock-vcard');
    const revokeObjectURLMock = vi.fn();

    Object.defineProperty(URL, 'createObjectURL', {
      value: createObjectURLMock,
      configurable: true,
      writable: true,
    });
    Object.defineProperty(URL, 'revokeObjectURL', {
      value: revokeObjectURLMock,
      configurable: true,
      writable: true,
    });

    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => undefined);
    const appendChildSpy = vi.spyOn(document.body, 'appendChild');
    const removeChildSpy = vi.spyOn(document.body, 'removeChild');

    downloadVCard(AUTHORIZED_PROFILE);

    expect(createObjectURLMock).toHaveBeenCalledTimes(1);
    const blobArg = (createObjectURLMock.mock.calls[0] as unknown as [Blob])[0];
    expect(blobArg).toBeInstanceOf(Blob);
    expect(blobArg.type).toBe('text/vcard;charset=utf-8');

    expect(appendChildSpy).toHaveBeenCalledTimes(1);
    const anchor = appendChildSpy.mock.calls[0][0] as HTMLAnchorElement;
    expect(anchor.tagName).toBe('A');
    expect(anchor.getAttribute('download')).toBe('ivan-olivera.vcf');
    expect(anchor.href).toBe('blob:https://card.ivanolivera.dev/mock-vcard');

    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(removeChildSpy).toHaveBeenCalledWith(anchor);
    expect(revokeObjectURLMock).toHaveBeenCalledWith(
      'blob:https://card.ivanolivera.dev/mock-vcard'
    );
  });
});
