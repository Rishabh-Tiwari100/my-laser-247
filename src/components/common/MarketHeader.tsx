import React from 'react';
import clsx from 'clsx';
import { valueFormatter } from '@/utils';
import { useLocation } from 'react-router-dom';
import { Icons } from '@/utils/icons';

type Variation = 'primary' | 'secondary';

interface MatchMarketHeaderProps {
  marketName?: string;
  min?: number | string | null;
  max?: number | string | null;
  eventName?: string;
  type?: 'inner' | 'outer';
  variation?: Variation;
  isExpanded?: boolean;
  marketCategory?: string;
  onToggle?: () => void;
}

const MarketHeader: React.FC<MatchMarketHeaderProps> = ({
  marketName = '',
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
  const { state, pathname } = useLocation();

  const hideTitleOnSportsPages = pathname.startsWith('/sports');

  const showTitle = !hideTitleOnSportsPages;

  const isPremiumFancy = state?.isPremiumFancy ?? false;

  const MinMax = ({ className }: { className: string }) => (
    <div className={className}>
      <div className="flex gap-x-0.5">
        <span>MIN:</span> {min ? valueFormatter.format(Number(min)) : ''}
      </div>
      <div className="flex gap-x-0.5">
        <span>MAX:</span> {max ? valueFormatter.format(Number(max)) : ''}
      </div>
    </div>
  );

  return (
    <div className="w-full rounded-md">
      {/* Top Header */}
      {showTitle && variation === 'primary' && (
        <div className=" flex items-center justify-between bg-primary-slate text-white pl-3 pr-1 py-1 text-sm font-semibold">
          <span className="uppercase text-xs">{marketName}</span>

          <div className="flex gap-x-3 items-center">
            {!['cricket', 'football', 'tennis'].includes(marketName.toLowerCase()) && (
              <MinMax className="flex md:hidden text-11 md:text-xs gap-x-2 md:gap-x-2.5" />
            )}

            <button onClick={onToggle} className="text-xs">
              <Icons.minusSquare />
            </button>
          </div>
        </div>
      )}

      {!isInner ? (
        isExpanded && (
          <div className="hidden md:block bg-[#dddcd6] text-black text-xs py-1.5 px-2.5 pr-[44px]">
            <div className="grid grid-cols-3 max-w-[439px] ml-auto">
              <div className="place-self-center">1</div>
              <div className="place-self-center">X</div>
              <div className="place-self-center">2</div>
            </div>
          </div>
        )
      ) : (
        <div
          className={clsx(
            marketCategory !== 'PREMIUM' ? 'hidden' : 'flex',
            'md:flex w-full text-white text-sm font-semibold justify-between overflow-hidden',
            variation === 'primary' ? 'bg-primary-slate' : 'bg-primary-slate'
          )}
        >
          <div className="flex-1 flex gap-3 py-1 px-2">
            <Icons.pin className="size-4 shrink-0" />
            <div title={eventName} className="flex-1 text-left text-sm  font-normal">
              {eventName}
            </div>

            <div
              className={`relative flex items-center justify-center ${
                variation && 'w-max md:w-full md:max-w-[440px]'
              }`}
            >
              {/* {!isPremiumFancy && (
                <div className="flex justify-center items-center gap-1 xl:gap-2 text-sm">
                  {variation && (
                    <>
                      <span className="w-[55px] xs:w-[70px] text-center">
                        {variation === 'secondary' ? 'No' : 'Back'}
                      </span>
                      <span className="w-[55px] xs:w-[70px] text-center">
                        {variation === 'secondary' ? 'Yes' : 'Lay'}
                      </span>
                    </>
                  )}
                </div>
              )} */}

              {/* <MinMax className="hidden md:flex items-center absolute right-0 text-10 gap-x-2.5" /> */}
            </div>
          </div>
          {marketCategory === 'PREMIUM' && (
            <button
              onClick={onToggle}
              className="leading-none inline-flex items-center justify-center text-lg w-6"
            >
              <span className="border border-white text-xs flex items-center justify-center leading-none w-3.5 h-3.5 font-normal">
                -
              </span>
            </button>
          )}
        </div>
      )}
      {type !== 'outer' && (
        <div className="bg-primary-offwhite h-[30px] flex items-center border-b border-b-primary-slate/50">
          {!isPremiumFancy && (
            <div className="w-max md:w-[440px] ml-auto flex justify-center items-center text-sm font-semibold">
              {variation && (
                <>
                  <span className="text-center  w-[75px] lg:w-[55px] xl:w-[75px] 2xl:w-[100px]">
                    {variation === 'secondary' ? 'No' : 'Back'}
                  </span>
                  <span className="text-center  w-[75px] lg:w-[55px] xl:w-[75px] 2xl:w-[100px]">
                    {variation === 'secondary' ? 'Yes' : 'Lay'}
                  </span>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MarketHeader;
