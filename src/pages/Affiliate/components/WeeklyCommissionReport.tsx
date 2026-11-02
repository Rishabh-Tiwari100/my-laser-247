import React, { useMemo, useState } from 'react';
import DataTable from '@/components/common/DataTable';
import DateTimeFilter from '@/components/common/DateFilter';
import Pagination from '@/components/common/Pagination';
import AffiliateCommissionModal from './AffiliateCommissionModal';
import { Icons } from '@/utils/icons';
import CustomSelect from '@/components/common/CustomSelect';
import { useGetWeeklyCommissionQuery } from '@/store/api/affiliateApi';

const statusTabs = [
  { label: 'All', value: 'ALL' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Paid', value: 'Paid' },
  { label: 'Not Commission', value: 'NotCommission' },
];

const getRecentCompletedWeekRange = () => {
  const today = new Date();
  const day = today.getDay(); // 0 = Sunday, 1 = Monday

  // Find current week's Monday
  const currentWeekMonday = new Date(today);
  const diffToMonday = day === 0 ? -6 : 1 - day;
  currentWeekMonday.setDate(today.getDate() + diffToMonday);
  currentWeekMonday.setHours(0, 0, 0, 0);

  // Last week's Monday
  const lastWeekMonday = new Date(currentWeekMonday);
  lastWeekMonday.setDate(currentWeekMonday.getDate() - 7);

  // Last week's Sunday
  const lastWeekSunday = new Date(lastWeekMonday);
  lastWeekSunday.setDate(lastWeekMonday.getDate() + 6);
  lastWeekSunday.setHours(23, 59, 59, 999);

  return {
    monday: lastWeekMonday,
    sunday: lastWeekSunday,
  };
};

const getWeekRangeFromDate = (date: Date) => {
  const day = date.getDay(); // 0 = Sunday
  const monday = new Date(date);
  const diffToMonday = day === 0 ? -6 : 1 - day;

  monday.setDate(date.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  return { monday, sunday };
};

const WeeklyCommissionReport: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const [fromDate, setFromDate] = useState<Date>(getRecentCompletedWeekRange().monday);
  const [toDate, setToDate] = useState<Date>(getRecentCompletedWeekRange().sunday);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [open, setOpen] = useState(false);

  const { data, isLoading } = useGetWeeklyCommissionQuery({
    page: currentPage,
    limit,
    status: statusFilter,
    fromDate: fromDate?.toISOString(),
    toDate: toDate?.toISOString(),
  });
  const rows = data?.data ?? [];
  console.log(data);
  const filteredRows = useMemo(() => {
    return rows.filter((item) => {
      if (search && !item.weekStart.toLowerCase().includes(search.toLowerCase())) return false;

      return true;
    });
  }, [rows, search]);

  const columns = [
    {
      key: 'id',
      label: 'S. No.',
      render: (value: string, row: any, i: any) => (currentPage - 1) * limit + (i + 1),
    },
    {
      key: 'weekStart',
      label: 'WEEK RANGE',
      render: (v: any, row: any) => {
        const start = new Date(row.weekStart).toLocaleDateString();
        const end = new Date(row.weekEnd).toLocaleDateString();
        return `${start} → ${end}`;
      },
    },
    { key: 'activeUsers', label: 'ACTIVE USERS' },
    {
      key: 'totalLoss',
      label: 'PLAYER LOSS',
      render: (v: string) => <span className="text-red-500 font-medium">-৳{v}</span>,
    },
    {
      key: 'deductionAmount',
      label: 'DEDUCTION',
      render: (v: string) => <span className="text-red-500 font-medium">৳{v}</span>,
    },
    {
      key: 'commissionPercent',
      label: 'COMMISSION %',
      render: (v: string) => (
        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md font-semibold">{v}%</span>
      ),
    },
    {
      key: 'commissionAmount',
      label: 'COMMISSION EARNED',
      render: (v: string) => <span className="text-green-600 font-semibold">৳{v}</span>,
    },
    {
      key: 'status',
      label: 'STATUS',
      render: (v: string) => (
        <span
          className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
            v === 'Pending'
              ? 'bg-yellow-100 text-yellow-700'
              : v === 'Paid'
                ? 'bg-green-300/80 text-green-700'
                : v === 'NotCommission'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-gray-100 text-gray-600'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              v === 'Pending'
                ? 'bg-yellow-600'
                : v === 'Paid'
                  ? 'bg-green-700'
                  : v === 'NotCommission'
                    ? 'bg-red-600'
                    : 'bg-gray-500'
            }`}
          ></span>
          {v}
        </span>
      ),
    },
  ];

  return (
    <div className="font-poppins font-medium space-y-5">
      {/* Header */}
      <div className="border border-primary rounded-md my-2">
        <div className="bg-gradient-secondary sm:bg-primary flex items-center gap-2 text-sm font-semibold text-white rounded-t sm:rounded px-2 py-1">
          <Icons.userGroup />
          <span>Weekly Commission Report</span>
        </div>

        <div className="flex flex-wrap gap-3 items-center justify-between p-2 bg-gradient-secondary sm:bg-none">
          {/* Search */}

          <div className="flex flex-wrap gap-1.5">
            <div className="flex flex-wrap gap-1 items-center justify-center">
              <p className="text-sm">Status</p>
              <CustomSelect
                options={statusTabs}
                value={statusFilter}
                onChange={setStatusFilter}
                className="w-[165px] h-8"
              />
            </div>

            <DateTimeFilter
              fromDate={fromDate}
              toDate={toDate}
              setFromDate={(date) => {
                if (!date) return;
                const { monday, sunday } = getWeekRangeFromDate(date);
                setFromDate(monday);
                setToDate(sunday);
                setCurrentPage(1);
              }}
              setToDate={(date) => {
                if (!date) return;
                const { monday, sunday } = getWeekRangeFromDate(date);
                setFromDate(monday);
                setToDate(sunday);
                setCurrentPage(1);
              }}
              buttonClass="h-8"
              disableClear={true}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => setOpen(true)}
          className="bg-gradient-green shadow-solid-black text-white px-5 py-1.5 rounded-md text-13 md:text-15"
        >
          Sample Affiliate Commission Structure
        </button>
      </div>

      <DataTable columns={columns} data={filteredRows} isLoading={isLoading} />

      <Pagination
        totalItems={data?.pagination?.totalItems ?? 0}
        currentPage={currentPage}
        pageSize={limit}
        onPageChange={setCurrentPage}
        onPageSizeChange={(size) => {
          setLimit(size);
          setCurrentPage(1);
        }}
      />
      <AffiliateCommissionModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
};

export default WeeklyCommissionReport;
