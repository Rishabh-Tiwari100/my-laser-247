import BackButton from '@/components/common/BackButton';
import MarketHeader from '@/components/common/MarketHeader';
import MarketPanel from '@/pages/MarketDetails/components/MarketPanel';
import { Icons } from '@/utils/icons';
import dayjs from 'dayjs';
import { useNavigate, useParams } from 'react-router-dom';
import { Runner } from '@/types/market';
import { cn } from '@/utils';
import LiveTabs from './components/LiveTabs';
import { useMarketDetails } from './hooks/useMarketDetails';
import { Loader2 } from 'lucide-react';
import { useDeviceWidth } from '@/hooks/useDeviceWidth';
import { VscTriangleDown } from 'react-icons/vsc';
import CategoryFilter from './components/CategoryFilter';
import NormalMarket from './components/NormalMarket';
import FancyRow from './components/FancyRow';
import BookmakerMarket from './components/BoomakerMarket';
import OpenBetsModal from './components/OpenBetsModal';
import { useEffect, useRef, useState } from 'react';
import MarketFilterModal, {
  defaultMarketFilterSettings,
  type MarketFilterSettings,
} from './components/MarketFilterModal';

const getFancyMarketPinKey = (market: any) => {
  const runner = Array.isArray(market?.runners) ? market.runners[0] : market?.runners;
  return String(
    market?.marketId ??
    market?.id ??
    runner?.selectionId ??
    `${market?.marketName ?? market?.name ?? ''}-${runner?.runnerName ?? ''}`
  );
};

