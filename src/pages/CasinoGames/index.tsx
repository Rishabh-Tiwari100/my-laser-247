import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import TabList from '@/components/common/TabList';
import CategoryTabs from './components/CategoryTabs';
import { Icons } from '@/utils/icons';
import { Link, useNavigate } from 'react-router-dom';
import Skeleton from '@/components/common/Skeleton';
import { clearCasinoGameDetail } from '@/store/slices/casinoGameDetailSlice';
import { useCasinoGames } from './hooks/useCasinoGames';
import Banner from '@/components/common/Banner';
import Marquee from '@/components/common/Marquee';
const TabListMemoize = TabList;

const CasinoGames: React.FC = () => {
  const navigate = useNavigate();

  const {
    debouncedSearch,
    selectedProvider,
    selectedCategory,
    setSelectedCategory,
    setIsIframeLoaded,
    allGames,
    hasMore,
    isLoading,
    isFetching,
    error,
    handleProviderSelect,
    handleGameClick,
    categoryList,
    providerList,
    observerTarget,
    gameUrl,
    setGameUrl,
    sessionLoading,
    isIframeLoaded,
    dispatch,
    handleToggleFavorite,
  } = useCasinoGames();

  const username = useSelector((state: RootState) => state.user.profile?.username);

  useEffect(() => {
    if (!gameUrl) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [gameUrl]);

  if (error) {
    return (
      <div className="min-h-screen bg-[#eee] px-[8px] pt-[3px] font-helvetica text-black">
        <div className="mb-1 px-2 py-1 text-white bg-primary w-full flex items-center gap-x-8 border border-b-[3px] border-r-[3px] border-black rounded-md">
          <button onClick={() => navigate(-1)} className="flex items-center gap-x-1">
            <Icons.angularLeftArrow />
            <span className="text-sm">Back</span>
          </button>
        </div>

        <div className="flex items-center justify-center h-64 text-center">
          <div>
            <p className="text-red-400 text-lg mb-2">Error loading games</p>
            <p className="text-gray-400">Please try again later</p>
          </div>
        </div>
      </div>
    );
  }

  if (gameUrl && !sessionLoading) {
    return createPortal(
      <div
        className="fixed inset-0 z-[9999] flex flex-col bg-[#171725]"
        role="dialog"
        aria-modal="true"
        aria-label="Casino game"
      >
        <header className="flex h-14 shrink-0 items-center justify-between bg-gradient-to-r from-[#08003f] via-[#132ca2] to-[#08bfe8] px-3 text-white shadow-md">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                dispatch(clearCasinoGameDetail());
                setIsIframeLoaded(false);
                setGameUrl('');
              }}
              className="rounded p-1 transition-colors hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="Close game and return to casino"
            >
              <Icons.home className="h-5 w-5" />
            </button>
            <Link to="/" className="flex items-center gap-2">
              <img src="/images/logo.png" alt="Laser247" className="h-8 w-auto object-contain" />
            </Link>
          </div>

          {username && (
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Icons.userFilled className="h-4 w-4" />
              <span className="max-w-[180px] truncate">{username}</span>
            </div>
          )}
        </header>

        <div className="relative min-h-0 flex-1">
          {isIframeLoaded && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black">
              <div className="h-16 w-16 animate-spin rounded-full border-[5px] border-white/30 border-b-white" />
            </div>
          )}
          <iframe
            src={gameUrl}
            title="Casino game"
            className="block h-full w-full border-0"
            allow="autoplay; fullscreen"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            onLoad={() => setIsIframeLoaded(false)}
          />
        </div>
      </div>,
      document.body
    );
  }

  if (sessionLoading || isIframeLoaded) {
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

  return (
    <div className="flex min-w-0 flex-col overflow-hidden bg-white pt-[3px] font-helvetica text-white">
      <Marquee tagName="News" className="mb-px h-[26px] leading-[26px]" />
      <Banner className="m-0" />
      {/* Header */}
      <div className="flex min-h-[26px] w-full items-center justify-between border border-[#c8ced3] bg-[#243a48]">
        <div className="flex items-center gap-[2px] pl-[10px]">
          <img src="/icons/casino.png" alt="" className="max-w-5 mr-[3px] invert w-auto" />
          <span className="font-bold text-xs capitalize leading-[25px]">Casino</span>
        </div>
        <div className="relative flex h-[25.2px] w-[60%] items-center lg:w-1/4">
          <input
            type="text"
            placeholder="Search Games..."
            aria-label="Search casino games"
            onChange={(event) => debouncedSearch(event.target.value.trim())}
            className="text-black bg-white w-full border border-[#F44336] h-[25.2px] pl-[10px] pr-[32px] py-[5px] text-[12px] focus:outline-none"
          />
          <span className="absolute right-px top-0 flex items-center justify-center h-[25px] w-[28px] p-[7px] bg-[red] text-white ">
            <img src="/icons/casino-search.svg" alt="" className="brightness-0 invert" />
          </span>
        </div>
      </div>
      {/* Provider Tabs */}
      <div className="min-w-0 max-w-full">
        <TabListMemoize
          list={providerList}
          selected={selectedProvider}
          onSelect={handleProviderSelect}
          className="m-0"
        />
        <CategoryTabs
          categories={categoryList || []}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          className="mt-[5px]"
        />
      </div>

      <div className="mt-[10px] min-w-0 flex-1">
        <div className="grid grid-cols-3 gap-[4px] px-px lg:grid-cols-4">
          {allGames.map((item) => {
            const isFavorite = Boolean(item.isFavorite ?? item.isFavourite);

            return (
              <div
                key={item.id}
                className="group relative min-w-0 overflow-hidden bg-[#243a48] text-left"
              >
                <button
                  type="button"
                  onClick={() => handleGameClick(item.id)}
                  className="block w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label={`Play ${item.name}`}
                >
                  <img
                    loading="lazy"
                    className="block aspect-video w-full max-w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                    src={item.gameImage}
                    alt={item.name}
                    onError={(e) => (e.currentTarget.src = '/images/casino/casino-fallback.webp')}
                  />
                  <span className="flex h-[21px] items-center justify-center overflow-hidden bg-[#243a48] px-[3px] text-center text-[10px] font-bold uppercase leading-[12px] text-white">
                    <span className="truncate">{item.name}</span>
                  </span>
                </button>

                <button
                  type="button"
                  className={`absolute left-[3px] top-[3px] flex size-[21px] items-center justify-center rounded-[0px_0px_8px] border border-white/25 bg-black/45 text-white shadow-[0_1px_2px_rgba(0,0,0,0.35)] transition-opacity hover:bg-black/70 focus:outline-none lg:opacity-0 lg:group-hover:opacity-100 lg:focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-primary ${
                    isFavorite ? 'text-[#ffc400]' : 'text-white'
                  }`}
                  aria-label={`${isFavorite ? 'Remove' : 'Add'} ${item.name} ${
                    isFavorite ? 'from' : 'to'
                  } favourites`}
                  onClick={() => handleToggleFavorite(item.id, isFavorite)}
                >
                  {isFavorite ? (
                    <Icons.fillStar className="h-[15px] w-[15px]" />
                  ) : (
                    <Icons.outlineStar className="h-[15px] w-[15px]" />
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {(isLoading || isFetching) &&
          Array.from({ length: 14 }).map((_, i) => <Skeleton key={i} />)}

        {hasMore && <div ref={observerTarget} className="h-10 mt-4" />}

        {!hasMore && allGames.length > 0 && (
          <div className="py-[20px] text-center text-[12px] text-[#6c757d]">
            No more games available.
          </div>
        )}

        {!isLoading && allGames.length === 0 && (
          <div className="py-[40px] text-center text-[#6c757d]">
            <p className="text-lg">No games found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CasinoGames;
