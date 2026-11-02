import { apiSlice } from './apiSlice';
import { BannerResponse } from '@/types/banner';

export interface SinglePromotionBanner {
  id: number;
  name: string;
  heading: string;
  description: string;
  size: string;
  data: null;
  image: string;
  type: string;
  platform: string;
  isPubliced: boolean;
  createdAt: string;
  updatedAt: string;
}

export const bannerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBanners: builder.query<
      BannerResponse,
      { platform?: string; type?: string; page?: number; limit?: number } | void
    >({
      query: ({ platform, type, page, limit } = {}) => {
        const params = new URLSearchParams();

        if (platform) params.append('platform', platform);
        if (type) params.append('type', type);
        if (page) params.append('page', String(page));
        if (limit) params.append('limit', String(limit));

        return {
          url: `/banners${params.toString() ? `?${params.toString()}` : ''}`,
          method: 'GET',
          params: { t: Date.now() },
        };
      },
    }),

    getPromotionById: builder.query<SinglePromotionBanner, { id: number }>({
      query: ({ id }) => ({
        url: `/banners/${id}`,
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetBannersQuery, useGetPromotionByIdQuery } = bannerApi;
