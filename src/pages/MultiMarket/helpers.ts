export interface MultiMarketEntry {
  marketId?: string;
  marketName?: string;
  runners?: Array<{ runnerName?: string; selectionId?: number | string }>;
  [key: string]: unknown;
}

export interface MultiMarketMap {
  [marketName: string]: MultiMarketEntry[] | undefined;
}

export const getDisplayMarket = (markets?: MultiMarketMap | MultiMarketEntry[]) => {
  if (!markets) return undefined;

  if (Array.isArray(markets)) {
    return markets[0];
  }

  const matchOddsMarket = Object.entries(markets).find(([marketName]) =>
    /match\s*odds|match_odds/i.test(marketName)
  );

  const preferredMarket = matchOddsMarket?.[1]?.[0] ?? Object.values(markets)[0]?.[0];
  return preferredMarket;
};

export const resolveEventId = (
  providedEventId?: string | number | null,
  routeEventId?: string | number | null
) => {
  const resolvedValue = providedEventId ?? routeEventId;
  return resolvedValue ? String(resolvedValue) : undefined;
};
