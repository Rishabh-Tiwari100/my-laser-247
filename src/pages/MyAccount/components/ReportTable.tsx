const rows = [
  {
    date: '26 Jun 2026',
    sport: 'Cricket',
    market: 'Match Odds',
    selection: 'India',
    stake: '500',
    odds: '1.98',
    result: '+490',
  },
  {
    date: '27 Jun 2026',
    sport: 'Football',
    market: 'Over 2.5',
    selection: 'Yes',
    stake: '300',
    odds: '1.85',
    result: '-300',
  },
];

export default function ReportTable() {
  return (
    <div className="overflow-x-auto border border-[#8ea2b5]">
      <table className="w-full text-[13px]">
        <thead>
          <tr className="bg-[#71889b] text-white">
            <th className="border px-2 py-2">Date</th>

            <th className="border px-2 py-2">Sport</th>

            <th className="border px-2 py-2">Market</th>

            <th className="border px-2 py-2">Selection</th>

            <th className="border px-2 py-2 text-right">Odds</th>

            <th className="border px-2 py-2 text-right">Stake</th>

            <th className="border px-2 py-2 text-right">P/L</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="odd:bg-white even:bg-[#fafafa]">
              <td className="border px-2 py-2">{row.date}</td>

              <td className="border px-2 py-2">{row.sport}</td>

              <td className="border px-2 py-2">{row.market}</td>

              <td className="border px-2 py-2">{row.selection}</td>

              <td className="border px-2 py-2 text-right">{row.odds}</td>

              <td className="border px-2 py-2 text-right">{row.stake}</td>

              <td
                className={`border px-2 py-2 text-right font-semibold ${
                  row.result.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {row.result}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
