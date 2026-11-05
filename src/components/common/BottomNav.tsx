import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useIsAuthenticated } from '@/hooks';

interface NavItem {
  to: string;
  icon: string;
  label: string;
  isCenter?: boolean;
  isProfile?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { to: '/sports', icon: '/icons/trophy.webp', label: 'Sports' },
  { to: '/inplay', icon: '/icons/timer.webp', label: 'In-Play' },
  { to: '/', icon: '/icons/home.webp', label: 'Home', isCenter: true },
  { to: '/multi-market', icon: '/icons/multi-market.svg', label: 'Multi Market' },
  { to: '/my-profile', icon: '/icons/user.webp', label: 'Account', isProfile: true },
];

interface BottomNavProps {
  isProfileMenuOpen: boolean;
  onProfileClick: () => void;
}

const BottomNav = ({ isProfileMenuOpen, onProfileClick }: BottomNavProps) => {
  const isAuthenticated = useIsAuthenticated();
  const isDashboard = useLocation().pathname === '/dashboard';

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-[5000000000000001] h-[50px] w-full lg:hidden ${isDashboard ? 'bg-gradient-to-b from-[#263e4c] to-[#172b38]' : 'bg-footer-gradient'}`}
      role="navigation"
      aria-label="Bottom navigation"
    >
      <ul className="grid h-full grid-cols-5">
        {NAV_ITEMS.map(({ to, icon, label, isCenter, isProfile }) => (
          <li key={to} className="list-none">
            {isProfile && isAuthenticated ? (
              <button
                type="button"
                aria-label="Open profile menu"
                aria-expanded={isProfileMenuOpen}
                aria-controls="account-menu"
                onClick={onProfileClick}
                data-account-menu-trigger
                className={`relative flex h-full w-full flex-col items-center justify-center gap-0 py-[3px] text-[10px] font-normal leading-[12px] text-white ${
                  isProfileMenuOpen
                    ? 'active bg-[linear-gradient(-180deg,_#32617f_20%,_#1f4258_91%)]'
                    : ''
                }`}
              >
                <img src={icon} alt="" className="size-[27px]" aria-hidden="true" />
                <span className="truncate">{label}</span>
              </button>
            ) : (
              <NavLink
                to={isProfile ? '/login' : to}
                aria-label={label}
                className={({ isActive }) =>
                  `relative flex h-full flex-col items-center justify-center gap-0 py-[3px] text-[10px] font-normal leading-[12px] text-white ${
                    isCenter ? 'main-nav' : ''
                  } ${
                    isActive ? 'active bg-[linear-gradient(-180deg,_#32617f_20%,_#1f4258_91%)]' : ''
                  }`
                }
              >
                <img src={icon} alt="" className="size-[27px]" aria-hidden="true" />
                <span className="truncate">{label}</span>
              </NavLink>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default BottomNav;
