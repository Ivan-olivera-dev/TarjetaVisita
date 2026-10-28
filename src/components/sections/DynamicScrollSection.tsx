import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, Briefcase, GraduationCap, Trophy, Terminal } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { AUTHORIZED_PROFILE, type Language, type TranslationDictionary, getTranslations } from '../../data/profile';
import { trackEvent } from '../../lib/analytics';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { BorderBeam } from '../ui/border-beam';

export interface DynamicScrollSectionProps {
  language?: Language;
  t?: TranslationDictionary;
}

/**
 * Full-screen Snap Section with a Dynamic 3D Showcase Card.
 * Displays Iván's career track record in ultra-concise badge format.
 */
export const DynamicScrollSection: React.FC<DynamicScrollSectionProps> = ({
  language: controlledLang,
  t: controlledT,
}) => {
  const { language: hookLang } = useLanguage();
  const activeLanguage = controlledLang ?? hookLang;
  const dictionary = controlledT ?? getTranslations(activeLanguage);
  const isEs = activeLanguage === 'es';
  const prefersReducedMotion = useReducedMotion();

  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'center center'],
  });

  // Dynamic 3D tilt tracking scroll progress
  const scrollRotateX = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [14, 0]);
  const scrollRotateY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [-8, 0]);

  const handlePortfolioClick = () => {
    trackEvent('social_click', {
      network: 'portfolio',
      target: 'portfolio',
      url: AUTHORIZED_PROFILE.portfolioUrl,
    });
  };

  return (
    <section
      ref={sectionRef}
      data-testid="dynamic-scroll-section"
      aria-label={isEs ? 'Trayectoria y Logros 3D' : 'Career & Achievements 3D'}
      className="relative flex min-h-[100dvh] h-[100dvh] w-full snap-start snap-always flex-col items-center justify-center p-4 sm:p-6 [perspective:1200px]"
    >
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute h-72 w-72 rounded-full bg-emerald-500/15 blur-3xl"
      />

      {/* Centered 3D Dynamic Rotating Card */}
      <motion.div
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.9, y: 20 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
        style={{
          rotateX: scrollRotateX,
          rotateY: scrollRotateY,
          transformStyle: 'preserve-3d',
        }}
        className="group relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0a]/95 p-6 sm:p-7 shadow-[0_25px_60px_rgba(0,0,0,0.95)] backdrop-blur-2xl transition-colors duration-300 hover:border-emerald-500/40"
      >
        {/* Laser perimeter beam */}
        <BorderBeam
          duration={10}
          borderWidth={1.5}
          colorFrom="#10b981"
          colorTo="#059669"
        />

        {/* Header Badge */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="h-2 w-0.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"
            />
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-400">
              {isEs ? '// TRAYECTORIA & LOGROS' : '// TRACK RECORD & MILESTONES'}
            </span>
          </div>

          <span className="inline-flex items-center gap-1 font-mono text-[10px] text-neutral-400">
            <Terminal size={12} className="text-emerald-400" />
            <span>Production</span>
          </span>
        </div>

        {/* Main Role Card: Yuvod (Ultra-concise badges, zero fluff) */}
        <div className="rounded-2xl border border-white/5 bg-neutral-900/60 p-4 mb-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-2 font-mono text-xs font-semibold text-emerald-400">
              <Briefcase size={14} className="shrink-0" />
              <span>Yuvod · 2025 - {isEs ? 'Actualidad' : 'Present'}</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-500/15 border border-emerald-500/25 text-emerald-300">
              Active
            </span>
          </div>

          <h3 className="text-sm font-bold text-white tracking-tight">
            Software Engineer & Systems Administrator
          </h3>

          <div className="mt-2.5 flex flex-wrap gap-1.5">
            <span className="px-2.5 py-1 rounded-md bg-neutral-950 border border-white/5 font-mono text-[10px] text-neutral-300">
              PMS Integrations
            </span>
            <span className="px-2.5 py-1 rounded-md bg-neutral-950 border border-white/5 font-mono text-[10px] text-neutral-300">
              Linux & Docker
            </span>
            <span className="px-2.5 py-1 rounded-md bg-neutral-950 border border-white/5 font-mono text-[10px] text-neutral-300">
              Zabbix Monitoring
            </span>
          </div>
        </div>

        {/* Milestones & Credentials (2 compact rows) */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between rounded-xl border border-white/5 bg-neutral-900/40 px-3.5 py-2.5 text-xs">
            <div className="flex items-center gap-2 text-neutral-200">
              <Trophy size={14} className="text-emerald-400 shrink-0" />
              <span>4th HP CodeWars · Top 15 OICV</span>
            </div>
            <span className="font-mono text-[10px] text-emerald-400/80">Code</span>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-white/5 bg-neutral-900/40 px-3.5 py-2.5 text-xs">
            <div className="flex items-center gap-2 text-neutral-200">
              <GraduationCap size={14} className="text-blue-400 shrink-0" />
              <span>DAW (CEEDCV) & SMR (IES El Grao) · AWS & Cisco CCNA 1</span>
            </div>
            <span className="font-mono text-[10px] text-blue-400/80">Certs</span>
          </div>
        </div>

        {/* Full Portfolio CTA */}
        <a
          href={AUTHORIZED_PROFILE.portfolioUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handlePortfolioClick}
          aria-label={isEs ? 'Ver portfolio completo en ivanolivera.dev' : 'View full portfolio at ivanolivera.dev'}
          className="group/cta w-full min-h-[44px] py-3 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-white/10 hover:border-emerald-500/40 flex items-center justify-between text-xs font-medium text-white transition-all duration-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
        >
          <span className="text-neutral-300 group-hover/cta:text-white">
            {isEs ? 'Explorar casos y certificados' : 'Explore full case studies & certs'}
          </span>
          <span className="inline-flex items-center gap-1 font-mono text-emerald-400 group-hover/cta:translate-x-0.5 transition-transform">
            <span>ivanolivera.dev</span>
            <ArrowUpRight size={14} />
          </span>
        </a>
      </motion.div>

      {/* Minimal Footer */}
      <footer className="absolute bottom-4 text-center">
        <p className="font-mono text-[10px] text-neutral-500">
          2026 — {dictionary.footer.copyright}
        </p>
      </footer>
    </section>
  );
};
