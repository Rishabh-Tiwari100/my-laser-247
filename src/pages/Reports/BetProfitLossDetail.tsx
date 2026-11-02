import { FormEvent, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { Download } from 'lucide-react';
import { useGetProfitLossByEventQuery } from '@/store/api/betReportApi';
import BetSlipModal from '@/pages/ProfitLoss/components/BetSlipModal';
import ProfitLossAmount from '@/pages/ProfitLoss/components/ProfitLossAmount';
import ReportDateField from '@/pages/ProfitLoss/components/ReportDateField';
import ReportPagination from '@/pages/ProfitLoss/components/ReportPagination';
import type {
  ProfitLossDetailFilters,
  ProfitLossEventGroup,
  ProfitLossMarketType,
} from '@/pages/ProfitLoss/types';
import { downloadCsv, formatReportDate, toFilenamePart } from '@/pages/ProfitLoss/profitLossUtils';

const marketTypes: ProfitLossMarketType[] = ['Main Market', 'Fancy Market', 'Bookmaker Market'];

const marketTypeApiValues: Record<ProfitLossMarketType, string> = {
  'Main Market': 'main_market',
  'Fancy Market': 'fancy',
  'Bookmaker Market': 'bookmaker',
};

const getDateParameter = (value: string | null, fallbackValue: string): string => {
  if (!value) return fallbackValue;
  return dayjs(value).isValid() ? dayjs(value).format('YYYY-MM-DD') : fallbackValue;
};

const selectControlClassName =
  'h-[35px] w-full min-w-0 cursor-pointer rounded-[4px] border border-[#aeb3b7] bg-white px-[10px] py-0 font-[Arial,Helvetica,sans-serif] text-[14px] leading-[33px] text-[#090909] outline-none focus:border-[#283f50] focus:shadow-[0_0_0_1px_rgba(40,63,80,0.12)]';

const defaultPageSize = 10;

const toNumber = (value: unknown): number | undefined => {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : undefined;
};

export default function BetProfitLossDetail() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedSportId = searchParams.get('sportId') || 'soccer';
  const selectedApiSport = searchParams.get('sport') || 'Soccer';
  const selectedSportLabel = searchParams.get('label') || selectedApiSport.toUpperCase();
  const initialFromDate = getDateParameter(
    searchParams.get('fromDate'),
    dayjs().subtract(2, 'day').format('YYYY-MM-DD')
  );
  const initialToDate = getDateParameter(searchParams.get('toDate'), dayjs().format('YYYY-MM-DD'));
  const createInitialFilters = (): ProfitLossDetailFilters => ({
    fromDate: initialFromDate,
    toDate: initialToDate,
    marketType: 'Main Market',
  });

  const [draftFilters, setDraftFilters] = useState<ProfitLossDetailFilters>(createInitialFilters);
  const [appliedFilters, setAppliedFilters] =
    useState<ProfitLossDetailFilters>(createInitialFilters);
  const [selectedEvent, setSelectedEvent] = useState<ProfitLossEventGroup | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const startDate = dayjs(appliedFilters.fromDate);
  const endDate = dayjs(appliedFilters.toDate);
  const { data, isLoading, isFetching, isError } = useGetProfitLossByEventQuery({
    page: currentPage,
    limit: pageSize,
    sport: selectedApiSport,
    subType: marketTypeApiValues[appliedFilters.marketType],
    ...(startDate.isValid() && { fromDate: startDate.startOf('day').toISOString() }),
    ...(endDate.isValid() && { toDate: endDate.endOf('day').toISOString() }),
  });

  const events = useMemo<ProfitLossEventGroup[]>(() => {
    return (data?.data ?? []).flatMap((eventProfitLoss) => {
      const profitLoss = toNumber(eventProfitLoss.profitLoss);
      if (profitLoss === undefined) return [];

      return [
        {
          id: `${selectedSportId}:${eventProfitLoss.eventId}`,
          sportId: selectedSportId,
          sportLabel: selectedSportLabel,
          apiSport: eventProfitLoss.sport || selectedApiSport,
          name: eventProfitLoss.eventName || 'Unknown Event',
          date: eventProfitLoss.placeAt,
          profitLoss,
          bets: [],
        },
      ];
    });
  }, [data?.data, selectedApiSport, selectedSportId, selectedSportLabel]);

  const updateFilter = <Key extends keyof ProfitLossDetailFilters>(
    key: Key,
    value: ProfitLossDetailFilters[Key]
  ) => {
    setDraftFilters((currentFilters) => ({ ...currentFilters, [key]: value }));
  };

  const handleSubmit = (submitEvent: FormEvent<HTMLFormElement>) => {
    submitEvent.preventDefault();
    setSelectedEvent(null);
    setCurrentPage(1);
    setAppliedFilters({ ...draftFilters });
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set('fromDate', draftFilters.fromDate);
    nextSearchParams.set('toDate', draftFilters.toDate);
    setSearchParams(nextSearchParams, { replace: true });
  };

  const handleDownload = () => {
    downloadCsv(`profit-loss-${toFilenamePart(selectedSportLabel)}.csv`, [
      ['Date', 'Event Name', 'P & L'],
      ...events.map((event) => [formatReportDate(event.date), event.name, event.profitLoss]),
    ]);
  };

  const loading = (isLoading || isFetching) && events.length === 0;
  const totalEvents = data?.pagination?.totalItems ?? events.length;

  const handlePageSizeChange = (nextPageSize: number) => {
    setPageSize(nextPageSize);
    setCurrentPage(1);
  };

  return (
    <main className="pb-[10px] font-[Arial,Helvetica,sans-serif] text-[12px] text-[#050505]">
      <h1 className="sr-only">{selectedSportLabel} profit and loss details</h1>

      <form
        className="border-b border-[#222] bg-[#f7f7f7] px-[11px] pb-[8px] pt-[7px] max-md:px-[8px]"
        aria-label={`${selectedSportLabel} profit loss filters`}
        onSubmit={handleSubmit}
      >
        <div className="grid grid-cols-2 gap-x-[8px] gap-y-[6px] max-[520px]:grid-cols-1">
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
            <span className="h-[15px]">Sub Type</span>
            <select
              className={selectControlClassName}
              value={draftFilters.marketType}
              onChange={(event) =>
                updateFilter('marketType', event.target.value as ProfitLossMarketType)
              }
            >
              {marketTypes.map((marketType) => (
                <option key={marketType} value={marketType}>
                  {marketType}
                </option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-[minmax(0,1fr)_40px] items-end gap-[3px]">
            <button
              type="submit"
              className="flex h-[35px] items-center justify-center rounded-[3px] bg-[#212121] text-[14px] font-bold text-white transition-colors hover:bg-[#343434] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#257da9]"
            >
              Submit
            </button>
            <button
              type="button"
              className="flex h-[35px] items-center justify-center rounded-[3px] bg-[#212121] text-white transition-colors hover:bg-[#343434] disabled:cursor-not-allowed disabled:opacity-70"
              aria-label="Download profit and loss details"
              title="Download profit and loss details"
              disabled={events.length === 0}
              onClick={handleDownload}
            >
              <Download className="h-[18px] w-[18px] stroke-[3]" aria-hidden="true" />
            </button>
          </div>
        </div>
      </form>

      <section className="bg-white" aria-label={`${selectedSportLabel} events`}>
        <div className="overflow-x-auto">
          <table className="w-max min-w-full table-auto border-collapse text-[12px]">
            <thead>
              <tr>
                {['DATE', 'EVENT NAME', 'P & L', 'SHOW BETS'].map((heading) => (
                  <th
                    key={heading}
                    scope="col"
                    className="h-[28px] border border-[#b6b9bb] bg-[#e4e4e4] px-2 py-0 text-center font-bold leading-[27px]"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody aria-busy={loading}>
              {loading ? (
                Array.from({ length: 7 }).map((_, rowIndex) => (
                  <tr key={rowIndex}>
                    {Array.from({ length: 4 }).map((__, cellIndex) => (
                      <td key={cellIndex} className="h-[33px] border border-[#b6b9bb] px-2 py-0">
                        <span className="mx-auto block h-[9px] w-[70%] animate-pulse rounded bg-[#c8c8c8]" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : isError ? (
                <tr>
                  <td
                    colSpan={4}
                    className="h-[62px] border border-[#b6b9bb] text-center text-[#666]"
                  >
                    Unable to load event details
                  </td>
                </tr>
              ) : events.length > 0 ? (
                events.map((event) => (
                  <tr key={event.id} className="bg-white hover:bg-[#fafafa]">
                    <td className="h-[33px] whitespace-nowrap border border-[#b6b9bb] px-[5px] py-0 text-left leading-[32px]">
                      {formatReportDate(event.date)}
                    </td>
                    <td
                      className="h-[33px] min-w-0 break-words border border-[#b6b9bb] px-[5px] py-[6px] text-left leading-[18px]"
                      title={event.name}
                    >
                      {event.name}
                    </td>
                    <td className="h-[33px] whitespace-nowrap border border-[#b6b9bb] px-[5px] py-0 text-left leading-[32px]">
                      <ProfitLossAmount value={event.profitLoss} className="font-normal" />
                    </td>
                    <td className="h-[33px] whitespace-nowrap border border-[#b6b9bb] px-[5px] py-0 text-center">
                      <button
                        type="button"
                        className="inline-flex h-[23px] items-center justify-center rounded-[4px] bg-[linear-gradient(90deg,#05064f_0%,#06116e_45%,#06c4e8_100%)] px-[6px] text-[12px] leading-[23px] text-white transition-[filter] hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#08a7d2]"
                        onClick={() => setSelectedEvent(event)}
                        aria-label={`Show bets for ${event.name}`}
                      >
                        Show Bets
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="h-[62px] border border-[#b6b9bb] text-center text-[#666]"
                  >
                    No event details found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <ReportPagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={totalEvents}
          onPageChange={setCurrentPage}
          onPageSizeChange={handlePageSizeChange}
        />
      </section>

      {selectedEvent && (
        <BetSlipModal
          key={selectedEvent.id}
          event={selectedEvent}
          initialFromDate={appliedFilters.fromDate}
          initialToDate={appliedFilters.toDate}
          marketType={appliedFilters.marketType}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </main>
  );
}
