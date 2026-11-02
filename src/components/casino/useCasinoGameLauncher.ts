import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useCreateCasinoSessionMutation } from '@/store/api/casinoApi';
import { useIsAuthenticated, useIsDemoUser } from '@/hooks/redux';
import { getPlatform } from '@/utils';
import { useLocation, useNavigate } from 'react-router-dom';

type LaunchOptions = {
  closePath?: string;
  onClose?: () => void;
  onLaunch?: (url: string) => void;
  onBeforeLaunch?: (gameId: number) => void;
};

export const useCasinoGameLauncher = (options: LaunchOptions = {}) => {
  const { closePath, onClose, onLaunch, onBeforeLaunch } = options;
  const [createSession, { isLoading: sessionLoading }] = useCreateCasinoSessionMutation();
  const isAuthenticated = useIsAuthenticated();
  const isDemoUser = useIsDemoUser();
  const navigate = useNavigate();
  const location = useLocation();

  const [gameUrl, setGameUrl] = useState<string | null>(null);
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);

  const closeGame = useCallback(() => {
    setIsIframeLoaded(false);
    setGameUrl(null);
    onClose?.();

    if (closePath) {
      navigate(closePath);
      return;
    }

    if (location.pathname !== '/casino') {
      navigate(-1);
    }
  }, [closePath, location.pathname, navigate, onClose]);

  const launchGame = useCallback(
    async (gameId: number) => {
      onBeforeLaunch?.(gameId);

      if (isDemoUser) {
        toast.error('Demo users are not allowed to play casino games.', { id: 'game-session' });
        return;
      }

      if (!isAuthenticated) {
        toast.error('Login required');
        navigate('/login');
        return;
      }

      try {
        const result: any = await createSession({ id: gameId, platform: getPlatform() }).unwrap();

        if (result?.url) {
          setGameUrl(result.url);
          setIsIframeLoaded(true);
          onLaunch?.(result.url);
        }
      } catch {
        toast.error('Failed to create game session');
      }
    },
    [createSession, isAuthenticated, isDemoUser, navigate, onBeforeLaunch, onLaunch]
  );

  useEffect(() => {
    if (!gameUrl) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [gameUrl]);

  return {
    gameUrl,
    setGameUrl,
    isIframeLoaded,
    setIsIframeLoaded,
    sessionLoading,
    launchGame,
    closeGame,
  };
};
