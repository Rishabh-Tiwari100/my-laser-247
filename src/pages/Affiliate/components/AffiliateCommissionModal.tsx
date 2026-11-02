import React, { useEffect, useMemo, useState } from 'react';
import ReactDOM from 'react-dom';
import DataTable from '@/components/common/DataTable';
import { FaCoins } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination as SwiperPagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface Props {
  open: boolean;
  onClose: () => void;
}

const dummyCommissionData = [
  {
    id: 1,
    name: 'Customer A',
    loss: 735976,
    bonus: 4719,
    paymentFee: 29439,
  },
  {
    id: 2,
    name: 'Customer B',
    loss: 180450,
    bonus: 0,
    paymentFee: 1250,
  },
  {
    id: 3,
    name: 'Customer C',
    loss: 950000,
    bonus: 12500,
    paymentFee: 54000,
  },
  {
    id: 4,
    name: 'Customer D',
    loss: 320750,
    bonus: 2500,
    paymentFee: 8900,
  },
  {
    id: 5,
    name: 'Customer E',
    loss: 125000,
    bonus: 0,
    paymentFee: 0,
  },
];

const AFFILIATE_PERCENT = 40;

function calculateCommission({
  loss,
  bonus,
  paymentFee,
  platformDeductionPercent,
}: {
  loss: number;
  bonus: number;
  paymentFee: number;
  platformDeductionPercent: number;
}) {
  const deduction = (loss * platformDeductionPercent) / 100;

  const commissionBase = loss - deduction - bonus - paymentFee;

  const commission = commissionBase > 0 ? (commissionBase * AFFILIATE_PERCENT) / 100 : 0;

  return {
    deduction,
    commission,
  };
}

function formatCurrency(num: number): string {
  if (Number.isInteger(num)) {
    return num.toLocaleString('en-IN');
  }

  return Number(num.toFixed(2)).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

const AffiliateCommissionModal: React.FC<Props> = ({ open, onClose }) => {
  const systemSettings = useSelector((state: RootState) => state.systemSettings.data);
  const [platformDeduction, setPlatformDeduction] = useState(0);
  const [depositCharge, setDepositCharge] = useState(0);
  const [withdrawalCharge, setWithdrawalCharge] = useState(0);

  useEffect(() => {
    if (!systemSettings) return;

    const { platform, deposit, withdrawal } = systemSettings;
    setPlatformDeduction(Number(platform.selection ?? platform.default));
    setDepositCharge(Number(deposit.selection ?? deposit.default));
    setWithdrawalCharge(Number(withdrawal.selection ?? withdrawal.default));
  }, [systemSettings]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const commissionInfo = [
    {
      title: 'Customer Loss',
      bg: 'bg-pink-100 border-pink-400',
      icon: '/images/affiliate/c1.svg',
    },
    {
      title: `${platformDeduction}% Platform Fee`,
      bg: 'bg-blue-100 border-blue-400',
      icon: '/images/affiliate/c2.svg',
    },
    {
      title: 'Bonus',
      bg: 'bg-green-100 border-green-400',
      icon: '/images/affiliate/c3.svg',
    },
    {
      title: 'Payment Fee',
      bg: 'bg-orange-100 border-orange-400',
      icon: '/images/affiliate/c4.svg',
    },
    {
      title: 'Affiliate earns 40% of total Net Loss',
      bg: 'bg-purple-100 border-purple-400',
      icon: '/images/affiliate/c5.svg',
    },
  ];

  // -------- Table config --------
  const columns = [
    { key: 'id', label: 'S. No.' },
    { key: 'name', label: 'Customer' },
    {
      key: 'winLoss',
      label: 'Loss',
      render: (v: string) => <span className="font-semibold text-red-500">{v}</span>,
    },
    {
      key: 'deduction',
      label: 'Deduction',
      render: (v: string) => <span className="text-gray-400 font-semibold">{v}</span>,
    },
    {
      key: 'bonus',
      label: 'Bonus',
      render: (v: string) => <span className="text-gray-400 font-semibold">{v}</span>,
    },
    {
      key: 'paymentFee',
      label: 'Payment Fee',
      render: (v: string) => <span className="text-gray-400 font-semibold">{v}</span>,
    },
    {
      key: 'commission',
      label: 'Commission',
      render: (v: string) => <span className="text-green-600 font-semibold">{v}</span>,
    },
  ];

  const rows = useMemo(() => {
    return dummyCommissionData.map((item) => {
      const { deduction, commission } = calculateCommission({
        loss: item.loss,
        bonus: item.bonus,
        paymentFee: withdrawalCharge || depositCharge ? item.paymentFee : 0,
        platformDeductionPercent: platformDeduction,
      });

      return {
        id: item.id,
        name: item.name,
        winLoss: `-৳${item.loss.toLocaleString('en-IN')}`,
        deduction: deduction > 0 ? `-৳${formatCurrency(deduction)}` : '-',
        bonus: item.bonus > 0 ? `-৳${formatCurrency(item.bonus)}` : '-',
        paymentFee:
          (withdrawalCharge || depositCharge) && item.paymentFee > 0
            ? `-৳${formatCurrency(item.paymentFee)}`
            : '-',
        commission: commission > 0 ? `৳${formatCurrency(commission)}` : '-',
      };
    });
  }, [platformDeduction]);

  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * limit;
    return rows.slice(start, start + limit);
  }, [rows, currentPage, limit]);

  if (!open) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[2147483647] bg-black/50 flex justify-center items-center">
      <div className="bg-white w-[95%] max-w-6xl rounded-lg p-6 shadow-xl max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <div className="flex justify-end mb-2">
          <button
            onClick={onClose}
            className="px-2 py-0.5 rounded-md border hover:bg-red-500 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        {/* Title */}
        <div className="flex items-center gap-2 text-lg font-semibold mb-4">
          <FaCoins className="text-green-600" /> Sample Affiliate Commission Structure
        </div>

        {/* Top Cards with Swiper */}
        <div className="">
          <Swiper
            modules={[SwiperPagination]}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            spaceBetween={16}
            slidesPerView={1}
            breakpoints={{
              480: { slidesPerView: 1.5 },
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
              1280: { slidesPerView: 5 },
            }}
            className="!pb-10"
          >
            {commissionInfo.map((item, index) => (
              <SwiperSlide key={index}>
                <div
                  className={`flex flex-col items-center justify-center gap-3 p-4 border rounded-lg shadow-sm text-center h-full min-h-[140px] ${item.bg}`}
                >
                  <img src={item.icon} alt={item.title} className="w-12 mx-auto object-contain" />
                  <p className="text-sm font-semibold">{item.title}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Rules */}
        <div className="text-sm mb-3 flex flex-wrap gap-2 justify-between">
          <p>
            <strong>Bonus =</strong> Promotion bonus + VIP cash bonus
          </p>
          <p>
            <strong>Payment fee =</strong> (Deposit amount x {depositCharge}%) + (Withdrawal amount
            x {withdrawalCharge}%)
          </p>
        </div>

        {/* Table + Pagination */}
        <div className="flex-1 flex flex-col">
          <DataTable columns={columns} data={paginatedRows} isLoading={false} />
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AffiliateCommissionModal;
