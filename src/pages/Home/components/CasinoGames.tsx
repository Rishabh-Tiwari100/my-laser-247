import { useGetCasinoGamesQuery } from '@/store/api/casinoApi';
import { Icons } from '@/utils/icons';
import React, { useState } from 'react';
import CasinoGameLauncher from '@/components/casino/CasinoGameLauncher';
import {
  useAddToFavoriteMutation,
  useGetFavoriteGamesQuery,
} from '@/store/api/casinoHomePageApi';
import toast from 'react-hot-toast';
import { useIsAuthenticated, useIsDemoUser } from '@/hooks/redux';

const CasinoGames = ({ tab }: { tab?: { title: string; value: string; type: string } }) => {
  const [activeGameId, setActiveGameId] = useState<number | null>(null);
  const isAuthenticated = useIsAuthenticated();
  const isDemoUser = useIsDemoUser();
  const [addToFavorite] = useAddToFavoriteMutation();
  const { data: favoriteData } = useGetFavoriteGamesQuery(
    { page: 1, limit: 200 },
    { skip: !isAuthenticated }
  );
  const favoriteIds = new Set((favoriteData?.games ?? []).map((item) => item.gameId).filter(Boolean));

  const { data } = useGetCasinoGamesQuery({
    limit: 20,
    page: 1,
    provider: tab?.type === 'provider' ? tab?.value : undefined,
    category: tab?.type === 'category' ? tab?.value : undefined,
    search: tab?.type === 'search' ? tab?.value : undefined,
  });

  const handleToggleFavorite = async (id: number, isFav: boolean) => {
    if (isDemoUser) {
      toast.error('This feature is not available for demo users.', { id: 'favorite' });
      return;
    }

    if (!isAuthenticated) {
      toast.error('Login required');
      return;
    }

    try {
      const status = isFav ? 'UNFAVORITE' : 'FAVORITE';
      const res = await addToFavorite({ id, status }).unwrap();
      toast.success(res?.message || `Game ${isFav ? 'removed from' : 'added to'} favourites`, { id: 'favorite' });

    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update favourite', { id: 'favorite' });
    }
  };

  return (
    <div className="mt-[2px]">
      <CasinoGameLauncher
        open={activeGameId !== null}
        gameId={activeGameId}
        closePath="/"
        onClose={() => setActiveGameId(null)}
      />

      <div className="grid grid-cols-2 md:grid-cols-4">
        {data?.games.map((item) => (
          <div key={item.id} className="px-[2px] mt-1">
            <div className="relative z-0">
              <button
                type="button"
                className={`absolute left-[3px] top-[3px] z-10 flex size-[21px] items-center justify-center rounded-[0px_0px_8px] bg-[#9b9595]/30 text-10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${favoriteIds.has(item.id) ? 'text-[#ffc400] fill-yellow-300' : 'text-white'
                  }`}
                aria-label={`${favoriteIds.has(item.id) ? 'Remove' : 'Add'} ${item.name} ${favoriteIds.has(item.id) ? 'from' : 'to'
                  } favourites`}
                onClick={() => handleToggleFavorite(item.id, favoriteIds.has(item.id))}
              >
                <Icons.star className="h-[12px] w-[12px]" />
              </button>
              <button
                type="button"
                onClick={() => setActiveGameId(item.id)}
                className="block w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label={`Play ${item.name}`}
              >
                <img
                  src={item.gameImage}
                  alt={item.name}
                  className="h-[138px] md:h-[228px] w-full max-w-full align-middle"
                  onError={(e) => (e.currentTarget.src = '/images/casino/casino-fallback.webp')}
                />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CasinoGames;
