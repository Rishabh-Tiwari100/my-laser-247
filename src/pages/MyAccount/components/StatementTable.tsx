const rows = [
  {
    date: '',
    deposit: '--',
    withdraw: '--',
    balance: '0.00',
    remarks: 'Opening balance',
  },
];

export default function StatementTable() {
  return (
    <div className="overflow-hidden border border-[#8ca1b4] bg-white">
      <table className="w-full border-collapse text-[13px]">
        <thead>
          <tr className="h-[32px] border-b border-[#8ca1b4] bg-[#d8d8d8] font-bold text-[#203548]">
            <th className="px-3 text-left">Date/Time</th>

            <th className="text-center">Deposit</th>

            <th className="text-center">Withdraw</th>

            <th className="text-center">Balance</th>

            <th className="pr-3 text-right">Remarks</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="h-[31px] border-b border-[#e2e2e2]">
              <td className="px-3">{row.date}</td>

              <td className="text-center text-[#6b8f38]">{row.deposit}</td>

              <td className="text-center text-[#b63d3d]">{row.withdraw}</td>

              <td className="text-center">{row.balance}</td>

              <td className="pr-3 text-right">{row.remarks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
