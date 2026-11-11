import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { useGetBetHistoryQuery } from '@/store/api/betReportApi';
import { useGetCasinoRoundHistoryByIdQuery } from '@/store/api/casinoApi';
import type { Transaction } from '@/store/api/transactionApi';

const PAGE_SIZE = 25;
const paginationButtonClassName =
  'rounded-[3px] px-[10px] py-[6px] text-[14px] font-bold text-[#555] hover:bg-[#eee] disabled:cursor-default disabled:text-[#999] disabled:hover:bg-transparent';

const sportsColumns = [
  'NO',
  'RUNNER',
  'RATE',
  'STAKE',
  'COMM IN',
  'COMM OUT',
  'TOTAL',
  'DATE/TIME',
];
const casinoColumns = [
  'NO',
  'RUNNER NAME',
  'ROUND ID',
  'ODDS',
  'STAKES',
  'RESULT',
  'STATUS',
  'DATE/TIME',
];

// Preserve zero values while leaving unavailable API fields blank, as in the reference.
const field = (item: object, ...keys: string[]): string => {
  const record = item as Record<string, unknown>;
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string' || typeof value === 'number') return String(value);
  }
  return '';
};
const timestamp = (value: string) =>
  value && dayjs(value).isValid() ? dayjs(value).format('DD/MM/YYYY HH:mm:ss') : '';

