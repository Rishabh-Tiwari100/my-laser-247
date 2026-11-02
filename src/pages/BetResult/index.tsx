import { useEffect, useMemo, useState } from 'react';
import LoaderTwo from '@/components/common/LoaderTwo';
import Pagination from '@/components/common/Pagination';
import { useGetEventResultsQuery } from '@/store/api/betResultApi';
import EventResultRow from './components/EventResultRow';
import ToggleTabs from './components/ToggleTabs';
import BetResultScore from './components/BetResultScore';
import CustomSelect from '@/components/common/CustomSelect';
import { useIsAuthenticated } from '@/hooks';

type ResultTab = 'Today' | 'Yesterday';
const dayTabs: ResultTab[] = ['Today', 'Yesterday'];

const marketCategoryTabs = [
  { label: 'Normal', value: 'Normal' },
  { label: 'Fancybet', value: 'Fancybet' },
];

const BetResult = () => {
  const [activeDay, setActiveDay] = useState<ResultTab>('Today');
  const [activeMarketCtaegory, setActiveMarketCategory] = useState('Normal');
  const [sport, setSport] = useState('Cricket');
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const isAuthenticated = useIsAuthenticated();

  const { data, isLoading, isFetching } = useGetEventResultsQuery(
    {
      page: currentPage,
      limit,
      day: activeDay.toLowerCase(),
    },
    { skip: !isAuthenticated }
  );

  const events = data?.events ?? [];

  useEffect(() => {
    setCurrentPage(1);
  }, [activeDay]);

  return (
    <div className="font-poppins font-medium">
      <div className="flex flex-row items-center sm:justify-between gap-2">
        <ToggleTabs
          tabs={dayTabs}
          activeTab={activeDay}
          onChange={setActiveDay}
          className="self-end"
        />

        <div className="w-auto flex flex-row sm:flex-col gap-2 items-end">
          <div className="flex flex-col sm:flex-row items-center gap-1">
            <p className="text-xs md:text-sm">Category</p>
            <CustomSelect
              options={marketCategoryTabs}
              value={activeMarketCtaegory}
              onChange={setActiveMarketCategory}
              placeholder="Select category"
              className="w-[110px] sm:w-[160px] h-8"
            />
          </div>
        </div>
      </div>

      {activeMarketCtaegory === 'Fancybet' ? (
        <>
          <div className="mt-3 space-y-2">
            {isLoading || isFetching ? (
              <div className="px-2 pt-6 flex justify-center">
                <LoaderTwo text="Loading events..." />
              </div>
            ) : !isLoading && !isFetching && events.length === 0 ? (
              <div className="text-sm text-gray-500 text-center bg-primary/10 py-3">
                There are no events to be displayed.
              </div>
            ) : (
              !isLoading && (
                <>
                  {events.map((event) => (
                    <EventResultRow
                      key={event.id}
                      eventId={event.id}
                      eventName={event.name}
                      startTime={event.startTime}
                    />
                  ))}
                  <Pagination
                    totalItems={data?.pagination?.totalItems ?? 0}
                    currentPage={currentPage}
                    pageSize={limit}
                    onPageChange={(page) => setCurrentPage(page)}
                    onPageSizeChange={(size) => {
                      setLimit(size);
                      setCurrentPage(1);
                    }}
                  />
                </>
              )
            )}
          </div>
        </>
      ) : (
        <BetResultScore day={activeDay} sport={sport} />
      )}
    </div>
  );
};

export default BetResult;
