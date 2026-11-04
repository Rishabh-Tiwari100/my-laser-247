import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Icons } from '@/utils/icons';
import { useIsAuthenticated } from '@/hooks';
import { debounce, formatNumber } from '@/utils';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import {
  useGetContactSupportQuery,
  useGetUserProfileQuery,
  useGetUserWalletsQuery,
} from '@/store/api/userApi';
import { useGetNotificationsQuery } from '@/store/api/notificationApi';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import LoginModal from '@/components/modals/LoginModal';
import { IoMdSettings } from 'react-icons/io';
import LiveIcon from '../LiveIcon';
import MyAccount from '../MyAccount';
import { useGetEventsQuery } from '@/store/api/eventsApi';
import dayjs from 'dayjs';
import TopNavigation from '@/components/TopNavigation';
import GuestHeaderAuth from './GuestHeaderAuth';

interface HeaderProps {
  showOneClickBar: boolean;
  setShowOneClickBar: React.Dispatch<React.SetStateAction<boolean>>;
  isProfileMenuOpen: boolean;
  setIsProfileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header: React.FC<HeaderProps> = ({
  showOneClickBar,
  setShowOneClickBar,
  isProfileMenuOpen,
  setIsProfileMenuOpen,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMfaPage = location.pathname.includes('2fa');

  const isAuthenticated = useIsAuthenticated();
  const { refetch: refetchWallet, isFetching: isRefreshingWallet } = useGetUserWalletsQuery(
    undefined,
    {
      pollingInterval: 10000,
      skip: !isAuthenticated,
    }
  );
  useGetNotificationsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    skip: !isAuthenticated,
  });
  useGetUserProfileQuery(undefined, { skip: !isAuthenticated });
  useGetContactSupportQuery();
  const [checked, setChecked] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [search, setSearch] = useState('');
  const [searchText, setSearchText] = useState('');
  const [loadingDots, setLoadingDots] = useState('.');

  const debouncedSearch = useRef(
    debounce((value: string) => {
      setSearch(value);
    }, 500)
  ).current;

  const { data: searchData, isFetching: isSearching } = useGetEventsQuery(
    {
      search,
      status: 'ACTIVE',
    },
    {
      skip: search.trim().length < 2,
    }
  );

  const searchEvents = [
    ...(searchData?.cricket ?? []),
    ...(searchData?.football ?? []),
    ...(searchData?.tennis ?? []),
  ];

  const showDropdown = search.trim().length >= 2 && !isSearching;
  const currentDay = dayjs();

  const user = useSelector((s: RootState) => s.user.profile);
  const balanceInfo = useSelector((s: RootState) => s.wallet);
  const { username, mobile } = user ?? {};

  const mainBalance = balanceInfo?.mainBalance ?? 0;
  const bonusBalance = balanceInfo?.bonusBalance ?? 0;
  const exposure = balanceInfo?.exposure ?? 0;
  const lockedAmount = balanceInfo?.lockedAmount ?? 0;
  const withdrawableBalance = balanceInfo?.withdrawableBalance ?? 0;

  const totalBalance = Number(
    (mainBalance + bonusBalance - Math.abs(exposure) - Math.abs(lockedAmount)).toFixed(2)
  );

  const formattedTotalBalance = formatNumber(totalBalance);
  const formattedWithdrawableBalance = formatNumber(Number(withdrawableBalance.toFixed(2)));
  const formattedExposure = formatNumber(Number(exposure.toFixed(2)));

