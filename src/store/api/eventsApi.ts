import { ApiResponse, EventsQueryParams, GroupedMatches, Match } from '@/types/event';
import { apiSlice } from './apiSlice';
import { groupEvents } from '@/pages/AllSports/helpers/matchTransform';
import { RaceCatalogueResponse } from '@/types/market';

export interface RaceFixtureResponse {
  success: boolean;
  message: string;
  fixture: RaceFixture[];
}

export interface RaceFixture {
  id: string;
  name: string;
  externalId: string;
  sport: string;
  status: string;
  startTime: string;
  inplay: boolean;
  isFancy: boolean;
  isBookmaker: boolean;
  isPremiumFancy: boolean;
  isPopular: boolean;
  competitionId: number;
  providerId: number | null;

  competition: {
    id: number;
    name: string;
    externalId: string;
    startDate: string | null;
  };

  markets: {
    id: string;
    name: string;
    externalId: string;
    startTime: string;
    runner: {
      handicap: number;
      runnerName: string;
      selectionId: string;
      sortPriority: string;
    }[];
  }[];
}

export interface FixtureCountsResponse {
  success: boolean;
  message: string;
  counts: {
    inplay: {
      all: number;
      sports: Record<string, number>;
    };
    today: {
      all: number;
      sports: Record<string, number>;
    };
    upcoming: {
      all: number;
      sports: Record<string, number>;
    };
  };
}


export interface CatalogueResponse {
  success: boolean;
  message: string;
  catalogue: CatalogueEvent[];
}

export interface CatalogueEvent {
  id: string;
  externalId: string;
  eventName: string;
  competitionId: number;
  competitionName: string;
  startTime: string;
  status: string;
  sport: string;
  inplay: boolean;
  markets: Markets;
}

export interface Markets {
  [marketName: string]: Market[];
}

export interface Market {
  marketId: string;
  marketName: string;
  eventId: string;
  inplay: boolean;
  marketStartTime: string;
  status: string;
  marketType: string;
  runners: Runner[];
  maxBetAmount: number | null;
  minBetAmount: number | null;
  minRate: number | null;
  maxRate: number | null;
}

export interface Runner {
  handicap: number;
  selectionId: number;
  sortPriority: number;
  runnerName: string;
  status: string;
  meta: RunnerMeta;
  lay: PriceSize[];
  back: PriceSize[];
  backPrice1: number;
  backPrice2: number;
  backPrice3: number;
  layPrice1: number;
  layPrice2: number;
  layPrice3: number;
  backSize1: number;
  backSize2: number;
  backSize3: number;
  laySize1: number;
  laySize2: number;
  laySize3: number;
}

export interface RunnerMeta {
  runnerId: string;
}

export interface PriceSize {
  price: number;
  size: number;
}

