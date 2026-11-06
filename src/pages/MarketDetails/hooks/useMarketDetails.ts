import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useGetCatalogueByEventIdQuery } from '@/store/api/catalogueApi';
import { useGetScorecardQuery } from '@/store/api/eventsApi';
import {
  formatRunners,
  getMarketCategories,
  getOrderedMarkets,
  getFilteredMarkets,
} from '../helpers';
import { Market, FancyMarketItem } from '@/types/market';

export const marketTypes = ['match odds', 'bookmaker', 'mini bookmaker', 'over/under', 'set'];

export function useMarketDetails(sportName?: string) {
  const { eventId } = useParams();
  const liveScoreRef = useRef(null);

  const [pollingInterval, setPollingInterval] = useState(1000);
  const [activeCatTab, setActiveCatTab] = useState('Fancy');
  const [activeFancyTab, setActiveFancyTab] = useState('All');
  const [activePremiumTab, setActivePremiumTab] = useState('All');
  const [showLiveScore, setShowLiveScore] = useState(true);
  const [iframeHeight, setIframeHeight] = useState(190);
  const { state } = useLocation();
  const [isLiveTvOpen, setIsLiveTvOpen] = useState(true);

  const { data, isLoading: isLoadingEventDetails } = useGetCatalogueByEventIdQuery(
    { eventId: Number(eventId) },
    { pollingInterval }
  );

  // Catalogue fields
  const {
    startTime,
    inplay,
    eventName,
    markets = {},
    fancyMarkets = [],
    premiumMarket = [],
    isFavorite = false,
  } = data?.catalogue ?? {};

  const { data: liveTvAndscore } = useGetScorecardQuery(Number(eventId), {
    skip: !eventId || !inplay,
  });

  const fancyMarketsData: Record<string, any[]> = {
    ...(fancyMarkets.Normal ? { Normal: fancyMarkets.Normal } : {}),
    ...(fancyMarkets.wpmarket ? { wpmarket: fancyMarkets.wpmarket } : {}),
    ...Object.fromEntries(
      Object.entries(fancyMarkets).filter(
        ([key]) => key?.toLowerCase() !== 'normal' && key?.toLowerCase() !== 'wpmarket'
      )
    ),
  };

  // Market ordering
  const allMarkets = getOrderedMarkets(markets, marketTypes);
  const fancyTabs = getMarketCategories(fancyMarketsData);
  const premiumTabs = getMarketCategories(premiumMarket, sportName);

  useEffect(() => {
    setPollingInterval(inplay ? 700 : 1000);
  }, [inplay]);

  const liveScoreUrl = liveTvAndscore?.scorecardUrl;
  const liveTvUrl = liveTvAndscore?.liveTvUrl;
  const categoryTabs = [
    ...(Object.keys(fancyMarkets).length > 0 ? ['Fancy'] : []),
    ...(Object.keys(premiumMarket).length > 0 ? [`Premium ${sportName}`] : []),
  ];

  const handleSetIframeHeight = useCallback(() => {
    // const height=width<
    setIframeHeight((prev) => {
      if (prev === 190) return 400;
      return 190;
    });
  }, []);

  return {
    isLoadingEventDetails,

    liveScoreRef,
    activeCatTab,
    setActiveCatTab,
    activePremiumTab,
    setActivePremiumTab,
    activeFancyTab,
    setActiveFancyTab,

    showLiveScore,
    setShowLiveScore,
    handleSetIframeHeight,

    // data
    iframeHeight,
    liveScoreUrl,
    liveTvUrl,
    categoryTabs,
    startTime,
    eventName,
    fancyMarketsData,
    fancyTabs,
    premiumTabs,
    premiumMarketsData: premiumMarket,
    isLiveTvOpen,
    setIsLiveTvOpen,
    allMarkets,
    inplay,
    isFavorite,
  };
}
