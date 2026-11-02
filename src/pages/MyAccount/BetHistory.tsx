import PageHeader from './components/PageHeader';
import BetFilters from './components/BetFilters';
import ReportTable from './components/ReportTable';
import Pagination from './components/Pagination';
import ExportButton from './components/ExportButton';

export default function BetHistory() {
  return (
    <div className="space-y-5">
      <PageHeader title="Bet History" />

      <BetFilters />

      <div className="flex justify-end">
        <ExportButton />
      </div>

      <ReportTable />

      <Pagination />
    </div>
  );
}
