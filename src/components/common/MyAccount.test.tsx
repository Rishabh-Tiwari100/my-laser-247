import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, useLocation } from 'react-router-dom';
import MyAccount from './MyAccount';

const mockDispatch = jest.fn();
const mockUnwrap = jest.fn();
const mockLogout = jest.fn(() => ({ unwrap: mockUnwrap }));
jest.mock('react-redux', () => ({ useDispatch: () => mockDispatch }));
jest.mock('@/store/api/authApi', () => ({
  useLogoutMutation: () => [mockLogout, { isLoading: false }],
}));
jest.mock('@/store', () => ({ logout: () => ({ type: 'auth/logout' }) }));
jest.mock('@/store/api/stakesApi', () => ({
  useGetStakeSetQuery: () => ({ data: undefined }),
  useUpdateStakeSetMutation: () => [jest.fn(), { isLoading: false }],
}));
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: { loading: jest.fn(), success: jest.fn(), error: jest.fn() },
}));

function Location() {
  return <output data-testid="location">{useLocation().pathname}</output>;
}
function setup(mobile = true, open = true) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn(() => ({
      matches: mobile,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    })),
  });
  return render(
    <MemoryRouter>
      <MyAccount username="actual-user" open={open} />
      <Location />
    </MemoryRouter>
  );
}

beforeEach(() => {
  jest.clearAllMocks();
  mockUnwrap.mockResolvedValue({});
});

it('renders the mobile account screen in order with real destinations', () => {
  setup();
  const links = screen.getAllByRole('link');
  expect(links.map((link) => link.getAttribute('href'))).toEqual([
    '/apply-coupon',
    '/my-account/profile',
    '/account-statement',
    '/my-account/my-bets',
    '/change-password',
    '/user/rules',
  ]);
  expect(screen.getByText('GMT+5:30')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Market Analysis' })).toBeDisabled();
  expect(screen.queryByRole('menu')).not.toBeInTheDocument();
});

it.each([
  ['My Profile', '/my-account/profile'],
  ['Account Statement', '/account-statement'],
  ['Unsettled Bets', '/my-account/my-bets'],
  ['Change Password', '/change-password'],
  ['Rules', '/user/rules'],
  ['BONUS COUPON', '/apply-coupon'],
])('navigates %s to the existing page', (label, path) => {
  setup();
  fireEvent.click(screen.getByRole('link', { name: label }));
  expect(screen.getByTestId('location')).toHaveTextContent(path);
});

it('opens stake settings above the profile menu without navigating', () => {
  setup();
  fireEvent.click(screen.getByRole('button', { name: 'Stake Setting' }));
  expect(screen.getByRole('dialog', { name: 'Setting' })).toBeInTheDocument();
  expect(screen.getAllByRole('textbox')).toHaveLength(8);
  expect(screen.getByTestId('location')).toHaveTextContent('/');
  fireEvent.click(screen.getByRole('button', { name: 'Close stake settings' }));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(screen.getByRole('navigation', { name: 'Account pages' })).toBeInTheDocument();
});

it('calls the existing logout mutation and clears authentication after success', async () => {
  setup();
  fireEvent.click(screen.getByRole('button', { name: 'LOGOUT' }));
  await waitFor(() => expect(mockDispatch).toHaveBeenCalledWith({ type: 'auth/logout' }));
  expect(mockLogout).toHaveBeenCalledTimes(1);
});

it('preserves authentication when logout fails', async () => {
  mockUnwrap.mockRejectedValue({ data: { message: 'Failed' } });
  setup();
  fireEvent.click(screen.getByRole('button', { name: 'LOGOUT' }));
  await waitFor(() => expect(mockUnwrap).toHaveBeenCalled());
  expect(mockDispatch).not.toHaveBeenCalled();
});

it('does not show a mobile screen on desktop and supports closing the dropdown', async () => {
  setup(false, false);
  const trigger = screen.getByRole('button', { name: 'My Account' });
  expect(trigger).toHaveAttribute('aria-expanded', 'false');
  expect(screen.queryByRole('region', { name: 'Account' })).not.toBeInTheDocument();
});

it('opens the desktop dropdown and closes with Escape and outside interaction', async () => {
  setup(false, false).unmount();
  render(
    <MemoryRouter>
      <MyAccount username="actual-user" />
    </MemoryRouter>
  );
  const trigger = screen.getByRole('button', { name: 'My Account' });
  fireEvent.keyDown(trigger, { key: 'Enter', code: 'Enter' });
  expect(await screen.findByRole('menu')).toBeInTheDocument();
  fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape', code: 'Escape' });
  await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
  fireEvent.keyDown(trigger, { key: 'Enter', code: 'Enter' });
  expect(await screen.findByRole('menu')).toBeInTheDocument();
  fireEvent.pointerDown(document.body, { button: 0 });
  await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
});
