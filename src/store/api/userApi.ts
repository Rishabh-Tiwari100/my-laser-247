import { ContactSupportItem, ContactSupportResponse, UserProfile, Wallet } from '@/types/user';
import { apiSlice } from './apiSlice';

const emptyContactSupport: ContactSupportResponse = {
  whatsapp: null,
  loginWhatsapp: null,
  telegram: null,
  imo: null,
};

const getContactUrl = (item?: ContactSupportItem) => item?.contactUrl || null;

const isContactSupportItem = (value: unknown): value is ContactSupportItem => {
  return Boolean(value && typeof value === 'object' && 'supportType' in value && 'type' in value);
};

const isContactSupportResponse = (value: unknown): value is ContactSupportResponse => {
  return Boolean(
    value &&
    typeof value === 'object' &&
    ('whatsapp' in value || 'telegram' in value || 'imo' in value)
  );
};

const getContactSupportItems = (response: unknown): ContactSupportItem[] | null => {
  if (Array.isArray(response)) {
    return response.filter(isContactSupportItem);
  }

  if (
    response &&
    typeof response === 'object' &&
    'data' in response &&
    Array.isArray(response.data)
  ) {
    return response.data.filter(isContactSupportItem);
  }

  return null;
};

const normalizeContactSupport = (response: unknown): ContactSupportResponse => {
  const contacts = getContactSupportItems(response);

  if (!contacts) {
    const support = isContactSupportResponse(response) ? response : emptyContactSupport;

    return {
      ...emptyContactSupport,
      ...support,
      loginWhatsapp: support.loginWhatsapp ?? support.whatsapp ?? null,
    };
  }

  const activeContacts = contacts.filter(({ isActive }) => isActive);
  const findContact = (type: string, supportType?: string) =>
    activeContacts.find(
      (contact) =>
        contact.type?.toLowerCase() === type.toLowerCase() &&
        (!supportType || contact.supportType === supportType)
    );

  return {
    whatsapp: getContactUrl(findContact('Whatsapp', 'GeneralSupport')),
    loginWhatsapp: getContactUrl(findContact('Whatsapp', 'LoginSupport')),
    telegram: getContactUrl(findContact('Telegram')),
    imo: getContactUrl(findContact('Imo')),
  };
};

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET /users/me
    getUserProfile: builder.query<UserProfile, void>({
      query: () => ({
        url: '/users/me',
        method: 'GET',
        params: { t: Date.now() },
      }),
      providesTags: ['UserDetails'],
    }),

    updateUserInfo: builder.mutation<
      { success: boolean; data: any; message?: string },
      {
        id: string | number;
        firstname: string;
        lastname: string;
        username: string;
        dialCode: string;
        mobile: string;
        country: string | undefined;
        email?: string | null;
        mobileVerificationCode?: string;
      }
    >({
      query: (body) => ({
        url: `users/me`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['UserDetails'],
    }),

    // Get current user's wallets
    getUserWallets: builder.query<Wallet[], void>({
      query: () => ({
        url: `/users/me/wallets`,
        method: 'GET',
        params: { t: Date.now() },
      }),
    }),

    getContactSupport: builder.query<ContactSupportResponse, void>({
      query: () => ({
        url: '/contact-support',
        method: 'GET',
        params: { t: Date.now() },
      }),
      transformResponse: normalizeContactSupport,
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetUserProfileQuery,
  useGetUserWalletsQuery,
  useGetContactSupportQuery,
  useUpdateUserInfoMutation,
} = userApi;
