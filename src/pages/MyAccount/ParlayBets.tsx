import { useState } from 'react';
import PageHeader from './components/PageHeader';
import ParlayBetsTabs from './components/ParlayBetsTabs';
import ParlayBetsFilter from './components/ParlayBetsFilter';
import ParlayBetsHistory from './components/ParlayBetsHistory';
import ParlayProfitLoss from './components/ParlayProfitLoss';

export default function ParlayBets() {
  const [activeTab, setActiveTab] = useState<'history' | 'pl'>('history');

  return (
    <div className="bg-white border border-[#d7d7d7]">
      <PageHeader title="Parlay Bets" />

      <div className="px-[14px] pb-5">
        <ParlayBetsTabs activeTab={activeTab} onChange={setActiveTab} />

        <ParlayBetsFilter buttonText={activeTab === 'history' ? 'Get History' : 'Get P & L'} />

        {activeTab === 'history' ? <ParlayBetsHistory /> : <ParlayProfitLoss />}
      </div>
    </div>
  );
}
