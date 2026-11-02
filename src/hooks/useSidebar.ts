import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { Icons } from '@/utils/icons';

import { useGetCompetitionByIdQuery } from '@/store/api/sidebarApi';
import { useLogoutMutation } from '@/store/api/authApi';
import { useGetContactSupportQuery } from '@/store/api/userApi';
import { logout as clearAuth } from '@/store';

import { useIsAuthenticated } from '@/hooks';
import {
  useIsAffiliateUser,
  useIsDemoUser,
  useIsSelfRegistered,
  useUserProfile,
} from '@/hooks/redux';

const menuItems = [
  {
    label: 'Cricket',
  },
  {
    label: 'Football',
  },
  {
    label: 'Tennis',
  },
  {
    label: 'Horse Racing',
  },
  {
    label: 'FIFA CUP WINNER',
  },
  {
    label: 'WINNER CUP',
  },
  {
    label: 'ELECTION',
  },
  {
    label: 'Kabaddi',
  },
  {
    label: 'Election',
  },
  {
    label: 'Greyhound Racing',
  },
  {
    label: 'Esports',
  },
  {
    label: 'Mixed Martial Arts',
  },
  {
    label: 'Gaelic Games',
  },
  {
    label: 'Volleyball',
  },
  { label: 'Handball' },
  {
    label: 'Australian Rules',
  },
  {
    label: 'Ice Hockey',
  },
  {
    label: 'Basketball',
  },
  {
    label: 'Baseball',
  },
  {
    label: 'American Football',
  },
];

export type IconName = keyof typeof Icons;

interface MenuItem {
  label: string;
  path?: string;
  icon: IconName;
  order: number;
}

export const privateMenu: MenuItem[] = [
  { label: 'My Wallet', path: '/wallet', icon: 'myWallet', order: 4 },
  // { label: 'My Transaction', path: '/transactions', icon: 'myTransaction' },
  { label: 'Bet History', path: '/settled-bets', icon: 'betHistory', order: 5 },
  { label: 'Casino Bet History', path: '/casino-bet-history', icon: 'betHistory', order: 6 },
  { label: 'Betting Profit & Loss', path: '/profit-loss', icon: 'bettingProfitLoss', order: 7 },
  { label: 'Turnover History', path: '/turnover-history', icon: 'turnoverHistory', order: 8 },
  { label: 'Account Statement', path: '/account-statement', icon: 'accountStatement', order: 9 },
  // { label: 'Commission Report', path: '/commission-report', icon: 'commissionReport' },
  { label: 'Bonus', path: '/bonus-statement', icon: 'bonusStatement', order: 10 },
  { label: 'Referral', path: '/referral', icon: 'referral', order: 11 },
  { label: 'Stake Settings', path: '/stake-settings', icon: 'stakeSettings', order: 12 },
  { label: 'My Profile', path: '/my-profile', icon: 'myProfile', order: 13 },
  { label: 'Change Password', path: '/change-password', icon: 'lock', order: 14 },
];

export const privateToNonSelfRegisteredUser: MenuItem[] = [
  { label: 'Deposit', path: '/deposit', icon: 'deposit', order: 2 },
  { label: 'Withdraw', path: '/withdraw', icon: 'withdraw', order: 3 },
];

export const privateToAffiliateUser: MenuItem[] = [
  { label: 'Affiliate', path: '/affiliate', icon: 'affiliate', order: 15 },
];

export const publicMenu: MenuItem[] = [
  { label: 'Promotions', path: '/promotions', icon: 'promotions', order: 1 },
  // { label: 'Game Rules', path: '/game-rules', icon: 'gameRules' },
];

