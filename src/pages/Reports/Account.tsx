import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { X } from 'lucide-react';
import { mdiCalendarMonthOutline } from '@mdi/js';
import { useGetDepositWithdrawRequestQuery } from '@/store/api/accountApi';
import { useGetMyTransactionsQuery } from '@/store/api/transactionApi';
import type { Transaction, TransactionsParams } from '@/store/api/transactionApi';
import { formatContextLabel } from '@/utils';

const PAGE_SIZE = 25;

const recordTypeOptions = [
  { label: 'All Sports', value: 'ALL' },
  { label: 'Sports', value: 'Sports' },
  { label: 'Casino', value: 'Casino' },
] as const;

type RecordTypeFilter = (typeof recordTypeOptions)[number]['value'];

interface StatementFilters {
  fromDate: string;
  toDate: string;
  recordType: RecordTypeFilter;
}

const defaultFromDate = dayjs().subtract(7, 'day').format('YYYY-MM-DD');
const defaultToDate = dayjs().format('YYYY-MM-DD');

const createInitialFilters = (): StatementFilters => ({
  fromDate: defaultFromDate,
  toDate: defaultToDate,
  recordType: 'ALL',
});

const toRecordTypeFilter = (value: string): RecordTypeFilter =>
  recordTypeOptions.some((option) => option.value === value) ? (value as RecordTypeFilter) : 'ALL';

const formatStatementDate = (value: string) =>
  value && dayjs(value).isValid() ? dayjs(value).format('DD-MM-YYYY') : '';

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

const fieldClassName = 'flex min-w-0 flex-col gap-[3px] text-[10px] uppercase leading-[14px]';
const controlClassName =
  'h-[34px] w-full rounded-[4px] border border-[#aaa] bg-white px-[8px] text-[14px] normal-case leading-[32px] text-black outline-none focus:border-[#243a48] focus:ring-1 focus:ring-[#243a48]';
const tableCellClassName =
  'h-[33px] border border-[#d9dfe4] px-[5px] py-[4px] text-left align-middle leading-[20px]';
const paginationButtonClassName =
  'rounded-[3px] px-[10px] py-[6px] text-[14px] font-bold text-[#555] hover:bg-[#eee] disabled:cursor-default disabled:text-[#999] disabled:hover:bg-transparent';