export default function StatementBetDetails() {
  const { sportId, referenceId = '' } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const transaction = (location.state as { transaction?: Transaction } | null)?.transaction;
  const casino = sportId === '99993' || sportId === 'casino';
  const [page, setPage] = useState(1);
  useEffect(() => {
    setPage(1);
  }, [sportId, referenceId]);

  const sportsQuery = useGetBetHistoryQuery(
    { eventId: referenceId, betTime: 'PAST', page, limit: PAGE_SIZE },
    { skip: casino || !referenceId }
  );
  const casinoQuery = useGetCasinoRoundHistoryByIdQuery(referenceId, {
    skip: !casino || !referenceId,
  });
  const query = casino ? casinoQuery : sportsQuery;
  const loading = query.isLoading || query.isFetching;
  const casinoRows = casinoQuery.currentData?.rounds ?? [];
  const rows = casino
    ? casinoRows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
    : (sportsQuery.currentData?.bets ?? []);
  const totalItems = casino
    ? casinoRows.length
    : (sportsQuery.data?.pagination?.totalItems ?? rows.length);
  const totalPages = Math.max(
    1,
    casino
      ? Math.ceil(totalItems / PAGE_SIZE)
      : (sportsQuery.data?.pagination?.totalPage ?? Math.ceil(totalItems / PAGE_SIZE))
  );
  const headings = casino ? casinoColumns : sportsColumns;

  return (
    <section
      className="relative mt-[10px] min-h-[calc(100dvh-145px)] bg-[#eee] font-[Arial,Helvetica,sans-serif] text-[12px] text-black"
      aria-label={casino ? 'Casino bet statement' : 'Sports bet statement'}
    >
      <header className="flex h-[34px] items-center gap-[5px] bg-[#222] px-[8px] text-white">
        <button
          type="button"
          onClick={() => (transaction ? navigate(-1) : navigate('/account-statement'))}
          className="h-[24px] rounded-[4px] bg-[linear-gradient(#528ad6,#00cbed)] px-[12px] text-[14px] font-bold text-black hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
        >
          Back
        </button>
        <h1 className="m-0 text-[14px] font-bold">My Bets</h1>
      </header>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] table-fixed border-collapse text-left">
          <colgroup>
            {(casino
              ? [5.3, 18.4, 12.8, 8.4, 10.5, 10.5, 10.4, 23.7]
              : [6.6, 13.9, 9.4, 11.1, 14.3, 17.3, 11, 16.4]
            ).map((width, index) => (
              <col key={index} style={{ width: `${width}%` }} />
            ))}
          </colgroup>
          <thead>
            <tr className="h-[28px] bg-[#e4e4e4]">
              {headings.map((heading) => (
                <th key={heading} scope="col" className="px-[7px] py-0 font-normal">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody aria-busy={loading}>
            {!loading &&
              !query.isError &&
              rows.map((row, index) => {
                const side = field(row, 'betOn', 'side', 'selectionType', 'betType')
                  .trim()
                  .toUpperCase();
                const result = field(row, 'status', 'result').trim().toUpperCase();
                const isBlueRow = casino
                  ? ['WIN', 'WON', 'WINNER'].includes(result)
                  : side === 'BACK';
                const isPinkRow = casino
                  ? ['LOSS', 'LOST', 'LOSE', 'LOSER'].includes(result)
                  : side === 'LAY';
                const cells = casino
                  ? [
                      field(row, 'runnerName', 'gameName', 'game'),
                      field(row, 'roundId'),
                      field(row, 'odds', 'rate'),
                      field(row, 'totalBets', 'betAmount', 'stake'),
                      field(row, 'result', 'totalWins', 'winAmount'),
                      field(row, 'status'),
                    ]
                  : [
                      field(row, 'runnerName', 'selectionName', 'selection', 'marketName'),
                      field(row, 'rate', 'odds'),
                      field(row, 'stake', 'amount'),
                      field(row, 'commissionIn', 'commIn'),
                      field(row, 'commissionOut', 'commOut', 'commission'),
                      field(row, 'pl', 'profitLoss', 'payout'),
                    ];
                return (
                  <tr
                    key={field(row, 'id') || index}
                    className={`h-[28px] ${isPinkRow ? 'bg-[#faa9bd]' : isBlueRow ? 'bg-[#a5d6f5]' : 'bg-white'}`}
                  >
                    <td className="px-[7px]">{(page - 1) * PAGE_SIZE + index + 1}</td>
                    {cells.map((value, cellIndex) => (
                      <td key={cellIndex} className="break-words px-[7px] py-[4px]">
                        {value}
                      </td>
                    ))}
                    <td className="whitespace-nowrap px-[7px]">
                      {timestamp(field(row, 'createdAt', 'placedAt', 'startTime', 'timestamp'))}
                    </td>
                  </tr>
                );
              })}
            {!loading && (query.isError || rows.length === 0) && (
              <tr>
                <td
                  colSpan={8}
                  className="h-[35px] border border-[#d9dfe4] bg-white px-[7px] text-center text-[#666]"
                >
                  {query.isError ? (
                    <span>
                      Unable to load bet details.{' '}
                      <button
                        type="button"
                        className="underline"
                        onClick={() => void query.refetch()}
                      >
                        Retry
                      </button>
                    </span>
                  ) : (
                    'No bet details found'
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {loading && (
        <div
          role="status"
          className="fixed left-1/2 top-[38%] z-50 flex h-[80px] w-[238px] -translate-x-1/2 flex-col items-center justify-center gap-[6px] rounded-[11px] bg-white text-[#16446a] shadow-[0_5px_12px_#0006]"
        >
          <span
            className="h-[26px] w-[26px] animate-spin rounded-full border-[6px] border-[#3e5260] border-l-[#f6b718] motion-reduce:animate-none"
            aria-hidden="true"
          />
          Loading...
        </div>
      )}
      {totalPages > 1 && (
        <nav
          aria-label="Bet details pagination"
          className="flex min-h-[60px] items-center justify-end gap-[6px] bg-white px-[12px] py-[10px]"
        >
          <button
            type="button"
            disabled={page === 1 || loading || query.isError}
            onClick={() => setPage((current) => current - 1)}
            className={paginationButtonClassName}
          >
            ? Previous
          </button>
          <button
            type="button"
            aria-current="page"
            aria-label={`Page ${page}`}
            className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[#252c32] text-[14px] font-bold text-white shadow-[0_2px_5px_#0005]"
          >
            {page}
          </button>
          <button
            type="button"
            disabled={page >= totalPages || loading || query.isError}
            onClick={() => setPage((current) => current + 1)}
            className={paginationButtonClassName}
          >
            Next ?
          </button>
        </nav>
      )}
    </section>
  );
}
