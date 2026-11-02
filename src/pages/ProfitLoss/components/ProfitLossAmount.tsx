import { formatProfitLoss } from '../profitLossUtils';

interface ProfitLossAmountProps {
  value: number;
  className?: string;
}

export default function ProfitLossAmount({ value, className = '' }: ProfitLossAmountProps) {
  return (
    <span className={`${value >= 0 ? 'text-[#00a000]' : 'text-[#ff1018]'} font-bold ${className}`}>
      {formatProfitLoss(value)}
    </span>
  );
}
