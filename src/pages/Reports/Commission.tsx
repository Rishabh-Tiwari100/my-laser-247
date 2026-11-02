import BackButton from '@/components/common/BackButton';
import CustomSelect from '@/components/common/CustomSelect';
import DataTable from '@/components/common/DataTable';
import DateTimeFilter from '@/components/common/DateFilter';
import Pagination from '@/components/common/Pagination';
import TabFilterTwo from '@/components/common/TabFilterTwo';
import dayjs from 'dayjs';
import React, { useMemo, useState } from 'react';
import { FaRegClock } from 'react-icons/fa';

function Commission() {
  const [activeTab, setActiveTab] = useState('Current Bet');
  const [selected, setSelected] = useState('');

  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const startDate = fromDate ? dayjs(fromDate).toISOString() : dayjs().startOf('day').toISOString();
  const endDate = toDate ? dayjs(toDate).toISOString() : dayjs().endOf('day').toISOString();

  // Dummy commission data
  const commissions = Array.from({ length: 10 }, (_, i) => {
    const sports = ['Cricket', 'Football', 'Tennis', 'Casino'];
    const sport = sports[i % sports.length];
    const isProfit = i % 2 === 0;

    return {
      date: dayjs().subtract(i, 'day').format('DD/MM/YYYY, h:mm A'),
      user: `User ${i + 1}`,
      downline: `Downline ${i + 2}`,
      event: `${sport} Event ${i + 1}`,
      market: i % 2 === 0 ? 'Match Odds' : 'Bookmaker',
      sport,
      type: isProfit ? 'Back' : 'Lay',
      selection: `Team ${i % 5}`,
      rate: (1.5 + (i % 4) * 0.2).toFixed(2),
      amount: (100 + i * 10).toFixed(2),
      commissionPercent: (5 + (i % 3) * 2).toFixed(2),
      commissionAmount: isProfit ? (i * 15 + 100).toFixed(2) : (-i * 10 - 50).toFixed(2),
    };
  });

  // Filter by date
  const filteredData = useMemo(() => {
    return commissions.filter((item) => {
      const itemDate = dayjs(item.date, 'DD/MM/YYYY, h:mm A');
      return itemDate.isAfter(dayjs(startDate)) && itemDate.isBefore(dayjs(endDate));
    });
  }, [commissions, startDate, endDate]);

  // Pagination logic
  const totalItems = filteredData.length;
  const startIndex = (currentPage - 1) * limit;
  const paginatedData = filteredData.slice(startIndex, startIndex + limit);

  // Table columns
  const columns = [
    { key: 'date', label: 'DATE' },
    { key: 'user', label: 'USER' },
    { key: 'downline', label: 'DOWNLINE' },
    { key: 'event', label: 'EVENT NAME' },
    { key: 'market', label: 'MARKET' },
    { key: 'sport', label: 'SPORT' },
    { key: 'type', label: 'BET TYPE' },
    { key: 'selection', label: 'SELECTION' },
    { key: 'rate', label: 'USER RATE' },
    { key: 'amount', label: 'AMOUNT' },
    { key: 'commissionPercent', label: 'COMMISSION %' },
    {
      key: 'commissionAmount',
      label: 'COMMISSION AMOUNT',
      render: (value: string) => (
        <span className={`${Number(value) >= 0 ? 'text-green-600' : 'text-red-500'} font-semibold`}>
          {Number(value) >= 0 ? '+' : ''}৳{value}
        </span>
      ),
    },
  ];
  const gameOptions = [
    { label: 'Cricket', value: 'cricket' },
    { label: 'Football', value: 'football' },
    { label: 'Tennis', value: 'tennis' },
  ];

  const categoryTabs = ['Current Bet', 'Past Bet'];

  return (
    <div className="p-4 font-poppins font-medium">
      <BackButton />
      {/* Header */}
      <div className="border border-primary rounded-md my-2">
        <div className="bg-gradient-secondary sm:bg-primary flex items-center gap-2 text-sm font-semibold text-white rounded-t sm:rounded px-2 py-1">
          <FaRegClock className="" />
          <span>Upline Report</span>
        </div>

        <div className="flex items-center justify-end p-2 bg-gradient-secondary sm:bg-none">
          {/* <CustomSelect
            options={gameOptions}
            value={selected}
            onChange={setSelected}
            placeholder="Select Sport"
          /> */}
          <DateTimeFilter
            fromDate={fromDate}
            toDate={toDate}
            setFromDate={setFromDate}
            setToDate={setToDate}
          />
        </div>
      </div>

      {/* <TabFilterTwo
        tabs={categoryTabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeTabColor="bg-primary-dark-blue"
      /> */}

      {/* Table */}
      <DataTable columns={columns} data={commissions ?? []} isLoading={false} />

      {/* External Pagination for API Control */}
      <Pagination
        totalItems={10}
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

export default Commission;
