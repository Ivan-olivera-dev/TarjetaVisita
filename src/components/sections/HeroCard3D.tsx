import { useState, useMemo, type ComponentType, type ReactElement } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Briefcase, Globe, Layers, MapPin, RotateCw, RotateCcw, Wifi } from 'lucide-react';
import {
  SiDocker,
  SiGnubash,
  SiLinux,
  SiNodedotjs,
  SiPython,
} from 'react-icons/si';
import { FaJava } from 'react-icons/fa6';
import {
  AUTHORIZED_PROFILE,
  CORE_TECHNOLOGIES,
  getTranslations,
  type CoreTechnology,
  type Language,
  type TranslationDictionary,
} from '../../data/profile';
import { useLanguage } from '../../hooks/useLanguage';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { cn } from '../../lib/utils';
import { CardBody, CardContainer, CardItem } from '../ui/3d-card';
import { BorderBeam } from '../ui/border-beam';
import { generateQrMatrix, generateQrSvgPath } from '../ui/qr-sheet';

export interface HeroCard3DProps {
  language?: Language;
  lang?: Language;
  t?: TranslationDictionary;
  className?: string;
}

const CORE_TECH_ICONS: Record<
  CoreTechnology,
  ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' }>
> = {
  'Node.js': SiNodedotjs,
  Python: SiPython,
  Docker: SiDocker,
  Linux: SiLinux,
  Bash: SiGnubash,
  Java: FaJava,
};

