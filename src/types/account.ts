export interface AddBankAccountRequest {
  accountNumber: string;
  ifsc: string;
  accountHolder: string;
  accountType: 'Savings' | 'Current';
  bankName: string;
  upiId: string;
  number: string;
  selectType: string;
  minAmount?: number;
  maxAmount?: number;
  withdrawPassword: string;
  mfaCode?: string;
  mfaOtp?: string;
}

export interface AddBankAccountResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface AddUPIAccountRequest {
  upiId: string;
  number: string;
  name: string;
  type: 'QR1';
  qrCode?: string;
  minAmount?: number;
  maxAmount?: number;
  withdrawPassword: string;
  mfaCode?: string;
  mfaOtp?: string;
}

export interface AddUPIAccountResponse {
  success: boolean;
  message: string;
  data?: AddUPIAccountRequest;
}

export interface AddCryptoWalletRequest {
  walletAddress: string;
  qrImage?: string;
  networkId?: string | number;
}

export interface CryptoNetwork {
  id: string | number;
  name: string;
  type?: string;
  paymentOptions?: Array<{
    displayName?: string;
    usdRate?: string | number;
  }>;
}

export interface CryptoWallet {
  id: string;
  walletAddress: string;
  qrImage?: string;
  chain?: string;
  networkId?: string | number;
  network?: CryptoNetwork;
  status?: string;
}

export interface BankAccount {
  id: string;
  userId: string;
  adminId: string | null;
  accountNumber: string;
  ifsc: string;
  accountHolder: string;
  accountType: string;
  status: string;
  bankName: string | null;
  upiId: string | null;
  number: string | null;
  selectType: string | null;
  minDepositAmount: string | number | null;
  maxDepositAmount: string | number | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BankAccountsResponse {
  status: boolean;
  message: string;
  banks: BankAccount[];
  pagination: {
    currentPage: number;
    totalPage: number;
    totalItems: number;
    limit: number;
  };
}

// Delete Accoount API

export interface DeleteAccountResponse {
  status: boolean;
  message: string;
}

// Deposit Withdraw Request API

export interface DepositWithdrawRequest {
  type: 'Credit' | 'Debit';
  amount: number;
  bankId?: string | number;
  UTR?: string;
  image?: string;
  method: 'upi' | 'bank';
  UPI?: string | number;
  mfaCode?: string;
  mfaOtp?: string;
}

export type PaymentGatewayMode = 'Manual' | 'Upi' | 'Crypto';
export type PaymentGatewayRequestType = 'deposit' | 'withdraw';

export interface PaymentGatewayOption {
  id: number;
  type: PaymentGatewayMode;
  code: string;
  name: string;
  accessType: 'Deposit' | 'Withdraw' | 'Both' | string;
  status: 'Active' | 'Inactive' | string;
  createdAt: string;
  updatedAt: string;
}

export interface ActivePaymentGatewaysResponse {
  success: boolean;
  message: string;
  data: PaymentGatewayOption[];
}

export interface PaymentGatewayRedirectRequest {
  type: PaymentGatewayRequestType;
  amount: number;
  gatewayId?: number;
  code: string;
}

export interface PaymentGatewayRedirectResponse {
  success?: boolean;
  status?: boolean;
  message: string;
  data?: {
    transactionId?: string;
    url?: string;
    redirectUrl?: string;
    paymentUrl?: string;
  };
  url?: string;
  redirectUrl?: string;
  paymentUrl?: string;
}

export interface PaymentGatewayTransaction {
  id: string;
  userId: string;
  paymentGatewayId: number;
  type: 'Credit' | 'Debit';
  amount: string;
  status: 'Pending' | 'Confirmed' | 'Failed' | 'Approved' | 'Rejected' | string;
  paymentUrl: string | null;
  gatewayReference: string | null;
  remark: string | null;
  statusUpdatedAt: string | null;
  createdAt: string;
  updatedAt: string;
  depositWithdrawRequestId: string | null;
  user?: {
    id: string;
    username: string;
    firstname: string | null;
    lastname: string | null;
    mobile: string | null;
  };
  paymentGateway?: {
    id: number;
    code: string;
    name: string;
    type: PaymentGatewayMode;
  };
}

export interface PaymentGatewayTransactionsResponse {
  status: boolean;
  message: string;
  data: PaymentGatewayTransaction[];
  pagination?: {
    totalItems: number;
    limit: number;
    currentPage: number;
    totalPage: number;
    totalPages?: number;
  };
  meta?: {
    totalItems?: number;
    limit?: number;
    currentPage?: number;
    page?: number;
    totalPage?: number;
    totalPages?: number;
  };
  totalItems?: number;
  limit?: number;
  currentPage?: number;
  page?: number;
  totalPage?: number;
  totalPages?: number;
}

export interface PaymentGatewayTransactionsQueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  direction?: string;
  platformId?: number;
  fromDate?: string;
  toDate?: string;
  search?: string;
  status?: string;
  type?: 'Debit' | 'Credit';
  paymentGatewayId?: number;
  userId?: number;
}

