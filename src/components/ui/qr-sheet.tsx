import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
} from 'react';
import { motion } from 'framer-motion';
import { Check, Copy, QrCode as QrCodeIcon, Share2, X } from 'lucide-react';
import * as QRCode from 'qrcode';
import {
  AUTHORIZED_PROFILE,
  getTranslations,
  type AuthorizedContactProfile,
  type Language,
  type TranslationDictionary,
} from '../../data/profile';
import { useLanguage } from '../../hooks/useLanguage';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { cn } from '../../lib/utils';

export const QR_NFC_URL = AUTHORIZED_PROFILE.nfcUrl;
export const COPY_FEEDBACK_MS = 2500;

export interface QrSheetProps {
  isOpen: boolean;
  onClose: () => void;
  language?: Language;
  lang?: Language;
  t?: TranslationDictionary;
  profile?: AuthorizedContactProfile;
  url?: string;
  className?: string;
}

export function generateQrMatrix(text: string = QR_NFC_URL): boolean[][] {
  const target = text.trim() || QR_NFC_URL;
  const qrModule = QRCode as unknown as {
    create?: typeof QRCode.create;
    default?: { create?: typeof QRCode.create };
  };
  const createFn = qrModule.create ?? qrModule.default?.create;

  if (typeof createFn === 'function') {
    const qr = createFn(target, { errorCorrectionLevel: 'M' });
    const size = qr.modules.size;
    const matrix: boolean[][] = [];
    for (let row = 0; row < size; row += 1) {
      const rowValues: boolean[] = [];
      for (let col = 0; col < size; col += 1) {
        rowValues.push(Boolean(qr.modules.get(row, col)));
      }
      matrix.push(rowValues);
    }
    return matrix;
  }

  return Array.from({ length: 29 }, (_, r) =>
    Array.from({ length: 29 }, (_, c) => (r + c) % 2 === 0)
  );
}

export function generateQrSvgPath(
  matrix: readonly (readonly boolean[])[],
  margin: number = 2
): string {
  const commands: string[] = [];
  for (let r = 0; r < matrix.length; r += 1) {
    const row = matrix[r];
    if (!row) continue;
    for (let c = 0; c < row.length; c += 1) {
      if (row[c]) {
        commands.push(`M${c + margin} ${r + margin}h1v1h-1z`);
      }
    }
  }
  return commands.join('');
}

