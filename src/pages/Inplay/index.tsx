import ExchangeSportsbookHeader from '@/components/common/ExchangeSportsbookHeader';
import { useState } from 'react';
import { mdiCheck, mdiMagnify, mdiPlus } from '@mdi/js';
import Marquee from '@/components/common/Marquee';
import Banner from '@/components/common/Banner';
import EventSearchModal from '@/components/common/EventSearchModal';
import { useGetEventsQuery } from '@/store/api/eventsApi';
import type { Match } from '@/types/event';
import OuterMarketRow from '@/pages/AllSports/components/OuterMarketRow';

const tabs = ['In-Play', 'Today', 'Tomorrow'] as const;
type EventTab = (typeof tabs)[number];
type SportFilter = 'live' | 'virtual' | 'premium';

function SportSection({
  title,
  sport,
  matches,
}: {
  title: string;
  sport: string;
  matches: Match[];
}) {
  const [filters, setFilters] = useState<SportFilter[]>([]);
  const visibleMatches = matches.filter((match) => {
    if (!filters.length) return true;
    const virtual =
      /^sr/i.test(match.externalId ?? '') || match.tags.some((tag) => tag.startsWith('e'));
    return (
      (filters.includes('live') && match.inplay && !virtual) ||
      (filters.includes('virtual') && virtual) ||
      (filters.includes('premium') && match.tags.includes('premium'))
    );
  });

  return (
    <section aria-label={`${title} events`} className="border-b-[3px] border-[#7e97a7] bg-white">
      <div className="flex h-[31px] items-center justify-between gap-[5px] bg-[#213b49] px-[8px] text-[13px] font-bold text-white lg:h-[25px] lg:px-[10px] lg:text-[12px]">
        <h2 className="m-0 truncate">{title}</h2>
        <div className="flex shrink-0 gap-[2px]">
          {(['live', 'virtual', 'premium'] as const).map((filter) => {
            const active = filters.includes(filter);
            return (
              <button
                key={filter}
                type="button"
                aria-pressed={active}
                onClick={() =>
                  setFilters((current) =>
                    active ? current.filter((item) => item !== filter) : [...current, filter]
                  )
                }
                className={`flex h-[22px] items-center justify-center rounded-full border px-[5px] text-[10px] font-normal uppercase leading-[18px] lg:px-[8px] lg:text-[11px] ${active ? 'border-[#00ad78] bg-[#00ad78]' : 'border-white bg-transparent'}`}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-[12px] w-[12px] fill-current"
                  aria-hidden="true"
                >
                  <path d={active ? mdiCheck : mdiPlus} />
                </svg>
                {filter}
              </button>
            );
          })}
        </div>
      </div>
      <div
        className="hidden h-[21px] grid-cols-12 items-center bg-[#cfd6da] text-[12px] text-black lg:grid"
        aria-hidden="true"
      >
        <div className="col-span-7" />
        <div className="col-span-4 grid grid-cols-3 text-center">
          <span>1</span>
          <span>X</span>
          <span>2</span>
        </div>
        <div />
      </div>
      {visibleMatches.length ? (
        visibleMatches.map((match) => (
          <OuterMarketRow key={match.eventId} match={match} sportName={sport} />
        ))
      ) : (
        <p role="status" className="m-0 px-[8px] py-[12px] text-center text-[12px] text-[#6c757d]">
          No events match these filters.
        </p>
      )}
    </section>
  );
}

export default function Inplay() {
  const [activeTab, setActiveTab] = useState<EventTab>('In-Play');
  const [searchOpen, setSearchOpen] = useState(false);
  const { data, isLoading, isFetching, isError } = useGetEventsQuery(
    {
      inplay: activeTab === 'In-Play' ? true : undefined,
      matchTime:
        activeTab === 'Today' ? 'today' : activeTab === 'Tomorrow' ? 'upcoming' : undefined,
      status: 'ACTIVE',
    },
    { pollingInterval: 5000 }
  );
  const groups = Object.entries(data ?? {}).filter(([, matches]) => matches.length > 0);

  return (
    <div className="min-w-0 pt-[2px] font-helvetica text-black" aria-busy={isLoading}>
      <Marquee tagName="News" className="mb-px h-[26px] leading-[26px]" />
      <Banner className="m-0 border-b border-white" />
      <ExchangeSportsbookHeader />
      <div className="flex h-[42px] items-center gap-[10px] bg-[#24343e] px-[5px] lg:h-[44px] lg:bg-[#eee] lg:px-0">
        <div
          className="flex h-[31px] min-w-0 flex-1 overflow-hidden rounded-[4px] border border-[#b9c5cc] lg:h-[27px] lg:max-w-[455px]"
          role="tablist"
          aria-label="Event dates"
        >
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={activeTab === tab}
              onClick={() => setActiveTab(tab)}
              className={`min-w-0 flex-1 border-r border-[#b9c5cc] px-[8px] text-[14px] font-bold last:border-r-0 lg:text-[12px] ${activeTab === tab ? 'bg-white text-[#20272c] lg:bg-[#213b49] lg:text-white' : 'bg-[#263b49] text-white lg:bg-white lg:text-[#243a48]'}`}
            >
              {tab}
            </button>
          ))}
        </div>
        <button
          type="button"
          aria-label="Search events"
          onClick={() => setSearchOpen(true)}
          className="flex h-[30px] w-[34px] shrink-0 items-center justify-center text-white lg:hidden"
        >
          <svg viewBox="0 0 24 24" className="h-[27px] w-[27px] fill-current" aria-hidden="true">
            <path d={mdiMagnify} />
          </svg>
        </button>
      </div>
      {isError ? (
        <p
          role="status"
          className="bg-white px-[8px] py-[20px] text-center text-[13px] text-[#526575]"
        >
          Unable to load events. Please try again.
        </p>
      ) : isLoading || (!groups.length && isFetching) ? (
        <p
          role="status"
          className="bg-white px-[8px] py-[20px] text-center text-[13px] text-[#526575]"
        >
          Loading events…
        </p>
      ) : groups.length ? (
        groups.map(([sport, matches]) => (
          <SportSection
            key={`${activeTab}-${sport}`}
            title={sport === 'football' ? 'Football' : matches[0]?.sport || sport}
            sport={sport}
            matches={matches}
          />
        ))
      ) : (
        <p
          role="status"
          className="bg-white px-[8px] py-[20px] text-center text-[13px] text-[#526575]"
        >
          No events available for {activeTab.toLowerCase()}.
        </p>
      )}
      <EventSearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
