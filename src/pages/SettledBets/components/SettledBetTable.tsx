import type { SettledBetRow } from '../types';

interface SettledBetTableProps {
  bets: SettledBetRow[];
  labelledBy: string;
  emptyMessage?: string;
  variant?: 'settled' | 'unsettled';
}

const cellClassName =
  'h-[31px] border border-[#bfc1c3] px-[5px] py-[2px] align-middle text-[12px] leading-[13px] text-[#050505]';

const profitLossFormatter = new Intl.NumberFormat('en-IN', {
  maximumFractionDigits: 5,
  useGrouping: false,
});

function CashoutBadge() {
  return (
    <span
      aria-label="Cash out"
      title="Cash out"
      className="mr-[5px] inline-flex h-[20px] w-[21px] shrink-0 items-center justify-center rounded-[3px] border-2 border-[#c8a822] bg-[#004d88] text-[12px] font-bold leading-none text-white"
    >
      C
    </span>
  );
}

export default function SettledBetTable({
  bets,
  labelledBy,
  emptyMessage = 'No Bets Found',
  variant = 'unsettled',
}: SettledBetTableProps) {
  return (
    <div className="overflow-hidden rounded-b-[4px] bg-white shadow-[0_2px_5px_rgba(0,0,0,0.14)]">
      <div className="overflow-x-auto">
        <table
          className="w-full min-w-[650px] table-auto border-collapse bg-white text-[12px]"
          aria-labelledby={labelledBy}
        >
          <thead>
            <tr>
              {['MARKET', 'SELECTION', 'ODDS', 'STAKE'].map((heading) => (
                <th
                  scope="col"
                  key={heading}
                  className="h-[28px] border border-[#acafb1] bg-[linear-gradient(to_bottom_right,#243a48,#004d87)] px-[4px] py-0 text-center text-[11px] font-bold leading-[27px] text-white"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bets.length > 0 ? (
              bets.map((bet) => <Rows key={bet.id} bet={bet} variant={variant} />)
            ) : (
              <tr>
                <td colSpan={4} className={`${cellClassName} h-[42px] text-center font-bold`}>
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Rows({ bet, variant }: { bet: SettledBetRow; variant: 'settled' | 'unsettled' }) {
  const detailBackground = bet.side === 'LAY' ? 'bg-[#feb4bf]' : 'bg-[#a0e4ff]';
  const isProfit = bet.profitLoss >= 0;
  const profitLossClassName =
    bet.profitLoss === 0 ? 'text-[#333]' : isProfit ? 'text-[#00c83c]' : 'text-[#dc3448]';
  const statusClassName =
    bet.status === 'Won'
      ? 'text-[#00c83c]'
      : bet.status === 'Lost'
        ? 'text-[#dc3448]'
        : 'text-[#333]';
  const formattedProfitLoss = profitLossFormatter.format(Math.abs(bet.profitLoss));
  const showSettledResult = variant === 'settled';

  return (
    <>
      <tr className="bg-white transition-colors hover:bg-[#fafafa]">
        <td className={`${cellClassName} font-bold`}>
          <span className="flex items-center">
            {bet.showCashoutBadge && <CashoutBadge />}
            <span className="break-words">{bet.market}</span>
          </span>
        </td>
        <td className={`${cellClassName} break-words`}>{bet.selection}</td>
        <td className={cellClassName}>{bet.odds}</td>
        <td className={`${cellClassName} text-center`}>{bet.stake}</td>
      </tr>
      <tr className={`${detailBackground} shadow-[0_4px_8px_rgba(0,0,0,0.24)]`}>
        <td className={`${cellClassName} whitespace-nowrap text-[#333]`}>{bet.placedAt}</td>
        <td className={`${cellClassName} whitespace-nowrap text-[#333]`}>Rate : {bet.rate}</td>
        {showSettledResult ? (
          <>
            <td className={`${cellClassName} whitespace-nowrap text-[#333]`}>
              Profit/Loss :{' '}
              <strong className={`font-bold ${profitLossClassName}`}>{formattedProfitLoss}</strong>
            </td>
            <td className={`${cellClassName} whitespace-nowrap text-[#333]`}>
              Status : <strong className={`font-bold ${statusClassName}`}>{bet.status}</strong>
            </td>
          </>
        ) : (
          <>
            <td className={`${cellClassName} whitespace-nowrap text-[#333]`}>
              Profit : <strong className="font-bold text-[#00c83c]">{bet.profit}</strong>
            </td>
            <td className={`${cellClassName} whitespace-nowrap text-[#333]`}>
              Liability : <strong className="font-bold text-[#dc3448]">{bet.liability}</strong>
            </td>
          </>
        )}
      </tr>
    </>
  );
}
