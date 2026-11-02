import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Upi from './components/PaymentMethod/Upi';
import DepositWithdrawTransactions from '../components/DepositWithdrawTransactions';
import {
  useGetActivePaymentGatewaysQuery,
  useGetDepositAccountsQuery,
} from '@/store/api/accountApi';
import { useGetStakeSetQuery, useUpdateStakeSetMutation } from '@/store/api/stakesApi';
import { Icons } from '@/utils/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import EditStakeModal from './components/EditStakeModal';
import PaymentGatewayModal from '../components/PaymentGatewayModal';
import GatewayRedirectAmountForm from '../components/GatewayRedirectAmountForm';
import type { PaymentGatewayOption } from '@/types/account';

const rules = [
  'Deposit money only in the below available accounts to get the fastest credits and avoid possible delays.',
  'Deposits made 45 minutes after the account removal from the site are valid & will be added to their wallets.',
  'Site is not responsible for money deposited to Old, Inactive or Closed accounts.',
  'After deposit, add your UTR and amount to receive balance.',
  'NEFT receiving time varies from 40 minutes to 2 hours.',
  'In case of account modification: payment valid for 1 hour after changing account details in deposit page.',
];

const defaultQuickAmounts = [100, 200, 500, 1000];
type DepositTransactionSource = 'manual' | 'payment-gateway';

