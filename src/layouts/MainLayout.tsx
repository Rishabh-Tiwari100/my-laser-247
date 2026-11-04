import Header from '@/components/common/Header';
import { Outlet, useLocation } from 'react-router-dom';
import BottomNav from '@/components/common/BottomNav';
import { useState } from 'react';
import Sidebar from '@/components/common/Sidebar';
import LandingContent from '@/pages/Home/components/LandingContent';
import { useAppSelector } from '@/hooks';
import OpenBetsSidebar from '@/components/common/OpenBetsSidebar';

function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showOneClickBar, setShowOneClickBar] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const isInplayPage = pathname === '/inplay';
  const isDepositPage = pathname === '/deposit';
  const isWithdrawPage = pathname === '/withdraw' || pathname === '/wallet-withdraw';
  const isPaymentPage = isDepositPage || isWithdrawPage;
  const isTwoFaPage =
    pathname === '/2fa' ||
    pathname === '/my-account/2fa' ||
    pathname.startsWith('/2fa/');
  const isReferralPage = pathname === '/referral' || pathname === '/refer-earn';
  const isMyAccountPage =
    pathname.startsWith('/my-account') && pathname !== '/my-account/2fa';
  const isProfilePage = pathname === '/my-account/profile' || pathname === '/my-profile';
  const isOtherAccountPage = [
    '/change-password', '/user/rules', '/stake-settings', '/bonus-statement',
    '/wallet', '/affiliate',
  ].includes(pathname);
  const roleName = useAppSelector(state => state.user.profile?.role?.name)
  const isReportsPage = [
    '/settled-bets', '/bet-history', '/my-bets', '/casino-bet-history',
    '/profit-loss', '/profit-loss-detail', '/turnover-history', '/account-statement', '/statements',
  ].includes(pathname) || pathname.startsWith('/my-account/');
  const showOpenBetsSidebar = isProfilePage || (pathname !== '/' && !isReportsPage &&
    !isOtherAccountPage && !isPaymentPage && !isTwoFaPage && !isReferralPage);

  return (
    <div className="flex min-h-screen flex-col font-inter">
      <Header
        showOneClickBar={showOneClickBar}
        setShowOneClickBar={setShowOneClickBar}
        isProfileMenuOpen={isProfileMenuOpen}
        setIsProfileMenuOpen={setIsProfileMenuOpen}
      />
      <div className="flex flex-1 min-h-0 lg:flex-row">
        {!isInplayPage && !isPaymentPage && !isTwoFaPage && !isReferralPage && (
          <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        )}

        <div className={`min-w-0 flex-1 ${isInplayPage ? 'grid grid-cols-1 xl:grid-cols-12' : 'flex'} ${showOpenBetsSidebar ? 'lg:pr-0' : ''}`}>
        <main
          className={`min-w-0 flex-1 overflow-x-hidden lg:max-w-full ${isInplayPage ? 'xl:col-span-8' : isPaymentPage || isTwoFaPage ? 'lg:px-0' : showOpenBetsSidebar ? 'lg:pl-[23px] lg:pr-[34px]' : 'lg:px-4'}`}
        >
          <div className="min-h-0 pb-24 lg:pb-0">
            <Outlet />
            {!isMyAccountPage && <LandingContent page={pathname} className="mx-2 lg:mx-0" />}
          </div>
        </main>
        {showOpenBetsSidebar && <OpenBetsSidebar gridLayout={isInplayPage} />}
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