export function QrSheet({
  isOpen,
  onClose,
  language,
  lang,
  t,
  profile = AUTHORIZED_PROFILE,
  url,
  className,
}: QrSheetProps): ReactElement | null {
  const internalLang = useLanguage();
  const prefersReducedMotion = useReducedMotion();

  const activeLanguage: Language = language ?? lang ?? internalLang.language;
  const dictionary: TranslationDictionary = t ?? getTranslations(activeLanguage);
  const targetUrl: string = url ?? profile.nfcUrl;

  const [copied, setCopied] = useState<boolean>(false);
  const copyTimeoutRef = useRef<number | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const qrMatrix = useMemo(() => generateQrMatrix(targetUrl), [targetUrl]);
  const margin = 2;
  const viewBoxSize = qrMatrix.length + margin * 2;
  const svgPath = useMemo(() => generateQrSvgPath(qrMatrix, margin), [qrMatrix]);

  useEffect(() => {
    if (!isOpen) {
      setCopied(false);
      if (copyTimeoutRef.current !== null) {
        clearTimeout(copyTimeoutRef.current);
        copyTimeoutRef.current = null;
      }
      return undefined;
    }

    if (typeof document !== 'undefined') {
      previousFocusRef.current = document.activeElement as HTMLElement | null;
      document.body.style.overflow = 'hidden';
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (copyTimeoutRef.current !== null) {
        clearTimeout(copyTimeoutRef.current);
        copyTimeoutRef.current = null;
      }
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
      }
      const targetToFocus = previousFocusRef.current;
      if (targetToFocus && typeof targetToFocus.focus === 'function') {
        try {
          targetToFocus.focus();
        } catch {
          // Ignore focus restoration errors in restricted environments
        }
      }
    };
  }, [isOpen, onClose]);

  const copyToClipboard = useCallback(async (): Promise<boolean> => {
    try {
      if (
        typeof navigator !== 'undefined' &&
        navigator.clipboard &&
        typeof navigator.clipboard.writeText === 'function'
      ) {
        await navigator.clipboard.writeText(targetUrl);
        setCopied(true);
        if (copyTimeoutRef.current !== null) {
          clearTimeout(copyTimeoutRef.current);
        }
        copyTimeoutRef.current = window.setTimeout(() => {
          setCopied(false);
        }, COPY_FEEDBACK_MS);
        return true;
      }
    } catch {
      // RF-007.3: Si el portapapeles está bloqueado, conservar URL visible y seleccionable sin lanzar error
      setCopied(false);
    }
    return false;
  }, [targetUrl]);

  const handleCopyClick = useCallback(async () => {
    await copyToClipboard();
  }, [copyToClipboard]);

  const handleShareClick = useCallback(async () => {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: dictionary.qrModal.shareTitle,
          text: dictionary.qrModal.shareText,
          url: targetUrl,
        });
        return;
      } catch (error) {
        const errorName =
          error && typeof error === 'object' && 'name' in error
            ? String((error as { name?: unknown }).name)
            : '';
        if (errorName === 'AbortError') {
          // RF-007.3: Ignorar silenciosamente la cancelación manual sin sobrescribir el portapapeles
          return;
        }
        await copyToClipboard();
        return;
      }
    }

    // RF-007.3: Degradar automáticamente a copiar al portapapeles cuando navigator.share no existe
    await copyToClipboard();
  }, [
    copyToClipboard,
    dictionary.qrModal.shareText,
    dictionary.qrModal.shareTitle,
    targetUrl,
  ]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      data-testid="qr-modal-root"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        data-testid="qr-modal-backdrop"
        aria-hidden="true"
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
      />

      {/* Dialog Content */}
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="qr-modal-title"
        initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          'relative z-10 w-full max-w-md overflow-y-auto max-h-[90dvh] rounded-2xl border border-white/10 bg-[#0a0a0a] p-5 text-center shadow-[0_24px_64px_rgba(0,0,0,0.95)] sm:p-7',
          className
        )}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"
        />

        {/* Header & Close Button */}
        <div className="flex items-start justify-between gap-3 text-left">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
              <QrCodeIcon aria-hidden="true" className="h-3.5 w-3.5" />
              <span>NFC / QR</span>
            </div>
            <h2
              id="qr-modal-title"
              className="mt-1 text-xl font-bold tracking-tight text-white sm:text-2xl"
            >
              {dictionary.qrModal.title}
            </h2>
            <p className="mt-1 text-xs text-neutral-400">
              {dictionary.qrModal.subtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={dictionary.qrModal.closeAria}
            className="flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-xl border border-white/10 bg-neutral-900/80 text-neutral-400 transition-colors hover:border-emerald-500/40 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 active:scale-[0.98]"
          >
            <X aria-hidden="true" className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </div>

        {/* High-Contrast Vector SVG QR Code */}
        <div className="mt-6 flex flex-col items-center justify-center">
          <div className="rounded-2xl border border-emerald-500/30 bg-neutral-950 p-3 shadow-[0_0_30px_rgba(16,185,129,0.18)]">
            <svg
              data-testid="qr-code-svg"
              data-qr-value={targetUrl}
              role="img"
              aria-label={dictionary.qrModal.qrAlt}
              viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
              shapeRendering="crispEdges"
              className="h-52 w-52 rounded-xl bg-white p-2 sm:h-56 sm:w-56"
            >
              <title>{dictionary.qrModal.qrAlt}</title>
              <rect width={viewBoxSize} height={viewBoxSize} fill="#ffffff" />
              <path d={svgPath} fill="#000000" />
            </svg>
          </div>
        </div>

        {/* Selectable Visible URL */}
        <div className="mt-5 space-y-1.5 text-left">
          <div className="rounded-xl border border-white/10 bg-neutral-950 px-3.5 py-2.5 text-center">
            <span
              data-testid="qr-nfc-url"
              className="select-all break-all font-mono text-xs font-medium text-emerald-400"
            >
              {targetUrl}
            </span>
          </div>
          <p className="text-center font-mono text-[11px] text-neutral-500">
            {dictionary.qrModal.manualCopyHint}
          </p>
        </div>

        {/* Copy & Native Share Buttons */}
        <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <button
            type="button"
            data-testid="qr-copy-button"
            onClick={handleCopyClick}
            aria-label={
              copied ? dictionary.qrModal.copiedButton : dictionary.qrModal.copyButton
            }
            className={cn(
              'flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 active:scale-[0.98] sm:text-sm',
              copied
                ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-300'
                : 'border-white/10 bg-neutral-900 text-white hover:border-emerald-500/40'
            )}
          >
            {copied ? (
              <>
                <Check
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0 text-emerald-400"
                  strokeWidth={2}
                />
                <span>{dictionary.qrModal.copiedButton}</span>
              </>
            ) : (
              <>
                <Copy
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0 text-emerald-400"
                  strokeWidth={1.75}
                />
                <span>{dictionary.qrModal.copyButton}</span>
              </>
            )}
          </button>

          <button
            type="button"
            data-testid="qr-share-button"
            onClick={handleShareClick}
            aria-label={dictionary.qrModal.shareButton}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-xl border border-emerald-400/50 bg-emerald-500 px-4 py-2.5 text-xs font-bold text-neutral-950 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 active:scale-[0.98] sm:text-sm"
          >
            <Share2 aria-hidden="true" className="h-4 w-4 shrink-0" strokeWidth={2} />
            <span>{dictionary.qrModal.shareButton}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default QrSheet;
