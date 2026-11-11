import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { useCashOut } from '@/hooks/useCashOut';
import type { Market } from '@/store/api/catalogueApi';
import MarketCashoutControls from './MarketCashoutControls';

jest.mock('@/hooks/useCashOut', () => ({ useCashOut: jest.fn() }));

const market = { runners: [{ selectionId: '1' }, { selectionId: '2' }] } as Market;
const handleCashout = jest.fn();

describe('reference cashout controls', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(useCashOut).mockReturnValue({
      isAuthenticated: true, isCashoutAvailable: false, bestOption: null, handleCashout,
    });
  });
  it('shows disabled cashout and loss cut controls for an authenticated two-runner market', () => {
    render(<MarketCashoutControls eventId="1" market={market} />);
    for (const name of ['Cashout', 'Loss cut']) {
      expect((screen.getByRole('button', { name }) as HTMLButtonElement).disabled).toBe(true);
    }
  });

  it('opens the existing cashout flow when a hedge is available', () => {
    jest.mocked(useCashOut).mockReturnValue({
      isAuthenticated: true, isCashoutAvailable: true, handleCashout,
      bestOption: { method: 'BACK', selectionId: '1', runnerName: 'A', stake: 10,
        oddValue: 2, position: 0, finalPositions: { '1': 10, '2': 10 }, finalProfit: 10 },
    });
    render(<MarketCashoutControls eventId="1" market={market} min={10} max={1000} />);
    const button = screen.getByRole('button', { name: 'Cashout' }) as HTMLButtonElement;
    expect(button.disabled).toBe(false);
    fireEvent.click(button);
    expect(handleCashout).toHaveBeenCalledTimes(1);
    expect(useCashOut).toHaveBeenCalledWith('1', market, 10, 1000);
  });

  it('does not show controls for a multi-runner market', () => {
    render(<MarketCashoutControls market={{ ...market, runners: [...market.runners, ...market.runners] }} />);
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('does not show controls for guests', () => {
    jest.mocked(useCashOut).mockReturnValue({
      isAuthenticated: false, isCashoutAvailable: false, bestOption: null, handleCashout,
    });
    render(<MarketCashoutControls market={market} />);
    expect(screen.queryByRole('button')).toBeNull();
  });
});
