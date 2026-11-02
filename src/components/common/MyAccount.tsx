import { useLogoutMutation } from '@/store/api/authApi';
import { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { FaUser, FaUserCircle } from 'react-icons/fa';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { RiLogoutBoxRLine } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, logout as clearAuth } from '@/store';
import { useNavigate } from 'react-router-dom';
import { useGetBonusEarningsQuery } from '@/store/api/bonusApi';
import { formatNumber } from '@/utils';
import StakeModal from '@/components/common/StakeModal';
import OneClickBetModal from '@/components/common/OneClickBetModal';
import { useUpdateUserInfoMutation } from '@/store/api/userApi';
import { setOneClickBetEnabled } from '@/store/slices/betSlice';

interface AccountPanelItem {
  title: string;
  path?: string;
  onClick?: () => void;
}

const accountPanelItems: AccountPanelItem[] = [
  { title: 'My Profile', path: '/my-account/profile' },
  // { title: 'Affiliate', path: '/affiliate' },
  { title: 'Unsettled Bets', path: '/my-account/my-bets' },
  { title: 'Settled Bets', path: '/settled-bets' },
  { title: 'Account Statement', path: '/account-statement' },
  { title: 'Bonus', path: '/bonus-statement' },
  { title: 'Profit/Loss', path: '/profit-loss' },
  { title: 'Casino Bet History', path: '/casino-bet-history' },
  // { title: 'Completed Events', path: '/result' },
  // { title: 'Market Analysis', path: '/market-analysis' },
  {
    title: 'Stake Setting',
    onClick: () => undefined,
  },
  { title: '2FA', path: '/my-account/2fa' },
  { title: 'Change Password', path: '/change-password' },
  { title: 'Update Mobile Number', path: '/my-account/update-mobile-number' },
  { title: 'Rules', path: '/user/rules' },
  // { title: 'Language' },
];

