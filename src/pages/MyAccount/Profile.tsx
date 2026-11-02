import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { formatNumber } from '@/utils';
import { useGetMyWalletSummaryQuery } from '@/store/api/myWalletApi';

const getSafeNumber = (value: number | string | null | undefined) => {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : 0;
};

const positiveBalanceClassName = 'text-[#008000] font-black';
const exposureBalanceClassName = 'text-[#ff4646] font-black';

const Profile = () => {
  const user = useSelector((state: RootState) => state.user.profile);
  const wallet = useSelector((state: RootState) => state.wallet);
  const { data: walletSummary } = useGetMyWalletSummaryQuery();
  const mainBalance = getSafeNumber(wallet.mainBalance);
  const bonusBalance = getSafeNumber(walletSummary?.bonusBalance ?? wallet.bonusBalance);
  const exposure = getSafeNumber(wallet.exposure);
  const lockedAmount = getSafeNumber(walletSummary?.lockedBalance ?? wallet.lockedAmount);
  const totalBalance = getSafeNumber(
    walletSummary?.totalBalance ??
      mainBalance + bonusBalance - Math.abs(exposure) - Math.abs(lockedAmount)
  );
  const availableBalance = getSafeNumber(wallet.mainBalance);
  const withdrawableBalance = getSafeNumber(walletSummary?.availableWithdrawals);

  const profileRows = [
    {
      label: 'Total Balance',
      value: formatNumber(Number(totalBalance.toFixed(2))),
      valueClassName: positiveBalanceClassName,
    },
    {
      label: 'User ID',
      value: user?.username || '',
      valueClassName: 'text-black font-semibold',
    },
    {
      label: 'Available Balance',
      value: formatNumber(Number(availableBalance.toFixed(2))),
      valueClassName: positiveBalanceClassName,
    },
    {
      label: 'Exposure',
      value: formatNumber(Number(exposure.toFixed(2))),
      valueClassName: exposureBalanceClassName,
    },
    {
      label: 'Locked Amount',
      value: formatNumber(Number(lockedAmount.toFixed(2))),
      valueClassName: positiveBalanceClassName,
    },
    {
      label: 'Available Withdrawable Balance',
      value: formatNumber(Number(withdrawableBalance.toFixed(2))),
      valueClassName: positiveBalanceClassName,
    },
    {
      label: 'Bonus Balance',
      value: formatNumber(Number(bonusBalance.toFixed(2))),
      valueClassName: positiveBalanceClassName,
    },
  ];

  return (
    <div className="w-full">
      <h3 className="bg-theme-navbar p-2 py-1.5 text-sm font-bold capitalize text-white">
        Profile
      </h3>
      <table className="w-full border-collapse bg-white caption-bottom">
        <tbody>
          {profileRows.map((row, index) => (
            <tr
              key={row.label}
              className={`border border-[#acafb1] ${
                index === profileRows.length - 1 ? 'border-b-0' : 'border-b-2 border-b-[#dee2e6]'
              }`}
            >
              <th className="p-[5px_15px] text-left text-sm font-semibold capitalize text-black">
                {row.label}
              </th>
              <th className="p-[5px_15px] text-sm font-semibold text-black">:</th>
              <td className={`p-[5px_15px] text-sm capitalize ${row.valueClassName}`}>
                {row.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Profile;
