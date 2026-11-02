import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import Pagination from '@/components/common/Pagination';
import SettledBetsFilter from './components/SettledBetsFilter';
import SettledEventRow from './components/SettledEventRow';
import { groupSettledBets } from './settledBetUtils';
import type { SettledBetFilters, SettledEventGroup } from './types';
import {
  useGetbetEventsQuery,
  useLazyGetBetHistoryQuery,
  type BetEvent,
  type Pagination as BetPagination,
  type ProfitLossItem,
} from '@/store/api/betReportApi';

const statusOptions = ['All', 'Won', 'Lost', 'Voided', 'Cancelled'];

const initialFilters: SettledBetFilters = {
  fromDate: dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
  toDate: dayjs().format('YYYY-MM-DD'),
  sport: 'Cricket',
  subType: 'All',
  marketType: 'exchange',
};

const toApiSport = (sport: string): string => (sport === 'Football' ? 'Soccer' : sport);

const toApiStatus = (status: string | undefined): string | undefined =>
  !status || status === 'All' ? undefined : status;

const toEventCount = (value: unknown): number => {
  const count = Number(value);
  return Number.isFinite(count) ? count : 0;
};

const formatEventTime = (event: BetEvent): string => {
  const rawValue = event.lastBetPlacedAt;
  const parsed = dayjs(rawValue);
  return parsed.isValid() ? parsed.format('DD/MM/YYYY HH:mm:ss') : rawValue || '-';
};

interface EventBetsState {
  bets: ProfitLossItem[];
  pagination?: BetPagination;
}

