import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';
import { Icons } from '@/utils/icons';
import { valueFormatter } from '@/utils';
import { Runner } from '@/types/market';

type ButtonType = 'back' | 'lay';

type OddButtonProps = {
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
  marketCategory?: string;
  onClick?: () => void;
};

const OddButton: React.FC<OddButtonProps> = ({
  context,
  marketId,
  runnersData,
  oddsCount,
  marketCategory,
  type,
  price,
  size = '',
  position = 3,
  className,
  disabled,
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
      className={clsx(
        'flex-1 font-semibold transition-all duration-150 h-[53px] text-black flex items-center justify-center py-1',
        {
          '!bg-mint !h-[38px]': marketCategory === 'PREMIUM',
          [type === 'back' ? 'bg-odd-blue-100' : 'bg-odd-pink-100']: position === 3,
          [type === 'back' ? 'bg-odd-blue-300' : 'bg-odd-pink-300']: position === 2,
          [type === 'back' ? 'bg-odd-blue-500' : 'bg-odd-pink-500']: position === 1,
        },
        marketCategory === 'FANCY' && '!h-[48px]',
        { 'flex-col': displaySize },
        oddsCount === 1
          ? 'w-[140px] md:w-[200px]'
          : 'w-[75px] lg:w-[55px] xl:w-[75px] 2xl:w-[100px]  ',
        className
      )}
    >
      {isEmpty ? (
        <Icons.lock className="text-white" size={20} />
      ) : (
        <>
          <span className="text-[13px] font-semibold mb-1">{displayPrice}</span>
          <span className="text-xs font-normal">{displaySize}</span>
        </>
      )}
    </button>
  );
};

export default OddButton;
