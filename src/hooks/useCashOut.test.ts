import { act, renderHook } from '@testing-library/react';
import { useAppDispatch, useIsAuthenticated } from '@/hooks';
import { useGetBooksetCalcQuery } from '@/store/api/booksetApi';
import { useCashOut } from './useCashOut';
import type { Market } from '@/store/api/catalogueApi';

jest.mock('@/hooks', () => ({ useAppDispatch: jest.fn(), useIsAuthenticated: jest.fn() }));
jest.mock('@/store/api/booksetApi', () => ({ useGetBooksetCalcQuery: jest.fn() }));

const dispatch = jest.fn();
const market = {
  marketId: 'market-1', marketName: 'Match Odds', marketType: 'MATCH_ODDS',
  runners: [
    { selectionId: '1', runnerName: 'Team A', backPrice1: 2, layPrice1: 2.1 },
    { selectionId: '2', runnerName: 'Team B', backPrice1: 1.9, layPrice1: 2 },
  ],
} as Market;

describe('original cashout hedge', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(useAppDispatch).mockReturnValue(dispatch);
    jest.mocked(useIsAuthenticated).mockReturnValue(true);
  });

  const exposure = (a: number, b: number) => {
    (useGetBooksetCalcQuery as jest.Mock).mockReturnValue({ data: [{
      marketExternalId: 'market-1', selections: [
        { selectionId: '1', exposure: a }, { selectionId: '2', exposure: b },
      ],
    }] });
  };

  it('calculates a hedge and opens a populated bet slip without placing a bet', () => {
    exposure(100, -100);
    const { result } = renderHook(() => useCashOut('42', market, 10, 1000));
    expect(result.current.bestOption).toMatchObject({
      method: 'LAY', selectionId: '1', stake: 95.24, oddValue: 2.1, finalProfit: -4.76,
    });
    act(() => result.current.handleCashout());
    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: 'bet/setBetDetails',
      payload: expect.objectContaining({ eventId: 42, marketId: 'market-1',
        selectionId: '1', stake: 95.24, rate: 2.1, betOn: 'LAY', min: 10, max: 1000 }),
    }));
  });

  it('does not offer a hedge for a balanced position', () => {
    exposure(25, 25);
    const { result } = renderHook(() => useCashOut('42', market));
    expect(result.current.bestOption).toBeNull();
  });

  it('uses bookmaker percentage odds when calculating the hedge', () => {
    exposure(100, -100);
    const bookmaker = { ...market, marketType: 'bookmaker', runners: market.runners.map(
      (runner) => ({ ...runner, backPrice1: 100, layPrice1: 100 })
    ) };
    const { result } = renderHook(() => useCashOut('42', bookmaker));
    expect(result.current.bestOption).toMatchObject({ stake: 100, finalProfit: 0 });
  });
});
