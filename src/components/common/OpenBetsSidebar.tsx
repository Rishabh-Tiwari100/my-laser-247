import { useIsAuthenticated } from '@/hooks';
import { useGetBetHistoryQuery } from '@/store/api/betReportApi';
import dayjs from 'dayjs';
import { Loader2 } from 'lucide-react';
import { useMemo, useState } from 'react';

type BetTab = 'matched' | 'unmatched' | 'fancy';

const tabs: { id: BetTab; label: string }[] = [
  { id: 'matched', label: 'Matched' },
  { id: 'unmatched', label: 'Unmatched' },
  { id: 'fancy', label: 'Fancy' },
];

export default function OpenBetsSidebar({ gridLayout = false }: { gridLayout?: boolean }) {
  const [activeTab, setActiveTab] = useState<BetTab>('matched');
  const isAuthenticated = useIsAuthenticated();
  const fromDate = useMemo(() => dayjs().subtract(1, 'day').toISOString(), []);
  const toDate = useMemo(() => dayjs().endOf('day').toISOString(), []);
  const { data, isLoading, isFetching, isError } = useGetBetHistoryQuery(
    { page: 1, limit: 100, betTime: 'CURRENT', fromDate, toDate, ...(activeTab === 'fancy' ? { marketType: 'fancy' } : {}) },
    { skip: !isAuthenticated }
  );
  const bets = (data?.bets ?? []).filter((bet) => {
    const market = `${bet.marketType ?? ''} ${bet.marketName ?? ''}`.toLowerCase();
    if (activeTab === 'fancy') return market.includes('fancy') || market.includes('session');
    if (activeTab === 'unmatched') return Number(bet.unmatchedAmount ?? bet.unmatchedStake ?? bet.unmatched ?? 0) > 0;
    return !market.includes('fancy') && !market.includes('session');
  });
  const loading = isLoading || isFetching;

  return (
    <aside className={`hidden overflow-x-hidden border-l border-[#c8ced3] bg-white font-helvetica text-black ${gridLayout ? 'xl:col-span-4 xl:sticky xl:top-[98px] xl:block xl:h-[calc(100vh-98px)] xl:self-start' : 'w-[26.5vw] shrink-0 lg:sticky lg:top-[98px] lg:block lg:h-[calc(100vh-98px)] lg:self-start'}`}>
      <div className="flex h-full min-h-0 flex-col">
        <h2 className="m-0 shrink-0 rounded-none bg-[#263f50] p-[5px] text-[12px] font-normal leading-normal capitalize text-white">Open Bets</h2>
        <input aria-label="Filter open bets" className="m-[1.5%] h-[25px] w-[97%] shrink-0 cursor-pointer rounded-none border border-black px-[5px] text-xs leading-[25px] capitalize text-black shadow-none focus:shadow-none focus:outline-none" />
        <div className="flex shrink-0 flex-wrap bg-[#ced5da] text-center">
          {tabs.map((tab) => (
            <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`rounded-none px-[22px] py-[3px] text-[14px] font-medium leading-normal text-black hover:text-black ${activeTab === tab.id ? 'border-x-0 border-b-0 border-t-2 border-[#263f50] bg-white' : 'border-0'}`}>
              {tab.label}
            </button>
          ))}
        </div>
        <div className="grid shrink-0 grid-cols-4 items-center border-b border-[#d8dde0] text-left text-[11px] leading-normal capitalize [&>span]:p-1">
          <span>Selname</span><span>Odds</span><span>Stake</span><span>Date/Time</span>
        </div>
        <div className="min-h-0 flex-1 overflow-y-scroll p-0 text-[11px] leading-normal">
          {!isAuthenticated ? <div className="p-3 text-center text-gray-500">Login to view bets</div> : loading ? (
            <div className="flex h-32 items-center justify-center"><Loader2 className="h-5 w-5 animate-spin text-[#263f50]" /></div>
          ) : isError ? <div className="p-3 text-center">Unable to load open bets</div> : bets.map((bet, index) => (
            <div key={bet.id ?? index} className="grid grid-cols-4 items-center border-b border-gray-100 text-left capitalize [&>span]:p-1">
              <span className="truncate px-1" title={bet.selection ?? bet.selectionName ?? ''}>{bet.selection ?? bet.selectionName ?? bet.runnerName ?? '-'}</span>
              <span>{bet.odds ?? bet.rate ?? '-'}</span>
              <span>{bet.amount ?? bet.stake ?? '-'}</span>
              <span>{bet.placedAt ? dayjs(bet.placedAt).format('DD/MM HH:mm') : '-'}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
