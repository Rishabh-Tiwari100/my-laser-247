import React from 'react';
import NormalMarketRow from './NormalMarketRow';
import { Market } from '@/store/api/catalogueApi';
import toast from 'react-hot-toast';
import { useAddToMultiMarketMutation } from '@/store/api/eventsApi';
import MarketOddsHeader from '@/pages/MarketDetails/components/MarketOddsHeader';
import MarketInfoButton from '@/pages/MarketDetails/components/MarketInfoButton';

const NormalMarket = ({
  data,
  eventId,
  min = 0,
  max = 0,
}: {
  data: Market;
  eventId: string;
  min: number;
  max: number;
}) => {
  const [addToMultiMarket] = useAddToMultiMarketMutation();

  const onTogglePin = async (isPinned: boolean) => {
    try {
      if (!eventId) {
        toast.error('Event ID is missing');
        return;
      }
      const status = isPinned ? 'UNFAVORITE' : 'FAVORITE';
      await addToMultiMarket({ eventId: Number(eventId), status }).unwrap();
      toast.success(isPinned ? 'Event removed successfully.' : 'Event added successfully');
    } catch (error: any) {
      console.log('error: ', error);
      toast.error(`Failed to ${isPinned ? 'remove' : 'add'} the event`);
    }
  };
  const isPinned = true;
  return (
    <div>
      <div className="">
        <div className="flex h-[31px] items-center border border-[#7e97a7] bg-[#213b49] px-[10px] text-[12px] font-bold uppercase text-white">
          <button
            type="button"
            onClick={() => void onTogglePin(isPinned)}
            className="mx-[5px] flex shrink-0 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-1 focus-visible:outline-white"
            aria-label="Unpin event"
            aria-pressed={isPinned}
          >
            <img src="/icons/pin-green.svg" alt="" className="h-[22px] w-[22px]" />
          </button>
          <span className="min-w-0 truncate leading-normal">{data.marketName}</span>
          <MarketInfoButton marketName={data.marketName} marketType={data.marketType} />
        </div>
        <MarketOddsHeader
          min={min}
          max={max}
          bookmaker={[data.marketName, data.marketType].some((value) =>
            value?.toLowerCase().includes('bookmaker')
          )}
        />
        {data?.runners?.map((item, idx) => (
          <NormalMarketRow
            key={String(item.selectionId ?? idx)}
            data={item}
            market={data}
            eventId={eventId}
            min={min}
            max={max}
          />
        ))}
      </div>
    </div>
  );
};

export default NormalMarket;
