import apiSlice from './apiSlice';

type SetupMfaResponse = {
    success: boolean;
    message: string;
    qrCode: string;
    secret: string;
};

type ToggleMfaResponse = {
    success: boolean;
    message: string;
};

type ToggleMfaRequest = {
    mobileOrEmail: string;
    otp: string;
    status: 'ACTIVE' | 'INACTIVE';
};

export const mfaApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        setupMfa: builder.mutation<SetupMfaResponse, { mobileOrEmail: string }>({
            query: ({ mobileOrEmail }) => ({
                url: '/mfa/setup',
                method: 'POST',
                body: { mobileOrEmail },
            }),
        }),
        toggleMfa: builder.mutation<ToggleMfaResponse, ToggleMfaRequest>({
            query: ({ mobileOrEmail, otp, status }) => ({
                url: '/mfa/toggle',
                method: 'POST',
                body: { mobileOrEmail, otp, status },
            }),
            invalidatesTags: ['UserDetails'],
        }),
        verifyMfa: builder.mutation<{accessToken:string,type:string}, { mobile: string; otp: string  }>({
            query: ({ mobile, otp }) => ({
                url: '/auth/mfa/verify',
                method: 'POST',
                body: { mobile, token:otp },
            }),
            invalidatesTags: ['UserDetails'],
        }),
    }),
});

export const { useSetupMfaMutation, useToggleMfaMutation, useVerifyMfaMutation } = mfaApi;
