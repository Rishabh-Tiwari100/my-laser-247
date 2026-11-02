import Header from '@/components/common/Header';
import { Outlet, useLocation } from 'react-router-dom';
import BottomNav from '@/components/common/BottomNav';
import { useState } from 'react';
import Sidebar from '@/components/common/Sidebar';
import LandingContent from '@/pages/Home/components/LandingContent';
import { useAppSelector } from '@/hooks';

function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showOneClickBar, setShowOneClickBar] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { pathname } = useLocation();
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
  const roleName = useAppSelector(state => state.user.profile?.role?.name)

  return (
    <div className="flex min-h-screen flex-col font-inter main-bg">
      <Header
        showOneClickBar={showOneClickBar}
        setShowOneClickBar={setShowOneClickBar}
        isProfileMenuOpen={isProfileMenuOpen}
        setIsProfileMenuOpen={setIsProfileMenuOpen}
      />
      <div className="flex flex-1 min-h-0 lg:flex-row">
        {!isPaymentPage && !isTwoFaPage && !isReferralPage && (
          <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        )}

        <div
          className={`flex-1 min-w-0 overflow-x-hidden lg:max-w-full ${isPaymentPage || isTwoFaPage ? 'lg:px-0' : 'lg:px-4'
            }`}
        >
          <div className="min-h-0 pb-24 lg:pb-0">
            <Outlet />
            {!isMyAccountPage && <LandingContent page={pathname} className="mx-2 lg:mx-0" />}
          </div>
        </div>
      </div>
      <BottomNav
        isProfileMenuOpen={isProfileMenuOpen}
        onProfileClick={() => setIsProfileMenuOpen((open) => !open)}
      />
      {roleName?.toLowerCase() === "demo" && (
        <div
          className="statement-demo-ribbon fixed right-0 top-[42%] z-[80] flex h-[127px] w-[26px] items-center justify-center rounded-l-[5px] bg-[#243a48] text-[14px] font-normal leading-[26px] text-white [writing-mode:vertical-rl]"
          aria-label="This is Demo ID"
        >
          This is Demo ID
        </div>
      )}
    </div>
  );
}

export default MainLayout;
