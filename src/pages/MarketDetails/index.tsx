import Marquee from '@/components/common/Marquee';
import EventDetailsHeader from './components/EventDetailsHeader';
import FancyMarketHeader from './components/FancyMarketHeader';
import MarketPanel from '@/pages/MarketDetails/components/MarketPanel';
import { getFilteredMarkets } from './helpers';
import { useParams } from 'react-router-dom';
import { cn } from '@/utils';
import { useMarketDetails } from './hooks/useMarketDetails';
import { Loader2 } from 'lucide-react';
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
import MarketInfoButton from './components/MarketInfoButton';

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
  const [openScorecard, setOpenScorecard] = useState(true);

  const sport = sportName.charAt(0).toUpperCase() + sportName.slice(1);
  const {
    isLoadingEventDetails,

    liveScoreRef,
    activeCatTab,
    setActiveCatTab,
    activePremiumTab,
    setActivePremiumTab,
    activeFancyTab,
    setActiveFancyTab,
    handleSetIframeHeight,

    iframeHeight,
    liveScoreUrl,
    liveTvUrl,
    startTime,
    eventName,

    fancyMarketsData,
    fancyTabs,
    premiumTabs,
    premiumMarketsData,
    allMarkets,
    inplay,
    isFavorite,
  } = useMarketDetails(sport);

  useEffect(() => {
    if (fancyTabs.length <= 1 && premiumTabs.length > 1) setActiveCatTab('Premium');
  }, [fancyTabs.length, premiumTabs.length, setActiveCatTab]);

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
          <div className="inline-flex items-center gap-x-1 text-[#213b49]">
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
        'mt-[3px] flex flex-col gap-[3px] font-helvetica text-black',
        marketFilterSettings.showFullScreen &&
          'fixed inset-0 z-[5000000000000001] m-0 overflow-auto bg-white p-[7px]'
      )}
    >
      <Marquee tagName="News" />
      <EventDetailsHeader
        eventName={eventName}
        startTime={startTime}
        inplay={inplay}
        scorecardOpen={openScorecard}
        onToggleScorecard={() => setOpenScorecard((value) => !value)}
        onOpenBets={() => setIsOpenBetsVisible(true)}
      />
      <div className="flex min-h-full w-full flex-col gap-y-[3px] lg:flex-row">
        <div className="min-w-0 flex-1">
          <OpenBetsModal
            open={isOpenBetsVisible}
            onClose={() => setIsOpenBetsVisible(false)}
            eventName={eventName ?? ''}
            eventId={eventId}
          />

          {openScorecard && liveScoreUrl && (
            <div
              id="event-scorecard"
              ref={liveScoreRef}
              className="mb-[3px] w-full overflow-hidden border border-[#bfc9cf] bg-[#a3a3a3]"
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
                  <div className="absolute bottom-0 left-0 hidden w-full justify-center bg-[#1b1b1b] lg:flex">
                    <button
                      type="button"
                      onClick={handleSetIframeHeight}
                      className="flex h-5 w-12 items-center justify-center text-[#00cfe8]"
                      aria-label="Toggle scorecard height"
                    >
                      <VscTriangleDown
                        className={cn(
                          'text-lg transition-transform duration-300',
                          iframeHeight > 190 && 'rotate-180'
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
          {!allMarkets?.length && fancyTabs.length <= 1 && premiumTabs.length <= 1 && (
            <p
              role="status"
              className="border border-[#bfc9cf] bg-white px-[12px] py-[24px] text-center text-[13px] text-[#526575]"
            >
              No markets are currently available for this event.
            </p>
          )}
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

          {(fancyTabs.length > 1 || premiumTabs.length > 1) && (
            <>
              <div
                className={cn(
                  'grid border-x border-[#7e97a7] font-[family-name:system-ui] text-[12px] font-bold tracking-[1px] text-white',
                  fancyTabs.length > 1 && premiumTabs.length > 1
                    ? 'grid-cols-2 lg:grid-cols-1'
                    : 'grid-cols-1'
                )}
              >
                {fancyTabs.length > 1 && (
                  <div
                    className={cn(
                      'flex h-[30px] items-center',
                      activeCatTab === 'Fancy'
                        ? 'bg-gradient-to-b from-[#0a92a5] from-[15%] to-[#076875]'
                        : 'bg-[#243a48]'
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveCatTab('Fancy')}
                      aria-pressed={activeCatTab === 'Fancy'}
                      className="h-full min-w-0 flex-1 px-[10px] text-left"
                    >
                      Fancy Bet
                    </button>
                    <MarketInfoButton
                      marketName="Fancy"
                      marketType="FANCY"
                      className="ml-0 h-[30px] w-[35px] bg-white/5"
                    />
                  </div>
                )}
                {premiumTabs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setActiveCatTab('Premium')}
                    aria-pressed={activeCatTab === 'Premium'}
                    className={cn(
                      'flex h-[30px] items-center gap-[8px] px-[10px] text-left',
                      activeCatTab === 'Premium'
                        ? 'bg-gradient-to-b from-[#0a92a5] from-[15%] to-[#076875]'
                        : 'bg-[#243a48]'
                    )}
                  >
                    Premium <span className="bg-[#126778] px-[4px] text-[9px]">NEW</span>
                  </button>
                )}
              </div>
              {activeCatTab === 'Fancy' && !marketFilterSettings.hideFancyTabs && (
                <CategoryFilter
                  tabs={fancyTabs}
                  category="FANCY"
                  activeTab={activeFancyTab}
                  setActiveTab={setActiveFancyTab}
                />
              )}

              {activeCatTab === 'Fancy' && pinnedFancyMarkets.length > 0 && (
                <div className="mb-[3px] border-x border-b border-[#b9cbd3] bg-white pb-px">
                  <FancyMarketHeader title="PIN FANCY MARKET" />
                  {pinnedFancyMarkets.map((market) => (
                    <FancyRow
                      key={`pinned-${getFancyMarketPinKey(market)}`}
                      data={market}
                      min={market?.minBetAmount ?? 0}
                      max={market?.maxBetAmount ?? 0}
                      isPinned
                      onTogglePin={() => togglePinnedFancy(market)}
                    />
                  ))}
                </div>
              )}
              {activeCatTab === 'Fancy' && unpinnedFancyMarkets.length > 0 && (
                <div className="mb-[3px] border-x border-b border-[#b9cbd3] bg-white pb-px">
                  <FancyMarketHeader />
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
              {activeCatTab === 'Premium' && (
                <>
                  <CategoryFilter
                    tabs={premiumTabs}
                    category="PREMIUM"
                    activeTab={activePremiumTab}
                    setActiveTab={setActivePremiumTab}
                  />
                  {getFilteredMarkets(premiumMarketsData, activePremiumTab, sport).map(
                    (market, index) => (
                      <MarketPanel
                        key={market.marketId ?? index}
                        eventName={market.marketName}
                        marketName={market.marketName}
                        marketData={market}
                        runnersData={market.runners ?? []}
                        marketCategory="PREMIUM"
                        min={market.minBetAmount}
                        max={market.maxBetAmount}
                      />
                    )
                  )}
                </>
              )}
            </>
          )}
        </div>
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
