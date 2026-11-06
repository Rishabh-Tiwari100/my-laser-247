import Sidebar from '@/components/common/Sidebar';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';

export default function MyAccountLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="w-full">
      <div className="">
        <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        <main className="flex-1 overflow-hidden">
          <Outlet />

        </main>
      </div>
    </div>
  );
}
