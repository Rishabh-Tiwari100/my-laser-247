import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import LoaderTwo from '@/components/common/LoaderTwo';
import { useCreatePaymentGatewayRedirectMutation } from '@/store/api/accountApi';
import { Icons } from '@/utils/icons';
import type { PaymentGatewayOption, PaymentGatewayRequestType } from '@/types/account';
import DepositWithdrawTransactions from './DepositWithdrawTransactions';

interface GatewayRedirectAmountFormProps {
  gateway: PaymentGatewayOption;
  type: PaymentGatewayRequestType;
  title: string;
  submitLabel: string;
  quickAmounts?: number[];
  availableBalance?: string;
  onEditStake?: () => void;
  onBack?: () => void;
}

const getRedirectUrl = (response: any) =>
  response?.data?.url ||
  response?.data?.redirectUrl ||
  response?.data?.paymentUrl ||
  response?.url ||
  response?.redirectUrl ||
  response?.paymentUrl ||
  '';

function GatewayRedirectAmountForm({
  gateway,
  type,
  title,
  submitLabel,
  quickAmounts = [100, 200, 500, 1000],
  availableBalance,
  onEditStake,
  onBack,
}: GatewayRedirectAmountFormProps) {
  const [amount, setAmount] = useState('');
  const [amountError, setAmountError] = useState('');
  const amountInputRef = useRef<HTMLInputElement>(null);
  const [createRedirect, { isLoading }] = useCreatePaymentGatewayRedirectMutation();

  const submitRedirectRequest = async () => {
    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setAmountError('Enter a valid amount.');
      amountInputRef.current?.focus();
      return;
    }

    try {
      const response = await createRedirect({
        type,
        amount: numericAmount,
        gatewayId: gateway.id,
        code: gateway.code,
      }).unwrap();
      const redirectUrl = getRedirectUrl(response);

      if (!redirectUrl) {
        toast.error(response.message || 'Redirect URL not received.', {
          id: `${type}-gateway-redirect`,
        });
        return;
      }

      window.location.href = redirectUrl;
    } catch (error: any) {
      toast.error(error?.data?.message || 'Payment gateway is currently unavailable.', {
        id: `${type}-gateway-redirect`,
      });
    }
  };

  return (
    <main className="mx-auto w-full max-w-[760px] text-[12px] text-black">
      {onBack && (
        <div className="mb-[8px] flex min-h-[38px] items-start justify-between border-b border-dashed border-[#6f7880] px-[7px] pb-[9px]">
          <button
            type="button"
            onClick={onBack}
            className="flex h-[27px] items-center justify-center rounded-[3px] bg-[#243a48] px-[11px] text-[12px] font-bold text-white hover:bg-[#162c3a]"
          >
            ‹ BACK
          </button>
        </div>
      )}
      <section className="rounded-[5px] border border-[#999] bg-white p-[8px]">
        <div className="mb-[7px] flex items-center justify-between gap-[12px] text-[13px]">
          <div className="min-w-0">
            <p className="shrink-0 font-semibold">{title}</p>
            <p className="mt-[2px] text-[11px] font-bold uppercase text-[#5f7183]">
              {gateway.type} Payment
            </p>
          </div>
          {availableBalance && (
            <p className="min-w-0 flex-1 truncate text-right font-normal">
              Available Balance: <span className="font-semibold">{availableBalance}</span>
            </p>
          )}
        </div>
        <div className="mb-[7px] rounded-[4px] bg-[#f4f7f9] px-3 py-2 font-semibold">
          {gateway.name}
        </div>
        <input
          ref={amountInputRef}
          inputMode="numeric"
          maxLength={8}
          value={amount}
          onChange={(event) => {
            const value = event.target.value.replace(/\D+/g, '');
            setAmount(value);
            setAmountError('');
          }}
          placeholder={`Enter ${title} Amount`}
          className="h-[45px] w-full rounded-[5px] border border-[#999] px-[13px] text-sm outline-none placeholder:text-[#5f7183] focus:border-[#243a48]"
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
        <div className={`mt-[18px] grid gap-[8px] ${onEditStake ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {onEditStake && (
            <button
              type="button"
              onClick={onEditStake}
              className="flex h-[38px] items-center justify-center gap-[7px] rounded-[4px] bg-[#12b6cf] text-sm text-white hover:bg-[#0ca6bd]"
            >
              <Icons.edit className="h-4 w-4" /> Edit Stake
            </button>
          )}
          <button
            type="button"
            onClick={submitRedirectRequest}
            disabled={isLoading}
            className="flex h-[38px] items-center justify-center rounded-[2px] bg-[#7fc681] text-sm uppercase text-white hover:brightness-95 disabled:opacity-60"
          >
            {isLoading ? <LoaderTwo text="Submitting..." /> : submitLabel}
          </button>
        </div>
      </section>
      {type === 'deposit' && (gateway.type === 'Upi' || gateway.type === 'Crypto') && (
        <DepositWithdrawTransactions
          ariaLabel="Deposit transactions"
          filterAriaLabel="Filter deposit gateway transactions by status"
          heading="Payment Gateway Transactions"
          source="payment-gateway"
          transactionType="Credit"
          paymentGatewayId={gateway.id}
          sectionClassName="mt-[7px] overflow-hidden rounded-[5px] bg-white px-[8px] pb-[8px] pt-[5px]"
          headingClassName="mb-[5px] text-[17px] font-bold leading-[19px]"
        />
      )}
    </main>
  );
}

export default GatewayRedirectAmountForm;
