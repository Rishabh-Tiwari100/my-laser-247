import { apiSlice } from './apiSlice';

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    sendOtp: builder.mutation<
      { message: string },
      { mobile: string; type: string; country: string | undefined }
    >({
      query: (body) => ({
        url: '/auth/send-code',
        method: 'POST',
        body,
      }),
    }),

    registerUser: builder.mutation<
      { success: boolean; data: any; message?: string },
      {
        username?: string;
        password: string;
        dialCode: string;
        mobile: string;
        country: string | undefined;
        referralCode?: string;
        mobileVerificationCode?: string;
      }
    >({
      query: (body) => ({
        url: '/auth/register',
        method: 'POST',
        body,
      }),
    }),

    // Login
    login: builder.mutation<
      {
        accessToken?: string;
        user: any;
        passwordChanged: Boolean;
        mfaRequired?: boolean;
        mobile?: string;
      },
      {
        type: 'username_password' | 'mobile_otp' | 'mobile_password';
        mobile?: string;
        username?: string;
        password?: string;
        otp?: string;
        device: string;
      }
    >({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
    }),

    //logout
    logout: builder.mutation<any, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),

    // forgot password
    forgotPassword: builder.mutation<{ success: boolean; message: string }, { mobile: string }>({
      query: (body) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body,
      }),
    }),

    // reset password
    resetPassword: builder.mutation<
      { success: boolean; message: string },
      { code: string; newPassword: string; mobile: string }
    >({
      query: (body) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body,
      }),
    }),

    // change password
    changePassword: builder.mutation({
      query: (body: { oldPassword: string; newPassword: string }) => ({
        url: '/users/me/change-password',
        method: 'POST',
        body,
      }),
    }),

    // new captcha endpoint
    getCaptcha: builder.query<any, void>({
      query: () => ({
        url: '/captcha',
        method: 'POST',
      }),
    }),
    //Demo Login
    demoLogin: builder.mutation<any, void>({
      query: () => ({
        url: '/auth/demo/login',
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useGetCaptchaQuery,
  useLazyGetCaptchaQuery,
  useSendOtpMutation,
  useRegisterUserMutation,
  useLoginMutation,
  useLogoutMutation,

  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useDemoLoginMutation,
} = authApi;
