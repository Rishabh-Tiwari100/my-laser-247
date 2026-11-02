import { apiSlice } from './apiSlice';
import {
  AddBankAccountRequest,
  AddBankAccountResponse,
  AddCryptoWalletRequest,
  AddUPIAccountRequest,
  AddUPIAccountResponse,
  ActivePaymentGatewaysResponse,
  BankAccountsResponse,
  CryptoNetwork,
  CryptoWallet,
  CreateDepositWithdrawResponse,
  CreateUpiTransactionResponse,
  DeleteAccountResponse,
  DepositAccountResponse,
  DepositWithdrawQueryParams,
  DepositWithdrawRequest,
  DepositWithdrawResponse,
  PaymentGatewayRedirectRequest,
  PaymentGatewayRedirectResponse,
  PaymentGatewayRequestType,
  PaymentGatewayTransactionsQueryParams,
  PaymentGatewayTransactionsResponse,
  UpiAccountResponse,
  UploadFile,
} from '@/types/account';

export interface DepositWithdrawRequestResponse {
  success: boolean;
  message: string;
  request: {
    id: string;
    userId: string;
    type: string;
    amount: string;
    status: string;
    image: string | null;
    transactionCode: string | null;
    transactionHash: string | null;
    upiId: string | null;
    bankId: string | null;
    cryptoId: string | null;
    conversionRate: string | null;
    remark: string | null;
    statusUpdatedAt: string | null;
    bankerId: string | null;
    createdAt: string;
    updatedAt: string;
    digitalPaymentId: string | null;
  };
}

export const accountApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addBankAccount: builder.mutation<AddBankAccountResponse, AddBankAccountRequest>({
      query: (body) => ({
        url: '/bank',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Account'],
    }),
    addUpiAccount: builder.mutation<AddUPIAccountResponse, AddUPIAccountRequest>({
      query: (body) => ({
        url: '/upi',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Account'],
    }),
    addCryptoWallet: builder.mutation<AddBankAccountResponse, AddCryptoWalletRequest>({
      query: (body) => ({
        url: '/crypto',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Account'],
    }),
    getCryptoNetworks: builder.query<CryptoNetwork[], void>({
      query: () => ({
        url: '/crypto/networks',
        method: 'GET',
      }),
      transformResponse: (response: CryptoNetwork[] | { data?: CryptoNetwork[] }) =>
        Array.isArray(response) ? response : (response.data ?? []),
    }),
    getCryptoWallets: builder.query<CryptoWallet[], void>({
      query: () => ({
        url: '/crypto',
        method: 'GET',
      }),
      transformResponse: (response: CryptoWallet[] | { wallets?: CryptoWallet[] }) =>
        Array.isArray(response) ? response : (response.wallets ?? []),
      providesTags: ['Account'],
    }),
    depositWithdrawRequest: builder.mutation<
      CreateDepositWithdrawResponse | CreateUpiTransactionResponse,
      DepositWithdrawRequest
    >({
      query: ({ method, ...body }) => ({
        url: `/${method}/deposit-withdraw-request`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Account', 'User'],
    }),
    deleteAccount: builder.mutation<DeleteAccountResponse, { id: string; type: 'upi' | 'bank' }>({
      query: ({ id, type }) => ({
        url: `/${type}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Account'],
    }),
    getBankAccount: builder.query<BankAccountsResponse, void>({
      query: () => ({
        url: '/bank',
        method: 'GET',
      }),
      providesTags: ['Account'],
    }),
    getUpiAccount: builder.query<UpiAccountResponse, void>({
      query: () => ({
        url: '/upi',
        method: 'GET',
      }),
      providesTags: ['Account'],
    }),
    getDepositWithdraw: builder.query<DepositWithdrawResponse, DepositWithdrawQueryParams>({
      query: (params) => ({
        url: '/banker/my-deposit-withdraw',
        method: 'GET',
        params,
      }),
      providesTags: ['Account'],
    }),
    uploadFile: builder.mutation<UploadFile, File>({
      query: (file) => {
        const formData = new FormData();
        formData.append('file', file);

        return {
          url: '/upload',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['Account'],
    }),
    getDepositAccounts: builder.query<DepositAccountResponse, void>({
      query: () => ({
        url: `/banker/show-account`,
        method: 'GET',
      }),
      providesTags: ['Account'],
    }),
    getActivePaymentGateways: builder.query<
      ActivePaymentGatewaysResponse,
      { type: PaymentGatewayRequestType }
    >({
      query: ({ type }) => ({
        url: '/payment-gateway/active',
        method: 'GET',
        params: { type },
      }),
      providesTags: ['Account'],
    }),
    createPaymentGatewayRedirect: builder.mutation<
      PaymentGatewayRedirectResponse,
      PaymentGatewayRedirectRequest
    >({
      query: ({ type, amount, gatewayId, code }) => {
        if (type === 'deposit') {
          return {
            url: '/payment-gateway/deposit',
            method: 'POST',
            body: { code, amount },
          };
        }

        return {
          url: '/payment-gateway/redirect',
          method: 'POST',
          body: { type, amount, gatewayId, code },
        };
      },
    }),
    getPaymentGatewayTransactions: builder.query<
      PaymentGatewayTransactionsResponse,
      PaymentGatewayTransactionsQueryParams
    >({
      query: (params) => ({
        url: '/payment-gateway/transactions',
        method: 'GET',
        params,
      }),
      providesTags: ['Account'],
    }),
    setWithdrawPassword: builder.mutation<any, { newPassword: string; confirmPassword: string }>({
      query: (body) => ({
        url: '/banker/set-withdraw-password',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Account', 'UserDetails'],
    }),
    resetWithdrawPassword: builder.mutation<
      any,
      { newPassword: string; confirmPassword: string; otp: string }
    >({
      query: (body) => ({
        url: '/banker/reset-withdraw-password',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Account'],
    }),
    getDepositWithdrawRequest: builder.query<DepositWithdrawRequestResponse, { id: string }>({
      query: ({ id }) => ({
        url: `/banker/deposit-withdraw/${id}`,
        method: 'GET',
      }),
      providesTags: ['Account'],
    }),
    cancelRequest: builder.mutation<{ success: boolean; message: string }, { id: string }>({
      query: ({ id }) => ({
        url: `/banker/cancel/${id}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Account', 'UserDetails'],
    }),
  }),
});

export const {
  useAddBankAccountMutation,
  useAddCryptoWalletMutation,
  useAddUpiAccountMutation,
  useGetCryptoNetworksQuery,
  useGetCryptoWalletsQuery,
  useGetBankAccountQuery,
  useDeleteAccountMutation,
  useDepositWithdrawRequestMutation,
  useGetDepositWithdrawQuery,
  useUploadFileMutation,
  useGetUpiAccountQuery,
  useGetDepositAccountsQuery,
  useLazyGetDepositAccountsQuery,
  useGetActivePaymentGatewaysQuery,
  useCreatePaymentGatewayRedirectMutation,
  useGetPaymentGatewayTransactionsQuery,
  useSetWithdrawPasswordMutation,
  useResetWithdrawPasswordMutation,
  useGetDepositWithdrawRequestQuery,
  useCancelRequestMutation,
} = accountApi;
