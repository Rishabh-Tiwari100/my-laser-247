import React from 'react';
import { BonusType } from '@/types/bonus';
import { formatNumber } from '@/utils';

type BonusCardProps =
  | {
      type: 'progress';
      bonusId: number;
      category: string;
      title: string;
      status: 'ACTIVE' | 'COMPLETED' | 'EXPIRED';
      deposit: number;
      totalBalance: number;
      progress: number;
      completed: number;
      bonusBalance?: number;
      totalTurnover: number;
      remaining: number;
      withdrawable: number;
    }
  | {
      type: 'instant';
      bonusId: number;
      category: string;
      progress: number;
      title: string;
      status: 'ACTIVE' | 'COMPLETED' | 'EXPIRED';
      withdrawable: number;
      bonusBalance: number;
    };

const BonusCard: React.FC<BonusCardProps> = (props) => {
  const { type, title, category, status } = props;
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-600';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-600';
      case 'EXPIRED':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };
  const instructionMap: Record<BonusType, string> = {
    JoiningBonus: 'Joining Bonus',
    ReferralBonus: 'Referral Bonus',
    ReferralLossCommissionBonus: 'Referral Loss CommissionBonus',
    LossBackBonus: 'Loss Back Bonus',
    DepositBonus: 'Refill Bonus',
  };

  const label =
    category in instructionMap ? instructionMap[category as BonusType] : 'Unknown Bonus';

  return (
    <div className="bg-gradient-to-b from-white to-primary-dark-300 rounded-2xl shadow-lg">
      {/* HEADER */}
      <div className="flex flex-col rounded-2xl bg-white -translate-y-1 shadow-xl">
        <div className="p-3 flex justify-between items-center border-b">
          <div>
            <p className="text-xs">{title}</p>
            <p className="font-semibold text-sm">{label}</p>
            <p className="text-xs text-gray-500">
              {type === 'instant' ? 'Instant Withdrawable' : 'Turnover Required'}
            </p>
          </div>

          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getStatusColor(status)}`}
          >
            {status}
          </span>
        </div>

        {/* ================= SUMMARY ================= */}
        {type === 'progress'
          ? (() => {
              const { deposit, bonusBalance } = props;

              return (
                <div className="flex justify-between px-3 pt-3 pb-2 text-13">
                  <span>
                    Deposit <b>৳{formatNumber(deposit)}</b>
                  </span>
                  {/* <span>
                    Total Balance <b className="text-blue-600">৳{formatNumber(totalBalance)}</b>
                  </span> */}
                  <span>
                    Bonus Bal. <b className="text-blue-500">৳{formatNumber(bonusBalance)}</b>
                  </span>
                </div>
              );
            })()
          : (() => {
              const { withdrawable, bonusBalance } = props;

              return (
                <div className="flex justify-between text-13 px-3 pt-3 pb-2">
                  <span>
                    Withdrawable <b className="text-green-500">৳{formatNumber(withdrawable)}</b>
                  </span>
                  <span>
                    Bonus Bal. <b className="text-blue-500">৳{formatNumber(bonusBalance)}</b>
                  </span>
                </div>
              );
            })()}
      </div>

      {/* ================= PROGRESS BONUS ================= */}
      {type === 'progress' &&
        (() => {
          const { progress, completed, remaining, totalTurnover, withdrawable } = props;

          return (
            <>
              <div className="text-white p-4">
                <p className="text-center text-sm tracking-wide">RELEASE PROGRESS</p>
                <p className="text-center text-3xl font-bold mt-2">{progress}%</p>

                <div className="h-3 bg-primary-dark2 rounded-full mt-3">
                  <div
                    className="h-full bg-primary-light rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="flex justify-between text-xs text-white px-3 pt-2 pb-3">
                <span>
                  ৳{formatNumber(completed)} / ৳{formatNumber(totalTurnover)} turnover
                </span>
                <span>৳{formatNumber(remaining)} remaining</span>
              </div>

              {progress === 100 && (
                <div className="px-3 pb-3">
                  <div className="bg-green-500 text-white text-center py-2 rounded-lg text-sm font-semibold">
                    ৳{formatNumber(withdrawable)} Ready to Withdraw
                  </div>
                </div>
              )}
            </>
          );
        })()}

      {/* ================= INSTANT BONUS ================= */}
      {type === 'instant' &&
        (() => {
          const { withdrawable } = props;

          return (
            <div className="grid grid-cols-2 border border-white m-4 rounded-md bg-primary-dark-300/50 text-center">
              <div className="p-3 border-r">
                <p className="text-lg font-bold">৳{formatNumber(withdrawable)}</p>
                <p className="text-sm text-white">Withdrawable</p>
              </div>

              <div className="p-3">
                <p className="text-lg font-bold">No Turnover</p>
                <p className="text-sm text-white">Condition</p>
              </div>
            </div>
          );
        })()}
    </div>
  );
};

export default BonusCard;
