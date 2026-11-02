type Row = {
  label: string;
  amount: string;
};

const rows: Row[] = [
  {
    label: 'Available Balance',
    amount: '0.00',
  },
  {
    label: 'Exposure',
    amount: '0.00',
  },
  {
    label: 'Credit Limit',
    amount: '0.00',
  },
  {
    label: 'Total Balance',
    amount: '0.00',
  },
];

export default function BalanceTable() {
  return (
    <table className="w-full border-collapse text-[13px]">
      <thead>
        <tr className="bg-[#7990a3] text-white">
          <th className="border border-[#8ea2b5] px-3 py-2 text-left">Description</th>

          <th className="border border-[#8ea2b5] px-3 py-2 text-right">Amount</th>
        </tr>
      </thead>

      <tbody>
        {rows.map((row) => (
          <tr key={row.label}>
            <td className="border border-[#d8d8d8] bg-white px-3 py-2">{row.label}</td>

            <td className="border border-[#d8d8d8] bg-white px-3 py-2 text-right font-semibold">
              {row.amount}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
