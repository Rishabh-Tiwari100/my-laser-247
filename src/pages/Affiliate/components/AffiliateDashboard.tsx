import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { Icons } from '@/utils/icons';

import 'swiper/css';
import 'swiper/css/pagination';
import { AffiliatedReqApproved } from '@/types/affiliate';
import { useClipboard } from '@/hooks';
import { useGetSystemSettingsQuery } from '@/store/api/systemSettingApi';
import { formatNumber } from '@/utils';

interface StatCard {
  title: string;
  value: string | number;
  subtitle: string;
  borderColor: string;
  bg: string;
}

const AffiliateDashboard: React.FC<{ dashboardDetails?: AffiliatedReqApproved }> = ({
  dashboardDetails,
}) => {
  const {
    affiliateStatus,
    referralCode,
    totalActiveReferrals,
    totalReferrals,
    lastCommission,
    totalCommission,
    range = [],
  } = dashboardDetails ?? {};
  const { copy } = useClipboard();
  const { data: systemSettings } = useGetSystemSettingsQuery();
  const { default: defaultValue, selection } = systemSettings?.active_user ?? {};
  const baseUrl = import.meta.env.VITE_APP_URL;
  const referralUrl = `${baseUrl}/register?ref=${referralCode}`;

  const dynamicStats: StatCard[] = [
    {
      title: 'Total Referred Users',
      value: totalReferrals ?? 0,
      subtitle: 'All time referrals',
      borderColor: 'border-pink-400',
      bg: 'bg-pink-50',
    },
    {
      title: 'Active Users',
      value: totalActiveReferrals ?? 0,
      subtitle: 'Users currently active',
      borderColor: 'border-blue-400',
      bg: 'bg-blue-50',
    },
    {
      title: 'Last Week Commission',
      value: `৳${lastCommission ?? 0}`,
      subtitle: 'Previous week',
      borderColor: 'border-yellow-400',
      bg: 'bg-yellow-50',
    },
    {
      title: 'Total Commission Earned',
      value: `৳${totalCommission ?? 0}`,
      subtitle: 'Lifetime earnings',
      borderColor: 'border-purple-400',
      bg: 'bg-purple-50',
    },
  ];

  const statusStyle: Record<string, string> = {
    Active: 'text-green-700 border-green-600 bg-green-100',
    Inactive: 'text-gray-500 border-gray-400 bg-gray-200',
  };

  const handleShare = async () => {
    if (!referralCode) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join me on this platform!',
          text: `Use my referral code: ${referralCode}`,
          url: referralUrl,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      if (referralCode) {
        copy(referralUrl);
      }
    }
  };

  return (
    <div className="mt-6 space-y-5">
      <Swiper
        modules={[Pagination]}
        pagination={{ clickable: true }}
        spaceBetween={16}
        slidesPerView={1.2}
        breakpoints={{
          320: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1280: { slidesPerView: 4 },
          1525: { slidesPerView: 5 },
        }}
        className="!pb-8"
      >
        {dynamicStats.map((item, idx) => (
          <SwiperSlide key={idx}>
            <div className={`rounded-xl p-5 border ${item.borderColor} ${item.bg} shadow-sm`}>
              <h3 className="text-md font-medium">{item.title}</h3>
              <p className="text-3xl font-semibold mt-3">{item.value}</p>
              <p className="text-xs text-gray-500 mt-1">{item.subtitle}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="rounded-xl px-4 py-3 bg-green-50 border border-green-300 flex justify-between items-center">
        {/* Status */}
        <div className="flex flex-col items-center">
          <span className="font-semibold">Status</span>

          <div
            className={`flex items-center gap-2 border rounded-lg px-2 py-0.5 text-sm font-semibold ${
              statusStyle[affiliateStatus || 'Inactive']
            }`}
          >
            <span className="inline-block w-2 h-2 bg-current rounded-full" />
            {affiliateStatus ?? 'Inactive'}
          </div>
        </div>

        {/* Referral Code */}
        <div className="flex flex-col items-center">
          <span className="text-gray-400 text-sm font-semibold mb-1">Your Referral Code</span>

          <div className="flex items-center gap-x-2">
            <span className="font-bold">{referralCode ?? '--'}</span>

            <button
              className="text-gray-700 hover:text-black border rounded bg-white px-1.5 py-1"
              onClick={() => copy(referralCode || '')}
            >
              <Icons.copy />
            </button>
            <button
              onClick={handleShare}
              disabled={!referralCode}
              className="text-gray-700 hover:text-black border rounded bg-white px-1.5 py-1"
            >
              <Icons.share />
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-black p-5 space-y-4">
        <h3 className="font-semibold text-lg">Commission Structure</h3>

        <div className="space-y-3 max-h-40 overflow-y-auto pr-2 scrollbar-thin">
          {range?.length > 0 ? (
            range.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <span className="text-sm">
                  {item.fromUser} - {item.toUser ? item.toUser : '∞'} users
                </span>
                <span className="border border-green-600 bg-green-100 text-sm font-medium px-2 rounded">
                  {item.percentage}%
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No commission slabs available.</p>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-black p-5 space-y-3">
        <h3 className="font-semibold text-lg">Active User Definition</h3>
        <p className="text-gray-600 text-sm leading-5">
          A user becomes active when their weekly turnover reaches ৳
          {formatNumber(selection ?? defaultValue ?? '-')}. Your commission is calculated based on
          total net loss of active referred users.
        </p>
      </div>
    </div>
  );
};

export default AffiliateDashboard;
