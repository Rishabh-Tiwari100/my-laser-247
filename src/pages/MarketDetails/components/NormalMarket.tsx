import React from 'react';
import NormalMarketRow from './NormalMarketRow';
import { Market } from '@/store/api/catalogueApi';
import { useParams } from 'react-router-dom';
import { useCashOut } from '@/hooks/useCashOut';
import toast from 'react-hot-toast';
import { useAddToMultiMarketMutation } from '@/store/api/eventsApi';
import { formatStakeLimitRange, type StakeLimitValue } from './stakeLimit';

const NormalMarket = ({
  isFavorite = false,
  data,
  min = 0,
  max = 0,
}: {
  isFavorite: boolean;
  data: Market;
  min: StakeLimitValue;
  max: StakeLimitValue;
}) => {
  const { eventId } = useParams();
  const { handleCashout, bestOption, isAuthenticated, isCashoutAvailable } = useCashOut(
    eventId,
    data,
    min,
    max
  );
  const isTwoRunnerMarket = (data?.runners?.length ?? 0) === 2;
  const isCashoutEnabled = isTwoRunnerMarket && isCashoutAvailable && Boolean(bestOption);
  const [addToMultiMarket] = useAddToMultiMarketMutation();

  const onTogglePin = (isPinned: boolean) => {
    try {
      if (!eventId) {
        toast.error('Event ID is missing');
        return;
      }
      const status = isPinned ? 'UNFAVORITE' : 'FAVORITE';
      addToMultiMarket({ eventId: Number(eventId), status }).unwrap();
      toast.success(isPinned ? 'Market unpinned successfully' : 'Market pinned successfully');
    } catch (error: any) {
      console.log('error: ', error);
      toast.error(error?.data?.message || 'Failed to pin the market');
    }
  };
  const isPinned = isFavorite;

  return (
    <div>
      <div className="">
        <div className="grid grid-cols-12 border border-[#7e97a7] text-white">
          <div className="col-span-12">
            <p className="uppercase h-[30px] text-white font-semibold pr-[30px] pl-[10px] relative text-xs bg-primary-theme flex items-center">
              {data?.marketName?.toLowerCase() == 'match odds' && (
                <button
                  type="button"
                  onClick={() => onTogglePin(isPinned)}
                  className="mx-[5px] flex shrink-0 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-1 focus-visible:outline-[#243a48]"
                  aria-label={isPinned ? 'Unpin event' : 'Pin event'}
                  aria-pressed={isPinned}
                >
                  <img
                    src={isPinned ? '/icons/pin-green.svg' : '/icons/pin.svg'}
                    alt=""
                    className="w-[18px] min-w-[18px] h-auto"
                  />
                </button>
              )}
              <span className="max-w-[160px] leading-[normal]">{data?.marketName}</span>
              <span className="text-[10px] leading-[normal]">
                {isAuthenticated && isTwoRunnerMarket ? (
                  <button
                    type="button"
                    className="ml-[5px] rounded-[3px] bg-[#ffe500] p-[2px_5px] font-medium text-black disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={!isCashoutEnabled}
                    onClick={handleCashout}
                  >
                    Cashout
                  </button>
                ) : null}
              </span>
            </p>
          </div>
        </div>
        <div className="">
          <div className="grid items-center border border-[#7e97a7] text-black grid-cols-12">
            <div className="col-span-7 md:col-span-5 bg-[#bed5d8] leading-[11px] rounded-[1px]">
              <dl className="max-lg:py-[clamp(7px,0.75vw,13px)] max-lg:px-[5px] lg:p-[clamp(5px,10vw,12.5px)_5px] text-left">
                <dt className="text-[#315195] text-[9px] inline-block mr-2 font-bold">Min/Max</dt>
                <dd className="text-[9px] inline-block">
                  {formatStakeLimitRange(min, max)}
                </dd>
              </dl>
            </div>

            <div className="col-span-5 md:col-span-7">
              <div className="relative flex align-middle rounded-[6px]">
                <button className="w-1/2 text-[13px] capitalize col-span-2 font-semibold h-fit py-1 border-none bg-[#72bbef] rounded-tl-[12px] my-[2px]">
                  Back
                </button>
                <button className="w-1/2 text-[13px] capitalize col-span-2 font-semibold h-fit py-1 border-none bg-[#faa9ba] rounded-tr-[12px] my-[2px]">
                  Lay
                </button>
              </div>
            </div>
          </div>
        </div>
        {data?.runners?.map((item, idx) => (
          <NormalMarketRow
            key={String(item.selectionId ?? idx)}
            data={item}
            market={data}
            min={min}
            max={max}
          />
        ))}
      </div>
    </div>
  );
};

export default NormalMarket;
