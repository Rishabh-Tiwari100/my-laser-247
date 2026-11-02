import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useLazyGetCasinoGamesQuery } from '@/store/api/casinoApi';

export const useFantasyGameLauncher = () => {
  const [getCasinoGames] = useLazyGetCasinoGamesQuery();
  const [activeGameId, setActiveGameId] = useState<number | null>(null);
  const [isLaunchingFantasy, setIsLaunchingFantasy] = useState(false);
  const launchInProgress = useRef(false);

  const launchFantasyGame = async () => {
    if (launchInProgress.current || activeGameId !== null) return;

    launchInProgress.current = true;
    setIsLaunchingFantasy(true);

    try {
      const { games } = await getCasinoGames({
        category: 'fantasy sports',
        page: 1,
        limit: 20,
        status: 'ACTIVE',
        search: 'Cricket Fantasy',
      }).unwrap();
      const firstGame = games[0];

      if (!firstGame) {
        toast.error('Fantasy 11 is currently unavailable.', { id: 'fantasy-game-missing' });
        return;
      }

      setActiveGameId(firstGame.id);
    } catch {
      toast.error('Failed to launch Fantasy 11.', { id: 'fantasy-game-launch-error' });
    } finally {
      launchInProgress.current = false;
      setIsLaunchingFantasy(false);
    }
  };

  const closeFantasyGame = () => setActiveGameId(null);

  return {
    activeGameId,
    isLaunchingFantasy,
    launchFantasyGame,
    closeFantasyGame,
  };
};