import BalanceTable from './BalanceTable';
import ReportHeader from './ReportHeader';
import ReportSection from './ReportSection';

export default function BalanceOverview() {
  return (
    <div className="space-y-5">
      <ReportHeader title="Balance Overview" />

      <ReportSection title="Account Balance">
        <BalanceTable />
      </ReportSection>

      <ReportSection title="Summary">
        <div className="grid grid-cols-4">
          <div className="border-r p-5">
            <div className="text-[12px] text-gray-500">Sports</div>

            <div className="mt-2 text-[22px] font-bold">0.00</div>
          </div>

          <div className="border-r p-5">
            <div className="text-[12px] text-gray-500">Casino</div>

            <div className="mt-2 text-[22px] font-bold">0.00</div>
          </div>

          <div className="border-r p-5">
            <div className="text-[12px] text-gray-500">Exposure</div>

            <div className="mt-2 text-[22px] font-bold text-red-600">0.00</div>
          </div>

          <div className="p-5">
            <div className="text-[12px] text-gray-500">Net Balance</div>

            <div className="mt-2 text-[22px] font-bold text-green-700">0.00</div>
          </div>
        </div>
      </ReportSection>
    </div>
  );
}
