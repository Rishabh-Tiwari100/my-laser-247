import { cn, formatNumber } from '@/utils';
import React from 'react';
import { IconType } from 'react-icons';

export interface SummaryCardItem {
  title: string;
  value: number | string;
  sub?: string;
  bg?: string;
  border?: string;
  text?: string;
  icon?: IconType;
  image?: string;
  titleClassName?: string;
  subTitleClassName?: string;
}

interface Props {
  item: SummaryCardItem;
}

const SummaryCard: React.FC<Props> = ({ item }) => {
  const Icon = item.icon;
  return (
    <div
      className={`h-full rounded-lg ${item.border ?? ''} ${item.bg ?? ''} p-4 flex flex-col gap-1 justify-between`}
    >
      <div className="flex items-center gap-2">
        {(Icon || item.image) && (
          <div className="w-8 h-8 rounded-full bg-white border flex items-center justify-center">
            {Icon && <Icon className={`text-lg ${item.text ?? ''}`} />}
            {item.image && <img src={item.image} alt="" className="w-5 h-5" />}
          </div>
        )}

        <p className={cn('text-sm font-medium text-gray-700', item.titleClassName)}>{item.title}</p>
      </div>

      {/* Value */}
      <p className={`text-xl font-bold ${item.text ?? ''}`}>{item.value}</p>

      {/* Sub */}
      {item.sub && (
        <p className={cn('text-xs text-gray-500', item.subTitleClassName)}>{item.sub}</p>
      )}
    </div>
  );
};

export default SummaryCard;
