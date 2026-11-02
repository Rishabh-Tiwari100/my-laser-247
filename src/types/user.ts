export interface UserRole {
  id: number;
  name: string;
}

export interface UserProfile {
  id: string;
  firstname: string;
  lastname: string;
  username: string;
  email: string | null;
  dialCode: string;
  mobile: string;
  profileImage: string | null;
  isVerified: boolean;
  country: string;
  status: 'Active' | 'Inactive' | 'Blocked';
  partnership: number;
  commision: number;
  isSelfRegistered: boolean;
  isPartnershipEnabled: boolean;
  passwordChanged: boolean;
  transactionCodeViewed: boolean;
  roleId: number;
  referralCode: string;
  isBetLocked: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  userBonus: any[];
  role: UserRole;
  isAffiliateUser: boolean;
  isWithdrawPasswordSet: boolean;
  isMfaEnabled?: boolean;
}

export interface Wallet {
  id?: string | null;
  userId?: string | null;
  type?: string | null;
  amount?: string | null;
  nonWithdrawableAmount?: string | null;
  lockedAmount?: string | null;
  exposureAmount?: string | null;
  creditAmount?: string | null;
  version?: number | null;
  currencyId?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  withdrawableBalance?: number | null;
  depositBalance?: number | null;
}

export type ContactSupportType = 'LoginSupport' | 'GeneralSupport';

export interface ContactSupportItem {
  id: number;
  platformId: number;
  label: string;
  type: string;
  supportType: ContactSupportType | string;
  number: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  contactUrl: string | null;
}

export interface ContactSupportResponse {
  whatsapp: string | null;
  loginWhatsapp: string | null;
  telegram: string | null;
  imo: string | null;
}
