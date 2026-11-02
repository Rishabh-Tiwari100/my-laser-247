import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import dayjs from 'dayjs';
import { CalendarDays, Download, X } from 'lucide-react';
import { useGetDepositWithdrawRequestQuery } from '@/store/api/accountApi';
import { useGetMyTransactionsQuery } from '@/store/api/transactionApi';
import type { Transaction, TransactionsParams } from '@/store/api/transactionApi';
import { useGetBetHistoryQuery, type ProfitLossItem } from '@/store/api/betReportApi';
import { useGetCasinoRoundHistoryByIdQuery } from '@/store/api/casinoApi';
import type { CasinoRound } from '@/types/casino';
import { formatContextLabel } from '@/utils';

const PAGE_SIZE = 25;

const recordTypeOptions = [
  { label: 'All', value: 'ALL' },
  { label: 'Sports', value: 'Sports' },
  { label: 'Casino', value: 'Casino' },
] as const;

type RecordTypeFilter = (typeof recordTypeOptions)[number]['value'];

const transactionTypeOptions = [
  { label: 'All', value: 'ALL' },
  { label: 'Debit', value: 'Debit' },
  { label: 'Credit', value: 'Credit' },
];

const subtypeOptions = [
  { label: 'All', value: 'ALL' },
  { label: 'Won', value: 'Won' },
  { label: 'Lost', value: 'Lost' },
  { label: 'Bonus', value: 'Bonus' },
  { label: 'Sports Rollback', value: 'Rollback' },
  { label: 'Casino Rollback', value: 'CasinoBetRefund' },
  { label: 'Deposit', value: 'Deposit' },
  { label: 'Withdrawal', value: 'Withdrawal' },
];

interface StatementFilters {
  fromDate: string;
  toDate: string;
  recordType: RecordTypeFilter;
  subtype: string;
  type: string;
  search: string;
}

const defaultFromDate = dayjs().subtract(2, 'day').format('YYYY-MM-DD');
const defaultToDate = dayjs().format('YYYY-MM-DD');

const createInitialFilters = (): StatementFilters => ({
  fromDate: defaultFromDate,
  toDate: defaultToDate,
  recordType: 'ALL',
  subtype: 'ALL',
  type: 'ALL',
  search: '',
});

const toRecordTypeFilter = (value: string): RecordTypeFilter =>
  recordTypeOptions.some((option) => option.value === value) ? (value as RecordTypeFilter) : 'ALL';

const formatStatementDate = (value: string) =>
  value && dayjs(value).isValid() ? dayjs(value).format('DD/MM/YYYY') : '';

const formatTimestamp = (value?: string | null) => {
  if (!value || !dayjs(value).isValid()) return '-';
  return dayjs(value).format('DD/MM/YYYY HH:mm');
};

const formatAmount = (value: string | number) => {
  const amount = Math.abs(Number(value));
  if (!Number.isFinite(amount)) return String(value ?? '-');
  return String(Number(amount.toFixed(2)));
};

const formatBalance = (value?: string | number) => {
  const balance = Number(value);
  return Number.isFinite(balance) ? balance.toFixed(2) : '-';
};

const isCreditTransaction = (transaction: Transaction) => {
  const type = transaction.type?.toLowerCase();
  if (type === 'credit') return true;
  if (type === 'debit') return false;
  return Number(transaction.amount) >= 0;
};

const getDescription = (transaction: Transaction) => {
  if (transaction.narration?.trim()) return transaction.narration;
  if (transaction.context?.trim()) return formatContextLabel(transaction.context);
  return '-';
};

