import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useAddToFavoriteMutation, useGetFavoriteGamesQuery } from '@/store/api/casinoHomePageApi';
import { Icons } from '@/utils/icons';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCasinoGameDetail } from '@/store/slices/casinoGameDetailSlice';
import Skeleton from '@/components/common/Skeleton';

function CasinoFavouriteGames() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());
  const [page, setPage] = useState(1);
  const [allFavGames, setAllFavGames] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const isLoadingMore = useRef(false);

  const { data, isLoading, isFetching } = useGetFavoriteGamesQuery({
    page,
    limit: 20,
  });

  const [addToFavorite] = useAddToFavoriteMutation();

  const handleToggleFavorite = async (id: number, isFav: boolean) => {
    try {
      const status = isFav ? 'UNFAVORITE' : 'FAVORITE';
      const res = await addToFavorite({ id, status }).unwrap();
      toast.success(res?.message || 'Favourite updated', { id: 'favorite' });

      if (status === 'UNFAVORITE') {
        setAllFavGames((prev) => prev.filter((g) => g.gameId !== id));
      }
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to update favourite', { id: 'favorite' });
    }
  };

  const handleGameClick = (game: any) => {
    dispatch(setCasinoGameDetail(game));
    navigate('/casino');
  };

  useEffect(() => {
    if (!data?.games) return;

    if (page === 1) {
      setAllFavGames(data.games);
    } else {
      setAllFavGames((prev) => [...prev, ...(data.games ?? [])]);
    }
    if (data.pagination) {
      setHasMore(page < data.pagination.totalPage);
    }

    isLoadingMore.current = false;
  }, [data, page]);

  const observer = useRef<IntersectionObserver | null>(null);

  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observer.current) {
        observer.current.disconnect();
      }

      if (!hasMore) return;

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            if (!isLoadingMore.current && !isFetching && !isLoading) {
              isLoadingMore.current = true;
              setPage((prev) => prev + 1);
            }
          }
        },
        {
          rootMargin: '100px',
        }
      );

      if (node) {
        observer.current.observe(node);
      }
    },
    [hasMore]
  );

  return (
    <div className="text-white p-4">
      {/* Header */}
      <div className="mb-2 px-2 py-1 bg-primary text-white shadow-solid-black border border-black rounded-md flex items-center gap-x-2">
        <button onClick={() => navigate(-1)} className="flex items-center gap-x-1">
          <Icons.angularLeftArrow />
          <span className="text-sm">Back</span>
        </button>
        <span className="ml-auto font-semibold">Favorite Games</span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-7 gap-1.5 mt-4">
        {allFavGames.map((item, index) => {
          const isLastItem = index === allFavGames.length - 1;
          return (
            <div
              key={index}
              ref={isLastItem ? lastElementRef : null}
              className="relative group rounded-md overflow-hidden"
            >
              {failedImages.has(item?.game?.id) ? (
                <div className="relative w-full h-auto aspect-[4/3] rounded-md">
                  <img
                    src={'/images/casino/casino-fallback.webp'}
                    alt=""
                    className="w-full h-auto aspect-[4/3] rounded-md"
                  />

                  <span className="rounded-b-md line-clamp-2 text-xs font-semibold absolute left-0 right-0 bottom-0 p-2 text-center bg-black/50">
                    {item?.game?.name || ''}
                  </span>
                </div>
              ) : (
                <img
                  src={item?.game?.gameImage}
                  alt={item?.game?.name}
                  className="w-full aspect-[4/3] rounded-md object-fill cursor-pointer group-hover:opacity-80"
                  onClick={() => handleGameClick(item?.game)}
                  onError={() => setFailedImages((prev) => new Set(prev.add(item?.game?.id)))}
                />
              )}
              <div className="absolute inset-0 flex justify-center items-center group-hover:bg-black/40 rounded-md">
                <button
                  className="hidden group-hover:block"
                  onClick={() => handleGameClick(item?.game)}
                >
                  <Icons.playButton className="h-10 w-10" />
                </button>

                <button
                  onClick={() => handleToggleFavorite(item?.game?.id, true)}
                  className="absolute top-2 right-2 bg-black p-1.5 rounded-full text-yellow-400"
                >
                  <Icons.fillHeart className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}

        {/* Skeletons */}
        {(isLoading || isFetching) &&
          Array.from({ length: 10 }).map((_, i) => <Skeleton key={`skeleton-${i}`} />)}
      </div>

      {/* Empty State */}
      {!isLoading && !isFetching && allFavGames.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">No favourite games found</p>
        </div>
      )}
    </div>
  );
}

export default CasinoFavouriteGames;
