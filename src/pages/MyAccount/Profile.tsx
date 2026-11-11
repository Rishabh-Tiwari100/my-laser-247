import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { useGetProfitLossBySportsQuery } from '@/store/api/betReportApi';
import Footer from '@/components/common/Footer';
import { useGetMyWalletSummaryQuery } from '@/store/api/myWalletApi';
import { formatNumber } from '@/utils';

const safeNumber = (value: unknown) => (Number.isFinite(Number(value)) ? Number(value) : 0);

export default function MyProfile() {
  const wallet = useSelector((state: RootState) => state.wallet);
  const user = useSelector((state: RootState) => state.user.profile);
  const { data, isLoading, isError } = useGetProfitLossBySportsQuery({});
  const { data: walletSummary } = useGetMyWalletSummaryQuery();
  const total = safeNumber(wallet.mainBalance) + safeNumber(wallet.bonusBalance);
  const available =
    walletSummary?.totalBalance !== undefined
      ? safeNumber(walletSummary.totalBalance)
      : total - Math.abs(safeNumber(wallet.exposure)) - Math.abs(safeNumber(wallet.lockedAmount));
  const profit = data?.data?.reduce((sum, item) => sum + safeNumber(item.profitLoss), 0);
  const rows = [
    ['User Id', user?.username || '-'],
    ['Available Chips', formatNumber(Number(available.toFixed(2)))],
    ['Exposure', safeNumber(wallet.exposure).toFixed(2)],
    ['Total Chips', formatNumber(Number(total.toFixed(2)))],
    [
      'Profit',
      isLoading ? 'Loading...' : isError || profit === undefined ? '-' : profit.toFixed(2),
    ],
  ];
  return (
    <section aria-labelledby="profile-title" className="pt-[2px] font-helvetica text-black">
      <h1
        id="profile-title"
        className="flex h-[31px] items-center bg-theme-navbar px-[6px] text-[13px] font-bold text-white"
      >
        Profile
      </h1>
      <table className="w-full table-fixed border-collapse bg-white text-[13px] capitalize">
        <colgroup>
          <col className="w-[60%]" />
          <col className="w-[40%]" />
        </colgroup>
        <tbody>
          {rows.map(([label, value]) => (
            <tr key={label} className="h-[33px] border-b-2 border-[#dce1e5] last:border-b-0">
              <th scope="row" className="px-[15px] py-0 text-left font-bold">
                {label}
              </th>
              <td
                className={`px-[12px] py-0 ${label === 'Profit' && profit !== undefined && !isError ? (profit < 0 ? 'text-red-600' : 'text-[#00b900]') : ''}`}
              >
                {value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-[64px] [&>div]:!my-0 [&_span]:text-black [&_a]:text-black [&_span]:text-[13px] [&_a]:text-[13px]">
        <Footer />
      </div>
    </section>
  );
}
