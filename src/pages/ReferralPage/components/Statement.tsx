import React, { useRef, useState } from 'react';
import DataTable, { Column } from '@/components/common/DataTable';
import Pagination from '@/components/common/Pagination';
import { useGetReferralUsersQuery } from '@/store/api/referralApi';
import { Icons } from '@/utils/icons';
import DateFilter from '@/components/common/DateFilter';
import CustomSelect from '@/components/common/CustomSelect';
import { debounce } from '@/utils';
import dayjs from 'dayjs';

interface ReferralUserRow {
  serialNo: number;
  userName: string;
  joinDate: string;
  firstDeposit: number;
  bonusEarnings: string;
  lossCommission: string;
  status: 'Active' | 'Inactive';
}
type Status = 'All' | 'Active' | 'Inactive';

function Statement() {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState<Status>('All');
  const [fromDate, setFromDate] = useState<Date | undefined>(dayjs().subtract(7, 'day').toDate());
  const [toDate, setToDate] = useState<Date | undefined>(dayjs().toDate());
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useRef(debounce((val: string) => setSearchTerm(val), 500)).current;

  const { data, isLoading, isFetching } = useGetReferralUsersQuery({
    page: currentPage,
    limit,
    ...(status !== 'All' && { status: status }),
    fromDate: fromDate ? dayjs(fromDate).startOf('day').toISOString() : undefined,
    toDate: toDate ? dayjs(toDate).endOf('day').toISOString() : undefined,
  });
  // console.log('data', data);

  const users = data?.data ?? [];
  const totalItems = data?.pagination.totalItems ?? 0;

  const columns: Column<ReferralUserRow>[] = [
    {
      key: 'serialNo',
      label: 'S. No.',
      render: (value) => String(value).padStart(2, '0'),
    },
    {
      key: 'userName',
      label: 'User Name',
      render: (value) => (
        <div className="flex items-center gap-2">
          <span className="h-6 w-6 flex items-center justify-center rounded-full bg-blue-600 text-white text-xs font-semibold">
            {value?.charAt(0)?.toUpperCase()}
          </span>
          <span className="text-primary font-medium underline cursor-pointer">{value}</span>
        </div>
      ),
    },
    {
      key: 'joinDate',
      label: 'Join Date',
      className: 'text-center',
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'firstDeposit',
      label: 'First Deposit',
      className: 'text-center',
      render: (value) => `৳${Number(value).toLocaleString()}`,
    },
    {
      key: 'bonusEarnings',
      label: 'Bonus Earnings',
      className: 'text-center',
      render: (value) => (
        <span className="text-green-700 font-semibold">৳{Number(value).toLocaleString()}</span>
      ),
    },
    {
      key: 'lossCommission',
      label: 'Loss Commission',
      className: 'text-center',
      render: (value) => <span className="text-red-500">৳{Number(value).toLocaleString()}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      className: 'text-center',
      render: (value) => (
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
            value === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              value === 'Active' ? 'bg-green-600' : 'bg-gray-500'
            }`}
          />
          {value}
        </span>
      ),
    },
  ];

  return (
    <div className="font-poppins font-medium space-y-4">
      <div className="flex flex-col gap-2 mb-3 max-sm:bg-gradient-secondary rounded-md p-2">
        <div className="font-semibold leading-none">
          <span className="text-13 sm:text-xl text-white sm:text-black">Your Referred Users</span>
          <span className="text-[9px] sm:text-13 font-medium text-gray-700 ml-1 sm:ml-2">
            (Track performance of users you referred)
          </span>
        </div>

        {/* FILTERS */}
        <div className="flex justify-between flex-wrap gap-2">
          <div className="hidden sm:flex gap-x-2 items-center">
            <label htmlFor="user search" className=" text-sm font-medium">
              Search
            </label>
            <input
              placeholder="User Search"
              className="border border-gray-700 outline-none px-3 py-1 text-sm rounded-full"
            />
          </div>

          <div className="flex items-end gap-1">
            <div className="flex flex-wrap sm:flex-row max-sm:justify-center items-center gap-1">
              <p className="text-13 font-semibold">Status</p>
              <CustomSelect
                options={[
                  { label: 'All', value: 'All' },
                  { label: 'Active', value: 'Active' },
                  { label: 'Inactive', value: 'Inactive' },
                ]}
                className="w-[90px] max-sm:h-8"
                value={status}
                onChange={(value) => {
                  setStatus(value as Status);
                }}
              />
            </div>
            <DateFilter
              fromDate={fromDate}
              toDate={toDate}
              setFromDate={setFromDate}
              setToDate={setToDate}
            />
          </div>
        </div>
      </div>

      <div className="mb-3 flex sm:hidden items-center gap-2 border border-primary rounded px-2 py-1 bg-white hover:shadow-sm focus-within:border-primary transition-all">
        <Icons.search className="text-gray-400 w-5 h-5" />
        <input
          className="w-full text-black placeholder:text-gray-400 outline-none bg-transparent text-12 font-medium placeholder:text-xs"
          placeholder="Search..."
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

      {/* TABLE */}
      <DataTable
        columns={columns}
        data={users}
        isLoading={isLoading || isFetching}
        noDataMessage="No referred users found"
      />

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

export default Statement;
