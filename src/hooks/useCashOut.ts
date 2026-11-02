import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { skipToken } from '@reduxjs/toolkit/query';

import { useAppDispatch, useIsAuthenticated } from '@/hooks';
import { useGetBooksetCalcQuery, ExposureResponse } from '@/store/api/booksetApi';
import { Market, Runner } from '@/store/api/catalogueApi';
import { setBetDetails } from '@/store/slices/betSlice';
import { BetOn, MarketType } from '@/types/betPlace';

type SelectionId = string;

interface CashoutOption {
  method: BetOn;
  selectionId: SelectionId;
  runnerName: string;
  stake: number;
  oddValue: number;
  position: number;
  finalPositions: Record<SelectionId, number>;
  finalProfit: number;
}

interface Candidate {
  method: BetOn;
  runner: Runner;
  selectionId: SelectionId;
  odds: number;
  stake: number;
  position: number;
  riskAfter: Record<SelectionId, number>;
}

const epsilon = 0.01;
const round = (value: number) => Math.round(value * 100) / 100;

function buildBook(
  exposureData: ExposureResponse | undefined,
  runners: Runner[],
  marketId?: string
) {
  if (!exposureData?.length || runners.length !== 2) return null;

  const runnerIds = new Set(runners.map((runner) => String(runner.selectionId)));
  const markets = marketId
    ? exposureData.filter((market) => String(market.marketExternalId) === String(marketId))
    : exposureData;

  for (const market of markets) {
    const selections = Array.isArray(market?.selections) ? market.selections : [];
    const matched = selections.filter((selection) => runnerIds.has(String(selection.selectionId)));

    if (matched.length < 2) continue;

    return matched.reduce(
      (book, selection) => {
        book[String(selection.selectionId)] = Number(selection.exposure) || 0;
        return book;
      },
      {} as Record<SelectionId, number>
    );
  }

  return null;
}

function simulate(
  type: BetOn,
  selectionId: SelectionId,
  stake: number,
  odds: number,
  book: Record<SelectionId, number>,
  idA: string,
  idB: string,
  isBookmaker = false
) {
  let a = book[idA] ?? 0;
  let b = book[idB] ?? 0;

  const isA = selectionId === idA;
  const win = isBookmaker ? (odds / 100) * stake : (odds - 1) * stake;

  if (type === 'BACK') {
    if (isA) {
      a += win;
      b -= stake;
    } else {
      b += win;
      a -= stake;
    }
  } else if (isA) {
    a -= win;
    b += stake;
  } else {
    b -= win;
    a += stake;
  }

  return {
    [idA]: round(a),
    [idB]: round(b),
  };
}

const getOdds = (runner: Runner) => ({
  back: Number(runner.backPrice1) > 1 ? Number(runner.backPrice1) : null,
  lay: Number(runner.layPrice1) > 1 ? Number(runner.layPrice1) : null,
});

function solve(
  runners: Runner[],
  book: Record<SelectionId, number>,
  marketType?: string,
  marketName?: string
): CashoutOption | null {
  if (runners.length !== 2) return null;

  const [runnerA, runnerB] = runners;
  if (!runnerA || !runnerB) return null;

  const idA = String(runnerA.selectionId);
  const idB = String(runnerB.selectionId);
  const profitA = book[idA] ?? 0;
  const profitB = book[idB] ?? 0;

  if (Math.abs(profitA - profitB) <= epsilon) return null;

  const diff = Math.abs(profitA - profitB);
  const worseIsA = profitA < profitB;
  const isBookmaker = [marketType, marketName].some((value) =>
    value?.toLowerCase().includes('bookmaker')
  );
  const oddsA = isBookmaker
    ? {
        back: Number(runnerA.backPrice1) > 0 ? Number(runnerA.backPrice1) : null,
        lay: Number(runnerA.layPrice1) > 0 ? Number(runnerA.layPrice1) : null,
      }
    : getOdds(runnerA);
  const oddsB = isBookmaker
    ? {
        back: Number(runnerB.backPrice1) > 0 ? Number(runnerB.backPrice1) : null,
        lay: Number(runnerB.layPrice1) > 0 ? Number(runnerB.layPrice1) : null,
      }
    : getOdds(runnerB);
  const candidates: Candidate[] = [];

  const pushCandidate = (
    type: BetOn,
    runner: Runner,
    selectionId: SelectionId,
    odds: number,
    position: number
  ) => {
    const stake = isBookmaker ? diff / (1 + odds / 100) : diff / odds;
    if (stake <= 0) return;

    candidates.push({
      method: type,
      runner,
      selectionId,
      odds,
      stake,
      position,
      riskAfter: simulate(type, selectionId, stake, odds, book, idA, idB, isBookmaker),
    });
  };

  if (worseIsA) {
    if (oddsA.back) pushCandidate('BACK', runnerA, idA, oddsA.back, 0);
    if (oddsB.lay) pushCandidate('LAY', runnerB, idB, oddsB.lay, 0);
  } else {
    if (oddsB.back) pushCandidate('BACK', runnerB, idB, oddsB.back, 0);
    if (oddsA.lay) pushCandidate('LAY', runnerA, idA, oddsA.lay, 0);
  }

  const best = candidates.sort(
    (a, b) => Math.min(...Object.values(b.riskAfter)) - Math.min(...Object.values(a.riskAfter))
  )[0];
  if (!best) return null;

  return {
    method: best.method,
    selectionId: best.selectionId,
    runnerName: best.runner.runnerName,
    stake: round(best.stake),
    oddValue: round(best.odds),
    position: best.position,
    finalPositions: best.riskAfter,
    finalProfit: round(Math.min(...Object.values(best.riskAfter))),
  };
}

export function useCashOut(
  eventId?: string | number,
  market?: Market,
  min?: string | number | null,
  max?: string | number | null
) {
  const dispatch = useAppDispatch();
  const isAuthenticated = useIsAuthenticated();
  const runners = market?.runners ?? [];
  const marketId = market?.marketId;

  const { data: exposureData } = useGetBooksetCalcQuery(
    isAuthenticated && eventId ? { eventId: Number(eventId) } : skipToken
  );

  const book = useMemo(
    () => buildBook(exposureData, runners, marketId),
    [exposureData, runners, marketId]
  );

  const bestOption = useMemo(() => {
    if (!book || runners.length !== 2) return null;
    return solve(runners, book, market?.marketType, market?.marketName);
  }, [book, runners, market?.marketName, market?.marketType]);

  const isCashoutAvailable = Boolean(
    exposureData?.some((bookset) => String(bookset.marketExternalId) === String(marketId))
  );

  const handleCashout = () => {
    if (!eventId || !market || !bestOption) {
      toast.error('Cashout not available');
      return;
    }

    const runner = runners.find((item) => String(item.selectionId) === bestOption.selectionId);
    if (!runner) {
      toast.error('Cashout not available');
      return;
    }

    dispatch(
      setBetDetails({
        position: bestOption.position,
        eventId: Number(eventId),
        marketId: market.marketId,
        marketName: market.marketName,
        marketType: 'NORMAL' as MarketType,
        marketCategory: market.marketType ?? '',
        selectionId: bestOption.selectionId,
        runnerName: runner.runnerName,
        stake: bestOption.stake,
        rate: bestOption.oddValue,
        fancyPercentage: 0,
        betOn: bestOption.method,
        acceptOddsChange: true,
        min: min ?? market.minBetAmount ?? 0,
        max: max ?? market.maxBetAmount ?? 0,
      })
    );
  };

  return { handleCashout, bestOption, isAuthenticated, isCashoutAvailable };
}
