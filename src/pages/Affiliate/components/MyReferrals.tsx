import React, { useRef, useState } from 'react';
import DataTable from '@/components/common/DataTable';
import DateTimeFilter from '@/components/common/DateFilter';
import Pagination from '@/components/common/Pagination';
import CustomSelect from '@/components/common/CustomSelect';
import { Icons } from '@/utils/icons';
import { useGetReferredUsersQuery } from '@/store/api/affiliateApi';
import dayjs from 'dayjs';
import { debounce } from '@/utils';

const MyReferrals = () => {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');
  const [fromDate, setFromDate] = useState<Date | undefined>(dayjs().subtract(7, 'day').toDate());
  const [toDate, setToDate] = useState<Date | undefined>(dayjs().toDate());
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const startDate = fromDate ? dayjs(fromDate).startOf('day').toISOString() : undefined;
  const endDate = toDate ? dayjs(toDate).endOf('day').toISOString() : undefined;
  const { data, isLoading } = useGetReferredUsersQuery({
    page: currentPage,
    limit,
    search: search || undefined,
    status: activeTab !== 'ALL' ? activeTab : undefined,
    ...(startDate && { fromDate: startDate }),
    ...(endDate && { toDate: endDate }),
  });

  const referrals = data?.referrals ?? [];
  const pagination = data?.pagination ?? { totalItems: 0 };

  const columns = [
    {
      key: 'id',
      label: 'S. NO.',
      render: (value: string, row: any, i: any) => (currentPage - 1) * limit + (i + 1),
    },
    {
      key: 'referredUser',
      label: 'USER NAME',
      render: (v: any) => <span className="font-semibold text-black">{v?.username ?? '-'}</span>,
    },
    {
      key: 'createdAt',
      label: 'JOINING DATE',
      render: (value: any) => dayjs(value).format('DD-MM-YY, h:mm:ss A'),
    },

    {
      key: 'status',
      label: 'STATUS',
      render: (v: string) => (
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full inline-flex items-center gap-2 ${
            v === 'Active' ? 'text-green-700 bg-green-200' : 'text-red-600 bg-red-200'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${v === 'Active' ? 'bg-green-600' : 'bg-red-600'}`}
          ></span>
          {v}
        </span>
      ),
    },

    {
      key: 'weeklyTurnover',
      label: 'WEEKLY TURNOVER',
      render: (v: string) => <span className="font-semibold text-black">৳{v ?? '0.00'}</span>,
    },
  ];

  // ---- Dropdown Options ----
  const statusTabs = [
    { label: 'All', value: 'ALL' },
    { label: 'Active', value: 'Active' },
    { label: 'Inactive', value: 'Inactive' },
  ];

  const debouncedSearch = useRef(
    debounce((value: string) => {
      setSearch(value);
    }, 500)
  ).current;

  return (
    <div className="font-poppins font-medium">
      {/* ---- FILTER HEADER ---- */}
      <div className="border border-primary rounded-md my-2">
        <div className="bg-gradient-secondary sm:bg-primary flex items-center gap-2 text-sm font-semibold text-white rounded-t sm:rounded px-2 py-1">
          <Icons.userGroup />
          <span>My Referrals</span>
        </div>

        <div className="flex flex-wrap gap-2 items-center justify-between py-2 px-1 sm:p-2">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search by username..."
            onChange={(e) => debouncedSearch(e.target.value)}
            className="text-sm border px-2.5 py-1 rounded-md w-full sm:w-[220px] border-primary/40 outline-none focus:ring-1 focus:ring-primary"
          />

          {/* Status + Date Filters */}
          <div className="flex gap-x-1.5">
            <div className="flex flex-wrap gap-1.5 sm:gap-3 items-center justify-center">
              <p className="text-13 font-semibold">Status</p>
              <CustomSelect
                options={statusTabs}
                value={activeTab}
                onChange={(value) => {
                  setActiveTab(value);
                  setCurrentPage(1);
                }}
                className="w-[100px] h-8"
              />
            </div>

            <DateTimeFilter
              fromDate={fromDate}
              toDate={toDate}
              setFromDate={setFromDate}
              setToDate={setToDate}
            />
          </div>
        </div>
      </div>

      {/* ---- TABLE ---- */}
      <div className="mt-4">
        <DataTable columns={columns} data={referrals} isLoading={isLoading} />
      </div>

      {/* ---- PAGINATION ---- */}
      <Pagination
        totalItems={pagination.totalItems}
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
};

export default MyReferrals;
