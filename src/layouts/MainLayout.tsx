import Header from '@/components/common/Header';
import { Outlet, useLocation } from 'react-router-dom';
import BottomNav from '@/components/common/BottomNav';
import { useState } from 'react';
import Sidebar from '@/components/common/Sidebar';
import { useAppSelector } from '@/hooks';
import OpenBetsSidebar from '@/components/common/OpenBetsSidebar';

function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [stakeSettingsOpen, setStakeSettingsOpen] = useState(false);
  const [showOneClickBar, setShowOneClickBar] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const isDashboard = pathname === '/dashboard';
  const isEventDetails = pathname.includes('/market-details/');
  const isReferenceAccountPage = ['/account-statement', '/my-bets', '/change-password', '/apply-coupon'].includes(pathname);
  const isInplayPage = pathname === '/inplay';
  const isCasinoPage = pathname === '/casino' || pathname === '/casino/evolution';
  const isDepositPage = pathname === '/deposit';
  const isWithdrawPage = pathname === '/withdraw' || pathname === '/wallet-withdraw';
  const isPaymentPage = isDepositPage || isWithdrawPage;
  const isTwoFaPage =
    pathname === '/2fa' ||
    pathname === '/my-account/2fa' ||
    pathname.startsWith('/2fa/');
  const isReferralPage = pathname === '/referral' || pathname === '/refer-earn';
  const isProfilePage = pathname === '/my-account/profile' || pathname === '/my-profile';
  const isOtherAccountPage = [
    '/change-password', '/user/rules', '/stake-settings', '/bonus-statement',
    '/wallet', '/affiliate', '/apply-coupon',
  ].includes(pathname);
  const roleName = useAppSelector(state => state.user.profile?.role?.name)
  const isReportsPage = [
    '/settled-bets', '/bet-history', '/my-bets', '/casino-bet-history',
    '/profit-loss', '/profit-loss-detail', '/turnover-history', '/account-statement', '/statements',
  ].includes(pathname) || pathname.startsWith('/my-account/');
  const showOpenBetsSidebar = isProfilePage || (pathname !== '/' && !isReportsPage &&
    !isOtherAccountPage && !isPaymentPage && !isTwoFaPage && !isReferralPage);

  return (
    <div className={`flex min-h-screen flex-col ${pathname.startsWith('/sports') || isDashboard || isEventDetails || isReferenceAccountPage || isInplayPage || isCasinoPage ? 'bg-[#eee] text-[#111] [font-family:Arial,Helvetica,sans-serif]' : 'font-inter'}`}>
      <Header
        stakeSettingsOpen={stakeSettingsOpen}
        onToggleStakeSettings={isEventDetails ? () => setStakeSettingsOpen((open) => !open) : undefined}
        showOneClickBar={showOneClickBar}
        setShowOneClickBar={setShowOneClickBar}
        isProfileMenuOpen={isProfileMenuOpen}
        setIsProfileMenuOpen={setIsProfileMenuOpen}
      />
      <div className="flex flex-1 min-h-0 lg:flex-row">
        {!isInplayPage && !isPaymentPage && !isTwoFaPage && !isReferralPage && (
          <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        )}

        <div className={`min-w-0 flex-1 ${isDashboard ? 'grid grid-cols-1 lg:pl-[12px] lg:pr-[2px] min-[1200px]:grid-cols-3' : isInplayPage ? 'grid grid-cols-1 lg:grid-cols-4' : 'flex'} ${showOpenBetsSidebar ? 'lg:pr-0' : ''}`}>
        <main
          className={`min-w-0 flex-1 overflow-x-hidden lg:max-w-full ${isDashboard ? 'px-0 lg:px-[6px] min-[1200px]:col-span-2' : isInplayPage ? 'lg:col-span-3 lg:px-[8px]' : isPaymentPage || isTwoFaPage ? 'lg:px-0' : pathname === '/apply-coupon' ? 'lg:pl-[24px] lg:pr-[14px]' : isReferenceAccountPage ? 'lg:pl-[36px] lg:pr-[26px]' : isCasinoPage ? 'lg:pl-[18px] lg:pr-[28px]' : isEventDetails ? 'lg:pl-[12px] lg:pr-[22px]' : showOpenBetsSidebar ? 'lg:pl-[23px] lg:pr-[34px]' : 'lg:px-4'}`}
        >
          <div className="min-h-0 pb-24 lg:pb-0">
            <Outlet />
          </div>
        </main>
        {showOpenBetsSidebar && <OpenBetsSidebar gridLayout={isInplayPage} stakeSettingsOpen={isEventDetails && stakeSettingsOpen} />}
        </div>
      </div>
      <BottomNav
        isProfileMenuOpen={isProfileMenuOpen}
        onProfileClick={() => setIsProfileMenuOpen((open) => !open)}
      />
    </div>
  );
}

export default MainLayout;
