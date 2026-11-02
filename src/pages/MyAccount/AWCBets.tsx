import { useState } from 'react';
import PageHeader from './components/PageHeader';
import AWCBetsTabs from './components/AWCBetsTabs';
import AWCBetsFilter from './components/AWCBetsFilter';
import AWCBetsHistory from './components/AWCBetsHistory';
import AWCProfitLoss from './components/AWCProfitLoss';
export default function AWCBets() {
  const [activeTab, setActiveTab] = useState<'history' | 'pl'>('history');

  return (
    <div className="bg-white border border-[#d7d7d7]">
      <PageHeader title="AWC Bets" />

      <div className="px-[14px] pb-5">
        <AWCBetsTabs activeTab={activeTab} onChange={setActiveTab} />

        <AWCBetsFilter
          activeTab={activeTab}
          buttonText={activeTab === 'history' ? 'Get History' : 'Get P & L'}
        />

        {activeTab === 'history' ? <AWCBetsHistory /> : <AWCProfitLoss />}
      </div>
    </div>
  );
}
