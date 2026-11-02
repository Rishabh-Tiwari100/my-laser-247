import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { FiGift, FiTrendingUp, FiClock } from 'react-icons/fi';
import {
  useGetBonusEarningsQuery,
  useGetBonusTotalSummaryQuery,
  useGetBonusStatementQuery,
  useGetBonusTurnoverQuery,
} from '@/store/api/bonusApi';
import { SummaryCardItem } from '@/components/common/SummaryCard';
import { BonusTurnoverStatus } from '@/types/bonus';
import { formatNumber } from '@/utils';

export type ActiveCategory = 'Bonus Turnover' | 'Bonus Statement';

export const useBonusStatement = () => {
  const [activeCategory, setActiveCategory] = useState<ActiveCategory>('Bonus Turnover');

  const [activeStatus, setActiveStatus] = useState<BonusTurnoverStatus>('ACTIVE');

  const [fromDate, setFromDate] = useState<Date | undefined>(dayjs().subtract(7, 'day').toDate());
  const [toDate, setToDate] = useState<Date | undefined>(dayjs().toDate());

  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data: turnoverData, isLoading: turnOverLoading } = useGetBonusTurnoverQuery({
    status: activeStatus,
  });
  // const turnOverTotalPages=turnoverData?.pagination||0
  const { data: totalSummary, isLoading: summaryLoading } = useGetBonusTotalSummaryQuery();

  const { data: earnings, isLoading: earningsLoading } = useGetBonusEarningsQuery();

  const { data: statementRes, isFetching: statementFetching } = useGetBonusStatementQuery(
    {
      fromDate: fromDate ? dayjs(fromDate).startOf('day').toISOString() : undefined,
      toDate: toDate ? dayjs(toDate).endOf('day').toISOString() : undefined,
      page,
      limit,
    },
    { skip: activeCategory !== 'Bonus Statement' }
  );

  const bonusItems: SummaryCardItem[] = useMemo(() => {
    return [
      {
        title: 'Total Earnings',
        value: `৳${formatNumber(earnings?.lifetime ?? 0)}`,
        sub: 'Life time bonus earnings',
        bg: 'bg-blue-50 border border-blue-500',
        text: 'text-blue-600',
        icon: FiGift,
      },
      {
        title: 'This Month',
        value: `৳${formatNumber(earnings?.thisMonth ?? 0)}`,
        sub: 'Current month bonus earnings',
        bg: 'bg-orange-100 border border-orange-300',
        text: 'text-orange-700',
        icon: FiTrendingUp,
      },
      {
        title: 'Previous Month',
        value: `৳${formatNumber(earnings?.previousMonth ?? 0)}`,
        sub: 'Previous month bonus earnings',
        bg: 'bg-pink-100 border border-pink-300',
        text: 'text-pink-700',
        icon: FiClock,
      },
    ];
  }, [earnings]);

  const balanceSummaryItems: SummaryCardItem[] = useMemo(() => {
    return [
      {
        title: 'Joining Bonus',
        value: `৳${formatNumber(totalSummary?.totalJoiningBonus ?? 0)}`,
        sub: 'Signup reward bonus',
        bg: 'bg-gradient-secondary border-r-2 border-b-2 border-black',
        text: 'text-black',
        titleClassName: 'text-white',
        subTitleClassName: 'text-black',
      },
      {
        title: 'Referral Bonus',
        value: `৳${formatNumber(totalSummary?.totalReferralBonus ?? 0)}`,
        sub: 'Referral deposit reward',
        bg: 'bg-gradient-secondary border-r-2 border-b-2 border-black',
        text: 'text-black',
        titleClassName: 'text-white',
        subTitleClassName: 'text-black',
      },
      {
        title: 'Referral Loss Commission',
        value: `৳${formatNumber(totalSummary?.totalReferralLossCommissionBonus ?? 0)}`,
        sub: 'From referred user losses',
        bg: 'bg-gradient-secondary border-r-2 border-b-2 border-black',
        text: 'text-black',
        titleClassName: 'text-white',
        subTitleClassName: 'text-black',
      },
      {
        title: 'Loss-Back Bonus',
        value: `৳${formatNumber(totalSummary?.totalLossBackBonus ?? 0)}`,
        sub: 'Loss cashback bonus',
        bg: 'bg-gradient-secondary border-r-2 border-b-2 border-black',
        text: 'text-black',
        titleClassName: 'text-white',
        subTitleClassName: 'text-black',
      },
      {
        title: 'Refill Bonus',
        value: `৳${formatNumber(totalSummary?.totalRefillBonus ?? 0)}`,
        sub: 'Deposit refill bonus',
        bg: 'bg-gradient-secondary border-r-2 border-b-2 border-black',
        text: 'text-black',
        titleClassName: 'text-white',
        subTitleClassName: 'text-black',
      },
    ];
  }, [totalSummary]);
  // console.log('statementRes', statementRes);

  return {
    // ui
    activeCategory,
    setActiveCategory,
    activeStatus,
    setActiveStatus,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    showHowItWorks,
    setShowHowItWorks,

    // pagination (statement)
    page,
    setPage,
    limit,
    setLimit,

    // loading
    summaryLoading,
    earningsLoading,
    statementFetching,

    // data
    bonusItems,
    balanceSummaryItems,
    statementData: statementRes?.data ?? [],
    statementTotal: statementRes?.pagination?.totalItems ?? 0,
    turnoverData,
  };
};
