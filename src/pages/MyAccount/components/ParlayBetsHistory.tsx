export default function ParlayBetsHistory() {
  return (
    <table className="w-full border-collapse text-[13px]">
      <thead>
        <tr className="border-y border-[#90a3b5] bg-[#ececec]">
          <th className="px-2 py-1 text-left">Bet ID</th>
          <th className="px-2 py-1 text-left">Start Time</th>
          <th className="px-2 py-1 text-left">Settled Date</th>
          <th className="px-2 py-1 text-right">Stake</th>
          <th className="px-2 py-1 text-right">Odds</th>
          <th className="px-2 py-1 text-right">Profit &amp; Loss</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td colSpan={6} className="px-1 py-4 leading-5">
            <p>Betting History enables you to review the bets you have placed.</p>

            <p>
              Specify the time period during which your bets were placed, the type of markets on
              which the bets were placed, and the sport.
            </p>

            <p className="mt-2">Betting History is available online for the past 30 days.</p>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
