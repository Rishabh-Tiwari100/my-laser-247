import React, { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import Marquee from '@/components/common/Marquee';
import TabFilter from '@/components/common/TabFilter';
import { Loader2, Search } from 'lucide-react';

import CricketSection from './components/sports/CricketSection';
import FootballSection from './components/sports/FootballSection';
import TennisSection from './components/sports/TennisSection';
import BetResult from '@/pages/BetResult';

import { cn } from '@/utils';
import { useAllSports } from './hooks/useAllSports';
import { useHomePage } from '../Home/hooks/useHomePage';
import { FaCheck, FaPlus } from 'react-icons/fa6';
import ViewByDropdown, { type ViewByOption } from './components/ViewbyDropdown';
import SportsTabs from './components/SportsTabs';
import ExchangeSportsbookHeader from '@/components/common/ExchangeSportsbookHeader';
import Banner from '@/components/common/Banner';
import SportNoDataFallback from './components/sports/SportNoDataFallback';
import EventSearchModal from '@/components/common/EventSearchModal';
import Footer from '@/components/common/Footer';

const AllSports: React.FC = () => {
  const { sportName = '', competitionId } = useParams();
  const [viewBy, setViewBy] = useState<ViewByOption>('Time');
  const [isLiveSelected, setIsLiveSelected] = useState(false);
  const [isVirtualSelected, setIsVirtualSelected] = useState(false);
  const [isPremiumSelected, setIsPremiumSelected] = useState(false);

  const { pathname } = useLocation();
  const isDashboard = pathname === '/dashboard';
  const [dashboardSport, setDashboardSport] = useState<'Cricket' | 'Football' | 'Tennis'>(
    'Cricket'
  );
  const normalizedSportName =
    ({ '4': 'cricket', '1': 'football', '2': 'tennis' } as Record<string, string>)[sportName] ??
    sportName.toLowerCase();
  const sport = isDashboard
    ? dashboardSport
    : normalizedSportName === 'soccer' || normalizedSportName === 'football'
      ? 'Football'
      : normalizedSportName === 'tennis'
        ? 'Tennis'
        : 'Cricket';
  const isSportsPage = pathname.startsWith('/sports');
  const { isAuthenticated } = useHomePage();
  const pageMatchFilter =
    isVirtualSelected && !isLiveSelected ? 'virtual' : isLiveSelected ? 'live' : 'all';

  const {
    activeTab,
    setActiveTab,
    isLoading,
    isInplay,
    isMultiMarket,
    allEvents,
    cricketEvents: allCricketEvents,
    footballEvents: allFootballEvents,
    tennisEvents: allTennisEvents,
    filterResultTab,
  } = useAllSports(sport, viewBy, pageMatchFilter);

  const cricketEvents =
    (isDashboard || isSportsPage) && isPremiumSelected
      ? allCricketEvents.filter((event) => event.tags.includes('premium'))
      : allCricketEvents;
  const footballEvents =
    (isDashboard || isSportsPage) && isPremiumSelected
      ? allFootballEvents.filter((event) => event.tags.includes('premium'))
      : allFootballEvents;
  const tennisEvents =
    (isDashboard || isSportsPage) && isPremiumSelected
      ? allTennisEvents.filter((event) => event.tags.includes('premium'))
      : allTennisEvents;
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const visibleEventCount = isInplay
    ? allEvents.length
    : sport === 'Football'
      ? footballEvents.length
      : sport === 'Tennis'
        ? tennisEvents.length
        : cricketEvents.length;

  return (
    <div
      className={cn(
        'flex flex-col font-tamoha',
        isAuthenticated && 'pt-[0.125rem]',
        isDashboard && 'p-0 lg:pt-[2px] [font-family:Arial,Helvetica,sans-serif]'
      )}
    >
      {isMultiMarket ? (
        <>
          <div className="mt-2 w-full min-h-[500px]">
            <h2 className="text-sm font-bold text-white">Multi Market</h2>

            <p className="mt-1 text-xs text-white">
              There are currently no followed multi markets.
            </p>
          </div>
        </>
      ) : (
        <div className="flex flex-col flex-1 min-h-0 scrollbar-hidden">
          {isDashboard && (
            <>
              <Marquee
                tagName="News"
                className="order-0 mb-px h-[26px] leading-[26px] lg:h-[28px]"
                tagClassName="text-xs lg:pl-[5px]"
                contentClassName="lg:font-[Georgia,serif] lg:text-[14px]"
              />
              <Banner className="order-1 m-0 lg:border-b lg:border-white" />
              <ExchangeSportsbookHeader />
            </>
          )}
          {isInplay && <ExchangeSportsbookHeader />}
          {isInplay && (
            <>
              <div
                className={`${activeTab === 'In-Play' && 'sticky z-20 top-0'} hidden py-1  sm:block`}
              >
                <TabFilter
                  tabs={filterResultTab}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  className="!my-0"
                />
              </div>

              <div className="sticky top-0 z-20 flex h-[42px] items-center gap-3 border-t-[4px] border-[#20c4de] bg-[#24343e] px-2 sm:hidden mb-[5px]">
                <div className="flex h-[30px] min-w-0 flex-1 overflow-hidden rounded-[5px] border border-[#b9c5cc]">
                  {filterResultTab.map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={`min-w-0 flex-1 border-r border-[#b9c5cc] px-2 text-[14px] font-bold leading-none last:border-r-0 ${
                        activeTab === tab ? 'bg-white text-[#20272c]' : 'bg-[#263b49] text-white'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  aria-label="Search events"
                  onClick={() => setIsMobileSearchOpen(true)}
                  className="flex h-[30px] w-[30px] shrink-0 items-center justify-center text-white"
                >
                  <Search className="h-6 w-6" strokeWidth={2.5} />
                </button>
              </div>
            </>
          )}

          {!isInplay && !isDashboard && (
            <>
              {isSportsPage && <Marquee tagName="News" className="mb-px h-[26px] leading-[26px]" />}
              <Banner className={isSportsPage ? 'm-0' : undefined} />
            </>
          )}

          {isDashboard && (
            <SportsTabs selectedSport={dashboardSport} onSelectSport={setDashboardSport} />
          )}

          {!isInplay && (
            <div
              className={
                isDashboard ? 'order-4 p-0 lg:order-3' : isAuthenticated ? 'pt-[0.125rem]' : ''
              }
            >
              {/* Always visible */}
              <div
                className={cn(
                  'bg-[#212121] py-[5px] mt-[7px] text-xs font-semibold text-white font-helvetica border-b border-[#c8ced3] flex items-center justify-between px-2',
                  isDashboard &&
                    'm-0 min-h-[29px] px-0 py-[2px] lg:min-h-[25px] lg:bg-[#213b49] lg:px-[5px] lg:py-px',
                  isSportsPage && 'mt-0 h-[31px] gap-1 px-[5px] py-0 lg:h-[25px] lg:bg-[#243a48]'
                )}
              >
                {isDashboard ? (
                  'Highlights'
                ) : (
                  <div className="flex gap-2 items-center">
                    <img
                      src={
                        sport === 'Cricket'
                          ? '/icons/cricket.svg'
                          : normalizedSportName === 'soccer' || normalizedSportName === 'football'
                            ? '/icons/soccer.svg'
                            : '/icons/tennis.svg'
                      }
                      alt={sport}
                      className="w-5 h-5 invert"
                    />
                    {sport}
                  </div>
                )}
                <div
                  className={cn(
                    'flex gap-2 items-center',
                    (isDashboard || isSportsPage) && 'max-lg:gap-[5px]',
                    isDashboard && 'max-lg:[&_button]:min-h-[22px] max-lg:[&_button]:text-[10px]',
                    isSportsPage &&
                      '[&_button]:min-h-[22px] [&_button]:px-[5px] [&_button]:py-0 [&_button]:text-[10px] [&_button]:font-normal'
                  )}
                >
                  <div className="flex items-center gap-[2px]">
                    <button
                      type="button"
                      aria-pressed={isLiveSelected}
                      onClick={() => setIsLiveSelected((current) => !current)}
                      className={cn(
                        `flex items-center justify-center rounded-[25px] border px-2.5 text-[12px] whitespace-nowrap ${isDashboard ? 'min-h-[23px] gap-[3px] px-[6px] text-[11px] font-normal lg:min-h-[22px] lg:px-2.5 lg:text-xs' : ''} ${
                          isLiveSelected
                            ? 'border-[#00ad78] bg-[#00ad78] text-white'
                            : 'border-white bg-transparent text-white'
                        }`
                      )}
                    >
                      {isLiveSelected ? (
                        <FaCheck aria-hidden="true" />
                      ) : (
                        <FaPlus aria-hidden="true" />
                      )}
                      LIVE
                    </button>
                    <button
                      type="button"
                      aria-pressed={isVirtualSelected}
                      onClick={() => setIsVirtualSelected((current) => !current)}
                      className={cn(
                        `flex items-center justify-center rounded-[25px] border px-2.5 text-[12px] whitespace-nowrap ${isDashboard ? 'min-h-[23px] gap-[3px] px-[6px] text-[11px] font-normal lg:min-h-[22px] lg:px-2.5 lg:text-xs' : ''} ${
                          isVirtualSelected
                            ? 'border-[#00ad78] bg-[#00ad78] text-white'
                            : 'border-white bg-transparent text-white'
                        }`
                      )}
                    >
                      {isVirtualSelected ? (
                        <FaCheck aria-hidden="true" />
                      ) : (
                        <FaPlus aria-hidden="true" />
                      )}
                      VIRTUAL
                    </button>
                    {(isDashboard || isSportsPage) && (
                      <button
                        type="button"
                        aria-pressed={isPremiumSelected}
                        onClick={() => setIsPremiumSelected((selected) => !selected)}
                        className={`${isSportsPage ? 'flex' : 'hidden lg:flex'} min-h-[22px] gap-[3px] font-normal items-center justify-center rounded-[25px] border px-2.5 text-[12px] whitespace-nowrap ${isPremiumSelected ? 'border-[#00ad78] bg-[#00ad78] text-white' : 'border-white text-white'}`}
                      >
                        {isPremiumSelected ? (
                          <FaCheck aria-hidden="true" />
                        ) : (
                          <FaPlus aria-hidden="true" />
                        )}{' '}
                        PREMIUM
                      </button>
                    )}
                  </div>
                  <ViewByDropdown selected={viewBy} onChange={setViewBy} />
                </div>
              </div>
            </div>
          )}
          {activeTab === 'Bet Result' ? (
            <BetResult />
          ) : isLoading ? (
            <div
              className={cn(
                'flex justify-center items-center gap-x-1 py-8 text-[#213b49]',
                isDashboard && 'order-5'
              )}
            >
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Loading events...
            </div>
          ) : (
            <div
              className={`${isDashboard ? 'order-5 bg-white' : ''} ${isInplay ? 'space-y-0' : 'space-y-3'}`}
            >
              <>
                {(sport === 'Cricket' || isInplay) && (
                  <CricketSection
                    matches={cricketEvents}
                    showInplayHeader={isInplay}
                    viewBy={viewBy}
                  />
                )}
                {(sport === 'Football' || isInplay) && (
                  <FootballSection
                    matches={footballEvents}
                    showInplayHeader={isInplay}
                    viewBy={viewBy}
                  />
                )}
                {(sport === 'Tennis' || isInplay) && (
                  <TennisSection
                    matches={tennisEvents}
                    showInplayHeader={isInplay}
                    viewBy={viewBy}
                  />
                )}
              </>

              {visibleEventCount === 0 && !isLoading && <SportNoDataFallback />}
            </div>
          )}
          {isSportsPage && (
            <div className="[&>div]:border-[#ccc] [&_span]:text-[#333] [&_a]:text-[#333] [&_span]:text-[11px] [&_a]:text-[11px]">
              <Footer />
            </div>
          )}
          <EventSearchModal
            open={isMobileSearchOpen}
            onClose={() => setIsMobileSearchOpen(false)}
          />
        </div>
      )}
    </div>
  );
};

export default AllSports;