export const eventsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEvents: builder.query<GroupedMatches, EventsQueryParams>({
      query: ({ sportName, competitionId, search, inplay, matchTime, status, sortBy } = {}) => {
        const params = new URLSearchParams();

        if (sportName) params.append('sport', sportName);
        if (competitionId) params.append('competitionId', String(competitionId));
        if (inplay) params.append('inplay', String(inplay));
        if (search) params.append('search', search);
        if (matchTime) params.append('matchTime', matchTime);
        if (status) params.append('status', status);
        if (sortBy) params.append('sortBy', sortBy);

        const queryString = params.toString();
        return {
          url: `/fixture${queryString ? `?${queryString}` : ''}`,
          method: 'GET',
        };
      },
      // transformResponse: (response: ApiResponse): GroupedMatches => {
      //   const { fixture = [] } = response ?? [];
      //   const grouped: GroupedMatches = {
      //     cricket: [],
      //     football: [],
      //     tennis: [],
      //   };

      //   fixture?.forEach((event) => {
      //     const match: Match = {
      //       eventId: Number(event.id),
      //       eventName: event.name,
      //       inplay: event.inplay,
      //       time: event.startTime,
      //       sport: event.sport || '',
      //       tags: [
      //         ...(event.isFancy ? (['fancy'] as const) : []),
      //         ...(event.isBookmaker ? (['bookmaker'] as const) : []),
      //         ...(event.isPremiumFancy ? (['premium'] as const) : []),
      //         ...(event.inplay ? (['streaming'] as const) : []),
      //         ...(event.isMatchOdds ? (['matchOdds'] as const) : []),
      //       ],
      //       runners: (event.runners ?? []).map((runner) => ({
      //         runnerName: runner.runnerName || '',
      //         odds: [
      //           { price: runner.backPrice1, type: 'back' },
      //           { price: runner.layPrice1, type: 'lay' },
      //         ],
      //       })),
      //       odds: [
      //         { price: event.runners?.[0]?.backPrice1, type: 'back' },
      //         { price: event.runners?.[0]?.layPrice1, type: 'lay' },
      //         { price: event.runners?.[2]?.backPrice1, type: 'back' },
      //         { price: event.runners?.[2]?.layPrice1, type: 'lay' },
      //         { price: event.runners?.[1]?.backPrice1, type: 'back' },
      //         { price: event.runners?.[1]?.layPrice1, type: 'lay' },
      //       ],
      //     };

      //     const sport = event.sport?.toLowerCase();

      //     if (sport === 'cricket') grouped.cricket.push(match);
      //     else if (sport === 'soccer') grouped.football.push(match);
      //     else if (sport === 'tennis') grouped.tennis.push(match);
      //   });

      //   return grouped;
      // },
      transformResponse: (response: ApiResponse): GroupedMatches => {
        const fixture = response?.fixture ?? [];
        if (Array.isArray(fixture)) return groupEvents(fixture);

        const flattenedFixtures = Object.values(fixture).flatMap((competitions) =>
          Object.values(competitions ?? {}).flat()
        );
        return groupEvents(flattenedFixtures);
      },
    }),

    getRaces: builder.query<
      RaceFixtureResponse,
      {
        sportName?: string;
        inplay?: boolean;
        seriesId?: string;
        search?: string;
        status?: string;
      }
    >({
      query: ({ inplay, sportName, seriesId, search, status }) => ({
        url: '/fixture/race',
        params: {
          sport: sportName ?? undefined,
          competitionId: seriesId,
          search,
          inplay,
          status,
        },
      }),
      providesTags: ['Sports'],
    }),

    getRaceDetails: builder.query<RaceCatalogueResponse, { eventId: string }>({
      query: ({ eventId }) => {
        let url = `/catalogue/${eventId}?t=${Date.now()}`;
        return url;
      },
      providesTags: ['Sports'],
    }),

    getScorecard: builder.query<
      {
        success: boolean;
        message: string;
        scorecardUrl: string | null;
        liveTvUrl: string | null;
      },
      number
    >({
      query: (eventId: number) => ({
        url: `events/scorecard/${eventId}`,
        method: 'GET',
      }),
    }),
    getFixtureCounts: builder.query<
      FixtureCountsResponse,
      void
    >({
      query: () => ({
        url: `fixture/counts`,
        method: 'GET',
      }),
    }),
    addToMultiMarket: builder.mutation<
      {
        success: boolean,
        message: string,
        data: {
          id: number,
          userId: number,
          eventId: string,
          createdAt: string
        }
      },
      { eventId: number, status: "FAVORITE" | "UNFAVORITE" }
    >({
      query: ({ eventId, status }) => ({
        url: `/fixture/favorite/${eventId}`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: ['Sports'],
    }),
    getMultiMarket: builder.query<
      CatalogueResponse,
      void
    >({
      query: () => ({
        url: `/catalogue/multi/market`,
        method: 'GET',
        params: {
          t: Date.now(),
        },
      }),
      providesTags: ['Sports'],
    }),
  }),
});

export const { useGetEventsQuery, useGetScorecardQuery, useGetRacesQuery, useGetRaceDetailsQuery, useGetFixtureCountsQuery, useAddToMultiMarketMutation, useGetMultiMarketQuery } =
  eventsApi;
