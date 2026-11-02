import { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import { RootState } from '@/store';
import { setBetDetails, setBetPL } from '@/store/slices/betSlice';
import { usePlaceBetMutation } from '@/store/api/betPlaceApi';
import { useGetStakeSetQuery } from '@/store/api/stakesApi';
import { useIsDemoUser } from '@/hooks/redux';
import { formatNumber } from '@/utils';

export const useBetSlip = (providedEventId?: string | number | null) => {
  const { eventId: routeEventId } = useParams();
  const eventId = providedEventId ?? routeEventId;
  const dispatch = useDispatch();

  const [isLiveTvOpen, setIsLiveTvOpen] = useState(true);
  const [tab, setTab] = useState<'betSlip' | 'myBets'>('betSlip');
  const [acceptOddsChange, setAcceptOddsChange] = useState(true);

  const betDetails = useSelector((s: RootState) => s.betPlace.betDetails);
  const betPL = useSelector((s: RootState) => s.betPlace.betPL);
  const wallet = useSelector((s: RootState) => s.wallet);
  const availableBalance = useMemo(() => {
    const mainBalance = Number(wallet.mainBalance || 0);
    const bonusBalance = Number(wallet.bonusBalance || 0);
    const exposure = Number(wallet.exposure || 0);
    const lockedAmount = Number(wallet.lockedAmount || 0);
    const balance = mainBalance + bonusBalance - Math.abs(exposure) - Math.abs(lockedAmount);

    return formatNumber(Number(Math.max(balance, 0).toFixed(2)));
  }, [wallet.bonusBalance, wallet.exposure, wallet.lockedAmount, wallet.mainBalance]);

  const { data: stakes, isLoading: stakesLoader, refetch: refetchStakes } = useGetStakeSetQuery({ type: 'Bet' });
  const stakesArr = useMemo(
    () =>
      (stakes?.stakeSet ?? []).filter(
        (stake) => Number.isFinite(Number(stake.value)) && Number(stake.value) > 0
      ),
    [stakes]
  );

  const [placeBet, { isLoading: isPlacingBet }] = usePlaceBetMutation({
    fixedCacheKey: 'placeBet',
  });
  const isDemoUser = useIsDemoUser();

  const handlePlaceBet = useCallback(async () => {
    const { min, max, ...betPayload } = betDetails;
    const toastId = { id: 'bet-place' };

    try {
      const res = await placeBet({
        ...betPayload,
        acceptOddsChange,
      }).unwrap();

      toast.success(res?.message || 'Bet placed successfully', toastId);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to place bet', toastId);
    } finally {
      dispatch(setBetDetails({}));
      dispatch(setBetPL(0));
    }
  }, [betDetails, acceptOddsChange, placeBet, dispatch]);

  const handleClear = useCallback(() => {
    dispatch(setBetDetails({ ...betDetails, stake: '' }));
    dispatch(setBetPL(0));
  }, [betDetails, dispatch]);

  const handleReset = useCallback(() => {
    dispatch(setBetDetails({}));
    dispatch(setBetPL(0));
  }, [dispatch]);

  const handleStakeChange = useCallback(
    (value: string) => {
      if (value === '' || /^\d*$/.test(value)) {
        dispatch(
          setBetDetails({
            ...betDetails,
            stake: value,
          })
        );
      }
    },
    [betDetails, dispatch]
  );

  const increaseStake = useCallback(
    (value: number) => {
      dispatch(
        setBetDetails({
          ...betDetails,
          stake: Number(betDetails.stake || 0) + value,
        })
      );
    },
    [betDetails, dispatch]
  );

  const increaseOdds = useCallback(() => {
    const current = Number(betDetails.rate || 0);
    const next = Number((current + 0.01).toFixed(2));

    dispatch(
      setBetDetails({
        ...betDetails,
        rate: next,
      })
    );
  }, [betDetails, dispatch]);

  const decreaseOdds = useCallback(() => {
    const current = Number(betDetails.rate || 0);
    const next = Math.max(0, current - 0.01);

    dispatch(
      setBetDetails({
        ...betDetails,
        rate: Number(next.toFixed(2)),
      })
    );
  }, [betDetails, dispatch]);

  useEffect(() => {
    if (eventId && String(eventId) !== String(betDetails.eventId)) {
      dispatch(setBetDetails({}));
      dispatch(setBetPL(0));
    }
  }, [eventId, betDetails.eventId, dispatch]);

  useEffect(() => {
    setTab('betSlip');
  }, [betDetails?.rate]);

  useEffect(() => {
    dispatch(setBetPL(0));
  }, [betDetails.rate, betDetails.selectionId, betDetails.betOn, dispatch]);

  const handleRateChange = useCallback(
    (value: string) => {
      if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
        dispatch(
          setBetDetails({
            ...betDetails,
            rate: value === '' ? '' : Number(value),
          })
        );
      }
    },
    [betDetails, dispatch]
  );

  return {
    tab,
    setTab,
    acceptOddsChange,
    setAcceptOddsChange,
    setIsLiveTvOpen,

    // redux data
    betDetails,
    betPL,
    availableBalance,

    isLiveTvOpen,
    isPlacingBet,
    stakesLoader,
    stakesArr,
    refetchStakes,

    isDemoUser,

    // handlers
    handleStakeChange,
    handleRateChange,
    handlePlaceBet,
    handleClear,
    handleReset,
    increaseStake,
    increaseOdds,
    decreaseOdds,
  };
};
