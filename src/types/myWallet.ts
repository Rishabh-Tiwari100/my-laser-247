export interface WalletSummaryResponse {
  totalBalance: number;
  depositBalance: number;
  bonusBalance: number;
  lockedBalance: number;
  availableWithdrawals: number;
}

export interface WalletTurnoverItem {
  depositId: string;
  required: number;
  completed: number;
  remaining: number;
  progress: number;
  status: 'Completed' | 'Pending';
  warning: string;
}

export interface WalletPagination {
  currentPage: number;
  limit: number;
  totalItems: number;
  totalPage: number;
}

export interface MyWalletResponse {
  data: WalletTurnoverItem[];
  pagination: WalletPagination;
}

export interface MyWalletParams {
  page?: number;
  limit?: number;
}
