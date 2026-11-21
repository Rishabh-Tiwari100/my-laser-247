import { useState } from 'react';
import type { BettingConfig, PremiumMarket as PremiumMarketData } from '@/types/sportsCatalogue';
import { getFilteredMarkets } from '../helpers';
import PremiumMarket from './PremiumMarket';
import PremiumMarketToolbar from './PremiumMarketToolbar';

interface PremiumMarketPanelProps {
  markets: Record<string, PremiumMarketData[]>;
  tabs: string[];
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenBets: () => void;
  sport: string;
  betConfig?: BettingConfig;
}

export default function PremiumMarketPanel({
  markets,
  tabs,
  activeTab,
  onSelectTab,
  onOpenBets,
  sport,
  betConfig,
}: PremiumMarketPanelProps) {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const visibleMarkets = getFilteredMarkets(markets, activeTab, sport);
  const firstMarket = visibleMarkets[0];

  return (
    <div
      ref={setContainer}
      className="relative isolate border-x border-b border-[#d1d1d1] bg-white px-[2px] pb-[2px]"
    >
      <PremiumMarketToolbar
        infoContainer={container}
        tabs={tabs}
        activeTab={activeTab}
        onSelectTab={onSelectTab}
        onOpenBets={onOpenBets}
        min={betConfig?.minBetAmount ?? firstMarket?.minBetAmount}
        max={betConfig?.maxBetAmount ?? firstMarket?.maxBetAmount}
      />
      {/* A fresh list resets scroll and expansion only when the category changes. */}
      <div key={activeTab} aria-label="Premium markets" className="max-h-[700px] overflow-y-auto">
        {visibleMarkets.map((market, index) => (
          <PremiumMarket
            key={market.marketId ?? index}
            market={market}
            betConfig={betConfig}
            defaultExpanded={index < 4}
          />
        ))}
        {visibleMarkets.length === 0 && (
          <p role="status" className="px-3 py-6 text-center text-[13px] text-[#526575]">
            No premium markets are currently available in this category.
          </p>
        )}
      </div>
    </div>
  );
}
