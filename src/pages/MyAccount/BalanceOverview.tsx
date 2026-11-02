import PageTitle from './components/PageTitle';
import SummaryPanel from './components/SummaryPanel';
import TransactionTable from './components/TransactionTable';

export default function BalanceOverview() {
  return (
    <div className="bg-[#efefef]">
      <PageTitle title="Summary" />

      <SummaryPanel />

      <div className="mt-[14px]">
        <TransactionTable />
      </div>
    </div>
  );
}
