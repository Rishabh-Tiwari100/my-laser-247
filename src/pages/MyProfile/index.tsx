import { formatNumber } from '@/utils';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import ProfileCard from './components/ProfileCard';

const getSafeNumber = (value: number | string | null | undefined) => {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : 0;
};

const MyProfile = () => {
  const wallet = useSelector((state: RootState) => state.wallet);
  const bonusBalance = getSafeNumber(wallet.bonusBalance);
  const exposure = getSafeNumber(wallet.exposure);
  const withdrawableBalance = getSafeNumber(wallet.withdrawableBalance);
  const balanceInfo = [
    {
      id: 1,
      Title: 'Exposure Credited',
      amount: formatNumber(Number(exposure.toFixed(2))),
    },
    {
      id: 2,
      Title: 'Available Balance',
      amount: formatNumber(Number(withdrawableBalance.toFixed(2))),
    },
    {
      id: 3,
      Title: 'Bonus Rewarded',
      amount: formatNumber(Number(bonusBalance.toFixed(2))),
    },
  ];
  return (
    <div className="p-2 sm:p-6">
      <div className="rounded-xl shadow-2xl p-4 ">
        <h1 className="font-bold text-xl">Profile</h1>
        <hr className="border-t border-primary-light my-2" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-10">
          {balanceInfo.map((balance) => {
            return (
              <div
                className="bg-primary-light/25 rounded-md border border-primary-light p-2"
                key={balance.id}
              >
                <h3 className="text-primary-dark-blue">{balance?.Title}</h3>
                <p className="text-lg font-bold text-primary-dark-blue py-2">{balance.amount}</p>
              </div>
            );
          })}
        </div>

        <ProfileCard />
      </div>
    </div>
  );
};

export default MyProfile;
