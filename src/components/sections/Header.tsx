import { useCallback, type ReactElement } from 'react';
import { motion } from 'framer-motion';
import {
  getTranslations,
  type Language,
  type TranslationDictionary,
} from '../../data/profile';
import { LANGUAGE_STORAGE_KEY, useLanguage } from '../../hooks/useLanguage';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { cn } from '../../lib/utils';

export interface HeaderProps {
  language?: Language;
  lang?: Language;
  onLanguageChange?: (nextLang: Language) => void;
  setLanguage?: (nextLang: Language) => void;
  setLang?: (nextLang: Language) => void;
  t?: TranslationDictionary;
  className?: string;
}

export function Header({
  language,
  lang,
  onLanguageChange,
  setLanguage,
  setLang,
  t,
  className,
}: HeaderProps): ReactElement {
  const internalLang = useLanguage();
  const prefersReducedMotion = useReducedMotion();

  const activeLanguage: Language = language ?? lang ?? internalLang.language;
  const dictionary: TranslationDictionary = t ?? getTranslations(activeLanguage);

  const handleSelectLanguage = useCallback(
    (nextLang: Language) => {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLang);
        }
      } catch {
        // Degradación silenciosa cuando localStorage está bloqueado (RF-002.2)
      }
      internalLang.setLanguage(nextLang);
      onLanguageChange?.(nextLang);
      setLanguage?.(nextLang);
      setLang?.(nextLang);
    },
    [internalLang, onLanguageChange, setLang, setLanguage]
  );

  return (
    <header
      data-testid="card-header"
      className={cn(
        'relative z-20 flex w-full items-center justify-between gap-2 py-2',
        className
      )}
    >
      <div className="flex min-w-0 items-center gap-2.5">
        <div className="flex h-10 items-center justify-center rounded-xl border border-white/10 bg-neutral-900/80 px-3 font-mono text-sm font-bold tracking-tight text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md">
          <span>{dictionary.header.monogram}</span>
        </div>

        <div className="flex min-w-0 items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1.5 backdrop-blur-md">
          <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
            {!prefersReducedMotion && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            )}
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          </span>
          <span className="truncate font-mono text-[11px] font-medium tracking-tight text-emerald-400">
            {dictionary.header.statusLabel}
          </span>
        </div>
      </div>

      <div
        role="group"
        aria-label={dictionary.header.languageSelectorAria}
        className="relative flex shrink-0 items-center rounded-xl border border-white/10 bg-neutral-900/80 p-0.5 backdrop-blur-md"
      >
        <button
          type="button"
          onClick={() => handleSelectLanguage('es')}
          aria-label={dictionary.header.switchToEsAria}
          aria-pressed={activeLanguage === 'es'}
          className={cn(
            'relative z-10 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg px-2.5 font-mono text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 active:scale-[0.98]',
            activeLanguage === 'es'
              ? 'text-emerald-400'
              : 'text-neutral-400 hover:text-white'
          )}
        >
          {activeLanguage === 'es' && (
            <motion.span
              layoutId={prefersReducedMotion ? undefined : 'header-lang-pill'}
              aria-hidden="true"
              transition={{ type: 'spring', stiffness: 450, damping: 32 }}
              className="absolute inset-0.5 -z-10 rounded-lg border border-emerald-500/30 bg-white/5 shadow-[0_0_12px_rgba(16,185,129,0.2)]"
            />
          )}
          <span>ES</span>
        </button>

        <button
          type="button"
          onClick={() => handleSelectLanguage('en')}
          aria-label={dictionary.header.switchToEnAria}
          aria-pressed={activeLanguage === 'en'}
          className={cn(
            'relative z-10 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg px-2.5 font-mono text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 active:scale-[0.98]',
            activeLanguage === 'en'
              ? 'text-emerald-400'
              : 'text-neutral-400 hover:text-white'
          )}
        >
          {activeLanguage === 'en' && (
            <motion.span
              layoutId={prefersReducedMotion ? undefined : 'header-lang-pill'}
              aria-hidden="true"
              transition={{ type: 'spring', stiffness: 450, damping: 32 }}
              className="absolute inset-0.5 -z-10 rounded-lg border border-emerald-500/30 bg-white/5 shadow-[0_0_12px_rgba(16,185,129,0.2)]"
            />
          )}
          <span>EN</span>
        </button>
      </div>
    </header>
  );
}

export default Header;
