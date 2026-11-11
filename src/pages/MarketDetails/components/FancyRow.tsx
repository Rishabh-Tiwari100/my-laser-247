import { BetOn, MarketType } from '@/types/betPlace';
import { useAppDispatch } from '@/hooks';
import { RootState } from '@/store';
import { useGetBooksetCalcQuery } from '@/store/api/booksetApi';
import { usePlaceBetMutation } from '@/store/api/betPlaceApi';
import { setBetDetails } from '@/store/slices/betSlice';
import React, { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import BetSlip from './BetSlip';
import FancyExposureModal from './FancyExposureModal';
import toast from 'react-hot-toast';
import { formatStakeLimitRange, type StakeLimitValue } from './stakeLimit';

const FancyRow = ({
  data,
  min = '0',
  max = '0',
  isPinned = false,
  onTogglePin,
}: {
  data: any;
  min?: StakeLimitValue;
  max?: StakeLimitValue;
  isPinned?: boolean;
  onTogglePin?: () => void;
}) => {
  const { eventId } = useParams();
  const dispatch = useAppDispatch();
  const [isExposureModalOpen, setIsExposureModalOpen] = useState(false);
  const betDetails = useSelector((state: RootState) => state.betPlace.betDetails);
  const oneClickBetStake = useSelector((state: RootState) => state.betPlace.oneClickBetStake);
  const oneClickBetEnabled = useSelector((state: RootState) => state.betPlace.oneClickBetEnabled);
  const [placeBet, { isLoading: isPlacingBet }] = usePlaceBetMutation({
    fixedCacheKey: 'placeBet',
  });
  const runner = Array.isArray(data?.runners) ? data.runners[0] : data?.runners;
  const marketId = String(data?.marketId ?? data?.id ?? '');
  const marketName = data?.marketName ?? data?.name ?? runner?.runnerName ?? '';
  const marketCategory = data?.marketType ?? data?.marketCategory ?? 'FANCY';
  const isFancyOneMarket = [data?.marketType, data?.marketCategory].some(
    (value) => String(value ?? '').toLowerCase() === 'fancy1'
  );
  const isSuspended = [data?.status, runner?.status].some(
    (status) => String(status).toUpperCase() === 'SUSPENDED'
  );
  const { data: booksetCalculation } = useGetBooksetCalcQuery({
    eventId: Number(eventId),
  });

  const exposureFromBookset = useMemo(() => {
    if (!booksetCalculation || !marketId || !runner?.selectionId) return 0;

    const booksetMarket = booksetCalculation.find(
      (item) => String(item.marketExternalId) === marketId
    );
    const selection = booksetMarket?.selections.find(
      (item) => String(item.selectionId) === String(runner.selectionId)
    );

    return Number(selection?.exposure ?? 0);
  }, [booksetCalculation, marketId, runner?.selectionId]);

  const handleSelectOdds = useCallback(
    async (
      price: string | number | null | undefined,
      size: string | number | null | undefined,
      betOn: BetOn
    ) => {
      if (isSuspended || isPlacingBet || !price) return;

      const stake = oneClickBetStake ?? 0;
      const nextBetDetails = {
        position: 0,
        eventId: eventId ? Number(eventId) : 0,
        marketId,
        marketName,
        marketType: 'FANCY' as MarketType,
        marketCategory,
        selectionId: String(runner?.selectionId ?? ''),
        runnerName: runner?.runnerName ?? marketName,
        stake,
        rate: Number(price),
        fancyPercentage: Number(size || 0),
        betOn,
        acceptOddsChange: true,
        min,
        max,
      };

      if (!oneClickBetEnabled) {
        dispatch(setBetDetails(nextBetDetails));
        return;
      }

      if (stake <= 0) {
        toast.error('Please save a one click bet stake first.');
        return;
      }

      try {
        const { min: _min, max: _max, ...betPayload } = nextBetDetails;
        const response = await placeBet(betPayload).unwrap();
        toast.success(response?.message || 'Bet placed successfully', { id: 'bet-place' });
      } catch (error: any) {
        toast.error(error?.data?.message || 'Failed to place bet', { id: 'bet-place' });
      }
    },
    [
      dispatch,
      eventId,
      isSuspended,
      isPlacingBet,
      marketCategory,
      marketId,
      marketName,
      max,
      min,
      oneClickBetEnabled,
      oneClickBetStake,
      placeBet,
      runner,
    ]
  );

  const isSelected =
    String(betDetails.selectionId) === String(runner?.selectionId) &&
    String(betDetails.marketId) === marketId &&
    betDetails.marketType === 'FANCY';
  const isLaySelected = isSelected && betDetails.betOn === 'LAY';
  const isBackSelected = isSelected && betDetails.betOn === 'BACK';

  return (
    <>
      <div className="grid min-h-[45px] grid-cols-12 border-b border-[#8da9b7] bg-white font-helvetica text-black lg:grid-cols-[11fr_7fr]">
        <div className="col-span-7 flex min-w-0 items-center px-[4px] lg:col-span-1">
          <button
            type="button"
            onClick={onTogglePin}
            className="mx-[5px] flex shrink-0 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-1 focus-visible:outline-[#243a48]"
            aria-label={isPinned ? 'Unpin fancy market' : 'Pin fancy market'}
            aria-pressed={isPinned}
          >
            <img
              src={isPinned ? '/icons/pin-green.svg' : '/icons/pin.svg'}
              alt=""
              className="w-[18px] min-w-[18px] h-auto"
            />
          </button>
          <p className="min-w-0 flex-1 break-words py-[2px] text-[12px] font-bold leading-[18px]">
            {runner?.runnerName}
            {isFancyOneMarket &&
            Number.isFinite(exposureFromBookset) &&
            exposureFromBookset !== 0 ? (
              <span
                aria-label="Current profit or loss"
                className={`ml-[5px] inline-block text-[11px] font-bold leading-[16.5px] ${exposureFromBookset < 0 ? 'text-[#d0021b]' : 'text-[#228b22]'}`}
              >
                ({Number(exposureFromBookset.toFixed(2))})
              </span>
            ) : null}
            <span className="mt-0.5 block text-[9px] not-italic leading-none text-[#315195] lg:hidden">
              Min/Max {formatStakeLimitRange(min, max)}
            </span>
          </p>
          {!isFancyOneMarket && exposureFromBookset ? (
            <span className="ml-auto flex shrink-0 items-center gap-[6px] pl-[6px]">
              <button
                type="button"
                className="flex items-center justify-center rounded-[4px] border border-[#333] bg-[#243a48] px-[10px] py-[4px] text-[12px] font-bold leading-[18px] text-white focus-visible:outline focus-visible:outline-1 focus-visible:outline-[#243a48]"
                onClick={() => setIsExposureModalOpen(true)}
              >
                {Number(exposureFromBookset.toFixed(2))}
              </button>
              <button
                type="button"
                className="flex h-[24px] w-[10px] flex-col items-center justify-center gap-[2px] border-0 bg-transparent p-0 text-[#9a9a9a] hover:text-[#243a48] focus-visible:outline focus-visible:outline-1 focus-visible:outline-[#243a48]"
                aria-label="View fancy exposure ladder"
                onClick={() => setIsExposureModalOpen(true)}
              >
                <img
                  src="/icons/ladder.svg"
                  alt="Ladder"
                  className="filter-[brightness(0)_saturate(100%)_invert(54%)_sepia(4%)_saturate(11%)_hue-rotate(41deg)_brightness(93%)_contrast(89%)] max-w-[17px]"
                />
              </button>
            </span>
          ) : null}
        </div>

        <div className="col-span-5 grid min-w-0 grid-cols-1 lg:col-span-1 lg:grid-cols-4">
          <div className="relative grid h-full min-h-[44px] grid-cols-2 lg:col-span-2">
            <button
              type="button"
              aria-pressed={isLaySelected}
              disabled={isSuspended || isPlacingBet || !runner?.layPrice1}
              onClick={() => handleSelectOdds(runner?.layPrice1, runner?.laySize1, 'LAY')}
              className="bg-[#f3a1b5] disabled:bg-[#bd8492] py-1 text-[13px] font-semibold disabled:cursor-not-allowed"
            >
              {runner?.layPrice1 ?? '-'}
              <span className="block text-[10px] font-medium">{runner?.laySize1 ?? '-'}</span>
            </button>
            <button
              type="button"
              aria-pressed={isBackSelected}
              disabled={isSuspended || isPlacingBet || !runner?.backPrice1}
              onClick={() => handleSelectOdds(runner?.backPrice1, runner?.backSize1, 'BACK')}
              className="bg-[#72b9e8] disabled:bg-[#5893ba] py-1 text-[13px] font-semibold disabled:cursor-not-allowed"
            >
              {runner?.backPrice1 ?? '-'}
              <span className="block text-[10px] font-medium">{runner?.backSize1 ?? '-'}</span>
            </button>

            {isSuspended && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-700/20 text-xs font-bold text-white">
                SUSPENDED
              </div>
            )}
          </div>
          <div className="hidden items-center justify-center px-[3px] text-center text-[9px] font-normal font-helvetica lg:col-span-2 lg:flex">
            {formatStakeLimitRange(min, max)}
          </div>
        </div>
      </div>
      <FancyExposureModal
        open={isExposureModalOpen}
        onClose={() => setIsExposureModalOpen(false)}
        title={runner?.runnerName ?? marketName}
        eventId={eventId}
        selectionId={runner?.selectionId}
        marketId={marketId}
      />
      {isSelected && <BetSlip />}
    </>
  );
};

export default FancyRow;
