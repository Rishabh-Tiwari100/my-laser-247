// export enum BonusTurnoverStatus {
//   ACTIVE = 'ACTIVE',
//   COMPLETED = 'COMPLETED',
// }
export type BonusTurnoverStatus = 'ACTIVE' | 'COMPLETED';

export type BonusCategory =
  | 'JoiningBonus'
  | 'ReferralBonus'
  | 'DepositBonus'
  | 'RefillBonus' // 👈 Add this
  | 'ReferralLossBonus'
  | 'LossbackBonus'
  | 'LossBackBonus'
  | 'ReferralLossCommissionBonus';
export interface Pagination {
  totalItems: number;
  currentPage: number;
  limit: number;
  totalPage: number;
}

export interface PaginatedResponse<T> {
  pagination?: Pagination;
  data: T[];
}

export interface BonusTotalSummaryResponse {
  totalJoiningBonus: string;
  totalReferralBonus: string;
  totalReferralLossCommissionBonus: string;
  totalLossBackBonus: string;
  totalRefillBonus: string;
}

export interface BonusTurnoverItem {
  bonusId: number;
  category: BonusCategory;
  name: string;
  status: BonusTurnoverStatus;
  releaseCondition: string;
  isInstantWithdrawable: boolean;
  depositAmount: string;
  bonusAmount: string;
  turnoverRequired: string;
  turnoverCompleted: string;
  turnoverRemaining: string;
  turnoverPercentage: number;
  withdrawableAmount: string;
}

export interface BonusTurnoverQuery {
  status: BonusTurnoverStatus;
  page?: number;
  limit?: number;
}

export interface BonusStatementItem {
  serialNo: number;
  bonusType: BonusCategory;
  awardDate: string;
  originalBalance: string;
  reason: string;
  withdrawalRule: string;
  turnoverRequired: string;
  turnoverCompleted: string;
  turnoverRemaining: string;
  status: string;
}

export interface BonusStatementQuery {
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
}

export interface BonusEarningsResponse {
  lifetime: string;
  thisMonth: string;
  previousMonth: string;
}
export type BonusType =
  | 'JoiningBonus'
  | 'ReferralBonus'
  | 'ReferralLossCommissionBonus'
  | 'LossBackBonus'
  | 'DepositBonus';

export interface BonusApplicantUser {
  id: string;
  username: string | null;
}

export interface BonusApplicantBonus {
  id: number;
  name: string;
  category: BonusCategory | string;
  releaseType: string;
  installments: number;
}

export interface BonusApplicantInstallment {
  id?: number | string;
  installmentNo?: number | string;
  installmentNumber?: number | string;
  installment?: number | string;
  serialNo?: number | string;
  amount?: number | string;
  bonusAmount?: number | string;
  installmentAmount?: number | string;
  turnoverRequired?: number | string;
  totalTurnoverRequired?: number | string;
  requiredTurnover?: number | string;
  releaseDate?: string | null;
  releasedAt?: string | null;
  releaseAt?: string | null;
  claimedAt?: string | null;
  status?: string | null;
  releaseStatus?: string | null;
}

export interface BonusApplicantItem {
  id: number;
  userId: string;
  bonusId: number;
  triggerEvent: string;
  depositId: string | null;
  awardedAmount: string;
  turnoverRequired: string;
  turnoverCompleted: string;
  awardedAt: string;
  expireAt: string;
  timesClaimed: number;
  timesRejected: number;
  approvalBy: string | null;
  approvalAt: string | null;
  rejectReason: string | null;
  meta: unknown;
  status: string;
  createdAt: string;
  updatedAt: string;
  user: BonusApplicantUser;
  bonus: BonusApplicantBonus;
  installments: BonusApplicantInstallment[];
}

export interface BonusApplicantsQuery {
  page?: number;
  limit?: number;
  platformId?: number;
  fromDate?: string;
  toDate?: string;
  username?: string;
  status?: string;
  category?: 'JoiningBonus' | 'ReferralBonus' | 'DepositBonus' | '';
  releaseType?: string;
  approvalType?: string;
  userId?: number | string;
  search?: string;
  timezone?: string;
  fileName?: string;
  exportFormat?: string;
  isExport?: boolean;
}

export interface BonusApplicantsResponse {
  bonusApplicants: BonusApplicantItem[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    limit: number;
  };
}
