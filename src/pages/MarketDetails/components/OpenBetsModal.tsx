import Modal from '@/components/common/Modal';
import { useGetBetHistoryQuery, type ProfitLossItem } from '@/store/api/betReportApi';
import { useIsAuthenticated } from '@/hooks';
import { cn } from '@/utils';
import dayjs from 'dayjs';
import { Loader2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type BetTab = 'matched' | 'bookmaker' | 'fancy';

interface OpenBetsModalProps {
  open: boolean;
  onClose: () => void;
  eventName: string;
  eventId?: string | number;
}

const tabs: { id: BetTab; label: string }[] = [
  { id: 'matched', label: 'Matched' },
  { id: 'bookmaker', label: 'Bookmaker' },
  { id: 'fancy', label: 'Fancy' },
];

function getBetTab(bet: ProfitLossItem): BetTab {
  const market = `${bet.marketType ?? ''} ${bet.marketName ?? ''}`.toLowerCase();
  if (market.includes('bookmaker')) return 'bookmaker';
  if (market.includes('fancy') || market.includes('session')) return 'fancy';
  return 'matched';
}

const getApiMarketType = (tab: BetTab) => {
  if (tab === 'bookmaker') return 'bookmaker';
  if (tab === 'fancy') return 'fancy';
  return undefined;
};

const toNumber = (value: unknown): number | undefined => {
  const parsed = Number(String(value ?? '').replace(/,/g, ''));
  return Number.isFinite(parsed) ? parsed : undefined;
};

const formatNumber = (value: number): string =>
  new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 5,
    useGrouping: false,
  }).format(value);

const getBetOdds = (bet: ProfitLossItem): number | undefined =>
  toNumber(
    bet.averageOdds ??
      bet.avgOdds ??
      bet.avgRate ??
      bet.matchedOdds ??
      bet.oddsMatched ??
      bet.odds ??
      bet.rate ??
      bet.userRate
  );

const getBetStake = (bet: ProfitLossItem): number | undefined =>
  toNumber(bet.matchedAmount ?? bet.matchedStake ?? bet.matched ?? bet.amount ?? bet.stake);

const getBetSide = (bet: ProfitLossItem): string => String(bet.betOn ?? '').toUpperCase();

const getExplicitPotentialProfit = (bet: ProfitLossItem): number | undefined =>
  toNumber(bet.potentialProfit);

const getFancyPayoutValue = (bet: ProfitLossItem): number | undefined =>
  toNumber(
    bet.fancyPercentage ??
      bet.percentage ??
      bet.marketValue ??
      bet.marketRate ??
      bet.priceValue ??
      bet.payoutPercentage
  );

const getPotentialProfit = (bet: ProfitLossItem, tab: BetTab): string => {
  const explicitPotentialProfit = getExplicitPotentialProfit(bet);
  if (explicitPotentialProfit !== undefined) return formatNumber(explicitPotentialProfit);

  const stake = getBetStake(bet);
  if (stake === undefined) return '-';

  const betSide = getBetSide(bet);

  if (tab === 'fancy') {
    if (betSide === 'LAY') return formatNumber(stake);

    const payoutValue = getFancyPayoutValue(bet);
    if (payoutValue === undefined) return '-';

    return formatNumber((stake / 100) * payoutValue);
  }

  if (betSide === 'LAY') return formatNumber(stake);

  const odds = getBetOdds(bet);
  if (odds === undefined) return '-';

  return formatNumber(Math.max(0, odds - 1) * stake);
};

const getPotentialProfitLiability = (bet: ProfitLossItem, tab: BetTab): string => {
  const explicitPotentialProfit = getExplicitPotentialProfit(bet);
  if (explicitPotentialProfit !== undefined) return formatNumber(explicitPotentialProfit);

  const stake = getBetStake(bet);
  if (stake === undefined) return '-';

  if (tab !== 'fancy') return getPotentialProfit(bet, tab);

  const payoutValue = getFancyPayoutValue(bet);
  if (payoutValue === undefined) return '-';

  if (getBetSide(bet) === 'LAY') return formatNumber((stake / 100) * payoutValue);

  return formatNumber((stake / 100) * payoutValue);
};

