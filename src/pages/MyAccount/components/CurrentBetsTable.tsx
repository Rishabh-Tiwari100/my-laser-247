export default function CurrentBetsTable() {
  return (
    <div className="mt-3 text-[13px]">
      {/* Unmatched */}

      <div className="bg-[#435a6d] px-3 py-1 font-bold text-white">Unmatched</div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-[#8fa2b4] bg-[#ececec]">
            <th className="px-2 py-1 text-left">
              <label className="flex items-center gap-2">
                <input type="checkbox" />
                Market
              </label>
            </th>

            <th className="text-left">Selection</th>

            <th className="text-left">Type</th>

            <th className="text-left">Bet ID</th>

            <th className="text-left">Bet Placed</th>

            <th className="text-right">Odds req.</th>

            <th className="text-right">Matched</th>

            <th className="text-right">Unmatched</th>

            <th className="text-right">Date matched</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td colSpan={9} className="border-b border-[#c7d0d6] px-2 py-3">
              You have no bets in this time period
            </td>
          </tr>
        </tbody>
      </table>

      {/* Matched */}

      <div className="mt-4 bg-[#435a6d] px-3 py-1 font-bold text-white">Matched</div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-[#8fa2b4] bg-[#ececec]">
            <th className="px-2 py-1 text-left">Market</th>

            <th className="text-left">Selection</th>

            <th className="text-left">Type</th>

            <th className="text-left">Bet ID</th>

            <th className="text-left">Bet Placed</th>

            <th className="text-right">Odds req.</th>

            <th className="text-right">Matched</th>

            <th className="text-right">Avg. odds matched</th>

            <th className="text-right">Date matched</th>
          </tr>
        </thead>

        <tbody>
          <tr className="border-b border-[#d6d6d6]">
            <td className="px-2 py-2">
              Cricket &nbsp;&gt;&nbsp;
              <strong>England v New Zealand</strong>
              &nbsp;&gt;&nbsp; Match Odds
            </td>

            <td>New Zealand</td>

            <td className="text-[#2f74c0]">back</td>

            <td>
              <a href="#" className="text-[#2f74c0] underline">
                C-4805958915771575
              </a>
            </td>

            <td>
              2026-06-26
              <br />
              16:31:29
            </td>

            <td className="text-right">2.18</td>

            <td className="text-right">50.00</td>

            <td className="text-right">2.18</td>

            <td className="text-right">
              2026-06-26
              <br />
              16:31:29
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