export default function SettledBets() {
  const [draftFilters, setDraftFilters] = useState<SettledBetFilters>(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState<SettledBetFilters>(initialFilters);
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);
  const [eventPage, setEventPage] = useState(1);
  const [eventLimit, setEventLimit] = useState(10);
  const [innerPageByEventId, setInnerPageByEventId] = useState<Record<string, number>>({});
  const [innerLimitByEventId, setInnerLimitByEventId] = useState<Record<string, number>>({});
  const [betsByEventId, setBetsByEventId] = useState<Record<string, EventBetsState>>({});
  const [loadingEventId, setLoadingEventId] = useState<string | null>(null);

  const eventQueryParams = useMemo(() => {
    const fromDate = dayjs(appliedFilters.fromDate);
    const toDate = dayjs(appliedFilters.toDate);

    return {
      page: eventPage,
      limit: eventLimit,
      betTime: 'PAST',
      ...(fromDate.isValid() && { fromDate: fromDate.startOf('day').toISOString() }),
      ...(toDate.isValid() && { toDate: toDate.endOf('day').toISOString() }),
      sport: toApiSport(appliedFilters.sport),
      marketType: appliedFilters.marketType,
      ...(toApiStatus(appliedFilters.subType) && {
        status: toApiStatus(appliedFilters.subType),
      }),
    };
  }, [appliedFilters, eventLimit, eventPage]);

  const { data: eventData, isFetching: isFetchingEvents } = useGetbetEventsQuery(eventQueryParams);
  const [fetchBetHistory] = useLazyGetBetHistoryQuery();

  const events = useMemo<SettledEventGroup[]>(() => {
    return (eventData?.bets ?? [])
      .filter((event) => toEventCount(event.count) > 0)
      .map((event) => {
        const id = String(event.eventId);
        const groupedBets = groupSettledBets(betsByEventId[id]?.bets ?? []);

        return {
          id,
          name: event.eventName || 'Unknown Event',
          startsAt: formatEventTime(event),
          betCount: toEventCount(event.count),
          bets: groupedBets[0]?.bets ?? [],
        };
      });
  }, [betsByEventId, eventData?.bets]);

  const loadEventBets = async (eventId: string, page: number, limit: number) => {
    setLoadingEventId(eventId);
    try {
      const response = await fetchBetHistory({
        ...eventQueryParams,
        page,
        limit,
        eventId,
      }).unwrap();
      setBetsByEventId((current) => ({
        ...current,
        [eventId]: {
          bets: response.bets ?? [],
          pagination: response.pagination,
        },
      }));
    } finally {
      setLoadingEventId((current) => (current === eventId ? null : current));
    }
  };

  const clearExpandedBets = () => {
    setExpandedEventId(null);
    setInnerPageByEventId({});
    setInnerLimitByEventId({});
    setBetsByEventId({});
  };

  const submitFilters = () => {
    clearExpandedBets();
    setEventPage(1);
    setAppliedFilters(draftFilters);
  };

  const toggleEvent = async (eventId: string) => {
    const nextExpandedEventId = expandedEventId === eventId ? null : eventId;
    setExpandedEventId(nextExpandedEventId);

    if (!nextExpandedEventId || betsByEventId[eventId]) return;

    await loadEventBets(
      eventId,
      innerPageByEventId[eventId] ?? 1,
      innerLimitByEventId[eventId] ?? 10
    );
  };

  const changeEventPage = (page: number) => {
    clearExpandedBets();
    setEventPage(page);
  };

  const changeEventLimit = (limit: number) => {
    clearExpandedBets();
    setEventPage(1);
    setEventLimit(limit);
  };

  const changeInnerPage = (eventId: string, page: number) => {
    setInnerPageByEventId((current) => ({ ...current, [eventId]: page }));
    void loadEventBets(eventId, page, innerLimitByEventId[eventId] ?? 10);
  };

  const changeInnerLimit = (eventId: string, limit: number) => {
    setInnerPageByEventId((current) => ({ ...current, [eventId]: 1 }));
    setInnerLimitByEventId((current) => ({ ...current, [eventId]: limit }));
    void loadEventBets(eventId, 1, limit);
  };

  return (
    <main className="pb-[10px] font-[Arial,Helvetica,sans-serif] text-[12px] text-[#050505] lg:min-h-[calc(100vh-155px)]">
      <div className="w-full max-w-[1330px] pt-[5px]">
        <SettledBetsFilter
          value={draftFilters}
          onChange={setDraftFilters}
          onSubmit={submitFilters}
          disabled={isFetchingEvents}
          subTypeOptions={statusOptions}
        />

        <section
          className="mt-0 bg-white pb-[10px] lg:mt-[10px]"
          aria-labelledby="settled-bets-title"
        >
          <h1
            id="settled-bets-title"
            className="m-0 flex h-[28px] items-center bg-[#212121] px-[7px] text-[14px] font-bold leading-[28px] text-white lg:h-[30px] lg:leading-[30px]"
          >
            Settled Bets
          </h1>

          <div className="mx-[10px] mt-[8px] flex flex-col gap-[2px] lg:gap-[5px]">
            {isFetchingEvents ? (
              <div
                role="status"
                className="flex h-[32px] items-center justify-center rounded-[4px] border border-[#a8a8a8] bg-[#d0d0d0] text-[12px] font-bold text-black"
              >
                Loading...
              </div>
            ) : events.length > 0 ? (
              events.map((event, index) => (
                <SettledEventRow
                  key={event.id}
                  event={event}
                  index={index}
                  expanded={expandedEventId === event.id}
                  isLoading={loadingEventId === event.id}
                  betTableVariant="settled"
                  onToggle={() => void toggleEvent(event.id)}
                  detailFooter={
                    <div className="border-x border-b border-[#bfc1c3] px-[8px]">
                      <Pagination
                        totalItems={
                          betsByEventId[event.id]?.pagination?.totalItems ?? event.betCount ?? 0
                        }
                        currentPage={innerPageByEventId[event.id] ?? 1}
                        pageSize={innerLimitByEventId[event.id] ?? 10}
                        pageSizeOptions={[5, 10, 20, 50]}
                        onPageChange={(page) => changeInnerPage(event.id, page)}
                        onPageSizeChange={(limit) => changeInnerLimit(event.id, limit)}
                      />
                    </div>
                  }
                />
              ))
            ) : (
              <div
                role="status"
                className="flex h-[32px] items-center justify-center rounded-[4px] border border-[#a8a8a8] bg-[#d0d0d0] text-[12px] font-bold text-black"
              >
                No Data Found
              </div>
            )}
          </div>

          <div className="mx-[10px]">
            <Pagination
              totalItems={eventData?.pagination?.totalItems ?? 0}
              currentPage={eventPage}
              pageSize={eventLimit}
              pageSizeOptions={[10, 20, 50, 100]}
              onPageChange={changeEventPage}
              onPageSizeChange={changeEventLimit}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
