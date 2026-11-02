import React from 'react';
import { Market } from '@/store/api/catalogueApi';
import BookmakerMarketRow from './BookmakerMarketRow';
import { useParams } from 'react-router-dom';
import { useCashOut } from '@/hooks/useCashOut';
import { formatStakeLimitRange, type StakeLimitValue } from './stakeLimit';

const BookmakerMarket = ({
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

  return (
    <div>
      <div className="">
        <div className="grid grid-cols-12 border border-[#7e97a7] text-white">
          <div className="col-span-12">
            <p className="uppercase h-[30px] text-white font-semibold pr-[30px] pl-[10px] relative text-xs bg-primary-theme flex items-center">
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
        <div className="grid h-9 grid-cols-12 border border-[#7e97a7] bg-[#bed5d8] text-black">
          <dl className="col-span-7 flex items-center gap-2 px-2 leading-none md:col-span-5">
            <dt className="text-[9px] font-bold text-[#315195]">Min/Max</dt>
            <dd className="text-[9px] font-semibold">
              {formatStakeLimitRange(min, max)}
            </dd>
          </dl>
          <div className="col-span-5 grid grid-cols-2 overflow-hidden rounded-t-xl md:col-span-7">
            <div className="flex items-center justify-center bg-[#72bbef] text-[13px] font-semibold">
              Back
            </div>
            <div className="flex items-center justify-center bg-[#faa9ba] text-[13px] font-semibold">
              Lay
            </div>
          </div>
        </div>
      </div>
      {data?.runners?.map((item, idx) => (
        <BookmakerMarketRow
          key={String(item.selectionId ?? idx)}
          data={item}
          market={data}
          min={min}
          max={max}
        />
      ))}
    </div>
  );
};

export default BookmakerMarket;
