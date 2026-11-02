export default function AWCBetsHistory() {
  return (
    <table className="w-full border-collapse text-[13px]">
      <thead>
        <tr className="border-y border-[#90a3b5] bg-[#ececec]">
          <th className="px-2 py-1 text-left">Bet ID</th>
          <th className="px-2 py-1 text-left">Event</th>
          <th className="px-2 py-1 text-left">Bet Placed</th>
          <th className="px-2 py-1 text-left">Bet Settled</th>
          <th className="px-2 py-1 text-right">Stake</th>
          <th className="px-2 py-1 text-right">Profit/Loss</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td colSpan={6} className="px-1 py-4 leading-5">
            <p>Bet Profit &amp; Loss enables you to review the bets you have placed.</p>

            <p>
              Specify the time period during which your bets were placed, the type of markets on
              which the bets were placed, and the sport.
            </p>

            <p className="mt-2">Bet Profit &amp;Loss is available online for the last 14 days.</p>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
