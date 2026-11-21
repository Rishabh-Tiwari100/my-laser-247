import { cn } from '@/lib/utils';
import PremiumMarketInfoButton from './PremiumMarketInfoButton';
import type { StakeLimitValue } from './stakeLimit';

interface PremiumMarketToolbarProps {
  tabs: string[];
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenBets: () => void;
  min?: StakeLimitValue;
  max?: StakeLimitValue;
  infoContainer: HTMLElement | null;
}

export default function PremiumMarketToolbar({
  tabs,
  activeTab,
  onSelectTab,
  onOpenBets,
  min,
  max,
  infoContainer,
}: PremiumMarketToolbarProps) {
  const tabClassName =
    'flex h-[32px] min-w-[60px] shrink-0 items-center justify-center whitespace-nowrap border-b-2 border-r border-r-white bg-[#70c2eb] px-[16px] text-[12px] font-bold leading-[15px] text-white sm:flex-1';
  return (
    <div className="flex flex-wrap items-stretch bg-[#f2f2f2] pt-[8px] font-[Roboto,Helvetica,Arial,sans-serif] text-black sm:flex-nowrap">
      <div
        className="flex min-w-0 basis-full overflow-x-auto overscroll-x-contain [scrollbar-width:none] sm:basis-auto sm:flex-1"
        aria-label="Premium market categories"
      >
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            aria-pressed={activeTab === tab}
            onClick={() => onSelectTab(tab)}
            className={cn(
              tabClassName,
              activeTab === tab ? 'border-b-[#1976d2] bg-[#50b7ea]' : 'border-b-transparent'
            )}
          >
            {tab}
          </button>
        ))}
        <button
          type="button"
          onClick={onOpenBets}
          className={cn(tabClassName, 'border-b-transparent')}
        >
          My Bets
        </button>
        <PremiumMarketInfoButton container={infoContainer} />
      </div>
      <div
        className="flex min-h-[20px] flex-1 items-center justify-end gap-[4px] whitespace-nowrap px-[8px] text-[12px] leading-[18px] sm:min-h-[32px] sm:flex-none sm:justify-start sm:text-[14px] sm:font-bold"
        aria-label="Premium betting limits"
      >
        <span>Min: {min ?? 0}</span>
        <span>Max: {max ?? 0}</span>
      </div>
    </div>
  );
}
