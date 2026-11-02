import { FormEvent, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { CalendarDays, Download } from 'lucide-react';
import { Icons } from '@/utils/icons';
import { useClipboard } from '@/hooks';
import { useGetCasinoProvidersQuery, useGetCasinoRoundHistoryQuery } from '@/store/api/casinoApi';
import type { CasinoRound, CasinoRoundHistoryPayload } from '@/types/casino';

const PAGE_SIZE = 25;

const statusOptions = [
  { label: 'All', value: 'ALL' },
  { label: 'Won', value: 'Won' },
  { label: 'Lost', value: 'Lost' },
  { label: 'Rollback', value: 'Rollback' },
  { label: 'Cancelled', value: 'Cancelled' },
  { label: 'Voided', value: 'Voided' },
  // { label: 'Pending', value: 'PENDING' },
];

interface CasinoBetFilters {
  fromDate: string;
  toDate: string;
  provider: string;
  status: string;
  search: string;
}

const createInitialFilters = (): CasinoBetFilters => ({
  fromDate: dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
  toDate: dayjs().format('YYYY-MM-DD'),
  provider: 'ALL',
  status: 'ALL',
  search: '',
});

const fieldClassName =
  'statement-field flex min-w-0 flex-col gap-[2px] leading-[15px] [&>span:first-child]:h-[15px]';
const controlClassName =
  'h-[34px] w-full rounded-[4px] border border-[#aeb3b7] bg-white px-[14px] font-[Arial,Helvetica,sans-serif] text-[14px] leading-[32px] text-[#090909] outline-none focus:border-[#283f50] focus:shadow-[0_0_0_1px_rgba(40,63,80,0.12)]';
const tableCellClassName =
  'h-[31px] border border-[#bfc1c3] px-[5px] py-0 align-middle leading-[30px]';
const tableHeadClassName =
  'h-[28px] border border-[#bfc1c3] bg-[#0b4d70] px-[5px] py-0 text-center text-[12px] font-bold leading-[27px] text-white';
const paginationButtonClassName =
  'h-[29px] min-w-[21px] border border-[#d3d3d3] bg-white px-[7px] font-[Arial,Helvetica,sans-serif] text-[11px] font-bold text-[#050505]';

const formatStatementDate = (value: string) =>
  value && dayjs(value).isValid() ? dayjs(value).format('DD/MM/YYYY') : '';

const formatTimestamp = (value?: string | null) => {
  if (!value || !dayjs(value).isValid()) return '-';
  return dayjs(value).format('DD/MM/YYYY HH:mm');
};

const formatAmount = (value?: string | number | null) => {
  const amount = Number(value);
  return Number.isFinite(amount) ? amount.toFixed(2) : '-';
};

const getRoundValue = (round: CasinoRound, ...keys: string[]) => {
  const source = round as unknown as Record<string, unknown>;

  for (const key of keys) {
    const value = source[key];
    if (value !== undefined && value !== null && String(value).trim()) return String(value);
  }

  return '';
};

const getBetAmount = (round: CasinoRound) =>
  Number(getRoundValue(round, 'totalBets', 'betAmount', 'stake', 'amount') || 0);

const getWinAmount = (round: CasinoRound) =>
  Number(getRoundValue(round, 'totalWins', 'winAmount', 'winningAmount', 'payout') || 0);

const getProfitLoss = (round: CasinoRound) => getWinAmount(round) - getBetAmount(round);

const escapeCsvCell = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`;

function CasinoBetHistory() {
  const { copy } = useClipboard();
  const [draftFilters, setDraftFilters] = useState<CasinoBetFilters>(createInitialFilters);
  const [appliedFilters, setAppliedFilters] = useState<CasinoBetFilters>(createInitialFilters);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: providersData } = useGetCasinoProvidersQuery();

  const queryParams = useMemo<CasinoRoundHistoryPayload>(() => {
    const params: CasinoRoundHistoryPayload = {
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
    if (appliedFilters.provider !== 'ALL') params.provider = appliedFilters.provider;
    if (appliedFilters.status !== 'ALL') params.status = appliedFilters.status;
    if (appliedFilters.search.trim()) params.search = appliedFilters.search.trim();

    return params;
  }, [appliedFilters, currentPage]);

  const { data, isLoading, isFetching } = useGetCasinoRoundHistoryQuery(queryParams);

  const rounds = data?.rounds ?? [];
  const totalItems = data?.pagination?.totalItems ?? 0;
  const totalPages = Math.max(1, data?.pagination?.totalPage ?? Math.ceil(totalItems / PAGE_SIZE));
  const firstEntry = totalItems === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const lastEntry = totalItems === 0 ? 0 : Math.min(currentPage * PAGE_SIZE, totalItems);
  const loading = isLoading || isFetching;

  const updateFilter = <Key extends keyof CasinoBetFilters>(
    key: Key,
    value: CasinoBetFilters[Key]
  ) => {
    setDraftFilters((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCurrentPage(1);
    setAppliedFilters({ ...draftFilters });
  };

  const handleDownload = () => {
    const header = [
      'Game Name',
      'Round ID',
      'Transaction ID',
      'Bet Amount',
      'Win Amount',
      'P/L',
      'Status',
      'Date/Time',
    ];
    const rows = rounds.map((round) => [
      getRoundValue(round, 'gameName', 'game'),
      getRoundValue(round, 'gameId', 'roundId', 'id'),
      getRoundValue(round, 'txnId', 'transactionId'),
      formatAmount(getBetAmount(round)),
      formatAmount(getWinAmount(round)),
      formatAmount(getProfitLoss(round)),
      round.status,
      formatTimestamp(getRoundValue(round, 'createdAt', 'startTime')),
    ]);
    const csv = [header, ...rows].map((row) => row.map(escapeCsvCell).join(',')).join('\n');
    const file = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = `casino-bet-history-${dayjs().format('YYYY-MM-DD')}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="casino-bet-history-page pb-2 font-[Arial,Helvetica,sans-serif] text-[12px] text-[#050505] max-md:min-h-[calc(100vh-95px)]">
      <form
        className="statement-filter-panel border-b border-[#222] bg-white px-[11px] pb-[13px] pt-[12px] max-md:p-[10px_8px]"
        onSubmit={handleSubmit}
      >
        <div className="statement-filter-grid grid grid-cols-2 gap-x-2 gap-y-[7px]">
          <label className={fieldClassName}>
            <span>From Date</span>
            <span className="statement-date-control relative flex h-[34px] w-full items-center justify-between overflow-hidden rounded-[4px] border border-[#aeb3b7] bg-white py-0 pl-[14px] pr-[12px] font-[Arial,Helvetica,sans-serif] text-[14px] leading-[32px] text-[#090909] outline-none focus-within:border-[#283f50] focus-within:shadow-[0_0_0_1px_rgba(40,63,80,0.12)]">
              <span>{formatStatementDate(draftFilters.fromDate)}</span>
              <CalendarDays className="h-[14px] w-[14px] shrink-0 stroke-[2.5]" />
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
              <CalendarDays className="h-[14px] w-[14px] shrink-0 stroke-[2.5]" />
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
            <span>Provider</span>
            <select
              className={`${controlClassName} cursor-pointer`}
              value={draftFilters.provider}
              onChange={(event) => updateFilter('provider', event.target.value)}
            >
              <option value="ALL">All</option>
              {(providersData?.providers ?? []).map((provider) => (
                <option key={provider.provider} value={provider.provider}>
                  {provider.provider}
                </option>
              ))}
            </select>
          </label>

          <label className={fieldClassName}>
            <span>Status</span>
            <select
              className={`statement-muted-control ${controlClassName} cursor-pointer bg-[#e3e6e9]`}
              value={draftFilters.status}
              onChange={(event) => updateFilter('status', event.target.value)}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className={`${fieldClassName} col-span-2`}>
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
            aria-label="Download casino bet history"
            title="Download casino bet history"
            onClick={handleDownload}
            disabled={rounds.length === 0}
          >
            <Download className="h-[18px] w-[18px] stroke-[3]" />
          </button>
        </div>
      </form>

      <section
        className="statement-section mt-[10px] bg-white"
        aria-labelledby="casino-history-title"
      >
        <h1
          id="casino-history-title"
          className="m-0 flex h-[29px] items-center bg-[#222] px-[6px] text-[14px] font-bold leading-[29px] text-white"
        >
          Casino Bet History
        </h1>

        <div className="statement-table-area px-[10px] pb-0 pt-2 max-md:px-[8px]">
          <div className="statement-table-scroll overflow-x-auto rounded-[5px]">
            <table className="statement-table w-full table-auto border-collapse bg-white text-[12px] text-[#050505]">
              <thead>
                <tr>
                  {[
                    'GAME NAME',
                    'ROUND ID',
                    'TRANSACTION ID',
                    'BET AMOUNT',
                    'WIN AMOUNT',
                    'P/L',
                    'STATUS',
                    'DATE/TIME',
                  ].map((heading) => (
                    <th key={heading} scope="col" className={tableHeadClassName}>
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody aria-busy={loading}>
                {loading ? (
                  Array.from({ length: 7 }).map((_, index) => <CasinoLoadingRow key={index} />)
                ) : rounds.length > 0 ? (
                  rounds.map((round, index) => (
                    <CasinoHistoryRow
                      key={round.id || `${round.startTime}-${index}`}
                      round={round}
                      onCopy={copy}
                    />
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={8}
                      className="h-[62px] border border-[#bfc1c3] text-center text-[#666]"
                    >
                      No casino bet history found
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

            <nav className="flex items-stretch" aria-label="Casino bet history pagination">
              {currentPage > 1 && (
                <button
                  className={`${paginationButtonClassName} rounded-l-[4px]`}
                  type="button"
                  onClick={() => setCurrentPage((page) => page - 1)}
                >
                  Previous
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
                  Next
                </button>
              )}
            </nav>
          </div>
        </div>
      </section>
    </div>
  );
}

function CasinoHistoryRow({
  round,
  onCopy,
}: {
  round: CasinoRound;
  onCopy: (value: string) => void;
}) {
  const gameName = getRoundValue(round, 'gameName', 'game') || '-';
  const roundId = getRoundValue(round, 'gameId', 'roundId', 'id') || '-';
  const transactionId = getRoundValue(round, 'txnId', 'transactionId') || '-';
  const betAmount = getBetAmount(round);
  const winAmount = getWinAmount(round);
  const profitLoss = getProfitLoss(round);
  const status = String(round.status ?? '-');
  const statusClassName =
    status.toLowerCase() === 'won'
      ? 'text-[#0bc90b]'
      : status.toLowerCase() === 'lost'
        ? 'text-[#f11616]'
        : 'text-[#050505]';

  return (
    <tr className="h-[31px] odd:bg-white even:bg-[#e7e7e7]">
      <td
        className={`${tableCellClassName} overflow-hidden text-ellipsis whitespace-nowrap`}
        title={gameName}
      >
        {gameName}
      </td>
      <td
        className={`${tableCellClassName} overflow-hidden text-ellipsis whitespace-nowrap text-center`}
        title={roundId}
      >
        {roundId}
      </td>
      <td className={`${tableCellClassName} text-center`}>
        <span className="inline-flex max-w-full items-center justify-center gap-x-2">
          <span className="truncate" title={transactionId}>
            {transactionId}
          </span>
          {transactionId !== '-' && (
            <button
              type="button"
              aria-label="Copy transaction ID"
              className="shrink-0 text-[#243a48]"
              onClick={() => onCopy(transactionId)}
            >
              <Icons.copy />
            </button>
          )}
        </span>
      </td>
      <td className={`${tableCellClassName} text-center font-bold`}>{formatAmount(betAmount)}</td>
      <td className={`${tableCellClassName} text-center font-bold`}>{formatAmount(winAmount)}</td>
      <td
        className={`${tableCellClassName} text-center font-bold ${
          profitLoss > 0 ? 'text-[#0bc90b]' : profitLoss < 0 ? 'text-[#f11616]' : ''
        }`}
      >
        {profitLoss === 0 ? '-' : formatAmount(profitLoss)}
      </td>
      <td className={`${tableCellClassName} text-center font-bold uppercase ${statusClassName}`}>
        {status}
      </td>
      <td className={`${tableCellClassName} text-center`}>
        {formatTimestamp(getRoundValue(round, 'createdAt', 'startTime'))}
      </td>
    </tr>
  );
}

function CasinoLoadingRow() {
  const loadingBarClassName = 'mx-auto block h-2 w-[62%] animate-pulse rounded-[3px] bg-[#d6d6d6]';

  return (
    <tr className="h-[31px]">
      {Array.from({ length: 8 }).map((_, index) => (
        <td key={index} className={tableCellClassName}>
          <span className={loadingBarClassName} />
        </td>
      ))}
    </tr>
  );
}

export default CasinoBetHistory;
