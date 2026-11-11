import { Runner } from '@/types/market';
import { BetOn, MarketType } from '@/types/betPlace';
import React, { useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import BetSlip from './BetSlip';
import { useAppDispatch } from '@/hooks';
import { setBetDetails } from '@/store/slices/betSlice';
import { RootState } from '@/store';
import { useGetBooksetCalcQuery } from '@/store/api/booksetApi';
import { usePlaceBetMutation } from '@/store/api/betPlaceApi';
import { calculateProfitLoss } from '@/utils/helpers/booksetCalculation';
import { cn } from '@/lib/utils';
import { getBlockedStatus } from '@/utils';
import toast from 'react-hot-toast';

interface NormalMarketRowProps {
  data: Runner;
  market?: {
    marketId?: string;
    marketName?: string;
    marketType?: string;
    marketCategory?: string;
    gameType?: string;
    marketStatus?: string;
    status?: string;
  };
  min?: string | number | null;
  max?: string | number | null;
}

const NormalMarketRow = ({ data, market, min, max }: NormalMarketRowProps) => {
  const { eventId } = useParams();
  const dispatch = useAppDispatch();
  const betDetails = useSelector((state: RootState) => state.betPlace.betDetails);
  const oneClickBetStake = useSelector((state: RootState) => state.betPlace.oneClickBetStake);
  const oneClickBetEnabled = useSelector((state: RootState) => state.betPlace.oneClickBetEnabled);
  const [placeBet, { isLoading: isPlacingBet }] = usePlaceBetMutation({
    fixedCacheKey: 'placeBet',
  });
  const blockedStatus = getBlockedStatus(data?.status, market?.marketStatus ?? market?.status);
  const { data: booksetCalculation } = useGetBooksetCalcQuery({
    eventId: Number(eventId),
  });

  const exposureFromBookset = useMemo(() => {
    if (!booksetCalculation || !market?.marketId || !data?.selectionId) return 0;

    const booksetMarket = booksetCalculation.find(
      (item) => String(item.marketExternalId) === String(market.marketId)
    );
    const selection = booksetMarket?.selections.find(
      (item) => String(item.selectionId) === String(data.selectionId)
    );

    return Number(selection?.exposure ?? 0);
  }, [booksetCalculation, data?.selectionId, market?.marketId]);

  const calculatedPL = useMemo(() => {
    if (!betDetails?.stake) return null;

    return calculateProfitLoss(
      'NORMAL',
      betDetails,
      eventId,
      data?.selectionId,
      market?.marketId,
      market?.gameType
    );
  }, [betDetails, data?.selectionId, eventId, market?.gameType, market?.marketId]);

  const projectedExposure = calculatedPL === null ? null : exposureFromBookset + calculatedPL;
  const hasProjectedExposure = projectedExposure !== null && Number.isFinite(projectedExposure);
  const booksetValue = hasProjectedExposure ? projectedExposure : exposureFromBookset;

  const odds = [
    {
      priceKey: 'backPrice3',
      sizeKey: 'backSize3',
      bg: '#d7e8f4',
      hideOnMobile: true,
      betOn: 'BACK' as BetOn,
      position: 2,
    },
    {
      priceKey: 'backPrice2',
      sizeKey: 'backSize2',
      bg: '#b7d5eb',
      hideOnMobile: true,
      betOn: 'BACK' as BetOn,
      position: 1,
    },
    {
      priceKey: 'backPrice1',
      sizeKey: 'backSize1',
      bg: '#72bbef',
      hideOnMobile: false,
      betOn: 'BACK' as BetOn,
      position: 0,
    },
    {
      priceKey: 'layPrice1',
      sizeKey: 'laySize1',
      bg: '#faa9ba',
      hideOnMobile: false,
      betOn: 'LAY' as BetOn,
      position: 0,
    },
    {
      priceKey: 'layPrice2',
      sizeKey: 'laySize2',
      bg: '#efd3d9',
      hideOnMobile: true,
      betOn: 'LAY' as BetOn,
      position: 1,
    },
    {
      priceKey: 'layPrice3',
      sizeKey: 'laySize3',
      bg: '#f6e6ea',
      hideOnMobile: true,
      betOn: 'LAY' as BetOn,
      position: 2,
    },
  ] as const;

  const isBookmaker = [market?.marketType, market?.marketName].some((value) =>
    value?.toLowerCase().includes('bookmaker')
  );
  const visibleOdds = odds;

  const handleSelectOdds = useCallback(
    async (priceKey: keyof Runner, sizeKey: keyof Runner, betOn: BetOn, position: number) => {
      if (blockedStatus || isPlacingBet) return;
      const price = data?.[priceKey];
      if (!price) return;

      const size = data?.[sizeKey] ?? 0;
      const stake = oneClickBetStake ?? 0;
      const nextBetDetails = {
        position,
        eventId: eventId ? Number(eventId) : 0,
        marketId: market?.marketId ?? '',
        marketName: market?.marketName ?? '',
        marketType: 'NORMAL' as MarketType,
        marketCategory: market?.marketType ?? '',
        selectionId: String(data?.selectionId ?? ''),
        runnerName: data?.runnerName ?? '',
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
      blockedStatus,
      data,
      dispatch,
      eventId,
      isPlacingBet,
      market,
      oneClickBetEnabled,
      oneClickBetStake,
      placeBet,
      min,
      max,
    ]
  );

  const isSelected =
    String(betDetails.selectionId) === String(data?.selectionId) &&
    String(betDetails.marketId) === String(market?.marketId);

  const isSelectedOdd = (betOn: BetOn, position: number) =>
    isSelected && betDetails.betOn === betOn && Number(betDetails.position ?? 0) === position;

  return (
    <>
      <div
        className={cn(
          'grid items-center border-x border-b border-[#7e97a7] text-black',
          isBookmaker ? 'bg-[#faf8d8]' : 'bg-white lg:[&:nth-of-type(even)]:bg-[#ececec]'
        )}
      >
        <div className="grid grid-cols-12">
          <div
            className={cn(
              'col-span-7 lg:col-span-5 flex items-center pr-2',
              market?.marketName?.toLowerCase() == 'bookmaker' && 'bg-[#faf8d8]'
            )}
          >
            <p className="min-w-0 flex-1 break-words py-[2px] pl-[5px] text-[12px] font-bold leading-[18px]">
              {data?.runnerName}
              {Number.isFinite(booksetValue) && (hasProjectedExposure || booksetValue !== 0) ? (
                <span
                  aria-label={
                    hasProjectedExposure ? 'Projected profit or loss' : 'Current profit or loss'
                  }
                  className={cn(
                    'ml-[5px] inline-block text-[11px] font-bold leading-[16.5px]',
                    booksetValue < 0
                      ? 'text-[#d0021b]'
                      : booksetValue > 0
                        ? 'text-[#228b22]'
                        : 'text-black'
                  )}
                >
                  ({Number(booksetValue.toFixed(2))})
                </span>
              ) : null}
            </p>
          </div>
          <div className="col-span-5 lg:col-span-7">
            <div className="relative grid h-full w-full grid-cols-12">
              {visibleOdds.map(({ priceKey, sizeKey, bg, hideOnMobile, betOn, position }) => {
                const selectedOdd = isSelectedOdd(betOn, position);

                if (isBookmaker && position !== 0) {
                  return (
                    <div
                      key={priceKey}
                      className="hidden h-full min-h-[43px] flex-col items-center justify-center text-[12px] lg:col-span-2 lg:flex"
                      style={{ background: bg }}
                    >
                      <span>-</span>
                      <span className="text-[10px]">-</span>
                    </div>
                  );
                }

                return (
                  <button
                    key={priceKey}
                    type="button"
                    aria-pressed={selectedOdd}
                    disabled={Boolean(blockedStatus) || !data?.[priceKey] || isPlacingBet}
                    onClick={() => handleSelectOdds(priceKey, sizeKey, betOn, position)}
                    style={{
                      background: bg,
                    }}
                    className={`${hideOnMobile ? 'max-lg:hidden' : ''} col-span-6 lg:col-span-2 border-r border-white/50 text-[13px] lg:text-[12px] font-semibold py-1 text-black h-full min-h-[42.5px] lg:min-h-[43px] disabled:opacity-50`}
                  >
                    {data?.[priceKey] ?? '-'}
                    <span className="block font-medium text-[10px] text-black">
                      {data?.[sizeKey] ?? '-'}
                    </span>
                  </button>
                );
              })}
              {blockedStatus && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 text-xs font-semibold capitalize text-white">
                  {blockedStatus}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {isSelected && <BetSlip />}
    </>
  );
};

export default NormalMarketRow;
