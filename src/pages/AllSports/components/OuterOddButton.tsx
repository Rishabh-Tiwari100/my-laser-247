import React, { useEffect, useRef } from 'react';
import { cn } from '@/utils';
import { Icons } from '@/utils/icons';
import { valueFormatter } from '@/utils';
import { Runner } from '@/types/market';

type ButtonType = 'back' | 'lay';

type OuterOddButtonProps = {
  context?: 'inner' | 'outer';
  marketId?: string | number;
  runnersData?: Runner;
  oddsCount: number;
  type: ButtonType;
  price: number | string | undefined | null;
  size?: number | string | undefined;
  position?: number | string;
  className?: string;
  disabled?: boolean;
  isLeague?: boolean;
  onClick?: () => void;
};

const OuterOddButton: React.FC<OuterOddButtonProps> = ({
  context,
  marketId,
  runnersData,
  oddsCount,
  type,
  price,
  size = '',
  position = 3,
  className,
  disabled,
  isLeague,
  onClick = () => {},
}) => {
  const selectionId = runnersData?.selectionId;
  const runnerId = runnersData?.runnerId;

  const uniqueId = selectionId ?? (runnerId && marketId ? `${runnerId}:${marketId}` : undefined);

  const isEmpty = price === 0 || price === '0' || price === '' || !price;
  const displayPrice = isEmpty ? undefined : Number(price);
  const displaySize = size ? valueFormatter.format(Number(size)) : '';

  const prevPriceMapRef = useRef<Record<string, number>>({});
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!uniqueId) return;
    if (displayPrice == null) return;

    if (context === 'outer') return;

    const prevPrice = prevPriceMapRef.current[uniqueId];

    if (prevPrice == null) {
      prevPriceMapRef.current[uniqueId] = displayPrice;
      return;
    }

    if (prevPrice !== displayPrice) {
      buttonRef.current?.classList.add('!bg-yellow-300');
      setTimeout(() => {
        buttonRef.current?.classList.remove('!bg-yellow-300');
      }, 400);
    }

    prevPriceMapRef.current[uniqueId] = displayPrice;
  }, [displayPrice, uniqueId, context]);

  return (
    <button
      ref={buttonRef}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'font-semibold transition-all duration-150 h-[32px] text-black flex items-center justify-center gap-0.5 py-1',
        {
          [type === 'back' ? 'bg-odd-blue-100' : 'bg-odd-pink-100']: position === 3,
          [type === 'back' ? 'bg-odd-blue-300' : 'bg-odd-pink-300']: position === 2,
          [type === 'back' ? 'bg-odd-blue-500' : 'bg-odd-pink-500']: position === 1,
        },
        { 'flex-col': displaySize },
        className
      )}
    >
      {isLeague ? (
        <Icons.lock size={14} />
      ) : isEmpty ? (
        <span className="text-xs">-</span>
      ) : (
        <>
          <span className="text-xs leading-none">{displayPrice}</span>
          <span className="text-[9px] leading-none font-medium">{displaySize}</span>
        </>
      )}
    </button>
  );
};

export default OuterOddButton;
