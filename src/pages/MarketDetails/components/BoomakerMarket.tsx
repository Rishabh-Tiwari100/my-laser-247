import MarketOddsHeader from './MarketOddsHeader';
import React from 'react';
import { Market } from '@/store/api/catalogueApi';
import BookmakerMarketRow from './BookmakerMarketRow';
import { type StakeLimitValue } from './stakeLimit';
import MarketInfoButton from './MarketInfoButton';

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
  return (
    <div>
      <div className="">
        <div className="grid grid-cols-12 border border-[#7e97a7] text-white">
          <div className="col-span-12">
            <p className="uppercase h-[31px] text-white font-bold pr-[10px] pl-[10px] relative text-[12px] bg-[#213b49] flex items-center">
              <img src="/icons/pin.svg" alt="" className="mx-[5px] h-auto w-[22px] shrink-0" />
              <span className="max-w-[160px] leading-[normal]">{data?.marketName}</span>
              <MarketInfoButton marketName={data.marketName} marketType={data.marketType} />
            </p>
          </div>
        </div>
        <MarketOddsHeader min={min} max={max} bookmaker />
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
