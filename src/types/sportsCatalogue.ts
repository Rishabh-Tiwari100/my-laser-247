// Fancy and Premium catalogue contracts shared with the Velki API.
export interface PriceSize {
  price: number;
  size: number;
}

export interface FancyRunner {
  selectionId: string;
  runnerName: string;
  status: string;
  lay?: PriceSize[];
  back?: PriceSize[];
  backPrice1?: number;
  layPrice1?: number;
  backSize1?: number;
  laySize1?: number;
}

export interface FancyMarketItem {
  marketId: string;
  marketName: string;
  marketCategory: string;
  gameType: string;
  gameStatus: string;
  ballSession: string;
  sortPriority: number;
  minBetAmount: number | null;
  maxBetAmount: number | null;
  remark?: string;
  runners: FancyRunner;
}

export interface PremiumRunner {
  runnerId: string;
  runnerName: string;
  status: string;
  selectionId: string;
  backPrices?: PriceSize[];
  lay?: PriceSize[];
  back?: PriceSize[];
  backPrice1?: number;
  backSize1?: number;
  layPrice1?: number;
  laySize1?: number;
}

export interface PremiumMarket {
  marketId: string;
  marketName: string;
  category: string;
  marketCategory?: string;
  marketType: string;
  status: string;
  runners: PremiumRunner[];
  maxBetAmount?: number | string | null;
  minBetAmount?: number | string | null;
  minRate?: number | string | null;
  maxRate?: number | string | null;
}

export interface BettingConfig {
  minBetAmount: string | null;
  maxBetAmount: string | null;
  sessionMinBetAmount: string | null;
  sessionMaxBetAmount: string | null;
  minRate: string | null;
  maxRate: string | null;
  sessionMinRate: string | null;
  sessionMaxRate: string | null;
}
