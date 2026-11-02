import React, { useEffect, useMemo, useState } from 'react';
import AffiliateWelcome from './components/AffiliateWelcome';
import AffiliateDashboard from './components/AffiliateDashboard';
import MyReferrals from './components/MyReferrals';
import WeeklyCommissionReport from './components/WeeklyCommissionReport';
import TabFilter from '@/components/common/TabFilter';
import BackButton from '@/components/common/BackButton';
import { useGetAffiliateDashboardQuery } from '@/store/api/affiliateApi';

const categoryTabs = ['Dashboard', 'My Referrals', 'Weekly Commission Report'];

const Affiliate: React.FC = () => {
  const { data } = useGetAffiliateDashboardQuery();
  const [activeTab, setActiveTab] = useState('Dashboard');

  const showStatusBasedContent = () => {
    if (data?.status === 'Approved') {
      return (
        <>
          <BackButton />
          <TabFilter
            tabs={categoryTabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            className="my-3.5"
          />
          {activeTab === 'Dashboard' && <AffiliateDashboard dashboardDetails={data} />}
          {activeTab === 'My Referrals' && <MyReferrals />}
          {activeTab === 'Weekly Commission Report' && <WeeklyCommissionReport />}
        </>
      );
    } else {
      return (
        <AffiliateWelcome
          status={data?.status}
          reason={data?.status === 'Rejected' ? data.reason : ''}
        />
      );
    }
  };

  return <section className="w-full px-2 py-3 sm:p-5">{showStatusBasedContent()}</section>;
};

export default Affiliate;
