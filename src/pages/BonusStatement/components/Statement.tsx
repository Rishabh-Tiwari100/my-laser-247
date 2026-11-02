import React from 'react';
import DataTable from '@/components/common/DataTable';
import Pagination from '@/components/common/Pagination';
import dayjs from 'dayjs';
import { BonusStatementItem } from '@/types/bonus';
import { formatNumber } from '@/utils';

interface Props {
  data: BonusStatementItem[];
  totalItems: number;
  page: number;
  limit: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

function Statement({
  data,
  totalItems,
  page,
  limit,
  isLoading,
  onPageChange,
  onPageSizeChange,
}: Props) {
  const columns = [
    { key: 'serialNo', label: 'S. No' },
    { key: 'bonusType', label: 'BONUS TYPE' },
    // { key: 'reason', label: 'REASON' },
    {
      key: 'awardDate',
      label: 'AWARDED DATE',
      render: (value: string) => dayjs(value).format('DD/MM/YYYY, h:mm A'),
    },
    {
      key: 'originalBalance',
      label: 'AWARDED TO WALLET',
      render: (value: string) => (
        <span className="text-green-600 font-semibold">৳{formatNumber(value) || 'N/A'}</span>
      ),
    },
    {
      key: 'originalBonus',
      label: 'ORIGINAL BONUS AMOUNT',
      render: (value: string) => (
        <span className="text-green-600 font-semibold">৳{formatNumber(value) || 'N/A'}</span>
      ),
    },
    { key: 'withdrawalRule', label: 'TURNOVER RULE' },
    {
      key: 'turnoverRequired',
      label: 'TURNOVER REQUIRED',
      render: (value: string) => (
        <span className="text-green-600 font-semibold">৳{formatNumber(value) || 'N/A'}</span>
      ),
    },

    {
      key: 'turnoverCompleted',
      label: 'TURNOVER COMPLETED',
      render: (value: string) => (
        <span className="text-green-600 font-semibold">৳{formatNumber(value) || 'N/A'}</span>
      ),
    },
    {
      key: 'turnoverRemaining',
      label: 'TURNOVER REMAINING',
      render: (value: string) => (
        <span className="text-green-600 font-semibold">৳{formatNumber(value) || 'N/A'}</span>
      ),
    },
    {
      key: 'status',
      label: 'STATUS',
      render: (value: string) => (
        <span
          className={`px-2 py-1 rounded text-xs font-semibold ${
            value === 'Completed'
              ? 'bg-green-100 text-green-700'
              : 'border border-primary-theme/20 bg-primary-theme/10 text-primary-theme'
          }`}
        >
          {value}
        </span>
      ),
    },
  ];

  return (
    <div className="font-poppins font-medium">
      <DataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        noDataMessage="No bonus statements found"
      />

      <Pagination
        totalItems={totalItems}
        currentPage={page}
        pageSize={limit}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  );
}

export default Statement;
