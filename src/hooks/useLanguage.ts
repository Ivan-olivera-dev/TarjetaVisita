import { useCallback, useEffect, useState } from 'react';
import {
  getTranslations,
  type Language,
  type TranslationDictionary,
} from '../data/profile';

export const LANGUAGE_STORAGE_KEY = 'io_card_lang';

let memoryLanguageFallback: Language | null = null;

export function resetLanguageMemoryFallback(): void {
  memoryLanguageFallback = null;
}

export function detectInitialLanguage(
  storedLang?: string | null,
  navigatorLang?: string
): Language {
  if (storedLang === 'es' || storedLang === 'en') {
    return storedLang;
  }
  const raw = (navigatorLang ?? '').trim().toLowerCase();
  if (raw.startsWith('es')) {
    return 'es';
  }
  return 'en';
}

function readStoredLanguageSafely(): string | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const value = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (value === 'es' || value === 'en') {
        memoryLanguageFallback = value;
        return value;
      }
      return value;
    }
  } catch {
    return memoryLanguageFallback;
  }
  return memoryLanguageFallback;
}

function readNavigatorLanguageSafely(): string | undefined {
  try {
    if (typeof navigator !== 'undefined' && typeof navigator.language === 'string') {
      return navigator.language;
    }
  } catch {
    return undefined;
  }
  return undefined;
}

function persistLanguageSafely(lang: Language): void {
  memoryLanguageFallback = lang;
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    }
  } catch {
    // Degradación silenciosa en memoria cuando localStorage está bloqueado (RF-002.2)
  }
}

export interface UseLanguageResult {
  language: Language;
  lang: Language;
  setLanguage: (nextLang: Language) => void;
  setLang: (nextLang: Language) => void;
  toggleLanguage: () => void;
  t: TranslationDictionary;
}

export function useLanguage(): UseLanguageResult {
  const [language, setLanguageState] = useState<Language>(() =>
    detectInitialLanguage(readStoredLanguageSafely(), readNavigatorLanguageSafely())
  );

  useEffect(() => {
    try {
      if (typeof document !== 'undefined' && document.documentElement) {
        document.documentElement.lang = language;
      }
    } catch {
      // Ignorar fallos de acceso al DOM en entornos restringidos
    }
  }, [language]);

  const setLanguage = useCallback((nextLang: Language) => {
    persistLanguageSafely(nextLang);
    setLanguageState(nextLang);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState((prev) => {
      const next: Language = prev === 'es' ? 'en' : 'es';
      persistLanguageSafely(next);
      return next;
    });
  }, []);

  return {
    language,
    lang: language,
    setLanguage,
    setLang: setLanguage,
    toggleLanguage,
    t: getTranslations(language),
  };
}
