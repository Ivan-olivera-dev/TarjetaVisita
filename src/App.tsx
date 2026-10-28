import { useCallback, useEffect, useState, type ReactElement } from 'react';
import { ChevronDown } from 'lucide-react';
import { AUTHORIZED_PROFILE } from './data/profile';
import { useLanguage } from './hooks/useLanguage';
import { detectAndTrackNfcScan } from './lib/analytics';
import { Header } from './components/sections/Header';
import { HeroCard3D } from './components/sections/HeroCard3D';
import { Loader } from './components/sections/Loader';
import { QuickActions } from './components/sections/QuickActions';
import { DynamicScrollSection } from './components/sections/DynamicScrollSection';
import { QrSheet } from './components/ui/qr-sheet';
import { ErrorPage } from './components/ui/error-page';

export type ActiveModalType = 'qr' | null;

export function App(): ReactElement {
  const { language, setLanguage, t } = useLanguage();
  const [activeModal, setActiveModal] = useState<ActiveModalType>(null);
  const [isErrorRoute, setIsErrorRoute] = useState(false);
  const isEs = language === 'es';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      if (pathname && pathname !== '/' && pathname !== '/index.html') {
        setIsErrorRoute(true);
      }
      const search = window.location.search;
      detectAndTrackNfcScan(search);
    }
  }, []);

  const handleOpenQr = useCallback(() => {
    setActiveModal('qr');
  }, []);

  const handleCloseModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  const handleResetError = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/');
      setIsErrorRoute(false);
    }
  }, []);

  if (isErrorRoute) {
    return <ErrorPage onReset={handleResetError} />;
  }

  return (
    <div
      data-testid="app-root"
      className="relative h-[100dvh] w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth bg-black text-white selection:bg-emerald-500/30 selection:text-emerald-200 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
    >
      {/* Initial System Loader (~1.4s on first session visit, 0ms on subsequent or reduced-motion) */}
      <Loader />

      {/* Subtle Executive Grid & Radial Top Mask */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 bg-grid-executive [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"
      />

      {/* ========================================================================= */}
      {/* SCREEN 1: Full-Screen Virtual NFC Business Card (Hero + Actions)           */}
      {/* ========================================================================= */}
      <section
        data-testid="screen-hero"
        aria-label={isEs ? 'Tarjeta de Visita Principal' : 'Primary Business Card'}
        className="relative z-10 mx-auto flex min-h-[100dvh] h-[100dvh] w-full max-w-lg snap-start snap-always flex-col justify-between px-4 pb-3 pt-2 sm:px-6"
      >
        <Header
          language={language}
          onLanguageChange={setLanguage}
          t={t}
        />

        <div className="flex flex-col gap-2.5 my-auto">
          <HeroCard3D
            language={language}
            t={t}
          />

          <QuickActions
            language={language}
            t={t}
            profile={AUTHORIZED_PROFILE}
            onOpenQr={handleOpenQr}
          />
        </div>

        {/* Scroll Snap Cue */}
        <div className="flex items-center justify-center gap-1.5 pb-1 text-neutral-500 animate-bounce">
          <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400">
            {isEs ? 'Desliza' : 'Scroll'}
          </span>
          <ChevronDown size={14} className="text-emerald-400" />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SCREEN 2: Full-Screen 3D Dynamic Scroll Rotating Showcase Card            */}
      {/* ========================================================================= */}
      <DynamicScrollSection
        language={language}
        t={t}
      />

      {/* QR Code / Share Sheet Modal */}
      <QrSheet
        isOpen={activeModal === 'qr'}
        onClose={handleCloseModal}
        language={language}
        t={t}
        profile={AUTHORIZED_PROFILE}
      />
    </div>
  );
}

export default App;
