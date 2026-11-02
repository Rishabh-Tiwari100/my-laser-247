import { Runner } from '@/types/market';
import { BetOn, MarketType } from '@/types/betPlace';
import React, { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import BetSlip from './BetSlip';
import { useAppDispatch } from '@/hooks';
import { setBetDetails } from '@/store/slices/betSlice';
import { RootState } from '@/store';
import { usePlaceBetMutation } from '@/store/api/betPlaceApi';
import toast from 'react-hot-toast';

interface NormalMarketRowProps {
  data: Runner;
  market?: {
    marketId?: string;
    marketName?: string;
    marketType?: string;
    marketCategory?: string;
  };
  min?: string | number | null;
  max?: string | number | null;
}

const BookmakerMarketRow = ({ data, market, min, max }: NormalMarketRowProps) => {
  const { eventId } = useParams();
  const dispatch = useAppDispatch();
  const betDetails = useSelector((state: RootState) => state.betPlace.betDetails);
  const oneClickBetStake = useSelector((state: RootState) => state.betPlace.oneClickBetStake);
  const oneClickBetEnabled = useSelector((state: RootState) => state.betPlace.oneClickBetEnabled);
  const [placeBet, { isLoading: isPlacingBet }] = usePlaceBetMutation({
    fixedCacheKey: 'placeBet',
  });

  const odds = [
    {
      priceKey: 'backPrice3',
      sizeKey: 'backSize3',
      bg: '#72bbef',
      hideOnMobile: false,
      betOn: 'BACK' as BetOn,
      position: 2,
    },
    {
      priceKey: 'backPrice2',
      sizeKey: 'backSize2',
      bg: '#72bbef',
      hideOnMobile: false,
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
      bg: '#faa9ba',
      hideOnMobile: false,
      betOn: 'LAY' as BetOn,
      position: 1,
    },
    {
      priceKey: 'layPrice3',
      sizeKey: 'laySize3',
      bg: '#faa9ba',
      hideOnMobile: false,
      betOn: 'LAY' as BetOn,
      position: 2,
    },
  ] as const;
  const visibleOdds = odds.filter(({ position }) => position === 0);

  const handleSelectOdds = useCallback(
    async (priceKey: keyof Runner, sizeKey: keyof Runner, betOn: BetOn, position: number) => {
      if (isPlacingBet) return;
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
      <div className="bg-white border border-[#7e97a7] grid items-center">
        <div className="grid grid-cols-12">
          <div className="col-span-7 md:col-span-5 flex items-center pr-2">
            <p className="min-w-0 overflow-auto flex-1 font-bold flex items-center text-xs pl-[5px]">
              {data?.runnerName}
            </p>
            <span className="ml-[5px]"></span>
          </div>
          <div className="col-span-5 md:col-span-7">
            <div className="w-full relative rounded-[6px] grid grid-cols-12">
              {visibleOdds.map(({ priceKey, sizeKey, bg, hideOnMobile, betOn, position }) => {
                const selectedOdd = isSelectedOdd(betOn, position);

                return (
                  <button
                    key={priceKey}
                    type="button"
                    aria-pressed={selectedOdd}
                    disabled={!data?.[priceKey] || isPlacingBet}
                    onClick={() => handleSelectOdds(priceKey, sizeKey, betOn, position)}
                    style={{
                      background: bg,
                      boxShadow: selectedOdd ? 'inset 0 0 0 2px #111827' : undefined,
                    }}
                    className={`${hideOnMobile ? 'max-md:hidden' : ''} col-span-6 text-[13px] font-semibold py-1 text-black h-[42.2px] disabled:opacity-50`}
                  >
                    {data?.[priceKey] ?? '-'}
                    <span className="block font-medium text-[10px] text-black">
                      {data?.[sizeKey] ?? '-'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      {isSelected && <BetSlip />}
    </>
  );
};

export default BookmakerMarketRow;
