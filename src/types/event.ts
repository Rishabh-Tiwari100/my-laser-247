export interface Competition {
  id?: number;
  name?: string;
  externalId?: string;
  startDate?: string | null;
}

export interface Runner {
  handicap?: number;
  runnerName?: string;
  selectionId?: string;
  sortPriority?: number;
  status?: string;
  back?: PriceSize[];
  lay?: PriceSize[];
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

export interface PriceSize {
  price?: number;
  size?: number;
}

export interface EventItem {
  id: number;
  competitionId: number;
  providerId: number | null;
  externalId: string;
  name: string;
  sport: string;
  startTime: string;
  status: string;
  isFancy: boolean;
  isBookmaker: boolean;
  isPopular: boolean;
  isPremiumFancy: boolean;
  isMatchOdds: boolean;
  inplay: boolean;
  createdAt: string;
  updatedAt: string;
  competition: Competition;
  runners: Runner[];
  isFavourite?: boolean;
}

export interface EventsQueryParams {
  sportName?: string;
  competitionId?: number;
  inplay?: boolean;
  search?: string;
  matchTime?: string;
  status?: string;
  sortBy?: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  fixture: EventItem[] | Record<string, Record<string, EventItem[]>>;
}

export type GroupedMatches = {
  cricket: Match[];
  football: Match[];
  tennis: Match[];
};

export type MatchTag =
  | 'isLive'
  | 'streaming'
  | 'fancy'
  | 'bookmaker'
  | 'premium'
  | 'matchOdds'
  | 'eCricket'
  | 'eFootball'
  | 'eTennis';

export type Match = {
  eventId: number;
  eventName: string;
  inplay: boolean;
  tags: MatchTag[];
  externalId: string;
  time: Date | string;
  sport: string;
  status: string;
  odds: { price?: number | string | null | undefined; type: 'back' | 'lay' }[];
  runners: {
    runnerName: string;
    status?: string;
    odds: { price?: number | string | null | undefined; type: 'back' | 'lay' }[];
  }[];
  competitionName?: string;
  competitionId?: number | undefined;
  isFavourite: boolean;
};
