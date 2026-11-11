import { useState } from 'react';
import dayjs from 'dayjs';
import { useIsAuthenticated } from '@/hooks';
import { useGetBetHistoryQuery, type ProfitLossItem } from '@/store/api/betReportApi';

const PAGE_SIZE = 25;
const headers = [
  'BET ID',
  'EVENT',
  'MARKET TYPE',
  'SELECTION',
  'TYPE',
  'ODDS REQ.',
  'STAKE',
  'PLACE TIME',
  'MATCHED TIME',
];
const cellClassName =
  'h-[33px] border border-[#d9dfe4] px-[5px] py-[4px] text-left align-middle leading-[20px]';
const timestamp = (value: unknown) => {
  if (!value || typeof value !== 'string' || !dayjs(value).isValid()) return '-';
  return dayjs(value).format('DD/MM/YYYY HH:mm:ss');
};

function BetRow({ bet }: { bet: ProfitLossItem }) {
  const eventName =
    bet.eventName || (typeof bet.event === 'object' ? bet.event?.name : bet.event) || '-';
  const placeTime = timestamp(bet.placedAt || bet.createdAt);
  const values = [
    bet.id ?? bet.betId ?? '-',
    eventName,
    bet.marketName || bet.marketType || '-',
    bet.selection || bet.selectionName || bet.runnerName || '-',
    bet.betOn || '-',
    bet.requestedOdds ?? bet.odds ?? bet.rate ?? '-',
    bet.amount ?? bet.stake ?? '-',
    placeTime,
    placeTime,
  ];
  return (
    <tr
      className={
        bet.betOn === 'BACK' ? 'bg-[#d7e8f4]' : bet.betOn === 'LAY' ? 'bg-[#f6e6ea]' : 'bg-white'
      }
    >
      {values.map((value, index) => (
        <td key={index} className={cellClassName}>
          {value}
        </td>
      ))}
    </tr>
  );
}

function MyBetsPage() {
  const [page, setPage] = useState(1);
  const isAuthenticated = useIsAuthenticated();
  const { data, isLoading, isFetching, isError } = useGetBetHistoryQuery(
    { page, limit: PAGE_SIZE, betTime: 'CURRENT' },
    { skip: !isAuthenticated, pollingInterval: 15000 }
  );
  const bets = data?.bets ?? [];
  const totalPages = Math.max(
    1,
    data?.pagination?.totalPage ?? Math.ceil((data?.pagination?.totalItems ?? 0) / PAGE_SIZE)
  );
  const loading = isLoading || isFetching;
  const buttonClassName =
    'rounded-[3px] px-[10px] py-[6px] text-[14px] font-bold text-[#555] hover:bg-[#eee] disabled:cursor-default disabled:text-[#999] disabled:hover:bg-transparent';
  return (
    <section
      className="mt-[5px] lg:mt-[8px] min-h-[calc(100dvh-98px)] bg-[#eee] font-helvetica text-[12px] text-black"
      aria-labelledby="unsettled-bets-title"
    >
      <h1
        id="unsettled-bets-title"
        className="m-0 flex h-[28px] items-center bg-[#222] px-[6px] text-[14px] font-bold leading-[21px] text-white"
      >
        Unsettled Bets
      </h1>
      <div className="bg-white">
        <div
          className="overflow-x-auto px-[8px] pt-[8px] lg:px-0 lg:pt-0"
          role="region"
          aria-label="Unsettled bets transactions"
          tabIndex={0}
        >
          <table className="w-full min-w-[586px] border-collapse whitespace-nowrap text-[12px]">
            <thead>
              <tr className="h-[29px] bg-[#e4e4e4] text-[11px] uppercase">
                {headers.map((header) => (
                  <th
                    key={header}
                    scope="col"
                    className="border border-[#d9dfe4] px-[5px] py-[5px] text-left font-normal leading-[18px]"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody aria-busy={loading}>
              {isLoading ? (
                Array.from({ length: 5 }, (_, index) => (
                  <tr key={index}>
                    {headers.map((header) => (
                      <td key={header} className={cellClassName}>
                        <span className="block h-[12px] animate-pulse rounded bg-[#e8ebed] motion-reduce:animate-none" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : bets.length ? (
                bets.map((bet, index) => <BetRow key={bet.id || index} bet={bet} />)
              ) : (
                <tr>
                  <td
                    colSpan={9}
                    className={
                      isError
                        ? 'border border-[#d9dfe4] p-2 text-center text-[#666]'
                        : 'h-0 border-0 p-0 leading-none'
                    }
                  >
                    {isError ? (
                      'Unable to load unsettled bets. Please try again.'
                    ) : (
                      <span className="sr-only">No unsettled bets found</span>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <nav
          className="flex min-h-[68px] items-center justify-end gap-[6px] px-[12px] py-[10px]"
          aria-label="Unsettled bets pagination"
        >
          <button
            type="button"
            className={buttonClassName}
            disabled={page <= 1 || loading}
            onClick={() => setPage((value) => value - 1)}
          >
            « Previous
          </button>
          <button
            type="button"
            aria-current="page"
            className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[#252c32] text-[14px] font-bold text-white shadow-[0_2px_5px_#0005]"
          >
            {page}
          </button>
          <button
            type="button"
            className={buttonClassName}
            disabled={page >= totalPages || loading}
            onClick={() => setPage((value) => value + 1)}
          >
            Next »
          </button>
        </nav>
      </div>
    </section>
  );
}

export default MyBetsPage;
