import { valueFormatter } from '@/utils';
import React from 'react';
import NormalMarketRow from './NormalMarketRow';
import { Market } from '@/store/api/catalogueApi';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAddToMultiMarketMutation } from '@/store/api/eventsApi';

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

  const onTogglePin = (isPinned: boolean) => {
    try {
      if (!eventId) {
        toast.error('Event ID is missing');
        return;
      }
      const status = isPinned ? 'UNFAVORITE' : 'FAVORITE';
      addToMultiMarket({ eventId: Number(eventId), status }).unwrap();
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
        <div className="grid grid-cols-12 border border-[#7e97a7] text-white">
          <div className="col-span-12">
            <p className="uppercase h-[30px] text-white font-semibold pr-[30px] pl-[10px] relative text-xs bg-primary-theme flex items-center">
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
              <span className="max-w-[160px] leading-[normal]">{data?.marketName}</span>
            </p>
          </div>
        </div>
        <div className="">
          <div className="grid items-center border border-[#7e97a7] text-black grid-cols-12 lg:hidden">
            <div className="col-span-7 md:col-span-5 bg-[#bed5d8] leading-[11px] rounded-[1px]">
              <dl className="max-lg:py-[clamp(7px,0.75vw,13px)] max-lg:px-[5px] lg:p-[clamp(5px,10vw,12.5px)_5px] text-left">
                <dt className="text-[#315195] text-[9px] inline-block mr-2 font-bold">Min/Max</dt>
                <dd className="text-[9px] inline-block">
                  {min ? valueFormatter.format(Number(min)) : ''} -
                  {max ? valueFormatter.format(Number(max)) : ''}
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

          <div className="grid items-center border border-[#7e97a7] text-black grid-cols-12">
            <div className="col-span-7 md:col-span-5 bg-[#bed5d8] leading-[11px] rounded-[1px]"></div>
            <div className="col-span-5 md:col-span-7 hidden lg:grid grid-cols-5 items-center">
              <button></button>
              <button></button>
              <button className="text-[13px] capitalize font-semibold h-fit py-1 border-none bg-[#72bbef] rounded-tl-[12px]">
                Back
              </button>
              <button className="text-[13px] capitalize font-semibold h-fit py-1 border-none bg-[#faa9ba] rounded-tr-[12px]">
                Lay
              </button>
              <dl className="bg-[#bed5d8] max-lg:py-[clamp(7px,0.75vw,13px)] max-lg:px-[5px] lg:p-[clamp(5px,10vw,12.5px)_5px] text-center flex items-center justify-center">
                <dt className="text-[#315195] text-[9px] inline-block mr-2 font-bold">Min/Max</dt>
                <dd className="text-[9px] inline-block">
                  {min ? valueFormatter.format(Number(min)) : ''} -
                  {max ? valueFormatter.format(Number(max)) : ''}
                </dd>
              </dl>
            </div>
          </div>
        </div>
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