function Deposit() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const selectedMethod = params.get('method') === 'upi' ? 'upi' : null;
  const [amount, setAmount] = useState('');
  const [amountError, setAmountError] = useState('');
  const [quickAmounts, setQuickAmounts] = useState(defaultQuickAmounts);
  const [editStakeModalOpen, setEditStakeModalOpen] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState<PaymentGatewayOption | null>(null);
  const [isGatewayModalDismissed, setIsGatewayModalDismissed] = useState(true);
  const [transactionSource, setTransactionSource] = useState<DepositTransactionSource>('manual');
  const amountInputRef = useRef<HTMLInputElement>(null);
  const closeEditStakeModal = useCallback(() => setEditStakeModalOpen(false), []);
  const { data: depositAccounts, isFetching: isAccountsFetching } = useGetDepositAccountsQuery();
  const { data: activeGatewaysResponse, isFetching: isGatewaysFetching } =
    useGetActivePaymentGatewaysQuery({ type: 'deposit' });
  const { data: depositStakeSet } = useGetStakeSetQuery({ type: 'Deposit' });
  const [updateStakeSet, { isLoading: isSavingStakes }] = useUpdateStakeSetMutation();
  const upiAccounts = depositAccounts?.Upi ?? depositAccounts?.upi ?? [];
  const bankAccounts =
    depositAccounts?.Bank ??
    depositAccounts?.Banks ??
    depositAccounts?.bank ??
    depositAccounts?.banks ??
    [];

  useEffect(() => {
    if (!depositStakeSet?.stakeSet?.length) return;

    const normalizedQuickAmounts = depositStakeSet.stakeSet
      .map((stake) => Number(stake.value))
      .filter((stake) => Number.isFinite(stake) && stake > 0);

    if (normalizedQuickAmounts.length > 0) {
      setQuickAmounts(normalizedQuickAmounts);
    }
  }, [depositStakeSet]);

  const limits = useMemo(() => {
    const minimums = [
      ...upiAccounts.map((account) => Number(account.minAmount)),
      ...bankAccounts.map((account) => Number(account.minDepositAmount)),
    ].filter((value) => Number.isFinite(value) && value > 0);
    const maximums = [
      ...upiAccounts.map((account) => Number(account.maxAmount)),
      ...bankAccounts.map((account) => Number(account.maxDepositAmount)),
    ].filter((value) => Number.isFinite(value) && value > 0);

    return {
      min: minimums.length > 0 ? Math.min(...minimums) : 0,
      max: maximums.length > 0 ? Math.max(...maximums) : 0,
    };
  }, [bankAccounts, upiAccounts]);
  const hasDepositAccount = upiAccounts.length > 0 || bankAccounts.length > 0;
  const activeGateways = useMemo(
    () => activeGatewaysResponse?.data?.filter((gateway) => gateway.status === 'Active') ?? [],
    [activeGatewaysResponse]
  );
  const hasNoActiveGateways = !selectedMethod && !isGatewaysFetching && activeGateways.length === 0;
  const shouldRequireGatewaySelection = !selectedMethod && activeGateways.length > 1;
  const effectiveGateway =
    selectedGateway ?? (activeGateways.length === 1 ? activeGateways[0] : null);
  const isRedirectGateway = effectiveGateway?.type === 'Upi' || effectiveGateway?.type === 'Crypto';
  const shouldShowGatewayModal =
    shouldRequireGatewaySelection &&
    !selectedGateway &&
    !isGatewayModalDismissed &&
    !isGatewaysFetching;
  const shouldShowPaymentForm =
    !selectedMethod &&
    !isGatewaysFetching &&
    Boolean(effectiveGateway) &&
    (!shouldRequireGatewaySelection || Boolean(selectedGateway));
  const shouldShowGatewaySelectionPrompt =
    !selectedMethod && !isGatewaysFetching && shouldRequireGatewaySelection && !selectedGateway;
  const renderDepositTransactionsTable = (showSourceFilter = true) => {
    const effectiveTransactionSource = showSourceFilter ? transactionSource : 'manual';

    return (
      <section className="mt-[7px] overflow-hidden rounded-[5px] bg-white px-[8px] pb-[8px] pt-[5px]">
        <div className="mb-[7px] flex flex-col gap-[6px] sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-[17px] font-bold leading-[19px]">
            {effectiveTransactionSource === 'manual'
              ? 'Manual Transactions'
              : 'Payment Gateway Transactions'}
          </h2>
          {showSourceFilter && (
            <select
              value={transactionSource}
              onChange={(event) =>
                setTransactionSource(event.target.value as DepositTransactionSource)
              }
              className="h-[33px] w-full rounded-[4px] border border-[#999] bg-white px-[12px] text-[14px] outline-none focus:border-[#243a48] sm:w-[210px]"
              aria-label="Filter deposit transactions by payment source"
            >
              <option value="manual">Manual</option>
              <option value="payment-gateway">Payment Gateway</option>
            </select>
          )}
        </div>
        <DepositWithdrawTransactions
          key={effectiveTransactionSource}
          ariaLabel="Deposit transactions"
          filterAriaLabel={
            effectiveTransactionSource === 'manual'
              ? 'Filter manual deposit and withdrawal transactions by status'
              : 'Filter deposit gateway transactions by status'
          }
          heading=""
          source={effectiveTransactionSource}
          transactionType={effectiveTransactionSource === 'payment-gateway' ? 'Credit' : undefined}
          sectionClassName="overflow-hidden"
          headingClassName="hidden"
        />
      </section>
    );
  };

  const proceedToDeposit = () => {
    const numericAmount = Number(amount);

    if (shouldRequireGatewaySelection && !selectedGateway) {
      setIsGatewayModalDismissed(false);
      return;
    }

    if (!isAccountsFetching && !hasDepositAccount) {
      setAmountError('Payment method is not added. Please contact support.');
      return;
    }

    if (
      !Number.isFinite(numericAmount) ||
      numericAmount < limits.min ||
      numericAmount > limits.max
    ) {
      setAmountError(`Enter an amount between ${limits.min} and ${limits.max}.`);
      amountInputRef.current?.focus();
      return;
    }

    navigate(`/deposit?method=upi&amount=${numericAmount}`);
  };

  const handleDepositBack = () => {
    if (shouldRequireGatewaySelection && selectedGateway) {
      setSelectedGateway(null);
      setIsGatewayModalDismissed(true);
      return;
    }

    navigate(-1);
  };

  const handleStakeSave = async (updatedStakes: number[]) => {
    const payload = updatedStakes.map((stake, index) => ({
      label: depositStakeSet?.stakeSet?.[index]?.label ?? `${index + 1}`,
      value: stake,
    }));

    try {
      const response = await updateStakeSet({
        data: payload,
        type: 'Deposit',
      }).unwrap();

      setQuickAmounts(updatedStakes);
      toast.success(response.message || 'Stake values saved', { id: 'deposit-stake' });
      closeEditStakeModal();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to save stake values', {
        id: 'deposit-stake',
      });
    }
  };

  return (
    <div
      className={`font-[Arial,Helvetica,sans-serif] md:min-h-[calc(100vh-151px)] ${
        selectedMethod === 'upi'
          ? 'px-[3px] pb-[28px] pt-[3px] md:px-0'
          : 'px-[3px] pb-[28px] pt-[9px] md:px-0'
      }`}
    >
      {shouldShowPaymentForm && isRedirectGateway && effectiveGateway && (
        <GatewayRedirectAmountForm
          gateway={effectiveGateway}
          type="deposit"
          title="Deposit"
          submitLabel="Deposit"
          quickAmounts={quickAmounts}
          onEditStake={() => setEditStakeModalOpen(true)}
          onBack={() => {
            setSelectedGateway(null);
            setIsGatewayModalDismissed(true);
          }}
        />
      )}

      {hasNoActiveGateways && (
        <main className="mx-auto w-full max-w-[760px] text-[12px] text-black">
          <div className="mb-[8px] flex min-h-[38px] items-start justify-between border-b border-dashed border-[#6f7880] px-[7px] pb-[9px]">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex h-[27px] items-center justify-center rounded-[3px] bg-[#243a48] px-[11px] text-[12px] font-bold text-white hover:bg-[#162c3a]"
            >
              ‹ BACK
            </button>
          </div>

          <section className="rounded-[5px] border border-[#999] bg-white p-[8px]">
            <p className="text-[13px] font-semibold">No active payment method is available.</p>
            <p className="mt-[4px] text-[12px] text-[#5f7183]">Please contact support.</p>
          </section>

          {renderDepositTransactionsTable()}
        </main>
      )}

      {shouldShowGatewaySelectionPrompt && (
        <main className="mx-auto w-full max-w-[760px] text-[12px] text-black">
          <div className="mb-[8px] flex min-h-[38px] items-start justify-between border-b border-dashed border-[#6f7880] px-[7px] pb-[9px]">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex h-[27px] items-center justify-center rounded-[3px] bg-[#243a48] px-[11px] text-[12px] font-bold text-white hover:bg-[#162c3a]"
            >
              ‹ BACK
            </button>
          </div>

          <section className="rounded-[5px] border border-[#999] bg-white p-[8px]">
            <p className="mb-[8px] text-[13px] font-semibold">Deposit</p>
            <button
              type="button"
              onClick={() => setIsGatewayModalDismissed(false)}
              className="flex h-[38px] w-full items-center justify-center rounded-[4px] bg-[#243a48] text-[14px] font-bold text-white hover:bg-[#162c3a]"
            >
              Select Payment Method
            </button>
          </section>

          {renderDepositTransactionsTable()}
        </main>
      )}

      {shouldShowPaymentForm && !isRedirectGateway && (
        <main className="mx-auto w-full max-w-[760px] text-[12px] text-black">
          <div className="mb-[8px] flex min-h-[38px] items-start justify-between border-b border-dashed border-[#6f7880] px-[7px] pb-[9px]">
            <button
              type="button"
              onClick={handleDepositBack}
              className="flex h-[27px] items-center justify-center rounded-[3px] bg-[#243a48] px-[11px] text-[12px] font-bold text-white hover:bg-[#162c3a]"
            >
              ‹ BACK
            </button>
            <span className="flex h-[27px] items-center rounded-[3px] bg-[#243a48] px-[11px] text-[12px] font-bold text-white">
              {hasDepositAccount ? `MIN: ${limits.min} | MAX: ${limits.max}` : 'NO PAYMENT METHOD'}
            </span>
          </div>

          <section className="rounded-[5px] border border-[#999] bg-white p-[8px]">
            {effectiveGateway && (
              <div className="mb-[7px] rounded-[4px] bg-[#f4f7f9] px-3 py-2">
                <p className="text-[11px] font-bold uppercase text-[#5f7183]">
                  {effectiveGateway.type} Payment
                </p>
                <p className="mt-[2px] text-[13px] font-semibold">{effectiveGateway.name}</p>
              </div>
            )}
            <label
              htmlFor="deposit-amount"
              className="mb-[4px] block text-[12px] font-bold leading-[17px]"
            >
              Deposit
            </label>
            <input
              ref={amountInputRef}
              id="deposit-amount"
              inputMode="decimal"
              value={amount}
              onChange={(event) => {
                const value = event.target.value;
                if (/^\d*$/.test(value)) {
                  setAmount(value);
                  setAmountError('');
                }
              }}
              placeholder="Enter Deposit Amount"
              className="h-[38px] w-full rounded-[5px] border border-[#999] px-[12px] text-[14px] outline-none placeholder:text-[#667080] focus:border-[#12b6cf]"
            />
            <div className="mt-[5px] grid grid-cols-4 gap-[5px]">
              {quickAmounts.map((quickAmount, quickAmountIndex) => (
                <button
                  key={`${quickAmount}-${quickAmountIndex}`}
                  type="button"
                  onClick={() => {
                    setAmount(String(Number(amount || 0) + quickAmount));
                    setAmountError('');
                  }}
                  className="h-[38px] rounded-[5px] border border-[#243a48] text-[12px] font-bold hover:bg-[#f4f7f9]"
                >
                  +{quickAmount}
                </button>
              ))}
            </div>
            {amountError && <p className="mt-1 text-xs text-red-600">{amountError}</p>}
            <div className="mt-[10px] grid grid-cols-2 gap-[8px]">
              <button
                type="button"
                onClick={() => setEditStakeModalOpen(true)}
                className="flex h-[37px] items-center justify-center gap-[7px] rounded-[4px] bg-[#12b6cf] text-[14px] text-white hover:bg-[#0ca6bd]"
              >
                <Icons.edit className="h-4 w-4" /> Edit Stake
              </button>
              <button
                type="button"
                onClick={proceedToDeposit}
                disabled={isAccountsFetching || isGatewaysFetching}
                className="h-[37px] rounded-[4px] bg-[#7fc681] text-[14px] text-white hover:bg-[#6ab96d] disabled:cursor-wait disabled:opacity-80"
              >
                Submit
              </button>
            </div>
          </section>

          <ol className="my-[8px] list-decimal space-y-[3px] rounded-[5px] border border-[#999] bg-white py-[8px] pl-[27px] pr-[8px] text-[12px] leading-[19px]">
            {rules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ol>

          {renderDepositTransactionsTable(false)}
        </main>
      )}

      {selectedMethod === 'upi' && (
        <main className="mx-auto w-full max-w-[760px]">
          <Upi />
          {renderDepositTransactionsTable(false)}
        </main>
      )}

      <EditStakeModal
        open={editStakeModalOpen}
        isSaving={isSavingStakes}
        stakes={quickAmounts}
        onClose={closeEditStakeModal}
        onSave={handleStakeSave}
      />
      <PaymentGatewayModal
        open={shouldShowGatewayModal}
        gateways={activeGateways}
        title="Select deposit method"
        onSelect={(gateway) => {
          setSelectedGateway(gateway);
          setIsGatewayModalDismissed(false);
        }}
        onClose={() => setIsGatewayModalDismissed(true)}
      />
    </div>
  );
}
export default Deposit;
