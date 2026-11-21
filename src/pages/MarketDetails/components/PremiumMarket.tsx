import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Lock, MinusSquare, PlusSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector, useIsAuthenticated } from '@/hooks/redux';
import { useGetBooksetCalcQuery } from '@/store/api/booksetApi';
import { usePlaceBetMutation } from '@/store/api/betPlaceApi';
import { setBetDetails } from '@/store/slices/betSlice';
import type { BetPlaceRequest } from '@/types/betPlace';
import type {
  BettingConfig,
  PremiumMarket as PremiumMarketData,
  PremiumRunner,
} from '@/types/sportsCatalogue';
import { getBlockedStatus } from '@/utils';
import { cn } from '@/lib/utils';
import BetSlip from './BetSlip';

interface PremiumMarketProps {
  market: PremiumMarketData;
  betConfig?: BettingConfig;
  defaultExpanded?: boolean;
}

const PremiumMarket = ({ market, betConfig, defaultExpanded = true }: PremiumMarketProps) => {
  const { eventId } = useParams();
  const dispatch = useAppDispatch();
  const isAuthenticated = useIsAuthenticated();
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const { betDetails, oneClickBetEnabled, oneClickBetStake } = useAppSelector(
    (state) => state.betPlace
  );
  const [placeBet, { isLoading: isPlacingBet }] = usePlaceBetMutation({
    fixedCacheKey: 'placeBet',
  });
  const { data: booksetCalculation } = useGetBooksetCalcQuery({ eventId: Number(eventId) });
  const runners = Array.isArray(market.runners) ? market.runners : [];
  const blockedStatus =
    getBlockedStatus(undefined, market.status) ??
    runners.map((runner) => getBlockedStatus(runner.status, market.status)).find(Boolean);
  const min = market.minBetAmount ?? betConfig?.minBetAmount ?? undefined;
  const max = market.maxBetAmount ?? betConfig?.maxBetAmount ?? undefined;
  const isSelectedMarket =
    betDetails.marketType === 'PREMIUM' &&
    String(betDetails.eventId) === String(eventId) &&
    betDetails.marketId === market.marketId;

  const handleSelect = async (runner: PremiumRunner) => {
    const selectionId = runner.selectionId ?? runner.runnerId;
    const rate = Number(runner.backPrice1);
    if (
      blockedStatus ||
      isPlacingBet ||
      !Number.isFinite(rate) ||
      rate <= 0 ||
      selectionId == null ||
      selectionId === '' ||
      !runner.runnerName
    )
      return;

    if (!isAuthenticated) {
      toast.error('Please login to access!');
      return;
    }

    // Velki Premium selections use the first BACK price, never the exchange/normal payload.
    const payload: BetPlaceRequest = {
      eventId: Number(eventId),
      position: 0,
      betOn: 'BACK',
      rate,
      stake: oneClickBetStake ?? 0,
      runnerName: runner.runnerName,
      selectionId: String(selectionId),
      marketCategory: market.category ?? market.marketCategory,
      marketId: market.marketId,
      marketName: market.marketName,
      marketType: 'PREMIUM',
      acceptOddsChange: false,
    };

    if (!oneClickBetEnabled) {
      dispatch(setBetDetails({ ...payload, min, max }));
      return;
    }
    if (payload.stake <= 0) {
      toast.error('Please save a one click bet stake first.');
      return;
    }
    try {
      const response = await placeBet(payload).unwrap();
      toast.success(response?.message || 'Bet placed successfully', { id: 'bet-place' });
    } catch (error) {
      toast.error(
        (error as { data?: { message?: string } })?.data?.message || 'Failed to place bet',
        { id: 'bet-place' }
      );
    }
  };

  return (
    <section className="bg-white font-[Roboto,Helvetica,Arial,sans-serif] text-black">
      <div className="border-b border-white bg-[#243a48] text-white">
        <button
          type="button"
          onClick={() => setIsExpanded((value) => !value)}
          aria-expanded={isExpanded}
          className="flex min-h-[35px] w-full items-center justify-between gap-[8px] py-0 pl-[11px] pr-[12px] text-left text-[11.5px] font-bold leading-[20px] sm:min-h-[25px] sm:pl-[21px] sm:pr-[22px] sm:text-[14px]"
        >
          <span className="min-w-0 break-words">{market.marketName}</span>
          {isExpanded ? (
            <MinusSquare size={13} className="shrink-0" aria-hidden="true" />
          ) : (
            <PlusSquare size={13} className="shrink-0" aria-hidden="true" />
          )}
        </button>
      </div>
      {isExpanded && (
        <div>
          {runners.map((runner, index) => {
            const selectionId = runner.selectionId ?? runner.runnerId;
            const rate = Number(runner.backPrice1);
            const isEmpty = !Number.isFinite(rate) || rate <= 0;
            const selected =
              isSelectedMarket && String(betDetails.selectionId) === String(selectionId);
            const exposure = Number(
              booksetCalculation
                ?.find((item) => String(item.marketExternalId) === String(market.marketId))
                ?.selections.find((item) => String(item.selectionId) === String(selectionId))
                ?.exposure ?? 0
            );

            return (
              <div
                key={`${selectionId}-${index}`}
                className="grid min-h-[37px] grid-cols-[62%_38%] border-b border-[#7e97a7] bg-white sm:grid-cols-[62.5%_20%_17.5%]"
              >
                <div className="flex min-w-0 items-center px-[5px] py-[4px] text-[13px] font-bold leading-[18px] sm:text-[12px]">
                  <p className="min-w-0 flex-1 break-words">
                    {runner.runnerName}
                    {Number.isFinite(exposure) && exposure !== 0 && (
                      <span
                        aria-label="Current profit or loss"
                        className={cn(
                          'ml-[5px] inline-block text-[11px] leading-[16.5px]',
                          exposure < 0 ? 'text-[#d0021b]' : 'text-[#228b22]'
                        )}
                      >
                        ({Number(exposure.toFixed(2))})
                      </span>
                    )}
                  </p>
                </div>
                <div className="relative flex min-w-0 items-center py-[2px] sm:pl-[8px] sm:pr-[4px]">
                  <button
                    type="button"
                    aria-label={`${runner.runnerName} Back ${isEmpty ? 'Odds unavailable' : rate.toFixed(2)}`}
                    aria-pressed={selected}
                    disabled={Boolean(blockedStatus) || isPlacingBet || isEmpty}
                    onClick={() => handleSelect(runner)}
                    className={cn(
                      'flex min-h-[32px] w-full items-center justify-center rounded-[4px] bg-[#84c4ff] px-[4px] text-[14px] font-normal leading-[18px] disabled:cursor-not-allowed disabled:opacity-60',
                      selected && 'ring-2 ring-inset ring-[#243a48]'
                    )}
                  >
                    {isEmpty ? <Lock size={16} aria-hidden="true" /> : rate.toFixed(2)}
                  </button>
                  {blockedStatus && (
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[#243a48]/70 text-[11px] font-semibold uppercase text-white">
                      {blockedStatus}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      {isSelectedMarket && <BetSlip />}
    </section>
  );
};

export default PremiumMarket;
