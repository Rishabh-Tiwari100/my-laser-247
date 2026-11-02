import React, { useEffect, useMemo, useRef, useState } from 'react';
import BackButton from '@/components/common/BackButton';
import DataTable from '@/components/common/DataTable';
import DateTimeFilter from '@/components/common/DateFilter';
import Pagination from '@/components/common/Pagination';
import TabFilterTwo from '@/components/common/TabFilterTwo';
import { useGetBetHistoryQuery } from '@/store/api/betReportApi';

import dayjs from 'dayjs';
import { FaRegClock } from 'react-icons/fa';
import CustomSelect from '@/components/common/CustomSelect';
import { cn, debounce } from '@/utils';
import { Icons } from '@/utils/icons';
import { useNavigate } from 'react-router-dom';

const sportOptions = [
  { label: 'All', value: 'All' },
  { label: 'Cricket', value: 'Cricket' },
  { label: 'Football', value: 'Soccer' },
  { label: 'Tennis', value: 'Tennis' },
];

function BetHistory() {
  const [sport, setSport] = useState('All');
  const [activeTab, setActiveTab] = useState('Current Bet');
  const [fromDate, setFromDate] = useState<Date | undefined>(dayjs().subtract(7, 'day').toDate());
  const [toDate, setToDate] = useState<Date | undefined>(dayjs().toDate());
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const startDate = fromDate ? dayjs(fromDate).startOf('day').toISOString() : '';
  const endDate = toDate ? dayjs(toDate).endOf('day').toISOString() : '';

  const { data, isLoading, isFetching } = useGetBetHistoryQuery({
    page: currentPage,
    limit,
    ...(activeTab !== 'Current Bet' && {
      ...(startDate && { fromDate: startDate }),
      ...(endDate && { toDate: endDate }),
    }),
    ...(sport !== 'All' && { sport: sport }),
    betTime: activeTab === 'Current Bet' ? 'CURRENT' : 'PAST',
    search: searchTerm,
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, fromDate, toDate]);

  const betRows = useMemo(() => {
    return (
      data?.bets?.map((b: any) => ({
        placedAt: b.placedAt ? dayjs(b.placedAt).format('DD/MM/YYYY, h:mm A') : '-',
        settledAt: b.settledAt ? dayjs(b.settledAt).format('DD/MM/YYYY, h:mm A') : '-',
        event: b.event.name || '-',
        market: b.marketName || '-',
        type: b.betOn.toLowerCase(),
        selection: b.selection || '-',
        sport: b.sport,
        odds: b.odds,
        amount: b.amount,
        status: b.status,
        profitLoss: b.payout ? Number(b.payout).toFixed(2) : '-',
        liability: b.liability ? Number(b.liability).toFixed(2) : '-',
        potentialProfit: b.potentialProfit ? Number(b.potentialProfit).toFixed(2) : '-',
      })) ?? []
    );
  }, [data]);

  // ===== Table Columns =====
  const columns = [
    { key: 'placedAt', label: 'PLACE DATE' },
    ...(activeTab === 'Past Bet' ? [{ key: 'settledAt', label: 'Settled At' }] : []),
    {
      key: 'sport',
      label: 'SPORT NAME',
      render: (v: any) => {
        const sport = v && v.toLowerCase() === 'soccer' ? 'Football' : v;
        return (
          <div title={sport} className="inline-block truncate">
            {sport}
          </div>
        );
      },
    },
    {
      key: 'event',
      label: 'EVENT NAME',
      render: (v: any) => (
        <div title={v} className="inline-block w-[180px] truncate">
          {v}
        </div>
      ),
    },
    {
      key: 'market',
      label: 'MARKET',
      render: (v: any) => (
        <div title={v} className="inline-block w-[180px] truncate">
          {v}
        </div>
      ),
    },
    {
      key: 'type',
      label: 'BET TYPE',
      render: (v: any) => (
        <span
          className={`uppercase rounded-full text-13 font-semibold px-2.5 py-1 shadow-md inline-block w-[80px] text-center  text-white ${v === 'back' ? 'bg-odd-blue-500' : 'bg-odd-pink-500'}`}
        >
          {v}
        </span>
      ),
    },
    {
      key: 'selection',
      label: 'SELECTION',
      render: (v: any) => (
        <div title={v} className="inline-block w-[180px] truncate">
          {v}
        </div>
      ),
    },
    { key: 'odds', label: 'USER RATE' },
    { key: 'amount', label: 'AMOUNT' },
    ...(activeTab === 'Past Bet'
      ? [
          {
            key: 'profitLoss',
            label: 'PROFIT/LOSS',
            render: (v: any) => (
              <span className={`${v >= 0 ? 'text-green-600' : 'text-red-500'} font-semibold`}>
                {v}
              </span>
            ),
          },
        ]
      : [
          {
            key: 'liability',
            label: 'LIABILITY',
            render: (v: any) => <span className="text-red-500">{v}</span>,
          },
        ]),
    ...(activeTab === 'Past Bet'
      ? [
          {
            key: 'status',
            label: 'STATUS',
            render: (v: any) => (
              <span
                className={cn(
                  'uppercase rounded-full text-xs font-semibold text-white px-2.5 py-1 shadow-md',
                  v && v.toLowerCase() === 'won' ? 'bg-primary' : 'bg-red-500'
                )}
              >
                {v}
              </span>
            ),
          },
        ]
      : [
          {
            key: 'potentialProfit',
            label: 'POTENTIAL PROFIT',
            render: (v: any) => (
              <span className={`${v >= 0 ? 'text-green-600' : 'text-red-500'} font-semibold`}>
                {v}
              </span>
            ),
          },
        ]),
  ];

  const categoryTabs = ['Current Bet', 'Past Bet'];
  const debouncedSearch = useRef(debounce((val: string) => setSearchTerm(val), 500)).current;

  return (
    <div className="p-2 md:p-2.5 font-poppins font-medium">
      <BackButton className="hidden sm:flex" />

      <div className="mb-2 flex items-center justify-between sm:hidden gap-x-2">
        <button onClick={() => navigate(-1)} className="bg-black text-white p-1 rounded">
          <Icons.angularLeftArrow className="h-3.5 w-3.5" />
        </button>

        <div className="flex items-center gap-2 border-2 border-primary/50 rounded-md px-2 py-0.5 max-w-60 bg-white hover:shadow-sm focus-within:border-primary transition-all">
          <Icons.search className="text-gray-400 w-5 h-5" />
          <input
            className="w-full text-black placeholder:text-gray-400 outline-none bg-transparent text-sm"
            placeholder="Search event"
            // value={searchTerm}
            onChange={(e) => debouncedSearch(e.target.value)}
          />
          {/* <button
            onClick={() => debouncedSearch('')}
            className="inline-flex p-0.5 rounded-full bg-gray-300"
          >
            <Icons.close className="w-3 h-3" />
          </button> */}
        </div>
      </div>

      <div className="flex flex-col-reverse md:flex-col gap-2 mt-2">
        {/* Header */}
        <div className="border border-primary rounded-md ">
          <div className="bg-gradient-secondary sm:bg-primary flex items-center gap-2 text-sm font-semibold text-white rounded-t sm:rounded px-2 py-1">
            <FaRegClock />
            <span>Bet history - current & past bets</span>
          </div>

          <div className="flex flex-wrap gap-2 items-center justify-end p-2 bg-gradient-secondary sm:bg-none">
            {/* Type */}
            <div className="flex gap-2 items-center mr-2">
              <p className="text-sm">Sports</p>
              <CustomSelect
                options={sportOptions}
                value={sport}
                onChange={setSport}
                className="min-w-[130px]"
              />
            </div>

            {activeTab !== 'Current Bet' && (
              <DateTimeFilter
                fromDate={fromDate}
                toDate={toDate}
                setFromDate={setFromDate}
                setToDate={setToDate}
              />
            )}
          </div>
        </div>

        <TabFilterTwo
          tabs={categoryTabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeTabColor="bg-primary-dark-blue"
          className="max-md:my-0"
          buttonClassName="text-xs sm:text-13"
        />
      </div>

      {/* TABLE */}
      <DataTable
        columns={columns}
        data={betRows}
        isLoading={isFetching || isLoading}
        noDataMessage="No bets placed yet."
        className="mt-2"
      />

      {/* PAGINATION */}
      <Pagination
        totalItems={data?.pagination?.totalItems ?? 0}
        currentPage={currentPage}
        pageSize={limit}
        onPageChange={(page) => setCurrentPage(page)}
        onPageSizeChange={(size) => {
          setLimit(size);
          setCurrentPage(1);
        }}
      />
    </div>
  );
}

export default BetHistory;
