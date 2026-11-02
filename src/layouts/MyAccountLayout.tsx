import Header from '@/components/common/Header';
import { Outlet, useLocation } from 'react-router-dom';
import BottomNav from '@/components/common/BottomNav';
import { useState } from 'react';
import { useHomePage } from '@/pages/Home/hooks/useHomePage';
import Marquee from '@/components/common/Marquee';
import { FiMic } from 'react-icons/fi';
import Sidebar from '@/components/common/Sidebar';
import OneClickBetBar from '@/components/common/OneClickBetBar';

function MyAccountLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showOneClickBar, setShowOneClickBar] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { isAuthenticated } = useHomePage();
  const { pathname } = useLocation();
  const location = useLocation();
  const isInplay = location.pathname === '/inplay';
  const isInnerMarket = pathname.includes('/market-details/');

  const isCasinoRoute = pathname.startsWith('/casino');

  return (
    <div className="min-h-screen flex font-inter bg-[#eeeeee]">
      <div className="flex-1 w-full  flex flex-col h-screen">
        <Header
          showOneClickBar={showOneClickBar}
          setShowOneClickBar={setShowOneClickBar}
          isProfileMenuOpen={isProfileMenuOpen}
          setIsProfileMenuOpen={setIsProfileMenuOpen}
        />

        <div className={`relative flex-1 flex h-[calc(100vh-106px)] ${!isCasinoRoute ? '' : ''}`}>
          <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
          <div className="h-full flex-1 min-w-0 overflow-hidden pb-24 lg:pb-0">
            <Outlet />
            {showOneClickBar && (
              <OneClickBetBar width="max-w-8xl" onClose={() => setShowOneClickBar(false)} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyAccountLayout;
