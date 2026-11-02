import { useIsAuthenticated } from '@/hooks';
import { useGetBetHistoryQuery } from '@/store/api/betReportApi';
import { Icons } from '@/utils/icons';
import dayjs from 'dayjs';
import React from 'react';
import { Link, useParams } from 'react-router-dom';

function MyBets({ className }: { className?: string }) {
  const { eventId } = useParams();
  const startDate = React.useMemo(() => dayjs().subtract(1, 'day').toISOString(), []);


  const endDate = React.useMemo(() => dayjs().endOf('day').toISOString(), []);

  const isAuthenticated = useIsAuthenticated();
  const { data: betHistory, isLoading: betHistoryLoader } = useGetBetHistoryQuery(
    {
      page: 1,
      limit: 10,
      betTime: 'CURRENT',
      eventId: eventId,
      fromDate: startDate,
      toDate: endDate,
    },
    {
      skip: !isAuthenticated,
    }
  );
  const bets = betHistory?.bets ?? [];

  return (
    <div
      className={`overflow-hidden bg-primary/20 text-gray-800 font-medium text-sm px-1.5 py-4 w-full xl:min-w-[300px] ${className}`}
    >
      <ul>
        <li className="grid grid-cols-5 justify-between gap-x-2 bg-gray-900 px-2 py-1 text-white mb-1.5">
          <span className="col-span-3">Matched Bet</span>
          <span className="col-span-1">Odds</span>
          <span className="col-span-1">Stake</span>
        </li>
        {betHistoryLoader ? (
          <div className="flex items-center justify-center gap-x-3 mt-4">
            <span className="inline-block animate-spin h-5 w-5">
              <Icons.loader className="h-5 w-5" />
            </span>
            Loading...
          </div>
        ) : Array.isArray(bets) && bets.length > 0 ? (
          bets.map((bet, idx) => {
            const { selection, odds, amount, betOn } = bet ?? {};

            return (
              <li
                key={idx}
                className={`grid grid-cols-5 justify-between gap-x-2 border-l-8 border-b text-13 px-1.5 py-0.5 shadow-md mb-2 ${betOn?.toLowerCase() === 'back'
                  ? 'border-odd-blue-500 bg-odd-blue-100/60'
                  : 'border-odd-pink-500 bg-odd-pink-100/60'
                  }`}
              >
                <span className="col-span-3">{selection}</span>
                <span className="col-span-1">{odds}</span>
                <span className="col-span-1">{amount}</span>
              </li>
            );
          })
        ) : (
          <p className="text-center text-gray-500 font-semibold mt-4">No Bets Available</p>
        )}
      </ul>
      <div className="flex justify-end mt-3">
        <Link to="/settled-bets" className="underline text-black font-medium text-xs">
          See more
        </Link>
      </div>
    </div>
  );
}

export default MyBets;
