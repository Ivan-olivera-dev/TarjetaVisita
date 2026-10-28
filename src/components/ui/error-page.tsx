import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

export interface ErrorPageProps {
  onReset?: () => void;
}

/**
 * Cyberpunk Terminal Glitch Error Page (404 / Connection Severed)
 * Inspired by https://registry.watermelon.sh/r/error-3.json
 * Styled with the executive emerald-500 / dark theme and zero emojis.
 */
export const ErrorPage: React.FC<ErrorPageProps> = ({ onReset }) => {
  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onReset) {
      e.preventDefault();
      onReset();
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black font-mono selection:bg-emerald-500/30">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-4">
        <div className="relative z-10 max-w-2xl space-y-8 text-center">
          {/* Glitch 404 Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative inline-block"
          >
            <h1
              className="text-8xl font-black tracking-tighter text-transparent select-none md:text-[10rem]"
              style={{ WebkitTextStroke: '2px rgba(16, 185, 129, 0.2)' }}
            >
              404
            </h1>
            <motion.h1
              animate={{ x: [-3, 3, -3], opacity: [0.8, 1, 0.8] }}
              transition={{
                duration: 0.15,
                repeat: Infinity,
                repeatType: 'mirror',
              }}
              className="absolute inset-0 text-8xl font-black tracking-tighter text-emerald-500 mix-blend-screen select-none md:text-[10rem]"
              style={{ clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)' }}
              aria-hidden="true"
            >
              404
            </motion.h1>
            <motion.h1
              animate={{ x: [3, -3, 3], opacity: [0.8, 1, 0.8] }}
              transition={{
                duration: 0.25,
                repeat: Infinity,
                repeatType: 'mirror',
              }}
              className="absolute inset-0 text-8xl font-black tracking-tighter text-emerald-400 mix-blend-screen select-none md:text-[10rem]"
              style={{
                clipPath: 'polygon(0 55%, 100% 55%, 100% 100%, 0 100%)',
              }}
              aria-hidden="true"
            >
              404
            </motion.h1>
            <h1 className="absolute inset-0 text-8xl font-black tracking-tighter text-white select-none md:text-[10rem]">
              404
            </h1>
          </motion.div>

          {/* Terminal message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="border border-emerald-500/20 bg-black/60 p-6 rounded-2xl backdrop-blur-md shadow-[0_0_20px_rgba(16,185,129,0.1)]"
          >
            <div className="mb-4 flex items-center justify-center gap-3">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-xl font-bold tracking-[0.2em] text-emerald-400 uppercase md:text-2xl">
                Connection Severed
              </h2>
            </div>

            <p className="leading-relaxed text-neutral-400 text-sm md:text-base font-sans">
              Critical routing failure. The endpoint you requested has been redacted, moved, or never existed in the main sequence.
            </p>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row"
          >
            <a
              href="/"
              onClick={handleHomeClick}
              className="group relative overflow-hidden bg-emerald-500 px-8 py-4 rounded-xl text-sm font-bold tracking-widest text-black uppercase transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(16,185,129,0.4)]"
            >
              <div className="relative flex items-center gap-2">
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                <span>Initialize Reboot</span>
              </div>
            </a>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="border border-emerald-500/30 px-8 py-4 rounded-xl text-sm font-bold tracking-widest text-emerald-400 uppercase transition-all duration-300 hover:bg-emerald-500/10 hover:border-emerald-500/60"
            >
              Retry Uplink
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
