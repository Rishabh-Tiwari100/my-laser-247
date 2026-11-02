import React, { useEffect, useMemo, useState } from 'react';
import TurnoverCard from './components/TurnoverCard';
import HowToWorkCard from '@/components/common/HowToWorkCard';
import TabFilterTwo from '@/components/common/TabFilterTwo';
import { Icons } from '@/utils/icons';
import ReactDOM from 'react-dom';
import { FiPieChart, FiTrendingUp, FiGift, FiLock, FiArrowUpRight } from 'react-icons/fi';
import SummaryCardsCarousel from '@/components/common/SummaryCardsCarousel';
import { useGetMyWalletQuery, useGetMyWalletSummaryQuery } from '@/store/api/myWalletApi';
import Pagination from '@/components/common/Pagination';
import { formatNumber } from '@/utils';

function MyWallet() {
  const [activeTab, setActiveTab] = useState<'Active' | 'Completed'>('Active');
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { data: summaryData, isLoading: summaryLoading } = useGetMyWalletSummaryQuery();
  const { data: walletData, isFetching: walletFetching } = useGetMyWalletQuery({
    page,
    limit: pageSize,
  });

  const summary = [
    {
      title: 'Total Balance',
      value: `৳${formatNumber(summaryData?.totalBalance ?? 0)}`,
      sub: 'Available for play',
      bg: 'bg-green-50',
      border: 'border border-primary',
      text: 'text-green-700',
      icon: FiPieChart,
    },
    {
      title: 'Deposit Balance',
      value: `৳${formatNumber(summaryData?.depositBalance ?? 0)}`,
      sub: 'Deposit Balance',
      bg: 'bg-orange-50',
      border: 'border border-orange-300',
      text: 'text-orange-700',
      icon: FiTrendingUp,
    },
    {
      title: 'Bonus Balance',
      value: `৳${formatNumber(summaryData?.bonusBalance ?? 0)}`,
      sub: 'Active Bonus',
      bg: 'bg-indigo-50',
      border: 'border border-indigo-400',
      text: 'text-indigo-700',
      icon: FiGift,
    },
    {
      title: 'Locked Balance',
      value: `৳${formatNumber(summaryData?.lockedBalance ?? 0)}`,
      sub: 'Locked Amount',
      bg: 'bg-orange-50',
      border: 'border border-orange-300',
      text: 'text-orange-700',
      icon: FiLock,
    },
    {
      title: 'Available Withdrawals',
      value: `৳${formatNumber(summaryData?.availableWithdrawals ?? 0)}`,
      sub: 'Withdrawable',
      bg: 'bg-orange-50',
      border: 'border border-orange-300',
      text: 'text-orange-700',
      icon: FiArrowUpRight,
    },
  ];

  const turnoverList = useMemo(() => {
    const list = walletData?.data ?? [];
    return list.filter((item) =>
      activeTab === 'Active' ? item.status === 'Pending' : item.status === 'Completed'
    );
  }, [walletData?.data, activeTab]);

  useEffect(() => {
    setPage(1);
  }, [activeTab]);

  return (
    <div className="p-2 pb-6 md:p-2.5">
      {/* PAGE TITLE */}
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">My Wallet</h1>
          <button
            onClick={() => setShowHowItWorks((prev) => !prev)}
            className="xl:hidden border border-black rounded-md bg-gradient-to-r from-yellow-300 bg-yellow-500 p-1"
          >
            <Icons.info className="h-5 w-5" />
          </button>
        </div>
        <div className="h-[2px] bg-green-500 mt-2" />
      </div>

      {/* TOP BALANCE CARDS */}
      <div className="my-3 px-4 pt-6 pb-0 rounded-lg bg-primary-cream">
        <SummaryCardsCarousel data={summary} view="horizontal" className="!pb-7" />
      </div>

      {/* DEPOSIT TURNOVER SECTION */}
      <div className="flex flex-col lg:flex-row gap-5">
        {/* LEFT */}
        <div className="flex-1">
          <div className="flex flex-col justify-between mb-5 space-y-4">
            <h2 className="font-semibold text-lg">Deposit Turnover Progress</h2>
            <TabFilterTwo
              tabs={['Active', 'Completed']}
              activeTab={activeTab}
              setActiveTab={(t) => setActiveTab(t as 'Active' | 'Completed')}
              buttonClassName="!text-[13px] !py-1 !min-w-[120px]"
            />
          </div>

          {/* TURNOVER CARDS */}
          <div className="text-center bg-primary/10 px-2.5 py-3 rounded-xl">
            {walletFetching ? (
              <p className="text-center text-sm text-gray-500">Loading...</p>
            ) : turnoverList.length === 0 ? (
              <p className="text-center text-sm text-gray-500 py-10 capitalize">
                No {activeTab.toLowerCase()} turnover found
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {turnoverList.map((item, idx) => (
                  <TurnoverCard
                    key={idx}
                    depositAmount={item.required ?? ''}
                    progress={item.progress ?? ''}
                    required={item.required ?? ''}
                    completed={item.completed ?? ''}
                    remaining={item.remaining ?? ''}
                    message={item.warning ?? ''}
                  />
                ))}
              </div>
            )}
          </div>

          {walletData?.pagination && (
            <Pagination
              totalItems={walletData.pagination.totalItems}
              currentPage={page}
              pageSize={pageSize}
              onPageChange={(p) => setPage(p)}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setPage(1);
              }}
            />
          )}
        </div>

        <HowToWorkCard className="max-w-[320px] max-lg:hidden" />
      </div>

      {/* UNDERSTANDING TURNOVER */}
      <div>
        <h3 className="my-4 text-base font-semibold">Understanding Your Turnover</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-primary-cream p-4 rounded-lg">
            <p className="font-semibold mb-2 text-primary-dark">Priority System</p>
            <ol className="text-sm text-gray-600 list-decimal ml-6 space-y-2">
              <li>Deposit turnover must complete first</li>
              <li>Bonus turnover starts after deposit turnover is done</li>
              <li>New deposits pause bonus turnover</li>
            </ol>
          </div>

          <div className="bg-primary-cream p-4 rounded-lg">
            <p className="font-semibold mb-2 text-primary-dark">Calculation Formula</p>
            <p className="text-sm ml-2">
              <b>Turnover = MIN(Bet Amount, Settlement Amount)</b>
            </p>
            <p className="text-xs text-gray-500 mt-1 ml-2">
              Settlement depends on win / loss / void result
            </p>
          </div>
        </div>
      </div>

      {showHowItWorks &&
        ReactDOM.createPortal(
          <div className="fixed inset-0 z-[2147483647] flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setShowHowItWorks((prev) => !prev)}
            />
            <div className="relative w-full max-w-md rounded-xl px-2">
              <button
                onClick={() => setShowHowItWorks((prev) => !prev)}
                className="absolute right-6 top-2.5 p-1 rounded-full bg-gray-100"
              >
                <Icons.close className="h-4 w-4" />
              </button>

              <HowToWorkCard />
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

export default MyWallet;
