import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import TabFilter from '@/components/common/TabFilter';
import { Loader2, Search } from 'lucide-react';

import CricketSection from './components/sports/CricketSection';
import FootballSection from './components/sports/FootballSection';
import TennisSection from './components/sports/TennisSection';
import BetResult from '@/pages/BetResult';

import { useAllSports } from './hooks/useAllSports';
import { useHomePage } from '../Home/hooks/useHomePage';
import { FaCheck, FaPlus } from 'react-icons/fa6';
import ViewByDropdown, { type ViewByOption } from './components/ViewbyDropdown';
import SportsTabs from './components/SportsTabs';
import ExchangeSportsbookHeader from '@/components/common/ExchangeSportsbookHeader';
import Banner from '@/components/common/Banner';
import SportNoDataFallback from './components/sports/SportNoDataFallback';
import EventSearchModal from '@/components/common/EventSearchModal';

const AllSports: React.FC = () => {
  const { sportName = '', competitionId } = useParams();
  const [viewBy, setViewBy] = useState<ViewByOption>('Time');
  const [isLiveSelected, setIsLiveSelected] = useState(false);
  const [isVirtualSelected, setIsVirtualSelected] = useState(false);

  const normalizedSportName = sportName.toLowerCase();
  const sport =
    normalizedSportName === 'soccer' || normalizedSportName === 'football'
      ? 'Football'
      : normalizedSportName === 'tennis'
        ? 'Tennis'
        : 'Cricket';
  const isDashboard = window.location.pathname.includes('dashboard');
  const { isAuthenticated } = useHomePage();
  const pageMatchFilter = isVirtualSelected && !isLiveSelected ? 'virtual' : isLiveSelected ? 'live' : 'all';

  const {
    activeTab,
    setActiveTab,
    selectedSportTab,
    isLoading,
    isInplay,
    isMultiMarket,
    allEvents,
    cricketEvents,
    footballEvents,
    tennisEvents,
    filterResultTab,
  } = useAllSports(sport, viewBy, pageMatchFilter);

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
      className={`flex flex-col font-tamoha ${isAuthenticated ? 'pt-[0.125rem]' : ''}`}
    >
      {isMultiMarket ? (
        <>
          <div className="mt-2 w-full min-h-[500px]">
            <h2 className="text-sm font-bold text-white">Multi Market</h2>

            <p className="mt-1 text-xs text-white">There are currently no followed multi markets.</p>
          </div>
        </>
      ) : (
        <div className="flex flex-col flex-1 min-h-0 scrollbar-hidden">
          {(isDashboard || isInplay) && <ExchangeSportsbookHeader />}
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
                      className={`min-w-0 flex-1 border-r border-[#b9c5cc] px-2 text-[14px] font-bold leading-none last:border-r-0 ${activeTab === tab
                        ? 'bg-white text-[#20272c]'
                        : 'bg-[#263b49] text-white'
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

          {!isInplay && (
            <Banner />
          )}

          {isDashboard && (
            <div className="bg-[#212121] py-[5px] mt-[7px] text-xs font-semibold text-white font-tahoma border-b border-[#c8ced3] hidden lg:flex items-center justify-between px-2">
              <div className="h-5"> Highlights</div>
            </div>
          )}
          {!isInplay && <SportsTabs />}

          {!isInplay && (
            <div className={isAuthenticated ? 'pt-[0.125rem]' : ``}>

              {/* Always visible */}
              <div className="bg-[#212121] py-[5px] mt-[7px] text-xs font-semibold text-white font-tahoma border-b border-[#c8ced3] flex items-center justify-between px-2">
                {isDashboard ? (
                  'Highlights'
                ) : (
                  <div className="flex gap-2 items-center">
                    <img
                      src={
                        normalizedSportName === 'cricket'
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
                <div className="flex gap-2 items-center">
                  <div className="flex items-center gap-[2px]">
                    <button
                      type="button"
                      aria-pressed={isLiveSelected}
                      onClick={() => setIsLiveSelected((current) => !current)}
                      className={`flex items-center justify-center rounded-[25px] border px-2.5 text-[12px] whitespace-nowrap ${
                        isLiveSelected
                          ? 'border-[#00ad78] bg-[#00ad78] text-white'
                          : 'border-white bg-transparent text-white'
                      }`}
                    >
                      {isLiveSelected ? <FaCheck aria-hidden="true" /> : <FaPlus aria-hidden="true" />}
                      LIVE
                    </button>
                    <button
                      type="button"
                      aria-pressed={isVirtualSelected}
                      onClick={() => setIsVirtualSelected((current) => !current)}
                      className={`flex items-center justify-center rounded-[25px] border px-2.5 text-[12px] whitespace-nowrap ${
                        isVirtualSelected
                          ? 'border-[#00ad78] bg-[#00ad78] text-white'
                          : 'border-white bg-transparent text-white'
                      }`}
                    >
                      {isVirtualSelected ? (
                        <FaCheck aria-hidden="true" />
                      ) : (
                        <FaPlus aria-hidden="true" />
                      )}
                      VIRTUAL
                    </button>
                  </div>
                  <ViewByDropdown selected={viewBy} onChange={setViewBy} />
                </div>
              </div>
            </div>
          )}
          {activeTab === 'Bet Result' ? (
            <BetResult />
          ) : isLoading ? (
            <div className="flex justify-center items-center gap-x-1 py-8 text-white">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Loading events...
            </div>
          ) : (
            <div className={isInplay ? 'space-y-0' : 'space-y-3'}>
              <>
                {(sport === 'Cricket' || selectedSportTab === 'Cricket' || isInplay) && (
                  <CricketSection
                    matches={cricketEvents}
                    showInplayHeader={isInplay}
                    viewBy={viewBy}
                  />
                )}
                {(sport === 'Football' || selectedSportTab === 'Football' || isInplay) && (
                  <FootballSection
                    matches={footballEvents}
                    showInplayHeader={isInplay}
                    viewBy={viewBy}
                  />
                )}
                {(sport === 'Tennis' || selectedSportTab === 'Tennis' || isInplay) && (
                  <TennisSection
                    matches={tennisEvents}
                    showInplayHeader={isInplay}
                    viewBy={viewBy}
                  />
                )}
              </>

              {visibleEventCount === 0 && !isLoading && (
                <SportNoDataFallback />
              )}

              {/* {!isInplay && !competitionId && <Footer />} */}
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
