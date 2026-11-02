import { useState } from 'react';
import ProductTabs from './ProductTabs';
import ProfitLossFilter from './ProfitLossFilter';

export default function ProfitLoss() {
  const [tab, setTab] = useState<
    'all' | 'exchange' | 'fancy' | 'bookmaker' | 'sportsbook' | 'binary'
  >('all');

  return (
    <>
      <div className="mb-4 border-b border-[#d6d6d6] pb-3">
        <h3 className="text-[16px] font-bold text-[#20384d]">Profit &amp; Loss - Main Wallet</h3>

        <div className="mt-2 flex items-center gap-5 text-[13px] text-[#2f4355]">
          <div className="flex items-center gap-2">
            <span className="text-[15px]">👤</span>
            Demo9
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[15px]">🕘</span>
            2026-06-28 8:59:59
          </div>
        </div>
      </div>

      <ProductTabs active={tab} onChange={setTab} />

      <ProfitLossFilter />

      <div className="pt-3 text-[13px] leading-5">
        <p>Bet Profit &amp; Loss enables you to review the bets you have placed.</p>

        <p>
          Specify the time period during which your bets were placed, the type of markets on which
          the bets were placed, and the sport.
        </p>

        <p className="mt-2">Bet Profit &amp;Loss is available online for the last 14 days.</p>
      </div>
    </>
  );
}
