import BottomNav from '@/components/common/BottomNav';
import Header from '@/components/common/Header';
import OneClickBetBar from '@/components/common/OneClickBetBar';
import BackToTop from '@/components/common/BackToTop';
import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

function HomeLayout() {
  const { pathname } = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showOneClickBar, setShowOneClickBar] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col font-inter lg:bg-[#eee]">
      {/* <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} /> */}

      <div className="flex-1 w-full flex flex-col relative">
        <div className="flex-1 overflow-x-clip pb-[46px] lg:pb-0">
          <Header
            showOneClickBar={showOneClickBar}
            setShowOneClickBar={setShowOneClickBar}
            isProfileMenuOpen={isProfileMenuOpen}
            setIsProfileMenuOpen={setIsProfileMenuOpen}
          />
          <Outlet />
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
          </>
        )}
        <BottomNav
          isProfileMenuOpen={isProfileMenuOpen}
          onProfileClick={() => setIsProfileMenuOpen((open) => !open)}
        />
      </div>
    </div>
  );
}

export default HomeLayout;
