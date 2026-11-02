import apiSlice from './apiSlice';

export interface IExposureSelection {
  selectionId: string;
  exposure: number;
  [key: string]: any;
}

export interface IExposureMarket {
  marketId: number;
  marketExternalId: string;
  selections: IExposureSelection[];
  [key: string]: any;
}

export type ExposureResponse = IExposureMarket[];

export interface IExposureQuery {
  eventId: string | number;
}

export interface ProfitLossItem {
  position: number;
  profit_or_loss: number;
}

export type ProfitLossResponse = ProfitLossItem[];

export interface ProfitLossQuery {
  eventId: number;
  selectionId: string;
  marketId: string;
}

export const exposureApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBooksetCalc: builder.query<ExposureResponse, IExposureQuery>({
      query: (params) => ({
        url: '/exposure/bookset/calculation',
        method: 'GET',
        params: { ...params, t: Date.now() },
      }),
      providesTags: ['Bookset'],
    }),

    getFancyProfitLoss: builder.query<ProfitLossResponse, ProfitLossQuery>({
      query: (params) => ({
        url: '/exposure/profit-loss',
        method: 'GET',
        params: { ...params, t: Date.now() },
      }),
    }),
  }),
});

export const { useGetBooksetCalcQuery, useGetFancyProfitLossQuery } = exposureApi;
