import { NavLink, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import toast from 'react-hot-toast';
import { FaInfoCircle, FaRegEdit, FaUserCircle } from 'react-icons/fa';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { RiLogoutBoxRLine } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { ACCOUNT_MENUS } from '../constant';
import { RootState, logout as clearAuth } from '@/store';
import { useLogoutMutation } from '@/store/api/authApi';
import { useGetBonusEarningsQuery } from '@/store/api/bonusApi';
import { formatNumber } from '@/utils';

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logout, { isLoading: logoutLoading }] = useLogoutMutation();
  const { data: bonusEarnings } = useGetBonusEarningsQuery();

  const user = useSelector((state: RootState) => state.user.profile);
  const wallet = useSelector((state: RootState) => state.wallet);

  const username = user?.username ?? 'My Account';
  const displayName = user?.firstname || user?.username || 'User';
  const exposure = Number(wallet?.exposure ?? 0);
  const lockedAmount = Number(wallet?.lockedAmount ?? 0);
  const totalBalance = Number(
    (
      (wallet?.mainBalance ?? 0) +
      (wallet?.bonusBalance ?? 0) -
      Math.abs(exposure) -
      Math.abs(lockedAmount)
    ).toFixed(2)
  );
  const earnedBonus = Number(bonusEarnings?.lifetime ?? wallet?.bonusBalance ?? 0);

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

  return (
    <aside className="w-[300px] h-[calc(100%-70px)] shrink-0 overflow-hidden border border-[#cfd7dc] bg-white text-[12px] text-black shadow-sm">
      <div className="flex h-[40px] items-center justify-between bg-gradient-to-r from-[#061466] via-[#084c9f] to-[#10bce6] pl-2 pr-[10px] text-white">
        <div className="flex min-w-0 items-center gap-[5px] font-bold">
          <FaUserCircle className="h-[18px] w-[18px] shrink-0" />
          <span className="truncate">{username}</span>
        </div>

        <div className="flex shrink-0 items-center gap-[10px]">
          <button
            type="button"
            className="flex h-[18px] w-[18px] items-center justify-center rounded-[2px] border border-white/80 text-white"
            aria-label="Copy account"
          >
            <span className="h-[9px] w-[9px] border border-white" />
          </button>
          <span className="font-medium">GMT+5:30</span>
        </div>
      </div>

      <div className="flex h-[26px] items-center justify-between bg-[#f2f2f2] px-[10px] font-semibold">
        <span>One Click Bet</span>
        <button
          type="button"
          aria-label="Toggle one click bet"
          className="relative h-[16px] w-[30px] rounded-full bg-[#777] shadow-inner"
        >
          <span className="absolute left-[2px] top-[2px] h-[12px] w-[12px] rounded-full bg-white shadow" />
        </button>
      </div>

      <div className="flex h-[32px] items-center justify-between border-b border-[#d9dfe3] bg-white px-[10px]">
        <span className="font-bold">Display name :</span>
        <div className="flex min-w-0 items-center gap-[8px]">
          <span className="max-w-[130px] truncate font-semibold">{displayName}</span>
          <FaRegEdit className="h-[12px] w-[12px] shrink-0 text-[#0abbd7]" />
        </div>
      </div>

      <div className="bg-[#16c7e9]">
        <div className="flex h-[28px] items-center justify-between bg-gradient-to-b from-[#356b88] to-[#0d4463] px-[10px] font-bold text-white">
          <span className="flex items-center gap-[6px]">
            Bonus Information
            <FaInfoCircle className="h-[13px] w-[13px]" />
          </span>
          <span>00H:14M:26S</span>
        </div>

        <div className="flex h-[30px] items-center justify-between px-[10px] font-bold">
          <span>Earned Bonus</span>
          <span>{formatNumber(earnedBonus)}</span>
        </div>

        <div className="px-[10px] pb-[7px]">
          <button
            type="button"
            onClick={() => navigate('/referral')}
            className="flex h-[34px] w-full items-center justify-center gap-[8px] rounded-[4px] bg-[#071b78] font-bold text-white"
          >
            <img src="/icons/refer&earn.png" className="h-[15px] w-[15px]" />
            Refer and Earn
          </button>
        </div>
      </div>

      <nav>
        {ACCOUNT_MENUS.filter((menu) => menu.showInside).map((menu) => (
          <NavLink
            key={menu.path}
            to={menu.path}
            className={({ isActive }) =>
              clsx(
                'flex h-[30px] items-center justify-between border-b border-[#d9dfe3] bg-white px-[10px] text-[12px] leading-none text-black transition-colors hover:bg-[#f5f7f8]',
                isActive && 'bg-[#eef8fb] font-semibold'
              )
            }
          >
            <span className="truncate">{menu.title}</span>
            <span className="flex h-[19px] w-[19px] shrink-0 items-center justify-center rounded-full border border-[#c9d1d6] text-[#2f3b43]">
              <MdKeyboardArrowRight className="h-[17px] w-[17px]" />
            </span>
          </NavLink>
        ))}

      </nav>

      <button
        type="button"
        onClick={handleLogout}
        disabled={logoutLoading}
        className="flex h-[40px] w-full items-center justify-center gap-[7px] bg-[#263f50] text-[14px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-70"
      >
        <span>{logoutLoading ? 'LOGGING OUT' : 'LOGOUT'}</span>
        <RiLogoutBoxRLine className="h-[18px] w-[18px]" />
      </button>

      <div className="min-h-[92px] bg-white">
        <div className="flex h-[25px] items-center justify-between px-[10px] text-[#24495f]">
          <span className="font-bold">Bal: {formatNumber(totalBalance)}</span>
          <span className="font-bold text-[#b41010]">Exp: {formatNumber(exposure)}</span>
        </div>
      </div>
    </aside>
  );
}
