import { apiSlice } from './apiSlice';
import { ApiResponse, User } from '@/types';

interface Competition {
  id: number;
  externalId: string;
  name: string;
  sport: string;
  startDate: string | null;
  endDate: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CompetitionsResponse {
  success: boolean;
  message: string;
  competitions: Competition[];
}

export const sidebarApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCompetitionById: builder.query<CompetitionsResponse, string>({
      query: (sportName) => ({
        url: `/competitions?sport=${sportName}`,
        method: 'GET',
        params: { t: Date.now() },
      }),
      providesTags: ['Competitions'],
    }),
  }),
});

export const { useGetCompetitionByIdQuery } = sidebarApi;
