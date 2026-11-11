import { useCashOut } from '@/hooks/useCashOut';
import type { Market } from '@/store/api/catalogueApi';
import type { StakeLimitValue } from './stakeLimit';

export default function MarketCashoutControls({
  eventId,
  market,
  min,
  max,
}: {
  eventId?: string | number;
  market: Market;
  min?: StakeLimitValue;
  max?: StakeLimitValue;
}) {
  const { handleCashout, bestOption, isAuthenticated, isCashoutAvailable } = useCashOut(
    eventId, market, min, max
  );
  if (!isAuthenticated || market.runners?.length !== 2) return null;
  const isCashoutEnabled = isCashoutAvailable && Boolean(bestOption);

  return (
    <span className="inline-flex shrink-0 gap-[2px]">
      <button
        type="button"
        disabled={!isCashoutEnabled}
        onClick={handleCashout}
        className="rounded-[4px] border-0 bg-[#701920] px-[4px] py-[2px] text-[10px] font-semibold uppercase leading-[normal] text-white hover:bg-[#65141b] disabled:cursor-not-allowed disabled:bg-[#918f8f] disabled:text-[#404040] max-[460px]:text-[8px]"
      >
        Cashout
      </button>
      <button
        type="button"
        disabled
        className="cursor-not-allowed rounded-[4px] border-0 bg-[#918f8f] px-[4px] py-[2px] text-[10px] font-semibold uppercase leading-[normal] text-[#404040] max-[460px]:text-[8px]"
      >
        Loss cut
      </button>
    </span>
  );
}
