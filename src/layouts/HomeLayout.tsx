import BottomNav from '@/components/common/BottomNav';
import Header from '@/components/common/Header';
import OneClickBetBar from '@/components/common/OneClickBetBar';
import BackToTop from '@/components/common/BackToTop';
import WhatsappSupportButton from '@/components/common/WhatsappSupportButton';
import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import LandingContent from '@/pages/Home/components/LandingContent';

function HomeLayout() {
  const { pathname } = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showOneClickBar, setShowOneClickBar] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col font-inter main-bg">
      {/* <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} /> */}

      <div className="flex-1 w-full flex flex-col relative">
        <div className="flex-1 overflow-x-clip pb-24 lg:pb-0">
          <Header
            showOneClickBar={showOneClickBar}
            setShowOneClickBar={setShowOneClickBar}
            isProfileMenuOpen={isProfileMenuOpen}
            setIsProfileMenuOpen={setIsProfileMenuOpen}
          />
          <Outlet />
          {pathname !== '/' && <LandingContent page={pathname} className="mx-4" />}
          {showOneClickBar && (
            <OneClickBetBar
              width="max-w-8xl"
              margin="mx-3"
              onClose={() => setShowOneClickBar(false)}
            />
          )}
        </div>
        {/* <Footer /> */}
        {pathname === '/' && (
          <>
            <BackToTop />
            <WhatsappSupportButton />
          </>
        )}
        <BottomNav
          isProfileMenuOpen={isProfileMenuOpen}
          onProfileClick={() => setIsProfileMenuOpen((open) => !open)}
        />
      </div>
      <div
        className="statement-demo-ribbon fixed right-0 top-[42%] z-[80] flex h-[127px] w-[26px] items-center justify-center rounded-l-[5px] bg-[#243a48] text-[14px] font-normal leading-[26px] text-white [writing-mode:vertical-rl] max-md:hidden"
        aria-label="This is Demo ID"
      >
        This is Demo ID
      </div>
    </div>
  );
}

export default HomeLayout;