// Deposit Withdraw Table  API

export interface DepositWithdrawResponse {
  message: string;
  data: DepositWithdrawItem[];
  pagination: {
    totalItems: number;
    limit: number;
    currentPage: number;
    totalPage: number;
  };
}

/* =========================
   Main Item
========================= */

export interface DepositWithdrawItem {
  id: string;
  userId: string;
  type: 'Debit' | 'Credit';
  amount: string;
  approvedAmount: string | null;
  status: 'Pending' | 'Approved' | 'Rejected';
  image: string | null;
  transactionCode: string | null;
  transactionHash: string | null;
  upiId: string | null;
  bankId: string | null;
  remark: string | null;
  statusUpdatedAt: string; // ISO Date
  bankerId: string | null;
  createdAt: string; // ISO Date
  updatedAt: string; // ISO Date
  digitalPaymentId: string | null;

  bank: BankAccount | null;
  upi: UpiDetails | null;
}

export interface UpiDetails {
  id: string;
  userId: string;
  upiId: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
  updatedAt: string;
}

export interface DepositWithdrawQueryParams {
  /** Page number for pagination */
  page?: number;

  /** Number of items per page */
  limit?: number;

  /** Filter by from date (ISO string) */
  fromDate?: string; // e.g. 2026-01-19T00:00:00.000Z

  /** Filter by to date (ISO string) */
  toDate?: string; // e.g. 2026-01-19T23:59:59.999Z

  /** Transaction status */
  status?: 'Pending' | 'Confirmed' | 'Failed' | 'Approved' | 'Rejected';

  /** Transaction type */
  type?: 'Debit' | 'Credit';

  /** Filter UPI transactions */
  isUpi?: boolean;

  /** Filter Bank transactions */
  isBank?: boolean;
}

// Upload FILE API
export interface UploadFile {
  url: string;
  meta: {
    originalname: string;
    filename: string;
    mimetype: string;
    size: number;
  };
}

// UPI API

export interface UpiAccount {
  id: string;
  userId: string;
  adminId: string | null;
  name: string;
  upiId: string;
  number: string;
  qrCode: string;
  status: 'Active' | 'Inactive';
  type: string;
  minAmount: number | null;
  maxAmount: number | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpiAccountResponse {
  status: boolean;
  message: string;
  upi: UpiAccount[];
  pagination: {
    currentPage: number;
    totalPage: number;
    totalItems: number;
    limit: number;
  };
}
// Deposit Withdraw Request API

export interface CreateUpiTransactionResponse {
  status: boolean;
  message: string;
  data: {
    id: string;
    userId: string;
    type: 'Debit' | 'Credit';
    amount: string;
    status: 'Pending' | 'Confirmed' | 'Failed' | 'Approved' | 'Rejected';
    image: string | null;
    transactionCode: string | null;
    transactionHash: string | null;
    upiId: string | null;
    bankId: string | null;
    remark: string | null;
    statusUpdatedAt: string;
    bankerId: string | null;
    createdAt: string;
    updatedAt: string;
    digitalPaymentId: string | null;
  };
}

export interface CreateDepositWithdrawResponse {
  status: boolean;
  message: string;
  data: {
    id: string;
    userId: string;
    type: 'Debit' | 'Credit';
    amount: string;
    status: 'Pending' | 'Confirmed' | 'Failed' | 'Approved' | 'Rejected';
    image: string | null;
    transactionCode: string | null;
    transactionHash: string | null;
    upiId: string | null;
    bankId: string | null;
    remark: string | null;
    statusUpdatedAt: string;
    bankerId: string | null;
    createdAt: string;
    updatedAt: string;
    digitalPaymentId: string | null;
  };
}

// Deposit Account API

export interface DepositAccountResponse {
  status: boolean;
  message: string;
  Upi: DepositUpiAccount[];
  /** Compatibility with older API response casing. */
  upi?: DepositUpiAccount[];
  Bank?: BankAccount[];
  Banks?: BankAccount[];
  bank?: BankAccount[];
  banks?: BankAccount[];
}

/* =======================
   UPI Account Interface
======================= */
export interface DepositUpiAccount {
  id: string;
  userId: string | null;
  adminId: string | null;
  name: string | null;
  upiId: string;
  number: string | null;
  qrCode: string;
  status: 'Active' | 'Inactive' | string;
  type: string;
  minAmount: string;
  maxAmount: string;
  deletedAt: string | null;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}