const MyAccount = ({
  username,
  mobile,
  mobileCompact = false,
  open: controlledOpen,
  onOpenChange,
  oneClickBetEnabled = false,
  onOneClickBetEnabledChange,
}: {
  username: string | undefined;
  mobile: string | undefined;
  mobileCompact?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  oneClickBetEnabled?: boolean;
  onOneClickBetEnabledChange?: (enabled: boolean) => void;
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isStakeModalOpen, setIsStakeModalOpen] = useState(false);
  const [isOneClickBetModalOpen, setIsOneClickBetModalOpen] = useState(false);
  const [isDisplayNameModalOpen, setIsDisplayNameModalOpen] = useState(false);
  const [displayNameInput, setDisplayNameInput] = useState('');
  const [menuAnimationState, setMenuAnimationState] = useState<
    'closed' | 'opening' | 'open' | 'closing'
  >((controlledOpen ?? false) ? 'opening' : 'closed');
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const open = controlledOpen ?? internalOpen;
  const setOpen = useCallback(
    (nextOpen: boolean) => {
      setInternalOpen(nextOpen);
      onOpenChange?.(nextOpen);
    },
    [onOpenChange]
  );

  const [logout, { isLoading: logoutLoading }] = useLogoutMutation();
  const [updateUserInfo, { isLoading: isDisplayNameSaving }] = useUpdateUserInfoMutation();
  const { data: bonusEarnings } = useGetBonusEarningsQuery(undefined, { skip: !open });
  const user = useSelector((state: RootState) => state.user.profile);
  const wallet = useSelector((state: RootState) => state.wallet);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const displayName = user?.firstname || user?.username || username || 'User';
  const earnedBonus = Number(bonusEarnings?.lifetime ?? wallet?.bonusBalance ?? 0);
  const isOneClickBetActive = oneClickBetEnabled || isOneClickBetModalOpen;
  const isDemoUser = user?.role?.name?.toLowerCase() === 'demo';
  const demoHiddenAccountPaths = new Set([
    '/my-account/2fa',
    '/change-password',
    '/my-account/update-mobile-number',
  ]);
  const visibleAccountPanelItems = accountPanelItems.filter(
    (item) => !(isDemoUser && item.path && demoHiddenAccountPaths.has(item.path))
  );

  useEffect(() => {
    if (!open) return undefined;

    const handleClickOutside = (event: PointerEvent) => {
      const target = event.target as HTMLElement;

      if (target.closest('[data-account-menu-trigger]')) return;
      if (target.closest('[data-one-click-bet-modal]')) return;
      if (target.closest('[data-display-name-modal]')) return;

      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (document.querySelector('[data-one-click-bet-modal]')) return;
      if (event.key === 'Escape' && document.querySelector('[data-display-name-modal]')) {
        setIsDisplayNameModalOpen(false);
        return;
      }
      if (event.key === 'Escape') setOpen(false);
    };

    const isMobile = window.matchMedia('(max-width: 1023px)').matches;
    const previousBodyOverflow = document.body.style.overflow;

    if (isMobile) document.body.style.overflow = 'hidden';

    document.addEventListener('pointerdown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('pointerdown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);

      if (isMobile) document.body.style.overflow = previousBodyOverflow;
    };
  }, [open, setOpen]);

  useEffect(() => {
    if (open) {
      setMenuAnimationState('opening');
      const openTimer = window.setTimeout(() => setMenuAnimationState('open'), 20);
      return () => window.clearTimeout(openTimer);
    }

    if (menuAnimationState === 'closed') return undefined;

    setMenuAnimationState('closing');
    const closeTimer = window.setTimeout(() => setMenuAnimationState('closed'), 220);
    return () => window.clearTimeout(closeTimer);
  }, [open]);

  const handleNavigate = (itemOrPath: AccountPanelItem | string | undefined) => {
    if (typeof itemOrPath === 'string') {
      navigate(itemOrPath);
    } else if (itemOrPath?.onClick) {
      itemOrPath.onClick();
    } else if (itemOrPath?.path) {
      navigate(itemOrPath.path);
    }

    setOpen(false);
  };

  const handleLogout = async () => {
    const toastId = toast.loading('Logging out...');
    try {
      await logout().unwrap();
      dispatch(clearAuth());
      toast.success('You have been logged out successfully.', { id: toastId });
      navigate('/');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Logout failed. Please try again.', { id: toastId });
    }
  };

  const openDisplayNameModal = () => {
    setDisplayNameInput(displayName);
    setIsDisplayNameModalOpen(true);
  };

  const handleDisplayNameSave = async () => {
    const nextDisplayName = displayNameInput.trim();

    if (!nextDisplayName) {
      toast.error('Please enter a display name.');
      return;
    }

    if (!user) {
      toast.error('Unable to update your display name.');
      return;
    }

    const toastId = toast.loading('Updating display name...');

    try {
      await updateUserInfo({
        id: user.id,
        firstname: nextDisplayName,
        lastname: user.lastname,
        username: user.username,
        dialCode: user.dialCode,
        mobile: user.mobile,
        country: user.country,
        email: user.email,
      }).unwrap();
      toast.success('Display name updated successfully.', { id: toastId });
      setIsDisplayNameModalOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update display name.', { id: toastId });
    }
  };

  const handleCopyUsername = async () => {
    if (!username) {
      toast.error('Username not available.');
      return;
    }

    try {
      await navigator.clipboard.writeText(username);
      toast.success('Username copied!');
    } catch {
      toast.error('Failed to copy username.');
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="account-menu"
        data-account-menu-trigger
        className={`flex items-center gap-[3px] rounded bg-primary-theme px-[5px] py-1 text-[10px] md:text-xs leading-none text-white ${mobileCompact ? 'max-md:h-full max-md:w-[78px] max-md:rounded-none max-md:bg-transparent max-md:text-[10px]' : ''}`}
      >
        <FaUser />
        <span className={mobileCompact ? 'max-md:hidden' : ''}>My Account</span>
        {mobileCompact && (
          <span className="hidden truncate max-md:block">{username || mobile}</span>
        )}
      </button>

      {menuAnimationState !== 'closed' && (
        <div
          id="account-menu"
          role="dialog"
          aria-modal="true"
          aria-label="My Account"
          className={`scrollbar-hidden fixed right-0 top-[70px] z-[5000000000000000] h-[calc(100%-70px)] w-[300px] overflow-y-auto overscroll-contain border-x border-[#cfd7dc] bg-white text-[12px] text-black shadow-none max-lg:inset-x-0 max-lg:bottom-[50px] max-lg:top-[94px] max-lg:h-auto max-lg:w-full max-lg:border-0 account-menu ${menuAnimationState === 'open' ? 'account-menu--open' : menuAnimationState === 'closing' ? 'account-menu--closing' : 'account-menu--opening'}`}
        >
          <div className="flex h-[40px] items-center justify-between bg-[#222] pl-[8px] pr-[9px] text-white max-lg:h-[38px] lg:bg-gradient-to-r lg:from-[#061466] lg:via-[#084c9f] lg:to-[#10bce6]">
            <div className="flex gap-[10px] min-w-0 items-center font-bold">
              <div className="flex min-w-0 items-center gap-[5px]">
                <FaUserCircle className="h-[18px] w-[18px] shrink-0" />
                <span className="truncate">{username || mobile}</span>
              </div>
              <button
                type="button"
                aria-label="Copy account"
                onClick={handleCopyUsername}
                className="relative h-[18px] w-[18px] text-white"
              >
                <img src="/icons/copy.png" className="size-4" />
              </button>
            </div>

            <div className="flex shrink-0 items-center gap-[11px] border-l border-[#333] pl-[11px]">
              <span className="font-medium">GMT+5:30</span>
            </div>
          </div>

          <div className="flex h-[28px] items-center justify-between bg-[#f2f2f2] px-[10px] font-semibold max-lg:h-[35px] max-lg:text-[14px] max-lg:text-[#2789ce]">
            <span>One Click Bet</span>
            <button
              type="button"
              aria-label="Toggle one click bet"
              role="switch"
              aria-checked={isOneClickBetActive}
              onClick={() => {
                if (oneClickBetEnabled) {
                  dispatch(setOneClickBetEnabled(false));
                  onOneClickBetEnabledChange?.(false);
                  return;
                }

                setIsOneClickBetModalOpen(true);
              }}
              className={`relative h-[17px] w-[30px] rounded-full shadow-inner transition-colors ${isOneClickBetActive ? 'bg-[#087b17]' : 'bg-[#6d6d6d]'}`}
            >
              <span
                className={`absolute top-[2px] h-[13px] w-[13px] rounded-full bg-white shadow transition-[left,background-color] ${isOneClickBetActive ? 'left-[15px]' : 'left-[2px]'}`}
              />
            </button>
            <div></div>
          </div>

          <div className="flex h-[34px] items-center justify-between border-b border-[#d9dfe3] bg-white px-[10px] max-lg:h-[32px]">
            <span className="font-bold">Display name :</span>
            <div className="flex min-w-0 items-center gap-[9px]">
              <span className="max-w-[130px] truncate font-medium">{displayName}</span>
              <button
                type="button"
                onClick={openDisplayNameModal}
                aria-label="Edit display name"
                className="flex h-5 w-5 shrink-0 items-center justify-center"
              >
                <img src="/icons/edit.svg" alt="" className="h-[13px] w-[13px]" />
              </button>
            </div>
          </div>

          <div className="m-[5px] overflow-hidden rounded-[5px] bg-[#18d4ff] max-lg:mx-[5px] max-lg:mb-0 max-lg:mt-[1px] max-lg:h-[98px]">
            <ul>
              <li className="flex h-[28px] justify-start gap-1.5 rounded-[5px_5px_0px_0px] bg-[linear-gradient(-180deg,_#32617f_20%,_#1f4258_91%)] px-[5px] text-xs font-bold text-white max-lg:h-[29px]">
                <span className="flex items-center gap-[6px]">
                  Bonus Information
                  <img className="size-4 invert" src="/icons/info.svg" alt="" />
                </span>
                <span className="ml-auto flex items-center">00H:03M:30S</span>
              </li>

              <li className="flex h-[28px] items-center justify-between px-[5px] font-bold">
                <span>Earned Bonus</span>
                <span>{formatNumber(earnedBonus)}</span>
              </li>
            </ul>

            <div className="px-[5px] pb-[5px] text-white">
              <button
                type="button"
                onClick={() => handleNavigate('/referral')}
                className="flex h-[37px] w-full items-center justify-center gap-1 rounded-sm bg-[linear-gradient(90deg,#020024,#090979_35%,#04c4eb)] text-center text-xs font-semibold text-white"
              >
                <img
                  loading="lazy"
                  src="/icons/refer&earn.png"
                  alt=""
                  className="w-[21px] max-w-full"
                />
                Refer and Earn
              </button>
            </div>
          </div>

          <nav>
            {visibleAccountPanelItems.map((item) => (
              <button
                key={item.title}
                type="button"
                onClick={() => {
                  if (item.title === 'Stake Setting') {
                    setIsStakeModalOpen(true);
                    setOpen(false);
                    return;
                  }

                  handleNavigate(item);
                }}
                className="flex h-[30px] w-full items-center justify-between border-b border-[#d9dfe3] bg-white px-[10px] text-left text-[12px] leading-none text-black hover:bg-[#f5f7f8] max-lg:h-[36px] max-lg:text-[4vw] max-lg:font-semibold max-lg:text-[#2789ce]"
              >
                <span className="truncate">{item.title}</span>
                <span className="flex size-[19px] shrink-0 items-center justify-center rounded-full border border-[#c9d1d6] text-[#2f3b43] max-lg:h-[24px] max-lg:size-6  max-lg:rounded-[4px]">
                  <MdKeyboardArrowRight className="h-[17px] w-[17px]" />
                </span>
              </button>
            ))}
          </nav>

          <button
            type="button"
            onClick={handleLogout}
            disabled={logoutLoading}
            className="flex h-[40px] w-full items-center justify-center gap-[7px] bg-[#263f50] text-[14px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-70 max-lg:h-[47px] max-lg:bg-[#df2b1f]"
          >
            <span>{logoutLoading ? 'LOGGING OUT' : 'LOGOUT'}</span>
            <RiLogoutBoxRLine className="h-[18px] w-[18px]" />
          </button>

          <div className="h-[110px] bg-white max-lg:h-[20px]" />
        </div>
      )}

      {isStakeModalOpen && <StakeModal onClose={() => setIsStakeModalOpen(false)} />}
      {isOneClickBetModalOpen && (
        <OneClickBetModal
          onCancel={() => setIsOneClickBetModalOpen(false)}
          onSaved={() => {
            dispatch(setOneClickBetEnabled(true));
            onOneClickBetEnabledChange?.(true);
            setIsOneClickBetModalOpen(false);
          }}
        />
      )}
      {isDisplayNameModalOpen && (
        <div
          data-display-name-modal
          className="fixed inset-0 z-[5000000000000001] flex items-center justify-center bg-black/55 px-4"
          onMouseDown={() => setIsDisplayNameModalOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="display-name-modal-title"
            className="w-full max-w-[500px] overflow-hidden rounded-[6px] bg-white shadow-2xl"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex h-[44px] items-center justify-between bg-[#263f50] px-[11px] text-white">
              <h2 id="display-name-modal-title" className="text-[16px] font-bold">
                Display Name
              </h2>
              <button
                type="button"
                onClick={() => setIsDisplayNameModalOpen(false)}
                aria-label="Close display name dialog"
                className="flex h-7 w-7 items-center justify-center text-[28px] font-light leading-none"
              >
                ×
              </button>
            </div>
            <form
              className="px-[9px] pb-[8px] pt-[6px]"
              onSubmit={(event) => {
                event.preventDefault();
                handleDisplayNameSave();
              }}
            >
              <input
                autoFocus
                value={displayNameInput}
                onChange={(event) => setDisplayNameInput(event.target.value)}
                aria-label="Display name"
                className="h-[42px] w-full rounded-[6px] border border-[#cfd7dc] px-[12px] text-[16px] text-[#2f3b43] outline-none"
              />
              <button
                type="submit"
                disabled={isDisplayNameSaving}
                className="mx-auto mt-[10px] flex h-[37px] min-w-[100px] items-center justify-center rounded-[6px] bg-[#263f50] px-7 text-[14px] font-medium text-white disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isDisplayNameSaving ? 'Saving...' : 'Save'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAccount;
