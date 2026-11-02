import PageHeader from './components/PageHeader';
import MyBetsTabs from './components/MyBetsTabs';
import BetsHistory from './components/BetsHistory';
import ProfitLoss from './components/ProfitLoss';
import { useLocation, useNavigate } from 'react-router-dom';
import UnsettledBets from './components/UnsettledBets';

export default function MyBets() {
  const location = useLocation();
  const navigate = useNavigate();

  const activeTab: 'current' | 'history' | 'pl' = location.pathname.endsWith('/bet-history')
    ? 'history'
    : location.pathname.endsWith('/profit-loss')
      ? 'pl'
      : 'current';

  const setActiveTab = (tab: 'current' | 'history' | 'pl') => {
    switch (tab) {
      case 'current':
        navigate('/my-account/my-bets');
        break;

      case 'history':
        navigate('/my-account/bet-history');
        break;

      case 'pl':
        navigate('/my-account/profit-loss');
        break;
    }
  };

  if (activeTab === 'current') return <UnsettledBets />;

  return (
    <div className="bg-white border border-[#d7d7d7]">
      <PageHeader title="My Bets" />

      <div className="px-[14px] pb-5">  
        <MyBetsTabs activeTab={activeTab} onChange={setActiveTab} />

        {activeTab === 'history' && <BetsHistory />}

        {activeTab === 'pl' && <ProfitLoss />}
      </div>
    </div>
  );
}
