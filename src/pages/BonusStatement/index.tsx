import { FormEvent, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import DataTable, { Column } from '@/components/common/DataTable';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useGetBonusApplicantsListQuery } from '@/store/api/bonusApi';
import { BonusApplicantInstallment, BonusApplicantItem } from '@/types/bonus';
import { formatNumber } from '@/utils';
import { cn } from '@/lib/utils';

type BonusFilterState = {
  category: '' | 'JoiningBonus' | 'ReferralBonus' | 'DepositBonus';
  fromDate: string;
  toDate: string;
  search: string;
};

type BonusApplicantCategory = BonusFilterState['category'];

const formatDateTimeInput = (date: dayjs.Dayjs) => date.format('YYYY-MM-DDTHH:mm');

const getTimezone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata';
  } catch {
    return 'Asia/Kolkata';
  }
};

const toApiDate = (value: string, boundary: 'start' | 'end') => {
  if (!value) return undefined;
  const parsedDate = dayjs(value);
  return (
    boundary === 'start' ? parsedDate.startOf('minute') : parsedDate.endOf('minute')
  ).toISOString();
};

const getInstallmentNumber = (installment: BonusApplicantInstallment, index: number) =>
  installment.installmentNo ??
  installment.installmentNumber ??
  installment.installment ??
  installment.serialNo ??
  index + 1;

const getInstallmentAmount = (installment: BonusApplicantInstallment) =>
  installment.amount ?? installment.installmentAmount ?? installment.bonusAmount ?? 0;

const getCumulativeInstallmentTurnover = (
  totalTurnoverRequired: string,
  installmentsCount: number,
  index: number
) => {
  if (!installmentsCount) return 0;

  const perInstallmentTurnover = Number(totalTurnoverRequired || 0) / installmentsCount;
  return perInstallmentTurnover * (index + 1);
};

const getInstallmentReleaseDate = (installment: BonusApplicantInstallment) =>
  installment.releaseDate ??
  installment.releasedAt ??
  installment.releaseAt ??
  installment.claimedAt ??
  '';

const getInstallmentStatus = (installment: BonusApplicantInstallment) =>
  String(installment.status ?? installment.releaseStatus ?? 'Pending').toUpperCase();

const InstallmentStatusBadge = ({ status }: { status: string }) => {
  const isClaimed = ['CLAIMED', 'COMPLETED', 'APPROVED', 'RELEASED'].includes(status);
  const isPending = status === 'PENDING' || status === 'ACTIVE';

  return (
    <span
      className={cn(
        'inline-flex min-w-[82px] items-center justify-center rounded-full px-3 py-1 text-[11px] font-bold',
        isClaimed && 'bg-sky-100 text-sky-700',
        isPending && 'border border-primary-theme/20 bg-primary-theme/10 text-primary-theme',
        !isClaimed && !isPending && 'bg-red-50 text-red-600'
      )}
    >
      {status}
    </span>
  );
};

