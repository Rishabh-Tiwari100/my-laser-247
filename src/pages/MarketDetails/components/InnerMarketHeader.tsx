import React from 'react';
import clsx from 'clsx';
import { useLocation } from 'react-router-dom';
import { Icons } from '@/utils/icons';
import { formatStakeLimit, formatStakeLimitRange } from './stakeLimit';
import MarketInfoButton from './MarketInfoButton';

type Variation = 'primary' | 'secondary';

interface MatchInnerMarketHeaderProps {
  marketName?: string;
  selectionCount?: number;
  min?: number | string | null;
  max?: number | string | null;
  eventName?: string;
  type?: 'inner' | 'outer';
  variation?: Variation;
  isExpanded?: boolean;
  marketCategory?: string;
  onToggle?: () => void;
}

const InnerMarketHeader: React.FC<MatchInnerMarketHeaderProps> = ({
  marketName = '',
  selectionCount,
  min = '',
  max = '',
  eventName = 'MARKET',
  type = 'outer',
  variation,
  isExpanded,
  marketCategory,
  onToggle,
}) => {
  const isInner = type === 'inner';
  const isPremium = marketCategory === 'PREMIUM';
  const { state } = useLocation();
  const isPremiumFancy = state?.isPremiumFancy ?? false;

  const MinMax = ({ className }: { className: string }) => (
    <div className={className}>
      <div className="flex gap-x-0.5">
        <span>MIN:</span> {formatStakeLimit(min)}
      </div>
      <div className="flex gap-x-0.5">
        <span>MAX:</span> {formatStakeLimit(max)}
      </div>
    </div>
  );

  return (
    <div className="">
      <div className="grid grid-cols-12 border border-[#7e97a7] text-white">
        <div className="col-span-12">
          <p className="uppercase h-[30px] text-white font-semibold pr-[30px] pl-[10px] relative text-xs bg-primary-theme flex items-center">
            <span className="max-w-[160px] leading-[normal]">{marketName}</span>
            <MarketInfoButton marketName={marketName} marketType={marketCategory} />
            <span className="text-[10px] leading-[normal]"></span>
          </p>
        </div>
      </div>
      <div className="">
        <div className="grid items-center border border-[#7e97a7] text-white grid-cols-12">
          <div className="col-span-7 md:col-span-5">
            <div className="p-[2px] block lg:hidden text-center text-black">
              <dl className="p-[5px] bg-[#bed5d8] leading-[11px] rounded-[1px] text-left">
                <dt className="text-[9px] text-[#315195] inline-block mr-2 font-bold">Min/Max</dt>
                <dd className="text-[9px] inline-block">{formatStakeLimitRange(min, max)}</dd>
              </dl>
            </div>
          </div>
          <div className="col-span-5 md:col-span-7">
            <div className="rounded-[6px] w-full grid grid-cols-12 md:gap-[2px] text-black">
              <button className="text-[13px] capitalize col-span-2 font-semibold h-[42.2px] py-1 border-none max-lg:hidden"></button>
              <button className="text-[13px] capitalize col-span-2 font-semibold h-[42.2px] py-1 border-none max-lg:hidden"></button>
              <button className="text-[13px] capitalize col-span-6 lg:col-span-2 font-semibold h-[42.2px] py-1 border-none bg-[#72bbef] rounded-tl-[12px] my-[2px]">
                Back
              </button>
              <button className="text-[13px] capitalize col-span-6 lg:col-span-2 font-semibold h-[42.2px] py-1 border-none bg-[#faa9ba] rounded-tr-[12px] my-[2px]">
                Lay
              </button>
              <button className="text-[13px] capitalize col-span-4 font-semibold h-[42.2px] py-1 border-none px-[3px] max-lg:hidden">
                <dl className="text-center p-[5px] bg-[#bed5d8] leading-[11px] rounded-[1px]">
                  <dt className="text-[9px] text-[#315195] inline-block mr-2 font-bold">Min/Max</dt>
                  <dd className="inline-block text-[9px]">{formatStakeLimitRange(min, max)}</dd>
                </dl>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InnerMarketHeader;
