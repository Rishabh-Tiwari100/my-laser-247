import { apiSlice } from './apiSlice';

export interface CmsContent {
  id: string;
  platformId: number;
  name: string;
  page: string;
  content: string;
  type: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CmsResponse {
  success: boolean;
  message: string;
  data: CmsContent[];
}

interface GetCmsContentParams {
  page?: string;
  type?: string;
}

export const cmsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCmsContent: builder.query<CmsResponse, GetCmsContentParams>({
      query: ({ page, type }) => ({
        url: '/cms',
        params: {
          ...(page ? { page } : {}),
          ...(type ? { type } : {}),
        },
      }),
    }),
  }),
});

export const { useGetCmsContentQuery } = cmsApi;
