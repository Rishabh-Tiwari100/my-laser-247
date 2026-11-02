import { useState } from 'react';
import ProductTabs from './ProductTabs';
import HistoryFilter from './HistoryFilter';

export default function BetsHistory() {
  const [tab, setTab] = useState<
    'all' | 'exchange' | 'fancy' | 'bookmaker' | 'sportsbook' | 'binary'
  >('all');

  return (
    <>
      <ProductTabs active={tab} onChange={setTab} />

      <HistoryFilter />

      <div className="pt-3 text-[13px] leading-5">
        <p>Betting History enables you to review the bets you have placed.</p>

        <p>
          Specify the time period during which your bets were placed, the type of markets on which
          the bets were placed, and the sport.
        </p>

        <p className="mt-2">Betting History is available online for the past 30 days.</p>
      </div>
    </>
  );
}
