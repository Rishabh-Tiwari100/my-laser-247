import { useIsAuthenticated, useIsDemoUser } from '@/hooks/redux';
import { useRef, useState, useCallback, useMemo, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { debounce } from '@/utils';
import { useGetEventsQuery } from '@/store/api/eventsApi';
import { Match } from '@/types/event';
import type { ViewByOption } from '../components/ViewbyDropdown';
import type { SportMatchFilter } from '../helpers/sportMatchFilter';

export const eventViewTabs = ['In-Play', 'Today', 'Tomorrow'];

export const useAllSports = (
  sportName?: string,
  viewBy: ViewByOption = 'Time',
  pageMatchFilter: SportMatchFilter = 'all'
) => {
  const userTriggeredRef = useRef(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dummySearchTerm, setDummySearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('In-Play');
  const [selectedSportTab, setSelectedSportTab] = useState<'Cricket' | 'Football' | 'Tennis'>(
    'Cricket'
  );

  const [filterSports, setFilterSports] = useState<string[]>(['Cricket', 'Football', 'Tennis']);

  const { competitionId } = useParams();
  const { pathname } = useLocation();
  const isInplay = pathname.startsWith('/inplay');
  const isMultiMarket = pathname.startsWith('/multi-markets');
  const prevSportRef = useRef<string | undefined>(sportName);
  const isAuthenticated = useIsAuthenticated();
  const isDemoUser = useIsDemoUser();
  const isVirtualOnly = pageMatchFilter === 'virtual';
  const isLiveSelected = pageMatchFilter === 'live';

  useEffect(() => {
    if (prevSportRef.current !== sportName) {
      userTriggeredRef.current = true;
      prevSportRef.current = sportName;
    }
  }, [sportName]);

  const apiSportName = useMemo(
    () => (isInplay ? '' : sportName === 'Football' ? 'Soccer' : sportName || ''),
    [isInplay, sportName]
  );

  const queryParams = useMemo(
    () => ({
      sportName: apiSportName,
      competitionId: Number(competitionId),
      inplay:
        (!searchTerm && isInplay && activeTab === 'In-Play') || (!isInplay && isLiveSelected)
          ? true
          : undefined,
      ...(!searchTerm && {
        matchTime: activeTab === 'Today' ? 'today' : activeTab === 'Tomorrow' ? 'upcoming' : '',
      }),
      status: 'ACTIVE',
      search: searchTerm,
      sortBy: viewBy === 'Competition' ? 'competition' : undefined,
    }),
    [apiSportName, competitionId, searchTerm, isInplay, activeTab, viewBy, isLiveSelected]
  );

  const { data, isLoading, isFetching } = useGetEventsQuery(queryParams, {
    pollingInterval: 5000,
    skip: activeTab === 'Bet Result' || isVirtualOnly,
  });

  const cricketEvents = isVirtualOnly ? [] : data?.cricket ?? [];
  const footballEvents = isVirtualOnly ? [] : data?.football ?? [];
  const tennisEvents = isVirtualOnly ? [] : data?.tennis ?? [];

  const allEvents: Match[] = [...cricketEvents, ...footballEvents, ...tennisEvents];

  const debouncedSearch = useRef(debounce((val: string) => setSearchTerm(val), 500)).current;

  const handleTabChange = useCallback((tab: string) => {
    userTriggeredRef.current = true;
    setActiveTab(tab);
  }, []);

  const showLoader = isVirtualOnly ? false : isLoading || (userTriggeredRef.current && isFetching);

  useEffect(() => {
    if (!isFetching) {
      userTriggeredRef.current = false;
    }
  }, [isFetching]);

  // const filterResultTab =
  //   isAuthenticated && !isDemoUser ? [...eventViewTabs, 'Bet Result'] : eventViewTabs;

  const filterResultTab = eventViewTabs;

  return {
    activeTab,
    setActiveTab: handleTabChange,
    searchTerm,
    setSearchTerm,
    debouncedSearch,
    dummySearchTerm,
    setDummySearchTerm,
    filterResultTab,

    selectedSportTab,
    setSelectedSportTab,

    filterSports,
    setFilterSports,

    // api
    isLoading: showLoader,
    isInplay,
    isMultiMarket,

    // data
    allEvents,
    cricketEvents,
    footballEvents,
    tennisEvents,
  };
};
