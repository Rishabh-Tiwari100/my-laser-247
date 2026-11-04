import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { FaUserCircle } from 'react-icons/fa';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { RiLogoutBoxRLine } from 'react-icons/ri';
import { useLogoutMutation } from '@/store/api/authApi';
import { logout as clearAuth } from '@/store';
import { useNavigate } from 'react-router-dom';
import * as Dropdown from '@radix-ui/react-dropdown-menu';

const items = [
  { title: 'My Profile', path: '/my-account/profile' },
  { title: 'Account Statement', path: '/account-statement' },
  { title: 'Unsettled Bets', path: '/my-account/my-bets' },
  { title: 'Stake Setting', path: '/stake-settings', mobileOnly: true },
  { title: 'Market Analysis', path: undefined },
  { title: 'Change Password', path: '/change-password' },
  { title: 'Rules', path: '/user/rules' },
];

interface Props {
  username?: string;
  mobile?: string;
  avatarUrl?: string | null;
  mobileCompact?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  oneClickBetEnabled?: boolean;
  onOneClickBetEnabledChange?: (enabled: boolean) => void;
}

export default function MyAccount({
  username,
  mobile,
  avatarUrl,
  open: controlledOpen,
  onOpenChange,
}: Props) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 1023px)').matches);
  const open = controlledOpen ?? internalOpen;
  const setOpen = (value: boolean) => {
    setInternalOpen(value);
    onOpenChange?.(value);
  };
  const location = useLocation();
  const previousLocation = useRef(location);
  const heading = useRef<HTMLHeadingElement>(null);
  const [logout, { isLoading }] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const name = username || mobile || '';

  useEffect(() => {
    if (previousLocation.current !== location) {
      setInternalOpen(false);
      onOpenChange?.(false);
      previousLocation.current = location;
    }
  }, [location, onOpenChange]);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 1023px)');
    const change = () => {
      setIsMobile(media.matches);
      setInternalOpen(false);
      onOpenChange?.(false);
    };
    media.addEventListener('change', change);
    return () => media.removeEventListener('change', change);
  }, [onOpenChange]);

  useEffect(() => {
    if (!open || !isMobile) return;
    heading.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open, isMobile]);

  const handleLogout = async () => {
    const id = toast.loading('Logging out...');
    try {
      await logout().unwrap();
      dispatch(clearAuth());
      setOpen(false);
      navigate('/');
      toast.success('You have been logged out successfully.', { id });
    } catch (error: unknown) {
      const message = (error as { data?: { message?: string } })?.data?.message;
      toast.error(message || 'Logout failed. Please try again.', { id });
    }
  };

  const avatar = (
    <img
      src={avatarUrl || '/icons/default-user-icon.svg'}
      onError={(event) => {
        event.currentTarget.onerror = null;
        event.currentTarget.src = '/icons/default-user-icon.svg';
      }}
      alt=""
      className="h-[18px] w-[18px] shrink-0 rounded-full object-cover lg:h-[15px] lg:w-[15px]"
    />
  );
  const bonus = (
    <Link
      to="/bonus-statement"
      onClick={() => setOpen(false)}
      className="mx-auto flex min-h-[25px] w-[70%] items-center justify-center rounded-full bg-[#243a48] px-4 py-1.5 text-center text-xs text-white hover:bg-[#32617f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 lg:h-[46px] lg:min-h-[46px] lg:w-[120px] lg:flex-col lg:gap-0 lg:px-3 lg:py-0 lg:text-[11px] lg:leading-[17px]"
    >
      <span>BONUS</span> <span>COUPON</span>
    </Link>
  );
  const logoutButton = (
    <button
      type="button"
      disabled={isLoading}
      onClick={handleLogout}
      className="flex h-[48px] w-full items-center justify-center gap-1 bg-[#243a48] text-sm font-bold text-white hover:brightness-110 disabled:opacity-60 max-lg:mt-[14px] max-lg:bg-[linear-gradient(#ed301d,#bf1c0c)] lg:h-10 lg:text-[14px] lg:font-extrabold"
    >
      {isLoading ? 'LOGGING OUT' : 'LOGOUT'}
      {isMobile && <RiLogoutBoxRLine aria-hidden="true" />}
    </button>
  );

  return (
    <div className="relative h-full">
      <div className="flex h-full items-center gap-2 lg:gap-[18px]">
        <span className="flex min-w-0 max-w-[28vw] items-center gap-1 rounded bg-[#243a48] px-2 py-2 text-xs font-bold text-white lg:h-[27px] lg:min-w-[94px] lg:max-w-[200px] lg:rounded-[5px] lg:px-[9px] lg:py-0 lg:text-[11px]">
          {avatar}
          <span className="truncate">{name}</span>
        </span>
        {!isMobile && (
          <Dropdown.Root open={open} onOpenChange={setOpen} modal={false}>
            <Dropdown.Trigger
              data-account-desktop-trigger
              className="flex h-[34px] items-center gap-1 rounded-md bg-[#243a48] px-2 text-xs text-white hover:bg-[#32617f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white lg:h-[27px] lg:min-w-[94px] lg:gap-[3px] lg:px-[7px] lg:text-[11px]"
            >
              {avatar} My Account
            </Dropdown.Trigger>
            <Dropdown.Portal>
              <Dropdown.Content
                align="end"
                alignOffset={-22.4}
                sideOffset={21.5}
                collisionPadding={8}
                className="z-[1100] max-h-[var(--radix-dropdown-menu-content-available-height)] w-[171px] max-w-[calc(100vw-16px)] overflow-y-auto border border-[#cfd7dc] bg-white font-helvetica text-[11px] leading-[14px] text-[#333] shadow-md"
              >
                <Dropdown.Label className="flex h-[34px] items-center bg-gradient-to-r from-[#08044b] to-[#04bce8] px-[10px] text-[11px] capitalize text-white">
                  {name}
                </Dropdown.Label>
                <div className="flex h-[60px] items-center border-b border-[#c4ccd0] pt-[6px]">
                  <Dropdown.Item asChild>{bonus}</Dropdown.Item>
                </div>
                {items
                  .filter((item) => !item.mobileOnly)
                  .map((item) =>
                    item.path ? (
                      <Dropdown.Item key={item.title} asChild>
                        <Link
                          to={item.path}
                          className="flex h-[26px] items-center border-b border-[#c4ccd0] px-[10px] outline-none hover:bg-[#edf3f6] focus:bg-[#edf3f6]"
                        >
                          {item.title === 'My Profile' ? 'Profile' : item.title}
                        </Link>
                      </Dropdown.Item>
                    ) : (
                      <Dropdown.Item
                        key={item.title}
                        disabled
                        title="Market Analysis is not available in this application"
                        className="flex h-[26px] items-center border-b border-[#c4ccd0] px-[10px] text-[#333]"
                      >
                        {item.title}
                      </Dropdown.Item>
                    )
                  )}
                <Dropdown.Item asChild>{logoutButton}</Dropdown.Item>
              </Dropdown.Content>
            </Dropdown.Portal>
          </Dropdown.Root>
        )}
      </div>
      {isMobile && open && (
        <section
          id="account-menu"
          aria-label="Account"
          className="fixed inset-x-0 bottom-[50px] top-[70px] z-[1050] overflow-y-auto overscroll-contain bg-[#eee] text-black"
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              setOpen(false);
              document.querySelector<HTMLButtonElement>('[data-account-menu-trigger]')?.focus();
            }
          }}
        >
          <div className="flex h-[38px] items-center justify-between bg-[#222] px-2 text-xs text-white">
            <h2
              ref={heading}
              tabIndex={-1}
              className="flex min-w-0 items-center gap-1 outline-none"
            >
              <FaUserCircle className="h-[18px] w-[18px] shrink-0" />
              <span className="truncate">{name}</span>
            </h2>
            <span className="shrink-0 border-l border-white/10 pl-2">GMT+5:30</span>
          </div>
          <div className="border-b border-[#c4ccd0] py-2">{bonus}</div>
          <nav aria-label="Account pages">
            {items.map((item) => {
              const style =
                'flex min-h-[38px] w-full items-center justify-between gap-2 border-b border-[#e5e5e5] bg-white px-[10px] py-2 text-left text-[15px] font-bold text-[#278fce] hover:bg-[#f5f7f8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500';
              const content = (
                <>
                  <span>{item.title}</span>
                  <MdKeyboardArrowRight
                    aria-hidden="true"
                    className="h-[22px] w-[22px] shrink-0 rounded border border-[#eee] text-[#333]"
                  />
                </>
              );
              return item.path ? (
                <Link
                  key={item.title}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className={style}
                >
                  {content}
                </Link>
              ) : (
                <button
                  key={item.title}
                  disabled
                  title="Market Analysis is not available in this application"
                  className={`${style} disabled:text-gray-400`}
                >
                  {content}
                </button>
              );
            })}
          </nav>
          {logoutButton}
        </section>
      )}
    </div>
  );
}
