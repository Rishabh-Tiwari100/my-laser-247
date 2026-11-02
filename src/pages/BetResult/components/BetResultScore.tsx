import LoaderTwo from '@/components/common/LoaderTwo';
import { useIsAuthenticated } from '@/hooks';
import { useGetBetResultScoreQuery } from '@/store/api/betResultApi';
import { BetResultScoreItem } from '@/types/betResult';
import { useEffect, useMemo, useState } from 'react';

const SCORE_PAGE_LIMIT = 20;

const BetResultScore = ({ day, sport }: { day: 'Today' | 'Yesterday'; sport: string }) => {
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<BetResultScoreItem[]>([]);
  const isAuthenticated = useIsAuthenticated();

  const queryParams = useMemo(
    () => ({
      day: day.toLowerCase(),
      sport: sport !== 'All' ? sport : '',
      page,
      limit: SCORE_PAGE_LIMIT,
    }),
    [day, sport, page]
  );

  const { data, isLoading, isFetching, isError } = useGetBetResultScoreQuery(queryParams, {
    skip: !day && !sport && !isAuthenticated,
  });

  useEffect(() => {
    setPage(1);
    setRows([]);
  }, [day, sport]);

  useEffect(() => {
    if (!data?.results) return;

    setRows((prevRows) => (page === 1 ? data.results : [...prevRows, ...data.results]));
  }, [data, page]);

  const hasMore = (data?.pagination?.totalPage ?? 1) > page;
  const isInitialLoading = (isLoading || isFetching) && page === 1 && rows.length === 0;
  const isLoadingMore = isFetching && page > 1;

  if (isInitialLoading) {
    return (
      <div className="px-2 pt-8 flex justify-center">
        <LoaderTwo text="Loading events..." />
      </div>
    );
  }

  return (
    <div className="font-poppins font-medium">
      <div className="mt-3 border border-gray-300 overflow-hidden">
        {/* Header */}
        <div className="bg-primary-dark2 text-white text-sm font-semibold px-2 py-1">Result</div>

        {/* Error */}
        {!isLoading && !isFetching && isError && (
          <div className="px-2 py-3 text-sm text-red-500">Failed to load result score.</div>
        )}

        {/* Table */}
        {!isError && (
          <div className="overflow-x-auto">
            <table className="min-w-[700px] w-full text-sm text-primary-dark2">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-2 py-1.5 text-left font-semibold">Event Date/Time</th>
                  <th className="pr-2 py-1.5 text-left font-semibold">Event Name</th>
                  <th className="px-2 py-1.5 text-right font-semibold">Home</th>
                  <th className="px-2 py-1.5 text-right font-semibold">Away</th>
                </tr>
              </thead>

              <tbody>
                {!isLoading && !isFetching && rows.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-4">
                      There are no events to be displayed.
                    </td>
                  </tr>
                )}

                {!isLoading &&
                  !isFetching &&
                  rows.map((row, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-gray-200 bg-white hover:bg-gray-50 text-[11.5px] lg:text-sm"
                    >
                      <td className="px-2 py-1.5 whitespace-nowrap">{row.eventDate}</td>
                      <td className="pr-2 py-1.5 ">
                        <span className="line-clamp-1">{row.eventName}</span>
                      </td>
                      <td className="px-2 py-1.5 text-right font-semibold">{row.home}</td>
                      <td className="px-2 py-1.5 text-right font-semibold">{row.away}</td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {!isError && rows.length > 0 && hasMore && (
              <div className="flex justify-center px-2 py-3 border-t border-gray-200 bg-white">
                <button
                  type="button"
                  onClick={() => setPage((prev) => prev + 1)}
                  disabled={isLoadingMore}
                  className="px-4 py-1.5 text-sm rounded border border-primary-dark2 text-primary-dark2 hover:bg-gray-100 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoadingMore ? 'Loading...' : 'Show more'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BetResultScore;
