import { useCallback, useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import Pagination from '@/components/common/Pagination';
import {
  useCancelRequestMutation,
  useGetDepositWithdrawQuery,
  useGetPaymentGatewayTransactionsQuery,
} from '@/store/api/accountApi';
import type {
  DepositWithdrawItem,
  DepositWithdrawQueryParams,
  PaymentGatewayTransaction,
  PaymentGatewayTransactionsQueryParams,
} from '@/types/account';
import DepositAttachmentModal from '../Deposit/components/DepositAttachmentModal';
import CancelRequestModal from './common/CancelRequestModal';

interface DepositWithdrawTransactionsProps {
  ariaLabel: string;
  filterAriaLabel: string;
  sectionClassName?: string;
  headingClassName?: string;
  heading?: string;
  source?: 'manual' | 'payment-gateway';
  transactionType?: 'Credit' | 'Debit';
  paymentGatewayId?: number;
}

const formatAmount = (value: string | number | null | undefined): string => {
  if (value === null || value === undefined || value === '') return '-';
  const normalizedValue = String(value).trim();
  if (!normalizedValue) return '-';
  const numericValue = normalizedValue.replace(/,/g, '');
  if (!/^-?\d+(?:\.\d+)?$/.test(numericValue)) return normalizedValue;
  const parsedAmount = Number(numericValue);
  return Number.isFinite(parsedAmount) ? parsedAmount.toFixed(2) : normalizedValue;
};

const formatTransactionDate = (value: string | null | undefined): string => {
  if (!value || !dayjs(value).isValid()) return '-';
  return dayjs(value).format('DD/MM/YYYY | HH:mm');
};

const getLast30DaysRange = (): Pick<DepositWithdrawQueryParams, 'fromDate' | 'toDate'> => ({
  fromDate: dayjs().subtract(30, 'day').startOf('day').toISOString(),
  toDate: dayjs().endOf('day').toISOString(),
});

type TransactionRow = DepositWithdrawItem | PaymentGatewayTransaction;
type StatusFilterOption = {
  label: string;
  value: NonNullable<DepositWithdrawQueryParams['status']>;
};
type PaginationShape = {
  totalItems: number;
  limit: number;
  currentPage: number;
  totalPage: number;
};

const manualStatusFilterOptions: StatusFilterOption[] = [
  { label: 'Pending', value: 'Pending' },
  { label: 'Approved', value: 'Approved' },
  { label: 'Rejected', value: 'Rejected' },
];

const gatewayStatusFilterOptions: StatusFilterOption[] = [
  { label: 'Pending', value: 'Pending' },
  { label: 'Confirmed', value: 'Confirmed' },
  { label: 'Failed', value: 'Failed' },
  { label: 'Approved', value: 'Approved' },
  { label: 'Rejected', value: 'Rejected' },
];

const isGatewayTransaction = (
  transaction: TransactionRow
): transaction is PaymentGatewayTransaction => 'paymentGatewayId' in transaction;

const getPaymentType = (transaction: TransactionRow): string => {
  const normalizedType = transaction.type?.toLowerCase();
  if (normalizedType === 'credit') return 'client deposit';
  if (normalizedType === 'debit') return 'client withdraw';
  return '-';
};

const getApprovedAmount = (transaction: TransactionRow): string | number | null | undefined => {
  if (isGatewayTransaction(transaction)) return undefined;

  const normalizedStatus = transaction.status?.toLowerCase();
  return normalizedStatus === 'approved' || normalizedStatus === 'confirmed'
    ? transaction.approvedAmount
    : undefined;
};

const getTextValue = (...values: unknown[]): string => {
  const value = values.find(
    (candidate): candidate is string | number =>
      (typeof candidate === 'string' && candidate.trim().length > 0) ||
      typeof candidate === 'number'
  );
  return value === undefined ? '-' : String(value).trim();
};

const getPaymentMethod = (transaction: TransactionRow): string => {
  if (isGatewayTransaction(transaction)) {
    return (
      transaction.paymentGateway?.name || transaction.paymentGateway?.type || 'payment gateway'
    );
  }

  if (transaction.upiId || transaction.upi) return 'upi';
  if (transaction.bankId || transaction.bank) return transaction.bank?.bankName || 'bank';
  return '-';
};

const getTransactionReference = (transaction: TransactionRow): string => {
  if (isGatewayTransaction(transaction)) return getTextValue(transaction.gatewayReference);
  return getTextValue(transaction.transactionCode, transaction.transactionHash);
};

const getTransactionKey = (transaction: TransactionRow, index: number): string =>
  transaction.id || `${getTransactionReference(transaction)}-${transaction.createdAt ?? index}`;

const getActionDate = (transaction: TransactionRow): string | null | undefined => {
  if (transaction.statusUpdatedAt) return transaction.statusUpdatedAt;
  const normalizedStatus = transaction.status?.toLowerCase();
  const terminalStatuses = ['approved', 'confirmed', 'rejected', 'declined', 'failed'];
  return normalizedStatus && terminalStatuses.includes(normalizedStatus)
    ? transaction.updatedAt
    : undefined;
};

const statusBadgeClassName = (status: string | undefined): string => {
  const normalizedStatus = status?.toLowerCase();
  if (normalizedStatus === 'approved' || normalizedStatus === 'confirmed') return 'bg-[#109b16]';
  if (
    normalizedStatus === 'rejected' ||
    normalizedStatus === 'declined' ||
    normalizedStatus === 'failed'
  ) {
    return 'bg-[#d62222]';
  }
  if (normalizedStatus === 'pending') return 'bg-[#d18a00]';
  return 'bg-[#667080]';
};

const getNumericValue = (...values: unknown[]): number | undefined => {
  const value = values.find((candidate) => {
    const numberValue = Number(candidate);
    return Number.isFinite(numberValue) && numberValue > 0;
  });
  return value === undefined ? undefined : Number(value);
};

const getPagination = (
  response: unknown,
  fallbackPage: number,
  fallbackLimit: number,
  itemCount: number
): PaginationShape | null => {
  if (!response || typeof response !== 'object') {
    return itemCount > 0
      ? {
          totalItems: itemCount,
          limit: fallbackLimit,
          currentPage: fallbackPage,
          totalPage: Math.max(1, Math.ceil(itemCount / fallbackLimit)),
        }
      : null;
  }

  const responseRecord = response as Record<string, any>;
  const paginationRecord =
    responseRecord.pagination && typeof responseRecord.pagination === 'object'
      ? responseRecord.pagination
      : {};
  const metaRecord =
    responseRecord.meta && typeof responseRecord.meta === 'object' ? responseRecord.meta : {};
  const limit =
    getNumericValue(paginationRecord.limit, metaRecord.limit, responseRecord.limit) ??
    fallbackLimit;
  const currentPage =
    getNumericValue(
      paginationRecord.currentPage,
      metaRecord.currentPage,
      responseRecord.currentPage,
      paginationRecord.page,
      metaRecord.page,
      responseRecord.page
    ) ?? fallbackPage;
  const totalItems =
    getNumericValue(
      paginationRecord.totalItems,
      metaRecord.totalItems,
      responseRecord.totalItems
    ) ?? itemCount;
  const totalPage =
    getNumericValue(
      paginationRecord.totalPage,
      paginationRecord.totalPages,
      metaRecord.totalPage,
      metaRecord.totalPages,
      responseRecord.totalPage,
      responseRecord.totalPages
    ) ?? Math.max(1, Math.ceil(totalItems / limit));

  return totalItems > 0
    ? {
        totalItems,
        limit,
        currentPage,
        totalPage,
      }
    : null;
};

export default function DepositWithdrawTransactions({
  ariaLabel,
  filterAriaLabel,
  sectionClassName = 'mt-[8px] overflow-hidden rounded-[5px] bg-white px-[8px] pb-[8px] pt-[6px]',
  headingClassName = 'mb-[6px] text-[17px] font-bold leading-[19px]',
  heading = 'Transactions',
  source = 'manual',
  transactionType,
  paymentGatewayId,
}: DepositWithdrawTransactionsProps) {
  const [status, setStatus] = useState<DepositWithdrawQueryParams['status'] | ''>('');
  const [isStatusFilterOpen, setIsStatusFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAttachment, setSelectedAttachment] = useState<string | null>(null);
  const [cancelTarget, setCancelTarget] = useState<DepositWithdrawItem | null>(null);
  const statusFilterRef = useRef<HTMLDivElement>(null);
  const [cancelRequest, { isLoading: isCanceling }] = useCancelRequestMutation();
  const sharedParams = {
    page: currentPage,
    limit: 10,
    ...getLast30DaysRange(),
    ...(status ? { status } : {}),
    ...(transactionType ? { type: transactionType } : {}),
  };
  const manualQuery = useGetDepositWithdrawQuery(sharedParams, { skip: source !== 'manual' });
  const gatewayQuery = useGetPaymentGatewayTransactionsQuery(
    {
      ...(sharedParams as PaymentGatewayTransactionsQueryParams),
      ...(paymentGatewayId ? { paymentGatewayId } : {}),
    },
    { skip: source !== 'payment-gateway' }
  );
  const activeQuery = source === 'payment-gateway' ? gatewayQuery : manualQuery;
  const { data, isFetching, isError, refetch } = activeQuery;
  const transactions = data?.data ?? [];
  const pagination = getPagination(data, currentPage, sharedParams.limit, transactions.length);
  const closeAttachment = useCallback(() => setSelectedAttachment(null), []);
  const closeCancelModal = useCallback(() => setCancelTarget(null), []);
  const statusFilterOptions =
    source === 'payment-gateway' ? gatewayStatusFilterOptions : manualStatusFilterOptions;
  const selectedStatusLabel =
    statusFilterOptions.find((option) => option.value === status)?.label ?? 'All';
  const tableCellClassName =
    'h-[38px] overflow-hidden text-ellipsis whitespace-nowrap border border-[#c8c8c8] px-[7px] py-0 text-center align-middle';

  useEffect(() => {
    if (!isStatusFilterOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!statusFilterRef.current?.contains(event.target as Node)) {
        setIsStatusFilterOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [isStatusFilterOpen]);

  const updateStatusFilter = (nextStatus: DepositWithdrawQueryParams['status'] | '') => {
    setStatus(nextStatus);
    setCurrentPage(1);
    setIsStatusFilterOpen(false);
  };

  const handleCancelRequest = async () => {
    if (!cancelTarget) return;

    const toastOptions = { id: `cancel-request-${cancelTarget.id}` };
    try {
      const response = await cancelRequest({ id: cancelTarget.id }).unwrap();
      toast.success(response.message || 'Request cancelled successfully.', toastOptions);
      closeCancelModal();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to cancel request.', toastOptions);
    }
  };

  return (
    <section className={sectionClassName}>
      <h2 className={headingClassName}>{heading}</h2>
      <div ref={statusFilterRef} className="relative">
        <button
          type="button"
          className="flex h-[33px] w-full items-center justify-between rounded-[4px] border border-[#999] bg-white px-[12px] text-left text-[14px] outline-none focus:border-[#243a48]"
          aria-label={filterAriaLabel}
          aria-haspopup="listbox"
          aria-expanded={isStatusFilterOpen}
          onClick={() => setIsStatusFilterOpen((isOpen) => !isOpen)}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              setIsStatusFilterOpen(true);
            }
            if (event.key === 'Escape') setIsStatusFilterOpen(false);
          }}
        >
          <span>{selectedStatusLabel}</span>
          <span className="text-[11px]" aria-hidden="true">
            {isStatusFilterOpen ? '^' : 'v'}
          </span>
        </button>
        {isStatusFilterOpen && (
          <div
            role="listbox"
            aria-label={filterAriaLabel}
            className="absolute left-0 right-0 top-[36px] z-20 overflow-hidden rounded-[4px] border border-[#999] bg-white shadow-[0_8px_18px_rgba(0,0,0,0.16)]"
          >
            {[{ label: 'All', value: '' as const }, ...statusFilterOptions].map((option) => (
              <button
                key={option.value || 'all'}
                type="button"
                role="option"
                aria-selected={status === option.value}
                className={`block h-[33px] w-full px-[12px] text-left text-[14px] hover:bg-[#eef4f7] ${
                  status === option.value ? 'bg-[#dfeaf0] font-semibold' : 'bg-white'
                }`}
                onClick={() => updateStatusFilter(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-[8px] overflow-x-auto" role="region" aria-label={ariaLabel} tabIndex={0}>
        <table className="w-[1230px] table-fixed border-collapse text-[12px] text-black">
          <colgroup>
            <col className="w-[110px]" />
            <col className="w-[140px]" />
            <col className="w-[140px]" />
            <col className="w-[85px]" />
            <col className="w-[125px]" />
            <col className="w-[125px]" />
            <col className="w-[130px]" />
            <col className="w-[125px]" />
            <col className="w-[110px]" />
            <col className="w-[140px]" />
            <col className="w-[140px]" />
          </colgroup>
          <thead className="bg-[#e2e2e2] font-bold uppercase">
            <tr>
              {[
                'Payment Type',
                'Requested Amount',
                'Approved Amount',
                'Status',
                'Request Date',
                'Action Date',
                'Payment Method',
                'Transaction No',
                'Attachments',
                'Reason',
                'Action',
              ].map((heading) => (
                <th
                  key={heading}
                  scope="col"
                  className="h-[34px] whitespace-nowrap border border-[#c8c8c8] px-[6px] py-0 text-center align-middle"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, transactionIndex) => (
              <tr
                key={getTransactionKey(transaction, transactionIndex)}
                className="border-b border-[#c8c8c8]"
              >
                <td className={tableCellClassName} title={getPaymentType(transaction)}>
                  {getPaymentType(transaction)}
                </td>
                <td className={tableCellClassName}>{formatAmount(transaction.amount)}</td>
                <td className={tableCellClassName}>
                  {formatAmount(getApprovedAmount(transaction))}
                </td>
                <td className="h-[38px] whitespace-nowrap border border-[#c8c8c8] px-[2px] py-0 text-center align-middle">
                  {transaction.status ? (
                    <span
                      className={`inline-flex min-h-[22px] items-center justify-center rounded-[2px] px-[4px] text-[10px] font-bold uppercase leading-[22px] text-white ${statusBadgeClassName(
                        transaction.status
                      )}`}
                    >
                      {transaction.status}
                    </span>
                  ) : (
                    '-'
                  )}
                </td>
                <td className={tableCellClassName}>
                  {formatTransactionDate(transaction.createdAt)}
                </td>
                <td className={tableCellClassName}>
                  {formatTransactionDate(getActionDate(transaction))}
                </td>
                <td className={tableCellClassName} title={getPaymentMethod(transaction)}>
                  {getPaymentMethod(transaction)}
                </td>
                <td className={tableCellClassName} title={getTransactionReference(transaction)}>
                  {getTransactionReference(transaction)}
                </td>
                <td className={tableCellClassName}>
                  {!isGatewayTransaction(transaction) && transaction.image ? (
                    <button
                      type="button"
                      className="inline-flex h-[27px] items-center justify-center rounded-[4px] bg-[linear-gradient(90deg,#05064f_0%,#06116e_45%,#06c4e8_100%)] px-[11px] text-[12px] font-medium text-white hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#08a7d2]"
                      onClick={() => setSelectedAttachment(transaction.image ?? null)}
                    >
                      View Details
                    </button>
                  ) : (
                    '-'
                  )}
                </td>
                <td className={tableCellClassName} title={getTextValue(transaction.remark)}>
                  {getTextValue(transaction.remark)}
                </td>
                <td className={tableCellClassName}>
                  {!isGatewayTransaction(transaction) &&
                  transaction.type?.toLowerCase() === 'debit' &&
                  transaction.status?.toLowerCase() === 'pending' ? (
                    <button
                      type="button"
                      disabled={isCanceling}
                      className="inline-flex h-[27px] items-center justify-center rounded-[4px] bg-red-500 px-[11px] text-[12px] font-medium text-white disabled:bg-red-300"
                      onClick={() => setCancelTarget(transaction)}
                    >
                      Cancel
                    </button>
                  ) : (
                    '-'
                  )}
                </td>
              </tr>
            ))}
            {isFetching && transactions.length === 0 && (
              <tr>
                <td colSpan={11} className="h-[42px] border border-[#c8c8c8] text-center">
                  Loading transactions...
                </td>
              </tr>
            )}
            {isError && !isFetching && transactions.length === 0 && (
              <tr>
                <td colSpan={11} className="h-[42px] border border-[#c8c8c8] text-center">
                  Could not load transactions.{' '}
                  <button
                    type="button"
                    onClick={() => refetch()}
                    className="font-bold text-[#0d3ead] underline"
                  >
                    Retry
                  </button>
                </td>
              </tr>
            )}
            {!isFetching && !isError && transactions.length === 0 && (
              <tr>
                <td colSpan={11} className="h-[42px] border border-[#c8c8c8] text-center">
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <Pagination
          totalItems={pagination.totalItems}
          currentPage={pagination.currentPage || currentPage}
          pageSize={pagination.limit}
          showPageSizeSelector={false}
          onPageChange={(page) => setCurrentPage(page)}
          onPageSizeChange={() => {}}
        />
      )}

      {selectedAttachment && (
        <DepositAttachmentModal imageUrl={selectedAttachment} onClose={closeAttachment} />
      )}

      <CancelRequestModal
        open={cancelTarget !== null}
        requestType="withdraw"
        amount={cancelTarget ? formatAmount(cancelTarget.amount) : undefined}
        isCanceling={isCanceling}
        onCancel={closeCancelModal}
        onConfirm={handleCancelRequest}
      />
    </section>
  );
}
