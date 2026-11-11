import MarketOddsHeader from './MarketOddsHeader';
import React from 'react';
import NormalMarketRow from './NormalMarketRow';
import { Market } from '@/store/api/catalogueApi';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAddToMultiMarketMutation } from '@/store/api/eventsApi';
import { type StakeLimitValue } from './stakeLimit';
import MarketInfoButton from './MarketInfoButton';

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
            <p className="uppercase h-[31px] text-white font-bold pr-[10px] pl-[10px] relative text-[12px] bg-[#213b49] flex items-center">
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
                    className="h-auto w-[22px] min-w-[22px]"
                  />
                </button>
              )}
              <span className="max-w-[160px] leading-[normal]">{data?.marketName}</span>
              <MarketInfoButton marketName={data.marketName} marketType={data.marketType} />
            </p>
          </div>
        </div>
        <MarketOddsHeader min={min} max={max} />
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
