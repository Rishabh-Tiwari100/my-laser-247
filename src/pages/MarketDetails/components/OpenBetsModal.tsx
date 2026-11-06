import { useEffect, useMemo, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useGetBetHistoryQuery } from '@/store/api/betReportApi';
import { useIsAuthenticated } from '@/hooks';
import dayjs from 'dayjs';
import { Loader2 } from 'lucide-react';

type BetTab = 'matched' | 'unmatched' | 'fancy';
interface OpenBetsModalProps {
  open: boolean;
  onClose: () => void;
  eventName: string;
  eventId?: string | number;
}
const tabs: { id: BetTab; label: string }[] = [
  { id: 'matched', label: 'Matched' },
  { id: 'unmatched', label: 'UnMatched' },
  { id: 'fancy', label: 'Fancy' },
];

export default function OpenBetsModal({ open, onClose, eventId }: OpenBetsModalProps) {
  const [activeTab, setActiveTab] = useState<BetTab>('matched');
  const isAuthenticated = useIsAuthenticated();
  const fromDate = useMemo(() => dayjs().subtract(1, 'day').toISOString(), []);
  const toDate = useMemo(() => dayjs().endOf('day').toISOString(), []);
  const { data, isLoading, isFetching, isError } = useGetBetHistoryQuery(
    {
      page: 1,
      limit: 100,
      betTime: 'CURRENT',
      eventId,
      fromDate,
      toDate,
      ...(activeTab === 'fancy' ? { marketType: 'fancy' } : {}),
    },
    { skip: !open || !isAuthenticated || !eventId }
  );
  const bets = (data?.bets ?? []).filter((bet) => {
    if (activeTab === 'fancy') return true;
    const unmatched = Number(bet.unmatchedAmount ?? bet.unmatchedStake ?? bet.unmatched ?? 0);
    if (activeTab === 'unmatched') return unmatched > 0;
    const fancy = /fancy|session/i.test(`${bet.marketType ?? ''} ${bet.marketName ?? ''}`);
    return (
      !fancy &&
      (unmatched === 0 || Number(bet.matchedAmount ?? bet.matchedStake ?? bet.matched ?? 0) > 0)
    );
  });
  useEffect(() => {
    if (open) setActiveTab('matched');
  }, [open, eventId]);

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(value) => {
        if (!value) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[5000000000000002] bg-[#263746]/45" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed left-1/2 top-[8px] z-[5000000000000003] w-[calc(100%-20px)] max-w-[500px] -translate-x-1/2 overflow-hidden rounded-[3px] bg-white font-helvetica text-black shadow-lg focus:outline-none"
        >
          <header className="flex h-[40px] items-center justify-between bg-[#243a48] px-[15px] text-white">
            <Dialog.Title className="text-[22px] font-normal leading-none">Open Bets</Dialog.Title>
            <Dialog.Close
              aria-label="Close open bets"
              className="flex size-[28px] items-center justify-center text-[26px] leading-none"
            >
              &times;
            </Dialog.Close>
          </header>
          <div
            role="tablist"
            aria-label="Open bet types"
            className="grid h-[28px] grid-cols-3 bg-[#cfd6da]"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                id={`open-bets-tab-${tab.id}`}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls="open-bets-panel"
                onClick={() => setActiveTab(tab.id)}
                className={`border-b border-[#777] text-[14px] font-normal ${activeTab === tab.id ? 'bg-white' : 'bg-[#cfd6da]'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div
            id="open-bets-panel"
            role="tabpanel"
            aria-labelledby={`open-bets-tab-${activeTab}`}
            className="max-h-[calc(100dvh-100px)] overflow-y-auto"
          >
            <table className="w-full table-fixed border-collapse text-center text-[11px]">
              <colgroup>
                <col className="w-[28%]" />
                <col className="w-[20%]" />
                <col className="w-[20%]" />
                <col className="w-[32%]" />
              </colgroup>
              <thead>
                <tr className="h-[28px] bg-[#cfd6da] text-[10px] font-bold [&>th]:border [&>th]:border-[#555] [&>th]:px-1">
                  <th scope="col">Selname</th>
                  <th scope="col">Odds</th>
                  <th scope="col">Stake</th>
                  <th scope="col">Date/Time</th>
                </tr>
              </thead>
              <tbody>
                {isLoading || isFetching ? (
                  <tr>
                    <td colSpan={4} className="h-[32px]">
                      <Loader2
                        aria-label="Loading open bets"
                        className="mx-auto size-4 animate-spin"
                      />
                    </td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td colSpan={4} className="p-2 text-[12px]">
                      Unable to load open bets
                    </td>
                  </tr>
                ) : bets.length ? (
                  bets.map((bet, index) => (
                    <tr
                      key={bet.id ?? index}
                      className="border-b border-[#d8dde0] align-top [&>td]:break-words [&>td]:px-1 [&>td]:py-[5px]"
                    >
                      <td>{bet.selection ?? bet.selectionName ?? bet.runnerName ?? '-'}</td>
                      <td>{bet.averageOdds ?? bet.avgOdds ?? bet.odds ?? bet.rate ?? '-'}</td>
                      <td>
                        {activeTab === 'unmatched'
                          ? (bet.unmatchedAmount ?? bet.unmatchedStake ?? bet.unmatched ?? '-')
                          : (bet.matchedAmount ??
                            bet.matchedStake ??
                            bet.amount ??
                            bet.stake ??
                            '-')}
                      </td>
                      <td>
                        {bet.placedAt ? dayjs(bet.placedAt).format('DD/MM/YYYY HH:mm:ss') : '-'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr aria-label="No open bets">
                    <td colSpan={4} className="h-[24px]" />
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
