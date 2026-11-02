import apiSlice from './apiSlice';

export const uploadApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadFile: builder.mutation<{ url: string; meta: any }, File>({
      query: (file) => {
        const formData = new FormData();
        formData.append('file', file);

        return {
          url: '/upload',
          method: 'POST',
          body: formData,
        };
      },
    }),
  }),
});

export const { useUploadFileMutation } = uploadApi;