export default function OpenBetsModal({ open, onClose, eventName, eventId }: OpenBetsModalProps) {
  const [activeTab, setActiveTab] = useState<BetTab>('matched');
  const [averageOdds, setAverageOdds] = useState(false);
  const isAuthenticated = useIsAuthenticated();
  const betsFromDate = useMemo(() => dayjs().subtract(1, 'day').toISOString(), []);

  const betsToDate = useMemo(() => dayjs().endOf('day').toISOString(), []);
  const marketType = getApiMarketType(activeTab);

  const { data, isLoading, isFetching, isError } = useGetBetHistoryQuery(
    {
      page: 1,
      limit: 100,
      betTime: 'CURRENT',
      eventId,
      fromDate: betsFromDate,
      toDate: betsToDate,
      ...(marketType && { marketType }),
    },
    { skip: !open || !isAuthenticated || !eventId }
  );

  const bets = data?.bets ?? [];
  const visibleBets = useMemo(() => {
    if (marketType) return bets;
    return bets.filter((bet) => getBetTab(bet) === activeTab);
  }, [activeTab, bets, marketType]);
  const loading = isLoading || isFetching;
  const emptyStateColSpan = averageOdds ? 3 : activeTab === 'fancy' ? 5 : 4;

  useEffect(() => {
    if (open) setActiveTab('matched');
  }, [open, eventId]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Open Bets"
      className="max-w-[500px] rounded-[7px] border-0"
      placement="top"
      overlayClassName="!z-[1100] pt-[10px]"
      headerClassName="h-[43px] border-0 bg-primary-theme px-[10px]"
      titleClassName="text-[14px] font-bold text-white"
      bodyClassName="max-h-[calc(100vh-110px)] p-[8px] text-[#202020]"
      showCloseButton={false}
    >
      <p className="mb-[10px] truncate text-[14px] font-bold" title={eventName}>
        {eventName || 'Event'}
      </p>

      <label className="mb-[10px] flex w-fit cursor-pointer items-center gap-[5px] text-[14px]">
        <input
          type="checkbox"
          checked={averageOdds}
          onChange={(event) => setAverageOdds(event.target.checked)}
          className="h-[14px] w-[14px] accent-[#263f50]"
        />
        Average Odds
      </label>

      <div className="grid h-[35px] grid-cols-3 overflow-hidden rounded-[5px] border border-[#263f50]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'border-r border-[#263f50] text-[12px] font-bold last:border-r-0',
              activeTab === tab.id ? 'bg-[#263f50] text-white' : 'bg-white text-[#263f50]'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-[8px] overflow-x-auto border border-[#aeb4b8]">
        <table className="w-full border-collapse text-[12px]">
          <thead>
            {averageOdds ? (
              <tr className="h-[34px] bg-[#e6e6e6] text-[14px] font-bold text-black">
                <th className="border-r border-[#b6b6b6] px-1">Odds</th>
                <th className="border-r border-[#b6b6b6] px-1">Stake</th>
                <th className="px-2">Profit/ Liability</th>
              </tr>
            ) : (
              <tr className="h-[34px] bg-[#e6e6e6] font-bold text-black">
                <th className="border-r border-[#b6b6b6] px-1">Date/Time</th>
                {activeTab === 'fancy' && (
                  <th className="border-r border-[#b6b6b6] px-1">Market</th>
                )}
                <th className="border-r border-[#b6b6b6] px-1">Selection</th>
                <th className="border-r border-[#b6b6b6] px-1">Odds</th>
                <th className="px-2">Stake</th>
              </tr>
            )}
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={emptyStateColSpan} className="h-[165px] text-center">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-[#263f50]" />
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={emptyStateColSpan} className="h-[165px] text-center">
                  Unable to load open bets
                </td>
              </tr>
            ) : visibleBets.length > 0 ? (
              visibleBets.map((bet, index) => {
                const odds = getBetOdds(bet);
                const stake = getBetStake(bet);

                if (averageOdds) {
                  const rowClassName =
                    getBetSide(bet) === 'LAY' ? 'bg-[#f4a3b6]' : 'bg-[#67b7e6]';

                  return (
                    <tr
                      key={bet.id ?? index}
                      className={`border-t border-[#c6c6c6] text-center text-[14px] ${rowClassName}`}
                    >
                      <td className="border-r border-[#8fb0c7] px-2 py-2">
                        {odds !== undefined ? formatNumber(odds) : (bet.odds ?? bet.rate ?? '-')}
                      </td>
                      <td className="border-r border-[#8fb0c7] px-2 py-2">
                        {stake !== undefined ? formatNumber(stake) : (bet.amount ?? bet.stake ?? '-')}
                      </td>
                      <td className="px-2 py-2 text-[#008000]">
                        {getPotentialProfitLiability(bet, activeTab)}
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={bet.id ?? index} className="border-t border-[#c6c6c6] text-center">
                    <td className="border-r border-[#c6c6c6] px-2 py-2">
                      {bet.placedAt ? dayjs(bet.placedAt).format('DD/MM/YYYY HH:mm') : '-'}
                    </td>
                    {activeTab === 'fancy' && (
                      <td className="border-r border-[#c6c6c6] px-2 py-2">
                        {bet.marketName ?? '-'}
                      </td>
                    )}
                    <td className="border-r border-[#c6c6c6] px-2 py-2">
                      {bet.selection ?? bet.selectionName ?? bet.runnerName ?? '-'}
                    </td>
                    <td className="border-r border-[#c6c6c6] px-2 py-2">
                      {bet.odds ?? bet.rate ?? '-'}
                    </td>
                    <td className="px-2 py-2">{bet.amount ?? bet.stake ?? '-'}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={emptyStateColSpan} className="h-[165px]">
                  <div className="flex flex-col items-center justify-center text-[#08c]">
                    <svg
                      className="h-full w-[140px]"
                      width="100"
                      height="71"
                      viewBox="0 0 100 71"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M35.3567 26.1778H21.0889C20.5031 26.1778 20.0428 26.6791 20.0926 27.2628L23.4595 66.7268C23.8804 69.2463 26.3501 70.1126 27.2788 70.1745C27.3275 70.1777 27.3746 70.1757 27.4224 70.1664C28.613 69.9361 31.2432 67.5378 31.2432 65.0013C31.5764 61.3454 32.4711 45.1257 32.923 36.6118C32.9512 36.0807 33.3898 35.668 33.9216 35.668H67C67.5523 35.668 68 35.2203 68 34.668V31.9229C68 31.3706 67.5523 30.9229 67 30.9229H38.8054C38.4136 30.9229 38.0579 30.6941 37.8954 30.3375L36.2667 26.7632C36.1043 26.4066 35.7485 26.1778 35.3567 26.1778Z"
                        fill="currentColor"
                        fill-opacity="0.2"
                      ></path>
                      <path
                        d="M78 36.1778H67.9744H32.6667C32.2308 44.1817 31.2718 61.1161 30.9231 64.8232C30.9231 67.3507 28.1624 69.7378 27 69.8782C27 69.8782 67.0154 70.5522 70.1538 69.8782C73.2923 69.2042 74.9487 66.2274 75.3846 64.8232L78 36.1778Z"
                        fill="white"
                      ></path>
                      <path
                        d="M68.0448 35.6023V31.89C68.0448 31.3378 67.5971 30.89 67.0448 30.89H38.8203C38.4295 30.89 38.0746 30.6625 37.9115 30.3074L36.2825 26.7604C36.1194 26.4054 35.7645 26.1778 35.3738 26.1778H21.0897C20.5036 26.1778 20.0431 26.6795 20.0934 27.2635L23.4627 66.4461C23.8955 69.0164 26.4925 69.8541 27.3582 69.8732M68.0448 35.6023H76.9069C77.4942 35.6023 77.9551 36.1061 77.9029 36.6911L75.4121 64.6299C75.4061 64.6981 75.3936 64.7646 75.3724 64.8298C74.8965 66.2935 73.2563 69.2029 70.209 69.8732C67.0925 70.5586 27.3582 69.8732 27.3582 69.8732M68.0448 35.6023H33.9333C33.4017 35.6023 32.9632 36.0147 32.9348 36.5455C32.4823 45.0022 31.5871 61.1027 31.2537 64.7325C31.2537 67.3028 28.5124 69.7304 27.3582 69.8732"
                        stroke="currentColor"
                      ></path>
                      <path
                        d="M52 62H56"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                      <path
                        d="M43.5 49C44.3333 48.5 46.4 47.5 48 47.5M60.5 47.5C61.3333 47.5 63.4 47.8 65 49"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                      <path
                        d="M49.5 55C49.5 56.1046 48.6046 57 47.5 57C46.3954 57 45.5 56.1046 45.5 55C45.5 53.8954 46.3954 53 47.5 53C48.6046 53 49.5 53.8954 49.5 55Z"
                        fill="currentColor"
                      ></path>
                      <path
                        d="M63 55C63 56.1046 62.1046 57 61 57C59.8954 57 59 56.1046 59 55C59 53.8954 59.8954 53 61 53C62.1046 53 63 53.8954 63 55Z"
                        fill="currentColor"
                      ></path>
                      <path
                        d="M93 54C93 55.933 91.433 57.5 89.5 57.5C87.567 57.5 86 55.933 86 54C86 52.067 87.567 50.5 89.5 50.5C91.433 50.5 93 52.067 93 54Z"
                        fill="currentColor"
                        fill-opacity="0.2"
                        stroke="currentColor"
                      ></path>
                      <path
                        d="M97.5 47.5C97.5 48.6046 96.6046 49.5 95.5 49.5C94.3954 49.5 93.5 48.6046 93.5 47.5C93.5 46.3954 94.3954 45.5 95.5 45.5C96.6046 45.5 97.5 46.3954 97.5 47.5Z"
                        stroke="currentColor"
                      ></path>
                      <path
                        d="M48.5 17C48.5 18.1046 47.6046 19 46.5 19C45.3954 19 44.5 18.1046 44.5 17C44.5 15.8954 45.3954 15 46.5 15C47.6046 15 48.5 15.8954 48.5 17Z"
                        stroke="currentColor"
                      ></path>
                      <path
                        d="M3.5 42C3.5 42.8284 2.82843 43.5 2 43.5C1.17157 43.5 0.5 42.8284 0.5 42C0.5 41.1716 1.17157 40.5 2 40.5C2.82843 40.5 3.5 41.1716 3.5 42Z"
                        stroke="currentColor"
                      ></path>
                      <path
                        d="M26 14L24.5 15.5M24.5 15.5L23 17M24.5 15.5L23 14M24.5 15.5L26 17M17 57L15.5 58.5M15.5 58.5L14 60M15.5 58.5L14 57M15.5 58.5L17 60"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                      <path
                        d="M88.815 29.0355L88.7638 29.0559L88.7183 29.0869C87.901 29.6444 86.3249 30.6295 84.5139 31.4731C83.7252 31.8404 82.9032 32.1757 82.0875 32.4378C82.3168 32.2703 82.5344 32.091 82.7262 31.9016C83.1323 31.5009 83.5 30.9787 83.5 30.3678V29.93L83.066 29.8722C75.9724 28.9271 70.5 22.8522 70.5 15.5C70.5 7.49187 76.9919 1 85 1C88.7004 1 92.2005 2.89502 94.7879 5.6853C97.3771 8.47749 99 12.1108 99 15.5C99 21.7504 95.1703 26.5037 88.815 29.0355Z"
                        stroke="currentColor"
                      ></path>
                      <path
                        d="M89.316 11.828C89.316 12.6493 88.9273 13.6173 88.15 14.732C88.062 14.8787 87.9593 15.0473 87.842 15.238C87.7393 15.414 87.6293 15.6047 87.512 15.81C87.204 16.1767 86.918 16.536 86.654 16.888C86.39 17.24 86.1407 17.5847 85.906 17.922C85.4513 18.5967 85.224 19.44 85.224 20.452H84.564C84.564 19.1613 84.718 18.1933 85.026 17.548C85.158 17.2693 85.3047 16.9833 85.466 16.69C85.642 16.382 85.8327 16.0667 86.038 15.744C86.1553 15.524 86.2653 15.3187 86.368 15.128C86.4707 14.9373 86.5587 14.7613 86.632 14.6C87.38 13.5 87.754 12.5907 87.754 11.872C87.754 11.0067 87.5267 10.2953 87.072 9.738C86.5587 9.078 85.884 8.748 85.048 8.748C84.1973 8.748 83.4933 8.96067 82.936 9.386C82.452 9.738 82.21 10.1487 82.21 10.618C82.21 10.8527 82.364 11.08 82.672 11.3C83.0533 11.5053 83.2073 11.8427 83.134 12.312C83.09 12.9573 82.7453 13.28 82.1 13.28C81.8067 13.28 81.55 13.126 81.33 12.818C81.11 12.51 81 12.1067 81 11.608C81 10.5227 81.4107 9.63533 82.232 8.946C82.9947 8.31533 83.9553 8 85.114 8C86.3607 8 87.3653 8.35933 88.128 9.078C88.92 9.79667 89.316 10.7133 89.316 11.828ZM85.928 23.202C85.928 23.5393 85.818 23.8253 85.598 24.06C85.378 24.3093 85.1067 24.434 84.784 24.434C84.4613 24.434 84.1827 24.3093 83.948 24.06C83.728 23.8253 83.618 23.5393 83.618 23.202C83.618 22.8647 83.728 22.5787 83.948 22.344C84.168 22.1093 84.4467 21.992 84.784 21.992C85.1067 21.992 85.378 22.1093 85.598 22.344C85.818 22.5787 85.928 22.8647 85.928 23.202Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                    <span className="mt-1 text-[12px] font-bold">No Records Found</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Modal>
  );
}
