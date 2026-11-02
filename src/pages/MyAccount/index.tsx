import Sidebar from '@/components/common/Sidebar';
import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import LandingContent from '@/pages/Home/components/LandingContent';

export default function MyAccountLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <div className="w-full">
      <div className="">
        <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        <main className="flex-1 overflow-hidden">
          <Outlet />
          <LandingContent page={pathname} className="mx-[14px] lg:mx-[14px]" />
        </main>
      </div>
    </div>
  );
}
