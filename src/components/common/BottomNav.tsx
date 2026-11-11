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
  { to: '/dashboard', icon: '/icons/reference-navigation/trophy.svg', label: 'Sports' },
  { to: '/inplay', icon: '/icons/reference-navigation/timer.svg', label: 'In-Play' },
  { to: '/', icon: '/icons/reference-navigation/home.svg', label: 'Home', isCenter: true },
  {
    to: '/multi-market',
    icon: '/icons/reference-navigation/pin-white-footer.svg',
    label: 'Multi Market',
  },
  {
    to: '/my-profile',
    icon: '/icons/reference-navigation/user.svg',
    label: 'Account',
    isProfile: true,
  },
];

interface BottomNavProps {
  isProfileMenuOpen: boolean;
  onProfileClick: () => void;
}

const BottomNav = ({ isProfileMenuOpen, onProfileClick }: BottomNavProps) => {
  const isAuthenticated = useIsAuthenticated();
  const { pathname } = useLocation();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-[5000000000000001] h-[46px] w-full bg-footer-gradient font-helvetica lg:hidden"
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
                className={`relative flex h-full w-full flex-col items-center justify-start gap-0 pt-[7px] text-[12px] font-normal leading-[13.2px] text-white ${
                  isProfileMenuOpen
                    ? 'active bg-[linear-gradient(-180deg,_#32617f_20%,_#1f4258_91%)]'
                    : ''
                }`}
              >
                <img src={icon} alt="" className="mb-px size-[24px] shrink-0" aria-hidden="true" />
                <span className="truncate">{label}</span>
              </button>
            ) : (
              <NavLink
                to={isProfile ? '/login' : to}
                aria-label={label}
                className={({ isActive }) =>
                  `relative flex h-full flex-col items-center justify-start gap-0 pt-[7px] text-[12px] font-normal leading-[13.2px] text-white ${
                    isCenter
                      ? `isolate z-0 before:pointer-events-none before:absolute before:left-0 before:top-[-4.26667vw] before:-z-10 before:h-[4.53333vw] before:w-full before:[mask-image:url('/icons/reference-navigation/home-arch.svg')] before:[mask-size:100%_100%] before:[mask-repeat:no-repeat] before:content-[''] ${
                          isActive && !isProfileMenuOpen
                            ? 'before:bg-[#32617f]'
                            : 'before:bg-[#243a48]'
                        }`
                      : ''
                  } ${
                    (isActive || (label === 'Sports' && pathname.startsWith('/sports'))) &&
                    !isProfileMenuOpen
                      ? 'active bg-[linear-gradient(-180deg,_#32617f_20%,_#1f4258_91%)]'
                      : ''
                  }`
                }
              >
                <img src={icon} alt="" className="mb-px size-[24px] shrink-0" aria-hidden="true" />
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