export const useSidebar = ({
  setIsSidebarOpen,
}: {
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const getSportFromPath = useCallback(() => {
    if (location.pathname.startsWith('/sports/cricket')) return 'Cricket';
    if (location.pathname.startsWith('/sports/football')) return 'Soccer';
    if (location.pathname.startsWith('/sports/tennis')) return 'Tennis';
    return null;
  }, [location.pathname]);

  const [selectedSport, setSelectedSport] = useState<string | null>(getSportFromPath);

  useEffect(() => {
    const sport = getSportFromPath();
    if (sport && sport !== selectedSport) {
      setSelectedSport(sport);
    }
  }, [getSportFromPath, selectedSport]);

  const handleSelectSport = useCallback((label: string) => {
    const sport = label === 'Football' ? 'Soccer' : label;
    setSelectedSport(sport);
  }, []);

  const [showContactSupport, setShowContactSupport] = useState(false);

  // auth / user
  const isAuthenticated = useIsAuthenticated();
  const isSelfRegister = useIsSelfRegistered();
  const isAffiliateUser = useIsAffiliateUser();
  const isDemoUser = useIsDemoUser();
  const userProfile = useUserProfile();

  const [logout, { isLoading: logoutLoading }] = useLogoutMutation();
  const { data: competitionsData, isFetching: competitionsLoading } = useGetCompetitionByIdQuery(
    selectedSport === 'Soccer' ? 'Soccer' : (selectedSport ?? ''),
    {
      skip: !selectedSport,
    }
  );
  const competitions = competitionsData?.competitions ?? [];
  const { data: contactSupport } = useGetContactSupportQuery();

  const { whatsapp = '', telegram = '', imo = '' } = contactSupport ?? {};

  const handleNavigate = useCallback(
    (label: string) => {
      if (label === 'Casino') {
        setIsSidebarOpen(false);
        navigate('/casino');
        return;
      }

      if (label === 'Favourite Games') {
        setIsSidebarOpen(false);
        navigate('/casino/favourite-games');
        return;
      }

      const sportRoutes: Record<string, string> = {
        Cricket: 'cricket',
        Soccer: 'football',
        Tennis: 'tennis',
      };

      if (label === 'sports') {
        navigate('/sports');
        return;
      }

      if (sportRoutes[label]) {
        navigate(`/sports/${sportRoutes[label]}`);
      }
    },
    [navigate]
  );

  const handleLogout = useCallback(async () => {
    const toastId = toast.loading('Logging out...');
    try {
      await logout().unwrap();
      dispatch(clearAuth());
      toast.success('You have been logged out successfully.', { id: toastId });
      navigate('/login');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Logout failed. Please try again.', { id: toastId });
    }
  }, [logout, dispatch, navigate]);

  const openContactApp = useCallback(
    (type: 'whatsapp' | 'telegram' | 'imo') => {
      // Simple mobile detection
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

      switch (type) {
        case 'whatsapp': {
          if (!whatsapp) {
            toast.error('WhatsApp support is currently unavailable.', { id: 'support-wa' });
            return;
          }
          const text = encodeURIComponent('Hello, I need assistance.');
          const separator = whatsapp.includes('?') ? '&' : '?';
          window.open(`${whatsapp}${separator}text=${text}`, '_blank', 'noopener,noreferrer');
          break;
        }

        case 'telegram': {
          if (!telegram) {
            toast.error('Telegram support is currently unavailable.', { id: 'support-tg' });
            return;
          }
          window.open(telegram, '_blank', 'noopener,noreferrer');
          break;
        }

        case 'imo': {
          if (!imo) {
            toast.error('IMO support is currently unavailable.', { id: 'support-imo' });
            return;
          }

          const username = imo.split('/').pop();

          if (isMobile) {
            window.location.href = `imo://chat?username=${username}`;

            setTimeout(() => {
              if (document.visibilityState === 'visible') {
                window.open(imo, '_blank', 'noopener,noreferrer');
              }
            }, 1000);
          } else {
            window.open(imo, '_blank', 'noopener,noreferrer');
          }
          break;
        }
      }
    },
    [whatsapp, telegram, imo]
  );

  const getMenuItems = (): MenuItem[] => {
    if (!isAuthenticated) return publicMenu;

    let menu: MenuItem[] = [...privateMenu];

    if (isSelfRegister) {
      menu = [...menu, ...privateToNonSelfRegisteredUser];
    }

    if (isSelfRegister && !isAffiliateUser && !isDemoUser) {
      menu = [...menu, ...privateToAffiliateUser];
    }

    if (isDemoUser) {
      menu = menu.filter((item) => item.path !== '/change-password');
    }

    menu = [...menu, ...publicMenu];

    return menu.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  };

  const menuToRender = getMenuItems();

  return {
    // state
    selectedSport,
    showContactSupport,
    setShowContactSupport,

    // data
    competitions,
    competitionsLoading,
    userProfile,
    isAuthenticated,
    logoutLoading,
    menuItems,
    menuToRender,

    // handlers
    handleNavigate,
    handleLogout,
    handleSelectSport,
    openContactApp,
  };
};
