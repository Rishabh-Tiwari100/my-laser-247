import BackButton from '@/components/common/BackButton';
import CustomSelect from '@/components/common/CustomSelect';
import DataTable from '@/components/common/DataTable';
import DateTimeFilter from '@/components/common/DateFilter';
import Pagination from '@/components/common/Pagination';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { FaRegClock } from 'react-icons/fa';
import { useGetMyTransactionsQuery } from '@/store/api/transactionApi';
import { formatNumber } from '@/utils';
import { Icons } from '@/utils/icons';
import { useClipboard } from '@/hooks';
import { useIsSelfRegistered } from '@/hooks/redux';

// context
const contextOptions = [
  { label: 'All', value: 'ALL' },
  { label: 'Deposit', value: 'Deposit' },
  { label: 'Withdrawal', value: 'Withdrawal' },
  { label: 'Withdrawal Refund', value: 'WithdrawalRefund' },
];

const nonSelfRegisterUser = [
  { label: 'All', value: 'ALL' },
  { label: 'System Deposit', value: 'SystemDeposit' },
  { label: 'System Withdrawal', value: 'SystemWithdrawal' },
];

// type (Debit / Credit)
const typeOptions = [
  { label: 'All', value: 'ALL' },
  { label: 'Debit', value: 'Debit' },
  { label: 'Credit', value: 'Credit' },
];

// wallet (Main / Bonus)
const walletTypeOptions = [
  { label: 'All', value: 'ALL' },
  { label: 'Main', value: 'Main' },
  { label: 'Bonus', value: 'Bonus' },
];

function Transactions() {
  const [type, setType] = useState('ALL');
  const [context, setContext] = useState('ALL');
  const [walletType, setWalletType] = useState('ALL');
  const { copy } = useClipboard();
  const [fromDate, setFromDate] = useState<Date | undefined>(dayjs().subtract(7, 'day').toDate());
  const [toDate, setToDate] = useState<Date | undefined>(dayjs().toDate());
  const isSelfRegister = useIsSelfRegistered();

  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const startDate = fromDate ? dayjs(fromDate).toISOString() : undefined;
  const endDate = toDate ? dayjs(toDate).toISOString() : undefined;

  const { data, isLoading, refetch } = useGetMyTransactionsQuery({
    page: currentPage,
    limit: limit,
    type: type !== 'ALL' ? type : undefined,
    ...(context === 'ALL' ? { recordType: 'Transaction' } : { context: context || undefined }),
    walletType: walletType !== 'ALL' ? walletType : undefined,
    ...(startDate && { fromDate: startDate }),
    ...(endDate && { toDate: endDate }),
  });

  const transactions = data?.data ?? [];
  const pagination = data?.pagination;
  const totalItems = pagination?.totalItems ?? 0;

  useEffect(() => {
    setCurrentPage(1);
  }, [type, context, walletType, fromDate, toDate]);

  const columns = [
    {
      key: 'timestamp',
      label: 'TRANSACTION TIME',
      render: (value: string) => dayjs(value).format('DD-MM-YY, h:mm:ss A'),
    },
    {
      key: 'id',
      label: 'TRANSACTION ID',
      render: (value: string) => (
        <span title={value} className={'line-clamp-1 inline-flex items-center gap-x-1'}>
          {value}
          <button onClick={() => copy(value)}>
            <Icons.copy />
          </button>
        </span>
      ),
    },
    { key: 'type', label: 'TYPE' },
    {
      key: 'amount',
      label: 'AMOUNT',
      render: (value: any, row: any) => (
        <span
          className={`${value >= 0 && row?.type && row?.type?.toLowerCase() === 'credit' ? 'text-green-600' : 'text-red-500'} font-semibold`}
        >
          {value >= 0 && row?.type && row?.type?.toLowerCase() === 'credit' ? '+' : '-'}
          {formatNumber(Number(value).toFixed(2))}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'STATUS',
      render: (value: string) => (
        <span
          className={`px-2 py-1 rounded text-xs font-semibold ${
            value === 'Confirmed' ? 'bg-primary text-white' : 'bg-red-100 text-red-700'
          }`}
        >
          {value}
        </span>
      ),
    },
    { key: 'context', label: 'CONTEXT' },
    { key: 'narration', label: 'NARRATION' },
    { key: 'walletType', label: 'WALLET TYPE' },
  ];

  return (
    <div className="p-2 md:p-2.5 font-poppins font-medium">
      <BackButton />

      <div className="border border-primary rounded-md my-2">
        <div className="bg-gradient-secondary sm:bg-primary flex items-center gap-2 text-sm font-semibold text-white rounded-t sm:rounded px-2 py-1">
          <FaRegClock />
          <span>My Transactions</span>
        </div>

        <div className="flex items-center justify-end p-2 gap-4 flex-wrap bg-gradient-secondary sm:bg-none">
          {/* Type */}
          <div className="flex gap-x-2">
            <div className="flex gap-2 items-center">
              <p className="text-13 font-semibold">Type</p>
              <CustomSelect
                options={typeOptions}
                value={type}
                onChange={setType}
                className="min-w-[100px]"
              />
            </div>

            {/* Context */}
            <div className="flex gap-2 items-center">
              <p className="text-13 font-semibold">Context</p>
              <CustomSelect
                options={isSelfRegister ? contextOptions : nonSelfRegisterUser}
                value={context}
                onChange={setContext}
                className="min-w-[100px]"
              />
            </div>
          </div>

          {/* Wallet */}
          {/* <div className="flex gap-2 items-center">
            <p className="text-sm">Wallet</p>
            <CustomSelect options={walletTypeOptions} value={walletType} onChange={setWalletType} />
          </div> */}

          {/* Date Filter */}
          <DateTimeFilter
            fromDate={fromDate}
            toDate={toDate}
            setFromDate={setFromDate}
            setToDate={setToDate}
          />
        </div>
      </div>

      <DataTable columns={columns} data={transactions} isLoading={isLoading} />
      <Pagination
        totalItems={totalItems}
        currentPage={currentPage}
        pageSize={limit}
        onPageChange={(page) => {
          setCurrentPage(page);
        }}
        onPageSizeChange={(size) => {
          setLimit(size);
          setCurrentPage(1);
        }}
      />
    </div>
  );
}

export default Transactions;
