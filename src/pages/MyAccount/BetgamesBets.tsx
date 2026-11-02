import { useState } from 'react';
import PageHeader from './components/PageHeader';
import BetgamesTabs from './components/BetgamesTabs.tsx';
import BetgamesFilter from './components/BetgamesFilter.tsx';
import BetgamesHistory from './components/BetgamesHistory.tsx';
import BetgamesProfitLoss from './components/BetgamesProfitLoss.tsx';

export default function BetgamesBets() {
  const [activeTab, setActiveTab] = useState<'history' | 'pl'>('history');

  return (
    <div className="bg-[#fff] border border-[#d7d7d7]">
      <PageHeader title="Betgames Bets" />

      <div className="px-[14px] pb-5">
        <BetgamesTabs activeTab={activeTab} onChange={setActiveTab} />

        <BetgamesFilter buttonText={activeTab === 'history' ? 'Get History' : 'Get P & L'} />

        {activeTab === 'history' ? <BetgamesHistory /> : <BetgamesProfitLoss />}
      </div>
    </div>
  );
}
