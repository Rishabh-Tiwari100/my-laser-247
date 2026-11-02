import React from 'react';
import { Copy, Share2 } from 'lucide-react';
import HowToWorkCard from '@/components/common/HowToWorkCard';

// interface RightSidebarProps {
//   totalEarnings: number;
//   thisMonth: number;
//   previousMonth: number;
// }

const RightSidebar: React.FC = () => {
  return (
    <div className="lg:mt-8">
      {/* REFERRAL LINK */}
      <div className="bg-gradient-green rounded-lg p-4 text-white space-y-3 border-r-2 border-b-2 border-black">
        <div className="flex justify-between items-center">
          <p className="font-semibold">Referral Link</p>
          <button className="p-1 bg-white text-black rounded">
            <Share2 size={18} />
          </button>
        </div>

        <div className="bg-white rounded flex items-center overflow-hidden">
          <input
            readOnly
            value="https://notout.co/register/AS96002"
            className="flex-1 px-3 py-2 text-sm text-black outline-none"
          />
          <button className="px-3 text-primary border-l border-primary">
            <Copy size={16} />
          </button>
        </div>
      </div>
      <div className="my-5 h-[1px] bg-primary" />

      {/* RIGHT SIDEBAR */}
      <div className="space-y-4 mb-4">
        <GreenSummaryCard
          title="Referral Deposit Bonus"
          amount="৳9,450"
          sub="From referred user deposit"
        />
        <GreenSummaryCard title="Loss Commission" amount="৳6,300" sub="From referred user losses" />
      </div>

      <HowToWorkCard className="max-lg:hidden" />
    </div>
  );
};

export default RightSidebar;

const GreenSummaryCard = ({
  title,
  amount,
  sub,
}: {
  title: string;
  amount: string;
  sub: string;
}) => (
  <div className="bg-gradient-secondary text-black border-r-2 border-b-2 border-black rounded-lg px-3 py-5 space-y-1">
    <p className="text-sm text-white font-medium">{title}</p>
    <p className="text-lg font-bold">{amount}</p>
    <p className="text-xs text-gray-500">{sub}</p>
  </div>
);