function MarketDetails() {
  const { sportName = '', eventId } = useParams();
  const marketDetailsRef = useRef<HTMLDivElement>(null);
  const [isOpenBetsVisible, setIsOpenBetsVisible] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const pinnedFancyStorageKey = `pinnedFancyMarkets:${eventId ?? 'unknown'}`;
  const [pinnedFancyKeys, setPinnedFancyKeys] = useState<string[]>([]);
  const [marketFilterSettings, setMarketFilterSettings] = useState<MarketFilterSettings>(
    defaultMarketFilterSettings
  );
  const [openTV, setOpenTV] = useState(false);
  const [openScorecard, setOpenScorecard] = useState(false);

  const sport = sportName.charAt(0).toUpperCase() + sportName.slice(1);
  const navigate = useNavigate();
  const width = useDeviceWidth();
  const {
    isLoadingEventDetails,

    liveScoreRef,
    activeCatTab,
    setActiveCatTab,
    showLiveScore,
    activePremiumTab,
    setActivePremiumTab,
    activeFancyTab,
    setActiveFancyTab,
    setShowLiveScore,
    handleSetIframeHeight,

    iframeHeight,
    liveScoreUrl,
    liveTvUrl,
    categoryTabs,
    startTime,
    eventName,

    fancyMarketsData,
    fancyTabs,
    premiumTabs,
    allMarkets,
    isLiveTvOpen,
    setIsLiveTvOpen,
    inplay,
    isFavorite,
  } = useMarketDetails(sport);

  useEffect(() => {
    try {
      const storedPinnedMarkets = window.localStorage.getItem(pinnedFancyStorageKey);
      const parsedPinnedMarkets = storedPinnedMarkets ? JSON.parse(storedPinnedMarkets) : [];
      setPinnedFancyKeys(Array.isArray(parsedPinnedMarkets) ? parsedPinnedMarkets.map(String) : []);
    } catch {
      setPinnedFancyKeys([]);
    }
  }, [pinnedFancyStorageKey]);

  const togglePinnedFancy = (market: any) => {
    const marketKey = getFancyMarketPinKey(market);
    setPinnedFancyKeys((currentKeys) => {
      const nextKeys = currentKeys.includes(marketKey)
        ? currentKeys.filter((key) => key !== marketKey)
        : [...currentKeys, marketKey];

      window.localStorage.setItem(pinnedFancyStorageKey, JSON.stringify(nextKeys));
      return nextKeys;
    });
  };

  useEffect(() => {
    const syncFullscreenState = () => {
      if (!document.fullscreenElement) {
        setMarketFilterSettings((current) => ({ ...current, showFullScreen: false }));
      }
    };

    document.addEventListener('fullscreenchange', syncFullscreenState);
    return () => document.removeEventListener('fullscreenchange', syncFullscreenState);
  }, []);

  if (isLoadingEventDetails)
    return (
      <div className="p-4">
        {/* <BackButton backButtonClassName="hidden sm:flex" /> */}
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-x-1 text-white">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Loading market details...
          </div>
        </div>
      </div>
    );

  const fancy =
    marketFilterSettings.hideFancyTabs || activeFancyTab === 'All'
      ? Object.values(fancyMarketsData ?? {}).flat()
      : (fancyMarketsData?.[activeFancyTab] ?? []);
  const pinnedFancyMarkets = fancy.filter((market) =>
    pinnedFancyKeys.includes(getFancyMarketPinKey(market))
  );
  const unpinnedFancyMarkets = fancy.filter(
    (market) => !pinnedFancyKeys.includes(getFancyMarketPinKey(market))
  );
  const getMarketIdentity = (market: { marketName?: string; marketType?: string }) =>
    `${market.marketName ?? ''} ${market.marketType ?? ''}`.toLowerCase();
  const isMatchOddsMarket = (market: { marketName?: string; marketType?: string }) =>
    /match\s*odds|match_odds/.test(getMarketIdentity(market));
  const isBookmakerMarket = (market: { marketName?: string; marketType?: string }) =>
    /bookmaker|book_maker/.test(getMarketIdentity(market));
  const visibleNormalMarkets = allMarkets?.filter((market) => {
    if (marketFilterSettings.hideMatchOdds && isMatchOddsMarket(market)) return false;
    if (marketFilterSettings.hideBookmakers && isBookmakerMarket(market)) return false;
    if (
      marketFilterSettings.hideOtherMarket &&
      !isMatchOddsMarket(market) &&
      !isBookmakerMarket(market)
    ) {
      return false;
    }
    return true;
  });

  const applyMarketFilters = (settings: MarketFilterSettings) => {
    setMarketFilterSettings(settings);
    setIsFilterModalOpen(false);

    if (settings.showFullScreen && !document.fullscreenElement) {
      void marketDetailsRef.current?.requestFullscreen?.();
    }

    if (!settings.showFullScreen && document.fullscreenElement) {
      void document.exitFullscreen?.();
    }
  };

  const clearMarketFilters = () => {
    setMarketFilterSettings(defaultMarketFilterSettings);
    if (document.fullscreenElement) {
      void document.exitFullscreen?.();
    }
  };

  return (
    <div
      ref={marketDetailsRef}
      className={cn(
        'flex flex-col gap-4 mt-[7px]',
        marketFilterSettings.showFullScreen &&
        'fixed inset-0 z-[5000000000000001] m-0 overflow-auto bg-white p-[7px]'
      )}
    >
      <div className="flex items-center text-xs">
        <div className="clip-path-[polygon(0_0,100%_0,calc(100%_-_23px)_100%,100%_100%,0_100%)] mr-2 ml-[5px]">
          <div className="flex h-[45px] min-w-[80px] items-center bg-[url('/icons/start-time-bg.svg')] bg-[length:145px] bg-right bg-no-repeat bg-transparent pl-[10px] pr-[20px] text-white -ml-[5px]">
            <p className="text-[11px] leading-[1.2]">
              {inplay ? 'In-Play' : dayjs(startTime).format('DD/MM/YYYY HH:mm')}
            </p>
          </div>
        </div>

        <div
          className="
    flex flex-1 flex-nowrap items-center
    whitespace-nowrap overflow-x-auto
    gap-[10px]
    border-0
    [scrollbar-width:none]
    [clip-path:polygon(calc(0%_+_23px)_0%,100%_0,100%_100%,100%_100%,0%_100%)]
    -ml-[15px]
    pl-[5px]
  "
        >
          <li className="flex-1 whitespace-nowrap max-w-[130px] min-w-[130px]">
            <button className="bg-[url('/icons/start-time-bg.svg')] text-white border border-transparent w-full border-none relative [background-size:100%] h-9 px-5">
              <span className="relative z-[2] flex justify-between gap-2.5 items-center top-0">
                <p className="font-semibold leading-[1.2] text-left text-[10px] uppercase overflow-hidden whitespace-normal">
                  Main Market
                </p>
                <img
                  src="/icons/menu.webp"
                  alt=""
                  className="[filter:brightness(0)_saturate(100%)_invert(100%)_sepia(100%)_saturate(1%)_hue-rotate(25deg)_brightness(103%)_contrast(101%)] h-[14px] w-auto max-w-full"
                />
              </span>
            </button>
          </li>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-y-2 min-h-full w-full">
        <div className="flex-1">
          {/* {liveTvUrl && isLiveTvOpen && (
            <div className="w-full overflow-hidden border border-[#d5d5d5] bg-black py-0">
              <div className="relative mx-auto w-1/2">
                <iframe
                  src={liveTvUrl}
                  title="Live TV"
                  className="block h-[270px] w-full"
                  allow="autoplay; fullscreen"
                  sandbox="allow-scripts allow-same-origin allow-popups"
                />

                <button
                  onClick={() => setIsLiveTvOpen(false)}
                  className="absolute right-2 top-2 z-20 flex h-10 w-10 items-center justify-center rounded-lg border border-white/30 bg-black/70 text-white hover:bg-black"
                >
                  ✕
                </button>
              </div>
            </div>
          )} */}

          <div className="w-auto sm:w-fit min-w-[170px] flex items-center justify-between gap-[6px] text-white px-[15px] py-[6px] sm:py-1">
            <button
              type="button"
              onClick={() => setIsFilterModalOpen(true)}
              className="bg-primary-theme h-9 border border-[#304451] text-[11px] font-semibold flex items-center justify-center rounded-[6px] my-[2px] uppercase text-center px-1.5 py-2 sm:p-[10px] w-full"
              aria-label="Open hide show filter"
            >
              <img src="/icons/filter.svg" alt="" className="align-middle max-w-[15px] w-full" />
            </button>
            <button
              type="button"
              onClick={() => setIsOpenBetsVisible(true)}
              className="whitespace-nowrap bg-primary-theme h-9 border border-[#304451] text-[11px] font-semibold flex items-center justify-center rounded-[6px] my-[2px] uppercase text-center px-1.5 py-2 sm:p-[10px] w-full"
            >
              Bets
            </button>
            <button
              type="button"
              onClick={() => setOpenTV((prev) => !prev)}
              className="whitespace-nowrap bg-primary-theme h-9 border border-[#304451] text-[11px] font-semibold flex items-center justify-center gap-1 rounded-[6px] my-[2px] uppercase text-center px-1.5 py-2 sm:p-[10px] w-full text-[#22c55e] animate-pulse"
            >
              <img
                src={openTV ? '/icons/tv-fill.svg' : '/icons/tv.svg'}
                alt=""
                className="![filter:brightness(0)_saturate(100%)_invert(63%)_sepia(85%)_saturate(497%)_hue-rotate(87deg)_brightness(91%)_contrast(87%)] max-w-[15px] shrink-0"
              />
              <span className="leading-none">Live TV</span>
            </button>
            <button
              type="button"
              onClick={() => setOpenScorecard((prev) => !prev)}
              className="whitespace-nowrap bg-primary-theme h-9 border border-[#304451] text-[11px] font-semibold flex items-center justify-center gap-1 rounded-[6px] my-[2px] uppercase text-center px-1.5 py-2 sm:p-[10px] w-full text-[#22c55e] animate-pulse"
            >
              <img
                src="/icons/scorecard.webp"
                alt=""
                className="![filter:brightness(0)_saturate(100%)_invert(63%)_sepia(85%)_saturate(497%)_hue-rotate(87deg)_brightness(91%)_contrast(87%)] max-w-[15px] shrink-0"
              />
              <span className="leading-none">Scorecard</span>
            </button>
          </div>

          <OpenBetsModal
            open={isOpenBetsVisible}
            onClose={() => setIsOpenBetsVisible(false)}
            eventName={eventName ?? ''}
            eventId={eventId}
          />

          {openScorecard && (
            <div
              ref={liveScoreRef}
              className="mb-[6px] w-full overflow-hidden border border-[#2d3f4d] bg-[#1b1b1b]"
            >
              {liveScoreUrl ? (
                <div
                  className="relative w-full overflow-hidden bg-[#1b1b1b] transition-[height] duration-300 ease-in-out"
                  style={{ height: `${iframeHeight}px` }}
                >
                  <iframe
                    src={liveScoreUrl}
                    title="Live Scorecard"
                    className="block h-full w-full"
                    scrolling="no"
                    sandbox="allow-scripts allow-same-origin allow-popups"
                  />
                  <div className="absolute bottom-0 left-0 flex w-full justify-center bg-[#1b1b1b]">
                    <button
                      type="button"
                      onClick={handleSetIframeHeight}
                      className="flex h-5 w-12 items-center justify-center text-[#00cfe8]"
                      aria-label="Toggle scorecard height"
                    >
                      <VscTriangleDown
                        className={cn(
                          'text-lg transition-transform duration-300',
                          iframeHeight > 140 && 'rotate-180'
                        )}
                      />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex min-h-[80px] items-center justify-center text-xs font-semibold text-white">
                  Live score unavailable
                </div>
              )}
            </div>
          )}

          {openTV && (
            <div className="mb-[6px] flex w-full items-center justify-center overflow-hidden border border-[#d5d5d5] bg-black">
              {liveTvUrl ? (
                <iframe
                  src={liveTvUrl}
                  title="Live TV"
                  className="block aspect-video w-full sm:w-1/2"
                  allow="autoplay; fullscreen"
                  sandbox="allow-scripts allow-same-origin allow-popups"
                />
              ) : (
                <div className="flex min-h-[120px] items-center justify-center text-xs font-semibold text-white">
                  Live stream unavailable
                </div>
              )}
            </div>
          )}

          {/* Normal Market */}
          {visibleNormalMarkets?.map((market, idx) => {
            const MarketComponent = isBookmakerMarket(market) ? BookmakerMarket : NormalMarket;

            return (
              <MarketComponent
                isFavorite={isFavorite}
                key={String(market?.marketId ?? market?.marketName ?? idx)}
                data={market}
                min={market?.minBetAmount ?? 0}
                max={market?.maxBetAmount ?? 0}
              />
            );
          })}

          {fancy.length > 0 && (
            <>
              {!marketFilterSettings.hideFancyTabs && (
                <CategoryFilter
                  tabs={fancyTabs}
                  category="FANCY"
                  activeTab={activeFancyTab}
                  setActiveTab={setActiveFancyTab}
                />
              )}

              {pinnedFancyMarkets.length > 0 && (
                <div className="mb-[18px] border-x border-b border-[#b9cbd3] bg-[#eef0f2] pb-px container-fluid">
                  <div className="grid h-10 grid-cols-12 items-end border-b border-[#7e97a7] bg-white">
                    <div className="col-span-7 flex h-full items-center px-[7px] text-[13px] font-bold uppercase text-black">
                      PIN FANCY MARKET
                    </div>
                    <div className="col-span-5 grid h-full grid-cols-2 text-[13px] font-bold text-black">
                      <div className="flex items-center justify-center bg-[#f3a1b5]">No</div>
                      <div className="flex items-center justify-center bg-[#72b9e8]">Yes</div>
                    </div>
                  </div>
                  {pinnedFancyMarkets.map((market) => {
                    const marketKey = getFancyMarketPinKey(market);
                    return (
                      <FancyRow
                        key={`pinned-${marketKey}`}
                        data={market}
                        min={market?.minBetAmount ?? 0}
                        max={market?.maxBetAmount ?? 0}
                        isPinned
                        onTogglePin={() => togglePinnedFancy(market)}
                      />
                    );
                  })}
                </div>
              )}

              {unpinnedFancyMarkets.length > 0 && (
                <div className="mb-4 border-x border-b border-[#b9cbd3] bg-[#eef0f2] pb-px container-fluid">
                  <div className="grid h-11 grid-cols-12 items-end border-b border-[#7e97a7] bg-white">
                    <div className="col-span-7"></div>
                    <div className="col-span-5 grid h-8 grid-cols-2 text-[13px] font-bold text-black">
                      <div className="flex items-center justify-center bg-[#f3a1b5]">No</div>
                      <div className="flex items-center justify-center bg-[#72b9e8]">Yes</div>
                    </div>
                  </div>
                  {unpinnedFancyMarkets?.map((market) => {
                    const marketKey = getFancyMarketPinKey(market);
                    return (
                      <FancyRow
                        key={marketKey}
                        data={market}
                        min={market?.minBetAmount ?? 0}
                        max={market?.maxBetAmount ?? 0}
                        isPinned={false}
                        onTogglePin={() => togglePinnedFancy(market)}
                      />
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {width > 1024 ? (
          <div className="block">{/* <BetSlip liveTvUrl={liveTvUrl} /> */}</div>
        ) : null}
      </div>
      <MarketFilterModal
        open={isFilterModalOpen}
        settings={marketFilterSettings}
        onApply={applyMarketFilters}
        onClear={clearMarketFilters}
        onClose={() => setIsFilterModalOpen(false)}
      />
    </div>
  );
}

export default MarketDetails;