  const headerNavLinks = [
    { name: 'Home', path: '/' },
    { name: 'In-Play', path: '/inplay' },
    { name: 'Multi Markets', path: '/multi-markets' },
    { name: 'ICC W T20', path: '/icc-w-t20' },
    { name: 'FIFA World Cup', path: '/fifa world cup' },
    { name: 'Cricket', path: '/sports/cricket' },
    { name: 'Soccer', path: '/sports/football' },
    { name: 'Tennis', path: '/sports/tennis' },
    { name: 'Horse Racing', path: '/racing/horse' },
    { name: 'Greyhound Racing', path: '/racing/greyhound' },
    { name: 'Casino', path: '/casino', isNew: true },
    { name: 'Result', path: '/result' },
  ];

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!isRefreshingWallet) return;

    const interval = setInterval(() => {
      setLoadingDots((prev) => {
        if (prev === '.') return '..';
        if (prev === '..') return '...';
        return '.';
      });
    }, 300);

    return () => clearInterval(interval);
  }, [isRefreshingWallet]);

  useEffect(() => {
    if (!isRefreshingWallet) {
      setLoadingDots('.');
    }
  }, [isRefreshingWallet]);

  const liveCounts: Record<string, number> = {
    Cricket: 5,
    Soccer: 7,
    Tennis: 14,
  };

  return (
    <>
      <header className="sticky top-0 z-[1000] w-full bg-theme-navbar font-sans text-xs lg:font-helvetica">
        {/* Top Section: Logo, Search, and Auth Section */}
        <div className="flex min-h-[54px] items-center justify-between md:min-h-[70px] lg:h-[70px] lg:gap-4 lg:pr-8 lg:[&>div:first-child]:min-w-0 lg:[&>div:first-child]:flex-1 lg:[&>div:last-child]:shrink-0">
          {/* Left: Logo & Search */}
          <div className="flex items-center">
            {/* Mobile Sidebar Toggle */}
            <div className={`w-[125px] shrink-0 ${isAuthenticated ? 'h-[70px]' : 'h-[54px]'} lg:h-[70px] lg:w-[185px] flex items-center justify-center lg:justify-start lg:pl-3`}>
              <Link
                to="/"
                className="block text-center leading-[70px] w-auto lg:w-[178px] lg:shrink-0"
              >
                <span className="leading-[70px] text-center">
                  <img
                    src="/images/logo.png"
                    alt="My Laser247 Logo"
                    className="relative object-contain h-[30px] lg:left-0 lg:w-[178px] lg:h-10"
                  />
                </span>
              </Link>
            </div>
            {isAuthenticated && (
              <div className="hidden lg:flex relative group bg-white rounded w-[278px]">
                <button className="h-[25px] block lg:px-1.5">
                  <svg viewBox="0 0 24 24" className="w-[15px] h-[15px] lg:h-[13px] lg:w-[13px]">
                    <path
                      fill="#000000"
                      d="M15.5,14L20.5,19L19,20.5L14,15.5V14.71L13.73,14.43C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.43,13.73L14.71,14H15.5M9.5,4.5L8.95,4.53C8.71,5.05 8.34,5.93 8.07,7H10.93C10.66,5.93 10.29,5.05 10.05,4.53C9.87,4.5 9.69,4.5 9.5,4.5M13.83,7C13.24,5.97 12.29,5.17 11.15,4.78C11.39,5.31 11.7,6.08 11.93,7H13.83M5.17,7H7.07C7.3,6.08 7.61,5.31 7.85,4.78C6.71,5.17 5.76,5.97 5.17,7M4.5,9.5C4.5,10 4.58,10.53 4.73,11H6.87L6.75,9.5L6.87,8H4.73C4.58,8.47 4.5,9 4.5,9.5M14.27,11C14.42,10.53 14.5,10 14.5,9.5C14.5,9 14.42,8.47 14.27,8H12.13C12.21,8.5 12.25,9 12.25,9.5C12.25,10 12.21,10.5 12.13,11H14.27M7.87,8L7.75,9.5L7.87,11H11.13C11.21,10.5 11.25,10 11.25,9.5C11.25,9 11.21,8.5 11.13,8H7.87M9.5,14.5C9.68,14.5 9.86,14.5 10.03,14.47C10.28,13.95 10.66,13.07 10.93,12H8.07C8.34,13.07 8.72,13.95 8.97,14.47L9.5,14.5M13.83,12H11.93C11.7,12.92 11.39,13.69 11.15,14.22C12.29,13.83 13.24,13.03 13.83,12M5.17,12C5.76,13.03 6.71,13.83 7.85,14.22C7.61,13.69 7.3,12.92 7.07,12H5.17Z"
                    ></path>
                  </svg>
                </button>

                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => {
                    const value = e.target.value;

                    setSearchText(value);
                    debouncedSearch(value);
                  }}
                  className="text-xs h-[25px] w-full relative focus:outline-none text-black rounded"
                />

                {showDropdown && (
                  <div
                    className={`absolute top-[28px] -left-[14px] z-50 max-h-64 overflow-y-auto border border-gray-300 bg-white ${
                      searchEvents.length > 0 ? 'w-[22.25rem]' : 'w-[17.5rem] rounded shadow-lg'
                    }`}
                  >
                    {searchEvents.length > 0 ? (
                      searchEvents.map((event) => {
                        const eventTime = dayjs(event.time);
                        let dateLabel: string | null = null;

                        if (eventTime.isSame(currentDay.add(1, 'day'), 'day')) {
                          dateLabel = 'Tomorrow';
                        } else if (!eventTime.isSame(currentDay, 'day')) {
                          dateLabel = eventTime.format('DD/MM/YYYY');
                        }

                        return (
                          <button
                            key={event.eventId}
                            type="button"
                            onClick={() => {
                              setSearch('');
                              setSearchText('');

                              const sport =
                                event.sport.toLowerCase() === 'soccer'
                                  ? 'football'
                                  : event.sport.toLowerCase();

                              navigate(
                                `/sports/${sport}/${event.competitionId}/market-details/${event.eventId}`,
                                {
                                  state: {
                                    isPremiumFancy: event.externalId.startsWith('sr'),
                                  },
                                }
                              );
                            }}
                            className="flex min-h-[33px] w-full items-stretch border-b border-[#ddd] bg-[#f5f5f5] text-left last:border-b-0 hover:bg-[#eee]"
                          >
                            <span className="flex w-[73px] shrink-0 flex-col justify-center border-r border-[#d7d7d7] px-1 py-[3px] leading-[14px]">
                              {dateLabel && <span className="text-[#168bd2]">{dateLabel}</span>}
                              <span>{eventTime.format('HH:mm')}</span>
                            </span>
                            <span className="flex min-w-0 flex-1 items-center px-2">
                              <span className="truncate">{event.eventName}</span>
                            </span>
                          </button>
                        );
                      })
                    ) : (
                      <div
                        className="m-1 flex h-[30px] items-center justify-center rounded border border-[#aaa] bg-[#ccc] px-3 font-semibold text-[#1f1f1f]"
                        role="status"
                      >
                        No Data Found.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: Auth / Profile Section */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              // LOGGED IN VIEW
              <>
                <div className="flex h-[34px] min-w-0 items-stretch rounded border border-[#071a2a] bg-[#243a48] lg:h-[27px] lg:gap-[7px] lg:border-0 lg:bg-transparent">
                  {/* Balance */}
                  <div className="order-2 flex h-full shrink-0 items-center border-l border-white/15 px-2.5 py-1 text-[11px] text-white lg:order-1 md:rounded-md md:border-0 md:bg-[#243a48] md:px-2 md:py-0 md:text-xs lg:min-w-[72px] lg:rounded-[5px] lg:px-2 lg:text-[11px]">
                    <div className="flex flex-col justify-center gap-0.5 leading-tight lg:flex-row lg:items-center lg:gap-[3px]">
                      <span className="flex items-center gap-1 lg:gap-[3px]">
                        Bal <b className="font-medium">{formattedTotalBalance}</b>
                      </span>
                      <span className="flex items-center gap-1 lg:gap-[3px]">
                        Exp <span className="lg:hidden">(</span>
                        <b className="font-medium text-[#f10007] lg:text-white">
                          {formattedExposure}
                        </b>
                        <span className="lg:hidden">)</span>
                      </span>
                    </div>
                  </div>

                  {/* Account */}
                  <div className="order-1 flex h-full min-w-0 flex-1 items-center lg:order-2 md:h-full md:flex-none">
                    <MyAccount
                      username={username}
                      mobile={mobile}
                      avatarUrl={user?.profileImage}
                      mobileCompact
                      open={isProfileMenuOpen}
                      onOpenChange={setIsProfileMenuOpen}
                      oneClickBetEnabled={showOneClickBar}
                      onOneClickBetEnabledChange={setShowOneClickBar}
                    />
                  </div>
                </div>
              </>
            ) : (
              <GuestHeaderAuth />
            )}
          </div>
        </div>

        {isAuthenticated && !isMfaPage && (
          <div className="lg:hidden flex w-full justify-around gap-[3px] border-y border-[#a6a6a6a3] p-[3px]">
            <Link
              to="/deposit"
              className="flex h-8 w-1/2 items-center justify-center border border-white bg-gradient-to-b from-[#007b15] to-[#138e00] p-1.5 text-center text-xs font-black uppercase text-white"
            >
              <img
                src="/icons/deposit.png"
                alt=""
                className="w-4 max-w-full h-auto mr-[5px] relative top-[-2.5px]"
              />
              Deposit
            </Link>
            <Link
              to="/withdraw"
              className="flex h-8 w-1/2 items-center justify-center border border-white bg-gradient-to-b from-[#7b0000] to-[#d10000] p-1.5 text-center text-xs font-black uppercase text-white"
            >
              <img
                src="/icons/withdraw.png"
                alt=""
                className="w-4 max-w-full h-auto mr-[5px] relative top-[-2.5px]"
              />
              Withdrawal
            </Link>
          </div>
        )}
        {/* Bottom Section: Navigation */}
        <div className="hidden lg:block">
          <TopNavigation />
        </div>
      </header>
      <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
};

export default Header;
