import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Icons } from '@/utils/icons';
import { useIsAuthenticated } from '@/hooks';
import { formatNumber, sanitizeAlphaNumeric } from '@/utils';
import { useDispatch, useSelector } from 'react-redux';
import BalanceDropdown from './BalanceDropdown';
import { RootState } from '@/store';
import { useGetUserProfileQuery, useGetUserWalletsQuery } from '@/store/api/userApi';
import { useGetNotificationsQuery } from '@/store/api/notificationApi';
import { resetTrigger } from '@/store/slices/triggerSlice';
import { useIsSelfRegistered } from '@/hooks/redux';
import { Input } from '../ui/input';

interface HeaderProps {
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const navLinks = [
  { id: 1, name: 'Home', path: '/' },
  { id: 2, name: 'Inplay', path: 'inplay' },
  { id: 3, name: 'Cricket', path: '/sports/cricket' },
  { id: 4, name: 'Football', path: '/sports/football' },
  { id: 5, name: 'Tennis', path: '/sports/tennis' },
  { id: 6, name: 'Sportsbook', path: '/sportsbook' },
  { id: 7, name: 'Casino', path: '/casino' },
];

const Header: React.FC<HeaderProps> = ({ setIsSidebarOpen }) => {
  const [paymentModeOpen, setPaymentModeOpen] = useState(false);

  const isAuthenticated = useIsAuthenticated();
  useGetUserWalletsQuery(undefined, {
    skip: !isAuthenticated,
    pollingInterval: 1000,
  });
  useGetNotificationsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    skip: !isAuthenticated,
  });
  useGetUserProfileQuery(undefined, { skip: !isAuthenticated });

  const user = useSelector((s: RootState) => s.user.profile);
  const balanceInfo = useSelector((s: RootState) => s.wallet);
  const { username } = user ?? {};

  const mainBalance = balanceInfo?.mainBalance ?? 0;
  const bonusBalance = balanceInfo?.bonusBalance ?? 0;
  const exposure = balanceInfo?.exposure ?? 0;
  const lockedAmount = balanceInfo?.lockedAmount ?? 0;
  const withdrawableBalance = balanceInfo?.withdrawableBalance ?? 0;

  // Total balance shown in header (Main + Bonus + Exposure - Locked)
  const totalBalance = Number(
    (mainBalance + bonusBalance - Math.abs(exposure) - Math.abs(lockedAmount)).toFixed(2)
  );

  const formattedTotalBalance = formatNumber(totalBalance);
  const formattedWithdrawableBalance = formatNumber(Number(withdrawableBalance.toFixed(2)));
  const formattedExposure = formatNumber(Number(exposure.toFixed(2)));
  const isSelfRegister = useIsSelfRegistered();

  const headerNavLinks = [
    { name: 'Home', path: '/' },
    { name: 'InPlay', path: '/inplay' },
    { name: 'Multi Markets', path: '/multi-markets' },
    { name: 'Cricket', path: '/sports/cricket' },
    { name: 'Soccer', path: '/sports/football' },
    { name: 'Tennis', path: '/sports/tennis' },
  ];
  const [showPassword, setShowPassword] = useState(false);

  return (
    <header className="max-h-[85px] overflow-hidden w-full font-sans text-xs z-[10]">
      {/* Top Section: Logo, Search, and Auth Section */}
      <div className="h-[56px] bg-gradient-to-b from-[#333] to-[#000] px-4 flex items-center justify-between border-b border-gray-700">
        {/* Left: Logo & Search */}
        <div className="flex items-center gap-4 sm:gap-8">
          {/* Mobile Sidebar Toggle */}
          <button
            onClick={() => setIsSidebarOpen((prev: boolean) => !prev)}
            className="inline-block lg:hidden shrink-0 text-white"
          >
            <Icons.hambuger className="w-6 h-6" />
          </button>

          <Link to="/">
            <img
              src="/images/logo-transparent.png"
              alt="SKYXCH Logo"
              className="h-10 sm:h-12 object-contain"
            />
          </Link>

          <div className="hidden sm:block relative group">
            <Icons.searchSharp className="text-black absolute left-1.5 top-1/2 -translate-y-1/2 w-4 h-4" />
            <input
              type="text"
              placeholder="Search Events"
              className="bg-white rounded text-xs h-[25px] pl-[25px] p-[5px] w-64 focus:outline-none text-black"
            />
          </div>
        </div>

        {/* Right: Auth / Profile Section */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            // LOGGED IN VIEW
            <>
              <div className="hidden md:flex flex-col text-right leading-tight pr-3 border-r border-gray-600">
                <div className="flex items-center justify-end">
                  <span className="text-[#ffb400] font-semibold">{username || ''}</span>
                  <span className="ml-2 text-white inline-flex items-center gap-0.5 font-bold">
                    Bal: {formattedTotalBalance}
                  </span>
                </div>
                <div className="text-[11px] mt-0.5">
                  <span className="text-gray-400">Wdr: </span>
                  <span className="text-white">{formattedWithdrawableBalance}</span>
                  <span className="ml-2 text-gray-400">Exp: </span>
                  <span className="text-white">{formattedExposure}</span>
                </div>
              </div>

              <BalanceDropdown
                formattedTotalBalance={formattedTotalBalance}
                formattedWithdrawableBalance={formattedWithdrawableBalance}
                formattedExposure={formattedExposure}
              />

              <div className="hidden xl:flex gap-2 ml-2">
                <Link
                  to={'/withdraw'}
                  className="bg-transparent border border-gray-500 text-white font-semibold px-3 py-1 rounded hover:bg-gray-800 transition"
                >
                  Withdraw
                </Link>
                <Link
                  to={'/deposit'}
                  className="bg-[#ffb400] text-black font-semibold px-3 py-1 rounded hover:bg-yellow-500 transition"
                >
                  Deposit
                </Link>
              </div>
            </>
          ) : (
            // LOGGED OUT VIEW (Inline Login Form)
            <div className="hidden lg:flex items-center gap-2">
              <div className="relative flex items-center">
                <Icons.user className="fill-yellow w-4 h-4 mr-2" />
                <Input type="text" placeholder="Username" className="w-32" />
              </div>

              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  className="w-32"
                  onInput={(event) => {
                    event.currentTarget.value = sanitizeAlphaNumeric(event.currentTarget.value);
                  }}
                />
                <Icons.openEye
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 cursor-pointer hover:text-black"
                  onClick={() => setShowPassword(!showPassword)}
                />
              </div>

              <div className="flex bg-white rounded overflow-hidden">
                <Input type="text" placeholder="Validation" className="w-24" />
                <span className="bg-gray-100 px-2 py-1 font-bold italic border-l border-gray-300">
                  6143
                </span>
              </div>

              <button className="h-[25px] bg-gradient-red text-white px-4 py-1 rounded font-semibold flex items-center gap-1">
                Login
                <Icons.logout />
              </button>

              <Link
                to="/register"
                className="h-[25px] bg-gradient-to-b from-gray-600 to-gray-900 border border-gray-600 text-white px-4 py-1 rounded font-semibold"
              >
                Sign-Up
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section: Navigation */}
      <nav className="bg-[#1e1e1e] hidden sm:flex items-center justify-between h-[32px] px-4 overflow-x-auto whitespace-nowrap scrollbar-hide">
        <div className="flex h-full items-center font-bold text-white">
          {headerNavLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `px-4 flex items-center h-full cursor-pointer border-r border-black/10 hover:bg-black/5 relative transition-colors ${isActive ? 'bg-gradient-nav shadow-inner-red' : ''}`
              }
            >
              {link.name}

              {/* Badge for specific sports */}
              {['Cricket', 'Soccer', 'Tennis'].includes(link.name) && (
                <span className="absolute -top-1 -right-1 bg-white text-white text-[10px] px-1 rounded-sm border border-white flex items-center">
                  <div className="bg-white">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse mr-0.5" />
                  </div>
                  <div> {link.name === 'Cricket' ? '5' : link.name === 'Soccer' ? '7' : '14'}</div>
                </span>
              )}
            </NavLink>
          ))}
        </div>

        {/* Right Nav Utilities */}
        <div className="flex items-center gap-4 text-[13px] font-semibold text-black ml-4">
          <div>
            Time Zone : <span className="font-bold">GMT+6.00</span>
          </div>

          <label className="flex items-center gap-1 cursor-pointer bg-black/80 text-white px-2 py-1 rounded">
            <input type="checkbox" className="accent-[#ffb400]" />
            One Click Bet
          </label>

          <div className="flex items-center gap-1 cursor-pointer hover:underline">
            Setting <Icons.stakeSettings size={14} />
          </div>
        </div>
      </nav>
    </header>
    // <header className="fixed top-0 right-0 z-[99] w-full lg3:w-[calc(100%-220px)] bg-black text-white flex flex-col pl-0.5 pr-2 sm:px-2 xl:px-4 py-1 lg3:py-2 border-b border-green-500">
    //   {/* Left Nav */}
    //   <div className="flex justify-between items-center">
    //     <div className="flex items-center justify-center gap-x-4">
    //       <Link to="/" className="lg3:hidden">
    //         <img src={'/images/logo-transparent.png'} alt="" className="h-auto max-w-[125px]" />
    //       </Link>

    //       <nav className="hidden lg3:flex items-center gap-1 text-sm">
    //         {navLinks.map((link, idx) => (
    //           <NavLink
    //             key={idx}
    //             to={link.path}
    //             className={({ isActive }) =>
    //               `relative px-3 py-0.5 font-medium ${
    //                 isActive
    //                   ? 'bg-gradient-secondary text-black rounded-full border border-white shadow-md shadow-primary'
    //                   : 'hover:text-green-400'
    //               } ${link.name === 'Sportsbook' ? 'pointer-events-none' : ''}`
    //             }
    //           >
    //             {link.name}
    //           </NavLink>
    //         ))}
    //       </nav>
    //     </div>

    //     {/* Right Section */}
    //     <div className="flex items-center gap-1 sm:gap-2 text-[13px]">
    //       {isAuthenticated ? (
    //         <>
    //           {/* User Info */}
    //           <div className="hidden sm:flex flex-col text-right leading-tight ">
    //             <div className='flex items-center justify-end'>
    //               <span className="text-primary-light font-semibold">{username || ''}</span>
    //               <span className="ml-2 text-gray-400 inline-flex items-center gap-0.5">
    //                 <img src="/images/taka-green.webp" className="w-5" alt="" />{' '}
    //                 <span className="text-primary-light">{formattedTotalBalance}</span>
    //               </span>
    //             </div>
    //             <div>
    //               <span className="text-gray-400">Wdr. Bal: </span>
    //               <span className="text-primary-light">{formattedWithdrawableBalance}</span>
    //               <span className="ml-2 text-gray-400">Exp: </span>
    //               <span className="text-primary-light">{formattedExposure}</span>
    //             </div>
    //           </div>
    //           <BalanceDropdown
    //             formattedTotalBalance={formattedTotalBalance}
    //             formattedWithdrawableBalance={formattedWithdrawableBalance}
    //             formattedExposure={formattedExposure}
    //           />

    //           <button
    //             onClick={() => setPaymentModeOpen(!paymentModeOpen)}
    //             disabled={!isSelfRegister}
    //             className="hidden max-lg3:inline-block border-2 border-white rounded-md"
    //           >
    //             <Icons.plus className="w-5 h-5" />
    //           </button>

    //           {/* Buttons */}
    //           <div className="hidden xl:flex gap-2">
    //             <Link
    //               to={'/withdraw'}
    //               className="w-24 text-center bg-gradient-secondary text-black font-semibold px-3 py-1.5 rounded border-b-2 border-r-2 border-white"
    //             >
    //               Withdraw
    //             </Link>
    //             <Link
    //               to={'/deposit'}
    //               className="w-24 text-center bg-white text-black font-semibold px-3 py-1.5 rounded border-b-2 border-r-2 border-primary"
    //             >
    //               Deposit
    //             </Link>
    //           </div>
    //         </>
    //       ) : (
    //         <div className="flex gap-2">
    //           <Link
    //             to="/login"
    //             className="text-center w-[75px] sm:w-24 bg-gradient-secondary text-black font-semibold px-3 py-1.5 rounded border-b-2 border-r-2 border-white"
    //           >
    //             Login
    //           </Link>
    //           <Link
    //             to="/register"
    //             className="text-center w-20 sm:w-24 bg-white text-black font-semibold px-3 py-1.5 rounded border-b-2 border-r-2 border-primary"
    //           >
    //             Register
    //           </Link>
    //         </div>
    //       )}
    //       <button
    //         onClick={() => setIsSidebarOpen((prev: boolean) => !prev)}
    //         className="inline-block lg3:hidden shrink-0 rounded-md px-1 bg-gradient-primary"
    //       >
    //         <Icons.hambuger className="w-5 h-7 sm:w-6 sm:h-8" />
    //       </button>
    //     </div>
    //   </div>

    //   {paymentModeOpen && (
    //     <div className="lg3:hidden grid grid-cols-2 rounded overflow-hidden font-medium mt-2 mb-1 text-white">
    //       <NavLink to={'/withdraw'} className={'py-1.5 text-center bg-gradient-green'}>
    //         Withdraw
    //       </NavLink>
    //       <NavLink to={'/deposit'} className={'py-1.5 text-center bg-white text-black'}>
    //         Deposit
    //       </NavLink>
    //     </div>
    //   )}
    // </header>
  );
};

export default Header;
