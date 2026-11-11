import { useGetMultiMarketQuery } from '@/store/api/eventsApi';
import React from 'react';
import NormalMarket from './components/NormalMarket';
import { getDisplayMarket } from './helpers';
import { useNavigate } from 'react-router-dom';
import Marquee from '@/components/common/Marquee';
import { Loader2 } from 'lucide-react';

const MultiMarket = () => {
  const { data, isLoading, isError } = useGetMultiMarketQuery();
  const events = data?.catalogue ?? [];
  const navigate = useNavigate();

  return (
    <div className="min-w-0 w-full pt-[2px] font-helvetica">
      <Marquee tagName="News" className="mb-px h-[26px] leading-[26px]" />
      {isLoading ? (
        <div
          role="status"
          className="flex items-center justify-center gap-2 py-8 text-sm text-[#213b49]"
        >
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading markets...
        </div>
      ) : isError ? (
        <p role="alert" className="py-4 text-sm text-[#6c757d]">
          Unable to load followed markets.
        </p>
      ) : !events.length ? (
        <div className="flow-root text-left text-[#6c757d] lg:px-[12px] max-lg:mt-[4vh] max-lg:w-[90%] max-lg:mx-auto max-lg:rounded-[1.6vw] max-lg:border max-lg:border-[#7e97a7] max-lg:p-[2.66667vw_1.86667vw_5.33333vw] max-lg:text-center max-lg:text-[#7e97a7]">
          <h3 className="my-[10px] text-[24px] font-medium leading-[1.1] text-[#343a40] max-lg:mb-[1.33333vw] max-lg:flex max-lg:items-center max-lg:justify-center max-lg:border-b max-lg:border-[#e0e6e6] max-lg:py-[1.86667vw] max-lg:text-[5.33333vw] max-lg:leading-[1.6] max-lg:text-[#7e97a7] max-lg:before:mr-[1.33333vw] max-lg:before:h-[8.53333vw] max-lg:before:w-[8.26667vw] max-lg:before:shrink-0 max-lg:before:bg-[url('/icons/nodata.svg')] max-lg:before:bg-contain max-lg:before:bg-left-top max-lg:before:bg-no-repeat max-lg:before:content-['']">
            There are currently no followed multi markets.
          </h3>
          <p className="mb-4 text-[14px] leading-[21px] max-lg:text-[4.26667vw] max-lg:leading-normal">
            Please add some markets from events.
          </p>
        </div>
      ) : (
        <div className="w-full min-w-0 space-y-1">
          {events.map((event) => {
            const matchData = getDisplayMarket(event?.markets as any);
            return (
              <div key={event.id} className="">
                {matchData ? (
                  <div>
                    <div className="bg-[#212121] text-white flex h-[24px] min-w-0 items-center justify-between px-[5px] text-[12px] leading-[18px] lg:h-[28px] lg:text-[15px]">
                      <div className="min-w-0 truncate">{event?.eventName}</div>{' '}
                      <button
                        type="button"
                        aria-label={`Open ${event.eventName}`}
                        onClick={() =>
                          navigate(
                            `/sports/cricket/${event?.competitionId}/market-details/${event.id}`
                          )
                        }
                        className="ml-2 shrink-0 cursor-pointer"
                      >
                        <img className="max-w-[13px]" src="/icons/arrow-right.svg" alt="" />
                      </button>
                    </div>
                    <NormalMarket
                      eventId={event.id}
                      data={matchData as any}
                      min={Number(matchData?.minBetAmount ?? 0)}
                      max={Number(matchData?.maxBetAmount ?? 0)}
                    />
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MultiMarket;
