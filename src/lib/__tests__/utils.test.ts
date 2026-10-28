import { describe, expect, it } from 'vitest';
import { cn, containsEmoji } from '../utils';

describe('utils — cn()', () => {
  it('combines multiple class names cleanly', () => {
    expect(cn('bg-black', 'text-white', 'font-sans')).toBe('bg-black text-white font-sans');
  });

  it('handles conditional and falsy values via clsx', () => {
    const isActive = true;
    const isHidden = false;
    expect(
      cn('base-class', isActive && 'text-emerald-400', isHidden && 'hidden', undefined, null)
    ).toBe('base-class text-emerald-400');
  });

  it('merges conflicting Tailwind utility classes in favor of the last one', () => {
    expect(cn('px-2 py-1 bg-neutral-900', 'px-4 bg-black')).toBe('py-1 px-4 bg-black');
  });
});

describe('utils — containsEmoji()', () => {
  it('returns false for empty strings and plain ASCII text', () => {
    expect(containsEmoji('')).toBe(false);
    expect(containsEmoji('Software Architect & Systems Engineer')).toBe(false);
    expect(containsEmoji('Initializing System... Decrypting modules... Access Granted.')).toBe(
      false
    );
  });

  it('returns false for Spanish accented characters, ordinal indicators, numbers, and hex codes', () => {
    expect(containsEmoji('Iván Olivera González — Valencia, España')).toBe(false);
    expect(containsEmoji('Top 15 en OICV y 4.º puesto en HP CodeWars (13 años)')).toBe(false);
    expect(containsEmoji('#000000 #0a0a0a #10b981 * + - / @')).toBe(false);
  });

  it('returns true when string contains standard pictographic emojis', () => {
    // Rocket U+1F680, Laptop U+1F4BB, Grinning Face U+1F600
    expect(containsEmoji('Deploy \u{1F680}')).toBe(true);
    expect(containsEmoji('\u{1F4BB} Developer')).toBe(true);
    expect(containsEmoji('Hello \u{1F600}')).toBe(true);
  });

  it('returns true for dingbat/symbol emojis, flags, and keycap sequences', () => {
    // Sparkles U+2728, White Heavy Check Mark U+2705, High Voltage U+26A1
    expect(containsEmoji('Clean code \u{2728}')).toBe(true);
    expect(containsEmoji('Done \u{2705}')).toBe(true);
    expect(containsEmoji('Fast \u{26A1}')).toBe(true);
    // Regional indicator flag ES (U+1F1EA U+1F1F8)
    expect(containsEmoji('Valencia \u{1F1EA}\u{1F1F8}')).toBe(true);
    // Keycap 1 (1 + U+FE0F + U+20E3)
    expect(containsEmoji('Step 1\u{FE0F}\u{20E3}')).toBe(true);
  });
});
