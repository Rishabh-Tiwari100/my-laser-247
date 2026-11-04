import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Rules from './index';

it('opens Speed Cash by default and keeps the other rule sections collapsed', () => {
  render(<Rules />);
  expect(screen.getByRole('button', { name: 'Speed Cash' })).toHaveAttribute(
    'aria-expanded',
    'true'
  );
  expect(screen.getByRole('region', { name: 'Speed Cash' })).toHaveTextContent(
    "1. The customer is receiving plus on both selections, making him eligible for 'Speed Cash'."
  );
  expect(screen.getByRole('button', { name: 'Football Fancy' })).toHaveAttribute(
    'aria-expanded',
    'false'
  );
  expect(screen.queryByRole('region', { name: 'Football Fancy' })).not.toBeInTheDocument();
  expect(screen.getAllByRole('button')).toHaveLength(25);
});

it('allows multiple sections to open and close independently', () => {
  render(<Rules />);
  const football = screen.getByRole('button', { name: 'Football Fancy' });
  const speedCash = screen.getByRole('button', { name: 'Speed Cash' });
  fireEvent.click(football);
  expect(screen.getByRole('region', { name: 'Football Fancy' })).toHaveTextContent(
    'Under_Over Goals'
  );
  expect(screen.getByRole('region', { name: 'Speed Cash' })).toBeVisible();
  fireEvent.click(speedCash);
  expect(screen.queryByRole('region', { name: 'Speed Cash' })).not.toBeInTheDocument();
  expect(screen.getByRole('region', { name: 'Football Fancy' })).toBeVisible();
  fireEvent.click(football);
  expect(screen.queryByRole('region', { name: 'Football Fancy' })).not.toBeInTheDocument();
});
