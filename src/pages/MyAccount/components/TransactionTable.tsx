const rows = [
  {
    date: '2026-06-15 08:33:50',
    transaction: '336436693',
    debit: '',
    credit: '100',
    balance: '100',
    remarks: 'Fund Transfer',
    from: 'Upline',
    to: 'Demo9',
  },
];

export default function TransactionTable() {
  return (
    <div className="overflow-hidden border border-[#8ca1b4] bg-white">
      <table className="w-full border-collapse text-[13px]">
        <thead>
          <tr className="h-[32px] border-b border-[#8ca1b4] bg-[#d8d8d8] font-bold text-[#23394f]">
            <th className="px-10 text-left">Date</th>

            <th className="text-center">Transaction</th>

            <th className="text-center">Debits</th>

            <th className="text-center">Credits</th>

            <th className="text-center">Balance</th>

            <th className="text-center">Remarks</th>

            <th className="pr-4 text-right">From / To</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr key={row.transaction} className="h-[34px] border-b border-[#e2e2e2]">
              <td className="px-10">{row.date}</td>

              <td className="text-center">{row.transaction}</td>

              <td className="text-center">{row.debit}</td>

              <td className="text-center">{row.credit}</td>

              <td className="text-center">{row.balance}</td>

              <td className="text-center">{row.remarks}</td>

              <td className="pr-4 text-right">
                <span className="text-[#666]">{row.from}</span>

                <span className="mx-1 text-[#999]">▸</span>

                <span>{row.to}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
