import { WalletPagination } from './myWallet';

export interface UserBonusSummary {
  totalReferralUsers: number;
  lifetimeEarnings: string;
  thisMonthEarnings: string;
}

export type UserStatus = 'Active' | 'Inactive';

export interface ReferredUser {
  serialNo: number;
  refereeId: string;
  userName: string;
  joinDate: string;
  firstDeposit: number;
  bonusEarnings: string;
  lossCommission: string;
  status: UserStatus;
}

export interface ReferredUsersResponse {
  pagination: WalletPagination;
  data: ReferredUser[];
}

export interface ReferredUsersQuery {
  page?: number;
  limit?: number;
  status?: UserStatus;
  fromDate?: string;
  toDate?: string;
}

export interface ReferralTotals {
  referralDepositBonus: string;
  referralLossCommissionBonus: string;
  totalBonus: string;
}
