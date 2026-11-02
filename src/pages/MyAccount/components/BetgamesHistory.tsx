export default function BetgamesHistory() {
  return (
    <div>
      <table className="w-full border-collapse text-[13px]">
        <thead>
          <tr className="bg-[#ececec] border-y border-[#90a3b5]">
            <th className="text-left px-2 py-[4px] font-bold">Bet ID</th>

            <th className="text-left px-2 py-[4px] font-bold">Event</th>

            <th className="text-left px-2 py-[4px] font-bold">Bet Placed</th>

            <th className="text-left px-2 py-[4px] font-bold">Bet Settled</th>

            <th className="text-right px-2 py-[4px] font-bold">Stake</th>

            <th className="text-right px-2 py-[4px] font-bold">Profit/Loss</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td colSpan={6} className="px-[2px] py-[12px] leading-5 text-[13px]">
              <p>Betting History enables you to review the bets you have placed.</p>

              <p>
                Specify the time period during which your bets were placed, the type of markets on
                which the bets were placed, and the sport.
              </p>

              <p className="mt-[8px]">Betting History is available online for the past 30 days.</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
