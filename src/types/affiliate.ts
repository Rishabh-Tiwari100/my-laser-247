export interface AffiliateBase {
  id?: string;
  userId?: string;
  reasonFrom?: string | null;
  reasonTo?: string | null;
  status?: string;
  requestStatus?: string;
  affiliateCode?: string | null;
  totalCommission?: string;
  withdrawalCommission?: string;
  lastCommission?: string | null;
  acceptedAt?: string | null;
  rejectedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAffiliatePayload {
  reasonFrom: string;
}

export interface CreateAffiliateResponse {
  message: string;
  data: AffiliateBase;
}

export interface AffiliateCommissionRange {
  id: string;
  fromUser: number;
  toUser: number | null;
  percentage: number;
  createdAt: string;
  updatedAt: string;
}

interface AffiliateReqNotApplied {
  status: 'Not Applied';
}

interface AffiliateReqPending {
  status: 'Pending';
  message: string;
  affiliate: {
    id: string;
    userId: string;
    reasonFrom: string;
    reasonTo: null;
    status: 'Inactive';
    requestStatus: 'Pending';
    affiliateCode: null;
    totalCommission: string;
    lastCommission: string;
    acceptingDate: null;
    deletedAt: null;
    createdAt: string;
    updatedAt: string;
  };
}

interface AffiliateReqRejected {
  status: 'Rejected';
  message: string;
  reason: string;
}

export interface AffiliatedReqApproved {
  status: 'Approved';
  message: string;
  affiliateStatus: 'Active' | 'Inactive';
  requestStatus: 'Approved';
  referralCode: string;
  totalActiveReferrals: number;
  totalInactiveReferrals: number;
  totalReferrals: number;
  lastCommission: string;
  totalCommission: string;
  range: {
    id: string;
    fromUser: number;
    toUser: number;
    percentage: number;
    createdAt: string;
    updatedAt: string;
  }[];
}

export type AffiliateDashboardResponse =
  | AffiliateReqNotApplied
  | AffiliateReqPending
  | AffiliateReqRejected
  | AffiliatedReqApproved;

export interface PaginationInfo {
  totalItems: number;
  limit: number;
  currentPage: number;
  totalPage: number;
}

export interface Referral {
  id: number;
  commissionEarned: string;
  status: string;
  createdAt: string;
  referredUser: {
    username: string;
  };
  weeklyTurnover: number;
}

export interface AffiliateCommissionPayload {
  page?: number;
  limit?: number;
  search?: string;
  fromDate?: string;
  toDate?: string;
  status?: string;
}

export interface AffiliateReferralResponse {
  pagination: PaginationInfo;
  referrals: Referral[];
}

// Weekly Commission interfaces
export interface AffiliateDetails {
  id: string;
  users: {
    username: string;
  };
}

export interface WeeklyCommissionItem {
  id: string;
  affiliateId: string;
  weekStart: string;
  weekEnd: string;
  activeUsers: number;
  totalLoss: string;
  deductionAmount: string;
  status: 'Pending' | 'Approved' | 'Rejected' | string;
  commissionPercent: string;
  commissionAmount: string;
  createdAt: string;
  affiliate: AffiliateDetails;
}

export interface WeeklyCommissionResponse {
  status: boolean;
  message: string;
  data: WeeklyCommissionItem[];
  pagination: PaginationInfo;
}

export interface WeeklyCommissionQueryParams {
  page?: number;
  limit?: number;
  status?: string; // Pending | Approved | Rejected | ALL
  fromDate?: string;
  toDate?: string;
}
