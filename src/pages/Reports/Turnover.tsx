import React, { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { FaRegClock } from 'react-icons/fa';

import BackButton from '@/components/common/BackButton';
import DataTable from '@/components/common/DataTable';
import DateTimeFilter from '@/components/common/DateFilter';
import Pagination from '@/components/common/Pagination';
import { useGetTurnoverQuery } from '@/store/api/turnoverHistory';
import { TurnoverItem } from '@/types/turnoverHistory';

function Turnover() {
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sourceType, setSourceType] = useState<'Sports' | 'Casino'>('Sports');

  const startDate = fromDate ? dayjs(fromDate).startOf('day').toISOString() : '';
  const endDate = toDate ? dayjs(toDate).endOf('day').toISOString() : '';

  const { data, isLoading, isFetching } = useGetTurnoverQuery({
    page: currentPage,
    limit,
    ...(startDate && { fromDate: startDate }),
    ...(endDate && { toDate: endDate }),
    sourceType,
  });

  const tabs: Array<{ key: 'Sports' | 'Casino'; label: string }> = [
    { key: 'Sports', label: 'Sports' },
    { key: 'Casino', label: 'Casino' },
  ];

  const turnoverData: TurnoverItem[] = data?.data ?? [];
  const totalItems = data?.pagination?.totalItems ?? 0;

  const tableData = useMemo(() => {
    return turnoverData.map((item) => {
      const isCasino = item.sourceType === 'Casino';

      return {
        eventDate: dayjs(item.createdAt).format('DD-MM-YY, h:mm:ss A'),

        transactionType: isCasino ? '-' : item.bet?.status,

        marketName: item.bet?.marketName,
        casinoGameName: item?.casinoTransaction?.gameName,

        market: isCasino ? '-' : (item.bet?.marketType ?? '-'),
        source: item.sourceType,
        sport: item.bet?.sport,
        eventName: item?.bet?.event?.name,

        amount: Number(item.amount),
        turnover: Number(item.turnoverMain),
      };
    });
  }, [turnoverData]);

  const columns = useMemo(() => {
    const baseColumns = [
      { key: 'eventDate', label: 'EVENT DATE' },
      // { key: 'source', label: 'SOURCE' },
      {
        key: 'amount',
        label: 'AMOUNT',
        render: (value: number) => (
          <span className={`font-semibold ${value >= 0 ? 'text-green-600' : 'text-red-500'}`}>
            {value >= 0 ? '+' : ''}
            {value.toFixed(2)}
          </span>
        ),
      },
      {
        key: 'turnover',
        label: 'TURNOVER',
        render: (value: number) => (
          <span className="font-semibold text-blue-600">{value.toFixed(2)}</span>
        ),
      },
    ];

    if (sourceType === 'Casino') {
      return [
        { key: 'eventDate', label: 'EVENT DATE' },
        {
          key: 'casinoGameName',
          label: 'GAME NAME',
          render: (value: string) => <div className="w-[200px] truncate">{value ?? '-'}</div>,
        },
        ...baseColumns.slice(1),
      ];
    }

    return [
      { key: 'eventDate', label: 'EVENT DATE' },
      // { key: 'transactionType', label: 'TRANSACTION TYPE' },
      {
        key: 'eventName',
        label: 'EVENT / MARKET',
        render: (value: string, row: any) => {
          console.log(row);

          return (
            <div className="">
              {row?.sport}/{row?.eventName}/{value ?? '-'}
            </div>
          );
        },
      },
      { key: 'market', label: 'MARKET TYPE' },
      ...baseColumns.slice(1),
    ];
  }, [sourceType]);

  return (
    <div className="p-4 font-poppins font-medium">
      <BackButton />

      {/* HEADER */}
      <div className="border border-primary rounded-md my-2">
        <div className="bg-gradient-secondary sm:bg-primary flex items-center gap-2 text-sm font-semibold text-white rounded-t px-2 py-1">
          <FaRegClock />
          <span>Turnover History</span>
        </div>

        <div className="flex flex-wrap gap-4 items-center justify-between p-2">
          <div className="flex items-center gap-2 border border-primary px-2 py-1.5 w-max rounded-xl bg-primary-light/10">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setSourceType(tab.key);
                  setCurrentPage(1);
                }}
                className={`px-4 py-1.5 text-sm font-semibold rounded-md transition ${
                  sourceType === tab.key ? 'bg-primary text-white' : 'text-black'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <DateTimeFilter
            fromDate={fromDate}
            toDate={toDate}
            setFromDate={setFromDate}
            setToDate={setToDate}
          />
        </div>
      </div>

      {/* TABLE */}
      <DataTable columns={columns} data={tableData} isLoading={isLoading || isFetching} />

      {/* PAGINATION */}
      <Pagination
        totalItems={totalItems}
        currentPage={currentPage}
        pageSize={limit}
        onPageChange={setCurrentPage}
        onPageSizeChange={(size) => {
          setLimit(size);
          setCurrentPage(1);
        }}
      />
    </div>
  );
}

export default Turnover;
