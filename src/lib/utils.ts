import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

const EMOJI_REGEX =
  /(\p{Extended_Pictographic}|\p{Emoji_Presentation}|[\u{1F1E6}-\u{1F1FF}]|\u{20E3})/u;

export function containsEmoji(text: string): boolean {
  if (!text) return false;
  return EMOJI_REGEX.test(text);
}