const InstallmentsModal = ({
  applicant,
  onOpenChange,
}: {
  applicant: BonusApplicantItem | null;
  onOpenChange: (open: boolean) => void;
}) => {
  const installments = applicant?.installments ?? [];
  const totalTurnoverRequired = applicant?.turnoverRequired ?? '0';

  return (
    <Dialog open={Boolean(applicant)} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[86vh] w-[calc(100vw-24px)] max-w-3xl gap-0 overflow-hidden rounded-md border border-primary-theme/30 bg-white p-0 text-black shadow-xl">
        <DialogHeader className="border-b border-primary-theme/30 bg-primary-theme px-4 py-3 text-left">
          <DialogTitle className="text-base font-bold text-white">Installments</DialogTitle>
        </DialogHeader>

        <div className="max-h-[72vh] space-y-3 overflow-y-auto p-3">
          {installments.length > 0 ? (
            installments.map((installment, index) => {
              const releaseDate = getInstallmentReleaseDate(installment);
              const status = getInstallmentStatus(installment);

              return (
                <div
                  key={installment.id ?? index}
                  className="rounded-md border border-primary-theme/20 bg-white p-3 shadow-sm"
                >
                  <div className="grid grid-cols-2 gap-x-3 gap-y-4 text-xs sm:grid-cols-4">
                    <div>
                      <div className="text-[11px] font-medium text-gray-600">Installment No</div>
                      <div className="mt-1 text-sm font-bold text-black">
                        {getInstallmentNumber(installment, index)}
                      </div>
                    </div>

                    <div>
                      <div className="text-[11px] font-medium text-gray-600">Amount</div>
                      <div className="mt-1 text-sm font-bold text-black">
                        {formatNumber(getInstallmentAmount(installment))}
                      </div>
                    </div>

                    <div>
                      <div className="text-[11px] font-medium text-gray-600">
                        Total Turnover Required
                      </div>
                      <div className="mt-1 text-sm font-bold text-black">
                        {formatNumber(
                          getCumulativeInstallmentTurnover(
                            totalTurnoverRequired,
                            installments.length,
                            index
                          )
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="text-[11px] font-medium text-gray-600">Status</div>
                      <div className="mt-1">
                        <InstallmentStatusBadge status={status} />
                      </div>
                    </div>

                    <div className="col-span-2 sm:col-span-4">
                      <div className="text-[11px] font-medium text-gray-600">Release Date</div>
                      <div className="mt-1 text-sm font-bold text-black">
                        {releaseDate ? dayjs(releaseDate).format('DD/MM/YYYY hh:mm A') : '-'}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="rounded-md border border-dashed border-gray-300 px-4 py-8 text-center text-sm text-gray-500">
              No installments found
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

function BonusStatement() {
  const userId = useSelector((state: RootState) => state.user.profile?.id);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [filters, setFilters] = useState<BonusFilterState>({
    category: '',
    fromDate: formatDateTimeInput(dayjs().subtract(25, 'day').startOf('day')),
    toDate: formatDateTimeInput(dayjs().endOf('day')),
    search: '',
  });
  const [appliedFilters, setAppliedFilters] = useState(filters);
  const [selectedApplicant, setSelectedApplicant] = useState<BonusApplicantItem | null>(null);

  const queryArgs = useMemo(
    () => ({
      page,
      limit,
      platformId: 1,
      userId,
      category: appliedFilters.category || undefined,
      fromDate: toApiDate(appliedFilters.fromDate, 'start'),
      toDate: toApiDate(appliedFilters.toDate, 'end'),
      search: appliedFilters.search.trim() || undefined,
      timezone: getTimezone(),
      isExport: true,
    }),
    [appliedFilters, limit, page, userId]
  );

  const { data, isFetching } = useGetBonusApplicantsListQuery(queryArgs, { skip: !userId });
  const applicants = data?.bonusApplicants ?? [];
  const totalItems = data?.pagination?.totalItems ?? 0;
  const totalPages = Math.max(
    1,
    data?.pagination?.totalPages ?? (Math.ceil(totalItems / limit) || 1)
  );
  const startItem = totalItems === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, totalItems);

  const applyFilters = (event?: FormEvent) => {
    event?.preventDefault();
    setPage(1);
    setAppliedFilters(filters);
  };

  const resetFilters = () => {
    const nextFilters: BonusFilterState = {
      category: '',
      fromDate: '',
      toDate: '',
      search: '',
    };
    setFilters(nextFilters);
    setAppliedFilters(nextFilters);
    setPage(1);
  };

  const columns: Column<BonusApplicantItem>[] = [
    {
      key: 'serialNo',
      label: '#',
      className: 'w-10 text-left',
      render: (_value, _row, index) => (page - 1) * limit + index + 1,
    },
    {
      key: 'bonus',
      label: 'Bonus Name',
      className: 'min-w-[160px]',
      render: (_value, row) => (
        <div className="leading-tight">
          <div className="font-semibold text-black">{row.bonus?.name || '-'}</div>
          <div className="text-[10px] text-gray-500">
            {dayjs(row.createdAt).format('DD/MM/YYYY')}
          </div>
        </div>
      ),
    },
    { key: 'bonusId', label: 'Bonus ID' },
    {
      key: 'bonus',
      label: 'Category',
      render: (_value, row) => row.bonus?.category || '-',
    },
    {
      key: 'awardedAmount',
      label: 'Awarded Amount',
      className: 'text-right',
      headerClassName: 'text-right',
      render: (value) => <span className="font-semibold">{formatNumber(value)}</span>,
    },
    {
      key: 'turnover',
      label: 'Turnover (Completed / Required)',
      className: 'text-right min-w-[190px]',
      headerClassName: 'text-right',
      render: (_value, row) =>
        `${formatNumber(row.turnoverCompleted)} / ${formatNumber(row.turnoverRequired)}`,
    },
    {
      key: 'installments',
      label: 'Installments',
      className: 'text-center',
      headerClassName: 'text-center',
      render: (_value, row) => (
        <button
          type="button"
          onClick={() => setSelectedApplicant(row)}
          className="inline-flex h-6 min-w-8 items-center justify-center rounded-sm bg-primary-theme px-2 text-xs font-bold text-white transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-primary-theme focus:ring-offset-1"
          aria-label={`View installments for ${row.bonus?.name || 'bonus'}`}
        >
          {row.bonus?.installments ?? row.installments?.length ?? 0}
        </button>
      ),
    },
    {
      key: 'awardedAt',
      label: 'Awarded At',
      render: (value) => (value ? dayjs(value).format('D/M/YYYY') : '-'),
    },
    {
      key: 'expireAt',
      label: 'Expire At',
      render: (value) => (value ? dayjs(value).format('D/M/YYYY') : '-'),
    },
    {
      key: 'status',
      label: 'Status',
      className: 'text-center',
      headerClassName: 'text-center',
      render: (value) => {
        const status = String(value || '-').toUpperCase();
        const isPositive = ['APPROVED', 'COMPLETED', 'CLAIMED', 'ACTIVE'].includes(status);
        const isPending = status === 'PENDING';
        return (
          <span
            className={cn(
              'inline-flex min-w-[76px] items-center justify-center rounded-sm px-2 py-1 text-[11px] font-bold',
              isPositive && 'bg-[#dff3ff] text-[#075985]',
              isPending && 'border border-primary-theme/20 bg-primary-theme/10 text-primary-theme',
              !isPositive && !isPending && 'bg-red-50 text-red-600'
            )}
          >
            {status}
          </span>
        );
      },
    },
  ];

  return (
    <div className="p-2 pb-4 md:p-3">
      <section className="overflow-hidden rounded-sm border border-[#cfd7dc] bg-white shadow-md shadow-black/10">
        <div className="bg-primary-theme px-3 py-2 text-sm font-bold text-white">
          Bonus Statement
        </div>

        <form onSubmit={applyFilters} className="space-y-3 px-2 py-2.5">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(170px,255px)_minmax(180px,255px)_minmax(180px,255px)_auto_auto] md:items-center">
            <select
              value={filters.category}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  category: event.target.value as BonusApplicantCategory,
                }))
              }
              className="h-8 rounded border border-[#d5d5d5] bg-white px-3 text-xs text-black outline-none focus:border-primary-theme focus:ring-1 focus:ring-primary-theme"
            >
              <option value="">ALL</option>
              <option value="DepositBonus">DepositBonus</option>
              <option value="JoiningBonus">JoiningBonus</option>
              <option value="ReferralBonus">ReferralBonus</option>
            </select>

            <input
              type="datetime-local"
              value={filters.fromDate}
              onChange={(event) =>
                setFilters((current) => ({ ...current, fromDate: event.target.value }))
              }
              className="h-8 rounded border border-[#d5d5d5] bg-white px-3 text-xs text-black outline-none focus:border-primary-theme focus:ring-1 focus:ring-primary-theme"
            />

            <input
              type="datetime-local"
              value={filters.toDate}
              onChange={(event) =>
                setFilters((current) => ({ ...current, toDate: event.target.value }))
              }
              className="h-8 rounded border border-[#d5d5d5] bg-white px-3 text-xs text-black outline-none focus:border-primary-theme focus:ring-1 focus:ring-primary-theme"
            />

            <button
              type="submit"
              className="h-8 rounded-md border border-[#172732] bg-primary-theme px-7 text-xs font-semibold text-white shadow-inner transition hover:brightness-110"
            >
              Go
            </button>

            <button
              type="button"
              onClick={resetFilters}
              className="h-8 rounded-md border border-[#172732] bg-primary-theme px-7 text-xs font-semibold text-white shadow-inner transition hover:brightness-110"
            >
              Reset
            </button>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <input
              type="search"
              value={filters.search}
              onChange={(event) =>
                setFilters((current) => ({ ...current, search: event.target.value }))
              }
              placeholder="Search Bonus"
              className="h-8 w-full rounded border border-[#d5d5d5] bg-white px-2 text-xs outline-none placeholder:text-gray-400 focus:border-primary-theme focus:ring-1 focus:ring-primary-theme md:w-40"
            />

            <label className="flex items-center gap-2 text-xs text-black md:ml-auto">
              Entries
              <select
                value={limit}
                onChange={(event) => {
                  setLimit(Number(event.target.value));
                  setPage(1);
                }}
                className="h-8 rounded border border-gray-300 bg-gray-100 px-2 outline-none focus:ring-1 focus:ring-primary-theme"
              >
                {[10, 25, 50, 100].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              Show
            </label>
          </div>
        </form>

        <div className="px-2">
          <DataTable
            columns={columns}
            data={applicants}
            isLoading={isFetching}
            rowKey={(row) => row.id}
            defaultPageSize={limit}
            noDataMessage={
              !userId ? 'Login required to view bonus statements' : 'No bonus statements found'
            }
            className="rounded-none border-[#d5d5d5]"
            tableClassName="min-w-[1180px] text-xs"
            theadClassName="bg-primary-theme"
            headerCellClassName="border-[#304451] py-2 text-white"
            rowBaseClassName="border-l-0 border-b border-gray-200 bg-white hover:bg-[#f5f7f8]"
            cellBaseClassName="border-l border-gray-200 py-2 text-black"
            skeletonCellClassName="py-2"
          />
        </div>

        <div className="flex flex-col gap-3 px-2 py-3 text-xs text-black md:flex-row md:items-center md:justify-between">
          <div>
            Showing {startItem} to {endItem} of {totalItems} Entries
            {isFetching && <Loader2 className="ml-2 inline h-3.5 w-3.5 animate-spin" />}
          </div>

          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page <= 1}
              className="flex h-8 w-8 items-center justify-center border border-primary-theme/30 bg-gray-100 text-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="flex h-8 min-w-8 items-center justify-center bg-primary-theme px-3 font-bold text-white">
              {page}
            </span>
            <button
              type="button"
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              disabled={page >= totalPages}
              className="flex h-8 w-8 items-center justify-center border border-primary-theme/30 bg-gray-100 text-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      <InstallmentsModal
        applicant={selectedApplicant}
        onOpenChange={(open) => {
          if (!open) setSelectedApplicant(null);
        }}
      />
    </div>
  );
}

export default BonusStatement;
