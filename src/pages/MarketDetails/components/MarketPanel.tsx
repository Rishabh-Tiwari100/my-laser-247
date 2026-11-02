import React, { useState, useCallback } from 'react';
import { Market, Runner } from '@/types/market';
import { MarketType } from '@/types/betPlace';
import { cn } from '@/utils';
import { useLocation } from 'react-router-dom';
import InnerMarketHeader from './InnerMarketHeader';
import RunnerRow from './NormalMarketRow';

type Variation = 'primary' | 'secondary';
interface MarketPanelProps {
  eventName?: string;
  marketName?: string;
  marketData: Market;
  runnersData: Runner[];
  type?: 'inner' | 'outer';
  min?: number | string | null;
  max?: number | string | null;
  variation?: Variation;
  oddsClassName?: string;
  marketCategory: MarketType;
  defaultExpanded?: boolean;
}

const MarketPanel: React.FC<MarketPanelProps> = ({
  eventName,
  marketName,
  marketData,
  runnersData,
  type = 'inner',
  min,
  max,
  variation,
  oddsClassName,
  marketCategory,
  defaultExpanded = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const { state } = useLocation();
  const isPremiumFancy = state?.isPremiumFancy ?? false;

  const handleToggle = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  return (
    <div
      className={cn(
        'mb-2.5',
        marketCategory === 'NORMAL' ? 'md:pb-0' : '',
        isExpanded ? 'pb-1' : 'pb-0'
      )}
    >
      <InnerMarketHeader
        eventName={eventName}
        marketName={marketName}
        type={type}
        min={min}
        max={max}
        variation={variation}
        onToggle={handleToggle}
        marketCategory={marketCategory}
        isExpanded={isExpanded}
      />

      <div
        className={cn(
          'transition-all duration-200 ease-in-out overflow-hidden',
          isExpanded ? 'opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div
          className={cn(
            'md:mt-0 rounded-lg border border-primary-light md:mx-0 md:rounded-none md:border-none bg-primary/10 shadow-lg'
          )}
        >
          {/* {marketCategory !== 'PREMIUM' && (
            <div
              className={cn(
                'flex md:hidden w-full text-white text-sm font-semibold items-center justify-between py-1.5 md:py-1 px-2 rounded-t-lg',
                variation === 'primary' ? 'bg-primary-dark2' : 'bg-primary'
              )}
            >
              <div
                title={marketCategory === 'NORMAL' ? eventName : ''}
                className="flex-1 text-left text-11 sm:text-xs font-semibold uppercase"
              >
                {marketCategory === 'NORMAL' ? 'Market' : eventName}
              </div>
            </div>
          )} */}

          {/* Runners Data */}
          {runnersData.map((runner: Runner, idx: number) => (
            <RunnerRow
              key={runner.selectionId || idx}
              data={runner}
              market={marketData}
              min={min}
              max={max}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default React.memo(MarketPanel, (prev, next) => {
  return (
    prev.marketData.marketId === next.marketData.marketId &&
    prev.marketCategory === next.marketCategory &&
    prev.min === next.min &&
    prev.max === next.max &&
    prev.runnersData === next.runnersData
  );
});
