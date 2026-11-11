import { apiSlice } from './apiSlice';

export interface CatalogueItem {
  id: string;
  externalId: string;
  competitionId: number;
  eventName: string;
  inplay: boolean;
  sport: string;
  startTime: string;
  status: string;
  markets: Record<string, Market[]>;
  fancyMarkets?: any;
  premiumMarket?: any;
  [key: string]: any;
  isFavorite: boolean;
}

export interface Market {
  marketId: string;
  marketName: string;
  eventId: string;
  inplay: boolean;
  marketStartTime: string;
  status: 'Active' | 'Suspended';
  marketType: string;
  runners: Runner[];
  maxBetAmount: number | null;
  minBetAmount: number | null;
  minRate: number | null;
  maxRate: number | null;
}
export interface FancyMarket {
  marketId: string;
  marketName: string;
  [key: string]: any;
}

export interface ExtraMarket {
  marketId: string;
  marketName: string;
  [key: string]: any;
}

interface ApiResponse {
  catalogue: CatalogueItem;
  message: string;
  success: boolean;
}

export interface Runner {
  handicap: number;
  selectionId: string;
  sortPriority: number;
  runnerName: string;
  status: 'Active' | 'Suspended';
  lay: PriceSize[];
  back: PriceSize[];

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
  price: number;
  size: number;
}

export const catalogueApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCatalogueByEventId: builder.query<
      ApiResponse,
      { eventId: number; sport?: string; search?: string; inplay?: string; matchTime?: string }
    >({
      query: ({ eventId, sport, search, inplay, matchTime }) => {
        const params = new URLSearchParams();

        if (sport) params.append('sport', sport);
        if (search) params.append('search', search);
        if (inplay) params.append('inplay', inplay);
        if (matchTime) params.append('matchTime', matchTime);

        const queryString = params.toString();
        return {
          url: `/catalogue/${eventId}${queryString ? `?${queryString}` : ''}`,
          method: 'GET',
        };
      },
      providesTags: ['Sports'],
    }),
  }),
});

export const { useGetCatalogueByEventIdQuery } = catalogueApi;
