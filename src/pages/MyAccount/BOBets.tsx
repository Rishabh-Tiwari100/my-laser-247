import { useState } from 'react';
import PageHeader from './components/PageHeader';
import BOBetsTabs from './components/BOBetsTabs';
import BOBetsFilter from './components/BOBetsFilter';
import BOBetsHistory from './components/BOBetsHistory';
import BOProfitLoss from './components/BOProfitLoss';

export default function BOBets() {
  const [activeTab, setActiveTab] = useState<'history' | 'pl'>('history');

  return (
    <div className="bg-white border border-[#d7d7d7]">
      <PageHeader title="BO Bets" />

      <div className="px-[14px] pb-5">
        <BOBetsTabs activeTab={activeTab} onChange={setActiveTab} />

        <BOBetsFilter buttonText={activeTab === 'history' ? 'Get History' : 'Get P & L'} />

        {activeTab === 'history' ? <BOBetsHistory /> : <BOProfitLoss />}
      </div>
    </div>
  );
}
