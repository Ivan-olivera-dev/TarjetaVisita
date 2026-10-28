import { useCallback, type ReactElement } from 'react';
import {
  Download,
  Mail,
  QrCode,
  UserPlus,
} from 'lucide-react';
import { SiGithub } from 'react-icons/si';
import { FaLinkedin } from 'react-icons/fa6';
import {
  AUTHORIZED_PROFILE,
  getTranslations,
  type AuthorizedContactProfile,
  type Language,
  type TranslationDictionary,
} from '../../data/profile';
import { useLanguage } from '../../hooks/useLanguage';
import { trackEvent } from '../../lib/analytics';
import { cn } from '../../lib/utils';
import { downloadVCard } from '../../lib/vcard';
import { ShimmerButton } from '../ui/shimmer-button';

export interface QuickActionsProps {
  language?: Language;
  lang?: Language;
  t?: TranslationDictionary;
  profile?: AuthorizedContactProfile;
  onOpenContact?: () => void;
  onOpenQr?: () => void;
  onQrClick?: () => void;
  onSaveContact?: () => void;
  className?: string;
}

export function QuickActions({
  language,
  lang,
  t,
  profile = AUTHORIZED_PROFILE,
  onOpenQr,
  onQrClick,
  onSaveContact,
  className,
}: QuickActionsProps): ReactElement {
  const internalLang = useLanguage();
  const activeLanguage: Language = language ?? lang ?? internalLang.language;
  const dictionary: TranslationDictionary = t ?? getTranslations(activeLanguage);

  const handleSaveContact = useCallback(() => {
    downloadVCard(profile);
    trackEvent('vcard_download', {
      source: 'hero_cta',
      filename: 'ivan-olivera.vcf',
    });
    onSaveContact?.();
  }, [onSaveContact, profile]);

  const handleOpenQr = useCallback(() => {
    trackEvent('qr_open', { source: 'quick_actions' });
    onOpenQr?.();
    onQrClick?.();
  }, [onOpenQr, onQrClick]);

  const handleSocialClick = useCallback(
    (network: 'linkedin' | 'github' | 'email', url: string) => {
      trackEvent('social_click', {
        network,
        target: network,
        url,
      });
    },
    []
  );

  return (
    <section
      data-testid="quick-actions"
      aria-label={dictionary.footer.dockAria}
      className={cn('relative z-20 flex w-full flex-col gap-2.5 py-2', className)}
    >
      {/* 1. Primary 1-Tap Conversion CTA: vCard .vcf Download with Shimmer reflection */}
      <ShimmerButton
        type="button"
        onClick={handleSaveContact}
        aria-label={dictionary.actions.saveContactAria}
        shimmerColor="#34d399"
        shimmerDuration="3s"
        borderRadius="0.75rem"
        background="linear-gradient(135deg, rgba(16, 185, 129, 0.95), rgba(5, 150, 105, 0.95))"
        className="group relative flex min-h-[44px] min-w-[44px] w-full items-center justify-between gap-3 overflow-hidden rounded-xl border border-emerald-400/50 px-4 py-3.5 text-left text-neutral-950 shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all duration-200 hover:shadow-[0_0_28px_rgba(16,185,129,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 active:scale-[0.98]"
      >
        <div className="flex min-w-0 items-center gap-3">
          <span
            aria-hidden="true"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-950/15 text-neutral-950"
          >
            <UserPlus className="h-5 w-5" strokeWidth={2} />
          </span>
          <div className="min-w-0">
            <div className="truncate text-sm font-bold tracking-tight text-neutral-950 sm:text-base">
              {dictionary.actions.saveContact}
            </div>
            <div className="truncate font-mono text-[11px] font-medium text-neutral-900/80">
              {dictionary.actions.saveContactSubtitle}
            </div>
          </div>
        </div>

        <span
          aria-hidden="true"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-neutral-950/15 bg-neutral-950/10 text-neutral-950 transition-transform duration-200 group-hover:translate-y-0.5"
        >
          <Download className="h-4 w-4" strokeWidth={2} />
        </span>
      </ShimmerButton>

      {/* 2. Secondary Quick Actions (4 Buttons): LinkedIn, GitHub, Direct Email (mailto:), QR Code */}
      <div
        data-testid="quick-actions-secondary"
        className="grid grid-cols-2 gap-2.5 sm:grid-cols-4"
      >
        <a
          href={profile.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={dictionary.actions.linkedinAria}
          onClick={() => handleSocialClick('linkedin', profile.linkedinUrl)}
          className="group flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-xl border border-white/10 bg-neutral-900/70 px-3 py-2.5 text-xs font-semibold text-neutral-200 backdrop-blur-md transition-all duration-200 hover:border-emerald-500/40 hover:bg-neutral-900 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 active:scale-[0.98]"
        >
          <FaLinkedin
            aria-hidden="true"
            className="h-4 w-4 shrink-0 text-neutral-300 transition-colors group-hover:text-emerald-400"
          />
          <span className="truncate">{dictionary.actions.linkedin}</span>
        </a>

        <a
          href={profile.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={dictionary.actions.githubAria}
          onClick={() => handleSocialClick('github', profile.githubUrl)}
          className="group flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-xl border border-white/10 bg-neutral-900/70 px-3 py-2.5 text-xs font-semibold text-neutral-200 backdrop-blur-md transition-all duration-200 hover:border-emerald-500/40 hover:bg-neutral-900 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 active:scale-[0.98]"
        >
          <SiGithub
            aria-hidden="true"
            className="h-4 w-4 shrink-0 text-neutral-300 transition-colors group-hover:text-emerald-400"
          />
          <span className="truncate">{dictionary.actions.github}</span>
        </a>

        <a
          href={profile.mailtoUrl}
          aria-label={dictionary.actions.emailAria}
          onClick={() => handleSocialClick('email', profile.mailtoUrl)}
          className="group flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-xl border border-white/10 bg-neutral-900/70 px-3 py-2.5 text-xs font-semibold text-neutral-200 backdrop-blur-md transition-all duration-200 hover:border-emerald-500/40 hover:bg-neutral-900 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 active:scale-[0.98]"
        >
          <Mail
            aria-hidden="true"
            className="h-4 w-4 shrink-0 text-emerald-400 transition-transform duration-200 group-hover:scale-105"
            strokeWidth={1.75}
          />
          <span className="truncate">{dictionary.actions.email}</span>
        </a>

        <button
          type="button"
          onClick={handleOpenQr}
          aria-label={dictionary.actions.qrCodeAria}
          className="group flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-xl border border-white/10 bg-neutral-900/70 px-3 py-2.5 text-xs font-semibold text-neutral-200 backdrop-blur-md transition-all duration-200 hover:border-emerald-500/40 hover:bg-neutral-900 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 active:scale-[0.98]"
        >
          <QrCode
            aria-hidden="true"
            className="h-4 w-4 shrink-0 text-emerald-400 transition-transform duration-200 group-hover:scale-105"
            strokeWidth={1.75}
          />
          <span className="truncate">{dictionary.actions.qrCode}</span>
        </button>
      </div>
    </section>
  );
}

export default QuickActions;
