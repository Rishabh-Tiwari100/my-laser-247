import { Outlet } from 'react-router-dom';

export default function MyAccountLayout() {
  return (
    <div className="w-full min-w-0">
      <Outlet />
    </div>
  );
}
