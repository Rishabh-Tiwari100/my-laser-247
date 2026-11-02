// import { CasinoGame, FavoriteGame, RecentGame, Pagination } from "@/types/casino.types";

import apiSlice from './apiSlice';

// Dynamic object support
export type DynamicObject = {
  [key: string]: any;
};

// Casino item (Trending / All Games)
export interface CasinoGame extends DynamicObject {
  id: number;
  casinoProviderId?: number;
  externalId?: string;
  name?: string;
  code?: string;
  gameProviderName?: string;
  category?: string;
  gameImage?: string;
  isTrending?: boolean;
  priority?: number;
  status?: string;
  createdAt?: string;
}

// Recent played game
export interface RecentGame extends DynamicObject {
  id?: number;
  userId?: number;
  gameId?: number;
  playedAt?: string;
  game?: CasinoGame;
}

// Favorite item
export interface FavoriteGame extends DynamicObject {
  id?: number;
  userId?: number;
  gameId?: number;
  createdAt?: string;
  game?: CasinoGame;
}

// Pagination model
export interface Pagination extends DynamicObject {
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  limit?: number;
}

export interface MostPlayedGame {
  id: number;
  externalId: string;
  name: string;
  code: string;
  providername: string;
  category: string;
  gameimage: string;
  status: string;
}

export interface MostPlayedGamesResponse {
  success: boolean;
  message: string;
  games: MostPlayedGame[];
}

export interface StaticCasinoGame {
  id: number;
  name: string;
}

export interface StaticCasinoGameCategory {
  title: string;
  games: StaticCasinoGame[];
}

export interface StaticCasinoGamesResponse {
  success: boolean;
  message: string;
  games: StaticCasinoGameCategory[];
}

export const casinoApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET TRENDING GAMES
    getTrendingGames: builder.query<
      { success?: boolean; message?: string; casinos?: CasinoGame[] },
      { status?: string }
    >({
      query: ({ status = 'ACTIVE' }) => ({
        url: `/casino/trending?status=${status}`,
        method: 'GET',
        params: { t: Date.now() },
      }),
    }),

    // GET RECENT PLAYED GAMES
    getRecentGames: builder.query<
      { success?: boolean; message?: string; games?: RecentGame[] },
      { limit?: number }
    >({
      query: ({ limit }) => ({
        url: `/casino/recent${limit ? `?limit=${limit}` : ''}`,
        method: 'GET',
        params: { t: Date.now() },
      }),
    }),

    // ADD TO FAVORITE
    addToFavorite: builder.mutation<
      { message?: string; data?: FavoriteGame },
      { id: number; status?: string }
    >({
      query: ({ id, status = 'FAVORITE' }) => ({
        url: `/casino/favorite/${id}`,
        method: 'PUT',
        body: { status },
        params: { t: Date.now() },
      }),
      invalidatesTags: ['Casino']
    }),

    // GET FAVORITE LIST
    getFavoriteGames: builder.query<
      { message?: string; games?: FavoriteGame[]; pagination?: Pagination },
      { page?: number; limit?: number }
    >({
      query: ({ page, limit }) => {
        let queryString = '';

        if (page) queryString += `page=${page}`;
        if (limit) queryString += `${queryString ? '&' : ''}limit=${limit}`;

        return {
          url: `/casino/favorite${queryString ? `?${queryString}` : ''}`,
          method: 'GET',
          params: { t: Date.now() },
        };
      },
      providesTags: ['Casino']
    }),

    getMostPlayedGames: builder.query<MostPlayedGamesResponse, void>({
      query: () => ({
        url: '/casino/most-played',
        method: 'GET',
        params: { t: Date.now() },
      }),
    }),

    getCasinoStaticGames: builder.query<StaticCasinoGamesResponse, void>({
      query: () => ({
        url: '/casino/static/games',
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useGetCasinoStaticGamesQuery,
  useGetTrendingGamesQuery,
  useGetRecentGamesQuery,
  useAddToFavoriteMutation,
  useGetFavoriteGamesQuery,
  useGetMostPlayedGamesQuery,
} = casinoApi;