export function HeroCard3D({
  language,
  lang,
  t,
  className,
}: HeroCard3DProps): ReactElement {
  const internalLang = useLanguage();
  const prefersReducedMotion = useReducedMotion();
  const [isFlipped, setIsFlipped] = useState(false);

  const activeLanguage: Language = language ?? lang ?? internalLang.language;
  const dictionary: TranslationDictionary = t ?? getTranslations(activeLanguage);
  const isEs = activeLanguage === 'es';

  const qrSvgPath = useMemo(() => {
    const matrix = generateQrMatrix(AUTHORIZED_PROFILE.nfcUrl);
    return generateQrSvgPath(matrix);
  }, []);

  return (
    <section
      aria-label={dictionary.hero.cardAriaLabel}
      className={cn('relative w-full py-1', className)}
    >
      <CardContainer
        ariaLabel={dictionary.hero.cardAriaLabel}
        containerClassName="w-full"
        className="w-full"
      >
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.6,
            type: 'spring',
            stiffness: 220,
            damping: 25,
          }}
          style={{ transformStyle: 'preserve-3d' }}
          className="relative w-full"
          data-testid="hero-card-flipper"
          data-is-flipped={String(isFlipped)}
        >
          {/* ========================================================= */}
          {/* FRONT FACE (Executive NFC Smartcard)                       */}
          {/* ========================================================= */}
          <CardBody
            className={cn(
              'group relative w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a]/95 p-5 shadow-[0_20px_45px_rgba(0,0,0,0.85)] backdrop-blur-xl transition-colors duration-300 hover:border-emerald-500/40 sm:p-6 [backface-visibility:hidden] [transform:translateZ(0)]',
              isFlipped && 'pointer-events-none'
            )}
          >
            {/* Clean SVG perimeter laser beam */}
            <BorderBeam
              duration={12}
              borderWidth={1.5}
              colorFrom="#10b981"
              colorTo="#059669"
            />

            {/* Top Bar: Executive Badge + Vector NFC Chip & Contactless Wave */}
            <CardItem
              translateZ={15}
              className="flex w-full items-center justify-between gap-3 border-b border-white/10 pb-3"
            >
              <div className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="h-2 w-0.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                />
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-400">
                  {dictionary.hero.badge}
                </span>
              </div>

              <div
                data-testid="nfc-vector-chip"
                aria-hidden="true"
                className="flex items-center gap-2 text-neutral-400"
              >
                {/* Metallic Smartcard Chip Vector */}
                <div className="relative flex h-6 w-8 items-center justify-center rounded-md border border-emerald-500/30 bg-gradient-to-br from-neutral-800 via-neutral-900 to-black shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">
                  <div className="h-3.5 w-5 rounded-[2px] border border-emerald-500/25">
                    <div className="mt-1.5 h-px w-full bg-emerald-500/25" />
                  </div>
                </div>
                <Wifi className="h-4 w-4 rotate-90 text-emerald-400/80" strokeWidth={1.75} />
              </div>
            </CardItem>

            {/* Identity Block: Name & Role */}
            <CardItem translateZ={20} className="mt-3.5 w-full text-left">
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-[28px] sm:leading-tight">
                {dictionary.hero.fullName}
              </h1>
              <p className="mt-1 font-mono text-xs font-medium tracking-tight text-emerald-400 sm:text-sm">
                {dictionary.hero.role}
              </p>
            </CardItem>

            {/* Company & Location Block */}
            <CardItem
              translateZ={16}
              className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-neutral-400"
            >
              <span className="inline-flex items-center gap-1.5 font-medium text-neutral-200">
                <Briefcase
                  aria-hidden="true"
                  className="h-3.5 w-3.5 shrink-0 text-emerald-400"
                  strokeWidth={1.75}
                />
                <span>{AUTHORIZED_PROFILE.companyRole}</span>
              </span>
              <span aria-hidden="true" className="text-neutral-600">
                ·
              </span>
              <span className="inline-flex items-center gap-1.5 font-medium text-neutral-200">
                <MapPin
                  aria-hidden="true"
                  className="h-3.5 w-3.5 shrink-0 text-emerald-400"
                  strokeWidth={1.75}
                />
                <span>{dictionary.hero.location}</span>
              </span>
              <span aria-hidden="true" className="text-neutral-600">
                ·
              </span>
              <span className="text-neutral-400">{dictionary.hero.availability}</span>
            </CardItem>

            {/* Core Stack Chips: 6 Real Technologies */}
            <CardItem translateZ={16} className="mt-3.5 w-full text-left">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
                  {dictionary.hero.stackLabel}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {CORE_TECHNOLOGIES.map((tech) => {
                  const TechIcon = CORE_TECH_ICONS[tech];
                  return (
                    <span
                      key={tech}
                      data-testid={`hero-tech-${tech}`}
                      className="group/chip inline-flex items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-neutral-900/85 px-2.5 py-1.5 font-mono text-xs font-medium text-neutral-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-all duration-200 hover:border-emerald-500/40 hover:bg-neutral-900 hover:text-white"
                    >
                      <TechIcon
                        aria-hidden="true"
                        className="h-3.5 w-3.5 shrink-0 text-emerald-400 transition-transform duration-200 group-hover/chip:scale-110"
                      />
                      <span className="truncate">{tech}</span>
                    </span>
                  );
                })}
              </div>
            </CardItem>

            {/* Compact Languages Badge, 3D Flip Trigger & Hint */}
            <CardItem
              translateZ={14}
              className="mt-3.5 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-3"
            >
              <div className="inline-flex items-center gap-2">
                <Globe
                  aria-hidden="true"
                  className="h-3.5 w-3.5 shrink-0 text-emerald-400"
                  strokeWidth={1.75}
                />
                <span
                  data-testid="languages-badge"
                  className="rounded-md border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[11px] font-medium tracking-wide text-emerald-300"
                >
                  {dictionary.hero.languagesBadge}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsFlipped(true)}
                  data-testid="flip-card-button"
                  aria-label={isEs ? 'Girar tarjeta y ver código QR' : 'Flip card to view QR code'}
                  className="inline-flex min-h-[44px] items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-xs font-mono font-medium transition-colors cursor-pointer"
                >
                  <RotateCw size={12} className="animate-spin-slow" />
                  <span>{isEs ? 'Girar 3D' : 'Flip 3D'}</span>
                </button>

                {!prefersReducedMotion && (
                  <div className="hidden sm:inline-flex items-center gap-1 font-mono text-[10px] text-neutral-500">
                    <Layers aria-hidden="true" className="h-3 w-3 text-emerald-500/70" />
                    <span>{dictionary.hero.interactiveHint}</span>
                  </div>
                )}
              </div>
            </CardItem>
          </CardBody>

          {/* ========================================================= */}
          {/* BACK FACE (NFC Physical Card Reverse with Embedded QR)    */}
          {/* ========================================================= */}
          <div
            className={cn(
              'absolute inset-0 p-5 sm:p-6 rounded-2xl border border-white/10 bg-[#0a0a0a]/95 backdrop-blur-xl shadow-[0_20px_45px_rgba(0,0,0,0.85)] flex flex-col justify-between [backface-visibility:hidden] [transform:rotateY(180deg)_translateZ(0)]',
              !isFlipped && 'pointer-events-none'
            )}
            data-testid="hero-card-back"
          >
            <BorderBeam
              duration={12}
              borderWidth={1.5}
              colorFrom="#10b981"
              colorTo="#059669"
            />

            {/* Top Bar on Reverse */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Wifi className="h-4 w-4 rotate-90 text-emerald-400" />
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-400">
                  NFC SMARTCARD · REVERSE
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsFlipped(false)}
                data-testid="flip-card-back-button"
                aria-label={isEs ? 'Volver al anverso' : 'Flip back to front'}
                className="inline-flex min-h-[44px] items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-neutral-900 text-neutral-300 hover:text-white text-xs font-mono transition-colors cursor-pointer"
              >
                <RotateCcw size={12} />
                <span>{isEs ? 'Volver' : 'Back'}</span>
              </button>
            </div>

            {/* Central Scannable QR Code */}
            <div className="flex flex-col items-center justify-center my-auto py-2">
              <div className="p-2.5 rounded-2xl bg-white shadow-[0_0_25px_rgba(16,185,129,0.25)] ring-1 ring-emerald-500/30">
                <svg
                  role="img"
                  aria-label="QR Code to virtual card"
                  viewBox="0 0 33 33"
                  className="w-32 h-32 text-neutral-950 fill-current"
                  shapeRendering="crispEdges"
                >
                  <path d={qrSvgPath} />
                </svg>
              </div>
              <p className="mt-2.5 font-mono text-[11px] text-emerald-400 tracking-tight font-medium">
                card.ivanolivera.dev/?ref=nfc
              </p>
              <p className="text-[11px] text-neutral-400 mt-0.5 text-center">
                {isEs ? 'Escanea con la cámara del móvil' : 'Scan with phone camera to connect'}
              </p>
            </div>

            {/* Bottom Bar on Reverse */}
            <div className="border-t border-white/10 pt-3 flex items-center justify-between text-xs font-mono text-neutral-400">
              <span>Yuvod · Systems & Backend</span>
              <a
                href={AUTHORIZED_PROFILE.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1 font-medium transition-colors"
              >
                <span>github.com/Ivan-olivera-dev</span>
                <ArrowUpRight size={13} />
              </a>
            </div>
          </div>
        </motion.div>
      </CardContainer>
    </section>
  );
}

export default HeroCard3D;
