import { FormEvent, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { Download } from 'lucide-react';
import { Icons } from '@/utils/icons';
import { useClipboard } from '@/hooks';
import { useGetProfitLossBySportsQuery } from '@/store/api/betReportApi';
import { useGetCasinoRoundHistoryQuery } from '@/store/api/casinoApi';
import ReportDateField from '@/pages/ProfitLoss/components/ReportDateField';
import ProfitLossAmount from '@/pages/ProfitLoss/components/ProfitLossAmount';
import ReportPagination from '@/pages/ProfitLoss/components/ReportPagination';
import type { ProfitLossFilters, ProfitLossSportGroup } from '@/pages/ProfitLoss/types';
import {
  downloadCsv,
  formatTotalProfitLoss,
} from '@/pages/ProfitLoss/profitLossUtils';
import type { CasinoRound, CasinoRoundHistoryPayload } from '@/types/casino';

const createInitialFilters = (): ProfitLossFilters => ({
  fromDate: dayjs().subtract(2, 'day').format('YYYY-MM-DD'),
  toDate: dayjs().format('YYYY-MM-DD'),
  search: '',
});

const searchControlClassName =
  'h-[35px] w-full rounded-[4px] border border-[#aeb3b7] bg-white px-[10px] font-[Arial,Helvetica,sans-serif] text-[14px] text-[#090909] outline-none placeholder:text-[#667080] focus:border-[#283f50] focus:shadow-[0_0_0_1px_rgba(40,63,80,0.12)]';

const toNumber = (value: unknown): number | undefined => {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : undefined;
};

const getRoundValue = (round: CasinoRound, ...keys: string[]) => {
  const source = round as unknown as Record<string, unknown>;

  for (const key of keys) {
    const value = source[key];
    if (value !== undefined && value !== null && String(value).trim()) return String(value);
  }

  return '';
};

const getCasinoBetAmount = (round: CasinoRound) =>
  Number(getRoundValue(round, 'totalBets', 'betAmount', 'stake', 'amount') || 0);

const getCasinoWinAmount = (round: CasinoRound) =>
  Number(getRoundValue(round, 'totalWins', 'winAmount', 'winningAmount', 'payout') || 0);

const getCasinoRoundId = (round: CasinoRound) =>
  getRoundValue(round, 'gameId', 'roundId', 'id') || '-';

const getCasinoGameName = (round: CasinoRound) =>
  getRoundValue(round, 'gameName', 'game') || 'Casino Game';

const getCasinoTransactionId = (round: CasinoRound) =>
  getRoundValue(round, 'txnId', 'transactionId') || '-';

const getCasinoProfitLoss = (round: CasinoRound) => getCasinoWinAmount(round) - getCasinoBetAmount(round);

const formatCasinoTimestamp = (value: string) =>
  value && dayjs(value).isValid() ? dayjs(value).format('DD/MM/YYYY HH:mm') : '-';

const getSportMeta = (sport: string) => {
  const normalizedSport = sport.trim() || 'Other';
  const lowerSport = normalizedSport.toLowerCase();
  const label =
    lowerSport === 'football' || lowerSport === 'soccer' ? 'SOCCER' : normalizedSport.toUpperCase();

  return {
    id: label.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'other',
    label,
    apiSport: lowerSport === 'football' ? 'Soccer' : normalizedSport,
  };
};

function BetProfitLoss() {
  const navigate = useNavigate();
  const { copy } = useClipboard();
  const [draftFilters, setDraftFilters] = useState<ProfitLossFilters>(createInitialFilters);
  const [appliedFilters, setAppliedFilters] = useState<ProfitLossFilters>(createInitialFilters);
  const [showCasinoReport, setShowCasinoReport] = useState(false);
  const [casinoCurrentPage, setCasinoCurrentPage] = useState(1);
  const [casinoPageSize, setCasinoPageSize] = useState(10);

  const startDate = dayjs(appliedFilters.fromDate);
  const endDate = dayjs(appliedFilters.toDate);
  const commonQuery = {
    page: 1,
    limit: 1000,
    ...(startDate.isValid() && { fromDate: startDate.startOf('day').toISOString() }),
    ...(endDate.isValid() && { toDate: endDate.endOf('day').toISOString() }),
  };

  const sportsProfitLossQuery = useGetProfitLossBySportsQuery(commonQuery);
  const casinoQueryParams = useMemo<CasinoRoundHistoryPayload>(
    () => ({
      page: casinoCurrentPage,
      limit: casinoPageSize,
      ...(startDate.isValid() && { fromDate: startDate.startOf('day').toISOString() }),
      ...(endDate.isValid() && { toDate: endDate.endOf('day').toISOString() }),
    }),
    [casinoCurrentPage, casinoPageSize, endDate, startDate]
  );
  const casinoRoundHistoryQuery = useGetCasinoRoundHistoryQuery(casinoQueryParams, {
    skip: !showCasinoReport,
  });

  const apiGroups = useMemo<ProfitLossSportGroup[]>(() => {
    return (sportsProfitLossQuery.data?.data ?? []).flatMap((sportProfitLoss) => {
      const sport = getSportMeta(sportProfitLoss.sport);
      const profitLoss = toNumber(sportProfitLoss.profitLoss);
      if (profitLoss === undefined) return [];

      return [
        {
          ...sport,
          profitLoss,
          bets: [],
        },
      ];
    });
  }, [sportsProfitLossQuery.data]);

  const anyQueryLoading = sportsProfitLossQuery.isLoading || sportsProfitLossQuery.isFetching;
  const searchTerm = appliedFilters.search.trim().toLowerCase();
  const sportGroups = useMemo(() => {
    if (!searchTerm) return apiGroups;

    return apiGroups.filter((sport) =>
      [sport.label, sport.apiSport, sport.id].some((value) =>
        value.toLowerCase().includes(searchTerm)
      )
    );
  }, [apiGroups, searchTerm]);

  const totalProfitLoss = useMemo(() => {
    return sportGroups.reduce((runningTotal, sport) => runningTotal + sport.profitLoss, 0);
  }, [sportGroups]);

  const updateFilter = <Key extends keyof ProfitLossFilters>(
    key: Key,
    value: ProfitLossFilters[Key]
  ) => {
    setDraftFilters((currentFilters) => ({ ...currentFilters, [key]: value }));
  };

  const handleSubmit = (submitEvent: FormEvent<HTMLFormElement>) => {
    submitEvent.preventDefault();
    setCasinoCurrentPage(1);
    setAppliedFilters({ ...draftFilters });
  };

  const openSportDetails = (sport: ProfitLossSportGroup) => {
    if (sport.label.toLowerCase() === 'casino' || sport.apiSport.toLowerCase() === 'casino') {
      setCasinoCurrentPage(1);
      setShowCasinoReport(true);
      return;
    }

    const query = new URLSearchParams({
      sportId: sport.id,
      sport: sport.apiSport,
      label: sport.label,
    });
    navigate(`/profit-loss-detail?${query.toString()}`);
  };

  const casinoRounds = casinoRoundHistoryQuery.data?.rounds ?? [];
  const casinoTotalProfitLoss = useMemo(
    () => casinoRounds.reduce((runningTotal, round) => runningTotal + getCasinoProfitLoss(round), 0),
    [casinoRounds]
  );

  const handleCasinoDownload = () => {
    downloadCsv('casino-profit-loss.csv', [
      ['Game Name', 'Round ID', 'Transaction ID', 'Bet Amount', 'Win Amount', 'P/L', 'Status', 'Date/Time'],
      ...casinoRounds.map((round) => [
        getCasinoGameName(round),
        getCasinoRoundId(round),
        getCasinoTransactionId(round),
        getCasinoBetAmount(round).toFixed(2),
        getCasinoWinAmount(round).toFixed(2),
        getCasinoProfitLoss(round).toFixed(2),
        round.status,
        formatCasinoTimestamp(getRoundValue(round, 'createdAt', 'startTime', 'endTime')),
      ]),
    ]);
  };

  const handleCasinoPageSizeChange = (nextPageSize: number) => {
    setCasinoPageSize(nextPageSize);
    setCasinoCurrentPage(1);
  };

  return (
    <main className="pb-[10px] font-[Arial,Helvetica,sans-serif] text-[12px] text-[#050505]">
      <form
        className="border-b border-[#222] bg-[#f7f7f7] px-[11px] pb-[13px] pt-[10px] max-md:px-[8px] max-md:pt-[8px]"
        aria-label="Profit loss filters"
        onSubmit={handleSubmit}
      >
        <div className="grid grid-cols-2 gap-x-[8px] gap-y-[7px] max-[520px]:grid-cols-1">
          <ReportDateField
            label="From Date"
            value={draftFilters.fromDate}
            max={draftFilters.toDate}
            onChange={(value) => updateFilter('fromDate', value)}
          />
          <ReportDateField
            label="To Date"
            value={draftFilters.toDate}
            min={draftFilters.fromDate}
            onChange={(value) => updateFilter('toDate', value)}
          />

          <label className="flex min-w-0 flex-col gap-[2px] leading-[15px]">
            <span className="h-[15px]">Search Bet</span>
            <input
              className={searchControlClassName}
              type="search"
              value={draftFilters.search}
              placeholder="Search"
              onChange={(event) => updateFilter('search', event.target.value)}
            />
          </label>

          <div className="flex min-w-0 items-end">
            <button
              type="submit"
              className="flex h-[35px] w-full items-center justify-center rounded-[3px] bg-[#212121] text-[14px] font-bold text-white transition-colors hover:bg-[#343434] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#257da9]"
            >
              Submit
            </button>
          </div>
        </div>
      </form>

      {showCasinoReport ? (
        <section className="mt-[10px] bg-white pb-[10px]" aria-labelledby="casino-profit-loss-title">
          <h1
            id="casino-profit-loss-title"
            className="m-0 flex min-h-[30px] items-center justify-between gap-3 bg-[#222] px-[7px] py-[4px] text-[14px] font-bold leading-[22px] text-white"
          >
            <span>Casino Profit Loss</span>
            <span className="flex items-center gap-3">
              <span className={casinoTotalProfitLoss >= 0 ? 'text-[#00db2a]' : 'text-[#ff1018]'}>
                Total P/L : IR {formatTotalProfitLoss(casinoTotalProfitLoss)}
              </span>
              <button
                type="button"
                className="flex h-[25px] min-w-[34px] items-center justify-center rounded-[3px] bg-[#111] px-2 text-white disabled:cursor-not-allowed disabled:opacity-70"
                aria-label="Download casino profit loss"
                disabled={casinoRounds.length === 0}
                onClick={handleCasinoDownload}
              >
                <Download className="h-[16px] w-[16px] stroke-[3]" aria-hidden="true" />
              </button>
            </span>
          </h1>

          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse bg-white text-[12px] text-[#050505]">
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
                    <th
                      key={heading}
                      scope="col"
                      className="h-[28px] border border-[#bfc1c3] bg-[#0b4d70] px-[5px] py-0 text-center text-[12px] font-bold leading-[27px] text-white"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody aria-busy={casinoRoundHistoryQuery.isLoading || casinoRoundHistoryQuery.isFetching}>
                {casinoRoundHistoryQuery.isLoading || casinoRoundHistoryQuery.isFetching ? (
                  Array.from({ length: 7 }).map((_, rowIndex) => (
                    <tr key={rowIndex} className="h-[31px]">
                      {Array.from({ length: 8 }).map((__, cellIndex) => (
                        <td
                          key={cellIndex}
                          className="h-[31px] border border-[#bfc1c3] px-[5px] py-0 align-middle leading-[30px]"
                        >
                          <span className="mx-auto block h-2 w-[62%] animate-pulse rounded-[3px] bg-[#d6d6d6]" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : casinoRoundHistoryQuery.isError ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="h-[62px] border border-[#bfc1c3] text-center text-[#666]"
                    >
                      Unable to load casino profit loss records
                    </td>
                  </tr>
                ) : casinoRounds.length > 0 ? (
                  casinoRounds.map((round, index) => {
                    const gameName = getCasinoGameName(round);
                    const roundId = getCasinoRoundId(round);
                    const transactionId = getCasinoTransactionId(round);
                    const betAmount = getCasinoBetAmount(round);
                    const winAmount = getCasinoWinAmount(round);
                    const profitLoss = getCasinoProfitLoss(round);
                    const status = String(round.status ?? '-');
                    const statusClassName =
                      status.toLowerCase() === 'won'
                        ? 'text-[#0bc90b]'
                        : status.toLowerCase() === 'lost'
                          ? 'text-[#f11616]'
                          : 'text-[#050505]';

                    return (
                      <tr key={round.id || `${round.startTime}-${index}`} className="h-[31px] odd:bg-white even:bg-[#e7e7e7] hover:bg-[#fafafa]">
                        <td
                          className="h-[31px] border border-[#bfc1c3] px-[5px] py-0 align-middle leading-[30px] overflow-hidden text-ellipsis whitespace-nowrap"
                          title={gameName}
                        >
                          {gameName}
                        </td>
                        <td
                          className="h-[31px] border border-[#bfc1c3] px-[5px] py-0 align-middle leading-[30px] overflow-hidden text-ellipsis whitespace-nowrap text-center"
                          title={roundId}
                        >
                          {roundId}
                        </td>
                        <td className="h-[31px] border border-[#bfc1c3] px-[5px] py-0 align-middle leading-[30px] text-center">
                          <span className="inline-flex max-w-full items-center justify-center gap-x-2">
                            <span className="truncate" title={transactionId}>
                              {transactionId}
                            </span>
                            {transactionId !== '-' && (
                              <button
                                type="button"
                                aria-label="Copy transaction ID"
                                className="shrink-0 text-[#243a48]"
                                onClick={() => copy(transactionId)}
                              >
                                <Icons.copy />
                              </button>
                            )}
                          </span>
                        </td>
                        <td className="h-[31px] border border-[#bfc1c3] px-[5px] py-0 align-middle leading-[30px] text-center font-bold">
                          {betAmount.toFixed(2)}
                        </td>
                        <td className="h-[31px] border border-[#bfc1c3] px-[5px] py-0 align-middle leading-[30px] text-center font-bold">
                          {winAmount.toFixed(2)}
                        </td>
                        <td
                          className={`h-[31px] border border-[#bfc1c3] px-[5px] py-0 align-middle leading-[30px] text-center font-bold ${
                            profitLoss > 0 ? 'text-[#0bc90b]' : profitLoss < 0 ? 'text-[#f11616]' : ''
                          }`}
                        >
                          {profitLoss === 0 ? '-' : profitLoss.toFixed(2)}
                        </td>
                        <td
                          className={`h-[31px] border border-[#bfc1c3] px-[5px] py-0 align-middle leading-[30px] text-center font-bold uppercase ${statusClassName}`}
                        >
                          {status}
                        </td>
                        <td className="h-[31px] border border-[#bfc1c3] px-[5px] py-0 align-middle leading-[30px] text-center">
                          {formatCasinoTimestamp(getRoundValue(round, 'createdAt', 'startTime', 'endTime'))}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={8}
                      className="h-[62px] border border-[#bfc1c3] text-center text-[#666]"
                    >
                      No casino profit loss records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <ReportPagination
            currentPage={casinoCurrentPage}
            pageSize={casinoPageSize}
            totalItems={casinoRoundHistoryQuery.data?.pagination?.totalItems ?? 0}
            onPageChange={setCasinoCurrentPage}
            onPageSizeChange={handleCasinoPageSizeChange}
          />
        </section>
      ) : (
        <section className="mt-[10px] bg-white pb-[10px]" aria-labelledby="profit-loss-title">
          <h1
            id="profit-loss-title"
            className="m-0 flex min-h-[30px] items-center justify-between gap-3 bg-[#222] px-[7px] py-[4px] text-[14px] font-bold leading-[22px] text-white"
          >
            <span>Profit Loss</span>
            <span className="text-right">
              Total P/L : IR{' '}
              <span className={totalProfitLoss >= 0 ? 'text-[#00db2a]' : 'text-[#ff1018]'}>
                {formatTotalProfitLoss(totalProfitLoss)}
              </span>
            </span>
          </h1>

          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse text-[12px]">
              <thead>
                <tr>
                  <th className="h-[28px] border border-[#b6b9bb] bg-[#e4e4e4] px-2 py-0 text-center font-bold leading-[27px]">
                    EVENT
                  </th>
                  <th className="h-[28px] border border-[#b6b9bb] bg-[#e4e4e4] px-2 py-0 text-center font-bold leading-[27px]">
                    P &amp; L
                  </th>
                </tr>
              </thead>
              <tbody aria-busy={anyQueryLoading && sportGroups.length === 0}>
                {anyQueryLoading && sportGroups.length === 0 ? (
                  Array.from({ length: 5 }).map((_, rowIndex) => (
                    <tr key={rowIndex}>
                      <td className="h-[31px] border border-[#b6b9bb] px-[50px] py-[4px]">
                        <span className="mx-auto block h-[20px] w-[90%] animate-pulse rounded-[5px] bg-[#c8c8c8]" />
                      </td>
                      <td className="h-[31px] border border-[#b6b9bb] px-2 py-[4px]">
                        <span className="mx-auto block h-[9px] w-[55px] animate-pulse rounded bg-[#c8c8c8]" />
                      </td>
                    </tr>
                  ))
                ) : sportsProfitLossQuery.isError ? (
                  <tr>
                    <td
                      colSpan={2}
                      className="h-[62px] border border-[#b6b9bb] text-center text-[#666]"
                    >
                      Unable to load profit and loss records
                    </td>
                  </tr>
                ) : sportGroups.length > 0 ? (
                  sportGroups.map((sport) => (
                    <tr key={sport.id} className="bg-white">
                      <td className="h-[31px] border border-[#b6b9bb] px-[50px] py-[4px] max-md:px-[12px]">
                        <button
                          type="button"
                          className="mx-auto flex h-[20px] w-[90%] items-center justify-center rounded-[5px] bg-[#243a48] px-3 text-center text-[11px] leading-[20px] text-white transition-colors hover:bg-[#162c3a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#08a7d2]"
                          onClick={() => openSportDetails(sport)}
                          aria-label={`View ${sport.label} profit and loss details`}
                        >
                          <span className="truncate">{sport.label}</span>
                        </button>
                      </td>
                      <td className="h-[31px] border border-[#b6b9bb] px-2 py-0 text-center align-middle">
                        <ProfitLossAmount value={sport.profitLoss} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={2}
                      className="h-[62px] border border-[#b6b9bb] text-center text-[#666]"
                    >
                      No profit and loss records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  );
}

export default BetProfitLoss;
