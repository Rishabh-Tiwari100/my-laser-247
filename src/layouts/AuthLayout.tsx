import { Outlet, useLocation } from 'react-router-dom';

function AuthLayout() {
  const { pathname } = useLocation();

  return (
    <div className="h-dvh overflow-y-auto bg-auth-gradient bg-cover bg-center bg-no-repeat [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div
        className={
          pathname === '/login'
            ? 'relative w-auto'
            : 'flex min-h-full flex-col items-center justify-center bg-custom-overlay p-[40px_10px]'
        }
      >
        <Outlet />

      </div>
    </div>
  );
}

export default AuthLayout;
