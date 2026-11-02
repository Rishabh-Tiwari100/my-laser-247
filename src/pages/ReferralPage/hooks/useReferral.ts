import { useMemo, useRef, useState } from 'react';
import { debounce } from '@/utils';
import { FiUsers, FiTrendingUp, FiBarChart2 } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useGetReferralTotalsQuery, useGetUserBonusSummaryQuery } from '@/store/api/referralApi';
import { useClipboard } from '@/hooks';

export const useReferral = () => {
  const { copy } = useClipboard();
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const referralCode = useSelector((state: RootState) => state.user.profile?.referralCode);
  const baseUrl = import.meta.env.VITE_APP_URL || window.location.origin;

  const { data: bonusSummary, isLoading: summaryLoading } = useGetUserBonusSummaryQuery();

  const { data: referralTotals, isLoading: totalsLoading } = useGetReferralTotalsQuery();

  const referralSummary = useMemo(() => {
    return [
      {
        title: 'Total Referrals',
        value: String(bonusSummary?.totalReferralUsers ?? 0),
        sub: `${bonusSummary?.totalReferralUsers ?? 0} active users`,
        bg: 'bg-green-50',
        border: 'border border-primary',
        text: 'text-primary',
        icon: FiUsers,
      },
      {
        title: 'Total Earnings',
        value: `৳${Number(bonusSummary?.lifetimeEarnings ?? 0).toLocaleString()}`,
        sub: 'All-time referral income',
        bg: 'bg-indigo-50',
        border: 'border border-indigo-500',
        text: 'text-indigo-700',
        icon: FiTrendingUp,
      },
      {
        title: 'This Month',
        value: `৳${Number(bonusSummary?.thisMonthEarnings ?? 0).toLocaleString()}`,
        sub: 'Current month referral income',
        bg: 'bg-orange-50',
        border: 'border border-orange-400',
        text: 'text-orange-700',
        icon: FiBarChart2,
      },
    ];
  }, [bonusSummary]);

  const referralBonusCards = useMemo(() => {
    return [
      {
        title: 'Referral Deposit Bonus',
        value: `৳${Number(referralTotals?.referralDepositBonus ?? 0).toLocaleString()}`,
        sub: 'From referred user deposit',
        bg: 'bg-gradient-secondary',
        border: 'border-r-2 border-b-2 border-black',
        text: 'text-black',
        titleClassName: 'text-white',
        subTitleClassName: 'text-gray-600 font-medium',
      },
      {
        title: 'Loss Commission',
        value: `৳${Number(referralTotals?.referralLossCommissionBonus ?? 0).toLocaleString()}`,
        sub: 'From referred user losses',
        bg: 'bg-gradient-secondary',
        border: 'border-r-2 border-b-2 border-black',
        text: 'text-black',
        titleClassName: 'text-white',
        subTitleClassName: 'text-gray-600 font-medium',
      },
    ];
  }, [referralTotals]);

  const referralLink = referralCode ? `${baseUrl}/register?ref=${referralCode}` : '';

  return {
    // state
    showHowItWorks,
    setShowHowItWorks,
    copy,

    // API state
    summaryLoading,
    totalsLoading,

    // data
    referralCode,
    referralSummary,
    referralBonusCards,
    referralLink,
  };
};
