import React from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { Icons } from '@/utils/icons';
import { useCasinoGameLauncher } from './useCasinoGameLauncher';

type CasinoGameLauncherProps = {
  gameId: number | null;
  open: boolean;
  title?: string;
  closePath?: string;
  onClose?: () => void;
};

const CasinoGameLauncher = ({
  gameId,
  open,
  title = 'Casino game',
  closePath,
  onClose,
}: CasinoGameLauncherProps) => {
  const { gameUrl, isIframeLoaded, sessionLoading, setIsIframeLoaded, closeGame, launchGame } =
    useCasinoGameLauncher({ closePath, onClose });

  React.useEffect(() => {
    if (open && gameId) {
      void launchGame(gameId);
    }
  }, [gameId, launchGame, open]);

  if (!open || !gameId) {
    return null;
  }

  if (!gameUrl || sessionLoading) {
    return (
      <div
        className="flex h-full min-h-[calc(100vh-106px)] w-full items-center justify-center bg-black"
        role="status"
        aria-label="Loading casino game"
      >
        <div className="h-[100px] w-[100px] animate-spin rounded-full border-[6px] border-white/30 border-b-white" />
      </div>
    );
  }

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex flex-col bg-[#171725]" role="dialog" aria-modal="true" aria-label={title}>
      <header className="flex h-14 shrink-0 items-center justify-between bg-gradient-to-r from-[#08003f] via-[#132ca2] to-[#08bfe8] px-3 text-white shadow-md">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={closeGame}
            className="rounded p-1 transition-colors hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Close game"
          >
            <Icons.home className="h-5 w-5" />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <img src="/images/logo.png" alt="Laser247" className="h-8 w-auto object-contain" />
          </Link>
        </div>
      </header>

      <div className="relative min-h-0 flex-1">
        {isIframeLoaded && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black">
            <div className="h-16 w-16 animate-spin rounded-full border-[5px] border-white/30 border-b-white" />
          </div>
        )}
        <iframe
          src={gameUrl}
          title={title}
          className="block h-full w-full border-0"
          allow="autoplay; fullscreen"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          onLoad={() => setIsIframeLoaded(false)}
        />
      </div>
    </div>,
    document.body
  );
};

export default CasinoGameLauncher;
