import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import LandingContent from '@/pages/Home/components/LandingContent';

function AuthLayout() {
  const { pathname } = useLocation();

  return (
    <div className="relative h-screen overflow-y-auto bg-auth-gradient z-[2]">
      <div className="min-h-full p-[40px_10px] flex flex-col items-center justify-center bg-custom-overlay">
        <Outlet />
        {pathname !== '/login' && <LandingContent page={pathname} className="w-full max-w-6xl" />}
      </div>
    </div>
  );
}

export default AuthLayout;
