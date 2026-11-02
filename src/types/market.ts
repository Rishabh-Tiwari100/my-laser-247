export interface Market {
  eventId?: string;
  inplay?: boolean;
  marketId?: string;
  marketName?: string;
  marketType?: string;
  marketStartTime?: string;
  status?: string;
  runners?: Runner[];
  maxBetAmount?: string | number;
  minBetAmount?: string | number;
  sessionMaxBetAmount?: string | number;
  sessionMinBetAmount?: string | number;
  [key: string]: any;

  gameType?: string;
}

// Each odds entry (for back or lay)
export interface Odds {
  price?: number;
  size?: number;
  [key: string]: any;
}

// Each runner inside a market
export interface Runner {
  selectionId?: string | number;
  runnerId?: string | number;
  sortPriority?: number;
  runnerName?: string;
  status?: string;

  // optional fields from API
  backPrice1?: number;
  backPrice2?: number;
  backPrice3?: number;
  backSize1?: number;
  backSize2?: number;
  backSize3?: number;
  layPrice1?: number;
  layPrice2?: number;
  layPrice3?: number;
  laySize1?: number;
  laySize2?: number;
  laySize3?: number;

  // odds: Odds[];
  back: Odds[];
  lay: Odds[];

  meta?: RunnerMeta;
}

export interface FancyMarketItem {
  marketId: string;
  marketName: string;
  gameType: string;
  sortPriority: number;
  runners: Runner[];
  [key: string]: any;
}

export interface RaceCatalogueResponse {
  success: boolean;
  message: string;
  catalogue: RaceCatalogue;
  betConfig: {
    minBetAmount: string;
    maxBetAmount: string;
    sessionMinBetAmount: string;
    sessionMaxBetAmount: string;
    minRate: string;
    maxRate: string;
    sessionMinRate: string;
    sessionMaxRate: string;
  };
}

export interface RaceCatalogue {
  id: string;
  externalId: string;
  eventName: string;
  competitionId: number;
  startTime: string;
  status: string;
  sport: string;
  inplay: boolean;

  markets: {
    [marketName: string]: RaceMarketData[];
  };

  premiumMarket: Record<string, unknown>;
  fancyMarkets: Record<string, unknown>;
}

export interface RaceMarketData {
  marketId?: string;
  marketName?: string;
  eventId?: string;
  inplay?: boolean;
  marketStartTime?: string;
  status?: string;
  marketType?: string;
  maxBetAmount?: number | null;
  minBetAmount?: number | null;
  minRate?: number | null;
  maxRate?: number | null;

  runners?: RaceRunner[];
}

export interface RaceRunner {
  handicap: number;
  selectionId: string;
  sortPriority: string;
  runnerName: string;
  status: string;
  meta: RunnerMeta;
  lay: { price: number; size: number }[];
  back: { price: number; size: number }[];

  backPrice1?: number;
  backPrice2?: number;
  backPrice3?: number;
  layPrice1?: number;
  layPrice2?: number;
  layPrice3?: number;
  backSize1?: number;
  backSize2?: number;
  backSize3?: number;
  laySize1?: number;
  laySize2?: number;
  laySize3?: number;
}

export interface RunnerMeta {
  AGE: string;
  BRED: string;
  FORM: string;
  WEARING: string | null;

  DAM_BRED: string;
  DAM_NAME: string;
  DAM_YEAR_BORN: string | null;

  SIRE_BRED: string;
  SIRE_NAME: string;
  SIRE_YEAR_BORN: string | null;

  DAMSIRE_BRED: string;
  DAMSIRE_NAME: string;
  DAMSIRE_YEAR_BORN: string | null;

  SEX_TYPE: string;
  COLOUR_TYPE: string;

  runnerId: string;

  OWNER_NAME: string | null;
  TRAINER_NAME: string;
  JOCKEY_NAME: string;
  JOCKEY_CLAIM: string | null;

  STALL_DRAW: string;
  CLOTH_NUMBER: string;
  CLOTH_NUMBER_ALPHA: string;

  WEIGHT_VALUE: string | null;
  WEIGHT_UNITS: string | null;

  ADJUSTED_RATING: string | null;
  OFFICIAL_RATING: string | null;

  DAYS_SINCE_LAST_RUN: string;

  FORECASTPRICE_NUMERATOR: string | null;
  FORECASTPRICE_DENOMINATOR: string | null;

  RACECOLOR_PATH: string;
  COLOURS_FILENAME: string;
  COLOURS_DESCRIPTION: string;
}
