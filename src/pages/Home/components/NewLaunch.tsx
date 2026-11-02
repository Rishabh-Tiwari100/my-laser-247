import {
  useAddToFavoriteMutation,
  useGetCasinoStaticGamesQuery,
  useGetFavoriteGamesQuery,
} from '@/store/api/casinoHomePageApi';
import React from 'react';
import CasinoGameLauncher from '@/components/casino/CasinoGameLauncher';
import { Icons } from '@/utils/icons';
import toast from 'react-hot-toast';
import { useIsAuthenticated, useIsDemoUser } from '@/hooks/redux';

const NewLaunch = () => {
  const { data } = useGetCasinoStaticGamesQuery();
  const isAuthenticated = useIsAuthenticated();
  const isDemoUser = useIsDemoUser();
  const { data: favoriteData } = useGetFavoriteGamesQuery(
    { page: 1, limit: 8 },
    { skip: !isAuthenticated }
  );
  const [addToFavorite] = useAddToFavoriteMutation();
  const newLaunchGames = data?.games?.find((item) => item.title === 'New Launch')?.games || [];
  const favoriteGames = favoriteData?.games ?? [];
  const favoriteIds = new Set((favoriteGames ?? []).map((item) => item.gameId).filter(Boolean));
  const games = [
    {
      name: 'marble plinko classic',
      img: '/images/home-images/new-launch/marble-plinko-classic.webp',
    },
    {
      name: 'rolling dunes classic',
      img: '/images/home-images/new-launch/marbles-rolling-dunes-classic.webp',
    },
    {
      name: 'duck racing',
      img: '/images/home-images/new-launch/marbles_duck_racing.webp',
    },
    {
      name: 'stair pong',
      img: '/images/home-images/new-launch/marbles_stairpong.webp',
    },
    {
      name: 'battle cricket',
      img: '/images/home-images/new-launch/more_slots_battle_cricket.webp',
    },
  ];
  const [activeGameId, setActiveGameId] = React.useState<number | null>(null);

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
      await addToFavorite({ id, status }).unwrap();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update favourite', { id: 'favorite' });
    }
  };

  return (
    <div className="mt-[2px] md:mt-[10px]">
      <CasinoGameLauncher
        open={activeGameId !== null}
        gameId={activeGameId}
        closePath="/"
        onClose={() => setActiveGameId(null)}
      />

      <div className="relative bg-[linear-gradient(-180deg,#f72424,#bb1c00)] text-white flex items-center min-w-full w-full uppercase p-[5px] text-[15px] leading-[1.5]">
        <span className="">NEW LAUNCH</span>
      </div>
      <div className="px-px md:px-[5px] overflow-x-auto flex scroll-snap snap-x snap-mandatory gap-[10px]">
        <div className="flex items-center max-w-full flex-wrap">
          {newLaunchGames.map((game, index) => (
            <div key={game.id} className="w-1/4 min-w-1/4 relative p-[2px]">
              <button
                type="button"
                onClick={() => setActiveGameId(game.id)}
                className="block w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label={`Play ${game.name}`}
              >
                <img
                  src={games[index]?.img || '/images/casino/casino-fallback.webp'}
                  alt={game.name}
                  className="img-fluid w-full h-[108px] md:h-[228px] block max-w-full"
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {favoriteGames.some((item) => item?.game?.id) && (
        <>
          <div className="relative bg-[linear-gradient(-180deg,#f72424,#bb1c00)] text-white flex items-center min-w-full w-full uppercase p-[5px] text-[15px] leading-[1.5] mt-[4px]">
            <span>MY FAVOURITES</span>
            <img className="size-6" src="/icons/favorite-casino.svg" alt="" />
          </div>
          <div className="flex items-center max-w-full overflow-x-auto overflow-y-hidden whitespace-nowrap gap-1/2 md:gap-1 py-[5px] scrollbar-hide scroll-snap snap-x snap-mandatory touch-pan-x">
            {favoriteGames.map((item) => {
              const game = item?.game;
              const isFavorite = Boolean(game?.id && favoriteIds.has(game.id));

              if (!game?.id) return null;

              return (
                <div key={game.id} className="min-w-[115px] h-[100px] md:min-w-[203px] md:h-[135px] relative shrink-0 snap-start">
                  <button
                    type="button"
                    className={`absolute left-[5px] top-[5px] z-10 flex size-[21px] items-center justify-center rounded-[0px_0px_8px] bg-[#9b9595]/30 text-10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${isFavorite ? 'text-[#ffc400]' : 'text-white'
                      }`}
                    aria-label={`${isFavorite ? 'Remove' : 'Add'} ${game.name || 'game'} ${isFavorite ? 'from' : 'to'
                      } favourites`}
                    onClick={() => handleToggleFavorite(game.id, isFavorite)}
                  >
                    <Icons.star className="h-[12px] w-[12px]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveGameId(game?.id ?? null)}
                    className="block w-full h-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    aria-label={`Play ${game.name}`}
                  >
                    <img
                      src={game.gameImage || '/images/casino/casino-fallback.webp'}
                      alt={game.name || 'Favourite game'}
                      className="object-fill w-full h-full"
                      onError={(e) => (e.currentTarget.src = '/images/casino/casino-fallback.webp')}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default NewLaunch;
