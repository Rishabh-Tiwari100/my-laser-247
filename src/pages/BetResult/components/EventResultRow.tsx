import LoaderTwo from '@/components/common/LoaderTwo';
import { useLazyGetResultByEventIdQuery } from '@/store/api/betResultApi';
import { BetResultItem } from '@/types/betResult';
import { Icons } from '@/utils/icons';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

const EventResultRow = ({
  eventId,
  eventName,
  startTime,
}: {
  eventId: string;
  eventName: string;
  startTime?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<BetResultItem[]>([]);
  const [fetchResult, { data, isFetching, isError }] = useLazyGetResultByEventIdQuery();

  useEffect(() => {
    if (!isOpen) return;
    setPage(1);
    setRows([]);
  }, [isOpen, eventId]);

  useEffect(() => {
    if (!isOpen) return;
    fetchResult({
      eventId,
      page,
      limit: 10,
    });
  }, [isOpen, fetchResult, eventId, page]);

  useEffect(() => {
    const fetchedRows = data?.results ?? [];
    setRows((prevRows) => (page === 1 ? fetchedRows : [...prevRows, ...fetchedRows]));
  }, [data, page]);

  const results = rows;
  const hasMore = (data?.pagination?.totalPage ?? 1) > page;
  const isInitialLoading = isFetching && page === 1 && rows.length === 0;
  const isLoadingMore = isFetching && page > 1;
  const formattedTime = startTime ? dayjs(startTime).format('YYYY/MM/DD HH:mm:ss') : '-';

  return (
    <div className="border border-primary-dark2 rounded overflow-hidden">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-primary-dark-300 text-white px-2 py-2 text-left"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 md:gap-3 min-w-0 w-full">
          <div className="w-full flex flex-col md:flex-row items-center justify-between md:justify-start md:gap-3 min-w-0">
            <div className="max-md:w-full flex justify-between">
              <span className="text-xs font-semibold whitespace-nowrap rounded-sm bg-primary/60 p-1">
                {formattedTime}
              </span>

              <div className="flex md:hidden items-center gap-2 text-xs text-gray-300">
                <span className="inline-flex items-center justify-center w-5 h-5 text-white rounded border border-white/40 bg-primary-dark shrink-0">
                  {isOpen ? (
                    <Icons.minus className="w-4 h-4" />
                  ) : (
                    <Icons.plus className="w-4 h-4" />
                  )}
                </span>
              </div>
            </div>

            <div className="self-start text-13 max-lg:mt-1 lg:text-sm font-medium line-clamp-1">
              {eventName}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs text-gray-300">
            <span className="inline-flex items-center justify-center w-5 h-5 text-white rounded border border-white/40 bg-primary-dark shrink-0">
              {isOpen ? <Icons.minus className="w-4 h-4" /> : <Icons.plus className="w-4 h-4" />}
            </span>
          </div>
        </div>
      </button>

      {isOpen && (
        <div className="bg-white text-black">
          <div className="hidden sm:grid grid-cols-2 gap-2 text-xs font-semibold uppercase bg-gray-200 px-3 py-2 border-b">
            <span className="col-span-1">Market Name</span>
            <span className="col-span-1 text-right">Result(Runs)</span>
          </div>

          {isInitialLoading && (
            <LoaderTwo text="Loading result..." className="justify-center pt-2" />
          )}

          {!isFetching && isError && rows.length === 0 && (
            <div className="px-3 py-3 text-sm text-red-500">Failed to load results.</div>
          )}

          {!isFetching && !isError && results.length === 0 && (
            <div className="px-3 py-3 text-sm text-gray-500">
              There are no events to be displayed.
            </div>
          )}

          {!isInitialLoading && !isError && results.length > 0 && (
            <div className="divide-y divide-gray-300">
              {results.map((item, idx) => (
                <div
                  key={`${item.marketId ?? idx}`}
                  className="flex flex-col sm:grid sm:grid-cols-2 gap-1 px-2 sm:px-4 py-2 text-[13px] md:text-sm"
                >
                  <div className="sm:col-span-1 inline-flex items-center">
                    <span className="sm:hidden whitespace-nowrap text-xs uppercase text-gray-500 mr-2">
                      Market Name:
                    </span>
                    <span className="truncate">{item.marketName || '-'}</span>
                  </div>

                  <div className="sm:col-span-1 sm:text-right">
                    <span className="sm:hidden text-xs uppercase text-gray-500 mr-2">Winner:</span>
                    {item.winnerName || '-'}
                  </div>
                </div>
              ))}

              {hasMore && (
                <div className="px-3 py-3 bg-white border-t border-gray-200 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setPage((prev) => prev + 1)}
                    disabled={isLoadingMore}
                    className="px-4 py-1.5 text-sm rounded border border-primary-dark2 text-primary-dark2 hover:bg-gray-100 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isLoadingMore ? (
                      <LoaderTwo text="Loading..." className="justify-center pt-2" />
                    ) : (
                      'Show more'
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EventResultRow;
