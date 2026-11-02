import { Market, Runner } from '@/types/market';

const TAB_MATCHERS: Record<string, RegExp> = {
  All: /.*/,
  '1X2': /\b1x2\b/i,
  Match: /(match|result|win|draw)/i,
  Total: /(over|under|total|goals)/i,
  Handicap: /handicap/i,
  'Odd/Even': /(odd|even)/i,
};

// this return the filtered market based on category
export const getFilteredMarkets = (
  marketObject: Record<string, any[]>,
  activeTab: string,
  sportName?: string
) => {
  if (!activeTab || activeTab === 'All') {
    return Object.values(marketObject).flat();
  }

  if (sportName === 'Cricket' || sportName === 'Tennis') {
    return marketObject[activeTab] || [];
  }

  const matcher = TAB_MATCHERS[activeTab];
  if (!matcher) {
    return Object.values(marketObject).flat();
  }
  return Object.entries(marketObject)
    .filter(([marketName]) => matcher.test(marketName))
    .flatMap(([, markets]) => markets);
};

//this is for extracting out the catagories for fancy and premium markets
export const getMarketCategories = (market: any, sportName?: string) => {
  if (sportName === 'Football') {
    return ['All', '1X2', 'Match', 'Total', 'Handicap', 'Odd/Even'];
  }
  // if (sportName === 'Tennis') {
  //   return ["All",];
  // }
  return ['All', ...Object.keys(market)];
};

// this is for maintaing the order of markets ( matchOdds,bookmaker,miniBookmaker,under/over,setwinner )
export const getOrderedMarkets = (markets: Record<string, any[]>, marketTypes: string[]) => {
  const orderedMarkets: any[] = [];

  for (const type of marketTypes) {
    const key = Object.keys(markets).find((k) => k.toLowerCase() === type.toLowerCase());

    if (key && markets[key] && markets[key]?.length > 0) {
      orderedMarkets.push(markets[key][0]);
    }
  }

  const addedKeys = new Set(
    marketTypes.map((t) => Object.keys(markets).find((k) => k.toLowerCase() === t.toLowerCase()))
  );

  const remainingMarkets = Object.entries(markets)
    .filter(([key]) => !addedKeys.has(key))
    .sort(([aKey], [bKey]) => {
      const extractNum = (name: string) => parseFloat(name.match(/[\d.]+/)?.[0] ?? '0');
      return extractNum(aKey) - extractNum(bKey);
    })
    .map(([_, value]) => value[0])
    .filter(Boolean);

  return [...orderedMarkets, ...remainingMarkets];
};

const fillOdds = (odds: any[], required: number) => {
  const filled = [...odds];
  while (filled.length < required) {
    filled.push({ price: 0, size: 0 });
  }
  return filled;
};

const REQUIRED_ODDS: Record<number, string[]> = {
  3: ['match odds', 'tied', 'over/under', 'half time', 'first half', 'completed match'],
  1: ['premium'],
};

// Regex patterns for dynamic matching
const REQUIRED_ODDS_REGEX: Record<number, RegExp[]> = {
  3: [
    /^set\s+\d+\s+winner$/i, // Matches "Set 1 Winner", "Set 2 Winner", etc.
  ],
};

// This is for inserting dummy odds button for the UI consistency
export const getRequiredOddsCount = (marketName?: string): number => {
  if (!marketName) return 1;

  const name = marketName.toLowerCase().trim();

  // First, check static string patterns
  for (const priority in REQUIRED_ODDS) {
    const patterns = REQUIRED_ODDS[priority];

    if (patterns?.some((p) => name.startsWith(p))) {
      return Number(priority);
    }
  }

  // Then, check regex patterns
  for (const priority in REQUIRED_ODDS_REGEX) {
    const regexPatterns = REQUIRED_ODDS_REGEX[priority];

    if (regexPatterns?.some((regex) => regex.test(name))) {
      return Number(priority);
    }
  }

  return 1;
};

export const formatRunners = <T extends Market>(
  marketDetails?: T,
  marketParentCategory?: string,
  isSrl?: boolean
): Runner[] => {
  if (!marketDetails || !marketDetails.runners) return [];
  const runners = Array.isArray(marketDetails.runners)
    ? [...marketDetails.runners]
    : [marketDetails.runners];

  const requiredOdds = getRequiredOddsCount(marketDetails.marketName);

  return runners
    .sort((a, b) => (a.sortPriority ?? 0) - (b.sortPriority ?? 0))
    .map((r) => {
      // const back = [
      //   ...(r?.backPrice3 ? [{ price: r.backPrice3, size: r.backSize3 }] : []),
      //   ...(r?.backPrice2 ? [{ price: r.backPrice2, size: r.backSize2 }] : []),
      //   ...(r?.backPrice1 ? [{ price: r.backPrice1, size: r.backSize1 }] : []),
      // ];

      // const lay = [
      //   ...(r?.layPrice1 ? [{ price: r.layPrice1, size: r.laySize1 }] : []),
      //   ...(r?.layPrice2 ? [{ price: r.layPrice2, size: r.laySize2 }] : []),
      //   ...(r?.layPrice3 ? [{ price: r.layPrice3, size: r.laySize3 }] : []),
      // ];
      let back: any[] = [];
      let lay: any[] = [];

      if (marketParentCategory === 'premium' || isSrl) {
        back = [
          r?.backPrice1 != null
            ? { price: r.backPrice1, size: r.backSize1 }
            : { price: 0, size: 0 },
        ];
      } else if (requiredOdds === 3) {
        back = [
          r?.backPrice3 ? { price: r.backPrice3, size: r.backSize3 } : { price: 0, size: 0 },
          r?.backPrice2 ? { price: r.backPrice2, size: r.backSize2 } : { price: 0, size: 0 },
          r?.backPrice1 ? { price: r.backPrice1, size: r.backSize1 } : { price: 0, size: 0 },
        ];

        lay = [
          r?.layPrice1 ? { price: r.layPrice1, size: r.laySize1 } : { price: 0, size: 0 },
          r?.layPrice2 ? { price: r.layPrice2, size: r.laySize2 } : { price: 0, size: 0 },
          r?.layPrice3 ? { price: r.layPrice3, size: r.laySize3 } : { price: 0, size: 0 },
        ];
      } else if (requiredOdds === 1) {
        back = [
          r?.backPrice1 != null
            ? { price: r.backPrice1, size: r.backSize1 }
            : { price: 0, size: 0 },
        ];

        lay = [
          r?.layPrice1 != null ? { price: r.layPrice1, size: r.laySize1 } : { price: 0, size: 0 },
        ];
      }

      return {
        selectionId: r.selectionId ? r.selectionId : r?.runnerId,
        // runnerId: r?.runnerId,
        sortPriority: r.sortPriority,
        runnerName: r.runnerName,
        status: r.status,
        // back: fillOdds(back, requiredOdds),
        // lay: marketParentCategory !== 'premium' ? fillOdds(lay, requiredOdds) : lay,
        back: back,
        lay: lay,
      };
    });
};
