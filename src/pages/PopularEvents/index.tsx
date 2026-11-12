import { useHomePage } from '@/pages/Home/hooks/useHomePage';
import { PopularEvent, useGetPopularEventsQuery } from '@/store/api/popularApi';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const getSportPath = (sport?: string) => {
  const normalizedSport = sport?.toLowerCase();

  if (normalizedSport === 'soccer') return 'football';
  if (normalizedSport === 'football' || normalizedSport === 'tennis') return normalizedSport;

  return 'cricket';
};

const getPopularEventPath = (event: PopularEvent) => {
  const sportPath = getSportPath(event.sport);
  const competitionId = event.competitionId ?? 0;

  return `/sports/${sportPath}/${competitionId}/market-details/${event.id}`;
};

const PopularEvents = () => {
  const { isAuthenticated } = useHomePage();
  const { data, isLoading, isFetching } = useGetPopularEventsQuery();
  const popularEvents = data?.events ?? [];
  const isPopularEventsLoading = isLoading || isFetching;

  return (
    <div className={`flex flex-col font-tamoha ${isAuthenticated ? 'py-4' : ''}`}>
      {isPopularEventsLoading ? (
        <div className="flex justify-center items-center gap-x-1 py-8 text-[#213b49]">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Loading events...
        </div>
      ) : popularEvents.length > 0 ? (
        <div className="space-y-0">
          {popularEvents.map((event) => (
            <Link
              key={event.id}
              to={getPopularEventPath(event)}
              className="flex min-h-[50px] cursor-pointer items-center gap-2 border-b border-[#8ed6e7] bg-[linear-gradient(180deg,_#0865bb_0%,_#08aee0_100%)] px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] transition hover:brightness-105"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center text-white">
                <img src="/icons/cricket.svg" alt="" className="h-7 w-7 invert" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-[13px] font-bold leading-4 text-white">
                  {event.name}
                </span>
                <span className="mt-1 inline-flex rounded-[4px] bg-[#158b25] px-2 py-[2px] text-[10px] font-bold leading-none text-white">
                  {event.sport}
                </span>
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white py-8 text-center text-xs font-semibold text-[#24343e]">
          There are no popular events to be displayed.
        </div>
      )}
    </div>
  );
};

export default PopularEvents;
