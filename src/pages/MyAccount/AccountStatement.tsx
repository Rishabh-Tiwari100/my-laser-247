import PageHeader from './components/PageHeader';
import DateFilter from './components/DateFilter';
import StatementTable from './components/StatementTable';

export default function AccountStatement() {
  return (
    <div className="bg-[#efefef]">
      <PageHeader title="Account Statement" />
      <DateFilter />
      <div className="mt-5">
        <StatementTable />
      </div>
    </div>
  );
}
