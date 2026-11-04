import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import LandingContent from '@/pages/Home/components/LandingContent';

function AuthLayout() {
  const { pathname } = useLocation();

  return (
    <div className="relative h-screen overflow-y-auto bg-auth-gradient z-[2]">
      <div className={`min-h-full flex flex-col items-center bg-custom-overlay ${pathname === '/login' ? 'px-[22px] pb-8 pt-10 md:justify-center md:px-3 md:py-16' : 'justify-center p-[40px_10px]'}`}>
        <Outlet />
        {pathname !== '/login' && <LandingContent page={pathname} className="w-full max-w-6xl" />}
      </div>
    </div>
  );
}

export default AuthLayout;
