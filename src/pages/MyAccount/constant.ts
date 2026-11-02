export interface AccountMenu {
  title: string;
  path: string;
  showOutside?: boolean;
  showInside?: boolean;
}

export const ACCOUNT_MENUS: AccountMenu[] = [
  {
    title: 'My Profile',
    path: '/my-account/profile',
    showOutside: true,
    showInside: true,
  },
  {
    title: 'Balance Overview',
    path: '/my-account/balance-overview',
    showOutside: true,
    showInside: true,
  },
  {
    title: 'Account Statement',
    path: '/account-statement',
    showOutside: true,
    showInside: true,
  },
  {
    title: 'Bonus',
    path: '/bonus-statement',
    showOutside: true,
    showInside: true,
  },
  {
    title: 'My Bets',
    path: '/my-account/my-bets',
    showOutside: true,
    showInside: true,
  },
  {
    title: 'Bet History',
    path: '/settled-bets',
    showOutside: true,
    showInside: false,
  },
  {
    title: 'Profit & Loss',
    path: '/my-account/profit-loss',
    showOutside: true,
    showInside: false,
  },
  {
    title: 'Parlay Bets',
    path: '/my-account/parlay-bets',
    showOutside: false,
    showInside: true,
  },
  {
    title: 'AWC Bets',
    path: '/my-account/awc-bets',
    showOutside: false,
    showInside: true,
  },
  {
    title: 'BO Bets',
    path: '/my-account/bo-bets',
    showOutside: false,
    showInside: true,
  },
  {
    title: 'Betgames Bets',
    path: '/my-account/betgames-bets',
    showOutside: false,
    showInside: true,
  },
  {
    title: 'Activity Log',
    path: '/my-account/activity-log',
    showOutside: true,
    showInside: true,
  },
  {
    title: 'Update Mobile Number',
    path: '/my-account/update-mobile-number',
    showOutside: false,
    showInside: true,
  },
  {
    title: 'Cashback',
    path: '/cashback',
    showOutside: true,
    showInside: false,
  },
];
