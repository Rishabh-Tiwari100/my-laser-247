const rows = [];

export default function BetsTable() {
  return (
    <div className="border border-[#8ea2b5]">
      <table className="w-full text-[13px]">
        <thead>
          <tr className="bg-[#71889b] text-white">
            <th className="border px-2 py-2 text-left">Date</th>

            <th className="border px-2 py-2 text-left">Event</th>

            <th className="border px-2 py-2 text-left">Market</th>

            <th className="border px-2 py-2 text-center">Selection</th>

            <th className="border px-2 py-2 text-right">Odds</th>

            <th className="border px-2 py-2 text-right">Stake</th>

            <th className="border px-2 py-2 text-right">Profit/Loss</th>
          </tr>
        </thead>

        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={7} className="py-12 text-center text-gray-500">
                No Bets Available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