function Account() {
  const [draftFilters, setDraftFilters] = useState<StatementFilters>(createInitialFilters);
  const [appliedFilters, setAppliedFilters] = useState<StatementFilters>(createInitialFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
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

    return params;
  }, [appliedFilters, currentPage]);

  const { data, isLoading, isFetching, isError, refetch } = useGetMyTransactionsQuery(queryParams);

  const transactions = data?.data ?? [];
  const totalItems = data?.pagination?.totalItems ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));

  const updateFilter = <Key extends keyof StatementFilters>(
    key: Key,
    value: StatementFilters[Key]
  ) => {
    setDraftFilters((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (currentPage === 1 && JSON.stringify(draftFilters) === JSON.stringify(appliedFilters)) {
      void refetch();
    }
    setCurrentPage(1);
    setAppliedFilters({ ...draftFilters });
  };

  const loading = isLoading || isFetching;

  return (
    <div className="min-h-[calc(100dvh-98px)] bg-[#eee] pb-[12px] font-helvetica text-[12px] text-black">
      <form
        className="mb-[3px] mt-[8px] grid grid-cols-2 items-end gap-x-[10px] gap-y-[10px] border-y border-[#222] bg-white px-[8px] pb-[5px] pt-[5px] lg:mb-[10px] lg:grid-cols-4 lg:gap-x-[24px] lg:px-[5px] lg:pt-[10px]"
        onSubmit={handleSubmit}
      >
        {(['fromDate', 'toDate'] as const).map((field) => (
          <label key={field} className={fieldClassName}>
            <span>{field === 'fromDate' ? 'From Date' : 'To Date'}</span>
            <span className="relative flex h-[34px] items-center justify-between rounded-[4px] border border-[#aaa] bg-white pl-[8px] pr-[14px] text-[14px] normal-case text-black focus-within:ring-1 focus-within:ring-[#243a48]">
              <span>{formatStatementDate(draftFilters[field])}</span>
              <svg
                viewBox="0 0 24 24"
                className="h-[15px] w-[15px] shrink-0 fill-current"
                aria-hidden="true"
              >
                <path d={mdiCalendarMonthOutline} />
              </svg>
              <input
                type="date"
                aria-label={field === 'fromDate' ? 'From Date' : 'To Date'}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                value={draftFilters[field]}
                min={field === 'toDate' ? draftFilters.fromDate : undefined}
                max={field === 'fromDate' ? draftFilters.toDate : undefined}
                onChange={(event) => updateFilter(field, event.target.value)}
                required
              />
            </span>
          </label>
        ))}
        <label className={fieldClassName}>
          <span>Sports</span>
          <select
            className={controlClassName}
            value={draftFilters.recordType}
            onChange={(event) => updateFilter('recordType', toRecordTypeFilter(event.target.value))}
          >
            {recordTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          disabled={loading}
          className="flex h-[34px] items-center justify-center rounded-[4px] bg-[#222] text-[14px] text-white hover:bg-[#333] disabled:cursor-wait disabled:opacity-70"
        >
          Get Statement
        </button>
      </form>
      <section className="bg-white" aria-labelledby="statement-title">
        <h1
          id="statement-title"
          className="m-0 flex h-[28px] items-center bg-[#222] px-[6px] text-[14px] font-bold leading-[21px] text-white"
        >
          Account Statement
        </h1>
        <div
          className="overflow-x-auto px-[8px] pt-[8px] lg:px-0 lg:pt-0"
          tabIndex={0}
          role="region"
          aria-label="Account statement transactions"
        >
          <table className="w-full min-w-[1000px] border-collapse whitespace-nowrap bg-white text-[12px] text-black">
            <colgroup>
              <col className="w-[28px]" />
              <col className="w-[124px]" />
              <col className="w-[48px]" />
              <col className="w-[64px]" />
              <col className="w-[44px]" />
              <col className="w-[60px]" />
              <col />
              <col className="w-[84px]" />
            </colgroup>
            <thead>
              <tr className="h-[29px] bg-[#e4e4e4] text-[11px] font-normal uppercase text-black">
                {['NO', 'DATE', 'TOTAL', 'BALANCE', 'D/C', 'SPORTS', 'DESCRIPTION', 'DETAILS'].map(
                  (title) => (
                    <th
                      key={title}
                      scope="col"
                      className="border border-[#d9dfe4] px-[5px] py-[5px] text-left font-normal leading-[18px]"
                    >
                      {title}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody aria-busy={loading}>
              {loading ? (
                Array.from({ length: 8 }, (_, index) => (
                  <tr key={index}>
                    {Array.from({ length: 8 }, (_, cell) => (
                      <td key={cell} className={tableCellClassName}>
                        <span className="block h-[12px] animate-pulse rounded bg-[#e8ebed] motion-reduce:animate-none" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : transactions.length ? (
                transactions.map((transaction, index) => (
                  <StatementRows
                    key={transaction.id || index}
                    transaction={transaction}
                    rowNumber={(currentPage - 1) * PAGE_SIZE + index + 1}
                    onOpenStatementInfo={() => {
                      const casino = isCasinoBetTransaction(transaction);
                      const id = casino
                        ? getCasinoRoundHistoryId(transaction)
                        : getTransactionEventId(transaction);
                      navigate(
                        `/reports/my-bets/${casino ? '99993' : 'sports'}/${encodeURIComponent(id)}`,
                        {
                          state: { transaction },
                        }
                      );
                    }}
                    onOpenDepositWithdrawInfo={() => setDepositWithdrawInfo(transaction)}
                  />
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="h-[50px] border border-[#d9dfe4] text-center text-[#666]"
                  >
                    {isError
                      ? 'Unable to load account statement. Please try again.'
                      : 'No account statement found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <nav
          className="flex min-h-[60px] items-center justify-end gap-[6px] px-[12px] py-[10px]"
          aria-label="Account statement pagination"
        >
          <button
            type="button"
            className={paginationButtonClassName}
            disabled={currentPage <= 1 || loading}
            onClick={() => setCurrentPage((page) => page - 1)}
          >
            « Previous
          </button>
          <button
            type="button"
            aria-current="page"
            className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[#252c32] text-[14px] font-bold text-white shadow-[0_2px_5px_#0005]"
          >
            {currentPage}
          </button>
          <button
            type="button"
            className={paginationButtonClassName}
            disabled={currentPage >= totalPages || loading}
            onClick={() => setCurrentPage((page) => page + 1)}
          >
            Next »
          </button>
        </nav>
      </section>
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
  rowNumber: number;
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
  rowNumber,
  onOpenStatementInfo,
  onOpenDepositWithdrawInfo,
}: StatementRowsProps) {
  const isCredit = isCreditTransaction(transaction);
  const description = getDescription(transaction);
  const isDepositWithdraw = isDepositWithdrawTransaction(transaction);
  const onDetails =
    isDepositWithdraw && canOpenDepositWithdrawInfo(transaction)
      ? onOpenDepositWithdrawInfo
      : isBetRelatedTransaction(transaction)
        ? onOpenStatementInfo
        : undefined;
  const sport = transaction.meta?.sportName ?? transaction.meta?.sport ?? '';
  const timestamp =
    transaction.timestamp && dayjs(transaction.timestamp).isValid()
      ? dayjs(transaction.timestamp).format('DD/MM/YYYY HH:mm:ss')
      : '-';
  return (
    <tr>
      <td className={tableCellClassName}>{rowNumber}</td>
      <td className={tableCellClassName}>{timestamp}</td>
      <td
        className={
          tableCellClassName +
          (isCredit ? ' font-bold text-[#00c900]' : ' font-bold text-[#f11616]')
        }
      >
        {formatBalance(Math.abs(Number(transaction.amount)))}
      </td>
      <td className={tableCellClassName}>{formatBalance(transaction.availableBalance)}</td>
      <td className={tableCellClassName}>{isCredit ? 'Credit' : 'Debit'}</td>
      <td className={tableCellClassName}>
        {typeof sport === 'string' || typeof sport === 'number' ? sport : ''}
      </td>
      <td className={tableCellClassName} title={transaction.remark || undefined}>
        {description}
      </td>
      <td className={tableCellClassName}>
        {onDetails && (
          <button
            type="button"
            onClick={onDetails}
            aria-label={'View statement report for ' + description}
            className="rounded-[1px] bg-[#222] px-[6px] py-[2px] text-[11px] font-bold uppercase leading-[16px] text-white hover:bg-[#444]"
          >
            {isDepositWithdraw ? 'Details' : 'Show Bet'}
          </button>
        )}
      </td>
    </tr>
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

export default Account;