const escapeCsvCell = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`;

const fieldClassName =
  'statement-field flex min-w-0 flex-col gap-[2px] leading-[15px] [&>span:first-child]:h-[15px]';
const controlClassName =
  'h-[34px] w-full rounded-[4px] border border-[#aeb3b7] bg-white px-[14px] font-[Arial,Helvetica,sans-serif] text-[14px] leading-[32px] text-[#090909] outline-none focus:border-[#283f50] focus:shadow-[0_0_0_1px_rgba(40,63,80,0.12)]';
const tableCellClassName =
  'h-[31px] border border-[#bfc1c3] px-[5px] py-0 leading-[30px] max-md:h-auto max-md:py-[5px] max-md:leading-[17px]';
const paginationButtonClassName =
  'h-[29px] min-w-[21px] border border-[#d3d3d3] bg-white px-[7px] font-[Arial,Helvetica,sans-serif] text-[11px] font-bold text-[#050505]';

function Account() {
  const [draftFilters, setDraftFilters] = useState<StatementFilters>(createInitialFilters);
  const [appliedFilters, setAppliedFilters] = useState<StatementFilters>(createInitialFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const [statementInfoTransaction, setStatementInfoTransaction] = useState<Transaction | null>(
    null
  );
  const [depositWithdrawInfo, setDepositWithdrawInfo] = useState<Transaction | null>(null);

  const queryParams = useMemo<TransactionsParams>(() => {
    const params: TransactionsParams = {
      page: currentPage,
      limit: PAGE_SIZE,
    };

    const fromDate = dayjs(appliedFilters.fromDate);
    const toDate = dayjs(appliedFilters.toDate);
    if (appliedFilters.fromDate && fromDate.isValid()) {
      params.fromDate = fromDate.startOf('day').toISOString();
    }
    if (appliedFilters.toDate && toDate.isValid()) {
      params.toDate = toDate.endOf('day').toISOString();
    }

    if (appliedFilters.recordType !== 'ALL') params.recordType = appliedFilters.recordType;
    if (appliedFilters.subtype !== 'ALL') params.contextType = appliedFilters.subtype;
    if (appliedFilters.type !== 'ALL') params.type = appliedFilters.type;
    if (appliedFilters.search.trim()) params.search = appliedFilters.search.trim();

    return params;
  }, [appliedFilters, currentPage]);

  const { data, isLoading, isFetching } = useGetMyTransactionsQuery(queryParams);

  const transactions = data?.data ?? [];
  const totalItems = data?.pagination?.totalItems ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const firstEntry = totalItems === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const lastEntry = totalItems === 0 ? 0 : Math.min(currentPage * PAGE_SIZE, totalItems);

  const updateFilter = <Key extends keyof StatementFilters>(
    key: Key,
    value: StatementFilters[Key]
  ) => {
    setDraftFilters((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCurrentPage(1);
    setAppliedFilters({ ...draftFilters });
  };

  const handleDownload = () => {
    const header = ['Profit & Loss', 'Description', 'Balance', 'Date/Time', 'Remarks'];
    const rows = transactions.map((transaction) => [
      formatAmount(transaction.amount),
      getDescription(transaction),
      formatBalance(transaction.availableBalance),
      formatTimestamp(transaction.timestamp),
      transaction.remark || '-',
    ]);
    const csv = [header, ...rows].map((row) => row.map(escapeCsvCell).join(',')).join('\n');
    const file = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = `account-statement-${dayjs().format('YYYY-MM-DD')}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const loading = isLoading || isFetching;

  return (
    <div className="account-statement-page pb-2 font-[Arial,Helvetica,sans-serif] text-[12px] text-[#050505] max-md:min-h-[calc(100vh-95px)]">
      <form
        className="statement-filter-panel border-b border-[#222] bg-white px-[11px] pb-[13px] pt-[12px] max-md:p-[10px_8px]"
        onSubmit={handleSubmit}
      >
        <div className="statement-filter-grid grid grid-cols-2 gap-x-2 gap-y-[7px]">
          <label className={fieldClassName}>
            <span>From Date</span>
            <span className="statement-date-control relative flex h-[34px] w-full items-center justify-between overflow-hidden rounded-[4px] border border-[#aeb3b7] bg-white py-0 pl-[14px] pr-[12px] font-[Arial,Helvetica,sans-serif] text-[14px] leading-[32px] text-[#090909] outline-none focus-within:border-[#283f50] focus-within:shadow-[0_0_0_1px_rgba(40,63,80,0.12)]">
              <span>{formatStatementDate(draftFilters.fromDate)}</span>
              <CalendarDays
                className="h-[14px] w-[14px] shrink-0 stroke-[2.5]"
                aria-hidden="true"
              />
              <input
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                aria-label="From Date"
                type="date"
                value={draftFilters.fromDate}
                max={draftFilters.toDate}
                onChange={(event) => updateFilter('fromDate', event.target.value)}
              />
            </span>
          </label>

          <label className={fieldClassName}>
            <span>To Date</span>
            <span className="statement-date-control relative flex h-[34px] w-full items-center justify-between overflow-hidden rounded-[4px] border border-[#aeb3b7] bg-white py-0 pl-[14px] pr-[12px] font-[Arial,Helvetica,sans-serif] text-[14px] leading-[32px] text-[#090909] outline-none focus-within:border-[#283f50] focus-within:shadow-[0_0_0_1px_rgba(40,63,80,0.12)]">
              <span>{formatStatementDate(draftFilters.toDate)}</span>
              <CalendarDays
                className="h-[14px] w-[14px] shrink-0 stroke-[2.5]"
                aria-hidden="true"
              />
              <input
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                aria-label="To Date"
                type="date"
                value={draftFilters.toDate}
                min={draftFilters.fromDate}
                onChange={(event) => updateFilter('toDate', event.target.value)}
              />
            </span>
          </label>

          <label className={fieldClassName}>
            <span>Type</span>
            <select
              className={`${controlClassName} cursor-pointer`}
              value={draftFilters.recordType}
              onChange={(event) =>
                updateFilter('recordType', toRecordTypeFilter(event.target.value))
              }
            >
              {recordTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className={fieldClassName}>
            <span>Sub Type</span>
            <select
              className={`statement-muted-control ${controlClassName} cursor-pointer bg-[#e3e6e9]`}
              value={draftFilters.subtype}
              onChange={(event) => updateFilter('subtype', event.target.value)}
            >
              {subtypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className={fieldClassName}>
            <span>Transaction Type</span>
            <select
              className={`statement-muted-control ${controlClassName} cursor-pointer bg-[#e3e6e9]`}
              value={draftFilters.type}
              onChange={(event) => updateFilter('type', event.target.value)}
            >
              {transactionTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className={fieldClassName}>
            <span>Search Bet</span>
            <input
              className={`${controlClassName} placeholder:text-[#667080] placeholder:opacity-100 [&::-webkit-search-cancel-button]:hidden`}
              type="search"
              value={draftFilters.search}
              placeholder="Search"
              onChange={(event) => updateFilter('search', event.target.value)}
            />
          </label>
        </div>

        <div className="statement-actions mt-2 grid h-[35px] grid-cols-[minmax(0,1fr)_40px] gap-[3px]">
          <button
            type="submit"
            className="statement-submit-button flex items-center justify-center rounded-[4px] border-0 bg-[#222] text-[14px] font-bold text-white hover:bg-[#111]"
          >
            Submit
          </button>
          <button
            type="button"
            className="statement-download-button flex items-center justify-center rounded-[4px] border-0 bg-[#222] text-white hover:bg-[#111] disabled:cursor-not-allowed disabled:opacity-[0.76]"
            aria-label="Download account statement"
            title="Download account statement"
            onClick={handleDownload}
            disabled={transactions.length === 0}
          >
            <Download className="h-[18px] w-[18px] stroke-[3]" aria-hidden="true" />
          </button>
        </div>
      </form>

      <section className="statement-section mt-[10px] bg-white" aria-labelledby="statement-title">
        <h1
          id="statement-title"
          className="m-0 flex h-[29px] items-center bg-[#222] px-[6px] text-[14px] font-bold leading-[29px] text-white"
        >
          Account Statement
        </h1>

        <div className="statement-table-area px-[10px] pb-0 pt-2 max-md:px-[8px]">
          <div className="statement-table-scroll overflow-x-auto rounded-[5px]">
            <table className="statement-table w-full table-auto border-collapse bg-white text-[12px] text-[#050505]">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="h-[28px] border border-[#bfc1c3] bg-[#0b4d70] px-[5px] py-0 text-center text-[12px] font-bold leading-[27px] text-white"
                  >
                    PROFIT &amp; LOSS
                  </th>
                  <th
                    scope="col"
                    className="h-[28px] border border-[#bfc1c3] bg-[#0b4d70] px-[5px] py-0 text-center text-[12px] font-bold leading-[27px] text-white"
                  >
                    DESCRIPTION
                  </th>
                  <th
                    scope="col"
                    className="h-[28px] border border-[#bfc1c3] bg-[#0b4d70] px-[5px] py-0 text-center text-[12px] font-bold leading-[27px] text-white"
                  >
                    BALANCE
                  </th>
                </tr>
              </thead>
              <tbody aria-busy={loading}>
                {loading ? (
                  Array.from({ length: 8 }).map((_, index) => <StatementLoadingRows key={index} />)
                ) : transactions.length > 0 ? (
                  transactions.map((transaction, index) => (
                    <StatementRows
                      key={transaction.id || `${transaction.timestamp}-${index}`}
                      transaction={transaction}
                      onOpenStatementInfo={() => setStatementInfoTransaction(transaction)}
                      onOpenDepositWithdrawInfo={() => setDepositWithdrawInfo(transaction)}
                    />
                  ))
                ) : (
                  <tr className="statement-empty-row">
                    <td
                      colSpan={3}
                      className="h-[62px] border border-[#bfc1c3] text-center text-[#666]"
                    >
                      No account statement found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="statement-pagination flex min-h-[42px] flex-wrap items-center justify-between gap-3 pt-[7px] text-[11px] font-bold text-[#050505]">
            <span>
              Showing {firstEntry} to {lastEntry} of {totalItems} entries
            </span>

            <nav className="flex items-stretch" aria-label="Account statement pagination">
              {currentPage > 1 && (
                <button
                  className={`${paginationButtonClassName} rounded-l-[4px]`}
                  type="button"
                  onClick={() => setCurrentPage((page) => page - 1)}
                >
                  « Previous
                </button>
              )}
              <button
                type="button"
                className={`active ${paginationButtonClassName} relative z-[1] ${currentPage > 1 ? '-ml-px' : 'rounded-l-[4px]'} !border-[#243a48] !bg-[#243a48] px-[6px] !text-white ${currentPage >= totalPages ? 'rounded-r-[4px]' : ''}`}
                aria-current="page"
              >
                {currentPage}
              </button>
              {currentPage < totalPages && (
                <button
                  className={`${paginationButtonClassName} -ml-px rounded-r-[4px]`}
                  type="button"
                  onClick={() => setCurrentPage((page) => page + 1)}
                >
                  Next »
                </button>
              )}
            </nav>
          </div>
        </div>
      </section>

      {statementInfoTransaction && (
        <StatementInfoModal
          transaction={statementInfoTransaction}
          onClose={() => setStatementInfoTransaction(null)}
        />
      )}
      {depositWithdrawInfo && (
        <DepositWithdrawInfoModal
          transaction={depositWithdrawInfo}
          onClose={() => setDepositWithdrawInfo(null)}
        />
      )}
    </div>
  );
}

interface StatementRowsProps {
  transaction: Transaction;
  onOpenStatementInfo: () => void;
  onOpenDepositWithdrawInfo: () => void;
}

const isDepositWithdrawTransaction = (transaction: Transaction) => {
  const context = transaction.context?.toLowerCase() ?? '';
  const description = getDescription(transaction).toLowerCase();

  return (
    context.includes('deposit') ||
    context.includes('withdraw') ||
    description.includes('deposit') ||
    description.includes('withdraw')
  );
};

const getCasinoRoundHistoryId = (transaction: Transaction) => {
  const value =
    transaction.meta?.roundHistoryId ||
    transaction.meta?.round_history_id ||
    transaction.meta?.casinoRoundHistoryId ||
    transaction.meta?.casino_round_history_id;

  return value !== undefined && value !== null && String(value).trim() ? String(value) : '';
};

const isCasinoBetTransaction = (transaction: Transaction) => {
  const text = [transaction.context, transaction.narration, getDescription(transaction)]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return Boolean(getCasinoRoundHistoryId(transaction)) && /casino|bet|round|win|loss/.test(text);
};

const canOpenDepositWithdrawInfo = (transaction: Transaction) =>
  Boolean(
    getDepositWithdrawRequestId(transaction) ||
      getTransactionUtr(transaction) ||
      transaction.image ||
      transaction.meta?.image ||
      transaction.meta?.proofImage
  );

function StatementRows({
  transaction,
  onOpenStatementInfo,
  onOpenDepositWithdrawInfo,
}: StatementRowsProps) {
  const isCredit = isCreditTransaction(transaction);
  const description = getDescription(transaction);
  const isDepositWithdraw = isDepositWithdrawTransaction(transaction);
  const canOpenStatementInfo = isBetRelatedTransaction(transaction);
  const handleDescriptionClick = isDepositWithdraw && canOpenDepositWithdrawInfo(transaction)
    ? onOpenDepositWithdrawInfo
    : canOpenStatementInfo
      ? onOpenStatementInfo
      : undefined;

  return (
    <>
      <tr className="statement-main-row h-[31px]">
        <td
          className={`${tableCellClassName} align-middle text-left font-bold ${isCredit ? 'statement-credit text-[#0bc90b]' : 'statement-debit text-[#f11616]'}`}
        >
          {formatAmount(transaction.amount)}
        </td>
        <td
          className={`${tableCellClassName} statement-description-cell overflow-hidden text-ellipsis whitespace-nowrap text-center max-md:overflow-visible max-md:whitespace-normal`}
        >
          {handleDescriptionClick ? (
            <button
              type="button"
              className="max-w-full cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap border-0 bg-transparent p-0 font-[Arial,Helvetica,sans-serif] text-[12px] leading-[30px] text-[#050505] underline underline-offset-1 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-1 focus-visible:outline-[#243a48] max-md:overflow-visible max-md:whitespace-normal max-md:leading-[17px]"
              aria-label={`View statement report for ${description}`}
              title={description}
              onClick={handleDescriptionClick}
            >
              {description}
            </button>
          ) : (
            <span
              className="block overflow-hidden text-ellipsis whitespace-nowrap leading-[30px] max-md:overflow-visible max-md:whitespace-normal max-md:leading-[17px]"
              title={description}
            >
              {description}
            </span>
          )}
        </td>
        <td
          className={`${tableCellClassName} statement-balance-cell align-middle text-center font-bold text-[#0bc90b]`}
        >
          {formatBalance(transaction.availableBalance)}
        </td>
      </tr>
      <tr className="statement-detail-row h-[31px] bg-[#e7e7e7]">
        <td className={`${tableCellClassName} whitespace-nowrap max-md:text-[11px]`}>
          {formatTimestamp(transaction.timestamp)}
        </td>
        <td
          className={`${tableCellClassName} overflow-hidden text-ellipsis whitespace-nowrap`}
          colSpan={2}
        >
          <strong className="font-bold">Remarks :</strong> {transaction.remark || '-'}
        </td>
      </tr>
    </>
  );
}

interface DepositWithdrawInfoModalProps {
  transaction: Transaction;
  onClose: () => void;
}

const getTransactionUtr = (transaction: Transaction) =>
  transaction.transactionCode ||
  transaction.transactionHash ||
  transaction.digitalPaymentId ||
  transaction.meta?.UTR ||
  transaction.meta?.utr ||
  transaction.meta?.transactionCode ||
  transaction.meta?.transactionHash ||
  '';

const getDepositWithdrawRequestId = (transaction: Transaction) =>
  transaction.entityId ||
  transaction.meta?.entityId ||
  transaction.meta?.requestId ||
  transaction.meta?.depositWithdrawRequestId ||
  '';

const getRequestField = (request: Record<string, unknown> | undefined, ...keys: string[]) => {
  if (!request) return '';

  for (const key of keys) {
    const value = request[key];
    if (value !== undefined && value !== null && String(value).trim()) return String(value);
  }

  const meta = request.meta;
  if (meta && typeof meta === 'object') {
    const metaRecord = meta as Record<string, unknown>;
    for (const key of keys) {
      const value = metaRecord[key];
      if (value !== undefined && value !== null && String(value).trim()) return String(value);
    }
  }

  return '';
};

function DepositWithdrawInfoModal({ transaction, onClose }: DepositWithdrawInfoModalProps) {
  const modalRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const requestId = getDepositWithdrawRequestId(transaction);
  const {
    data: requestData,
    isLoading,
    isFetching,
    isError,
  } = useGetDepositWithdrawRequestQuery({ id: String(requestId) }, { skip: !requestId });
  const request = requestData?.request as Record<string, unknown> | undefined;
  const utrNumber =
    getRequestField(
      request,
      'UTR',
      'utr',
      'utrNumber',
      'transactionCode',
      'transactionHash',
      'digitalPaymentId'
    ) || getTransactionUtr(transaction);
  const imageUrl =
    getRequestField(request, 'image', 'proofImage', 'paymentProof', 'screenshot') ||
    transaction.image ||
    transaction.meta?.image ||
    transaction.meta?.proofImage ||
    '';
  const loading = isLoading || isFetching;

  useEffect(() => {
    const previouslyFocusedElement = document.activeElement as HTMLElement | null;
    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousBodyOverflow;
      previouslyFocusedElement?.focus();
    };
  }, [onClose]);

  return createPortal(
    <div
      className="statement-info-backdrop fixed inset-0 z-[5000000000000002] flex items-start justify-center bg-black/50 px-2 pt-[36px] max-md:pt-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        ref={modalRef}
        className="statement-info-modal w-[624px] max-w-[calc(100vw-16px)] overflow-hidden rounded-[7px] bg-white font-[Arial,Helvetica,sans-serif] text-[#050505] shadow-[0_1px_2px_rgba(0,0,0,0.25)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="deposit-withdraw-info-title"
      >
        <header className="flex h-[49px] items-center justify-between bg-[#243a48] pl-[17px] pr-[11px] text-white">
          <h2 id="deposit-withdraw-info-title" className="m-0 text-[18px] font-bold leading-none">
            Statement Info
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            className="flex h-[30px] w-[30px] items-center justify-center border-0 bg-transparent p-0 text-white hover:opacity-80 focus-visible:outline focus-visible:outline-1 focus-visible:outline-white"
            aria-label="Close statement info"
            onClick={onClose}
          >
            <X className="h-[24px] w-[24px] stroke-[2]" aria-hidden="true" />
          </button>
        </header>

        <div className="px-[10px] pb-[31px] pt-[8px]">
          <table className="w-full table-auto border-collapse text-[17px]">
            <thead>
              <tr>
                <th className="h-[42px] border border-[#b7b7b7] bg-[#e2e2e2] text-center font-bold">
                  UTR Number
                </th>
                <th className="h-[42px] border border-[#b7b7b7] bg-[#e2e2e2] text-center font-bold">
                  Image
                </th>
              </tr>
            </thead>
            <tbody>
              {!requestId ? (
                <tr>
                  <td
                    colSpan={2}
                    className="h-[41px] border border-[#b7b7b7] text-center text-[17px]"
                  >
                    No Information Available
                  </td>
                </tr>
              ) : loading ? (
                <tr>
                  <td
                    colSpan={2}
                    className="h-[41px] border border-[#b7b7b7] text-center text-[17px]"
                  >
                    Loading request details...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td
                    colSpan={2}
                    className="h-[41px] border border-[#b7b7b7] text-center text-[17px] text-[#666]"
                  >
                    Unable to load request details
                  </td>
                </tr>
              ) : utrNumber || imageUrl ? (
                <tr>
                  <td className="min-h-[41px] border border-[#b7b7b7] px-[8px] py-[10px] text-center">
                    {utrNumber || '-'}
                  </td>
                  <td className="min-h-[41px] border border-[#b7b7b7] px-[8px] py-[10px] text-center">
                    {imageUrl ? (
                      <a
                        href={imageUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold text-[#0b4d70] underline"
                      >
                        <img
                          src={imageUrl}
                          alt="Deposit withdraw proof"
                          className="mx-auto max-h-[120px] max-w-full object-contain"
                        />
                      </a>
                    ) : (
                      '-'
                    )}
                  </td>
                </tr>
              ) : (
                <tr>
                  <td
                    colSpan={2}
                    className="h-[41px] border border-[#b7b7b7] text-center text-[17px]"
                  >
                    No Information Available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>,
    document.body
  );
}

interface StatementInfoModalProps {
  transaction: Transaction;
  onClose: () => void;
}

const getTransactionEventId = (transaction: Transaction) =>
  transaction.meta?.eventId ||
  transaction.meta?.event_id ||
  transaction.meta?.matchId ||
  transaction.meta?.match_id ||
  transaction.meta?.event?.id ||
  transaction.entityId ||
  '';

const isBetRelatedTransaction = (transaction: Transaction) => {
  if (isCasinoBetTransaction(transaction)) return true;

  const contextText = [transaction.context, transaction.narration, getDescription(transaction)]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  const metaText = transaction.meta ? JSON.stringify(transaction.meta).toLowerCase() : '';
  const eventId = getTransactionEventId(transaction);

  return (
    Boolean(eventId) && /bet|event|market|selection|runner|odds|stake/i.test(contextText + metaText)
  );
};

type StatementDetailItem = Transaction | ProfitLossItem | CasinoRound;

function StatementInfoModal({ transaction, onClose }: StatementInfoModalProps) {
  const modalRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const eventId = getTransactionEventId(transaction);
  const casinoRoundHistoryId = getCasinoRoundHistoryId(transaction);
  const shouldUseCasinoRoundApi = isCasinoBetTransaction(transaction);
  const shouldUseBetApi = isBetRelatedTransaction(transaction);
  const [detailPage, setDetailPage] = useState(1);
  const detailPageSize = 10;

  useEffect(() => {
    setDetailPage(1);
  }, [casinoRoundHistoryId, eventId, transaction.id]);

  const {
    data: transactionData,
    isLoading: isLoadingTransactions,
    isFetching: isFetchingTransactions,
    isError: isTransactionError,
  } = useGetMyTransactionsQuery(
    {
      page: detailPage,
      limit: detailPageSize,
      ...(eventId && { eventId }),
    },
    { skip: shouldUseBetApi }
  );

  const {
    data: betData,
    isLoading: isLoadingBetData,
    isFetching: isFetchingBetData,
    isError: isBetError,
  } = useGetBetHistoryQuery(
    {
      page: detailPage,
      limit: detailPageSize,
      ...(eventId && { eventId }),
      betTime: 'PAST',
    },
    { skip: !shouldUseBetApi || shouldUseCasinoRoundApi }
  );

  const {
    data: casinoRoundData,
    isLoading: isLoadingCasinoRound,
    isFetching: isFetchingCasinoRound,
    isError: isCasinoRoundError,
  } = useGetCasinoRoundHistoryByIdQuery(casinoRoundHistoryId, {
    skip: !shouldUseCasinoRoundApi || !casinoRoundHistoryId,
  });

  const statementInfoRows = shouldUseCasinoRoundApi
    ? (casinoRoundData?.rounds ?? [])
    : shouldUseBetApi
      ? (betData?.bets ?? [])
      : (transactionData?.data ?? []);
  const loading = shouldUseCasinoRoundApi
    ? isLoadingCasinoRound || isFetchingCasinoRound
    : shouldUseBetApi
      ? isLoadingBetData || isFetchingBetData
      : isLoadingTransactions || isFetchingTransactions;
  const isError = shouldUseCasinoRoundApi
    ? isCasinoRoundError
    : shouldUseBetApi
      ? isBetError
      : isTransactionError;
  const totalItems = shouldUseCasinoRoundApi
    ? statementInfoRows.length
    : shouldUseBetApi
      ? (betData?.pagination?.totalItems ?? statementInfoRows.length)
      : (transactionData?.pagination?.totalItems ?? statementInfoRows.length);
  const totalPages = shouldUseCasinoRoundApi
    ? 1
    : shouldUseBetApi
      ? Math.max(1, betData?.pagination?.totalPage ?? 1)
      : Math.max(1, transactionData?.pagination?.totalPage ?? 1);
  const firstEntry = totalItems === 0 ? 0 : (detailPage - 1) * detailPageSize + 1;
  const lastEntry = totalItems === 0 ? 0 : Math.min(detailPage * detailPageSize, totalItems);

  useEffect(() => {
    const previouslyFocusedElement = document.activeElement as HTMLElement | null;
    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !modalRef.current) return;
      const focusableElements = Array.from(
        modalRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
        )
      );
      const firstFocusableElement = focusableElements[0];
      const lastFocusableElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstFocusableElement) {
        event.preventDefault();
        lastFocusableElement?.focus();
      } else if (!event.shiftKey && document.activeElement === lastFocusableElement) {
        event.preventDefault();
        firstFocusableElement?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousBodyOverflow;
      previouslyFocusedElement?.focus();
    };
  }, [onClose]);

  return createPortal(
    <div
      className="statement-info-backdrop fixed inset-0 z-[5000000000000002] flex items-start justify-center bg-black/50 px-2 pt-[29px] max-md:pt-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        ref={modalRef}
        className="statement-info-modal w-[498px] max-w-[calc(100vw-16px)] overflow-hidden rounded-[7px] bg-white font-[Arial,Helvetica,sans-serif] text-[#050505] shadow-[0_1px_2px_rgba(0,0,0,0.25)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="statement-info-title"
      >
        <header className="flex h-[37px] items-center justify-between bg-[#243a48] pl-[14px] pr-[8px] text-white">
          <h2 id="statement-info-title" className="m-0 text-[14px] font-bold leading-[37px]">
            Statement Info
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            className="flex h-[28px] w-[20px] items-center justify-center border-0 bg-transparent p-0 text-white hover:opacity-80 focus-visible:outline focus-visible:outline-1 focus-visible:outline-white"
            aria-label="Close statement info"
            onClick={onClose}
          >
            <X className="h-[20px] w-[20px] stroke-[2]" aria-hidden="true" />
          </button>
        </header>

        <div className="h-[294px] px-[8px] pb-[9px] pt-[8px]">
          <div
            className="statement-info-scroll h-[228px] overflow-x-scroll overflow-y-hidden focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-[-1px] focus-visible:outline-[#243a48]"
            role="region"
            aria-label="Statement bet details"
            tabIndex={0}
          >
            <table className="w-full min-w-max table-auto border-collapse text-[13px]">
              {shouldUseCasinoRoundApi ? <CasinoRoundInfoHeader /> : <BetStatementInfoHeader />}
              <tbody>
                {loading ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <tr key={index}>
                      {Array.from({ length: shouldUseCasinoRoundApi ? 8 : 9 }).map(
                        (__, cellIndex) => (
                          <td
                            key={cellIndex}
                            className="h-[32px] border border-[#aeb0b2] px-[5px] py-0"
                          >
                            <span className="mx-auto block h-[8px] w-[70%] animate-pulse rounded bg-[#d6d6d6]" />
                          </td>
                        )
                      )}
                    </tr>
                  ))
                ) : isError ? (
                  <tr>
                    <td
                      colSpan={shouldUseCasinoRoundApi ? 8 : 9}
                      className="h-[80px] border border-[#aeb0b2] text-center text-[13px] text-[#666]"
                    >
                      Unable to load statement details
                    </td>
                  </tr>
                ) : statementInfoRows.length > 0 ? (
                  statementInfoRows.map((infoTransaction, index) =>
                    shouldUseCasinoRoundApi ? (
                      <CasinoRoundInfoRow
                        key={(infoTransaction as CasinoRound).id || `casino-round-${index}`}
                        round={infoTransaction as CasinoRound}
                      />
                    ) : (
                      <StatementInfoRow
                        key={String(infoTransaction.id || `statement-info-${index}`)}
                        transaction={infoTransaction}
                        statementTransaction={transaction}
                      />
                    )
                  )
                ) : (
                  <tr>
                    <td
                      colSpan={shouldUseCasinoRoundApi ? 8 : 9}
                      className="h-[80px] border border-[#aeb0b2] text-center text-[13px] text-[#666]"
                    >
                      No statement details found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-[8px] flex flex-wrap items-center justify-between gap-2 border-t border-[#e2e2e2] pt-[8px] text-[12px] text-[#333]">
            <span>
              Showing {firstEntry} to {lastEntry} of {totalItems} entries
            </span>
            <div className="flex items-center gap-[4px]">
              <button
                type="button"
                className="h-[24px] min-w-[24px] rounded border border-[#d3d3d3] bg-white px-[6px] text-[11px] font-bold text-[#050505] disabled:cursor-not-allowed disabled:opacity-60"
                onClick={() => setDetailPage((page) => page - 1)}
                disabled={detailPage <= 1}
              >
                «
              </button>
              <span className="min-w-[28px] rounded border border-[#243a48] bg-[#243a48] px-[6px] text-center text-[11px] font-bold text-white">
                {detailPage}
              </span>
              <button
                type="button"
                className="h-[24px] min-w-[24px] rounded border border-[#d3d3d3] bg-white px-[6px] text-[11px] font-bold text-[#050505] disabled:cursor-not-allowed disabled:opacity-60"
                onClick={() => setDetailPage((page) => page + 1)}
                disabled={detailPage >= totalPages}
              >
                »
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>,
    document.body
  );
}

const getMetaText = (transaction: Transaction, ...keys: string[]) => {
  for (const key of keys) {
    const value = transaction.meta?.[key];
    if (value !== undefined && value !== null && String(value).trim()) return String(value);
  }
  return '';
};

const statementInfoHeaderClassName =
  'h-[34px] whitespace-nowrap border border-[#aeb0b2] bg-[#e7e7e7] px-[5px] py-0 text-center text-[14px] font-bold leading-[33px]';

function BetStatementInfoHeader() {
  return (
    <thead>
      <tr>
        {[
          'Selection',
          'Stake',
          'Selection Type',
          'Odds',
          'Requested Odds',
          'Profit',
          'Loss',
          'Bet Place Time',
          'Commission',
        ].map((heading) => (
          <th key={heading} scope="col" className={statementInfoHeaderClassName}>
            {heading}
          </th>
        ))}
      </tr>
    </thead>
  );
}

function CasinoRoundInfoHeader() {
  return (
    <thead>
      <tr>
        {[
          'Game Name',
          'Round ID',
          'Transaction ID',
          'Status',
          'Total Bets',
          'Total Wins',
          'Total Losses',
          'Created At',
        ].map((heading) => (
          <th key={heading} scope="col" className={statementInfoHeaderClassName}>
            {heading}
          </th>
        ))}
      </tr>
    </thead>
  );
}

const casinoRoundCellClassName =
  'h-[32px] whitespace-nowrap border border-[#aeb0b2] px-[5px] py-0 text-center leading-[31px]';

const getCasinoRoundText = (round: CasinoRound, ...keys: string[]) => {
  const source = round as unknown as Record<string, unknown>;

  for (const key of keys) {
    const value = source[key];
    if (value !== undefined && value !== null && String(value).trim()) return String(value);
  }

  return '';
};

function CasinoRoundInfoRow({ round }: { round: CasinoRound }) {
  const gameName =
    round.gameName || round.casinoGame?.name || getCasinoRoundText(round, 'game') || '-';
  const status = getCasinoRoundText(round, 'status') || '-';
  const isWon = status.toLowerCase().includes('won') || status.toLowerCase().includes('win');
  const isLost = status.toLowerCase().includes('lost') || status.toLowerCase().includes('loss');
  const statusClassName = isWon ? 'text-[#0bc90b]' : isLost ? 'text-[#f11616]' : 'text-[#050505]';

  return (
    <tr>
      <td className={casinoRoundCellClassName}>{gameName}</td>
      <td className={casinoRoundCellClassName}>{round.roundId || '-'}</td>
      <td className={casinoRoundCellClassName}>{round.txnId || '-'}</td>
      <td className={`${casinoRoundCellClassName} font-bold ${statusClassName}`}>{status}</td>
      <td className={casinoRoundCellClassName}>
        {formatAmount(round.totalBets ?? round.betAmount ?? 0)}
      </td>
      <td className={`${casinoRoundCellClassName} text-[#0bc90b]`}>
        {formatAmount(round.totalWins ?? round.winAmount ?? 0)}
      </td>
      <td className={`${casinoRoundCellClassName} text-[#f11616]`}>
        {formatAmount(round.totalLosses ?? 0)}
      </td>
      <td className={casinoRoundCellClassName}>
        {formatTimestamp(round.createdAt || round.startTime)}
      </td>
    </tr>
  );
}

const getDetailText = (item: StatementDetailItem, ...keys: string[]) => {
  const source = item as Record<string, unknown>;
  for (const key of keys) {
    const value = source[key];
    if (value !== undefined && value !== null && String(value).trim()) return String(value);
  }
  return '';
};

const getDetailNumber = (item: StatementDetailItem, ...keys: string[]) => {
  const source = item as Record<string, unknown>;

  for (const key of keys) {
    const value = source[key];
    const parsedValue = Number(String(value ?? '').replace(/,/g, ''));
    if (Number.isFinite(parsedValue)) return parsedValue;
  }

  return undefined;
};

const getBetSide = (item: StatementDetailItem) =>
  getDetailText(item, 'betOn', 'selectionType', 'side').toUpperCase() === 'LAY' ? 'LAY' : 'BACK';

const isFancyBet = (item: StatementDetailItem) => {
  const marketText = getDetailText(
    item,
    'marketType',
    'marketCategory',
    'marketName'
  ).toLowerCase();
  return Boolean(getDetailText(item, 'percentage')) || /fancy|session/.test(marketText);
};

const getBetResult = (item: StatementDetailItem, statementTransaction: Transaction) => {
  const detailResult = getDetailText(item, 'result', 'betResult', 'settlementResult', 'status');
  const statementResult = [
    statementTransaction.context,
    statementTransaction.narration,
    statementTransaction.type,
    getDescription(statementTransaction),
  ]
    .filter(Boolean)
    .join(' ');

  const resultText = `${detailResult} ${statementResult}`.toLowerCase();
  if (/\b(won|win|winner|profit|credit)\b/.test(resultText)) return 'WON';
  if (/\b(lost|loss|lose|loser|debit)\b/.test(resultText)) return 'LOST';
  return '';
};

const getBetProfitLossAmount = (item: StatementDetailItem, statementTransaction: Transaction) => {
  const settledPayout = getDetailNumber(item, 'payout', 'pl', 'profitLoss', 'netProfitLoss', 'net');
  if (settledPayout !== undefined) {
    return {
      profit: settledPayout > 0 ? settledPayout : 0,
      loss: settledPayout < 0 ? Math.abs(settledPayout) : 0,
    };
  }

  const stake = getDetailNumber(
    item,
    'matchedAmount',
    'matchedStake',
    'matched',
    'stake',
    'amount'
  );
  if (stake === undefined) return undefined;

  const side = getBetSide(item);
  const result = getBetResult(item, statementTransaction);
  if (!result) return undefined;

  const odds = getDetailNumber(item, 'odds', 'rate', 'userRate', 'matchedOdds');
  const liability = getDetailNumber(item, 'liability', 'risk', 'exposure');
  const explicitProfit = getDetailNumber(
    item,
    'potentialProfit',
    'profit',
    'profitLoss',
    'pl',
    'payout'
  );
  const percentage = getDetailNumber(item, 'percentage');
  const isFancy = isFancyBet(item);
  const profitRate = isFancy && percentage !== undefined ? percentage / 100 : (odds ?? 1) - 1;
  const calculatedProfit = Math.max(0, profitRate) * stake;

  if (result === 'WON') {
    const profit =
      explicitProfit !== undefined
        ? Math.abs(explicitProfit)
        : side === 'LAY'
          ? stake
          : calculatedProfit;
    return { profit, loss: 0 };
  }

  const loss =
    explicitProfit !== undefined
      ? Math.abs(explicitProfit)
      : side === 'BACK'
        ? stake
        : (liability ?? calculatedProfit);
  return { profit: 0, loss };
};

const getDetailTimestamp = (item: StatementDetailItem) => {
  const source = item as Record<string, unknown>;
  const timestamp = source.timestamp ?? source.createdAt ?? source.placedAt ?? source.settledAt;
  return typeof timestamp === 'string' ? timestamp : '';
};

function StatementInfoRow({
  transaction,
  statementTransaction,
}: {
  transaction: StatementDetailItem;
  statementTransaction: Transaction;
}) {
  const isBetItem =
    'betOn' in transaction ||
    'payout' in transaction ||
    'pl' in transaction ||
    'stake' in transaction ||
    'odds' in transaction ||
    'selection' in transaction;
  const selection =
    getDetailText(transaction, 'selectionName', 'selection', 'runnerName', 'marketName') ||
    getDescription(transaction as Transaction);
  const stake =
    getDetailText(transaction, 'stake', 'amount') ||
    formatAmount(
      (transaction as Transaction).amount ?? (transaction as ProfitLossItem).amount ?? 0
    );
  const selectionType = getDetailText(transaction, 'betOn', 'selectionType', 'side') || '-';
  const odds = getDetailText(transaction, 'odds', 'rate') || '-';
  const requestedOdds = getDetailText(transaction, 'requestedOdds', 'requestedRate') || odds;
  const amountValue = Number(
    (transaction as ProfitLossItem).pl ?? (transaction as Transaction).amount ?? 0
  );
  const betProfitLoss = isBetItem
    ? getBetProfitLossAmount(transaction, statementTransaction)
    : undefined;
  const isCredit = isBetItem ? amountValue >= 0 : isCreditTransaction(transaction as Transaction);
  const amount = formatAmount(
    isBetItem ? Math.abs(amountValue) : ((transaction as Transaction).amount ?? 0)
  );
  const profit = betProfitLoss ? formatAmount(betProfitLoss.profit) : isCredit ? amount : '0';
  const loss = betProfitLoss ? formatAmount(betProfitLoss.loss) : isCredit ? '0' : amount;
  const commission = getDetailText(transaction, 'commission') || '-';

  return (
    <tr>
      <td
        className="h-[32px] overflow-hidden text-ellipsis whitespace-nowrap border border-[#aeb0b2] px-[5px] py-0 text-left leading-[31px]"
        title={selection}
      >
        {selection}
      </td>
      <td className="h-[32px] whitespace-nowrap border border-[#aeb0b2] px-[5px] py-0 text-center leading-[31px]">
        {stake}
      </td>
      <td className="h-[32px] whitespace-nowrap border border-[#aeb0b2] px-[5px] py-0 text-center leading-[31px]">
        {selectionType}
      </td>
      <td className="h-[32px] whitespace-nowrap border border-[#aeb0b2] px-[5px] py-0 text-center leading-[31px]">
        {odds}
      </td>
      <td className="h-[32px] whitespace-nowrap border border-[#aeb0b2] px-[5px] py-0 text-center leading-[31px]">
        {requestedOdds}
      </td>
      <td className="h-[32px] whitespace-nowrap border border-[#aeb0b2] px-[5px] py-0 text-center leading-[31px] text-[#0bc90b]">
        {profit}
      </td>
      <td className="h-[32px] whitespace-nowrap border border-[#aeb0b2] px-[5px] py-0 text-center leading-[31px] text-[#f11616]">
        {loss}
      </td>
      <td className="h-[32px] whitespace-nowrap border border-[#aeb0b2] px-[5px] py-0 text-center leading-[31px]">
        {formatTimestamp(getDetailTimestamp(transaction))}
      </td>
      <td className="h-[32px] whitespace-nowrap border border-[#aeb0b2] px-[5px] py-0 text-center leading-[31px]">
        {commission}
      </td>
    </tr>
  );
}

function StatementLoadingRows() {
  const loadingBarClassName = 'block h-2 w-[58%] animate-pulse rounded-[3px] bg-[#d6d6d6] mx-auto';

  return (
    <>
      <tr className="statement-main-row statement-loading-row h-[31px]">
        <td className={tableCellClassName}>
          <span className={`${loadingBarClassName} ml-0 w-[40%]`} />
        </td>
        <td className={tableCellClassName}>
          <span className={loadingBarClassName} />
        </td>
        <td className={tableCellClassName}>
          <span className={loadingBarClassName} />
        </td>
      </tr>
      <tr className="statement-detail-row statement-loading-row h-[31px] bg-[#e7e7e7]">
        <td className={tableCellClassName}>
          <span className={`${loadingBarClassName} ml-0 w-[40%]`} />
        </td>
        <td className={tableCellClassName} colSpan={2}>
          <span className={loadingBarClassName} />
        </td>
      </tr>
    </>
  );
}

export default Account;
