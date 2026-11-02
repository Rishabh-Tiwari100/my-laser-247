import React from 'react';
import BonusCard from './BonusCard';
import { BonusCategory, BonusTurnoverItem } from '@/types/bonus';
type BonusCardData =
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
      bonusBalance: number;
      totalTurnover: number;
      remaining: number;
      withdrawable: number;
    }
  | {
      type: 'instant';
      bonusId: number;
      category: string;
      title: string;
      progress: number;
      status: 'ACTIVE' | 'COMPLETED' | 'EXPIRED';
      withdrawable: number;
      bonusBalance: number;
    };

const transformBonusData = (apiData: BonusTurnoverItem[]): BonusCardData[] => {
  return apiData?.map((bonus) => {
    const deposit = Number(bonus.depositAmount);
    const bonusAmount = Number(bonus.bonusAmount);
    const totalBalance = deposit + bonusAmount;
    const turnoverCompleted = Number(bonus.turnoverCompleted);
    const turnoverRequired = Number(bonus.turnoverRequired);
    const withdrawable = Number(bonus.withdrawableAmount);

    // Check if bonus is instant withdrawable or has turnover
    if (
      // bonus.isInstantWithdrawable ||
      // bonus.releaseCondition === 'INSTANT' ||
      bonus.category === 'LossBackBonus' ||
      bonus.category === 'ReferralLossCommissionBonus'
      // ||turnoverRequired === 0
    ) {
      return {
        type: 'instant',
        bonusId: bonus.bonusId,
        category: bonus.category,
        title: bonus.name,
        status: bonus.status,
        progress: bonus.turnoverPercentage,
        withdrawable,
        bonusBalance: bonusAmount,
      };
    }

    // Progress-based bonus (has turnover requirement)
    return {
      type: 'progress',
      bonusId: bonus.bonusId,
      category: bonus.category,
      title: bonus.name,
      status: bonus.status,
      deposit,
      totalBalance,
      bonusBalance: bonusAmount,
      progress: bonus.turnoverPercentage,
      completed: turnoverCompleted,
      totalTurnover: turnoverRequired,
      remaining: Number(bonus.turnoverRemaining),
      withdrawable,
    };
  });
};
interface BonusCardsSectionProps {
  bonuses: BonusTurnoverItem[];
}

const BonusCardsSection: React.FC<BonusCardsSectionProps> = ({ bonuses }) => {
  const cardData = transformBonusData(bonuses);
  console.log(cardData, 'bonusesresponse');

  if (cardData.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No bonuses available</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
      {cardData.map((bonus) => (
        <BonusCard key={bonus.bonusId} {...bonus} />
      ))}
    </div>
  );
};

export default BonusCardsSection;

// import React, { useMemo, useState } from 'react';  BonusTurnoverItem
// import BonusCard from './BonusCard';
// import { useGetBonusTurnoverQuery } from '@/store/api/bonusApi';
// import Pagination from '@/components/common/Pagination';
// import { BonusTurnoverStatus } from '@/types/bonus';

// type BonusItem =
//   | {
//       title: string;
//       progress: number;
//       deposit: number;
//       totalBalance: number;
//       completed: number;
//       totalTurnover: number;
//     }
//   | {
//       title: string;
//       withdrawable: number;
//       bonusBalance: number;
//     };

// interface Props {
//   status: BonusTurnoverStatus;
// }

// const BonusCardsSection: React.FC<Props> = ({ status }) => {
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(6);

//   const { data, isLoading } = useGetBonusTurnoverQuery({
//     status,
//     page,
//     limit,
//   });

//   const bonuses: BonusItem[] = useMemo(() => {
//     return (data?.data ?? []).map((item) => {
//       if (!item.isInstantWithdrawable) {
//         return {
//           title: item.name,
//           progress: item.turnoverPercentage,
//           deposit: Number(item.depositAmount),
//           totalBalance: Number(item.depositAmount) + Number(item.bonusAmount),
//           completed: Number(item.turnoverCompleted),
//           totalTurnover: Number(item.turnoverRequired),
//         };
//       }

//       return {
//         title: item.name,
//         withdrawable: Number(item.withdrawableAmount),
//         bonusBalance: Number(item.bonusAmount),
//       };
//     });
//   }, [data]);

//   if (isLoading) {
//     return <p className="text-center">Loading bonuses...</p>;
//   }

//   if (bonuses.length === 0) {
//     return (
//       <p className="text-center my-6 font-medium text-gray-500">No bonuses available at the moment.</p>
//     );
//   }

//   return (
//     <div className="space-y-4">
//       {/* CARDS */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
//         {bonuses.map((item, idx) =>
//           'progress' in item ? (
//             <BonusCard
//               key={idx}
//               type="progress"
//               title={item.title}
//               deposit={item.deposit}
//               totalBalance={item.totalBalance}
//               progress={item.progress}
//               completed={item.completed}
//               totalTurnover={item.totalTurnover}
//             />
//           ) : (
//             <BonusCard
//               key={idx}
//               type="instant"
//               title={item.title}
//               withdrawable={item.withdrawable}
//               bonusBalance={item.bonusBalance}
//             />
//           )
//         )}
//       </div>

//       {/* PAGINATION */}
//       <Pagination
//         totalItems={data?.total ?? 0}
//         currentPage={page}
//         pageSize={limit}
//         onPageChange={setPage}
//         onPageSizeChange={(size) => {
//           setLimit(size);
//           setPage(1);
//         }}
//       />
//     </div>
//   );
// };

// export default BonusCardsSection;
